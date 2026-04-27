"use client";

/**
 * 05 시나리오 카드뉴스 — 단계 5-4-2-fix-2 Phase 3.
 *
 * 형식 (형준님 결정 13):
 *  - 4 시나리오 (A·B·C-1·C-2) 가로 carousel — 한 화면에 1 카드 + 양옆 silhouette peek
 *  - swipe (mobile touch) + arrow 버튼 + 키보드 ArrowLeft/Right
 *  - AnimatePresence crossfade slide horizontal
 *  - pagination dots (4개)
 *
 * 카드 내용 (형준님 결정 14):
 *  - 시나리오 번호·라벨 (A·B·C-1·C-2)
 *  - 4 차원 stat (자기자본·예상수익·기간·리스크)
 *  - summary 산문 (Cowork raw 의 scenario_x.summary)
 *
 * 단일 source state (형준님 결정 11):
 *  - props 로 activeKey + biddingPercent 받아 ScenarioComparisonBox 와 동기화
 *  - 슬라이더는 ScenarioComparisonBox 에 위치 (drag 시 카드뉴스 + 비교 표 모두 재계산)
 *
 * 모노톤: ink + ink-900 단일 강조.
 */
import { motion, AnimatePresence } from "motion/react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { InvestmentMeta, ScenarioFields } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

const SCENARIO_KEYS = ["A", "B", "C-1", "C-2"] as const;
type ScenarioKey = (typeof SCENARIO_KEYS)[number];

const SCENARIO_DEFAULT_LABELS: Record<ScenarioKey, string> = {
  A: "실거주 매입",
  B: "1년 매도",
  "C-1": "갭투자",
  "C-2": "월세 운용",
};

interface ScenarioCarouselProps {
  investment: InvestmentMeta;
  appraisal: number;
  minPrice: number;
  activeKey: ScenarioKey;
  onActiveKeyChange: (v: ScenarioKey) => void;
  biddingPercent: number;
}

export function ScenarioCarousel({
  investment,
  minPrice,
  appraisal,
  activeKey,
  onActiveKeyChange,
  biddingPercent,
}: ScenarioCarouselProps) {
  const touchStartXRef = useRef<number | null>(null);
  const userBidPrice = Math.round(
    minPrice + (biddingPercent / 100) * (appraisal - minPrice)
  );

  const visible = SCENARIO_KEYS.filter((k) => getScenario(investment, k) !== null);
  if (visible.length === 0) return null;

  const currentIdx = Math.max(0, visible.indexOf(activeKey));
  const safeKey = visible[currentIdx] ?? visible[0];

  const stat = getScenario(investment, safeKey);

  const next = () => {
    const ni = (currentIdx + 1) % visible.length;
    onActiveKeyChange(visible[ni]);
  };
  const prev = () => {
    const pi = (currentIdx - 1 + visible.length) % visible.length;
    onActiveKeyChange(visible[pi]);
  };

  // touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartXRef.current;
    if (startX == null) return;
    const endX = e.changedTouches[0]?.clientX ?? startX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStartXRef.current = null;
  };

  if (!stat) return null;

  return (
    <div
      className="mt-6"
      role="region"
      aria-roledescription="carousel"
      aria-label="시나리오 4종 카드뉴스"
    >
      <div
        className="relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            next();
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            prev();
          }
        }}
        tabIndex={0}
      >
        {/* arrow 버튼 */}
        <button
          type="button"
          onClick={prev}
          aria-label="이전 시나리오"
          className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-ink-700)] shadow-[var(--shadow-card)] transition-colors duration-200 hover:bg-[var(--color-ink-50)] hover:text-[var(--color-ink-900)] sm:-left-4"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="다음 시나리오"
          className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-ink-700)] shadow-[var(--shadow-card)] transition-colors duration-200 hover:bg-[var(--color-ink-50)] hover:text-[var(--color-ink-900)] sm:-right-4"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>

        {/* 카드 영역 — AnimatePresence crossfade slide */}
        <div className="overflow-hidden px-8 sm:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeKey}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[var(--color-surface-muted)] p-6 sm:p-8"
              aria-live="polite"
              aria-roledescription="slide"
              aria-label={`시나리오 ${safeKey}, ${currentIdx + 1} of ${visible.length}`}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black tabular-nums text-[var(--color-ink-900)] sm:text-4xl">
                  {safeKey}
                </span>
                <h3 className="text-base font-black tracking-tight text-[var(--color-ink-900)] sm:text-lg">
                  {stat.label}
                </h3>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                <Stat label="자기자본" value={formatKoreanWon(stat.selfCapital)} />
                <Stat
                  label="예상 수익"
                  value={
                    stat.profit === 0
                      ? "—"
                      : `${stat.profit < 0 ? "−" : "+"}${formatKoreanWon(Math.abs(stat.profit))}`
                  }
                />
                <Stat
                  label="보유 기간"
                  value={stat.holdingYears != null ? `${stat.holdingYears}년` : "—"}
                />
                <Stat label="리스크" value={resolveRiskLabel(stat.riskLevel)} />
              </dl>

              {stat.summary ? (
                <p className="mt-5 text-sm leading-7 text-[var(--color-ink-700)]">
                  {stat.summary}
                </p>
              ) : null}

              <p className="mt-5 border-t border-[var(--color-border)] pt-3 text-[11px] tabular-nums text-[var(--color-ink-500)]">
                입찰가{" "}
                <span className="font-black text-[var(--color-ink-900)]">
                  {formatKoreanWon(userBidPrice)}
                </span>{" "}
                기준 (비교 표 슬라이더 drag 으로 변경)
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* pagination dots */}
      <div
        role="tablist"
        aria-label="시나리오 카드뉴스 페이지"
        className="mt-4 flex items-center justify-center gap-2"
      >
        {visible.map((key, idx) => {
          const isActive = idx === currentIdx;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`시나리오 ${key} 으로 이동`}
              onClick={() => onActiveKeyChange(key)}
              className="group inline-flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`inline-block rounded-full transition-all duration-200 ${
                  isActive
                    ? "h-2 w-6 bg-[var(--color-ink-900)]"
                    : "h-2 w-2 bg-[var(--color-ink-300)] group-hover:bg-[var(--color-ink-700)]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
        {label}
      </dt>
      <dd className="mt-1 text-base font-black tabular-nums text-[var(--color-ink-900)]">
        {value}
      </dd>
    </div>
  );
}

interface ScenarioStat {
  label: string;
  selfCapital: number;
  profit: number;
  holdingYears: number | null;
  riskLevel: string;
  summary: string;
}

function getScenario(
  investment: InvestmentMeta,
  key: ScenarioKey
): ScenarioStat | null {
  const raw = pickRaw(investment, key);
  if (!raw) return null;
  const selfCapital = asNumber(raw.self_capital_with_loan) ?? 0;
  const profit = asNumber(raw.after_tax_profit) ?? 0;
  const holdingYears = asNumber(raw.holding_period_years);
  const riskLevel = String(raw.risk_level ?? "mid");
  const label = String(raw.label ?? SCENARIO_DEFAULT_LABELS[key]);
  const summary = String(raw.summary ?? "");
  return { label, selfCapital, profit, holdingYears, riskLevel, summary };
}

function pickRaw(
  investment: InvestmentMeta,
  key: ScenarioKey
): ScenarioFields | null {
  switch (key) {
    case "A":
      return investment.scenario_a;
    case "B":
      return investment.scenario_b;
    case "C-1":
      return investment.scenario_c1;
    case "C-2":
      return investment.scenario_c2;
  }
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return null;
}

function resolveRiskLabel(level: string): string {
  switch (level) {
    case "low":
      return "낮음";
    case "high":
      return "높음";
    case "mid":
    default:
      return "중간";
  }
}

