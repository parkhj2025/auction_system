"use client";

import type { BiddingHistoryEntry } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

/**
 * 02 입찰 경과 — vertical timeline (단계 5-4-1: scroll-triggered + 무채색 정합).
 *
 * 단계 5-4-1 변경:
 *  - "use client" — useInView (IntersectionObserver) 사용
 *  - 스크롤 진입 시 stagger fade-in + slide-in-left (li 별 100ms 간격)
 *  - vertical line scaleY 0→1 (line draw, origin-top, duration-slow ease-out)
 *  - dot 크기 = 매각가율 (%) 매핑 (100% → 16px / 70% → 14px / 49% → 12px, 선형)
 *  - 색상 무채색 정합:
 *    · 유찰 → ink-300
 *    · 매각 → ink-900 (검정)
 *    · 미납 → ink-700 + outline ring
 *    · 진행 → brand-600 (단일 액센트, 단계 5-2 무채색 + brand-600 정책 정합)
 *    · 변경 등 → ink-500
 *  - prefers-reduced-motion: globals.css 글로벌 룰이 transition 0 강제 → 즉시 최종 상태
 *
 * meta.bidding.history 누락 시 0 렌더 (mdx body 표가 fallback — 단계 3-1 baseline).
 */
export function TimelineSection({
  history,
}: {
  history: BiddingHistoryEntry[];
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  if (!history || history.length === 0) return null;

  return (
    <div ref={ref} className="mt-6" data-in-view={inView ? "true" : "false"}>
      <ol className="relative space-y-5 pl-6">
        {/* vertical line — scroll reveal (scaleY 0→1, origin-top) */}
        <span
          aria-hidden="true"
          className="absolute left-2 top-2 bottom-2 w-px origin-top bg-[var(--color-border)] transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]"
          style={{ transform: inView ? "scaleY(1)" : "scaleY(0)" }}
        />
        {history.map((entry, idx) => {
          const tone = resolveTone(entry.result);
          const isLast = idx === history.length - 1;
          const dotSize = computeDotSize(entry.rate);
          // stagger delay: 각 li 별 100ms 간격, vertical line draw 가 끝나는 시점에 가까이 정렬
          const delay = 200 + idx * 120;
          return (
            <li
              key={`${entry.round}-${idx}`}
              className="relative transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(-8px)",
                transitionDelay: `${delay}ms`,
              }}
            >
              {/* dot — 크기는 매각가율 매핑, 색상은 result tone */}
              <span
                aria-hidden="true"
                className={`absolute top-1.5 inline-flex items-center justify-center rounded-full ring-4 ring-white ${tone.dotCls}`}
                style={{
                  left: `-${Math.round(dotSize / 2 + 6)}px`,
                  width: `${dotSize}px`,
                  height: `${dotSize}px`,
                  transform: inView ? "scale(1)" : "scale(0)",
                  transition: `transform var(--duration-base) var(--ease-out) ${delay + 100}ms`,
                }}
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

/** dot 크기 = 매각가율 (%) 선형 매핑.
 *  100% → 16px / 70% → 13.6px → round 14px / 49% → 11.92 → round 12px.
 *  rate 가 없으면 default 12px. */
function computeDotSize(rate: number | null | undefined): number {
  if (rate == null || !Number.isFinite(rate)) return 12;
  const size = Math.round(rate * 0.08 + 8);
  return Math.max(8, Math.min(20, size));
}

/** result → 무채색 + brand-600 정합 (단계 5-4-1).
 *  단계 5-2 의 "무채색 강제 + brand-600 단일 액센트" 정책. */
function resolveTone(result: string): {
  label: string;
  dotCls: string;
  chipCls: string;
} {
  const r = (result ?? "").trim();
  if (r.includes("매각")) {
    return {
      label: "매각",
      dotCls: "bg-[var(--color-ink-900)]",
      chipCls: "bg-[var(--color-ink-900)] text-white",
    };
  }
  if (r.includes("미납")) {
    return {
      label: "미납",
      dotCls: "bg-white ring-2 ring-[var(--color-ink-700)]",
      chipCls:
        "border border-[var(--color-ink-300)] bg-[var(--color-surface-muted)] text-[var(--color-ink-700)]",
    };
  }
  if (r.includes("진행") || r === "") {
    return {
      label: "진행",
      dotCls: "bg-[var(--color-brand-600)]",
      chipCls: "bg-[var(--color-brand-600)] text-white",
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
