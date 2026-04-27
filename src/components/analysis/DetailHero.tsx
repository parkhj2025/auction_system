import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import type { ReactNode } from "react";
import type { AnalysisFrontmatter } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { HeroGallery } from "./HeroGallery";
import { HoverableDropRateBar } from "./HoverableDropRateBar";

/**
 * 분석 상세 Hero — 단계 5-4-2-fix-7 룰 26 (영역 통합 정보 꾸러미).
 *
 * 통합 layout:
 *  ┌ breadcrumbs · 사건 카테고리 칩 (페이지 최상단 보존)
 *  ├ 다크 박스 (정보 꾸러미 1)
 *  │   원형 56/48 + 우측 stack (제목·서브타이틀·가격·라벨·progress bar)
 *  ├ 흰 배경 영역 (정보 꾸러미 2)
 *  │   본문 산문 + border-t + stat-grid (분리 박스 X)
 *  └ 사진 carousel (HeroGallery)
 *
 * a11y: h1 의미 마크업 보존 (다크 박스 안 위치). 시각 토큰은 Phase 3 (룰 24 정정)에서 h3.
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
          className="flex items-center gap-1 text-[length:var(--text-caption)] font-medium text-[var(--color-ink-500)]"
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
                className="inline-flex h-6 items-center rounded-[var(--radius-xs)] bg-[var(--color-ink-100)] px-2 text-[length:var(--text-caption)] font-medium text-[var(--color-ink-700)]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* 룰 26 — 다크 박스 (정보 꾸러미 1) */}
        <DarkInfoCluster fm={fm} />

        {/* 룰 26 — 흰 배경 영역 (정보 꾸러미 2: 본문 산문 + stat-grid) */}
        <div className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 sm:p-8">
          {fm.summary ? (
            <p className="max-w-3xl text-[length:var(--text-body)] leading-[var(--lh-relaxed)] text-[var(--color-ink-700)] line-clamp-3 lg:text-[length:var(--text-body-lg)]">
              {fm.summary}
            </p>
          ) : null}
          {/* border-t 약한 ink-200 + padding-top 24 (분리 박스 X) */}
          <div className="mt-6 grid grid-cols-1 gap-px border-t border-[var(--color-ink-200)] bg-[var(--color-border)] pt-px sm:grid-cols-3">
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

        {/* 갤러리 strip — Hero 본문 하부 carousel (룰 18 보존) */}
        <HeroGallery
          coverImage={fm.coverImage}
          alt={`${fm.buildingName ?? fm.title} 외관 대표 사진`}
        />
      </div>
    </section>
  );
}

/**
 * 룰 26-B — 다크 박스 안 통합 layout.
 * 좌측 원형 + 우측 stack (제목·서브타이틀·가격·라벨·progress bar).
 */
function DarkInfoCluster({ fm }: { fm: AnalysisFrontmatter }) {
  return (
    <div className="mt-8 flex flex-col gap-5 rounded-[var(--radius-xl)] bg-[var(--color-ink-900)] p-6 text-white sm:flex-row sm:gap-6 sm:p-8">
      {/* 좌측 원형 썸네일 */}
      {fm.coverImage ? (
        <div
          aria-hidden="true"
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white/30 sm:h-14 sm:w-14"
        >
          <Image
            src={fm.coverImage}
            alt={`${fm.buildingName ?? fm.title} 대표 사진`}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
      ) : null}

      {/* 우측 stack: 제목 + 서브타이틀 + 가격 + 라벨 + progress bar */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {/* 룰 24-C 정정 (Phase 3 적용 영역) — Tier 2 페이지 제목 h3 / 600 / white 90 */}
        <div>
          <h1
            id="detail-title"
            className="text-[length:var(--text-h3)] font-semibold leading-[var(--lh-snug)] tracking-tight text-white/90"
          >
            {fm.title}
          </h1>
          {/* Tier 3 서브타이틀 — body-sm / 400 / white 60 */}
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[length:var(--text-body-sm)] text-white/60">
            <span className="font-medium text-white/70">
              {fm.court}
              {fm.courtDivision ? ` ${fm.courtDivision}` : ""}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">사건 {fm.caseNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{fm.address}</span>
          </p>
        </div>

        {/* 가격 + 라벨 영역 */}
        <div>
          {/* Tier 2 "{round}차 최저가" 라벨 — body-lg / 500 / white 70 */}
          <p className="text-[length:var(--text-body-lg)] font-medium tracking-wide text-white/70">
            {fm.round}차 최저가
          </p>
          {/* Tier 1 가격 수치 — h2 / 700 / white 100 / tabular-nums */}
          <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="text-[length:var(--text-h2)] font-bold leading-[var(--lh-tight)] tabular-nums tracking-tight text-white">
              {fm.minPriceDisplay ?? formatKoreanWon(fm.minPrice)}
            </p>
            <p className="text-[length:var(--text-body-lg)] font-medium tabular-nums text-white/70">
              감정가의 {fm.percent}%
            </p>
          </div>
        </div>

        {/* progress bar */}
        <HoverableDropRateBar
          appraisal={fm.appraisal}
          minPrice={fm.minPrice}
          percent={fm.percent}
          appraisalLabel={fm.appraisalDisplay}
        />
      </div>
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

function formatDay(yyyyMmDd: string): string {
  if (!yyyyMmDd) return "";
  const d = new Date(yyyyMmDd);
  if (Number.isNaN(d.getTime())) return "";
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${days[d.getDay()]}요일`;
}
