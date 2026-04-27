"use client";

/**
 * 단계 5-4-2: 02 입찰 경과 우측 sticky graphic — Graphic Sequence 패턴.
 *
 * 좌측 step active idx 별 다른 state 표시:
 *  - 1차 step active: 1차 dot brand-600 fill (current) + 2차·3차 dot ink-300 outline
 *  - 2차 step active: 1차 dot ink-500 (이전) + 2차 dot brand-600 fill (current) + line draw 1→2
 *  ... (각 step 별)
 *
 * dot 크기 = 매각가율 매핑 (단계 5-4-1 동일): rate * 0.08 + 8 → 100% = 16px / 70% = 14px
 *
 * 모노톤: ink-300/500/700/900 + brand-600 단일 액센트.
 * case study 인용: scrollytelling "Side-by-Side Sticky" + "Graphic Sequence" + Apple "line draw" + chart-visualization "line/funnel".
 */
import type { BiddingHistoryEntry } from "@/types/content";
import { motion, AnimatePresence } from "motion/react";
import { formatKoreanWon } from "@/lib/utils";

export function BiddingTimeline({
  history,
  activeIdx,
}: {
  history: BiddingHistoryEntry[];
  activeIdx: number;
}) {
  if (!history || history.length === 0) return null;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
        매각 회차 흐름
      </p>
      <ol className="relative mt-6 space-y-10">
        {/* vertical line — full draw */}
        <span
          aria-hidden="true"
          className="absolute left-3 top-2 bottom-2 w-px bg-[var(--color-border)]"
        />
        {history.map((entry, idx) => {
          const isActive = idx === activeIdx;
          const isPast = idx < activeIdx;
          const tone = resolveTone(entry.result, isActive);
          const dotSize = computeDotSize(entry.rate);
          return (
            <li key={`${entry.round}-${idx}`} className="relative pl-12">
              {/* dot */}
              <motion.span
                aria-hidden="true"
                className={`absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full ring-4 ring-white ${tone.dotCls}`}
                animate={{
                  scale: isActive ? 1.15 : isPast ? 1 : 0.85,
                  opacity: isActive ? 1 : isPast ? 0.7 : 0.45,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: `${dotSize + 4}px`,
                  height: `${dotSize + 4}px`,
                  marginLeft: `${(20 - dotSize) / 2 - 2}px`,
                }}
              />
              {/* 회차 + 가격 */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span
                  className={`text-base font-black tabular-nums transition-colors ${
                    isActive
                      ? "text-[var(--color-ink-900)]"
                      : "text-[var(--color-ink-500)]"
                  }`}
                >
                  {entry.round != null ? `${entry.round}차` : "—"}
                </span>
                <span className="text-xs tabular-nums text-[var(--color-ink-500)]">
                  {entry.date || "—"}
                </span>
              </div>
              <div
                className={`mt-1 text-2xl font-black tabular-nums transition-colors ${
                  isActive
                    ? "text-[var(--color-ink-900)]"
                    : "text-[var(--color-ink-500)]"
                }`}
              >
                {entry.minimum != null ? formatKoreanWon(entry.minimum) : "—"}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs tabular-nums text-[var(--color-ink-500)]">
                {entry.rate != null ? <span>감정가의 {entry.rate}%</span> : null}
                <span aria-hidden="true">·</span>
                <span className={tone.chipCls}>{tone.label}</span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* active step 의 가격 인하 폭 highlight (Animated Transition) */}
      <AnimatePresence mode="wait">
        {activeIdx > 0 && history[activeIdx] && history[activeIdx - 1] ? (
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-6 rounded-[var(--radius-md)] border-l-4 border-[var(--color-brand-600)] bg-[var(--color-brand-50)] px-4 py-3 text-sm text-[var(--color-ink-700)]"
          >
            <span className="font-bold tabular-nums text-[var(--color-brand-700)]">
              {history[activeIdx - 1].rate! - history[activeIdx].rate!}%p 인하
            </span>
            : 이전 회차 대비 진입 가격 변화
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function computeDotSize(rate: number | null | undefined): number {
  if (rate == null || !Number.isFinite(rate)) return 12;
  const size = Math.round(rate * 0.08 + 8);
  return Math.max(8, Math.min(20, size));
}

function resolveTone(
  result: string,
  isActive: boolean
): { label: string; dotCls: string; chipCls: string } {
  const r = (result ?? "").trim();
  if (r.includes("매각")) {
    return {
      label: "매각",
      dotCls: "bg-[var(--color-ink-900)]",
      chipCls: "font-bold text-[var(--color-ink-900)]",
    };
  }
  if (r.includes("미납")) {
    return {
      label: "미납",
      dotCls: "bg-white ring-2 ring-[var(--color-ink-700)]",
      chipCls: "font-bold text-[var(--color-ink-700)]",
    };
  }
  if (r.includes("진행") || r === "") {
    return {
      label: "진행 예정",
      dotCls: isActive ? "bg-[var(--color-brand-600)]" : "bg-[var(--color-ink-300)]",
      chipCls: isActive
        ? "font-bold text-[var(--color-brand-700)]"
        : "font-bold text-[var(--color-ink-500)]",
    };
  }
  if (r.includes("유찰")) {
    return {
      label: "유찰",
      dotCls: "bg-[var(--color-ink-300)]",
      chipCls: "text-[var(--color-ink-500)]",
    };
  }
  return {
    label: r || "—",
    dotCls: "bg-[var(--color-ink-300)]",
    chipCls: "text-[var(--color-ink-500)]",
  };
}
