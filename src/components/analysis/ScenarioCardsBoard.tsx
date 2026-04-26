import type { InvestmentMeta, ScenarioFields } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

/**
 * 05 투자 수익 시뮬 — 시나리오 카드 4개 (A·B·C-1·C-2).
 *  - 색 분기 3 tone (사실 신호):
 *      양 (positive) → border-l-success / bg-success-soft/40
 *      중립 (neutral) → border-l-ink-500 / bg-surface-muted
 *      손실 (subtle warn) → border-l-warning / bg-warning-soft/40
 *  - 분류 키 = scenario fields 의 사실 수치만 (after_tax_profit / annual_yield / gap):
 *      A 실거주 — 양 (할인 폭 양수) baseline
 *      B 단기 매도 — after_tax_profit > 0 → 양, ≤0 → 손실
 *      C-1 갭투자 — gap 절대값으로 중립 baseline
 *      C-2 월세 — annual_yield ≥ 5 → 양, < 5 → 손실(부분), 그 외 중립
 *
 * voice_guide §5-4 — "추천·위험·매력·교훈·함정" 어휘 0.
 * 카드 텍스트 = 사실 라벨 + 수치만.
 *
 * mdx body 의 표는 ScenarioCard remark plugin (단계 3-1) 으로 별도 wrap 됨.
 * 본 컴포넌트는 4-cell 카드 형태로 한눈에 비교용 — Section 05 헤더 직후 노출.
 */
export function ScenarioCardsBoard({ inv }: { inv: InvestmentMeta }) {
  const cards: Array<{
    key: string;
    name: string;
    sub: string;
    tone: ToneKey;
    rows: Array<{ label: string; value: string }>;
  } | null> = [
    inv.scenario_a ? buildScenarioA(inv.scenario_a) : null,
    inv.scenario_b ? buildScenarioB(inv.scenario_b) : null,
    inv.scenario_c1 ? buildScenarioC1(inv.scenario_c1) : null,
    inv.scenario_c2 ? buildScenarioC2(inv.scenario_c2) : null,
  ];

  const visible = cards.filter(Boolean) as Array<{
    key: string;
    name: string;
    sub: string;
    tone: ToneKey;
    rows: Array<{ label: string; value: string }>;
  }>;

  if (visible.length === 0) return null;

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {visible.map((c) => {
        const tone = TONE_MAP[c.tone];
        return (
          <div
            key={c.key}
            className={`rounded-[var(--radius-md)] border border-l-4 border-[var(--color-border)] p-4 sm:p-5 ${tone.cardCls}`}
          >
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.18em] ${tone.labelCls}`}
            >
              시나리오 {c.key}
            </p>
            <p className="mt-1 text-base font-black tracking-tight text-[var(--color-ink-900)] sm:text-lg">
              {c.name}
            </p>
            {c.sub ? (
              <p className="mt-1 text-xs leading-5 text-[var(--color-ink-500)]">
                {c.sub}
              </p>
            ) : null}
            <dl className="mt-3 space-y-1.5">
              {c.rows.map((r, i) => (
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
          </div>
        );
      })}
    </div>
  );
}

type ToneKey = "positive" | "neutral" | "warn";

const TONE_MAP: Record<
  ToneKey,
  { cardCls: string; labelCls: string }
> = {
  positive: {
    cardCls: "border-l-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success-soft)_60%,white)]",
    labelCls: "text-[var(--color-success)]",
  },
  neutral: {
    cardCls: "border-l-[var(--color-ink-500)] bg-[var(--color-surface-muted)]",
    labelCls: "text-[var(--color-ink-500)]",
  },
  warn: {
    cardCls: "border-l-[var(--color-warning)] bg-[color-mix(in_srgb,var(--color-warning-soft)_60%,white)]",
    labelCls: "text-[var(--color-warning)]",
  },
};

function asMaybeNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return null;
}

function buildScenarioA(s: ScenarioFields) {
  const discount = asMaybeNumber(s.discount_from_appraisal);
  const selfCapital = asMaybeNumber(s.self_capital_with_loan);
  const tone: ToneKey = discount != null && discount > 0 ? "positive" : "neutral";
  return {
    key: "A",
    name: String(s.label ?? "실거주 매입"),
    sub: "감정가 대비 할인 입주",
    tone,
    rows: [
      ...(discount != null
        ? [{ label: "감정가 대비 할인", value: formatKoreanWon(discount) }]
        : []),
      ...(selfCapital != null
        ? [{ label: "자기자본 (대출 시)", value: formatKoreanWon(selfCapital) }]
        : []),
    ],
  };
}

function buildScenarioB(s: ScenarioFields) {
  const expected = asMaybeNumber(s.expected_sale_price);
  const profit = asMaybeNumber(s.after_tax_profit);
  let tone: ToneKey = "neutral";
  if (profit != null) tone = profit > 0 ? "positive" : "warn";
  return {
    key: "B",
    name: String(s.label ?? "1년 미만 매도"),
    sub: "단기 회전 (양도세 77%)",
    tone,
    rows: [
      ...(expected != null
        ? [{ label: "예상 매도가", value: formatKoreanWon(expected) }]
        : []),
      ...(profit != null
        ? [
            {
              label: "세후 순수익",
              value:
                (profit < 0 ? "−" : "") + formatKoreanWon(Math.abs(profit)),
            },
          ]
        : []),
    ],
  };
}

function buildScenarioC1(s: ScenarioFields) {
  const lease = asMaybeNumber(s.expected_lease_deposit);
  const gap = asMaybeNumber(s.gap);
  // 갭이 양수=실투자금 발생 / 음수=전세금이 실질취득비 초과 — baseline 중립 표시
  const tone: ToneKey = "neutral";
  return {
    key: "C-1",
    name: String(s.label ?? "전세 갭투자"),
    sub: "장기 보유",
    tone,
    rows: [
      ...(lease != null
        ? [{ label: "예상 전세 보증금", value: formatKoreanWon(lease) }]
        : []),
      ...(gap != null
        ? [
            {
              label: "갭 (실투자금)",
              value:
                (gap < 0 ? "−" : "") + formatKoreanWon(Math.abs(gap)),
            },
          ]
        : []),
    ],
  };
}

function buildScenarioC2(s: ScenarioFields) {
  const monthly = asMaybeNumber(s.monthly_rent);
  const yearly = asMaybeNumber(s.annual_yield);
  const payback = asMaybeNumber(s.payback_years);
  let tone: ToneKey = "neutral";
  if (yearly != null) tone = yearly >= 5 ? "positive" : "warn";
  return {
    key: "C-2",
    name: String(s.label ?? "월세 운용"),
    sub: "현금 유동성",
    tone,
    rows: [
      ...(monthly != null
        ? [{ label: "예상 월세", value: formatKoreanWon(monthly) }]
        : []),
      ...(yearly != null
        ? [{ label: "연 수익률", value: `${yearly.toFixed(1)}%` }]
        : []),
      ...(payback != null
        ? [
            {
              label: "자본 회수 기간",
              value: `약 ${Math.round(payback)}년`,
            },
          ]
        : []),
    ],
  };
}
