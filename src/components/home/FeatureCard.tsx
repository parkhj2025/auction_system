"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

/* Phase 1.2 (A-1-2) v12 — FeatureCard (모바일 vertical stack / border-left 폐기 / 컬러 믹싱).
 * 정정 6건:
 * 1. border-left 4px green 영구 폐기 (AI 슬롭 디자인)
 * 2. 카드 정방형 (mobile: aspect 보존 / desktop = FeaturesStickyDesktop 별도)
 * 3. 컬러 믹싱: 카드 1·3 = green / 카드 2 = yellow (서브 컬러 단독 강조)
 * 4. 국소 그라데이션 blob (radial-gradient 카드 모서리)
 * 5. 색감 그림자 (활성 카드 = scroll reveal in-view)
 * 6. 모바일 = vertical stack 보존 (sticky 부적합) */

export type FeatureColor = "green" | "yellow" | "green-yellow";

const CARD_STYLES: Record<FeatureColor, { background: string; shadow: string; accent: string }> = {
  green: {
    background:
      "radial-gradient(circle at 0% 0%, rgba(0, 200, 83, 0.15) 0%, transparent 50%), white",
    shadow:
      "0 20px 40px -12px rgba(0, 200, 83, 0.25), 0 0 0 1px rgba(0, 200, 83, 0.05)",
    accent: "#00C853",
  },
  yellow: {
    background:
      "radial-gradient(circle at 100% 0%, rgba(255, 212, 59, 0.20) 0%, transparent 50%), white",
    shadow:
      "0 20px 40px -12px rgba(255, 212, 59, 0.30), 0 0 0 1px rgba(255, 212, 59, 0.08)",
    accent: "#FFD43B",
  },
  "green-yellow": {
    background:
      "radial-gradient(circle at 0% 100%, rgba(0, 200, 83, 0.15) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(255, 212, 59, 0.18) 0%, transparent 40%), white",
    shadow:
      "0 20px 40px -12px rgba(120, 180, 70, 0.25), 0 0 0 1px rgba(120, 180, 70, 0.06)",
    accent: "#00C853",
  },
};

import type { LucideIcon } from "lucide-react";

export type FeatureCardProps = {
  Icon: LucideIcon;
  value: string;
  title: string;
  desc: string;
  delay?: number;
  isWide?: boolean;
  color?: FeatureColor;
};

export function FeatureCard({
  Icon,
  value,
  title,
  desc,
  delay = 0,
  isWide = false,
  color = "green",
}: FeatureCardProps) {
  const { ref, className: revealClass, style: revealStyle } =
    useScrollReveal<HTMLLIElement>({ delay });
  const style = CARD_STYLES[color];

  return (
    <li
      ref={ref}
      className={`${revealClass} group flex flex-col gap-4 rounded-3xl p-5 transition-[transform,box-shadow] duration-[300ms] ease-out hover:-translate-y-1 ${isWide ? "col-span-2" : "col-span-1"}`}
      style={{
        ...revealStyle,
        background: style.background,
        boxShadow: style.shadow,
      }}
    >
      <Icon size={isWide ? 64 : 48} strokeWidth={2} style={{ color: style.accent }} />
      <div>
        <span
          className={`block font-extrabold leading-[1.1] tracking-[-0.015em] ${isWide ? "text-[64px]" : "text-[44px]"}`}
          style={{ fontWeight: 800, color: style.accent }}
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
