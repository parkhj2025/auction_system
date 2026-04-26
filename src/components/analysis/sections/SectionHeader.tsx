import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

/**
 * 7섹션 공통 헤더.
 * tone 분기 폐기 — 단색 neutral 만 사용.
 * 분류 신호(색·배지·아이콘)는 색이 아닌 사실 어휘로만 표현.
 */
export function SectionHeader({
  num,
  title,
  badge,
  intro,
}: {
  num: string;
  title: string;
  badge?: string;
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
      {badge ? (
        <div className="mt-3">
          <Badge
            variant="outline"
            className="border-[var(--color-border)] bg-[var(--color-surface-muted)] text-xs font-bold tracking-tight text-[var(--color-ink-700)]"
          >
            {badge}
          </Badge>
        </div>
      ) : null}
      {intro ? (
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-ink-500)]">
          {intro}
        </p>
      ) : null}
    </header>
  );
}
