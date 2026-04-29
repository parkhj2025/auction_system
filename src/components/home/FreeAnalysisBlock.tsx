import { CardCarousel } from "./CardCarousel";
import { ContentShowcase } from "./ContentShowcase";

/* Phase 0 — Home 5블록 통합 본질.
 * Block 2 = 무료 물건분석 (CardCarousel + ContentShowcase 시각 통합 wrapper). */
export function FreeAnalysisBlock() {
  return (
    <>
      <CardCarousel />
      <ContentShowcase />
    </>
  );
}
