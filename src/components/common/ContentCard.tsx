import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatKoreanDate } from "@/lib/utils";

/**
 * 콘텐츠 목록 카드 (guide / news / notice 공용).
 * PropertyCard와 달리 가격 데이터가 없는 블로그형 카드.
 * 제목 링크에 `before:absolute inset-0` 의사 요소로 카드 전체 클릭 영역.
 */
export function ContentCard({
  href,
  eyebrow,
  title,
  subtitle,
  date,
  meta,
  tags,
}: {
  href: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  date: string;
  /** 카드 상단 우측에 작게 노출되는 뱃지 (난이도 / 지역 등) */
  meta?: string;
  tags?: string[];
}) {
  return (
    <article className="group relative flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex h-6 items-center rounded-full bg-[var(--color-ink-100)] px-2.5 text-[11px] font-black uppercase tracking-wider text-[var(--color-ink-700)]">
          {eyebrow}
        </span>
        {meta && (
          <span className="text-[11px] font-medium text-[var(--color-ink-500)]">
            {meta}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-black tracking-tight text-[var(--color-ink-900)]">
        <Link
          href={href}
          className="before:absolute before:inset-0 before:content-[''] focus-visible:outline-none focus-visible:before:rounded-[var(--radius-xl)] focus-visible:before:outline focus-visible:before:outline-2 focus-visible:before:outline-offset-2 focus-visible:before:outline-[var(--color-ink-900)] group-hover:text-black"
        >
          {title}
        </Link>
      </h3>

      {subtitle && (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-ink-500)]">
          {subtitle}
        </p>
      )}

      {tags && tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((t) => (
            <li
              key={t}
              className="inline-flex h-6 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2 text-[11px] font-medium text-[var(--color-ink-700)]"
            >
              #{t}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-6">
        <p className="text-xs font-medium text-[var(--color-ink-500)] tabular-nums">
          {formatKoreanDate(date)}
        </p>
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-ink-900)] transition group-hover:text-black"
        >
          읽기
          <ArrowRight
            size={14}
            className="transition group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </article>
  );
}
