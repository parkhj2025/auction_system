"use client";

/**
 * 단계 5-4-2: 05 시나리오 비교 — 단일 박스 인터랙티브 toggle (본질 핵심).
 *
 * 시각 구조:
 *  - Tab nav (4 시나리오, 단계 5-2 무채색 + 번호 보존)
 *  - Active scenario detail (4 차원 stat: 자기자본·예상 수익·기간·리스크)
 *  - Bottom mini comparison chart (4 막대 자기자본 + 4 점 수익)
 *  - 낙찰가 슬라이더 (1.246억 ~ 1.78억) drag → 4 시나리오 실시간 재계산
 *
 * 인터랙션 (Animated Transition + Show-and-Play):
 *  - tab click → active detail crossfade
 *  - 슬라이더 drag → mini chart 막대 width animate + 점 위치 update + detail 재계산
 *
 * 모노톤: ink + ink-900 단일 강조. active = ink-900 underline / fill solid.
 * case study 인용: scrollytelling Animated Transition + Show-and-Play / chart-visualization radar+bar / Distill "Parameter sliders update plots in real-time".
 */
import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef, useState, useMemo } from "react";
import { Home, TrendingUp, Users, RefreshCw } from "lucide-react";
import type { InvestmentMeta, ScenarioFields } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

interface ScenarioComparisonBoxProps {
  investment: InvestmentMeta;
  appraisal: number;
  minPrice: number;
}

const SCENARIO_KEYS = ["A", "B", "C-1", "C-2"] as const;
type ScenarioKey = (typeof SCENARIO_KEYS)[number];

const SCENARIO_ICONS: Record<ScenarioKey, typeof Home> = {
  A: Home,
  B: TrendingUp,
  "C-1": Users,
  "C-2": RefreshCw,
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
}: ScenarioComparisonBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [activeKey, setActiveKey] = useState<ScenarioKey>("A");
  // 사용자 슬라이더 가격 (낙찰가) — 0~100 → minPrice ~ appraisal
  const [biddingPercent, setBiddingPercent] = useState<number>(0);
  const userBidPrice = Math.round(minPrice + (biddingPercent / 100) * (appraisal - minPrice));

  // 시나리오 4건 → ScenarioStat 배열 (실시간 재계산)
  const scenarios: Record<ScenarioKey, ScenarioStat | null> = useMemo(() => {
    return {
      A: buildScenarioStat(investment.scenario_a, "A 실거주 매입", userBidPrice, minPrice),
      B: buildScenarioStat(investment.scenario_b, "B 1년 이내 매도", userBidPrice, minPrice),
      "C-1": buildScenarioStat(investment.scenario_c1, "C-1 전세 갭투자", userBidPrice, minPrice),
      "C-2": buildScenarioStat(investment.scenario_c2, "C-2 월세 운용", userBidPrice, minPrice),
    };
  }, [investment, userBidPrice, minPrice]);

  const visible = SCENARIO_KEYS.filter((k) => scenarios[k] !== null);
  if (visible.length === 0) return null;

  const activeStat = scenarios[activeKey];

  const maxCapital = Math.max(
    ...Object.values(scenarios)
      .filter((s): s is ScenarioStat => s !== null)
      .map((s) => Math.abs(s.selfCapital))
  );
  const maxProfit = Math.max(
    ...Object.values(scenarios)
      .filter((s): s is ScenarioStat => s !== null)
      .map((s) => Math.abs(s.profit)),
    1
  );

  return (
    <div
      ref={ref}
      className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
    >
      {/* Tab nav (단계 5-2 무채색 + 번호 보존) */}
      <div role="tablist" aria-label="시나리오 4종 선택" className="flex flex-wrap gap-1 border-b border-[var(--color-border)]">
        {visible.map((key) => {
          const Icon = SCENARIO_ICONS[key];
          const isActive = key === activeKey;
          const stat = scenarios[key];
          return (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`scenario-panel-${key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveKey(key)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  const idx = visible.indexOf(activeKey);
                  setActiveKey(visible[(idx + 1) % visible.length]);
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  const idx = visible.indexOf(activeKey);
                  setActiveKey(visible[(idx - 1 + visible.length) % visible.length]);
                }
              }}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors ${
                isActive
                  ? "text-[var(--color-ink-900)]"
                  : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]"
              }`}
            >
              <span className="text-base font-black tabular-nums">{key}</span>
              <Icon size={14} aria-hidden="true" />
              <span className="hidden sm:inline">{stat?.label.replace(/^[A-Z](-\d+)?\s/, "") ?? ""}</span>
              {isActive ? (
                <motion.span
                  layoutId="scenario-tab-underline"
                  className="absolute -bottom-px left-0 right-0 h-0.5 bg-[var(--color-ink-900)]"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Active detail — crossfade Animated Transition */}
      <AnimatePresence mode="wait">
        {activeStat ? (
          <motion.div
            key={activeKey}
            id={`scenario-panel-${activeKey}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-6"
          >
            <h3 className="text-base font-black text-[var(--color-ink-900)] sm:text-lg">
              {activeStat.label}
            </h3>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
              <DetailStat label="자기자본" value={formatKoreanWon(activeStat.selfCapital)} />
              <DetailStat
                label="예상 수익"
                value={
                  activeStat.profit === 0
                    ? "—"
                    : `${activeStat.profit < 0 ? "−" : "+"}${formatKoreanWon(Math.abs(activeStat.profit))}`
                }
              />
              <DetailStat
                label="보유 기간"
                value={activeStat.holdingYears != null ? `${activeStat.holdingYears}년` : "—"}
              />
              <DetailStat label="리스크" value={resolveRiskLabel(activeStat.riskLevel)} />
            </dl>
            <p className="mt-4 text-sm leading-6 text-[var(--color-ink-700)]">{activeStat.summary}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Mini comparison chart — 4 막대 + 4 점 */}
      <div className="mt-8 border-t border-[var(--color-border)] pt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
          4 시나리오 비교
        </p>
        <div className="mt-3 space-y-3">
          {visible.map((key) => {
            const stat = scenarios[key]!;
            const isActive = key === activeKey;
            const capitalWidth = (Math.abs(stat.selfCapital) / maxCapital) * 100;
            const profitOffset = (stat.profit / maxProfit) * 50; // -50% ~ +50% 위치
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveKey(key)}
                className="block w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-10 shrink-0 text-xs font-black tabular-nums ${
                      isActive ? "text-[var(--color-ink-900)]" : "text-[var(--color-ink-500)]"
                    }`}
                  >
                    {key}
                  </span>
                  <div className="relative flex-1">
                    {/* 자기자본 막대 */}
                    <div className="h-3 rounded-full bg-[var(--color-ink-100)]">
                      <motion.div
                        className={`h-3 rounded-full ${
                          isActive
                            ? "bg-[var(--color-ink-900)]"
                            : "bg-[var(--color-ink-300)]"
                        }`}
                        animate={{
                          width: inView ? `${capitalWidth}%` : "0%",
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    {/* 수익 점 (막대 위 absolute, profit 부호에 따라 ink-900 또는 ink-300) */}
                    <motion.span
                      className={`absolute -top-1.5 h-6 w-1 -translate-x-1/2 rounded-full ${
                        stat.profit > 0
                          ? "bg-[var(--color-ink-900)]"
                          : stat.profit < 0
                            ? "bg-[var(--color-ink-700)]"
                            : "bg-[var(--color-ink-300)]"
                      }`}
                      animate={{
                        left: inView ? `${50 + profitOffset}%` : "50%",
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right text-xs font-bold tabular-nums text-[var(--color-ink-700)]">
                    {stat.profit === 0
                      ? "—"
                      : `${stat.profit < 0 ? "−" : "+"}${(Math.abs(stat.profit) / 10000).toFixed(0)}만`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[10px] tabular-nums text-[var(--color-ink-500)]">
          좌: 자기자본 막대 / 우: 예상 수익 점 (← 손실 / 우 → 수익)
        </p>
      </div>

      {/* 낙찰가 슬라이더 (Show-and-Play 본질) */}
      <div className="mt-8 border-t border-[var(--color-border)] pt-6">
        <label
          htmlFor="bidding-slider"
          className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-700)]"
        >
          낙찰가 시뮬레이션 — 슬라이더 drag 시 4 시나리오 실시간 재계산
        </label>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-xs tabular-nums text-[var(--color-ink-500)]">
            {formatKoreanWon(minPrice)}
          </span>
          <input
            id="bidding-slider"
            type="range"
            min={0}
            max={100}
            value={biddingPercent}
            onChange={(e) => setBiddingPercent(Number(e.target.value))}
            aria-label="낙찰가 슬라이더"
            aria-valuenow={biddingPercent}
            aria-valuetext={`${formatKoreanWon(userBidPrice)} (최저가 + ${biddingPercent}%)`}
            className="flex-1 accent-[var(--color-ink-900)]"
          />
          <span className="text-xs tabular-nums text-[var(--color-ink-500)]">
            {formatKoreanWon(appraisal)}
          </span>
        </div>
        <p className="mt-3 text-center text-sm font-bold tabular-nums text-[var(--color-ink-900)]">
          입찰가{" "}
          <span className="text-[var(--color-ink-900)]">
            {formatKoreanWon(userBidPrice)}
          </span>{" "}
          기준
        </p>
      </div>
    </div>
  );
}

function buildScenarioStat(
  raw: ScenarioFields | null,
  defaultLabel: string,
  userBidPrice: number,
  baseMinPrice: number
): ScenarioStat | null {
  if (!raw) return null;
  const baseSelfCapital = asNumber(raw.self_capital_with_loan) ?? userBidPrice;
  // 사용자 입찰가가 baseMinPrice 와 다르면 자기자본도 비례 조정
  const ratio = userBidPrice / baseMinPrice;
  const selfCapital = Math.round(baseSelfCapital * ratio);
  const baseProfit = asNumber(raw.after_tax_profit) ?? 0;
  // 사용자 입찰가 상승분만큼 수익 차감 (낙찰가 ↑ = 수익 ↓ 단순 모델)
  const priceDiff = userBidPrice - baseMinPrice;
  const profit = baseProfit - priceDiff;
  const holdingYears = asNumber(raw.holding_period_years);
  const riskLevel = String(raw.risk_level ?? "mid");
  const label = String(raw.label ?? defaultLabel);
  const summary = String(raw.summary ?? "");
  return {
    label: defaultLabel.split(" ")[0] + " " + label,
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

function DetailStat({ label, value }: { label: string; value: string }) {
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
