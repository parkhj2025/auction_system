"use client";

/**
 * Hero progress bar (단계 5-4-2-fix-8 룰 30 — 라이트 토큰 전환).
 *
 * 변경 (단계 5-4-2-fix-7 다크 영역 → fix-8 라이트 영역):
 *  - fill bar 영역 white → ink-900
 *  - fill bar 빈 영역 white/30 → ink-100
 *  - 70% 마크 white/80 → ink-900
 *  - hover/marker white → ink-900
 *  - 라벨 white/70 → ink-700
 *  - tooltip bg-white text-ink-900 보존 (라이트에서 강조 색)
 *  - "−X%" 칩 bg-brand-300/70 + ink-900 (룰 24-D 보존)
 *
 * 룰 7 motion 본질 100% 보존 (1.6초 cubic + count-up 동기화 + once: true 예외).
 * 룰 24-D monochrome + 1 accent 본질 보존 (brand-300/70 1 곳).
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
  // 룰 7 (단계 5-4-2-fix-4): count-up duration 1600ms (fill bar 와 동기화)
  const animatedDrop = useCountUp(dropRate, inView, 1600, 200);

  // 호버 marker 상태 (Show-and-Play)
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);
  // 키보드 slider 상태
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
        className="relative h-2 w-full cursor-pointer overflow-visible rounded-full bg-[var(--color-ink-100)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-900)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        {/* fill bar — 룰 30 라이트 토큰 (white → ink-900). 룰 7 motion 본질 보존 */}
        <motion.div
          className="absolute inset-y-0 left-0 origin-left rounded-full bg-[var(--color-ink-900)]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 1.6,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ width: `${percent}%` }}
        />
        {/* 70% 마크 — 룰 30 라이트 토큰 (white/80 → ink-900) */}
        <motion.span
          aria-hidden="true"
          className="absolute -top-1 -bottom-1 w-px bg-[var(--color-ink-900)]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.8, duration: 0.3 }}
          style={{ left: `${percent}%` }}
        />
        {/* hover/keyboard marker */}
        {hoverPercent !== null || (inView && keyboardPercent !== percent) ? (
          <span
            aria-hidden="true"
            className="absolute -top-2 -bottom-2 w-px bg-[var(--color-ink-900)]"
            style={{ left: `${activePercent}%` }}
          />
        ) : null}
        {/* tooltip */}
        {hoverPercent !== null || keyboardPercent !== percent ? (
          <span
            className="pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--color-ink-900)] px-2 py-1 text-[11px] font-bold tabular-nums text-white shadow-md"
            style={{ left: `${activePercent}%` }}
          >
            {formatBillion(activePrice)} = 감정가의 {activePercent}%
          </span>
        ) : null}
      </div>

      {/* 라벨 — 룰 30 라이트 토큰 (white/70 → ink-700). 룰 24-D brand-300/70 칩 보존 */}
      <motion.div
        className="mt-2 flex items-baseline justify-between text-[length:var(--text-body-sm)] font-medium tabular-nums text-[var(--color-ink-700)]"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <span>감정가 {appraisalLabel ?? formatBillion(appraisal)}</span>
        <span className="rounded-[var(--radius-xs)] bg-[var(--color-brand-300)]/70 px-2 py-0.5 font-semibold tabular-nums text-[var(--color-ink-900)]">
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
