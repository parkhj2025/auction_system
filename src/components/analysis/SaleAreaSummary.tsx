"use client";

/**
 * 06 매각사례 — 단계 5-4-2-fix Phase 3: 시세 평균 + 본 물건 비교 시각화.
 *
 * 데이터 경계 (CLAUDE.md "가짜 데이터 금지"):
 *  - Cowork raw 의 byPeriod 4 기간 (1·3·6·12개월) 매각가율 데이터 부재 → 4 기간 histogram 미구현
 *  - 활용 가능 데이터: market.sale_avg / sale_count + 본 물건 percent (감정가 대비 최저가 %)
 *  - 가용 데이터로 정직 시각화: 인근 시세 평균 위치 + 본 물건 최저가 진입선 + 51건 카운트
 *
 * 시각 구조:
 *  - 가로 축선 (0 → max)
 *  - 시세 평균선 (saleAvg / appraisal %) ink-700 진한 라인
 *  - 본 물건 진입선 (percent %) ink-900 굵은 라인 + "현재" 라벨
 *  - 막대: 인근 51건 분포 폭 (sale_avg ± 단순 표시)
 */
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { MarketMeta } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

export function SaleAreaSummary({
  market,
  appraisal,
  minPrice,
  percent,
}: {
  market: MarketMeta;
  appraisal: number;
  minPrice: number;
  percent: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // 룰 1 (단계 5-4-2-fix-3): once: false — 위·아래 스크롤 재실행 의무
  const inView = useInView(ref, { once: false, amount: 0.3 });

  const saleAvg = market.sale_avg ?? 0;
  const saleCount = market.sale_count ?? 0;
  if (saleAvg <= 0 || saleCount <= 0) return null;

  const avgPercent = Math.round((saleAvg / appraisal) * 100);
  const minVsAvg = saleAvg > 0 ? Math.round((minPrice / saleAvg) * 100) : 0;

  return (
    <div
      ref={ref}
      className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6"
    >
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
          인근 매각 시세
        </p>
        <p className="text-[11px] font-medium tabular-nums text-[var(--color-ink-500)]">
          최근 매물{" "}
          <span className="font-black text-[var(--color-ink-900)]">
            {saleCount}건
          </span>{" "}
          평균
        </p>
      </div>

      {/* 가로 막대 + 진입선 시각 */}
      <div className="relative mt-6 h-12">
        {/* 축선 (감정가 100% = 우측 끝) */}
        <motion.span
          aria-hidden="true"
          className="absolute left-0 right-0 top-1/2 h-1 origin-left -translate-y-1/2 rounded-full bg-[var(--color-ink-100)]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* 시세 평균 ~ 본 물건 진입선 사이 영역 */}
        <motion.span
          aria-hidden="true"
          className="absolute top-1/2 h-1 origin-left -translate-y-1/2 rounded-full bg-[var(--color-ink-700)]"
          style={{
            left: `${Math.min(avgPercent, percent)}%`,
            width: `${Math.abs(avgPercent - percent)}%`,
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* 시세 평균 진입선 — spring 으로 부드러운 진입 */}
        <motion.div
          className="absolute top-0 bottom-0 w-px bg-[var(--color-ink-700)]"
          style={{ left: `${avgPercent}%` }}
          initial={{ opacity: 0, scaleY: 0.4 }}
          animate={inView ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0.4 }}
          transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.7 }}
        >
          <p className="absolute -top-5 left-0 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold tabular-nums text-[var(--color-ink-700)]">
            시세 {avgPercent}%
          </p>
        </motion.div>
        {/* 본 물건 진입선 (현재 회차) — spring 강조 */}
        <motion.div
          className="absolute -top-1 -bottom-1 w-0.5 bg-[var(--color-ink-900)]"
          style={{ left: `${percent}%` }}
          initial={{ opacity: 0, scaleY: 0.4 }}
          animate={inView ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0.4 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.95 }}
        >
          <p className="absolute top-full mt-1 left-0 -translate-x-1/2 whitespace-nowrap text-[10px] font-black tabular-nums text-[var(--color-ink-900)]">
            본 물건 {percent}%
          </p>
        </motion.div>
        {/* 감정가 진입선 (100%) */}
        <motion.div
          className="absolute top-0 bottom-0 w-px bg-[var(--color-ink-300)]"
          style={{ left: "100%" }}
          initial={{ opacity: 0, scaleY: 0.4 }}
          animate={inView ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0.4 }}
          transition={{ type: "spring", stiffness: 220, damping: 22, delay: 1.1 }}
        >
          <p className="absolute -top-5 left-0 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium tabular-nums text-[var(--color-ink-500)]">
            감정가 100%
          </p>
        </motion.div>
      </div>

      {/* 결과 요약 — stagger spring fade-in */}
      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 220, damping: 22, delay: 1.3 }}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-ink-50)] p-3"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            시세 평균
          </p>
          <p className="mt-1 text-base font-black tabular-nums text-[var(--color-ink-900)]">
            {formatKoreanWon(saleAvg)}
          </p>
          <p className="mt-0.5 text-[11px] tabular-nums text-[var(--color-ink-500)]">
            감정가의 {avgPercent}%
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 220, damping: 22, delay: 1.45 }}
          className="rounded-[var(--radius-md)] border-2 border-[var(--color-ink-900)] bg-white p-3"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-900)]">
            현재 회차 진입가
          </p>
          <p className="mt-1 text-base font-black tabular-nums text-[var(--color-ink-900)]">
            {formatKoreanWon(minPrice)}
          </p>
          <p className="mt-0.5 text-[11px] tabular-nums text-[var(--color-ink-700)]">
            감정가의 {percent}%
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 220, damping: 22, delay: 1.6 }}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            시세 대비
          </p>
          <p className="mt-1 text-base font-black tabular-nums text-[var(--color-ink-900)]">
            {minVsAvg}%
          </p>
          <p className="mt-0.5 text-[11px] tabular-nums text-[var(--color-ink-500)]">
            평균 매각가 대비
          </p>
        </motion.div>
      </div>
    </div>
  );
}
