import { HeroSearch } from "@/components/home/HeroSearch";
import { InsightBlock } from "@/components/home/InsightBlock";
import { CompareBlock } from "@/components/home/CompareBlock";
import { PricingBlock } from "@/components/home/PricingBlock";
import { ReviewsBlock } from "@/components/home/ReviewsBlock";
import { TrustCTA } from "@/components/home/TrustCTA";
import { getActiveCaseNumbers, getFeaturedByCategory } from "@/lib/content";

/* Phase 1.2 (A-1-2) Cycle B — Home 6 섹션 (Reviews 신규 + 사회적 증명 paradigm).
 *  1. Hero (동영상 + frosted glass + 1 viewport + 페이딩 #FAFAFA + 모바일 carousel 통합)
 *  2. Compare (서비스 가치 / 시간 절약 / 큰 숫자 직접 비교 + 막대 5건)
 *  3. Pricing (서비스 가치 / 가격 / #FAFAFA + caption 상단 1줄 + 카드 3건 + timeline)
 *  4. Insight (콘텐츠 가치 / #FAFAFA + 카테고리 4건 + Editorial Card 4 col)
 *  5. Reviews (사회적 증명 / white + Bento 2×3 + 가상 후기 6건 / Cycle B 신규)
 *  6. Trust (전환 / gray-900 + justify-between + "0" 비율 ↓ + 3 카드 + CTA)
 *  Cycle B: Reviews 5번째 신규 진입 / 광역 페이지 맥락 = 서비스 → 콘텐츠 → 사회적 증명 → 전환 */
export default function Home() {
  const caseNumbers = getActiveCaseNumbers();
  const featuredByCategory = {
    analysis: getFeaturedByCategory("analysis"),
    guide: getFeaturedByCategory("guide"),
    glossary: getFeaturedByCategory("glossary"),
    news: getFeaturedByCategory("news"),
  };

  return (
    <main className="flex flex-1 flex-col">
      <HeroSearch caseNumbers={caseNumbers} />
      <CompareBlock />
      <PricingBlock />
      <InsightBlock featuredByCategory={featuredByCategory} />
      <ReviewsBlock />
      <TrustCTA />
    </main>
  );
}
