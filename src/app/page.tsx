import { HeroSearch } from "@/components/home/HeroSearch";
import { FreeAnalysisBlock } from "@/components/home/FreeAnalysisBlock";
import { WhyBlock } from "@/components/home/WhyBlock";
import { PricingBlock } from "@/components/home/PricingBlock";
import { TrustCTA } from "@/components/home/TrustCTA";

/* Phase 0 — Home 8섹션 → 5블록 통합 본질.
 * 1. Hero (검색 폼 제거 + CTA 2개 + 신뢰 strip 3건)
 * 2. 무료 물건분석 (CardCarousel + ContentShowcase)
 * 3. 왜 경매퀵 (WhySection + FlowSteps)
 * 4. Pricing (RegionStrip 흡수)
 * 5. TrustCTA */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSearch />
      <FreeAnalysisBlock />
      <WhyBlock />
      <PricingBlock />
      <TrustCTA />
    </main>
  );
}
