"use client";

import { useState } from "react";
import { Home, TrendingUp, Users, RefreshCw } from "lucide-react";
import type { InvestmentMeta, ScenarioFields } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { Modal } from "./Modal";

/**
 * 05 투자 수익 시뮬 — 시나리오 카드 4개 (A·B·C-1·C-2).
 *  - 카드 압축 표시: 한 줄 요약 + 핵심 1~2 지표
 *  - 카드 클릭 → 모달: 해당 시나리오 전체 표 (meta.investment 기반)
 *  - 단계 4-1: 시나리오 종류별 고정 색상·아이콘 (정합성 검증 결과 기반 tone 폐기)
 *  - voice_guide §5-4 — "추천·위험·매력·교훈·함정" 어휘 0
 *
 * 산문 본문은 mdx body 의 ScenarioCard wrap (단계 3-1) 에서 별도 노출 — 본 컴포넌트 모달은 표 + 한 줄 요약만.
 */
export function ScenarioCardsBoard({ inv }: { inv: InvestmentMeta }) {
  const cards: Array<ScenarioCard | null> = [
    inv.scenario_a ? buildScenarioA(inv.scenario_a) : null,
    inv.scenario_b ? buildScenarioB(inv.scenario_b) : null,
    inv.scenario_c1 ? buildScenarioC1(inv.scenario_c1) : null,
    inv.scenario_c2 ? buildScenarioC2(inv.scenario_c2) : null,
  ];

  const visible = cards.filter((c): c is ScenarioCard => c !== null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const opened = visible.find((c) => c.key === openKey) ?? null;

  if (visible.length === 0) return null;

  return (
    <>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {visible.map((c) => {
          const theme = SCENARIO_THEME[c.key] ?? SCENARIO_THEME.A;
          const Icon = theme.icon;
          return (
            <button
              type="button"
              key={c.key}
              onClick={() => setOpenKey(c.key)}
              aria-label={`시나리오 ${c.key} ${c.name} 전체 표 보기`}
              className={`group rounded-[var(--radius-md)] border border-l-4 border-[var(--color-border)] p-4 text-left transition duration-150 ease-out hover:shadow-[var(--shadow-card)] sm:p-5 ${theme.cardCls}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-white ${theme.iconCls}`}
                  aria-hidden="true"
                >
                  <Icon size={16} />
                </span>
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] ${theme.labelCls}`}
                >
                  시나리오 {c.key}
                </p>
              </div>
              <p className="mt-2 text-base font-black tracking-tight text-[var(--color-ink-900)] sm:text-lg">
                {c.name}
              </p>
              {c.headline ? (
                <p className="mt-1 text-xs leading-5 text-[var(--color-ink-500)]">
                  {c.headline}
                </p>
              ) : null}
              <dl className="mt-3 space-y-1.5">
                {c.rows.slice(0, 2).map((r, i) => (
                  <div
                    key={i}
                    className="flex items-baseline justify-between gap-3 text-sm"
                  >
                    <dt className="text-[var(--color-ink-500)]">{r.label}</dt>
                    <dd className="font-bold tabular-nums text-[var(--color-ink-900)]">
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[11px] font-bold text-[var(--color-brand-600)] group-hover:text-[var(--color-brand-700)]">
                전체 표 보기 →
              </p>
            </button>
          );
        })}
      </div>

      <Modal
        open={openKey !== null}
        onClose={() => setOpenKey(null)}
        title={opened ? `시나리오 ${opened.key} — ${opened.name}` : ""}
        ariaLabel={opened ? `시나리오 ${opened.key} 전체 표` : "시나리오 모달"}
        size="md"
      >
        {opened ? (
          <div>
            {opened.headline ? (
              <p className="text-sm leading-6 text-[var(--color-ink-700)]">
                {opened.headline}
              </p>
            ) : null}
            <dl className="mt-4 divide-y divide-[var(--color-border)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
              {opened.rows.map((r, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between gap-3 px-4 py-3 text-sm"
                >
                  <dt className="text-[var(--color-ink-500)]">{r.label}</dt>
                  <dd className="font-bold tabular-nums text-[var(--color-ink-900)]">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[11px] text-[var(--color-ink-500)]">
              산문 본문은 페이지 하단 시나리오 섹션에서 자세히 확인하실 수 있습니다.
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

interface ScenarioCard {
  key: string;
  name: string;
  headline: string;
  rows: Array<{ label: string; value: string }>;
}

/** 단계 4-1: 시나리오 종류별 고정 색상·아이콘 매핑 (ScenarioCard·mdx-components 공통) */
const SCENARIO_THEME: Record<
  string,
  {
    icon: typeof Home;
    cardCls: string;
    labelCls: string;
    iconCls: string;
  }
> = {
  A: {
    icon: Home,
    cardCls: "border-l-blue-500 bg-blue-50/40",
    labelCls: "text-blue-700",
    iconCls: "text-blue-600",
  },
  B: {
    icon: TrendingUp,
    cardCls: "border-l-orange-500 bg-orange-50/40",
    labelCls: "text-orange-700",
    iconCls: "text-orange-600",
  },
  "C-1": {
    icon: Users,
    cardCls: "border-l-purple-500 bg-purple-50/40",
    labelCls: "text-purple-700",
    iconCls: "text-purple-600",
  },
  "C-2": {
    icon: RefreshCw,
    cardCls: "border-l-green-500 bg-green-50/40",
    labelCls: "text-green-700",
    iconCls: "text-green-600",
  },
};

function asMaybeNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return null;
}

function buildScenarioA(s: ScenarioFields): ScenarioCard {
  const discount = asMaybeNumber(s.discount_from_appraisal);
  const selfCapital = asMaybeNumber(s.self_capital_with_loan);
  const rows: ScenarioCard["rows"] = [];
  if (discount != null) {
    rows.push({
      label: "감정가 대비 할인",
      value: formatKoreanWon(discount),
    });
  }
  if (selfCapital != null) {
    rows.push({
      label: "자기자본 (대출 시)",
      value: formatKoreanWon(selfCapital),
    });
  }
  return {
    key: "A",
    name: String(s.label ?? "실거주 매입"),
    headline: "감정가 대비 할인 입주",
    rows,
  };
}

function buildScenarioB(s: ScenarioFields): ScenarioCard {
  const expected = asMaybeNumber(s.expected_sale_price);
  const profit = asMaybeNumber(s.after_tax_profit);
  const rows: ScenarioCard["rows"] = [];
  if (expected != null) {
    rows.push({ label: "예상 매도가", value: formatKoreanWon(expected) });
  }
  if (profit != null) {
    rows.push({
      label: "세후 순수익",
      value: (profit < 0 ? "−" : "") + formatKoreanWon(Math.abs(profit)),
    });
  }
  return {
    key: "B",
    name: String(s.label ?? "1년 미만 매도"),
    headline: "단기 회전 (양도세 77%)",
    rows,
  };
}

function buildScenarioC1(s: ScenarioFields): ScenarioCard {
  const lease = asMaybeNumber(s.expected_lease_deposit);
  const gap = asMaybeNumber(s.gap);
  const rows: ScenarioCard["rows"] = [];
  if (lease != null) {
    rows.push({ label: "예상 전세 보증금", value: formatKoreanWon(lease) });
  }
  if (gap != null) {
    rows.push({
      label: "갭 (실투자금)",
      value: (gap < 0 ? "−" : "") + formatKoreanWon(Math.abs(gap)),
    });
  }
  return {
    key: "C-1",
    name: String(s.label ?? "전세 갭투자"),
    headline: "장기 보유",
    rows,
  };
}

function buildScenarioC2(s: ScenarioFields): ScenarioCard {
  const monthly = asMaybeNumber(s.monthly_rent);
  const yearly = asMaybeNumber(s.annual_yield);
  const payback = asMaybeNumber(s.payback_years);
  const rows: ScenarioCard["rows"] = [];
  if (monthly != null) {
    rows.push({ label: "예상 월세", value: formatKoreanWon(monthly) });
  }
  if (yearly != null) {
    rows.push({ label: "연 수익률", value: `${yearly.toFixed(1)}%` });
  }
  if (payback != null) {
    rows.push({
      label: "자본 회수 기간",
      value: `약 ${Math.round(payback)}년`,
    });
  }
  return {
    key: "C-2",
    name: String(s.label ?? "월세 운용"),
    headline: "현금 유동성",
    rows,
  };
}
