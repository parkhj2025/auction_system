import type { ReactNode } from "react";

/* Phase 1.2 (A-1-2) v39 — PageHero (sub-page Hero 광역 템플릿).
 * Props: eyebrow + title (ReactNode / accent 자유) + subtitle + children (칩/nav 광역).
 * paradigm: bg-gray-surface-muted + 광역 max-w + 좌측 정렬 + h1 메인 paradigm 정합. */

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
      <div className="container-app w-full py-16 lg:py-24">
        <p className="text-xs font-bold uppercase tracking-wider text-[#111418]">
          {eyebrow}
        </p>
        <h1
          className="mt-2 text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[#111418] [text-wrap:balance] lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-[16px] leading-7 text-gray-600 lg:text-[20px]">
          {subtitle}
        </p>
        {children && <div className="mt-8 lg:mt-10">{children}</div>}
      </div>
    </section>
  );
}
