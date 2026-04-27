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
      className="mt-20 scroll-mt-24 border-t border-[var(--color-border)] pt-10 first:mt-0 first:border-t-0 first:pt-0 sm:mt-32 sm:pt-12"
    >
      <div className="flex items-baseline gap-4">
        <span className="text-[length:var(--text-caption)] font-black uppercase tracking-[0.24em] text-[var(--color-ink-500)] tabular-nums">
          {num}
        </span>
        <h2 className="text-[length:var(--text-h2)] font-black tracking-tight leading-[var(--lh-snug)] text-[var(--color-ink-900)]">
          {title}
        </h2>
      </div>
      {intro ? (
        <p className="mt-3 max-w-3xl text-[length:var(--text-body-sm)] leading-relaxed text-[var(--color-ink-500)]">
          {intro}
        </p>
      ) : null}
    </header>
  );
}
