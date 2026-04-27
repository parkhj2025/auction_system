"use client";

import type { MarketMeta } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * 04 시세 비교 — callout + 1D scatter 다이어그램 + 3 카드 grid (단계 5-4-1).
 *
 * 단계 5-4-1 변경:
 *  - "use client" — useInView 사용
 *  - 신규 1D scatter 다이어그램 (sm+ 표시) — 가격 축 위 점 3개 (감정가·시세평균·최저가)
 *    · 감정가: ink-500 medium 점
 *    · 시세 평균: ink-900 large 점 (비교 기준점)
 *    · {round}차 최저가: brand-600 outline 큰 원 (단일 액센트)
 *    · 점 사이 차이 화살표 + count-up 라벨
 *  - 모바일: scatter 숨김 (sm:hidden 반대로 sm:block 만 노출 — 모바일은 callout + grid 로 정보 손실 0)
 *  - callout + 3 카드 grid 보존 (정확 수치 보조)
 *  - 스크롤 진행:
 *    · 0~25% — 축선 fade-in
 *    · 25~50% — 점 3개 stagger fade-in (좌→우)
 *    · 50~75% — 차이 화살표 line draw
 *    · 75~100% — 차이 % 라벨 count-up
 *  - prefers-reduced-motion: globals.css 글로벌 룰이 transition 0 강제
 */
export function MarketCompareCard({
  market,
  appraisal,
  minPrice,
  round,
  percent,
}: {
  market: MarketMeta;
  appraisal: number;
  minPrice: number;
  round: number;
  percent: number;
}) {
  const saleAvg = market.sale_avg;
  const saleCount = market.sale_count;
  if (saleAvg == null || saleAvg <= 0) return null;

  const avgVsAppraisalRatio = (saleAvg / appraisal) * 100;
  const minVsAvgRatio = (minPrice / saleAvg) * 100;

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-[var(--radius-md)] border-l-4 border-brand-600 bg-[var(--color-brand-50)] px-4 py-3 text-sm leading-6 text-[var(--color-ink-700)]">
        시세 평균 대비 {round}차 최저가는{" "}
        <span className="font-bold tabular-nums text-[var(--color-brand-700)]">
          {minVsAvgRatio.toFixed(0)}%
        </span>{" "}
        수준
        {saleCount != null ? (
          <span className="text-[var(--color-ink-500)]">
            {" "}(시세 평균 {saleCount}건 기준)
          </span>
        ) : null}
        .
      </div>

      {/* 단계 5-4-1: 1D scatter (sm+ 만 노출, 모바일은 grid 로 fallback) */}
      <PriceScatter
        appraisal={appraisal}
        saleAvg={saleAvg}
        minPrice={minPrice}
        round={round}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CompareCell label="감정가" value={formatKoreanWon(appraisal)} sub="기준가" />
        <CompareCell
          label="시세 평균"
          value={formatKoreanWon(saleAvg)}
          sub={`감정가의 ${avgVsAppraisalRatio.toFixed(0)}%`}
          accent
        />
        <CompareCell
          label={`${round}차 최저가`}
          value={formatKoreanWon(minPrice)}
          sub={`시세 평균의 ${minVsAvgRatio.toFixed(0)}% · 감정가 ${percent}%`}
        />
      </div>
    </div>
  );
}

/** 단계 5-4-1: 1D scatter 다이어그램 (sm+ 전용).
 *  x축 = 가격 (0 → max), 점 3개 위치 = (price / maxPrice) * 100%.
 *  무채색 강제: ink-500 (감정가) / ink-900 (시세평균) / brand-600 (최저가, 단일 액센트). */
function PriceScatter({
  appraisal,
  saleAvg,
  minPrice,
  round,
}: {
  appraisal: number;
  saleAvg: number;
  minPrice: number;
  round: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const max = Math.max(appraisal, saleAvg, minPrice) * 1.05;
  const pos = (v: number) => (v / max) * 100;

  // 차이 % count-up
  const dropFromAppraisal = Math.round(((appraisal - minPrice) / appraisal) * 100);
  const dropFromSaleAvg = Math.round(((saleAvg - minPrice) / saleAvg) * 100);
  const animatedDropAppraisal = useCountUp(dropFromAppraisal, inView, 600, 1500);
  const animatedDropSaleAvg = useCountUp(dropFromSaleAvg, inView, 600, 1500);

  return (
    <div
      ref={ref}
      className="relative hidden h-32 w-full sm:block"
      role="img"
      aria-label={`가격 비교 산점도 — 감정가 / 시세 평균 / ${round}차 최저가 분포`}
    >
      {/* 축선 (수평 line, scroll reveal scaleX origin-left, duration-slow) */}
      <span
        aria-hidden="true"
        className="absolute left-0 right-0 top-1/2 h-px origin-left -translate-y-1/2 bg-[var(--color-border)] transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]"
        style={{ transform: inView ? "scaleX(1)" : "scaleX(0)" }}
      />

      {/* 점 3개 (위치 = % linear scale) */}
      <ScatterPoint
        leftPercent={pos(appraisal)}
        size={10}
        fillCls="bg-[var(--color-ink-500)]"
        label="감정가"
        valueLabel={formatKoreanWon(appraisal)}
        labelPosition="top"
        delay={400}
        inView={inView}
      />
      <ScatterPoint
        leftPercent={pos(saleAvg)}
        size={14}
        fillCls="bg-[var(--color-ink-900)]"
        label="시세 평균"
        valueLabel={formatKoreanWon(saleAvg)}
        labelPosition="bottom"
        delay={500}
        inView={inView}
      />
      <ScatterPoint
        leftPercent={pos(minPrice)}
        size={16}
        fillCls="border-2 border-[var(--color-brand-600)] bg-white"
        label={`${round}차 최저가`}
        valueLabel={formatKoreanWon(minPrice)}
        labelPosition="top"
        delay={600}
        inView={inView}
        accent
      />

      {/* 차이 라벨 (시세 평균 ↔ 최저가 — count-up) */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-medium tabular-nums text-[var(--color-ink-500)] transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)]"
        style={{ opacity: inView ? 1 : 0, transitionDelay: "1500ms" }}
      >
        감정가 대비 −{animatedDropAppraisal}% · 시세 평균 대비 −{animatedDropSaleAvg}%
      </div>
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
    <div
      className="absolute top-1/2 -translate-y-1/2"
      style={{ left: `${leftPercent}%` }}
    >
      {/* 점 (scroll reveal scale 0→1) */}
      <span
        aria-hidden="true"
        className={`block -translate-x-1/2 rounded-full transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] ${fillCls}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: inView ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0)",
          transitionDelay: `${delay}ms`,
        }}
      />
      {/* 라벨 (점 위 또는 아래) */}
      <div
        className={`absolute left-0 -translate-x-1/2 whitespace-nowrap text-center transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)] ${
          isTop ? "bottom-full mb-2" : "top-full mt-2"
        }`}
        style={{ opacity: inView ? 1 : 0, transitionDelay: `${delay + 200}ms` }}
      >
        <p
          className={`text-[9px] font-bold uppercase tracking-wider ${
            accent ? "text-[var(--color-brand-700)]" : "text-[var(--color-ink-500)]"
          }`}
        >
          {label}
        </p>
        <p
          className={`mt-0.5 text-xs font-black tabular-nums ${
            accent ? "text-[var(--color-brand-700)]" : "text-[var(--color-ink-900)]"
          }`}
        >
          {valueLabel}
        </p>
      </div>
    </div>
  );
}

/** count-up: target 까지 duration 동안 정수 증가. inView=true 시점부터 delay 후 시작.
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

function CompareCell({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 ${
        accent ? "bg-[var(--color-brand-50)]" : "bg-white"
      }`}
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
          accent ? "text-[var(--color-brand-700)]" : "text-[var(--color-ink-500)]"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1.5 text-xl font-black tabular-nums leading-tight sm:text-2xl ${
          accent ? "text-[var(--color-brand-700)]" : "text-[var(--color-ink-900)]"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 text-[11px] tabular-nums ${
          accent ? "text-[var(--color-brand-700)]" : "text-[var(--color-ink-500)]"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}
