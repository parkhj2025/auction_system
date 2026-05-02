import { HeroSearch } from "@/components/home/HeroSearch";
import { FreeAnalysisBlock } from "@/components/home/FreeAnalysisBlock";
import { WhyBlock } from "@/components/home/WhyBlock";
import { PricingBlock } from "@/components/home/PricingBlock";
import { TrustCTA } from "@/components/home/TrustCTA";
import { getActiveCaseNumbers, getAllAnalysisPosts } from "@/lib/content";

/* Phase 1.2 (A-1-2) v2 — 카피 압축 + 시각화 강화 + 카드뉴스 본질.
 * 5 블록:
 *  1. Hero (eyebrow 폐기 + h1 압축 + trust chip 폐기 + 콘텐츠 카드 1건 신규)
 *  2. 인사이트 (chip-nav 폐기 + 카드뉴스 grid + SVG 썸네일 4 카테고리)
 *  3. Why (비교표 폐기 + Before/After 인포그래픽 + 효용 카드 lucide 48px)
 *  4. Pricing (카피 압축 + 시간축 인포그래픽 / mobile 세로 + desktop 가로)
 *  5. TrustCTA (카피 압축 + 신뢰 배지 3건 lucide 48px) */
export default function Home() {
  const caseNumbers = getActiveCaseNumbers();
  const allAnalysis = getAllAnalysisPosts();
  const featured = allAnalysis[0]
    ? {
        slug: allAnalysis[0].frontmatter.slug,
        title: allAnalysis[0].frontmatter.title,
        subtitle: allAnalysis[0].frontmatter.subtitle,
        caseNumber: allAnalysis[0].frontmatter.caseNumber,
        address: allAnalysis[0].frontmatter.address,
      }
    : null;

  return (
    <main className="flex flex-1 flex-col">
      <HeroSearch caseNumbers={caseNumbers} featured={featured} />
      <FreeAnalysisBlock />
      <WhyBlock />
      <PricingBlock />
      <TrustCTA />
    </main>
  );
}
