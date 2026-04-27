"use client";

/**
 * 02 입찰 경과 — 단계 5-4-2-fix Phase 2: Side-by-Side Sticky + 시각 위계.
 *
 * 시각 위계 (형준님 본질 통찰):
 *  - 진행 회차 STEP → strong (text-ink-900 + 굵기 강조)
 *  - 과거 회차 (매각·유찰·미납) STEP → weak (text-ink-500 + opacity 0.6)
 *  - 좌측 narrative step 별 우측 graphic active idx 변화 (Graphic Sequence)
 *  - 모바일 stack fallback (graphic top + steps 아래)
 */
import type { BiddingHistoryEntry } from "@/types/content";
import { SideBySideSticky } from "./SideBySideSticky";
import { BiddingTimeline } from "./BiddingTimeline";
import { formatKoreanWon } from "@/lib/utils";

export function TimelineSection({
  history,
}: {
  history: BiddingHistoryEntry[];
}) {
  if (!history || history.length === 0) return null;

  const steps = history.map((entry, idx) => {
    const isCurrent = isCurrentEntry(entry);

    return {
      id: `bidding-step-${idx}`,
      body: (
        <div className={isCurrent ? "" : "opacity-60"}>
          <div className="flex items-baseline gap-2">
            <h3
              className={`tabular-nums sm:text-lg ${
                isCurrent
                  ? "text-base font-black text-[var(--color-ink-900)]"
                  : "text-base font-bold text-[var(--color-ink-500)]"
              }`}
            >
              {entry.round}차 {isCurrent ? "진행" : resolveResultLabel(entry.result)}
            </h3>
            {isCurrent ? (
              <span className="rounded-[var(--radius-xs)] bg-[var(--color-ink-900)] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                현재
              </span>
            ) : null}
          </div>
          <p
            className={`mt-2 text-sm leading-6 ${
              isCurrent
                ? "text-[var(--color-ink-700)]"
                : "text-[var(--color-ink-500)]"
            }`}
          >
            <span
              className={`tabular-nums ${
                isCurrent ? "font-bold" : "font-medium"
              }`}
            >
              {entry.date}
            </span>
            {entry.rate != null ? (
              <>
                {" · 감정가의 "}
                <span
                  className={`tabular-nums ${
                    isCurrent ? "font-bold" : "font-medium"
                  }`}
                >
                  {entry.rate}%
                </span>
                {" 진입선 "}
                <span
                  className={`tabular-nums ${
                    isCurrent ? "font-bold" : "font-medium"
                  }`}
                >
                  {entry.minimum != null
                    ? formatKoreanWon(entry.minimum)
                    : "—"}
                </span>
              </>
            ) : null}
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
            {resolveStepNarrative(entry, idx, history)}
          </p>
        </div>
      ),
    };
  });

  return (
    <SideBySideSticky
      steps={steps}
      graphic={(activeIdx) => (
        <BiddingTimeline history={history} activeIdx={activeIdx} />
      )}
      mobileGraphicPosition="top"
    />
  );
}

function isCurrentEntry(entry: BiddingHistoryEntry): boolean {
  const r = (entry.result ?? "").trim();
  return r === "" || r.includes("진행");
}

function resolveResultLabel(result: string): string {
  const r = (result ?? "").trim();
  if (r.includes("매각")) return "매각";
  if (r.includes("미납")) return "미납";
  if (r.includes("유찰")) return "유찰";
  return r || "—";
}

function resolveStepNarrative(
  entry: BiddingHistoryEntry,
  idx: number,
  history: BiddingHistoryEntry[]
): string {
  const result = (entry.result ?? "").trim();
  if (result.includes("유찰")) {
    return "응찰자 부재로 유찰. 다음 회차에서 30% 저감 후 재진행.";
  }
  if (result.includes("매각")) {
    return "낙찰자 결정. 잔금 납부·소유권 이전 절차 진입.";
  }
  if (result.includes("미납")) {
    return "낙찰자 잔금 미납. 다음 회차에서 재매각.";
  }
  if (result.includes("진행") || result === "") {
    if (idx > 0 && history[idx - 1]) {
      const prevRate = history[idx - 1].rate;
      const currRate = entry.rate;
      if (prevRate != null && currRate != null) {
        return `이전 회차 대비 ${prevRate - currRate}%p 인하된 가격. 응찰 시점.`;
      }
    }
    return "현재 진행 예정 회차. 응찰 시점.";
  }
  return result || "회차 정보";
}
