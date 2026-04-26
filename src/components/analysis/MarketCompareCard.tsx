import type { MarketMeta } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

/**
 * 04 시세 비교 — 3 카드 grid.
 *  - 감정가 / 시세 평균 (강조 brand-50) / 회차 최저가
 *  - 한 줄 결론 callout 위쪽 노출 (사실 신호 — 비교 결과 수치만)
 *
 * voice_guide §5-4 — "저평가·고평가·할인 추천" 판정 어휘 0.
 * 비교 결론 = 사실 비율 표기만.
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
