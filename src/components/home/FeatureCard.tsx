"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

/* Phase 1.2 (A-1-2) v10 — FeatureCard (mobile vertical stack 강화 / bento 비율).
 * isWide = true → 1번 큰 카드 (col-span-2 full width)
 * isWide = false → 2-3 작은 카드 (col-span-1 = 50% width)
 * scroll 진입: opacity 0→1 + translateY 30→0 + scale 0.95→1 + active border-left 4px green (in-view).
 * stagger: 150ms (Hero / Insight 일관성). */

export type FeatureCardProps = {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  title: string;
  desc: string;
  delay?: number;
  isWide?: boolean;
};

export function FeatureCard({
  Icon,
  value,
  title,
  desc,
  delay = 0,
  isWide = false,
}: FeatureCardProps) {
  const { ref, className, style } =
    useScrollReveal<HTMLLIElement>({ delay });

  return (
    <li
      ref={ref}
      className={`${className} feature-card group flex flex-col gap-4 rounded-3xl border-l-4 border-l-transparent border border-[var(--border-1)] bg-white p-5 transition-[transform,box-shadow,border-color] duration-[300ms] ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] ${isWide ? "col-span-2" : "col-span-1"}`}
      style={style}
    >
      <Icon size={isWide ? 64 : 48} className="text-[var(--brand-green)]" />
      <div>
        <span
          className={`block font-extrabold leading-none tracking-[-0.025em] text-[var(--text-primary)] ${isWide ? "text-[80px]" : "text-[56px]"}`}
          style={{ fontWeight: 800 }}
        >
          {value}
        </span>
        <h3
          className={`mt-3 font-bold leading-[1.3] tracking-[-0.01em] text-[var(--text-primary)] ${isWide ? "text-[22px]" : "text-[17px]"}`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 font-medium leading-[1.6] text-[var(--text-secondary)] ${isWide ? "text-[16px]" : "text-[14px]"}`}
        >
          {desc}
        </p>
      </div>
    </li>
  );
}
