"use client";

import { FEES } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* Phase 1.2 (A-1-2) v9 — PricingTimeline (색 변환 + 가로/세로 timeline + hover lift).
 * 색 분배: 7일+ 전 green / 7~2일 전 yellow / 2일 이내 orange (시간 ↑ + 색 ↑ + 긴급도 ↑).
 * desktop (lg+ / ≥ 1024px): 가로 timeline + line gradient 90deg + 노드 3건 위 가격 카드.
 * mobile (< lg): 세로 timeline + line gradient 180deg + 노드 3건 + 카드.
 * 강조 (얼리버드): green border + chip "가장 많이 선택" + scale 1.02.
 * hover: scale 1.02 + shadow-xl + 색 강조 / 250ms ease-out (3 카드 일괄). */

type Tier = {
  key: "earlybird" | "standard" | "rush";
  point: string;
  name: string;
  fee: number;
  recommended?: boolean;
  color: string;
  colorDeep: string;
  bgSoft: string;
};

const TIERS: Tier[] = [
  {
    key: "earlybird",
    point: "7일+ 전",
    name: "얼리버드",
    fee: FEES.earlybird,
    recommended: true,
    color: "#00C853",
    colorDeep: "#00A047",
    bgSoft: "rgba(0, 200, 83, 0.08)",
  },
  {
    key: "standard",
    point: "7~2일 전",
    name: "일반",
    fee: FEES.standard,
    color: "#FBBF24",
    colorDeep: "#D97706",
    bgSoft: "rgba(251, 191, 36, 0.10)",
  },
  {
    key: "rush",
    point: "2일 이내",
    name: "급건",
    fee: FEES.rush,
    color: "#F97316",
    colorDeep: "#C2410C",
    bgSoft: "rgba(249, 115, 22, 0.10)",
  },
];

function feeLabel(won: number) {
  return `${(won / 10_000).toLocaleString("ko-KR")}만원`;
}

export function PricingTimeline() {
  return (
    <div className="mt-12 lg:mt-16">
      {/* mobile (< lg): 세로 timeline + 카드 stack / desktop (lg+): 가로 timeline + 카드 grid. */}
      <div className="lg:hidden">
        <PricingTimelineVertical />
      </div>
      <div className="hidden lg:block">
        <PricingTimelineHorizontal />
      </div>
    </div>
  );
}

/* ─── desktop 가로 timeline (lg+) ─────────────────────────── */
function PricingTimelineHorizontal() {
  return (
    <div>
      {/* 카드 grid (3-col). */}
      <div className="grid grid-cols-3 gap-6">
        {TIERS.map((tier, idx) => (
          <PricingCard key={tier.key} tier={tier} delay={idx * 100} />
        ))}
      </div>

      {/* 가로 timeline line + 노드 3건 (색 변환 / 90deg). */}
      <div className="relative mt-10 flex items-center">
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full"
          style={{
            background: "linear-gradient(90deg, #00C853 0%, #FBBF24 50%, #F97316 100%)",
          }}
        />
        <div className="relative grid w-full grid-cols-3">
          {TIERS.map((tier) => (
            <div key={tier.key} className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className="h-5 w-5 rounded-full border-[3px] bg-white"
                style={{ borderColor: tier.color }}
              />
              <p
                className="mt-3 text-[12px] font-bold uppercase tracking-[0.08em]"
                style={{ color: tier.colorDeep }}
              >
                {tier.point}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 시간 흐름 라벨. */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#00A047]">
          신청이 빠를수록 ↓
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#C2410C]">
          입찰일 임박
        </span>
      </div>
    </div>
  );
}

/* ─── mobile 세로 timeline (< lg) ─────────────────────────── */
function PricingTimelineVertical() {
  return (
    <div className="relative">
      {/* 세로 timeline line (180deg / 색 변환). */}
      <span
        aria-hidden="true"
        className="absolute left-[19px] top-0 bottom-0 w-[3px] rounded-full"
        style={{
          background: "linear-gradient(180deg, #00C853 0%, #FBBF24 50%, #F97316 100%)",
        }}
      />

      <div className="space-y-5">
        {TIERS.map((tier, idx) => (
          <div key={tier.key} className="relative flex gap-5">
            {/* 노드 (좌측). */}
            <div className="relative z-10 flex-shrink-0 pt-6">
              <span
                aria-hidden="true"
                className="block h-[20px] w-[20px] rounded-full border-[3px] bg-white"
                style={{ borderColor: tier.color }}
              />
              <p
                className="mt-2 w-[40px] -translate-x-2 text-[10px] font-bold uppercase tracking-[0.06em]"
                style={{ color: tier.colorDeep }}
              >
                {tier.point}
              </p>
            </div>
            {/* 카드 (우측). */}
            <div className="flex-1">
              <PricingCard tier={tier} delay={idx * 100} compact />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PricingCard (광역 / hover lift + 색 강조) ───────────── */
function PricingCard({
  tier,
  delay = 0,
  compact = false,
}: {
  tier: Tier;
  delay?: number;
  compact?: boolean;
}) {
  const { ref: revealRef, className: revealClass, style: revealStyle } =
    useScrollReveal<HTMLElement>({ delay });
  return (
    <article
      ref={revealRef}
      className={`${revealClass} group relative flex flex-col rounded-2xl bg-white p-6 transition-[transform,box-shadow,border-color,background] duration-[250ms] ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[var(--shadow-card-hover)] ${
        tier.recommended
          ? "border-2 shadow-[0_16px_32px_rgba(0,200,83,0.10)] scale-[1.02]"
          : "border"
      } ${compact ? "" : "lg:p-8"}`}
      style={{
        ...revealStyle,
        borderColor: tier.recommended ? tier.color : "var(--border-1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = tier.bgSoft;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "white";
      }}
    >
      {tier.recommended && (
        <span
          className="absolute -top-3 left-6 inline-flex items-center rounded-md px-3 py-1 text-[12px] font-bold text-white shadow-[var(--shadow-glow-green)]"
          style={{ background: tier.color }}
        >
          가장 많이 선택
        </span>
      )}

      <p
        className="text-[12px] font-bold uppercase tracking-[0.06em]"
        style={{ color: tier.colorDeep }}
      >
        {tier.point}
      </p>
      <p
        className={`mt-3 font-extrabold tracking-[-0.015em] text-[var(--text-primary)] ${
          compact ? "text-[26px]" : "text-[48px] lg:text-[72px]"
        }`}
      >
        {feeLabel(tier.fee)}
      </p>
      <p
        className={`mt-1 font-medium text-[var(--text-secondary)] ${
          compact ? "text-[14px]" : "text-[14px] lg:text-[15px]"
        }`}
      >
        {tier.name}
      </p>
    </article>
  );
}
