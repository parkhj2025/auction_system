"use client";

/**
 * 분석 상세 Hero — 단계 5-4-3 옵션 C Asymmetric 재구성.
 *
 * 룰 18 갱신 — Hero 카드 안 사진 통합:
 *  - 외부 HeroGallery carousel 폐기 (분기 b: HeroGallery git rm + DetailHero 흡수)
 *  - 우측 사진 영역 = 큰 1장 (rows[0] aspect-4/3) + thumbs row (rows[1])
 *  - photos.length 별 단계 (0~1 단일 / 2 cols-1 / 3 cols-2 / 4 cols-3 / 5+ +N 오버레이)
 *
 * 룰 26 갱신 — 통합 정보 꾸러미 (좌우 비대칭):
 *  - 단일 흰 카드 + 좌우 grid (lg+ 1.4fr 1fr / lg 미만 single column)
 *  - 좌측 = 헤더 + 가격 + HoverableDropRateBar
 *  - 우측 = 사진 영역
 *  - 하단 width 100% = lead summary + stat-grid 4-col
 *
 * 룰 28 갱신 — Visual Weight Triangle (제목 시각 우위):
 *  - h1 사건 제목 = clamp(2rem, 5vw, 3.5rem) / 700 / leading-[1.1] / tracking-[-0.02em] / [text-wrap:balance]
 *  - 가격 수치 = text-[28px] sm:text-[32px] / 600 / tabular-nums (시각 무게 ↓)
 *  - 칩 brand-300/70 + 600 (룰 24-D 1 accent only 보존)
 *
 * 룰 27 — Hero 라이트 통일 보존 (단일 흰 카드 + ink-200 border)
 * 룰 30 — HoverableDropRateBar ink tier 보존 (props 변경 0)
 * 룰 7 — fill bar 1.6초 + count-up 1600ms + once: true 보존
 * 룰 22 — 카드 fade-in 600ms + once: true 보존 (사유: Hero 1회 진입 본질, 재진입 stagger 회피)
 *
 * a11y: aria-labelledby="detail-title" + h1 id="detail-title" + Lightbox role="dialog".
 */
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ChevronRight, Clock } from "lucide-react";
import type { ReactNode } from "react";
import type { AnalysisFrontmatter } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { HoverableDropRateBar } from "./HoverableDropRateBar";
import { Lightbox } from "./Lightbox";

export function DetailHero({ fm }: { fm: AnalysisFrontmatter }) {
  const depositAmount = computeDeposit(fm.minPrice);
  const cardRef = useRef<HTMLElement>(null);
  // once: true 사유: Hero 카드 1회 진입 본질 (룰 22). 재진입 stagger 회피, 사용자 스크롤 노이즈 방지.
  const cardInView = useInView(cardRef, { once: true, amount: 0.2 });

  // 사진 영역 — coverImage 기반 4장 자동 생성 + onError 영역 자동 제거 (HeroGallery 폐기 후 흡수)
  const initialPhotos = deriveThumbs(fm.coverImage, 4);
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const photoCount = photos.length;
  const altBase = `${fm.buildingName ?? fm.title} 사진`;

  const handlePhotoError = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <section
      aria-labelledby="detail-title"
      className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Breadcrumb (Hero 카드 외) */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-[length:var(--text-caption)] font-semibold text-[var(--color-ink-500)]"
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
                className="inline-flex h-6 items-center rounded-[var(--radius-xs)] bg-[var(--color-ink-100)] px-2 text-[length:var(--text-caption)] font-semibold text-[var(--color-ink-700)]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* 룰 26 갱신 — 단일 흰 카드 + 좌우 비대칭 layout */}
        <motion.article
          ref={cardRef}
          className="mt-8 rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white p-6 sm:p-8 lg:p-10"
          initial={{ opacity: 0, y: 8 }}
          animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className={
              photoCount > 0
                ? "grid gap-6 sm:gap-8 lg:grid-cols-[1.4fr_1fr]"
                : ""
            }
          >
            {/* 좌측 정보 영역 */}
            <div className="flex flex-col">
              {/* 헤더 */}
              <header>
                {/* 룰 28 갱신 — h1 시각 우위 (clamp 2rem~3.5rem / 700 / [text-wrap:balance]) */}
                <h1
                  id="detail-title"
                  className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--color-ink-900)] [text-wrap:balance]"
                >
                  {fm.title}
                </h1>
                {/* 서브타이틀 — body-sm 14 / 400 / ink-500 */}
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[length:var(--text-body-sm)] text-[var(--color-ink-500)]">
                  <span className="font-semibold text-[var(--color-ink-700)]">
                    {fm.court}
                    {fm.courtDivision ? ` ${fm.courtDivision}` : ""}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">사건 {fm.caseNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>{fm.address}</span>
                </p>
              </header>

              {/* 가격 영역 (border-t) */}
              <div className="mt-6 border-t border-[var(--color-ink-200)] pt-6">
                <p className="text-[length:var(--text-caption)] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                  {fm.round}차 최저가
                </p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {/* 룰 28 갱신 — 가격 시각 무게 ↓ (text-[28px] sm:text-[32px] / 600 / tabular-nums) */}
                  <p className="text-[28px] font-semibold leading-[var(--lh-tight)] tabular-nums tracking-tight text-[var(--color-ink-900)] sm:text-[32px]">
                    {fm.minPriceDisplay ?? formatKoreanWon(fm.minPrice)}
                  </p>
                  {/* 룰 24-D 1 accent only — Action Blue 칩 (sub-phase 8.1: brand-300/70 → action 전환, AA 본질 보존) */}
                  <span className="rounded-[var(--radius-xs)] bg-[var(--color-action)] px-2 py-0.5 text-[length:var(--text-caption)] font-semibold tabular-nums text-white">
                    감정가의 {fm.percent}%
                  </span>
                </div>
                {/* 룰 30 — HoverableDropRateBar 라이트 토큰 (props 변경 0) */}
                <HoverableDropRateBar
                  appraisal={fm.appraisal}
                  minPrice={fm.minPrice}
                  percent={fm.percent}
                  appraisalLabel={fm.appraisalDisplay}
                />
              </div>
            </div>

            {/* 우측 사진 영역 */}
            {photoCount > 0 ? (
              <PhotoCluster
                photos={photos}
                photoCount={photoCount}
                altBase={altBase}
                openLightbox={openLightbox}
                handlePhotoError={handlePhotoError}
              />
            ) : null}
          </div>

          {/* 하단 lead summary (전체 width) */}
          {fm.summary ? (
            <>
              <hr className="mt-8 border-t border-[var(--color-ink-200)]" />
              <p className="mt-6 max-w-3xl text-[length:var(--text-body)] leading-[var(--lh-relaxed)] text-[var(--color-ink-700)] line-clamp-3 lg:text-[length:var(--text-body-lg)]">
                {fm.summary}
              </p>
            </>
          ) : null}

          {/* 하단 stat-grid 4-col (전체 width) — 결정 7: 전용면적 4번째 stat */}
          <hr className="mt-8 border-t border-[var(--color-ink-200)]" />
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-ink-200)] lg:grid-cols-4">
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
            <Stat
              label="전용면적"
              value={`${fm.areaM2}㎡`}
              sub={`${fm.areaPyeong}평`}
            />
          </dl>
        </motion.article>
      </div>

      {/* Lightbox modal — HeroGallery 폐기 후 직접 호출 (분기 b) */}
      <Lightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={photos}
        startIndex={lightboxIndex}
        mode="sequence"
        alt={altBase}
      />
    </section>
  );
}

/**
 * 우측 사진 영역 — photos.length 별 단계 layout (결정 8 spec).
 *  - 1: rows 단일 (큰 1장만)
 *  - 2: rows[1.6fr_1fr] + thumbs grid-cols-1
 *  - 3: rows[1.6fr_1fr] + thumbs grid-cols-2
 *  - 4: rows[1.6fr_1fr] + thumbs grid-cols-3
 *  - 5+: rows[1.6fr_1fr] + thumbs grid-cols-3 + 마지막 thumb +N 오버레이
 */
function PhotoCluster({
  photos,
  photoCount,
  altBase,
  openLightbox,
  handlePhotoError,
}: {
  photos: string[];
  photoCount: number;
  altBase: string;
  openLightbox: (idx: number) => void;
  handlePhotoError: (idx: number) => void;
}) {
  const thumbsCount = Math.min(photoCount - 1, 3);
  const thumbsClass =
    thumbsCount === 1
      ? "grid-cols-1"
      : thumbsCount === 2
      ? "grid-cols-2"
      : "grid-cols-3";
  const overflow = photoCount > 4 ? photoCount - 4 : 0;

  return (
    <div className={photoCount > 1 ? "grid grid-rows-[1.6fr_1fr] gap-1.5" : ""}>
      {/* 큰 1장 */}
      <button
        type="button"
        onClick={() => openLightbox(0)}
        aria-label={`${altBase} 1번 크게 보기`}
        className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-ink-100)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-900)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <Image
          src={photos[0]}
          alt={`${altBase} 1`}
          fill
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover transition-transform duration-[var(--duration-md)] ease-out group-hover:scale-[1.02]"
          onError={() => handlePhotoError(0)}
          priority
        />
      </button>

      {/* thumbs row */}
      {photoCount > 1 ? (
        <div className={`grid gap-1 ${thumbsClass}`}>
          {photos.slice(1, 4).map((src, i) => {
            const idx = i + 1;
            const isLastWithOverflow = i === 2 && overflow > 0;
            return (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => openLightbox(idx)}
                aria-label={
                  isLastWithOverflow
                    ? `${altBase} ${idx + 1}번 + ${overflow}장 더 크게 보기`
                    : `${altBase} ${idx + 1}번 크게 보기`
                }
                className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-ink-100)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-900)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <Image
                  src={src}
                  alt={`${altBase} ${idx + 1}`}
                  fill
                  sizes="(min-width: 1024px) 140px, 33vw"
                  className="object-cover transition-transform duration-[var(--duration-md)] ease-out group-hover:scale-[1.02]"
                  onError={() => handlePhotoError(idx)}
                />
                {isLastWithOverflow ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-[var(--color-ink-900)]/50">
                    <span className="text-[length:var(--text-caption)] font-semibold text-[var(--color-ink-50)]">
                      +{overflow}
                    </span>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
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
      {/* 룰 28 — caption 12 / 500 letter-0.05em / ink-500 uppercase */}
      <dt className="flex items-center gap-1.5 text-[length:var(--text-caption)] font-semibold uppercase tracking-[0.05em] text-[var(--color-ink-500)]">
        {icon}
        {label}
      </dt>
      {/* 룰 28 — body-lg 18 / 600 / ink-900 / tabular-nums */}
      <dd className="mt-1 text-[length:var(--text-body-lg)] font-semibold leading-[var(--lh-tight)] tabular-nums">
        {value}
      </dd>
      {/* 룰 28 — caption 12 / 500 / ink-500 */}
      <dd className="text-[length:var(--text-caption)] font-semibold tabular-nums text-[var(--color-ink-500)]">
        {sub}
      </dd>
    </div>
  );
}

/**
 * coverImage URL 패턴 매칭 → 후속 N장 자동 생성 (HeroGallery 폐기 후 흡수).
 * 매칭 실패 시 coverImage 단독 배열 또는 빈 배열.
 */
function deriveThumbs(coverUrl: string | undefined, count: number): string[] {
  if (!coverUrl) return [];
  const match = coverUrl.match(/^(.*\/)\d+\.webp(\?.*)?$/);
  if (!match) return [coverUrl];
  const base = match[1];
  const suffix = match[2] ?? "";
  return Array.from({ length: count }, (_, i) => `${base}${i}.webp${suffix}`);
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
