import { HeroSearch } from "@/components/home/HeroSearch";
import { StrengthsCarousel } from "@/components/home/StrengthsCarousel";
import { InsightBlock } from "@/components/home/InsightBlock";
import { CompareBlock } from "@/components/home/CompareBlock";
import { PricingBlock } from "@/components/home/PricingBlock";
import { TrustCTA } from "@/components/home/TrustCTA";
import { SmoothScroll } from "@/components/SmoothScroll";
import { getActiveCaseNumbers } from "@/lib/content";

/* Phase 1.2 (A-1-2) v15 — Home (Features 영구 폐기 + StrengthsCarousel 신규).
 *  1. Hero (동영상 배경 + center + 칩 + 데스크탑 3 강점 1행)
 *  2. StrengthsCarousel (모바일 only / lg:hidden / Hero 직 아래 / 4초 자동 전환)
 *  3. Insight (bento 5건)
 *  4. Compare (5+1 막대 + Lucide 24px + NumberFlow + "85" 인라인)
 *  5. Pricing (h2 44/88 + timeline + 가격)
 *  6. Trust (charcoal + Spotlight lg+ + "0" 정적 + 3 아이콘 카드 + CTA) */
export default function Home() {
  const caseNumbers = getActiveCaseNumbers();

  return (
    <SmoothScroll>
      <main className="flex flex-1 flex-col">
        <HeroSearch caseNumbers={caseNumbers} />
        <StrengthsCarousel />
        <InsightBlock />
        <CompareBlock />
        <PricingBlock />
        <TrustCTA />
      </main>
    </SmoothScroll>
  );
}
