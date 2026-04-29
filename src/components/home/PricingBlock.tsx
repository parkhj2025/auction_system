import { RegionStrip } from "./RegionStrip";
import { Pricing } from "./Pricing";

/* Phase 0 — Home 5블록 통합 본질.
 * Block 4 = 수수료 (RegionStrip 서비스 지역 띠 흡수 + 기존 Pricing). */
export function PricingBlock() {
  return (
    <>
      <RegionStrip />
      <Pricing />
    </>
  );
}
