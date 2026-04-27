"use client";

/**
 * 04 시세 비교 — 단계 5-4-2-fix-2 Phase 2: 세로 막대 그래프 + 스크롤 reveal + 가로 라인.
 *
 * 변경 (형준님 본질 통찰 — 우측 쏠림 1D scatter 폐기):
 *  - 1D scatter 점 3개 폐기 → 세로 막대 3 (감정가·최저가·시세평균) 좌→우 배치
 *  - 막대 fill: 감정가 ink-500 / 최저가 ink-900 / 시세평균 ink-700 (강조 차등)
 *  - 막대 height = 가격 / max * container 영역
 *  - 슬라이더 drag → 4번째 막대 (사용자 입력가, ink-900 dashed outline) 추가
 *
 * 스크롤 reveal 순서 (좌→우 / 아래→위):
 *  - 0~25%: y축선 line draw (origin-bottom scaleY)
 *  - 25~45%: 감정가 막대 grow (origin-bottom scaleY 0→1, 600ms ease-out)
 *  - 45~65%: 최저가 막대 grow (delay 200ms)
 *  - 65~85%: 시세평균 막대 grow (delay 400ms)
 *  - 85~100%: 가로 dashed line (시세평균 끝점 → 감정가 막대 끝점) draw + 차이 % count-up
 *
 * 모노톤: 감정가 ink-500 / 최저가 ink-900 / 시세평균 ink-700 / 사용자 ink-900 dashed.
 * 데이터 경계 (CLAUDE.md "가짜 데이터 금지"):
 *  - sale_avg / sale_count / sale_median 만 활용 (실 데이터)
 *  - 51건 개별 가격 mock 미생성
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

interface BarConfig {
  key: string;
  label: string;
  value: number;
  fillCls: string;
  isAccent: boolean;
}

export function PriceScatter({
  appraisal,
  market,
  minPrice,
  round,
}: PriceScatterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const saleAvg = market.sale_avg ?? 0;
  const saleCount = market.sale_count ?? 0;
  const max = Math.max(appraisal, saleAvg, minPrice) * 1.05;

  const dropFromAppraisal = Math.round(((appraisal - minPrice) / appraisal) * 100);
  const dropFromSaleAvg =
    saleAvg > 0 ? Math.round(((saleAvg - minPrice) / saleAvg) * 100) : 0;
  const animatedDropAppraisal = useCountUp(dropFromAppraisal, inView, 600, 1700);
  const animatedDropSaleAvg = useCountUp(dropFromSaleAvg, inView, 600, 1700);

  const [userPriceWon, setUserPriceWon] = useState<number>(minPrice);
  const userVsAppraisal = Math.round(((appraisal - userPriceWon) / appraisal) * 100);
  const userVsSaleAvg =
    saleAvg > 0 ? Math.round(((saleAvg - userPriceWon) / saleAvg) * 100) : 0;

  // 막대 3 (또는 4 with user) — 좌→우 순서
  const bars: BarConfig[] = [
    {
      key: "appraisal",
      label: "감정가",
      value: appraisal,
      fillCls: "bg-[var(--color-ink-500)]",
      isAccent: false,
    },
    {
      key: "minPrice",
      label: `${round}차 최저가`,
      value: minPrice,
      fillCls: "bg-[var(--color-ink-900)]",
      isAccent: true,
    },
    ...(saleAvg > 0
      ? [
          {
            key: "saleAvg",
            label: "시세 평균",
            value: saleAvg,
            fillCls: "bg-[var(--color-ink-700)]",
            isAccent: false,
          } as BarConfig,
        ]
      : []),
  ];

  return (
    <div
      ref={ref}
      className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6"
    >
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
          가격 비교
        </p>
        {saleCount > 0 ? (
          <p className="text-[11px] font-medium tabular-nums text-[var(--color-ink-500)]">
            인근 매물{" "}
            <span className="font-black text-[var(--color-ink-900)]">
              {saleCount}건
            </span>{" "}
            평균
          </p>
        ) : null}
      </div>

      {/* 세로 막대 그래프 — desktop 전용. 모바일은 슬라이더 + 결과 텍스트만 */}
      <div className="relative mt-6 hidden h-56 w-full sm:block" role="img" aria-label="가격 비교 세로 막대">
        {/* y축 line draw (origin-bottom) */}
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 top-0 w-px origin-bottom bg-[var(--color-border)]"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* x축 (baseline) line draw (origin-left) */}
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px origin-left bg-[var(--color-border)]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 가로 dashed line — 감정가 막대 끝 → 최저가 막대 끝 (감정가 - 최저가 차이 시각) */}
        <motion.div
          aria-hidden="true"
          className="absolute left-[6%] right-[40%] origin-left border-t border-dashed border-[var(--color-ink-500)]"
          style={{ bottom: `${(appraisal / max) * 100}%` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            inView ? { scaleX: 1, opacity: 0.5 } : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: 0.5, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 막대 3 — 좌→우 stagger */}
        <div className="absolute inset-0 flex items-end justify-around gap-3 px-6">
          {bars.map((bar, idx) => {
            const heightPercent = (bar.value / max) * 100;
            return (
              <div
                key={bar.key}
                className="relative flex h-full w-full max-w-[80px] flex-col items-center justify-end"
              >
                {/* 가격 라벨 (상단 count-up 풍 — 막대 위) */}
                <motion.div
                  className="mb-2 text-center"
                  initial={{ opacity: 0, y: 8 }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                  }
                  transition={{ delay: 0.4 + idx * 0.2 + 0.4, duration: 0.4 }}
                >
                  <p
                    className={`text-xs font-black tabular-nums ${
                      bar.isAccent
                        ? "text-[var(--color-ink-900)]"
                        : "text-[var(--color-ink-700)]"
                    }`}
                  >
                    {formatKoreanWon(bar.value)}
                  </p>
                </motion.div>
                {/* 막대 grow (origin-bottom scaleY 0→1) */}
                <motion.div
                  className={`w-full origin-bottom rounded-t-[var(--radius-xs)] ${bar.fillCls}`}
                  style={{ height: `${heightPercent}%` }}
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{
                    delay: 0.4 + idx * 0.2,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>
            );
          })}
          {/* 사용자 입찰가 4번째 막대 (슬라이더 drag 시 표시) */}
          {userPriceWon !== minPrice ? (
            <motion.div
              key={`user-${Math.floor(userPriceWon / 1_000_000)}`}
              className="relative flex h-full w-full max-w-[80px] flex-col items-center justify-end"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-2 text-center">
                <p className="text-xs font-black tabular-nums text-[var(--color-ink-900)]">
                  {formatKoreanWon(userPriceWon)}
                </p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--color-ink-700)]">
                  내 입찰가
                </p>
              </div>
              <div
                className="w-full rounded-t-[var(--radius-xs)] border-2 border-dashed border-[var(--color-ink-900)] bg-white"
                style={{ height: `${(userPriceWon / max) * 100}%` }}
              />
            </motion.div>
          ) : null}
        </div>

        {/* 막대 라벨 (하단) */}
        <div className="absolute bottom-[-32px] left-0 right-0 flex items-start justify-around gap-3 px-6">
          {bars.map((bar, idx) => (
            <motion.div
              key={`${bar.key}-label`}
              className="w-full max-w-[80px] text-center"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5 + idx * 0.2 + 0.3, duration: 0.4 }}
            >
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  bar.isAccent
                    ? "text-[var(--color-ink-900)]"
                    : "text-[var(--color-ink-500)]"
                }`}
              >
                {bar.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 차이 % count-up */}
      <motion.div
        className="mt-12 sm:mt-14 text-center text-xs font-medium tabular-nums text-[var(--color-ink-500)]"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.6, duration: 0.4 }}
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

function useCountUp(
  target: number,
  active: boolean,
  duration: number,
  delay: number
): number {
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
