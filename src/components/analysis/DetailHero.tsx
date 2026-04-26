import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import type { ReactNode } from "react";
import type { AnalysisFrontmatter } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { HeroGallery } from "./HeroGallery";

/**
 * 분석 상세 Hero.
 *  - Breadcrumb / tags / title / summary / meta line
 *  - 4-cell stat grid (감정가 / N차 최저가 [accent] / 입찰보증금 / 입찰기일)
 *  - HeroGallery (1 main + 4 thumbs strip)
 *
 * 보증금: meta.json wiring 미적용 단계 — 최저가 × 10% 기본 가정.
 *   재경매·고압 보증금율은 단계 3-2 어댑터 후 정밀화.
 */
export function DetailHero({ fm }: { fm: AnalysisFrontmatter }) {
  const depositAmount = computeDeposit(fm.minPrice);
  const depositSub = "최저가의 10% (기본 가정)";

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
            물건분석
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="line-clamp-1 max-w-[18rem] text-[var(--color-ink-700)]">
            {fm.sigungu ?? "인천"} · {fm.propertyType}
          </span>
        </nav>

        {/* Tags chips — 사실 어휘만 (분류 의미 부여 0) */}
        {fm.tags && fm.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap items-center gap-1.5">
            {fm.tags.slice(0, 7).map((t) => (
              <span
                key={t}
                className="inline-flex h-6 items-center rounded-[var(--radius-xs)] bg-[var(--color-ink-100)] px-2 text-[11px] font-medium text-[var(--color-ink-700)]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* Title */}
        <h1
          id="detail-title"
          className="mt-5 max-w-4xl text-3xl font-black leading-[1.2] tracking-tight text-[var(--color-ink-900)] sm:text-[40px] sm:leading-[1.15]"
        >
          {fm.title}
        </h1>

        {/* Summary */}
        {fm.summary ? (
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-ink-500)] sm:text-lg sm:leading-8">
            {fm.summary}
          </p>
        ) : null}

        {/* Meta line */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[var(--color-ink-500)]">
          <span className="font-semibold text-[var(--color-ink-700)]">
            {fm.court}
            {fm.courtDivision ? ` ${fm.courtDivision}` : ""}
          </span>
          <span className="tabular-nums">사건 {fm.caseNumber}</span>
          <span>{fm.address}</span>
        </div>

        {/* Key numbers — 4-cell stat grid */}
        <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-border)] lg:grid-cols-4">
          <Stat
            label="감정가"
            value={fm.appraisalDisplay ?? formatKoreanWon(fm.appraisal)}
            sub="기준가"
          />
          <Stat
            label={`${fm.round}차 최저가`}
            value={fm.minPriceDisplay ?? formatKoreanWon(fm.minPrice)}
            sub={`감정가의 ${fm.percent}%`}
            accent
          />
          <Stat
            label="입찰보증금"
            value={formatKoreanWon(depositAmount)}
            sub={depositSub}
          />
          <Stat
            label="입찰기일"
            value={fm.bidDate}
            sub={`${fm.bidTime ?? "10:00"} · ${formatDay(fm.bidDate)}`}
            icon={<Clock size={13} aria-hidden="true" />}
          />
        </div>

        {/* Gallery */}
        <div className="mt-6">
          <HeroGallery
            coverImage={fm.coverImage}
            alt={`${fm.buildingName ?? fm.title} 외관 대표 사진`}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-1 p-5 ${
        accent
          ? "bg-[var(--color-brand-600)] text-white"
          : "bg-white text-[var(--color-ink-900)]"
      }`}
    >
      <p
        className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${
          accent ? "text-white/80" : "text-[var(--color-ink-500)]"
        }`}
      >
        {icon}
        {label}
      </p>
      <p className="mt-1 text-xl font-black leading-tight tabular-nums sm:text-2xl">
        {value}
      </p>
      <p
        className={`text-[11px] font-medium tabular-nums ${
          accent ? "text-white/75" : "text-[var(--color-ink-500)]"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}

function computeDeposit(minPrice: number): number {
  return Math.round(minPrice * 0.1);
}

function formatDay(yyyyMmDd: string): string {
  if (!yyyyMmDd) return "";
  const d = new Date(yyyyMmDd);
  if (Number.isNaN(d.getTime())) return "";
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${days[d.getDay()]}요일`;
}

