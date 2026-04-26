/**
 * remark plugin — 분석 페이지 mdx 트리 구조 변환.
 *
 *  1. "### 시나리오 X — ..." H3 + 다음 H3/H2 까지의 자식 → <ScenarioCard title="...">
 *  2. "## 07 종합 ..." 진입 후 첫 paragraph → <ConclusionCallout>
 *  3. "### 체크포인트" 직후 ol → <CheckpointList>
 *  4. "## 면책 고지" h2 + 그 아래 모든 자식 → 폐기 (ComplianceNotice 컴포넌트로 페이지 끝에 단일 노출)
 *
 * 단계 3-1 baseline. 데이터 어댑터(meta.json) 결합은 단계 3-2 이월.
 */

type AnyNode = {
  type: string;
  depth?: number;
  ordered?: boolean;
  value?: string;
  children?: AnyNode[];
  [k: string]: unknown;
};

type Tree = AnyNode & { type: "root"; children: AnyNode[] };

const SCENARIO_RE = /^시나리오\s+[A-Z](-\d+)?\s/;
const CHECKPOINT_RE = /^체크포인트$/;
const CONCLUSION_H2_RE = /^07\s+종합/;
const COMPLIANCE_H2_RE = /^면책\s*고지|^면책고지|^면책$/;

function getHeadingText(node: AnyNode): string {
  let text = "";
  function walk(n: AnyNode) {
    if (n.type === "text" && typeof n.value === "string") text += n.value;
    else if (n.children) n.children.forEach(walk);
  }
  walk(node);
  return text;
}

function makeJsx(name: string, attrs: Record<string, string>, children: AnyNode[]): AnyNode {
  return {
    type: "mdxJsxFlowElement",
    name,
    attributes: Object.entries(attrs).map(([k, v]) => ({
      type: "mdxJsxAttribute",
      name: k,
      value: v,
    })),
    children,
  } as AnyNode;
}

export function remarkAnalysisBlocks() {
  return (tree: Tree) => {
    if (!tree || tree.type !== "root" || !Array.isArray(tree.children)) return;

    const out: AnyNode[] = [];
    let scenarioGroup: AnyNode | null = null;
    let inConclusion = false;
    let conclusionFirstParaSeen = false;
    let checkpointFollowing = false;
    let dropping = false;

    function flushScenario() {
      if (scenarioGroup) {
        out.push(scenarioGroup);
        scenarioGroup = null;
      }
    }

    for (const node of tree.children) {
      if (dropping) continue;

      // h2 — 섹션 경계
      if (node.type === "heading" && node.depth === 2) {
        flushScenario();
        const h2text = getHeadingText(node).trim();

        if (COMPLIANCE_H2_RE.test(h2text)) {
          dropping = true;
          continue;
        }

        inConclusion = CONCLUSION_H2_RE.test(h2text);
        if (inConclusion) conclusionFirstParaSeen = false;
        checkpointFollowing = false;
        out.push(node);
        continue;
      }

      // h3 — 시나리오 / 체크포인트 분기
      if (node.type === "heading" && node.depth === 3) {
        const h3text = getHeadingText(node).trim();

        if (SCENARIO_RE.test(h3text)) {
          flushScenario();
          scenarioGroup = makeJsx("ScenarioCard", { title: h3text }, []);
          continue;
        }

        flushScenario();

        if (inConclusion && CHECKPOINT_RE.test(h3text)) {
          checkpointFollowing = true;
          out.push(node);
          continue;
        }

        out.push(node);
        continue;
      }

      // 시나리오 그룹 진행 중 — 비-경계 노드는 그룹에 흡수
      if (scenarioGroup) {
        scenarioGroup.children!.push(node);
        continue;
      }

      // 결론 첫 paragraph
      if (inConclusion && !conclusionFirstParaSeen && node.type === "paragraph") {
        conclusionFirstParaSeen = true;
        out.push(makeJsx("ConclusionCallout", {}, [node]));
        continue;
      }

      // 체크포인트 ol
      if (checkpointFollowing && node.type === "list" && node.ordered === true) {
        out.push(makeJsx("CheckpointList", {}, [node]));
        checkpointFollowing = false;
        continue;
      }
      checkpointFollowing = false;

      out.push(node);
    }

    flushScenario();
    tree.children = out;
  };
}
