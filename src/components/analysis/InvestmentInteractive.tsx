"use client";

/**
 * 05 시나리오 인터랙티브 wrapper — 단계 5-4-2-fix-9 ScenarioCarousel 폐기 갱신.
 *
 * 단일 source state:
 *  - activeKey + biddingPercent 상위 wrapper 에서 관리
 *  - ScenarioComparisonBox 단독 동기화
 *  - 슬라이더 drag → 비교 표 재계산
 *
 * 순서 (단계 5-4-2-fix-9):
 *  - ScenarioComparisonBox (비교 표 + slider)
 *  - 다음 mdx 본문: ### 실질 → ### 자금 → ### 시나리오 산문 → ### 보유 기간별 양도세 → ### 시나리오 비교 요약 (ScenarioComparisonHighlight wrap)
 */
import { useState } from "react";
import type { InvestmentMeta } from "@/types/content";
import { ScenarioComparisonBox } from "./ScenarioComparisonBox";

type ScenarioKey = "A" | "B" | "C-1" | "C-2";

export function InvestmentInteractive({
  investment,
  appraisal,
  minPrice,
}: {
  investment: InvestmentMeta;
  appraisal: number;
  minPrice: number;
}) {
  const firstAvailable = pickFirstAvailable(investment) ?? "A";
  const [activeKey, setActiveKey] = useState<ScenarioKey>(firstAvailable);
  const [biddingPercent, setBiddingPercent] = useState<number>(0);

  return (
    <ScenarioComparisonBox
      investment={investment}
      appraisal={appraisal}
      minPrice={minPrice}
      activeKey={activeKey}
      onActiveKeyChange={(v) => {
        if (v != null) setActiveKey(v);
      }}
      biddingPercent={biddingPercent}
      onBiddingPercentChange={setBiddingPercent}
    />
  );
}

function pickFirstAvailable(investment: InvestmentMeta): ScenarioKey | null {
  if (investment.scenario_a) return "A";
  if (investment.scenario_b) return "B";
  if (investment.scenario_c1) return "C-1";
  if (investment.scenario_c2) return "C-2";
  return null;
}
