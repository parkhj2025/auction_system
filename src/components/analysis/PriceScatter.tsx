"use client";

/**
 * 04 시세 비교 — 단계 5-4-2-fix Phase 3: input 폐기 + 슬라이더 + 분포 강화.
 *
 * 변경 (형준님 본질 통찰):
 *  - input field "내 입찰가 시뮬레이션" 폐기 → 슬라이더 (drag 즉시 4번째 점 + 차이 % 재계산)
 *  - 분포 시각 강화: 시세 평균 ± 시세 중앙값 산포 폭 표시 (sale_avg vs sale_median) + sale_count 카운트 강조
 *  - 슬라이더 range: minPrice ~ appraisal (100만원 step / 키보드 arrow ±5%)
 *
 * 시각 구조:
 *  - 수평 축선 (가격 0 → max)
 *  - 점 3개: 감정가 (ink-500) / 시세 평균 (ink-900) / 최저가 (ink-900 outline)
 *  - 시세 분포 영역: avg ~ median 사이 음영 (분포의 비대칭성 시각화)
 *  - 슬라이더 drag 시 4번째 점 (ink-900 dashed) + 차이 % 즉시 표시
 *
 * 데이터 경계 (CLAUDE.md "가짜 데이터 금지"):
 *  - 개별 매물 51건의 가격 리스트는 raw-content 에 부재 → 정규분포 mock 시각화 안 함
 *  - sale_avg / sale_median / sale_count 만 활용 (실 데이터)
 */
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import type { MarketMeta } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

interface PriceScatterProps {
  appraisal: number;
  market: MarketMeta;
  minPrice: number;
  round: number;
}

export function PriceScatter({ appraisal, market, minPrice, round }: PriceScatterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const saleAvg = market.sale_avg ?? 0;
  const saleMedian = market.sale_median ?? saleAvg;
  const saleCount = market.sale_count ?? 0;

  const max = Math.max(appraisal, saleAvg, saleMedian, minPrice) * 1.05;
  const pos = (v: number) => (v / max) * 100;

  const dropFromAppraisal = Math.round(((appraisal - minPrice) / appraisal) * 100);
  const dropFromSaleAvg =
    saleAvg > 0 ? Math.round(((saleAvg - minPrice) / saleAvg) * 100) : 0;
  const animatedDropAppraisal = useCountUp(dropFromAppraisal, inView, 600, 1500);
  const animatedDropSaleAvg = useCountUp(dropFromSaleAvg, inView, 600, 1500);

  // 슬라이더 (Show-and-Play 본질 — drag 즉시 4번째 점 + 차이 % 재계산)
  const [userPriceWon, setUserPriceWon] = useState<number>(minPrice);
  const userVsAppraisal = Math.round(((appraisal - userPriceWon) / appraisal) * 100);
  const userVsSaleAvg =
    saleAvg > 0 ? Math.round(((saleAvg - userPriceWon) / saleAvg) * 100) : 0;

  // 분포 영역 — saleAvg ↔ saleMedian (비대칭성 시각)
  const distMin = Math.min(saleAvg, saleMedian);
  const distMax = Math.max(saleAvg, saleMedian);

  return (
    <div ref={ref} className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
          가격 분포
        </p>
        {saleCount > 0 ? (
          <p className="text-[11px] font-medium tabular-nums text-[var(--color-ink-500)]">
            인근 매물{" "}
            <span className="font-black text-[var(--color-ink-900)]">
              {saleCount}건
            </span>
          </p>
        ) : null}
      </div>

      {/* scatter — sm+ 표시. 모바일은 슬라이더 + 결과 텍스트만 */}
      <div className="relative mt-8 hidden h-32 w-full sm:block" role="img" aria-label="가격 비교 산점도">
        {/* 축선 line draw */}
        <motion.span
          aria-hidden="true"
          className="absolute left-0 right-0 top-1/2 h-px origin-left -translate-y-1/2 bg-[var(--color-border)]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* 분포 영역 — saleAvg ↔ saleMedian 음영 */}
        {saleCount > 0 && distMin !== distMax ? (
          <motion.span
            aria-hidden="true"
            className="absolute top-1/2 h-3 -translate-y-1/2 origin-left rounded-full bg-[var(--color-ink-100)]"
            style={{
              left: `${pos(distMin)}%`,
              width: `${pos(distMax) - pos(distMin)}%`,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={
              inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
            }
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : null}
        <ScatterPoint
          leftPercent={pos(appraisal)}
          size={10}
          fillCls="bg-[var(--color-ink-500)]"
          label="감정가"
          valueLabel={formatKoreanWon(appraisal)}
          labelPosition="top"
          delay={0.4}
          inView={inView}
        />
        <ScatterPoint
          leftPercent={pos(saleAvg)}
          size={14}
          fillCls="bg-[var(--color-ink-900)]"
          label="시세 평균"
          valueLabel={formatKoreanWon(saleAvg)}
          labelPosition="bottom"
          delay={0.5}
          inView={inView}
        />
        {saleMedian !== saleAvg && saleMedian > 0 ? (
          <ScatterPoint
            leftPercent={pos(saleMedian)}
            size={10}
            fillCls="bg-[var(--color-ink-700)]"
            label="시세 중앙값"
            valueLabel={formatKoreanWon(saleMedian)}
            labelPosition="bottom"
            delay={0.6}
            inView={inView}
            small
          />
        ) : null}
        <ScatterPoint
          leftPercent={pos(minPrice)}
          size={16}
          fillCls="border-2 border-[var(--color-ink-900)] bg-white"
          label={`${round}차 최저가`}
          valueLabel={formatKoreanWon(minPrice)}
          labelPosition="top"
          delay={0.7}
          inView={inView}
          accent
        />
        {/* 사용자 슬라이더 점 (Show-and-Play) */}
        {userPriceWon >= minPrice && userPriceWon <= appraisal ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ delay: 0.9, duration: 0.3 }}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${pos(userPriceWon)}%` }}
          >
            <span
              aria-hidden="true"
              className="block h-4 w-4 -translate-x-1/2 rounded-full border-2 border-dashed border-[var(--color-ink-900)] bg-white"
            />
            <p className="absolute top-full mt-3 left-0 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold tabular-nums text-[var(--color-ink-900)]">
              내 입찰가
            </p>
          </motion.div>
        ) : null}
      </div>

      {/* 차이 % count-up */}
      <motion.div
        className="mt-4 text-center text-xs font-medium tabular-nums text-[var(--color-ink-500)]"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.5, duration: 0.4 }}
      >
        {`${round}차 최저가는 감정가 대비 −${animatedDropAppraisal}% · 시세 평균 대비 −${animatedDropSaleAvg}% 위치`}
      </motion.div>

      {/* 슬라이더 (Show-and-Play 본질) */}
      <motion.div
        className="mt-6 origin-left rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4"
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
        transition={{ delay: 1.8, duration: 0.4 }}
      >
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="user-price-slider"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-700)]"
          >
            내 입찰가 시뮬레이션
          </label>
          <span className="text-xs font-black tabular-nums text-[var(--color-ink-900)]">
            {formatKoreanWon(userPriceWon)}
          </span>
        </div>
        <input
          id="user-price-slider"
          type="range"
          min={minPrice}
          max={appraisal}
          step={1_000_000}
          value={userPriceWon}
          onChange={(e) => setUserPriceWon(Number(e.target.value))}
          aria-valuemin={minPrice}
          aria-valuemax={appraisal}
          aria-valuenow={userPriceWon}
          aria-valuetext={`${formatKoreanWon(userPriceWon)}, 감정가 대비 ${userVsAppraisal > 0 ? "−" : "+"}${Math.abs(userVsAppraisal)}%`}
          className="mt-3 w-full accent-[var(--color-ink-900)]"
        />
        <div className="mt-3 flex items-baseline justify-between text-[11px] tabular-nums text-[var(--color-ink-500)]">
          <span>최저가 {formatKoreanWon(minPrice)}</span>
          <span>감정가 {formatKoreanWon(appraisal)}</span>
        </div>
        <p className="mt-3 text-xs leading-5 tabular-nums text-[var(--color-ink-700)]">
          감정가 대비{" "}
          <span className="font-black text-[var(--color-ink-900)]">
            {userVsAppraisal > 0 ? "−" : "+"}
            {Math.abs(userVsAppraisal)}%
          </span>
          {saleAvg > 0 ? (
            <>
              {" · 시세 평균 대비 "}
              <span className="font-black text-[var(--color-ink-900)]">
                {userVsSaleAvg > 0 ? "−" : "+"}
                {Math.abs(userVsSaleAvg)}%
              </span>
            </>
          ) : null}
        </p>
      </motion.div>
    </div>
  );
}

function ScatterPoint({
  leftPercent,
  size,
  fillCls,
  label,
  valueLabel,
  labelPosition,
  delay,
  inView,
  accent,
  small,
}: {
  leftPercent: number;
  size: number;
  fillCls: string;
  label: string;
  valueLabel: string;
  labelPosition: "top" | "bottom";
  delay: number;
  inView: boolean;
  accent?: boolean;
  small?: boolean;
}) {
  const isTop = labelPosition === "top";
  return (
    <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${leftPercent}%` }}>
      <motion.span
        aria-hidden="true"
        className={`block -translate-x-1/2 rounded-full ${fillCls}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className={`absolute left-0 -translate-x-1/2 whitespace-nowrap text-center ${
          isTop ? "bottom-full mb-2" : "top-full mt-2"
        }`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: delay + 0.2 }}
      >
        <p
          className={`uppercase tracking-wider ${small ? "text-[8px]" : "text-[9px]"} font-bold ${
            accent ? "text-[var(--color-ink-900)]" : "text-[var(--color-ink-500)]"
          }`}
        >
          {label}
        </p>
        <p
          className={`mt-0.5 ${small ? "text-[10px]" : "text-xs"} font-black tabular-nums text-[var(--color-ink-900)]`}
        >
          {valueLabel}
        </p>
      </motion.div>
    </div>
  );
}

function useCountUp(target: number, active: boolean, duration: number, delay: number): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    let raf = 0;
    const t0Ref = { t0: 0 };
    const tick = (now: number) => {
      if (t0Ref.t0 === 0) t0Ref.t0 = now;
      const progress = Math.min(1, (now - t0Ref.t0) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    const timeoutId = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(timeoutId);
    };
  }, [active, target, duration, delay]);
  return value;
}
