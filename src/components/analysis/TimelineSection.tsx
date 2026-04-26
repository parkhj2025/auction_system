import type { BiddingHistoryEntry } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

/**
 * 02 입찰 경과 — vertical timeline.
 *  - 유찰 → ink-300 (neutral)
 *  - 매각 → success
 *  - 미납 → warning
 *  - 진행 → brand-600 + "▶ 진행" chip (현재 회차)
 *  - 그 외 (변경 등) → ink-500 단색 표기
 *
 * voice_guide §5-4 사실 신호 어휘만 — "위험·매력·교훈·함정" 0건.
 * meta.bidding.history 누락 시 0 렌더 (mdx body 표가 fallback — 단계 3-1 baseline).
 */
export function TimelineSection({
  history,
}: {
  history: BiddingHistoryEntry[];
}) {
  if (!history || history.length === 0) return null;

  return (
    <div className="mt-6">
      <ol className="relative space-y-5 pl-6">
        {/* vertical line — 좌측 inset */}
        <span
          aria-hidden="true"
          className="absolute left-2 top-2 bottom-2 w-px bg-[var(--color-border)]"
        />
        {history.map((entry, idx) => {
          const tone = resolveTone(entry.result);
          const isLast = idx === history.length - 1;
          return (
            <li key={`${entry.round}-${idx}`} className="relative">
              {/* dot */}
              <span
                aria-hidden="true"
                className={`absolute -left-[18px] top-1.5 inline-flex h-3 w-3 items-center justify-center rounded-full ring-4 ring-white ${tone.dotCls}`}
              />
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-sm font-black tabular-nums text-[var(--color-ink-900)]">
                  {entry.round != null ? `${entry.round}차` : "—"}
                </span>
                <span className="text-sm tabular-nums text-[var(--color-ink-500)]">
                  {entry.date || "—"}
                </span>
                <span className="text-sm font-bold tabular-nums text-[var(--color-ink-900)]">
                  {entry.minimum != null ? formatKoreanWon(entry.minimum) : "—"}
                </span>
                {entry.rate != null ? (
                  <span className="text-xs tabular-nums text-[var(--color-ink-500)]">
                    {entry.rate}%
                  </span>
                ) : null}
                <span
                  className={`ml-auto inline-flex items-center rounded-[var(--radius-xs)] px-2 py-0.5 text-xs font-bold ${tone.chipCls}`}
                >
                  {isLast && tone.label === "진행" ? "▶ 진행" : tone.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function resolveTone(result: string): {
  label: string;
  dotCls: string;
  chipCls: string;
} {
  const r = (result ?? "").trim();
  if (r.includes("매각")) {
    return {
      label: "매각",
      dotCls: "bg-[var(--color-success)]",
      chipCls:
        "bg-[var(--color-success-soft)] text-[var(--color-success)]",
    };
  }
  if (r.includes("미납")) {
    return {
      label: "미납",
      dotCls: "bg-[var(--color-warning)]",
      chipCls:
        "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
    };
  }
  if (r.includes("진행") || r === "") {
    return {
      label: "진행",
      dotCls: "bg-[var(--color-brand-600)]",
      chipCls: "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]",
    };
  }
  if (r.includes("유찰")) {
    return {
      label: "유찰",
      dotCls: "bg-[var(--color-ink-300)]",
      chipCls:
        "bg-[var(--color-surface-muted)] text-[var(--color-ink-500)]",
    };
  }
  // 변경 등 기타
  return {
    label: r || "—",
    dotCls: "bg-[var(--color-ink-300)]",
    chipCls: "bg-[var(--color-surface-muted)] text-[var(--color-ink-500)]",
  };
}
