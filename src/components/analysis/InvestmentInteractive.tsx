"use client";

/**
 * 05 시나리오 인터랙티브 wrapper — 단계 5-4-2-fix-2 Phase 3.
 *
 * 단일 source state (형준님 결정 11):
 *  - activeKey + biddingPercent 상위 wrapper 에서 관리
 *  - ScenarioCarousel 와 ScenarioComparisonBox 동기화
 *  - 슬라이더 drag → 카드뉴스 + 비교 표 동시 재계산
 *
 * 순서 (형준님 결정 12):
 *  - 카드뉴스 (ScenarioCarousel) → 비교 표 (ScenarioComparisonBox)
 *  - 다음 mdx 본문: ### 실질 → ### 자금 → ### 시나리오 산문 → ### 양도세 → ### 요약
 */
import { useState } from "react";
import type { InvestmentMeta } from "@/types/content";
import { ScenarioCarousel } from "./ScenarioCarousel";
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
    <>
      <ScenarioCarousel
        investment={investment}
        appraisal={appraisal}
        minPrice={minPrice}
        activeKey={activeKey}
        onActiveKeyChange={setActiveKey}
        biddingPercent={biddingPercent}
      />
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
    </>
  );
}

function pickFirstAvailable(investment: InvestmentMeta): ScenarioKey | null {
  if (investment.scenario_a) return "A";
  if (investment.scenario_b) return "B";
  if (investment.scenario_c1) return "C-1";
  if (investment.scenario_c2) return "C-2";
  return null;
}
