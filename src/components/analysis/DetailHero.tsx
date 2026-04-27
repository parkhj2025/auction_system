"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ChevronRight, Clock } from "lucide-react";
import type { ReactNode } from "react";
import type { AnalysisFrontmatter } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { HeroGallery } from "./HeroGallery";
import { HoverableDropRateBar } from "./HoverableDropRateBar";

/**
 * 분석 상세 Hero — 단계 5-4-2-fix-8 (Linear monochrome 라이트 통일).
 *
 * 룰 27 — Hero 라이트 통일:
 *  - 다크 박스 (DarkInfoCluster bg-ink-900) 폐기
 *  - 단일 흰 카드 (bg-white border-ink-200 rounded-md p-6 sm:p-8)
 *  - 본문 8/8 컴포넌트 표준 직접 흡수
 *
 * 룰 28 — Visual Weight Triangle:
 *  - 사건 제목 = h2 32 / 700 / ink-900
 *  - 가격 수치 = h2 32 / 900 (black) / ink-900 / tabular-nums
 *  - "−30%" 칩 = bg-brand-300/70 + ink-900 + 600 (1 accent)
 *  - 라벨 caption = 500 letter-0.18em ink-500
 *  - 본문 lead = body 16 → body-lg 18 (lg+) / 400 / ink-700
 *  - 서브타이틀 = body-sm 14 / 400 / ink-500
 *  - stat-grid 라벨 = caption 12 / 500 letter-0.05em / ink-500
 *  - stat-grid 수치 = body-lg 18 / 600 / ink-900 / tabular-nums
 *
 * 룰 29 — 카드 내부 구조:
 *  헤더 (원형 + 제목 + 서브) → space-y-6 → 가격 영역 (라벨·수치·칩·progress) → border-t → lead → border-t → stat-grid
 *
 * 룰 22 모션:
 *  - 카드 fade-in 600ms cubic + once: true (Hero 1회 진입 본질)
 *  - HoverableDropRateBar 룰 7 보존 (1.6초 + count-up + once: true 예외)
 *
 * a11y: aria-labelledby="detail-title" + 의미 마크업 h1 보존.
 */
export function DetailHero({ fm }: { fm: AnalysisFrontmatter }) {
  const depositAmount = computeDeposit(fm.minPrice);
  const cardRef = useRef<HTMLElement>(null);
  // once: true 사유: Hero 카드 1회 진입 본질 (룰 22 일부 부분 정합)
  const cardInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
    <section
      aria-labelledby="detail-title"
      className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Breadcrumb (Hero 카드 외 — 페이지 상단 보존) */}
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

        {/* Tags chips (Hero 카드 외) */}
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

        {/* 룰 27 — 단일 흰 카드 (DarkInfoCluster 폐기) */}
        <motion.article
          ref={cardRef}
          className="mt-8 rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white p-6 sm:p-8"
          initial={{ opacity: 0, y: 8 }}
          animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 헤더: 원형 56/48 썸네일 + 사건 제목 + 사건번호 */}
          <header className="flex items-start gap-4 sm:gap-6">
            {fm.coverImage ? (
              <div
                aria-hidden="true"
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-ink-200)] sm:h-14 sm:w-14"
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
            <div className="min-w-0 flex-1">
              {/* 룰 28 — 사건 제목 h2 32 / 700 / ink-900 (Q25) */}
              <h1
                id="detail-title"
                className="text-[length:var(--text-h2)] font-bold leading-[var(--lh-snug)] tracking-tight text-[var(--color-ink-900)]"
              >
                {fm.title}
              </h1>
              {/* 룰 28 — 서브타이틀 body-sm 14 / 400 / ink-500 */}
              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[length:var(--text-body-sm)] text-[var(--color-ink-500)]">
                <span className="font-medium text-[var(--color-ink-700)]">
                  {fm.court}
                  {fm.courtDivision ? ` ${fm.courtDivision}` : ""}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">사건 {fm.caseNumber}</span>
                <span aria-hidden="true">·</span>
                <span>{fm.address}</span>
              </p>
            </div>
          </header>

          {/* 룰 29 step 5 — 가격 영역 */}
          <div className="mt-6">
            {/* 룰 28 — caption 12 / 500 letter-0.18em / ink-500 uppercase */}
            <p className="text-[length:var(--text-caption)] font-medium uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
              {fm.round}차 최저가
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              {/* 룰 28 — 가격 수치 h2 32 / 900 (black) / ink-900 / tabular-nums */}
              <p className="text-[length:var(--text-h2)] font-black leading-[var(--lh-tight)] tabular-nums tracking-tight text-[var(--color-ink-900)]">
                {fm.minPriceDisplay ?? formatKoreanWon(fm.minPrice)}
              </p>
              {/* 룰 28 — body-lg 18 / 400 / ink-700 */}
              <p className="text-[length:var(--text-body-lg)] font-medium tabular-nums text-[var(--color-ink-700)]">
                감정가의 {fm.percent}%
              </p>
            </div>
            {/* 룰 30 — HoverableDropRateBar 라이트 토큰 (fix-8 색 전환). brand-300/70 칩 + progress bar */}
            <HoverableDropRateBar
              appraisal={fm.appraisal}
              minPrice={fm.minPrice}
              percent={fm.percent}
              appraisalLabel={fm.appraisalDisplay}
            />
          </div>

          {/* 룰 29 step 6 — border-t + lead summary */}
          {fm.summary ? (
            <>
              <hr className="mt-6 border-t border-[var(--color-ink-200)]" />
              <p className="mt-6 max-w-3xl text-[length:var(--text-body)] leading-[var(--lh-relaxed)] text-[var(--color-ink-700)] line-clamp-3 lg:text-[length:var(--text-body-lg)]">
                {fm.summary}
              </p>
            </>
          ) : null}

          {/* 룰 29 step 8 — border-t + stat-grid (Q26-1 row tone 평탄 / Q27 mobile 3-col 유지) */}
          <hr className="mt-6 border-t border-[var(--color-ink-200)]" />
          <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-ink-200)]">
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
          </dl>
        </motion.article>

        {/* 갤러리 carousel — 룰 18 hotfix e099ce6 보존 */}
        <div className="mt-7">
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
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 bg-white p-4 text-[var(--color-ink-900)] sm:p-5">
      {/* 룰 28 — caption 12 / 500 letter-0.05em / ink-500 uppercase */}
      <dt className="flex items-center gap-1.5 text-[length:var(--text-caption)] font-medium uppercase tracking-[0.05em] text-[var(--color-ink-500)]">
        {icon}
        {label}
      </dt>
      {/* 룰 28 — body-lg 18 / 600 / ink-900 / tabular-nums */}
      <dd className="mt-1 text-[length:var(--text-body-lg)] font-semibold leading-[var(--lh-tight)] tabular-nums">
        {value}
      </dd>
      {/* 룰 28 — caption 12 / 500 / ink-500 */}
      <dd className="text-[length:var(--text-caption)] font-medium tabular-nums text-[var(--color-ink-500)]">
        {sub}
      </dd>
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
