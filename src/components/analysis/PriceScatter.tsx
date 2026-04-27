"use client";

/**
 * 04 시세 비교 — 단계 5-4-2-fix-4 룰 10 v2.
 *
 * 변경 (단계 5-4-2-fix-3 룰 2 폐기 후 재구성):
 *  - 5번째 세로 막대 (사용자 입찰가) 폐기
 *  - dashed connector 폐기
 *  - 시세평균 가로 reference 라인 폐기 (4 세로 막대 중 하나로 통일)
 *
 * 세로 막대 4개 (좌→우):
 *  1. 감정가 (ink-500)
 *  2. 1차 회차 (이전, ink-300 weak)
 *  3. 2차 회차 (현재, ink-900 strong)
 *  4. 시세평균 (ink-700)
 *
 * NEW — 입찰가 = 가로 horizontal bar:
 *  - 4 세로 막대 전체를 가로지르는 dashed line + 라벨
 *  - 슬라이더 drag 시 horizontal bar 의 y좌표 위·아래 이동
 *  - 색: brand-900
 *  - 어느 막대보다 위/아래인지 즉시 시각 인지
 *  - 라벨: "내 입찰가" + "감정가 대비 −X%" + "시세평균 대비 ±Y%"
 *
 * NEW — y-axis 로그 스케일:
 *  - log10(value) 기반 y position 계산
 *  - minor ticks (1억·1.5억·2억 reference grid) — FT/Bloomberg 패턴
 *  - 작은 가격 차이도 시각 차이 강조
 *
 * 모바일 노출 의무 (룰 2 보존): hidden sm:block 금지, width 60% 축소만.
 *
 * Typography (룰 14-B):
 *  - 막대 라벨 = caption (12px) ink-500/700/900
 *  - 막대 가격 = body-sm (14px) font-medium ink-900
 *  - 슬라이더 라벨 = caption uppercase
 *
 * 룰 1 once: false 적용 (위·아래 스크롤 재실행).
 */
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import type { MarketMeta, BiddingHistoryEntry } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

interface PriceScatterProps {
  appraisal: number;
  market: MarketMeta;
  minPrice: number;
  round: number;
  history: BiddingHistoryEntry[];
}

interface BarConfig {
  key: string;
  label: string;
  value: number;
  fillCls: string;
  weight: "weak" | "strong" | "normal";
  isCurrent?: boolean;
}

export function PriceScatter({
  appraisal,
  market,
  minPrice,
  round,
  history,
}: PriceScatterProps) {
  const ref = useRef<HTMLDivElement>(null);
  // 룰 1 (단계 5-4-2-fix-3): once: false — 위·아래 스크롤 재실행
  const inView = useInView(ref, { once: false, amount: 0.3 });

  const saleAvg = market.sale_avg ?? 0;
  const saleCount = market.sale_count ?? 0;

  // 막대 4개 구성 (룰 10)
  const bars: BarConfig[] = [
    {
      key: "appraisal",
      label: "감정가",
      value: appraisal,
      fillCls: "bg-[var(--color-ink-500)]",
      weight: "normal",
    },
  ];
  const pastEntries = history.filter((h) => {
    const r = (h.result ?? "").trim();
    return r.includes("유찰") || r.includes("매각") || r.includes("미납");
  });
  const currentEntry = history.find((h) => {
    const r = (h.result ?? "").trim();
    return r === "" || r.includes("진행");
  });

  pastEntries.forEach((entry) => {
    if (entry.minimum != null && entry.round != null) {
      bars.push({
        key: `round-${entry.round}`,
        label: `${entry.round}차`,
        value: entry.minimum,
        fillCls: "bg-[var(--color-ink-300)]",
        weight: "weak",
      });
    }
  });

  if (currentEntry && currentEntry.minimum != null && currentEntry.round != null) {
    bars.push({
      key: `round-${currentEntry.round}`,
      label: `${currentEntry.round}차 (현재)`,
      value: currentEntry.minimum,
      fillCls: "bg-[var(--color-ink-900)]",
      weight: "strong",
      isCurrent: true,
    });
  } else {
    bars.push({
      key: `round-${round}`,
      label: `${round}차 (현재)`,
      value: minPrice,
      fillCls: "bg-[var(--color-ink-900)]",
      weight: "strong",
      isCurrent: true,
    });
  }

  if (saleAvg > 0) {
    bars.push({
      key: "saleAvg",
      label: "시세 평균",
      value: saleAvg,
      fillCls: "bg-[var(--color-ink-700)]",
      weight: "normal",
    });
  }

  // 슬라이더 (사용자 입찰가)
  const [userPriceWon, setUserPriceWon] = useState<number>(minPrice);
  const userVsAppraisal = Math.round(((appraisal - userPriceWon) / appraisal) * 100);
  const userVsSaleAvg =
    saleAvg > 0 ? Math.round(((saleAvg - userPriceWon) / saleAvg) * 100) : 0;
  const userBarSign = userVsSaleAvg > 0 ? "−" : "+";

  // log scale (룰 10): minValue ~ maxValue 의 log10 비율로 y position 계산
  const allValues = [appraisal, saleAvg, userPriceWon, ...bars.map((b) => b.value)].filter(
    (v) => v > 0
  );
  const minValue = Math.min(...allValues) * 0.7; // 하단 여유
  const maxValue = Math.max(...allValues) * 1.05; // 상단 여유
  const logMin = Math.log10(minValue);
  const logMax = Math.log10(maxValue);
  const logSpan = logMax - logMin;
  const yPos = (value: number) => ((Math.log10(value) - logMin) / logSpan) * 100;

  // minor ticks (1억·1.5억·2억) — log scale reference
  const ticks = [
    { value: 100_000_000, label: "1억" },
    { value: 150_000_000, label: "1.5억" },
    { value: 200_000_000, label: "2억" },
  ].filter((t) => t.value >= minValue && t.value <= maxValue);

  // 차이 % count-up
  const dropFromAppraisal = Math.round(((appraisal - minPrice) / appraisal) * 100);
  const dropFromSaleAvg =
    saleAvg > 0 ? Math.round(((saleAvg - minPrice) / saleAvg) * 100) : 0;
  const animatedDropAppraisal = useCountUp(dropFromAppraisal, inView, 600, 1700);
  const animatedDropSaleAvg = useCountUp(dropFromSaleAvg, inView, 600, 1700);

  return (
    <div
      ref={ref}
      className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-5 sm:p-6"
    >
      <div className="flex items-baseline justify-between">
        <p className="text-[length:var(--text-caption)] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
          가격 비교
        </p>
        {saleCount > 0 ? (
          <p className="text-[length:var(--text-caption)] tabular-nums text-[var(--color-ink-500)]">
            인근 매물{" "}
            <span className="font-black text-[var(--color-ink-900)]">
              {saleCount}건
            </span>{" "}
            평균
          </p>
        ) : null}
      </div>

      {/* 차트 영역 — 모바일 노출 의무 (룰 2). 모바일 width 60% 축소 */}
      <div
        className="relative mt-8 h-56 w-full sm:h-64"
        role="img"
        aria-label="가격 비교 세로 막대 (로그 스케일)"
      >
        {/* y-axis tick reference grid (log scale minor ticks) */}
        {ticks.map((t, idx) => {
          const top = 100 - yPos(t.value);
          return (
            <motion.div
              key={t.value}
              aria-hidden="true"
              className="absolute left-0 right-0 origin-left"
              style={{ top: `${top}%` }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={
                inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
              }
              transition={{
                duration: 0.5,
                delay: 0.1 + idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="h-px w-full border-t border-dashed border-[var(--color-ink-200)]" />
              <p className="absolute right-1 -top-3 text-[10px] tabular-nums text-[var(--color-ink-400)]">
                {t.label}
              </p>
            </motion.div>
          );
        })}

        {/* x축 baseline */}
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px origin-left bg-[var(--color-border)]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 막대 4개 — 좌→우 stagger (log scale y position) */}
        <div className="absolute inset-0 flex items-end justify-around gap-1 px-2 sm:gap-3 sm:px-6">
          {bars.map((bar, idx) => {
            const heightPercent = yPos(bar.value);
            return (
              <div
                key={bar.key}
                className="relative flex h-full w-full max-w-[50px] flex-col items-center justify-end sm:max-w-[80px]"
              >
                <motion.div
                  className="mb-1 text-center sm:mb-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ delay: 0.4 + idx * 0.18 + 0.4, duration: 0.4 }}
                >
                  <p
                    className={`text-[length:var(--text-caption)] tabular-nums sm:text-[length:var(--text-body-sm)] ${
                      bar.weight === "strong"
                        ? "font-black text-[var(--color-ink-900)]"
                        : bar.weight === "weak"
                          ? "font-medium text-[var(--color-ink-500)] opacity-70"
                          : "font-bold text-[var(--color-ink-700)]"
                    }`}
                  >
                    {formatKoreanWon(bar.value)}
                  </p>
                </motion.div>
                <motion.div
                  className={`w-full origin-bottom rounded-t-[var(--radius-xs)] ${bar.fillCls}`}
                  style={{ height: `${heightPercent}%` }}
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{
                    delay: 0.4 + idx * 0.18,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
                {/* 막대 하단 라벨 */}
                <p
                  className={`absolute -bottom-7 text-center text-[10px] font-bold uppercase tracking-wider ${
                    bar.weight === "strong"
                      ? "text-[var(--color-ink-900)]"
                      : "text-[var(--color-ink-500)]"
                  }`}
                >
                  {bar.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* 입찰가 horizontal bar (4 막대 가로지름) — brand-900 dashed */}
        <motion.div
          aria-hidden="true"
          className="absolute left-0 right-0 origin-left"
          style={{ top: `${100 - yPos(userPriceWon)}%` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-0.5 w-full border-t-2 border-dashed border-[var(--color-brand-900)]" />
          {/* 좌측 라벨 */}
          <div className="absolute -top-7 left-0 whitespace-nowrap rounded-[var(--radius-xs)] bg-[var(--color-brand-900)] px-2 py-0.5 text-[10px] font-black tabular-nums text-white">
            내 입찰가 {formatKoreanWon(userPriceWon)}
          </div>
          {/* 우측 라벨 */}
          <div className="absolute top-1 right-0 whitespace-nowrap text-[10px] font-bold tabular-nums text-[var(--color-brand-900)]">
            감정가 대비 {userVsAppraisal > 0 ? "−" : "+"}
            {Math.abs(userVsAppraisal)}%
            {saleAvg > 0 ? (
              <>
                {" · 시세 "}
                {userBarSign}
                {Math.abs(userVsSaleAvg)}%
              </>
            ) : null}
          </div>
        </motion.div>
      </div>

      {/* 차이 % count-up */}
      <motion.div
        className="mt-12 text-center text-[length:var(--text-caption)] font-medium tabular-nums text-[var(--color-ink-500)] sm:text-[length:var(--text-body-sm)]"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.7, duration: 0.4 }}
      >
        {`${round}차 최저가는 감정가 대비 −${animatedDropAppraisal}% · 시세 평균 대비 −${animatedDropSaleAvg}% 위치`}
      </motion.div>

      {/* 슬라이더 (Show-and-Play) */}
      <motion.div
        className="mt-5 origin-left rounded-[var(--radius-sm)] bg-white p-4"
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
        transition={{ delay: 1.8, duration: 0.4 }}
      >
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="user-price-slider"
            className="text-[length:var(--text-caption)] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-700)]"
          >
            내 입찰가 시뮬레이션
          </label>
          <span className="text-[length:var(--text-body-sm)] font-black tabular-nums text-[var(--color-brand-900)]">
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
          aria-valuetext={`${formatKoreanWon(userPriceWon)}, 감정가 대비 ${userVsAppraisal > 0 ? "−" : "+"}${Math.abs(userVsAppraisal)}%, 시세 평균 대비 ${userBarSign}${Math.abs(userVsSaleAvg)}%`}
          className="mt-3 w-full accent-[var(--color-brand-900)]"
        />
        <div className="mt-3 flex items-baseline justify-between text-[length:var(--text-caption)] tabular-nums text-[var(--color-ink-500)]">
          <span>최저가 {formatKoreanWon(minPrice)}</span>
          <span>감정가 {formatKoreanWon(appraisal)}</span>
        </div>
        <p className="mt-3 text-[length:var(--text-caption)] leading-5 tabular-nums text-[var(--color-ink-700)] sm:text-[length:var(--text-body-sm)]">
          감정가 대비{" "}
          <span className="font-black text-[var(--color-ink-900)]">
            {userVsAppraisal > 0 ? "−" : "+"}
            {Math.abs(userVsAppraisal)}%
          </span>
          {saleAvg > 0 ? (
            <>
              {" · 시세평균 대비 "}
              <span className="font-black text-[var(--color-brand-900)]">
                {userBarSign}
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
