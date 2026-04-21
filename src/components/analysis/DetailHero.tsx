import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { AnalysisFrontmatter } from "@/types/content";
import { AnalysisMdxImage } from "./AnalysisMdxImage";
import { formatKoreanWon } from "@/lib/utils";

export function DetailHero({ fm }: { fm: AnalysisFrontmatter }) {
  return (
    <section
      aria-labelledby="detail-title"
      className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-xs font-medium text-[var(--color-ink-500)]"
        >
          <Link href="/" className="hover:text-[var(--color-ink-900)]">
            홈
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link href="/analysis" className="hover:text-[var(--color-ink-900)]">
            무료 물건분석
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="line-clamp-1 max-w-[16rem] text-[var(--color-ink-700)]">
            {fm.buildingName ?? fm.title}
          </span>
        </nav>

        {/* Badges — 사실 정보만 (v2 원칙 5: 내부 분류 라벨 비노출) */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 items-center rounded-full border border-[var(--color-border)] bg-white px-3 text-xs font-bold text-[var(--color-ink-700)]">
            {fm.round}회차 · 감정가의 {fm.percent}%
          </span>
          <span className="inline-flex h-7 items-center rounded-full border border-[var(--color-border)] bg-white px-3 text-xs font-bold text-[var(--color-ink-700)]">
            {fm.propertyType} · {fm.auctionType}
          </span>
        </div>

        {/* Title */}
        <h1
          id="detail-title"
          className="mt-6 text-3xl font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-4xl"
        >
          {fm.title}
        </h1>

        {/* Summary */}
        {fm.summary && (
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-ink-500)] sm:text-lg sm:leading-8">
            {fm.summary}
          </p>
        )}

        {/* Meta line */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--color-ink-500)]">
          <span className="font-medium text-[var(--color-ink-700)]">
            {fm.court}
            {fm.courtDivision ? ` ${fm.courtDivision}` : ""}
          </span>
          <span>사건번호 {fm.caseNumber}</span>
          <span>
            입찰일 {fm.bidDate}
            {fm.bidTime ? ` ${fm.bidTime}` : ""}
          </span>
          <span>{fm.address}</span>
        </div>

        {/* Cover + price 3-cell */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
          <AnalysisMdxImage
            src={fm.coverImage}
            alt={`${fm.buildingName ?? fm.title} 커버 이미지`}
          />

          <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
                감정가
              </p>
              <p className="mt-1 text-2xl font-black tabular-nums text-[var(--color-ink-900)]">
                {fm.appraisalDisplay ?? formatKoreanWon(fm.appraisal)}
              </p>
            </div>
            <div className="border-t border-[var(--color-border)] pt-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
                {fm.round}차 최저가 ({fm.percent}%)
              </p>
              <p className="mt-1 text-3xl font-black tabular-nums text-[var(--color-accent-red)] sm:text-4xl">
                {fm.minPriceDisplay ?? formatKoreanWon(fm.minPrice)}
              </p>
            </div>
            <div className="border-t border-[var(--color-border)] pt-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
                면적
              </p>
              <p className="mt-1 text-base font-bold tabular-nums text-[var(--color-ink-900)]">
                {fm.areaM2.toLocaleString("ko-KR")}㎡ ({fm.areaPyeong.toLocaleString("ko-KR")}평)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
