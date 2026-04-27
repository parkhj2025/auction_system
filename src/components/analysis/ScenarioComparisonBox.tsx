"use client";

/**
 * 05 시나리오 비교 — 단계 5-4-2-fix Phase 3: 컴팩트 비교 표 (4 컬럼 × 4 차원 + 슬라이더).
 *
 * 변경 (형준님 본질 통찰 — 세로 쌓임 평이 → 컴팩트 비교 표):
 *  - 단계 5-4-2 tab → detail → mini chart → 슬라이더 세로 쌓임 폐기
 *  - 컴팩트 비교 표 (가로 4 시나리오 컬럼 × 세로 4 차원 행)
 *    · 자기자본: 숫자 + 가로 막대 (시나리오 간 비교)
 *    · 예상수익: 숫자 + 점 위치 (좌 손실 / 우 수익)
 *    · 보유 기간: 숫자
 *    · 리스크: 라벨 (낮음·중간·높음 — ink 농도 차등)
 *  - 활성 시나리오 (hover·click) → ink-900 strong / 비활성 → ink-300 또는 opacity 0.5
 *  - 슬라이더 drag 시 모든 셀 실시간 재계산 (자기자본·예상수익)
 *
 * 모노톤: ink-900/700/500/300/100 + ink-900 단일 강조.
 * 의도: 다이어그램 적재적소 분배 (05 컴팩트 강화).
 */
import { motion, useInView } from "motion/react";
import { useRef, useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { InvestmentMeta, ScenarioFields } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

const SCENARIO_KEYS = ["A", "B", "C-1", "C-2"] as const;
type ScenarioKey = (typeof SCENARIO_KEYS)[number];

interface ScenarioComparisonBoxProps {
  investment: InvestmentMeta;
  appraisal: number;
  minPrice: number;
  biddingPercent?: number;
  onBiddingPercentChange?: (v: number) => void;
  activeKey?: ScenarioKey | null;
  onActiveKeyChange?: (v: ScenarioKey | null) => void;
}

const SCENARIO_DEFAULT_LABELS: Record<ScenarioKey, string> = {
  A: "실거주",
  B: "1년 매도",
  "C-1": "갭투자",
  "C-2": "월세",
};

interface ScenarioStat {
  label: string;
  selfCapital: number;
  profit: number;
  holdingYears: number | null;
  riskLevel: string;
  summary: string;
}

export function ScenarioComparisonBox({
  investment,
  appraisal,
  minPrice,
  biddingPercent: biddingPercentProp,
  onBiddingPercentChange,
  activeKey: activeKeyProp,
  onActiveKeyChange,
}: ScenarioComparisonBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  // 룰 1 (단계 5-4-2-fix-3): once: false — 위·아래 스크롤 재실행 의무
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const [internalActiveKey, setInternalActiveKey] = useState<ScenarioKey | null>(null);
  const [internalBiddingPercent, setInternalBiddingPercent] = useState<number>(0);
  const activeKey = activeKeyProp !== undefined ? activeKeyProp : internalActiveKey;
  const setActiveKey = (v: ScenarioKey | null) => {
    if (onActiveKeyChange) onActiveKeyChange(v);
    else setInternalActiveKey(v);
  };
  const biddingPercent =
    biddingPercentProp !== undefined ? biddingPercentProp : internalBiddingPercent;
  const setBiddingPercent = (v: number) => {
    if (onBiddingPercentChange) onBiddingPercentChange(v);
    else setInternalBiddingPercent(v);
  };
  const userBidPrice = Math.round(
    minPrice + (biddingPercent / 100) * (appraisal - minPrice)
  );

  const scenarios: Record<ScenarioKey, ScenarioStat | null> = useMemo(() => {
    return {
      A: buildScenarioStat(investment.scenario_a, "A", userBidPrice, minPrice),
      B: buildScenarioStat(investment.scenario_b, "B", userBidPrice, minPrice),
      "C-1": buildScenarioStat(investment.scenario_c1, "C-1", userBidPrice, minPrice),
      "C-2": buildScenarioStat(investment.scenario_c2, "C-2", userBidPrice, minPrice),
    };
  }, [investment, userBidPrice, minPrice]);

  const visible = SCENARIO_KEYS.filter((k) => scenarios[k] !== null);
  if (visible.length === 0) return null;

  const visibleStats = visible
    .map((k) => scenarios[k])
    .filter((s): s is ScenarioStat => s !== null);

  const maxCapital = Math.max(...visibleStats.map((s) => Math.abs(s.selfCapital)), 1);
  const maxProfitAbs = Math.max(...visibleStats.map((s) => Math.abs(s.profit)), 1);

  return (
    <div
      ref={ref}
      className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white p-6 sm:p-8"
    >
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
          시나리오 비교
        </p>
        <p className="text-[11px] tabular-nums text-[var(--color-ink-500)]">
          입찰가{" "}
          <span className="font-black text-[var(--color-ink-900)]">
            {formatKoreanWon(userBidPrice)}
          </span>{" "}
          기준
        </p>
      </div>

      {/* 컴팩트 비교 표 — 룰 17-D mobile horizontal scroll + edge gradient + scroll cue */}
      <div className="relative mt-5">
        <div className="overflow-x-auto pb-2">
          <table
            className="w-full min-w-[600px] border-collapse text-left"
            aria-label="시나리오 4종 비교"
          >
          {/* 헤더 (4 컬럼 = 시나리오) */}
          <thead>
            <tr>
              <th
                scope="col"
                className="w-[15%] py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]"
              >
                차원
              </th>
              {visible.map((key) => {
                const isActive = key === activeKey;
                return (
                  <th
                    key={key}
                    scope="col"
                    className="px-2 py-2 align-bottom"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveKey(activeKey === key ? null : key)
                      }
                      onMouseEnter={() => setActiveKey(key)}
                      onMouseLeave={() => setActiveKey(null)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight") {
                          e.preventDefault();
                          const idx = visible.indexOf(key);
                          setActiveKey(visible[(idx + 1) % visible.length]);
                        } else if (e.key === "ArrowLeft") {
                          e.preventDefault();
                          const idx = visible.indexOf(key);
                          setActiveKey(
                            visible[(idx - 1 + visible.length) % visible.length]
                          );
                        }
                      }}
                      aria-pressed={isActive}
                      className={`block w-full text-left transition-colors ${
                        isActive
                          ? "text-[var(--color-ink-900)]"
                          : "text-[var(--color-ink-500)]"
                      }`}
                    >
                      <div className="text-base font-black tabular-nums">
                        {key}
                      </div>
                      <div
                        className={`text-[11px] font-medium ${
                          isActive ? "" : "opacity-70"
                        }`}
                      >
                        {SCENARIO_DEFAULT_LABELS[key]}
                      </div>
                      {/* active 표시 underline */}
                      <motion.span
                        aria-hidden="true"
                        className="mt-1.5 block h-0.5 w-full bg-[var(--color-ink-900)]"
                        initial={false}
                        animate={{ scaleX: isActive ? 1 : 0, originX: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* Row 1 — 자기자본 (숫자 + 막대) */}
            <tr className="border-t border-[var(--color-border)]">
              <th
                scope="row"
                className="py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]"
              >
                자기자본
              </th>
              {visible.map((key) => {
                const stat = scenarios[key]!;
                const isActive = key === activeKey;
                const widthPct = (Math.abs(stat.selfCapital) / maxCapital) * 100;
                return (
                  <td key={key} className={`px-2 py-3 align-top transition-colors ${isActive ? "bg-[var(--color-ink-100)]" : ""}`}>
                    <div
                      className={`text-sm tabular-nums ${
                        isActive
                          ? "font-black text-[var(--color-ink-900)]"
                          : activeKey
                            ? "font-medium text-[var(--color-ink-500)] opacity-50"
                            : "font-bold text-[var(--color-ink-700)]"
                      }`}
                    >
                      {formatKoreanWon(stat.selfCapital)}
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--color-ink-100)]">
                      <motion.span
                        aria-hidden="true"
                        className={`block h-1.5 origin-left rounded-full ${
                          isActive
                            ? "bg-[var(--color-ink-900)]"
                            : activeKey
                              ? "bg-[var(--color-ink-300)]"
                              : "bg-[var(--color-ink-700)]"
                        }`}
                        animate={{
                          width: inView ? `${widthPct}%` : "0%",
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
            {/* Row 2 — 예상 수익 (숫자 + 점 위치) */}
            <tr className="border-t border-[var(--color-border)]">
              <th
                scope="row"
                className="py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]"
              >
                예상 수익
              </th>
              {visible.map((key) => {
                const stat = scenarios[key]!;
                const isActive = key === activeKey;
                const offset = (stat.profit / maxProfitAbs) * 50; // -50% ~ +50%
                return (
                  <td key={key} className={`px-2 py-3 align-top transition-colors ${isActive ? "bg-[var(--color-ink-100)]" : ""}`}>
                    {/* 룰 21-C 시각 강조: 화살표 (TrendingUp/Down) + 수치 */}
                    <div
                      className={`flex items-center gap-1 text-sm tabular-nums ${
                        isActive
                          ? "font-black text-[var(--color-ink-900)]"
                          : activeKey
                            ? "font-medium text-[var(--color-ink-500)] opacity-50"
                            : "font-bold text-[var(--color-ink-700)]"
                      }`}
                    >
                      {stat.profit > 0 ? (
                        <TrendingUp size={14} aria-hidden="true" className="shrink-0" />
                      ) : stat.profit < 0 ? (
                        <TrendingDown size={14} aria-hidden="true" className="shrink-0" />
                      ) : (
                        <Minus size={14} aria-hidden="true" className="shrink-0" />
                      )}
                      <span>
                        {stat.profit === 0
                          ? "—"
                          : `${stat.profit < 0 ? "−" : "+"}${formatKoreanWon(Math.abs(stat.profit))}`}
                      </span>
                    </div>
                    {/* 점 위치 라인 (좌 손실 ← 0 → 우 수익) */}
                    <div className="relative mt-1.5 h-2 w-full">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--color-ink-100)]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-[var(--color-ink-300)]"
                      />
                      <motion.span
                        aria-hidden="true"
                        className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                          isActive
                            ? "bg-[var(--color-ink-900)]"
                            : activeKey
                              ? "bg-[var(--color-ink-300)]"
                              : "bg-[var(--color-ink-700)]"
                        }`}
                        animate={{
                          left: inView ? `${50 + offset}%` : "50%",
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
            {/* Row 3 — 보유 기간 */}
            <tr className="border-t border-[var(--color-border)]">
              <th
                scope="row"
                className="py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]"
              >
                보유 기간
              </th>
              {visible.map((key) => {
                const stat = scenarios[key]!;
                const isActive = key === activeKey;
                const yearsCapped = Math.min(stat.holdingYears ?? 0, 5);
                return (
                  <td key={key} className={`px-2 py-3 align-top transition-colors ${isActive ? "bg-[var(--color-ink-100)]" : ""}`}>
                    <span
                      className={`text-sm tabular-nums ${
                        isActive
                          ? "font-black text-[var(--color-ink-900)]"
                          : activeKey
                            ? "font-medium text-[var(--color-ink-500)] opacity-50"
                            : "font-bold text-[var(--color-ink-700)]"
                      }`}
                    >
                      {stat.holdingYears != null ? `${stat.holdingYears}년` : "—"}
                    </span>
                    {/* 룰 21-C 시각 강조: 가로 timeline (1년~5년) — 5 dots */}
                    <div className="mt-1.5 flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          aria-hidden="true"
                          className={`h-1.5 flex-1 rounded-full ${
                            i < yearsCapped
                              ? isActive
                                ? "bg-[var(--color-ink-900)]"
                                : activeKey
                                  ? "bg-[var(--color-ink-300)]"
                                  : "bg-[var(--color-ink-700)]"
                              : "bg-[var(--color-ink-100)]"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
            {/* Row 4 — 리스크 */}
            <tr className="border-t border-[var(--color-border)]">
              <th
                scope="row"
                className="py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]"
              >
                리스크
              </th>
              {visible.map((key) => {
                const stat = scenarios[key]!;
                const isActive = key === activeKey;
                const riskLevel = resolveRiskNumeric(stat.riskLevel); // 1·2·3
                return (
                  <td key={key} className={`px-2 py-3 align-top transition-colors ${isActive ? "bg-[var(--color-ink-100)]" : ""}`}>
                    <span
                      className={`inline-flex items-center rounded-[var(--radius-xs)] px-2 py-0.5 text-[11px] font-bold ${resolveRiskClass(stat.riskLevel, isActive, !!activeKey)}`}
                    >
                      {resolveRiskLabel(stat.riskLevel)}
                    </span>
                    {/* 룰 21-C 시각 강조: dot indicator (낮음 1·중간 2·높음 3) */}
                    <div className="mt-1.5 flex items-center gap-1">
                      {Array.from({ length: 3 }, (_, i) => (
                        <span
                          key={i}
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 rounded-full ${
                            i < riskLevel
                              ? isActive
                                ? "bg-[var(--color-ink-900)]"
                                : activeKey
                                  ? "bg-[var(--color-ink-300)]"
                                  : "bg-[var(--color-ink-700)]"
                              : "bg-[var(--color-ink-100)]"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
            </tbody>
          </table>
        </div>
        {/* 룰 17-D — edge gradient + scroll cue (mobile only) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-white to-transparent md:hidden"
        />
        <p className="mt-1 text-right text-[length:var(--text-caption)] text-[var(--color-ink-500)] md:hidden">
          ← 가로 스크롤 →
        </p>
      </div>

      {/* 활성 시나리오 summary */}
      {activeKey && scenarios[activeKey] ? (
        <motion.p
          key={activeKey}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-4 rounded-[var(--radius-md)] border-l-4 border-[var(--color-ink-900)] bg-[var(--color-ink-50)] px-4 py-3 text-sm leading-6 text-[var(--color-ink-700)]"
        >
          <span className="font-bold text-[var(--color-ink-900)]">{activeKey}.</span>{" "}
          {scenarios[activeKey]!.summary || "시나리오 상세 요약 부재."}
        </motion.p>
      ) : null}

      {/* 낙찰가 슬라이더 (Show-and-Play 본질) */}
      <div className="mt-6 border-t border-[var(--color-border)] pt-5">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="bidding-slider"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-700)]"
          >
            낙찰가 시뮬레이션
          </label>
          <span className="text-xs font-black tabular-nums text-[var(--color-ink-900)]">
            {formatKoreanWon(userBidPrice)}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[11px] tabular-nums text-[var(--color-ink-500)]">
            최저가
          </span>
          <input
            id="bidding-slider"
            type="range"
            min={0}
            max={100}
            value={biddingPercent}
            onChange={(e) => setBiddingPercent(Number(e.target.value))}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={biddingPercent}
            aria-valuetext={`${formatKoreanWon(userBidPrice)} (최저가 + ${biddingPercent}%)`}
            className="flex-1 accent-[var(--color-ink-900)]"
          />
          <span className="text-[11px] tabular-nums text-[var(--color-ink-500)]">
            감정가
          </span>
        </div>
        <p className="mt-2 text-[11px] tabular-nums text-[var(--color-ink-500)]">
          drag 시 4 시나리오 자기자본·예상 수익 셀 실시간 재계산
        </p>
      </div>
    </div>
  );
}

function buildScenarioStat(
  raw: ScenarioFields | null,
  key: ScenarioKey,
  userBidPrice: number,
  baseMinPrice: number
): ScenarioStat | null {
  if (!raw) return null;
  const baseSelfCapital = asNumber(raw.self_capital_with_loan) ?? userBidPrice;
  const ratio = baseMinPrice > 0 ? userBidPrice / baseMinPrice : 1;
  const selfCapital = Math.round(baseSelfCapital * ratio);
  const baseProfit = asNumber(raw.after_tax_profit) ?? 0;
  const priceDiff = userBidPrice - baseMinPrice;
  const profit = baseProfit - priceDiff;
  const holdingYears = asNumber(raw.holding_period_years);
  const riskLevel = String(raw.risk_level ?? "mid");
  const label = String(raw.label ?? SCENARIO_DEFAULT_LABELS[key]);
  const summary = String(raw.summary ?? "");
  return {
    label,
    selfCapital,
    profit,
    holdingYears,
    riskLevel,
    summary,
  };
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return null;
}

function resolveRiskNumeric(level: string): number {
  switch (level) {
    case "low":
      return 1;
    case "high":
      return 3;
    case "mid":
    default:
      return 2;
  }
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

function resolveRiskClass(
  level: string,
  isActive: boolean,
  anyActive: boolean
): string {
  if (anyActive && !isActive) {
    return "bg-[var(--color-ink-100)] text-[var(--color-ink-500)] opacity-50";
  }
  switch (level) {
    case "low":
      return "bg-[var(--color-ink-100)] text-[var(--color-ink-700)]";
    case "high":
      return "bg-[var(--color-ink-900)] text-white";
    case "mid":
    default:
      return "bg-[var(--color-ink-300)] text-[var(--color-ink-900)]";
  }
}
