import type { ReactNode } from "react";

/**
 * 7섹션 공통 헤더 (G1 보강).
 *  - badge prop 폐기 — sub-label chip ("물건 정보" 등) 노출 0
 *  - SectionHeader 만 단독 노출. 본문 직접 연결.
 */
export function SectionHeader({
  num,
  title,
  intro,
}: {
  num: string;
  title: string;
  intro?: ReactNode;
}) {
  return (
    <header
      id={`section-${num}`}
      className="mt-20 scroll-mt-24 border-t border-[var(--color-border)] pt-10 first:mt-0 first:border-t-0 first:pt-0"
    >
      <div className="flex items-baseline gap-4">
        <span className="text-xs font-black uppercase tracking-[0.24em] text-brand-600 tabular-nums">
          {num}
        </span>
        <h2 className="text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
          {title}
        </h2>
      </div>
      {intro ? (
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-ink-500)]">
          {intro}
        </p>
      ) : null}
    </header>
  );
}
