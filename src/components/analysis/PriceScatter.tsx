"use client";

/**
 * 04 시세 비교 — 단계 5-4-2-fix-3 룰 2.
 *
 * 막대 4개 (감정가·1차·2차·시세평균) 세로 + 시세평균 가로 reference + 5번째 동적 막대 (입찰가) + dashed connector.
 *
 * 막대 구성 (좌→우):
 *  1. 감정가 100% (ink-500)
 *  2. 1차 회차 (이전, 100%) (ink-300 weak)
 *  3. 2차 회차 (현재, 70%) (ink-900 strong)
 *  4. 시세평균 (~90%) (ink-700)
 *  5. 사용자 입찰가 (동적, brand-900) — 슬라이더 drag 시 height transition
 *
 * 시세평균 가로 reference (정적):
 *  - solid line · ink-700 · 막대 끝점에서 좌→우 horizontal indicator
 *  - 비교 line 아님 (이 정도 수준 reference)
 *
 * dashed connector (NEW):
 *  - 입찰가 막대 끝점 → 시세평균 가로 라인까지 dashed line · ink-400
 *  - 슬라이더 drag 시 connector 길이 변화 (차이 시각적 강조)
 *  - 라벨: "시세평균 대비 ±X%" 정량 차이
 *
 * 룰 1 once: false 적용 (위·아래 스크롤 재실행).
 * 모바일 노출 의무 (룰 2): hidden sm:block 폐기, width 60% 축소만.
 *
 * 데이터 경계 (CLAUDE.md "가짜 데이터 금지"):
 *  - meta.bidding.history 1차·2차 entry 활용 (실 데이터)
 *  - history 부재 시 막대 2 (감정가 + 시세평균 + 현재 회차) fallback
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
  // 룰 1 (단계 5-4-2-fix-3): once: false — 위·아래 스크롤 재실행 의무
  const inView = useInView(ref, { once: false, amount: 0.3 });

  const saleAvg = market.sale_avg ?? 0;
  const saleCount = market.sale_count ?? 0;

  // 막대 4개 구성 (룰 2)
  const bars: BarConfig[] = [
    {
      key: "appraisal",
      label: "감정가",
      value: appraisal,
      fillCls: "bg-[var(--color-ink-500)]",
      weight: "normal",
    },
  ];
  // history 1차 + 2차 (또는 현재 회차) 통합
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
    // history 부재 fallback — minPrice + round
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

  // 5번째 막대 (사용자 입찰가, 동적, brand-900)
  const [userPriceWon, setUserPriceWon] = useState<number>(minPrice);
  const userVsAppraisal = Math.round(((appraisal - userPriceWon) / appraisal) * 100);
  const userVsSaleAvg =
    saleAvg > 0 ? Math.round(((saleAvg - userPriceWon) / saleAvg) * 100) : 0;
  const userBarSign = userVsSaleAvg > 0 ? "−" : "+";

  // max — 차트 영역 비율 계산
  const max = Math.max(appraisal, saleAvg, ...bars.map((b) => b.value), userPriceWon) * 1.05;

  // 차이 % count-up
  const dropFromAppraisal = Math.round(((appraisal - minPrice) / appraisal) * 100);
  const dropFromSaleAvg =
    saleAvg > 0 ? Math.round(((saleAvg - minPrice) / saleAvg) * 100) : 0;
  const animatedDropAppraisal = useCountUp(dropFromAppraisal, inView, 600, 1700);
  const animatedDropSaleAvg = useCountUp(dropFromSaleAvg, inView, 600, 1700);

  return (
    <div
      ref={ref}
      className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 sm:p-6"
    >
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
          가격 비교
        </p>
        {saleCount > 0 ? (
          <p className="text-[10px] font-medium tabular-nums text-[var(--color-ink-500)] sm:text-[11px]">
            인근 매물{" "}
            <span className="font-black text-[var(--color-ink-900)]">
              {saleCount}건
            </span>{" "}
            평균
          </p>
        ) : null}
      </div>

      {/* 세로 막대 그래프 — 모바일 노출 의무 (룰 2). 모바일 width 60% 축소. */}
      <div
        className="relative mt-6 h-48 w-full sm:h-56"
        role="img"
        aria-label="가격 비교 세로 막대"
      >
        {/* x축 baseline */}
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px origin-left bg-[var(--color-border)]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 시세평균 가로 reference line (정적, 좌→우) */}
        {saleAvg > 0 ? (
          <motion.div
            aria-hidden="true"
            className="absolute left-0 right-0 origin-left"
            style={{ bottom: `${(saleAvg / max) * 100}%` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-px w-full bg-[var(--color-ink-700)]" />
            <p className="absolute -top-3 right-0 whitespace-nowrap text-[9px] font-bold uppercase tracking-wider tabular-nums text-[var(--color-ink-700)] sm:text-[10px]">
              시세평균 reference
            </p>
          </motion.div>
        ) : null}

        {/* 막대 + 입찰가 막대 — 좌→우 stagger (룰 2 회차 시각 위계) */}
        <div className="absolute inset-0 flex items-end justify-around gap-1 px-2 sm:gap-3 sm:px-6">
          {bars.map((bar, idx) => {
            const heightPercent = (bar.value / max) * 100;
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
                    className={`text-[10px] tabular-nums sm:text-xs ${
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
              </div>
            );
          })}
          {/* 5번째 막대 — 사용자 입찰가 (동적 height transition · brand-900) */}
          <div className="relative flex h-full w-full max-w-[50px] flex-col items-center justify-end sm:max-w-[80px]">
            <div className="mb-1 text-center sm:mb-2">
              <p className="text-[10px] font-black tabular-nums text-[var(--color-brand-900)] sm:text-xs">
                {formatKoreanWon(userPriceWon)}
              </p>
              <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-[var(--color-brand-900)] sm:text-[9px]">
                내 입찰가
              </p>
            </div>
            {/* 막대 + dashed connector (시세평균 라인까지) */}
            <div
              className="relative w-full"
              style={{ height: `${(userPriceWon / max) * 100}%` }}
            >
              <motion.div
                className="absolute inset-x-0 bottom-0 origin-bottom rounded-t-[var(--radius-xs)] border-2 border-dashed border-[var(--color-brand-900)] bg-white"
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.5, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: "100%" }}
              />
            </div>
            {/* dashed connector — 입찰가 막대 끝 → 시세평균 라인 까지 */}
            {saleAvg > 0 && Math.abs(userPriceWon - saleAvg) > 0 ? (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: `${(Math.min(userPriceWon, saleAvg) / max) * 100}%`,
                  height: `${(Math.abs(userPriceWon - saleAvg) / max) * 100}%`,
                }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 1.6 }}
              >
                <div className="h-full w-px border-l border-dashed border-[var(--color-ink-400)]" />
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>

      {/* dashed connector 라벨 (정량 차이 %) */}
      <motion.div
        className="mt-3 text-center text-[11px] font-medium tabular-nums text-[var(--color-ink-500)] sm:text-xs"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.7, duration: 0.4 }}
      >
        {`${round}차 최저가는 감정가 대비 −${animatedDropAppraisal}% · 시세 평균 대비 −${animatedDropSaleAvg}% 위치`}
      </motion.div>

      {/* 슬라이더 (Show-and-Play) */}
      <motion.div
        className="mt-5 origin-left rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4"
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
          <span className="text-xs font-black tabular-nums text-[var(--color-brand-900)]">
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
