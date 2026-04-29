"use client";

/**
 * 04 시세 비교 — 단계 5-4-2 callout + PriceScatter (Show-and-Play) + 3 카드 grid 보존.
 *
 * 단계 5-4-2 변경:
 *  - PriceScatter 신규 통합 (1D scatter + 사용자 가격 입력)
 *  - 모바일은 carousel 보다 input 만 활용 (PriceScatter 안 sm: hidden 처리)
 *  - callout + 3 카드 grid 보존 (정보 손실 0)
 *
 * voice_guide §5-4 — "저평가·고평가·할인 추천" 판정 어휘 0.
 */
import type { MarketMeta, BiddingHistoryEntry } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { PriceScatter } from "./PriceScatter";

export function MarketCompareCard({
  market,
  appraisal,
  minPrice,
  round,
  percent,
  bidding,
}: {
  market: MarketMeta;
  appraisal: number;
  minPrice: number;
  round: number;
  percent: number;
  bidding?: { history: BiddingHistoryEntry[] };
}) {
  const saleAvg = market.sale_avg;
  const saleCount = market.sale_count;
  if (saleAvg == null || saleAvg <= 0) return null;

  const avgVsAppraisalRatio = (saleAvg / appraisal) * 100;
  const minVsAvgRatio = (minPrice / saleAvg) * 100;

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-[var(--radius-md)] border-l-4 border-[var(--color-ink-900)] bg-[var(--color-ink-50)] px-4 py-3 text-sm leading-6 text-[var(--color-ink-700)]">
        시세 평균 대비 {round}차 최저가는{" "}
        <span className="font-bold tabular-nums text-[var(--color-ink-900)]">
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

      <PriceScatter
        appraisal={appraisal}
        market={market}
        minPrice={minPrice}
        round={round}
        history={bidding?.history ?? []}
      />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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
        accent ? "bg-[var(--color-ink-50)]" : "bg-white"
      }`}
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
          accent ? "text-[var(--color-ink-900)]" : "text-[var(--color-ink-500)]"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1.5 text-xl font-black tabular-nums leading-tight sm:text-h3 ${
          accent ? "text-[var(--color-ink-900)]" : "text-[var(--color-ink-900)]"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 text-[11px] tabular-nums ${
          accent ? "text-[var(--color-ink-900)]" : "text-[var(--color-ink-500)]"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}
