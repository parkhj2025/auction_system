/**
 * 06 매각사례 — 4-cell grid (1·3·6·12개월).
 *
 * 단계 3-3 — 컴포넌트 골격만 준비.
 * Cowork 측 meta.json.sections.sale_history[] 추가(v2.7) 후 활성.
 * 본 단계는 props 누락 시 0 렌더 → mdx body 표 fallback.
 */
export interface SaleHistoryEntry {
  period: string; // "1개월" | "3개월" | ...
  count: number;
  avg_appraisal?: number;
  avg_sale: number;
  rate: number; // 매각가율 %
  avg_bidders?: number;
  expected?: number;
}

export function AuctionStatsGrid({
  history,
}: {
  history?: SaleHistoryEntry[];
}) {
  // v2.7 Cowork schema 추가 후 활성. 본 단계 baseline 에서는 항상 null → mdx fallback.
  if (!history || history.length === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {history.map((entry, i) => (
        <div
          key={i}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            {entry.period}
          </p>
          <p className="mt-1 text-xs tabular-nums text-[var(--color-ink-500)]">
            {entry.count}건
          </p>
          <p className="mt-2 text-2xl font-black tabular-nums leading-tight text-[var(--color-ink-900)]">
            {entry.rate.toFixed(2)}%
          </p>
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-ink-500)]">
            매각가율
          </p>
        </div>
      ))}
    </div>
  );
}
