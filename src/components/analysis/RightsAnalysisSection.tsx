"use client";

/**
 * 03 권리분석 — 단계 5-4-2 Side-by-Side Sticky + node-link + HUG morph.
 *
 * 단계 5-4-2 변경:
 *  - 단계 4-1 RightsCallout (callout 박스 2종) 폐기 → SideBySideSticky 안에 RightsNodeDiagram 배치
 *  - 좌측 narrative 4 step (말소기준 식별 → 인수 → HUG morph → 외국인 변수) + 우측 sticky node-link
 *  - 모바일 stack fallback
 *
 * case study 인용: scrollytelling Layout Pattern 1 + Animated Transition + Distill interactive node + chart-visualization network-graph.
 */
import type { RightsMeta } from "@/types/content";
import { SideBySideSticky } from "./SideBySideSticky";
import { RightsNodeDiagram } from "./RightsNodeDiagram";
import { formatKoreanWon } from "@/lib/utils";

export function RightsAnalysisSection({ rights }: { rights: RightsMeta }) {
  if (!rights) return null;

  const tenant = rights.tenants?.[0];
  const hasTenant = !!tenant;
  const tenantHasOpposingPower = tenant?.opposing_power === true;
  const tenantDeposit = tenant?.deposit ?? null;
  const isHugCase = tenant?.analysis?.includes("HUG") || tenant?.analysis?.includes("말소동의");

  // Step 구성 — 사건 특성에 따라 동적으로 (HUG 말소동의 사건 전용 4 step)
  const steps = [
    {
      id: "rights-step-0",
      body: (
        <div>
          <h3 className="text-base font-black text-[var(--color-ink-900)] sm:text-lg">
            말소기준등기 식별
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">
            {rights.basis_date} 접수된{" "}
            <span className="font-bold">{rights.basis_type}</span> 이 말소기준등기입니다. 이 등기 이후 모든 후순위 등기는 매각 시 소멸합니다.
          </p>
        </div>
      ),
    },
    ...(hasTenant
      ? [
          {
            id: "rights-step-1",
            body: (
              <div>
                <h3 className="text-base font-black text-[var(--color-ink-900)] sm:text-lg">
                  임차보증금 인수
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">
                  {tenantHasOpposingPower ? "대항력 있는 임차인" : "임차인"}{" "}
                  ({tenant!.move_in_date} 전입) 이 점유 중이며, 보증금{" "}
                  <span className="font-bold tabular-nums">
                    {tenantDeposit != null ? formatKoreanWon(tenantDeposit) : "미공개"}
                  </span>
                  은 낙찰자 인수 대상입니다.
                </p>
              </div>
            ),
          },
        ]
      : []),
    ...(isHugCase
      ? [
          {
            id: "rights-step-2",
            body: (
              <div>
                <h3 className="text-base font-black text-[var(--color-ink-900)] sm:text-lg">
                  HUG 말소동의 효과
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">
                  주택도시보증공사(HUG) 가 말소동의 확약서를 제출하면 임차보증금이 인수에서 소멸로 전환됩니다. 낙찰자의 실질 인수 부담이 0 으로 변동.
                </p>
              </div>
            ),
          },
        ]
      : []),
    ...(tenant?.analysis
      ? [
          {
            id: "rights-step-3",
            body: (
              <div>
                <h3 className="text-base font-black text-[var(--color-ink-900)] sm:text-lg">
                  점유 변수 검토
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">
                  {tenant.analysis}
                </p>
              </div>
            ),
          },
        ]
      : []),
  ];

  // Step 부족 시 (rights 데이터 부재) 단순 callout fallback — 이건 미발생 가정 (mdx-components 가 rights 있을 때만 호출)
  if (steps.length === 0) return null;

  return (
    <SideBySideSticky
      steps={steps}
      graphic={(activeIdx) => (
        <RightsNodeDiagram rights={rights} activeIdx={activeIdx} />
      )}
      mobileGraphicPosition="top"
    />
  );
}
