import { HeroSearch } from "@/components/home/HeroSearch";
import { InsightBlock } from "@/components/home/InsightBlock";
import { CompareBlock } from "@/components/home/CompareBlock";
import { PricingBlock } from "@/components/home/PricingBlock";
import { TrustCTA } from "@/components/home/TrustCTA";
import { getActiveCaseNumbers } from "@/lib/content";

/* Phase 1.2 (A-1-2) v16 — Home (5 블록 광역 정정 / StrengthsCarousel 영구 폐기 / 모바일 carousel = Hero 박스 안 통합).
 *  1. Hero (동영상 + frosted glass + 1 viewport + 페이딩 #FAFAFA + 모바일 carousel 통합)
 *  2. Insight (#FAFAFA + 카테고리 4건 + Editorial Card 4 col)
 *  3. Compare (큰 숫자 직접 비교 + 막대 5건 작은 영역)
 *  4. Pricing (#FAFAFA + caption 상단 1줄 + 카드 3건 + timeline)
 *  5. Trust (gray-900 + justify-between + "0" 비율 ↓ + 3 카드 모바일 3 col + CTA) */
export default function Home() {
  const caseNumbers = getActiveCaseNumbers();

  return (
    <main className="flex flex-1 flex-col">
      <HeroSearch caseNumbers={caseNumbers} />
      <InsightBlock />
      <CompareBlock />
      <PricingBlock />
      <TrustCTA />
    </main>
  );
}
