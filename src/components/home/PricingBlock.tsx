import Link from "next/link";
import { FEES } from "@/lib/constants";

/* Phase 1.2 (A-1-2) v6 — PricingBlock (timeline 시각화 + 카피 v4).
 * h2 "신청이 빠를수록 저렴합니다." (eyebrow 폐기)
 * subtext "5만원부터 시작합니다."
 * timeline: 시간축 (D-7+ → D-7~D-2 → D-2 이내) 가로 + 가격축 (5만 / 7만 / 10만) bar height 시각화.
 * 강조: 얼리버드 = green border + chip "가장 많이 선택"
 * caption: "낙찰 시 +5만원" / "패찰 시 보증금 전액 반환"
 * CTA "지금 신청하기" (광역 정수 1건). */

type Tier = {
  key: "earlybird" | "standard" | "rush";
  point: string;
  name: string;
  fee: number;
  recommended?: boolean;
};

const TIERS: Tier[] = [
  { key: "earlybird", point: "D-7+", name: "얼리버드", fee: FEES.earlybird, recommended: true },
  { key: "standard", point: "D-7~D-2", name: "일반", fee: FEES.standard },
  { key: "rush", point: "D-2 이내", name: "급건", fee: FEES.rush },
];

function feeLabel(won: number) {
  return `${(won / 10_000).toLocaleString("ko-KR")}만원`;
}

/* bar height paradigm — 최대 fee (rush 10만) = 100% / 비례 height. */
const MAX_FEE = Math.max(...TIERS.map((t) => t.fee));

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
          className="max-w-2xl text-[var(--text-h2)] font-extrabold leading-[1.1] tracking-[-0.025em] text-[var(--text-primary)]"
          style={{ fontWeight: 800 }}
        >
          신청이 빠를수록 저렴합니다.
        </h2>
        <p className="mt-4 text-[16px] leading-[1.6] text-[var(--text-secondary)] lg:mt-5 lg:text-[18px]">
          5만원부터 시작합니다.
        </p>

        {/* timeline visualization — 가로 시간축 + 세로 bar. */}
        <div className="mt-12 grid grid-cols-3 gap-3 lg:gap-6">
          {TIERS.map((tier) => {
            const heightPct = (tier.fee / MAX_FEE) * 100;
            return (
              <article
                key={tier.key}
                className={
                  "relative flex flex-col rounded-2xl bg-white p-5 lg:p-7 " +
                  (tier.recommended
                    ? "border-2 border-[var(--brand-green)] shadow-[0_16px_32px_rgba(0,200,83,0.10)]"
                    : "border border-[var(--border-1)]")
                }
              >
                {tier.recommended && (
                  <span className="absolute -top-3 left-5 inline-flex items-center rounded-md bg-[var(--brand-green)] px-2.5 py-1 text-[11px] font-bold text-white shadow-[var(--shadow-glow-green)] lg:left-7">
                    가장 많이 선택
                  </span>
                )}

                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)] lg:text-[12px]">
                  {tier.point}
                </p>
                <p className="mt-2 text-[20px] font-extrabold tracking-[-0.025em] text-[var(--text-primary)] lg:mt-3 lg:text-[28px]">
                  {feeLabel(tier.fee)}
                </p>
                <p className="mt-1 text-[12px] text-[var(--text-tertiary)] lg:text-[13px]">
                  {tier.name}
                </p>

                {/* bar visualization — 가격축 본질. */}
                <div className="mt-5 flex h-24 items-end lg:mt-7 lg:h-32">
                  <div
                    aria-hidden="true"
                    className={
                      "w-full rounded-md transition-all duration-[400ms] ease-out " +
                      (tier.recommended
                        ? "bg-gradient-to-t from-[var(--brand-green)] to-[var(--brand-green-deep)]"
                        : "bg-[var(--bg-tertiary)]")
                    }
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>

        {/* caption — 외부 정수 본질. */}
        <p className="mt-8 text-center text-[13px] text-[var(--text-secondary)] lg:text-[14px]">
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

        {/* CTA — 광역 정수 1건. */}
        <div className="mt-8 flex justify-center lg:mt-10">
          <Link
            href="/apply"
            className="inline-flex h-13 items-center justify-center rounded-[14px] bg-[var(--brand-green)] px-8 text-[15px] font-bold text-white shadow-[var(--shadow-button-green)] transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-14 lg:px-10 lg:text-[16px]"
          >
            지금 신청하기
          </Link>
        </div>
      </div>
    </section>
  );
}
