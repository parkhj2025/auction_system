"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

/* Phase 1.2 (A-1-2) v10 — Hero 우측 4 카드 grid (lg+ only / mobile 0).
 * 4 카드: 0회 / 5만원~ / 0건 / +5만원 (모두 정적 + scroll fade-in stagger 150ms).
 * 정적 표시 (CountUp 0 / 신뢰 메시지 정합 — Trust "0"과 일관성).
 * 절대 크기: 큰 숫자 80px / 라벨 18px (데스크탑 / 모바일 = 카드 0). */

const CARDS = [
  { value: "0회", label: "법원 방문" },
  { value: "5만원~", label: "기본 수수료" },
  { value: "0건", label: "사고 누적" },
  { value: "+5만원", label: "성공보수만" },
] as const;

export function HeroDifferentiationGrid() {
  return (
    <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4">
      {CARDS.map((card, idx) => (
        <DifferentiationCard
          key={card.label}
          value={card.value}
          label={card.label}
          delay={idx * 150}
        />
      ))}
    </div>
  );
}

function DifferentiationCard({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  const { ref, className, style } = useScrollReveal<HTMLDivElement>({ delay });
  return (
    <div
      ref={ref}
      className={`${className} flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--border-1)] bg-white p-6 transition-[transform,box-shadow] duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]`}
      style={style}
    >
      <span
        className="text-[64px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--brand-green)]"
        style={{ fontWeight: 800 }}
      >
        {value}
      </span>
      <span className="text-[16px] font-medium text-[var(--text-secondary)]">
        {label}
      </span>
    </div>
  );
}
