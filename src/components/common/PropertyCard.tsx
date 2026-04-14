import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AnalysisFrontmatter, TagItem } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

const CAT_STYLE: Record<AnalysisFrontmatter["category"], string> = {
  danger:
    "bg-[var(--color-cat-danger-soft)] text-[var(--color-cat-danger)]",
  safe: "bg-[var(--color-cat-safe-soft)] text-[var(--color-cat-safe)]",
  edu: "bg-[var(--color-cat-edu-soft)] text-[var(--color-cat-edu)]",
};

const CAT_LABEL: Record<AnalysisFrontmatter["category"], string> = {
  danger: "주의",
  safe: "안정",
  edu: "교육",
};

const TAG_STYLE: Record<TagItem["type"], string> = {
  danger:
    "border-[var(--color-accent-red)]/25 bg-[var(--color-accent-red-soft)] text-[var(--color-accent-red)]",
  warn:
    "border-[var(--color-accent-yellow)]/40 bg-[var(--color-accent-yellow-soft)] text-[var(--color-ink-900)]",
  safe:
    "border-[var(--color-accent-green)]/25 bg-[var(--color-accent-green-soft)] text-[var(--color-accent-green)]",
  neutral:
    "border-[var(--color-border)] bg-[var(--color-ink-100)] text-[var(--color-ink-700)]",
};

export function PropertyCard({
  frontmatter: fm,
  className = "",
}: {
  frontmatter: AnalysisFrontmatter;
  className?: string;
}) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-bold uppercase tracking-wide ${CAT_STYLE[fm.category]}`}
        >
          {CAT_LABEL[fm.category]}
        </span>
        <span className="text-[11px] font-medium text-[var(--color-ink-500)]">
          {fm.round}회차 · 감정가의 {fm.percent}%
        </span>
      </div>

      <h3 className="mt-4 text-lg font-black tracking-tight text-[var(--color-ink-900)]">
        <Link
          href={`/analysis/${fm.slug}`}
          className="before:absolute before:inset-0 before:content-[''] focus-visible:outline-none focus-visible:before:rounded-[var(--radius-xl)] focus-visible:before:outline focus-visible:before:outline-2 focus-visible:before:outline-offset-2 focus-visible:before:outline-brand-600"
          aria-label={`${fm.title} 상세 분석 열기`}
        >
          {fm.title}
        </Link>
      </h3>
      {fm.subtitle && (
        <p className="mt-1 line-clamp-2 text-sm text-[var(--color-ink-500)]">
          {fm.subtitle}
        </p>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-4 text-xs">
        <div>
          <dt className="text-[var(--color-ink-500)]">최저가</dt>
          <dd className="mt-0.5 tabular-nums text-base font-black text-[var(--color-accent-red)]">
            {formatKoreanWon(fm.minPrice)}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--color-ink-500)]">감정가</dt>
          <dd className="mt-0.5 tabular-nums text-sm font-bold text-[var(--color-ink-900)]">
            {formatKoreanWon(fm.appraisal)}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--color-ink-500)]">입찰일</dt>
          <dd className="mt-0.5 tabular-nums font-medium text-[var(--color-ink-900)]">
            {fm.bidDate}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--color-ink-500)]">유형</dt>
          <dd className="mt-0.5 font-medium text-[var(--color-ink-900)]">
            {fm.propertyType} · {fm.areaPyeong}평
          </dd>
        </div>
      </dl>

      {fm.tags && fm.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {fm.tags.slice(0, 3).map((t) => (
            <li
              key={t.text}
              className={`inline-flex h-6 items-center rounded-full border px-2 text-[11px] font-medium ${TAG_STYLE[t.type]}`}
            >
              {t.text}
            </li>
          ))}
        </ul>
      )}

      <span
        aria-hidden="true"
        className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand-600 transition group-hover:text-brand-700"
      >
        분석 전체 보기
        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </article>
  );
}
