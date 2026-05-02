import Link from "next/link";
import { FEES } from "@/lib/constants";

/* Phase 1.2 (A-1-2) v4 — PricingBlock (시안 정합 본질).
 * h2 "필요한 만큼만" + 세로 timeline (mobile) / 가로 점선 connector (lg) + dot ring 24x24.
 * 추천 카드 (D-7~D-2 일반) — border 2px green + scale 1.02 + yellow chip "가장 많이 선택".
 * "패찰 시 보증금 전액 반환" 별도 박스 (CLAUDE.md 신뢰 핵심 의무 위치). */

type Tier = {
  key: "earlybird" | "standard" | "rush";
  name: string;
  point: string;
  tag: string;
  fee: number;
  recommended?: boolean;
};

const TIERS: Tier[] = [
  {
    key: "earlybird",
    name: "얼리버드",
    point: "D-7+",
    tag: "입찰 7일 이상 전",
    fee: FEES.earlybird,
  },
  {
    key: "standard",
    name: "일반",
    point: "D-7~D-2",
    tag: "입찰 2~7일 전",
    fee: FEES.standard,
    recommended: true,
  },
  {
    key: "rush",
    name: "급건",
    point: "D-1",
    tag: "입찰 2일 이내",
    fee: FEES.rush,
  },
];

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
        <div className="max-w-2xl">
          <p className="section-eyebrow">수수료</p>
          <h2
            id="pricing-heading"
            className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-[var(--text-primary)] lg:text-[40px]"
          >
            필요한 만큼만
          </h2>
          <p className="mt-4 text-[16px] leading-[1.6] text-[var(--text-secondary)] lg:text-[18px]">
            신청 시점에 따라 5만원부터.
          </p>
        </div>

        {/* 카드 grid + 가로 점선 connector (lg) / 세로 timeline (mobile). */}
        <div className="relative mt-12">
          {/* 가로 점선 connector (lg). */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-12 right-12 top-9 hidden h-0 border-t-2 border-dashed border-[var(--border-2)] lg:block"
          />

          <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
            {TIERS.map((tier) => (
              <article
                key={tier.key}
                className={
                  "relative flex flex-col rounded-[20px] bg-white p-7 transition-all duration-[250ms] ease-out lg:p-8 " +
                  (tier.recommended
                    ? "border-2 border-[var(--brand-green)] shadow-[0_16px_32px_rgba(0,200,83,0.10)] lg:scale-[1.02]"
                    : "border border-[var(--border-1)]")
                }
              >
                {/* 추천 chip yellow (절대 위치 / 우상단 / 시안 정합). */}
                {tier.recommended && (
                  <span className="absolute -top-3 right-6 inline-flex items-center rounded-md bg-[var(--accent-yellow)] px-3 py-1.5 text-[12px] font-bold text-[#4A3A00] shadow-[var(--shadow-glow-yellow)]">
                    가장 많이 선택
                  </span>
                )}

                {/* dot ring 24x24 (상단 가운데). */}
                <span
                  aria-hidden="true"
                  className={
                    "mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-white " +
                    (tier.recommended
                      ? "ring-4 ring-[var(--brand-green)]"
                      : "ring-4 ring-[var(--border-2)]")
                  }
                >
                  <span
                    className={
                      "h-2 w-2 rounded-full " +
                      (tier.recommended
                        ? "bg-[var(--brand-green)]"
                        : "bg-[var(--text-tertiary)]")
                    }
                  />
                </span>

                <p className="mt-6 text-center text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                  {tier.point}
                </p>
                <p className="mt-3 text-center text-[40px] font-bold leading-none tracking-[-0.025em] text-[var(--text-primary)]">
                  {feeLabel(tier.fee)}
                </p>
                <p className="mt-2 text-center text-[14px] font-semibold text-[var(--text-secondary)]">
                  {tier.name}
                </p>
                <p className="mt-1 text-center text-[13px] text-[var(--text-tertiary)]">
                  {tier.tag}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* "패찰 시 보증금 전액 반환" 별도 박스 (CLAUDE.md 신뢰 핵심 의무). */}
        <div className="mt-8 rounded-2xl border-l-[3px] border-[var(--brand-green)] bg-[rgba(0,200,83,0.06)] px-5 py-4 lg:px-6 lg:py-5">
          <p className="text-[14px] font-semibold leading-[1.6] text-[var(--text-primary)] lg:text-[15px]">
            패찰 시 보증금은 <span className="text-[var(--brand-green-deep)]">전액 반환</span>됩니다. 결과와 무관하게 청구되는 숨은 비용은 없습니다.
          </p>
        </div>

        {/* foot row — 성공보수 + CTA. */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-[var(--text-secondary)]">
            낙찰 시{" "}
            <strong className="font-bold text-[var(--text-primary)]">
              +{feeLabel(FEES.successBonus)}
            </strong>{" "}
            (낙찰된 경우만)
          </p>
          <Link
            href="/pricing"
            className="text-[14px] font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:text-[var(--brand-green-deep)]"
          >
            수수료 자세히 →
          </Link>
        </div>
      </div>
    </section>
  );
}
