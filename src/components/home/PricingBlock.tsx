import { FEES } from "@/lib/constants";
import { PricingTimeline } from "./PricingTimeline";

/* Phase 1.2 (A-1-2) v7 — PricingBlock (timeline + 카피 v5 / CTA 광역 폐기 → Footer 통합).
 * h2 "신청이 빠를수록 저렴합니다." (eyebrow 폐기)
 * subtext "5만원부터 시작합니다."
 * timeline (PricingTimeline 신규): 가로 line + 노드 3건 + 카드 grid.
 * caption: "낙찰 시 +5만원 (성공 보수) · 패찰 시 보증금 전액 반환" */

function feeLabel(won: number) {
  return `${(won / 10_000).toLocaleString("ko-KR")}만원`;
}

export function PricingBlock() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="bg-[var(--bg-secondary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <h2
          id="pricing-heading"
          className="max-w-4xl text-[56px] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--text-primary)] [text-wrap:balance] lg:text-[120px]"
          style={{ fontWeight: 800 }}
        >
          신청이 빠를수록,<br className="lg:hidden" />{" "}
          <span className="text-[var(--brand-green)]">저렴합니다.</span>
        </h2>
        <p className="mt-5 text-[17px] font-medium leading-[1.6] text-[var(--text-secondary)] lg:mt-6 lg:text-[19px]">
          5만원부터 시작합니다.
        </p>

        <PricingTimeline />

        {/* caption — Footer CTA 통합 paradigm (Pricing CTA 광역 폐기). */}
        <p className="mt-10 text-center text-[14px] font-medium text-[var(--text-secondary)] lg:text-[15px]">
          낙찰 시{" "}
          <strong className="font-bold text-[var(--text-primary)]">
            +{feeLabel(FEES.successBonus)} (성공 보수)
          </strong>{" "}
          · 패찰 시 보증금{" "}
          <strong className="font-bold text-[var(--brand-green-deep)]">
            전액 반환
          </strong>
          .
        </p>
      </div>
    </section>
  );
}
