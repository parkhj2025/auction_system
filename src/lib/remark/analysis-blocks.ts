/**
 * remark plugin — 분석 페이지 mdx 트리 구조 변환.
 *
 *  1. "## 01 물건 개요" 진입 후 첫 table → <PropertyOverviewCard> 로 wrap (단계 3-5)
 *  2. "### 시나리오 X — ..." H3 + 다음 H3/H2 까지의 자식 → <ScenarioCard title="...">
 *  3. "## 07 종합 ..." 진입 후 첫 paragraph → <ConclusionCallout>
 *  4. "### 체크포인트" 직후 ol → <CheckpointList>
 *  5. "## 면책 고지" h2 + 그 아래 모든 자식 → 폐기 (ComplianceFooter 컴포넌트로 페이지 끝에 단일 노출)
 *  6. "### 시나리오 비교 요약" H3 + 다음 H3/H2 까지의 자식 → <ScenarioComparisonHighlight>
 *     (단계 5-4-2-fix-9 Phase 3, 정리 카드 시각 강조 wrap, ScenarioCard 그룹 패턴 차용)
 *
 * 단계 3-1 baseline + 단계 3-3 데이터 어댑터 + 단계 3-5 인터랙션 + 단계 5-4-2-fix-9 정리 카드.
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
const COMPARISON_SUMMARY_RE = /^시나리오\s*비교\s*요약$/;
const CHECKPOINT_RE = /^체크포인트$/;
const CONCLUSION_H2_RE = /^07\s+종합/;
const COMPLIANCE_H2_RE = /^면책\s*고지|^면책고지|^면책$/;
const OVERVIEW_H2_RE = /^01\s+물건\s*개요/;

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
    let comparisonSummaryGroup: AnyNode | null = null;
    let inConclusion = false;
    let conclusionFirstParaSeen = false;
    let checkpointFollowing = false;
    let dropping = false;
    // 단계 3-5: "## 01 물건 개요" 진입 후 첫 table 만 PropertyOverviewCard wrap
    let inOverview = false;
    let overviewFirstTableSeen = false;

    function flushScenario() {
      if (scenarioGroup) {
        out.push(scenarioGroup);
        scenarioGroup = null;
      }
    }

    function flushComparisonSummary() {
      if (comparisonSummaryGroup) {
        out.push(comparisonSummaryGroup);
        comparisonSummaryGroup = null;
      }
    }

    for (const node of tree.children) {
      if (dropping) continue;

      // h2 — 섹션 경계
      if (node.type === "heading" && node.depth === 2) {
        flushScenario();
        flushComparisonSummary();
        const h2text = getHeadingText(node).trim();

        if (COMPLIANCE_H2_RE.test(h2text)) {
          dropping = true;
          continue;
        }

        inOverview = OVERVIEW_H2_RE.test(h2text);
        if (inOverview) overviewFirstTableSeen = false;
        inConclusion = CONCLUSION_H2_RE.test(h2text);
        if (inConclusion) conclusionFirstParaSeen = false;
        checkpointFollowing = false;
        out.push(node);
        continue;
      }

      // 01 물건 개요 진입 후 첫 table → <PropertyOverviewCard>{table}</PropertyOverviewCard>
      if (inOverview && !overviewFirstTableSeen && node.type === "table") {
        overviewFirstTableSeen = true;
        out.push(makeJsx("PropertyOverviewCard", {}, [node]));
        continue;
      }

      // h3 — 시나리오 / 체크포인트 / 시나리오 비교 요약 분기
      if (node.type === "heading" && node.depth === 3) {
        const h3text = getHeadingText(node).trim();

        if (SCENARIO_RE.test(h3text)) {
          flushScenario();
          flushComparisonSummary();
          scenarioGroup = makeJsx("ScenarioCard", { title: h3text }, []);
          continue;
        }

        if (COMPARISON_SUMMARY_RE.test(h3text)) {
          flushScenario();
          flushComparisonSummary();
          comparisonSummaryGroup = makeJsx("ScenarioComparisonHighlight", {}, [node]);
          continue;
        }

        flushScenario();
        flushComparisonSummary();

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

      // 시나리오 비교 요약 그룹 진행 중 — 비-경계 노드는 그룹에 흡수
      if (comparisonSummaryGroup) {
        comparisonSummaryGroup.children!.push(node);
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
    flushComparisonSummary();
    tree.children = out;
  };
}
