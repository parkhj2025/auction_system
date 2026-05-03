/* Phase 1.2 (A-1-2) v7 — PricingTimeline (신규).
 * 가로 timeline + 노드 3건 + 시간축 (좌 D-7+ → 우 입찰일).
 * 노드 위 가격 카드 영역 + 좌→우 시간 ↑ → 가격 ↑ 흐름 시각.
 * 강조: 얼리버드 = green dot + chip "가장 많이 선택" + green border. */

import { FEES } from "@/lib/constants";

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

export function PricingTimeline() {
  return (
    <div className="mt-12 lg:mt-16">
      {/* 카드 grid — desktop 가로 / mobile 세로 stack. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        {TIERS.map((tier) => (
          <article
            key={tier.key}
            className={
              "relative flex flex-col rounded-2xl bg-white p-6 lg:p-8 " +
              (tier.recommended
                ? "border-2 border-[var(--brand-green)] shadow-[0_16px_32px_rgba(0,200,83,0.10)]"
                : "border border-[var(--border-1)]")
            }
          >
            {tier.recommended && (
              <span className="absolute -top-3 left-6 inline-flex items-center rounded-md bg-[var(--brand-green)] px-3 py-1 text-[12px] font-bold text-white shadow-[var(--shadow-glow-green)]">
                가장 많이 선택
              </span>
            )}

            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
              {tier.point}
            </p>
            <p className="mt-3 text-[28px] font-extrabold tracking-[-0.025em] text-[var(--text-primary)] lg:text-[36px]">
              {feeLabel(tier.fee)}
            </p>
            <p className="mt-1 text-[14px] font-medium text-[var(--text-secondary)] lg:text-[15px]">
              {tier.name}
            </p>
          </article>
        ))}
      </div>

      {/* 가로 timeline 시각화 — desktop only / mobile 폐기 (카드 stack 본질). */}
      <div className="relative mt-10 hidden items-center md:flex">
        {/* timeline line. */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-[var(--brand-green)] via-[var(--border-2)] to-[var(--text-tertiary)]"
        />
        {/* 노드 3건 + 시간 라벨. */}
        <div className="relative grid w-full grid-cols-3">
          {TIERS.map((tier) => (
            <div key={tier.key} className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className={
                  "h-4 w-4 rounded-full border-4 " +
                  (tier.recommended
                    ? "border-[var(--brand-green)] bg-white"
                    : "border-[var(--border-2)] bg-white")
                }
              />
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                {tier.point}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 시간 흐름 라벨 — desktop only. */}
      <div className="mt-4 hidden items-center justify-between md:flex">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--brand-green-deep)]">
          신청이 빠를수록 ↓
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          입찰일 본질
        </span>
      </div>
    </div>
  );
}
