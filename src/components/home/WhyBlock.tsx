import { WhySection } from "./WhySection";
import { FlowSteps } from "./FlowSteps";

/* Phase 0 — Home 5블록 통합 본질.
 * Block 3 = 왜 경매퀵 (WhySection 비교표·후기 + FlowSteps 3단계 시각 통합 wrapper). */
export function WhyBlock() {
  return (
    <>
      <WhySection />
      <FlowSteps />
    </>
  );
}
