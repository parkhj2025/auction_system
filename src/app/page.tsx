import { HeroSearch } from "@/components/home/HeroSearch";
import { BenefitBlock } from "@/components/home/BenefitBlock";
import { TodayAnalysis } from "@/components/home/TodayAnalysis";
import { InsightBlock } from "@/components/home/InsightBlock";
import { CompareBlock } from "@/components/home/CompareBlock";
import { PricingBlock } from "@/components/home/PricingBlock";
import { TrustCTA } from "@/components/home/TrustCTA";
import { getActiveCaseNumbers } from "@/lib/content";

/* Phase 1.2 (A-1-2) v5 — 7 블록 본질 (형준님 #5 정보 위계 광역 적용).
 *  1. Hero (h1 "경매 입찰 대리" green + 검색 카드 "사건 의뢰하기" + Gemini courthouse 일러스트)
 *  2. Benefit ("경매퀵이 드리는 것" + "이렇게 도와드립니다" + 3 카드 동사 본질 + mobile 2 col)
 *  3. TodayAnalysis (오늘의 무료 물건분석 큰 카드)
 *  4. InsightBlock (★ 신규 — 광역 우산 / FreeAnalysisBlock 흡수 / chip filter 5 + 6 카드 + Gemini 4)
 *  5. Compare (3h vs 0h / mobile 2 col grid)
 *  6. Pricing (가로 점선 connector + dot ring + 추천 yellow chip + 보증금 박스)
 *  7. TrustCTA (dark Charcoal + radial green glow + 배지 stagger + CTA 2) */
export default function Home() {
  const caseNumbers = getActiveCaseNumbers();

  return (
    <main className="flex flex-1 flex-col">
      <HeroSearch caseNumbers={caseNumbers} />
      <BenefitBlock />
      <TodayAnalysis />
      <InsightBlock />
      <CompareBlock />
      <PricingBlock />
      <TrustCTA />
    </main>
  );
}
