"use client";

/**
 * 단계 5-4-1: Hero DropRateBar 다이어그램.
 *  감정가(base 100%) → 최저가(fill 70%) 시각화 + −30% 하락률 count-up.
 *  스크롤 진행:
 *   0~30% — base bar fade-in
 *   30~60% — fill bar width animate (0% → percent%)
 *   60~100% — −30% 라벨 fade-in + count-up (0 → dropRate)
 *  prefers-reduced-motion: globals.css 글로벌 룰이 transition/animation 0 강제.
 *
 *  무채색 강제: white·white/30·white/15·white/85 한정 (DominantStat brand-600 bg 위).
 *  ui-ux-pro-max#visual-hierarchy + #motion-meaning + #number-tabular 정합.
 */
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

interface DropRateBarProps {
  /** 감정가 (= base bar 100%) */
  appraisal: number;
  /** 최저가 (fill bar) */
  minPrice: number;
  /** 최저가 / 감정가 비율 (예: 70 — `frontmatter.percent` 와 동일) */
  percent: number;
  /** 감정가 라벨 표기 (예: "1.78억") */
  appraisalLabel?: string;
}

export function DropRateBar({
  appraisal,
  minPrice,
  percent,
  appraisalLabel,
}: DropRateBarProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const dropRate = computeDropRate(appraisal, minPrice);
  const animatedDrop = useCountUp(dropRate, inView, 600, 600);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`감정가 대비 최저가 막대 — ${percent}% 진입선, 하락률 ${dropRate}%`}
      className="relative mt-3"
    >
      {/* base bar (감정가 100%) — fade-in 0~300ms */}
      <div
        className={`relative h-2 w-full overflow-hidden rounded-full bg-white/30 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* fill bar (최저가 percent%) — width animate 300~900ms (좌→우) */}
        <div
          className="absolute inset-y-0 left-0 origin-left rounded-full bg-white transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]"
          style={{
            width: `${percent}%`,
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transitionDelay: "200ms",
          }}
        />
      </div>

      {/* 라벨 — 감정가 좌측 + 하락률 우측 (fade-in 600ms+) */}
      <div
        className={`mt-2 flex items-baseline justify-between text-[11px] font-medium tabular-nums text-white/85 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] ${
          inView ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "600ms" }}
      >
        <span>감정가 {appraisalLabel ?? formatBillion(appraisal)}</span>
        <span className="rounded-[var(--radius-xs)] bg-white/15 px-2 py-0.5 font-bold tabular-nums">
          −{animatedDrop}%
        </span>
      </div>
    </div>
  );
}

/** 감정가 대비 최저가 하락률 % (정수 반올림). */
function computeDropRate(appraisal: number, minPrice: number): number {
  if (!appraisal || !minPrice) return 0;
  const rate = ((appraisal - minPrice) / appraisal) * 100;
  return Math.round(rate);
}

/** 감정가를 "1.78억" 형식으로 포맷 (소수 1자리). */
function formatBillion(amount: number): string {
  const eok = amount / 100_000_000;
  return `${eok.toFixed(2)}억`;
}

/** count-up: target 값까지 duration 동안 정수 증가. inView=true 시점부터 delay 후 시작.
 *  active=false 또는 target=0 인 경우 value 는 초기값 (0) 유지 (early return). */
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
