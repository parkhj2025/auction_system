import { HeroSearch } from "@/components/home/HeroSearch";
import { BenefitBlock } from "@/components/home/BenefitBlock";
import { InsightBlock } from "@/components/home/InsightBlock";
import { CompareBlock } from "@/components/home/CompareBlock";
import { PricingBlock } from "@/components/home/PricingBlock";
import { TrustCTA } from "@/components/home/TrustCTA";
import { SmoothScroll } from "@/components/SmoothScroll";
import { getActiveCaseNumbers } from "@/lib/content";

/* Phase 1.2 (A-1-2) v10 — 6 블록 + SmoothScroll wrap (메인 페이지 한정).
 * lenis = 메인만 적용 / /analysis/[slug] motion useScroll 회귀 0.
 *  1. Hero (Background Boxes lg+ + 4 카드 grid lg+ + h1 lg 강제 line-break + CTA glow halo)
 *  2. Features (Sticky Scroll Reveal lg+ + vertical stack 강화 mobile + h2 56/120)
 *  3. Insight (bento 2x2+1x1 + scroll reveal stagger 150ms + 색 분배 6건)
 *  4. Compare (5+1 막대 + Lucide 24px + NumberFlow 8건 + "85" 240px + 우측 색 변환)
 *  5. Pricing (h2 56/120 + timeline 보존)
 *  6. Trust (charcoal + Spotlight lg+ / mobile glow + "0" 200/400 정적 + Text Generate + 3 아이콘 카드 + CTA) */
export default function Home() {
  const caseNumbers = getActiveCaseNumbers();

  return (
    <SmoothScroll>
      <main className="flex flex-1 flex-col">
        <HeroSearch caseNumbers={caseNumbers} />
        <BenefitBlock />
        <InsightBlock />
        <CompareBlock />
        <PricingBlock />
        <TrustCTA />
      </main>
    </SmoothScroll>
  );
}
