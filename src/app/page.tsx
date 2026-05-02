import { HeroSearch } from "@/components/home/HeroSearch";
import { FreeAnalysisBlock } from "@/components/home/FreeAnalysisBlock";
import { WhyBlock } from "@/components/home/WhyBlock";
import { PricingBlock } from "@/components/home/PricingBlock";
import { TrustCTA } from "@/components/home/TrustCTA";
import { getActiveCaseNumbers } from "@/lib/content";

/* Phase 1.2 (A-1) — 모노톤 화이트 + 앱 스타일 + 와이어프레임+@.
 * 5 블록 본질 (변경 0):
 *  1. Hero (인라인 사건번호 검색 + CTA + 신뢰 strip)
 *  2. 무료 물건분석 → 경매 인사이트 (chip 4 navigator + active 콘텐츠)
 *  3. 왜 경매퀵 (비교표 3 row + 절차 3 step + 효용 카드 3건)
 *  4. Pricing (압축 본질)
 *  5. TrustCTA */
export default function Home() {
  const caseNumbers = getActiveCaseNumbers();

  return (
    <main className="flex flex-1 flex-col">
      <HeroSearch caseNumbers={caseNumbers} />
      <FreeAnalysisBlock />
      <WhyBlock />
      <PricingBlock />
      <TrustCTA />
    </main>
  );
}
