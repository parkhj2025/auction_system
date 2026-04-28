import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AnalysisFrontmatter } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

/**
 * 물건분석 목록 카드.
 * v2: category·riskLevel·TagItem 배지 폐기 (원칙 5 — 내부 분류 라벨 비노출).
 * round·감정가%·사실 tags만 노출.
 */

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
      <div className="flex items-center justify-end">
        <span className="text-[11px] font-semibold text-[var(--color-ink-500)]">
          {fm.round}회차 · 감정가의 {fm.percent}%
        </span>
      </div>

      <h3 className="mt-4 text-lg font-black tracking-tight text-[var(--color-ink-900)]">
        <Link
          href={`/analysis/${fm.slug}`}
          className="before:absolute before:inset-0 before:content-[''] focus-visible:outline-none focus-visible:before:rounded-[var(--radius-xl)] focus-visible:before:outline focus-visible:before:outline-2 focus-visible:before:outline-offset-2 focus-visible:before:outline-[var(--color-ink-900)]"
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
          <dd className="mt-0.5 tabular-nums text-[length:var(--text-body)] font-black text-[var(--color-accent-red)]">
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
          <dd className="mt-0.5 tabular-nums font-semibold text-[var(--color-ink-900)]">
            {fm.bidDate}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--color-ink-500)]">유형</dt>
          <dd className="mt-0.5 font-semibold text-[var(--color-ink-900)]">
            {fm.propertyType} · {fm.areaPyeong}평
          </dd>
        </div>
      </dl>

      {fm.tags && fm.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {fm.tags.slice(0, 3).map((t) => (
            <li
              key={t}
              className="inline-flex h-6 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-ink-100)] px-2 text-[11px] font-semibold text-[var(--color-ink-700)]"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      <span
        aria-hidden="true"
        className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-ink-900)] transition group-hover:text-black"
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
