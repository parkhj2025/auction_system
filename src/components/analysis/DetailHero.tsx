import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import type { ReactNode } from "react";
import type { AnalysisFrontmatter } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { HeroGallery } from "./HeroGallery";
import { HoverableDropRateBar } from "./HoverableDropRateBar";

/**
 * 분석 상세 Hero (G1 보강).
 *  - h1 위계 강화: text-4xl→text-6xl, font-extrabold, lead 의 1.5배 이상
 *  - 메타 라인: h1 직하 단일 행 inline (법원·사건·주소)
 *  - lead: text-base lg:text-lg ink-700, line-clamp-3 fallback
 *  - 단일 컬럼 (우측 photos column 폐기)
 *  - stat-grid 후 갤러리 strip 가로 4열 (Hero 본문 하부)
 */
export function DetailHero({ fm }: { fm: AnalysisFrontmatter }) {
  const depositAmount = computeDeposit(fm.minPrice);

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

        {/* Tags chips */}
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

        {/* H1 — 룰 24-A·B (단계 5-4-2-fix-6): h1 토큰 + weight 600 (semibold). display 토큰 폐기. */}
        <h1
          id="detail-title"
          className="mt-5 max-w-4xl text-[length:var(--text-h1)] font-semibold leading-[var(--lh-snug)] tracking-tight text-[var(--color-ink-900)]"
        >
          {fm.title}
        </h1>

        {/* Meta line — h1 직하 단일 행 (Tier 3 body 16 ink-500) */}
        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[length:var(--text-body-sm)] text-[var(--color-ink-500)]">
          <span className="font-semibold text-[var(--color-ink-700)]">
            {fm.court}
            {fm.courtDivision ? ` ${fm.courtDivision}` : ""}
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">사건 {fm.caseNumber}</span>
          <span aria-hidden="true">·</span>
          <span>{fm.address}</span>
        </p>

        {/* Lead (summary) — Tier 2 body-lg ink-700 */}
        {fm.summary ? (
          <p className="mt-3 max-w-3xl text-[length:var(--text-body)] leading-[var(--lh-relaxed)] text-[var(--color-ink-700)] line-clamp-3 lg:text-[length:var(--text-body-lg)]">
            {fm.summary}
          </p>
        ) : null}

        {/* 단계 5-2 #2: Hero stat — dominant + supporting 위계.
         *  · dominant: {round}차 최저가 (Hero 의 핵심 결정 정보)
         *    - text-numeric-dominant (48px)
         *    - 감정가 대비 하락률 (computed) 표시
         *  · supporting: 감정가 / 입찰보증금 / 입찰기일 (3-cell)
         *  근거: frontend-design "dominant + sharp accents" + ui-ux-pro-max "primary-action" + visual-hierarchy. */}
        <div className="mt-9 space-y-px overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-border)]">
          <DominantStat
            label={`${fm.round}차 최저가`}
            value={fm.minPriceDisplay ?? formatKoreanWon(fm.minPrice)}
            appraisal={fm.appraisal}
            minPrice={fm.minPrice}
            percentOfAppraisal={fm.percent}
            appraisalDisplay={fm.appraisalDisplay}
            thumbnail={fm.coverImage}
            thumbnailAlt={`${fm.buildingName ?? fm.title} 대표 사진`}
          />
          <div className="grid grid-cols-3 gap-px bg-[var(--color-border)]">
            <Stat
              label="감정가"
              value={fm.appraisalDisplay ?? formatKoreanWon(fm.appraisal)}
              sub="기준가"
            />
            <Stat
              label="입찰보증금"
              value={formatKoreanWon(depositAmount)}
              sub="최저가의 10%"
            />
            <Stat
              label="입찰기일"
              value={fm.bidDate}
              sub={`${fm.bidTime ?? "10:00"} · ${formatDay(fm.bidDate)}`}
              icon={<Clock size={13} aria-hidden="true" />}
            />
          </div>
        </div>

        {/* 갤러리 strip — Hero 본문 하부 가로 4열 */}
        <HeroGallery
          coverImage={fm.coverImage}
          alt={`${fm.buildingName ?? fm.title} 외관 대표 사진`}
        />
      </div>
    </section>
  );
}

/** 단계 5-4-2: Hero DominantStat + HoverableDropRateBar 통합 (Show-and-Play 본질).
 *  단계 5-2 dominant 구조 보존 + DropRateBar 가 −30% 칩을 다이어그램 안에 통합. */
function DominantStat({
  label,
  value,
  appraisal,
  minPrice,
  percentOfAppraisal,
  appraisalDisplay,
  thumbnail,
  thumbnailAlt,
}: {
  label: string;
  value: string;
  appraisal: number;
  minPrice: number;
  percentOfAppraisal: number;
  appraisalDisplay?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
}) {
  return (
    <div className="flex flex-col gap-3 bg-[var(--color-ink-900)] p-6 text-white sm:p-8">
      {/* Tier 2 라벨 — body-lg 18 / 500 / white 70% */}
      <p className="text-[length:var(--text-body-lg)] font-medium tracking-wide text-white/70">
        {label}
      </p>
      {/* 룰 15-A: 좌측 48px (mobile) / 56px (sm+) 원형 썸네일 + 우측 가격 가로 layout (룰 24-A·B 동등 h1) */}
      <div className="flex items-center gap-4">
        {thumbnail ? (
          <div
            aria-hidden="true"
            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white/30 sm:h-14 sm:w-14"
          >
            <Image
              src={thumbnail}
              alt={thumbnailAlt ?? ""}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="flex flex-1 flex-wrap items-baseline gap-x-4 gap-y-1">
          {/* Tier 1 가격 수치 — h1 40 (mobile auto h2 32) / 700 (bold) / white 100% / tabular-nums */}
          <p className="text-[length:var(--text-h1)] font-bold leading-[var(--lh-tight)] tabular-nums tracking-tight text-white">
            {value}
          </p>
          {/* Tier 2 % 라벨 — body-lg 18 / 500 / white 70% */}
          <p className="text-[length:var(--text-body-lg)] font-medium tabular-nums text-white/70">
            감정가의 {percentOfAppraisal}%
          </p>
        </div>
      </div>
      <HoverableDropRateBar
        appraisal={appraisal}
        minPrice={minPrice}
        percent={percentOfAppraisal}
        appraisalLabel={appraisalDisplay}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 bg-white p-4 text-[var(--color-ink-900)] sm:p-5">
      {/* Tier 4 라벨 — caption 12 / 500 / letter-spacing 0.05em / ink-500 */}
      <p className="flex items-center gap-1.5 text-[length:var(--text-caption)] font-medium uppercase tracking-[0.05em] text-[var(--color-ink-500)]">
        {icon}
        {label}
      </p>
      {/* Tier 3 stat 수치 — body-lg 18 / 600 / tabular-nums / ink-900 */}
      <p className="mt-1 text-[length:var(--text-body-lg)] font-semibold leading-[var(--lh-tight)] tabular-nums">
        {value}
      </p>
      {/* Tier 4 sub — caption / 500 / ink-500 */}
      <p className="text-[length:var(--text-caption)] font-medium tabular-nums text-[var(--color-ink-500)]">
        {sub}
      </p>
    </div>
  );
}

function computeDeposit(minPrice: number): number {
  return Math.round(minPrice * 0.1);
}

// 단계 5-4-2: computeDropRate 는 HoverableDropRateBar 컴포넌트로 이동.

function formatDay(yyyyMmDd: string): string {
  if (!yyyyMmDd) return "";
  const d = new Date(yyyyMmDd);
  if (Number.isNaN(d.getTime())) return "";
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${days[d.getDay()]}요일`;
}
