"use client";

/**
 * 단계 5-4-2: Hero DropRateBar + 호버 인터랙티브 (Show-and-Play 본질).
 *
 * 시각 구조: 감정가 100% base bar (white/30) + 최저가 70% fill (white) + 70% vertical mark.
 * 스크롤 모션:
 *  · 0~30%: base bar fade-in
 *  · 30~60%: fill bar width animate (0% → percent%, motion useScroll·useTransform)
 *  · 60~100%: −30% chip count-up (motion useSpring 부드러운 변화)
 * 인터랙션 (Show-and-Play):
 *  · 사용자 hover/touchmove 시 marker (vertical line + 가격 tooltip) 표시
 *  · 키보드 slider — role="slider" + aria-valuenow + 좌·우 arrow 키 5% 단위
 * 모노톤: ink-900 fill bg + white·white/30·white/15 만.
 *
 * case study 인용: Apple "Stat-to-diagram flows" + scrollytelling "Show-and-Play" + Distill "interactive sliders".
 */
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

interface DropRateBarProps {
  appraisal: number;
  minPrice: number;
  percent: number;
  appraisalLabel?: string;
}

export function HoverableDropRateBar({
  appraisal,
  minPrice,
  percent,
  appraisalLabel,
}: DropRateBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  // once: true 사유: count-up 숫자 카운트 + fill bar line draw 1회 진행 본질 (룰 1 예외)
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const dropRate = computeDropRate(appraisal, minPrice);
  const animatedDrop = useCountUp(dropRate, inView, 600, 600);

  // 호버 marker 상태 (사용자 능동 인터랙션 — Show-and-Play)
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);
  // 키보드 slider 상태 (키보드 사용자용 marker)
  const [keyboardPercent, setKeyboardPercent] = useState<number>(percent);

  const activePercent = hoverPercent ?? keyboardPercent;
  const activePrice = Math.round((activePercent / 100) * appraisal);

  return (
    <div ref={ref} className="mt-3">
      <div
        role="slider"
        tabIndex={0}
        aria-label={`감정가 대비 가격 비교 슬라이더 — 좌우 화살표 키로 ${5}% 단위 이동. 현재 ${keyboardPercent}%, 가격 ${formatBillion(activePrice)}`}
        aria-valuenow={keyboardPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            setKeyboardPercent((p) => Math.max(0, p - 5));
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            setKeyboardPercent((p) => Math.min(100, p + 5));
          }
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
          setHoverPercent(Math.round(pct));
        }}
        onMouseLeave={() => setHoverPercent(null)}
        onTouchMove={(e) => {
          const t = e.touches[0];
          if (!t) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = t.clientX - rect.left;
          const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
          setHoverPercent(Math.round(pct));
        }}
        onTouchEnd={() => setHoverPercent(null)}
        className="relative h-2 w-full cursor-pointer overflow-visible rounded-full bg-white/30 outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-900)]"
      >
        {/* fill bar (최저가 percent% width) — motion 으로 width animate */}
        <motion.div
          className="absolute inset-y-0 left-0 origin-left rounded-full bg-white"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ width: `${percent}%` }}
        />
        {/* 70% vertical mark — fill bar 끝 위치 */}
        <motion.span
          aria-hidden="true"
          className="absolute -top-1 -bottom-1 w-px bg-white/80"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.0, duration: 0.3 }}
          style={{ left: `${percent}%` }}
        />
        {/* hover/keyboard marker — 사용자 능동 인터랙션 */}
        {hoverPercent !== null || (inView && keyboardPercent !== percent) ? (
          <span
            aria-hidden="true"
            className="absolute -top-2 -bottom-2 w-px bg-white"
            style={{ left: `${activePercent}%` }}
          />
        ) : null}
        {/* tooltip (hover 또는 keyboard active 시) */}
        {hoverPercent !== null || keyboardPercent !== percent ? (
          <span
            className="pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-1 text-[11px] font-bold tabular-nums text-[var(--color-ink-900)] shadow-md"
            style={{ left: `${activePercent}%` }}
          >
            {formatBillion(activePrice)} = 감정가의 {activePercent}%
          </span>
        ) : null}
      </div>

      {/* 라벨 — 감정가 좌측 + 하락률 우측 (count-up) */}
      <motion.div
        className="mt-2 flex items-baseline justify-between text-[11px] font-medium tabular-nums text-white/85"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <span>감정가 {appraisalLabel ?? formatBillion(appraisal)}</span>
        <span className="rounded-[var(--radius-xs)] bg-white/15 px-2 py-0.5 font-bold tabular-nums">
          −{animatedDrop}%
        </span>
      </motion.div>
    </div>
  );
}

function computeDropRate(appraisal: number, minPrice: number): number {
  if (!appraisal || !minPrice) return 0;
  return Math.round(((appraisal - minPrice) / appraisal) * 100);
}

function formatBillion(amount: number): string {
  const eok = amount / 100_000_000;
  return `${eok.toFixed(2)}억`;
}

/** count-up: target 까지 RAF + ease-out cubic. */
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
