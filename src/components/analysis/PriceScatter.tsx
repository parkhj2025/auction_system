"use client";

/**
 * 단계 5-4-2: 04 시세 비교 — 1D scatter + 사용자 가격 입력 (Show-and-Play 본질).
 *
 * 시각 구조:
 *  - 수평 축선 (가격 0 → max)
 *  - 점 3개: 감정가 (ink-500) / 시세 평균 (ink-900) / 최저가 (ink-900 outline)
 *  - 사용자 가격 입력 → 4번째 점 (ink-900 dashed) + 차이 % 즉시 계산
 *
 * 스크롤 모션:
 *  - 0~25% 축선 line draw
 *  - 25~50% 점 3개 stagger fade-in (감정가 → 시세 → 최저가, 100ms 간격)
 *  - 50~75% 차이 화살표 + count-up
 *  - 75~100% 사용자 가격 input fade-in
 *
 * 인터랙션 (Show-and-Play):
 *  - 사용자가 input 에 가격 입력 → 4번째 점 추가 + "시세 평균 대비 X% / 감정가 대비 Y%" 즉시 표시
 *  - 점 hover (desktop) → 정확 가격 tooltip
 *  - 키보드: Tab → input → arrow ±100만원
 *
 * 모노톤: 감정가 ink-500 / 시세평균 ink-900 / 최저가 ink-900 outline / 사용자 점 ink-900 dashed.
 *
 * case study 인용: scrollytelling Show-and-Play + chart-visualization scatter + Distill "Parameter sliders update plots in real-time".
 */
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { formatKoreanWon } from "@/lib/utils";

interface PriceScatterProps {
  appraisal: number;
  saleAvg: number;
  minPrice: number;
  round: number;
}

export function PriceScatter({ appraisal, saleAvg, minPrice, round }: PriceScatterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const max = Math.max(appraisal, saleAvg, minPrice) * 1.05;
  const pos = (v: number) => (v / max) * 100;

  const dropFromAppraisal = Math.round(((appraisal - minPrice) / appraisal) * 100);
  const dropFromSaleAvg = Math.round(((saleAvg - minPrice) / saleAvg) * 100);
  const animatedDropAppraisal = useCountUp(dropFromAppraisal, inView, 600, 1500);
  const animatedDropSaleAvg = useCountUp(dropFromSaleAvg, inView, 600, 1500);

  // 사용자 가격 입력 (Show-and-Play 본질)
  const [userPriceWon, setUserPriceWon] = useState<number | null>(null);
  const userVsAppraisal =
    userPriceWon != null
      ? Math.round(((appraisal - userPriceWon) / appraisal) * 100)
      : null;
  const userVsSaleAvg =
    userPriceWon != null
      ? Math.round(((saleAvg - userPriceWon) / saleAvg) * 100)
      : null;

  return (
    <div ref={ref} className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
        가격 분포
      </p>

      {/* scatter — sm+ 표시. 모바일은 stack fallback 으로 carousel 보다 입력만 사용 */}
      <div className="relative mt-8 hidden h-32 w-full sm:block" role="img" aria-label="가격 비교 산점도">
        {/* 축선 line draw */}
        <motion.span
          aria-hidden="true"
          className="absolute left-0 right-0 top-1/2 h-px origin-left -translate-y-1/2 bg-[var(--color-border)]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
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
        <ScatterPoint
          leftPercent={pos(minPrice)}
          size={16}
          fillCls="border-2 border-[var(--color-ink-900)] bg-white"
          label={`${round}차 최저가`}
          valueLabel={formatKoreanWon(minPrice)}
          labelPosition="top"
          delay={0.6}
          inView={inView}
          accent
        />
        {/* 사용자 입력 점 — Show-and-Play */}
        {userPriceWon != null && userPriceWon > 0 && userPriceWon <= max ? (
          <motion.div
            key={userPriceWon}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${pos(userPriceWon)}%` }}
          >
            <span
              aria-hidden="true"
              className="block h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-dashed border-[var(--color-ink-900)] bg-white"
            />
            <p className="absolute -top-7 left-0 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold tabular-nums text-[var(--color-ink-900)]">
              내 입력
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
        {`최저가는 감정가 대비 −${animatedDropAppraisal}% · 시세 평균 대비 −${animatedDropSaleAvg}% 위치`}
      </motion.div>

      {/* 사용자 가격 입력 (Show-and-Play 본질) */}
      <motion.div
        className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 1.8, duration: 0.4 }}
      >
        <label
          htmlFor="user-price-input"
          className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-700)]"
        >
          내 입찰가 시뮬레이션
        </label>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <input
            id="user-price-input"
            type="number"
            inputMode="numeric"
            placeholder={`${(minPrice / 10000).toFixed(0)}`}
            min={0}
            step={1000}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                setUserPriceWon(null);
                return;
              }
              const won = Math.round(parseFloat(v) * 10000); // 만원 → 원 환산
              setUserPriceWon(Number.isFinite(won) && won > 0 ? won : null);
            }}
            className="w-32 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-1.5 text-sm tabular-nums focus-visible:border-[var(--color-ink-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-900)]/30"
          />
          <span className="text-xs text-[var(--color-ink-500)]">만원</span>
          {userPriceWon != null && userPriceWon > 0 ? (
            <p className="text-xs tabular-nums text-[var(--color-ink-700)]">
              ={" "}
              <span className="font-bold">
                {formatKoreanWon(userPriceWon)}
              </span>
              {userVsAppraisal != null && userVsSaleAvg != null ? (
                <>
                  {" · 감정가 대비 "}
                  <span className="font-bold text-[var(--color-ink-900)]">
                    {userVsAppraisal > 0 ? "−" : "+"}
                    {Math.abs(userVsAppraisal)}%
                  </span>
                  {" · 시세 평균 대비 "}
                  <span className="font-bold text-[var(--color-ink-900)]">
                    {userVsSaleAvg > 0 ? "−" : "+"}
                    {Math.abs(userVsSaleAvg)}%
                  </span>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
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
          className={`text-[9px] font-bold uppercase tracking-wider ${
            accent ? "text-[var(--color-ink-900)]" : "text-[var(--color-ink-500)]"
          }`}
        >
          {label}
        </p>
        <p
          className={`mt-0.5 text-xs font-black tabular-nums ${
            accent ? "text-[var(--color-ink-900)]" : "text-[var(--color-ink-900)]"
          }`}
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
