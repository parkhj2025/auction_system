import { HeroSearch } from "@/components/home/HeroSearch";
import { BenefitBlock } from "@/components/home/BenefitBlock";
import { InsightBlock } from "@/components/home/InsightBlock";
import { CompareBlock } from "@/components/home/CompareBlock";
import { PricingBlock } from "@/components/home/PricingBlock";
import { TrustCTA } from "@/components/home/TrustCTA";
import { getActiveCaseNumbers } from "@/lib/content";

/* Phase 1.2 (A-1-2) v6 — 6 블록 (광역 재설계 / 카피 v4 / 디자인 원칙 v2).
 *  1. Hero (typography-driven dark + mesh gradient + glass search / 일러스트 광역 폐기)
 *  2. Features ("이렇게 진행됩니다" + 3 카드 monoline icon / CTA 폐기)
 *  3. Insight (광역 우산 + 카테고리 색 시스템 + TodayAnalysis 흡수 첫 카드 col-span-2)
 *  4. Compare (typography-driven 대형 numeric 3h → 0h / "비교" 라벨 폐기)
 *  5. Pricing (timeline visualization + bar chart + 강조 얼리버드 + CTA "지금 신청하기")
 *  6. Trust (charcoal dark + radial glow + 단순화 / CTA 광역 폐기) */
export default function Home() {
  const caseNumbers = getActiveCaseNumbers();

  return (
    <main className="flex flex-1 flex-col">
      <HeroSearch caseNumbers={caseNumbers} />
      <BenefitBlock />
      <InsightBlock />
      <CompareBlock />
      <PricingBlock />
      <TrustCTA />
    </main>
  );
}
