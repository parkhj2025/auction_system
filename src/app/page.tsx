import { HeroSearch } from "@/components/home/HeroSearch";
import { BenefitBlock } from "@/components/home/BenefitBlock";
import { TodayAnalysis } from "@/components/home/TodayAnalysis";
import { FreeAnalysisBlock } from "@/components/home/FreeAnalysisBlock";
import { CompareBlock } from "@/components/home/CompareBlock";
import { PricingBlock } from "@/components/home/PricingBlock";
import { TrustCTA } from "@/components/home/TrustCTA";
import { getActiveCaseNumbers } from "@/lib/content";

/* Phase 1.2 (A-1-2) v4 — 7 블록 본질 (시안 정합 본질).
 *  1. Hero (브랜드 캐치프레이즈 + 검색 카드 + 3D Shield + Gavel)
 *  2. Benefit (★ 신규 — 경매퀵을 쓰면 + 3 카드 + CTA primary green)
 *  3. TodayAnalysis (★ 신규 — 오늘의 무료 물건분석 큰 카드)
 *  4. 인사이트 (chip filter row + 4 col grid + SVG 토큰)
 *  5. Compare (★ 신규 — 3h vs 0h / WhyBlock 폐기 흡수)
 *  6. Pricing (가로 점선 connector + dot ring + 추천 yellow chip + 보증금 박스)
 *  7. TrustCTA (dark Charcoal + radial green glow + 배지 stagger + CTA 2) */
export default function Home() {
  const caseNumbers = getActiveCaseNumbers();

  return (
    <main className="flex flex-1 flex-col">
      <HeroSearch caseNumbers={caseNumbers} />
      <BenefitBlock />
      <TodayAnalysis />
      <FreeAnalysisBlock />
      <CompareBlock />
      <PricingBlock />
      <TrustCTA />
    </main>
  );
}
