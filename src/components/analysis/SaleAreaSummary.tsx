"use client";

/**
 * 06 매각사례 — 단계 5-4-2-fix-3 룰 6 (Bullet chart 재구성).
 *
 * 외부 영감: Stephen Few Bullet chart (Pew Research·Tableau 검증).
 * 단일 metric vs benchmark range 표준 패턴.
 *
 * 04 vs 06 시각 차별화 (NYT/Pew same-page chart format 반복 금지):
 *  - 04 = 세로 막대 + 가로 reference (가격 축 — 회차 시간)
 *  - 06 = 가로 Bullet chart + marker (매각가율 % 축 — 통계 분포)
 *
 * Bullet chart 구성:
 *  0% ─── 50% ── [56~67% range highlight] ── 70% (▼ 본 물건 marker) ── 100% (감정가 reference)
 *
 *  - 0~100% 가로 축 (감정가 기준)
 *  - saleRateRange (예: 56~67%) = 매각가율 통계 range (1~12개월 4구간 통합 highlight)
 *  - percent (예: 70%) = 본 물건 진입가 marker (▼ + vertical line)
 *  - 100% reference = 감정가
 *
 * 카드 3개 재구성:
 *  1. 평균 매각가율 (range)
 *  2. 본 물건 진입가 (현재 회차 가격 + percent)
 *  3. 평균 입찰인수 (경쟁 강도)
 *
 * 룰 1 once: false 적용 (위·아래 스크롤 재실행).
 * 모션: range highlight reveal + marker drop-in spring (stiffness 220 damping 22).
 *
 * 데이터 경계 (CLAUDE.md "가짜 데이터 금지"):
 *  - saleRateRange / bidCountRange props — mdx 본문의 1~12개월 통계에서 추출
 *  - 미전달 시 sale_avg / sale_count fallback (시각 일부 영역만)
 *  - raw-content schema 에 byPeriod 4 기간 부재 (Cowork v2.9 보강 영역)
 */
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { MarketMeta } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

interface RangeProp {
  min: number;
  max: number;
}

interface SaleAreaSummaryProps {
  market: MarketMeta;
  appraisal: number;
  minPrice: number;
  percent: number;
  saleRateRange?: RangeProp;
  bidCountRange?: RangeProp;
}

export function SaleAreaSummary({
  market,
  appraisal: _appraisal,
  minPrice,
  percent,
  saleRateRange,
  bidCountRange,
}: SaleAreaSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);
  // 룰 1 (단계 5-4-2-fix-3): once: false — 위·아래 스크롤 재실행 의무
  const inView = useInView(ref, { once: false, amount: 0.3 });

  const saleAvg = market.sale_avg ?? 0;
  const saleCount = market.sale_count ?? 0;
  if (saleAvg <= 0 || saleCount <= 0) return null;

  // saleRateRange 미전달 시 fallback — sale_avg 비율
  const rateMin = saleRateRange?.min ?? Math.round((saleAvg / _appraisal) * 100);
  const rateMax = saleRateRange?.max ?? rateMin;
  const rangeMid = (rateMin + rateMax) / 2;

  return (
    <div
      ref={ref}
      className="mt-6 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-6 sm:p-8"
    >
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
          매각가율 분포
        </p>
        <p className="text-[10px] font-medium tabular-nums text-[var(--color-ink-500)] sm:text-[11px]">
          최근 1~12개월{" "}
          <span className="font-black text-[var(--color-ink-900)]">
            {saleCount}건
          </span>
        </p>
      </div>

      {/* Bullet chart 가로 — 0~100% 축 */}
      <div className="relative mt-8 h-12 w-full" role="img" aria-label="매각가율 Bullet chart">
        {/* 0~100% baseline (axis line) */}
        <motion.span
          aria-hidden="true"
          className="absolute left-0 right-0 top-1/2 h-0.5 origin-left -translate-y-1/2 rounded-full bg-[var(--color-ink-100)]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* range highlight (saleRateRange — 56~67%) */}
        <motion.span
          aria-hidden="true"
          className="absolute top-1/2 h-3 origin-left -translate-y-1/2 rounded-full bg-[var(--color-ink-300)]"
          style={{
            left: `${rateMin}%`,
            width: `${rateMax - rateMin}%`,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* range mid label (위) */}
        <motion.div
          className="absolute -top-5 -translate-x-1/2 text-center"
          style={{ left: `${rangeMid}%` }}
          initial={{ opacity: 0, y: 4 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          <p className="whitespace-nowrap text-[10px] font-bold tabular-nums text-[var(--color-ink-700)]">
            평균 매각가율 {rateMin}~{rateMax}%
          </p>
        </motion.div>

        {/* 본 물건 marker (▼ + vertical line + 라벨) — spring drop-in */}
        <motion.div
          className="absolute -top-4 -bottom-3 -translate-x-1/2"
          style={{ left: `${percent}%` }}
          initial={{ opacity: 0, y: -8 }}
          animate={
            inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }
          }
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 22,
            delay: 1.2,
          }}
        >
          {/* ▼ marker top */}
          <span
            aria-hidden="true"
            className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] leading-none text-[var(--color-ink-900)]"
          >
            ▼
          </span>
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-[var(--color-ink-900)]"
          />
          <p className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black tabular-nums text-[var(--color-ink-900)]">
            본 물건 {percent}%
          </p>
        </motion.div>

        {/* 100% reference (감정가) */}
        <motion.div
          className="absolute -top-1 -bottom-1 w-px bg-[var(--color-ink-300)]"
          style={{ left: "100%" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.4 }}
        >
          <p className="absolute -top-5 left-1 whitespace-nowrap text-[10px] font-medium tabular-nums text-[var(--color-ink-500)]">
            감정가 100%
          </p>
        </motion.div>

        {/* 0% reference (좌측) */}
        <motion.div
          className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <p className="text-[9px] font-medium tabular-nums text-[var(--color-ink-500)]">
            0%
          </p>
        </motion.div>
      </div>

      {/* 카드 3개 재구성 (룰 6) — stagger spring */}
      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 220, damping: 22, delay: 1.6 }}
          className="rounded-[var(--radius-sm)] bg-white p-3"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            평균 매각가율
          </p>
          <p className="mt-1 text-base font-black tabular-nums text-[var(--color-ink-900)]">
            {rateMin}~{rateMax}%
          </p>
          <p className="mt-0.5 text-[11px] tabular-nums text-[var(--color-ink-500)]">
            1~12개월 통계
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 220, damping: 22, delay: 1.75 }}
          className="rounded-[var(--radius-sm)] border border-[var(--color-ink-900)] bg-white p-3"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-900)]">
            본 물건 진입가
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
          transition={{ type: "spring", stiffness: 220, damping: 22, delay: 1.9 }}
          className="rounded-[var(--radius-sm)] bg-white p-3"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            평균 입찰인수
          </p>
          <p className="mt-1 text-base font-black tabular-nums text-[var(--color-ink-900)]">
            {bidCountRange
              ? `${bidCountRange.min}~${bidCountRange.max}명`
              : "—"}
          </p>
          <p className="mt-0.5 text-[11px] tabular-nums text-[var(--color-ink-500)]">
            경쟁 강도
          </p>
        </motion.div>
      </div>
    </div>
  );
}
