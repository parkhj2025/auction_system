"use client";

/**
 * 02 입찰 경과 — 단계 5-4-2 Side-by-Side Sticky + Graphic Sequence.
 *
 * 단계 5-4-2 변경:
 *  - 단계 3-3 정적 timeline 폐기 → SideBySideSticky 안에 BiddingTimeline 배치
 *  - 좌측 narrative step 별 우측 graphic active idx 변화 (Graphic Sequence)
 *  - 모바일 stack fallback (graphic top + steps 아래)
 *
 * case study 인용: scrollytelling Layout Pattern 1 + Graphic Sequence + chart-visualization line/funnel.
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

  const steps = history.map((entry, idx) => ({
    id: `bidding-step-${idx}`,
    body: (
      <div>
        <h3 className="text-base font-black text-[var(--color-ink-900)] sm:text-lg">
          {entry.round}차 매각
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">
          <span className="font-bold tabular-nums">{entry.date}</span>
          {entry.rate != null ? (
            <>
              {" · 감정가의 "}
              <span className="font-bold tabular-nums">{entry.rate}%</span>
              {" 진입선 "}
              <span className="font-bold tabular-nums">
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
  }));

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
