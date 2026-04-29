"use client";

/**
 * 02 입찰 경과 우측 sticky graphic — Graphic Sequence + 시각 위계 (단계 5-4-2-fix).
 *
 * 시각 위계 (형준님 본질 통찰):
 *  - 진행 회차 (current) → ink-900 strong fill + 크기 1.2x + 굵기 강조 (default 항시 강조)
 *  - 과거 회차 (매각·유찰·미납) → ink-300 outline + opacity 0.6 + 굵기 약화 (default weak)
 *  - 활성 (사용자 스크롤 위치) → subtle ring + scale 1.15 추가 표시 (현재 무엇을 보고 있는지)
 *
 * dot 크기 = 매각가율 매핑: rate * 0.08 + 8 → 100% = 16px / 70% = 14px
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
        <span
          aria-hidden="true"
          className="absolute left-3 top-2 bottom-2 w-px bg-[var(--color-border)]"
        />
        {history.map((entry, idx) => {
          const isActive = idx === activeIdx;
          const visualWeight = resolveVisualWeight(entry.result);
          const tone = resolveTone(entry.result, visualWeight);
          const dotSize = computeDotSize(entry.rate);
          const isCurrent = visualWeight === "current";

          return (
            <li key={`${entry.round}-${idx}`} className="relative pl-12">
              <motion.span
                aria-hidden="true"
                className={`absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full ring-4 ring-white ${tone.dotCls}`}
                animate={{
                  scale: isCurrent ? 1.2 : isActive ? 1.05 : 0.85,
                  opacity: isCurrent ? 1 : 0.6,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: `${dotSize + (isCurrent ? 6 : 2)}px`,
                  height: `${dotSize + (isCurrent ? 6 : 2)}px`,
                  marginLeft: `${(20 - dotSize) / 2 - (isCurrent ? 3 : 1)}px`,
                }}
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span
                  className={`text-[length:var(--text-body)] tabular-nums transition-colors ${
                    isCurrent
                      ? "font-black text-[var(--color-ink-900)]"
                      : "font-bold text-[var(--color-ink-500)] opacity-60"
                  }`}
                >
                  {entry.round != null ? `${entry.round}차` : "—"}
                </span>
                <span
                  className={`text-xs tabular-nums ${
                    isCurrent
                      ? "text-[var(--color-ink-700)]"
                      : "text-[var(--color-ink-500)] opacity-60"
                  }`}
                >
                  {entry.date || "—"}
                </span>
              </div>
              <div
                className={`mt-1 tabular-nums transition-colors ${
                  isCurrent
                    ? "text-h3 font-black text-[var(--color-ink-900)]"
                    : "text-lg font-bold text-[var(--color-ink-500)] opacity-60"
                }`}
              >
                {entry.minimum != null ? formatKoreanWon(entry.minimum) : "—"}
              </div>
              <div
                className={`mt-1 flex items-center gap-2 text-xs tabular-nums ${
                  isCurrent ? "" : "opacity-60"
                }`}
              >
                {entry.rate != null ? (
                  <span className="text-[var(--color-ink-500)]">
                    감정가의 {entry.rate}%
                  </span>
                ) : null}
                <span aria-hidden="true" className="text-[var(--color-ink-500)]">
                  ·
                </span>
                <span className={tone.chipCls}>{tone.label}</span>
              </div>
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait">
        {activeIdx > 0 && history[activeIdx] && history[activeIdx - 1] ? (
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.3 }}
            className="mt-6 origin-left rounded-[var(--radius-md)] border-l-4 border-[var(--color-ink-900)] bg-[var(--color-ink-50)] px-4 py-3 text-sm text-[var(--color-ink-700)]"
          >
            <span className="font-bold tabular-nums text-[var(--color-ink-900)]">
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

type VisualWeight = "current" | "past";

function resolveVisualWeight(result: string): VisualWeight {
  const r = (result ?? "").trim();
  if (r === "" || r.includes("진행")) return "current";
  return "past";
}

function resolveTone(
  result: string,
  weight: VisualWeight
): { label: string; dotCls: string; chipCls: string } {
  const r = (result ?? "").trim();
  if (r.includes("매각")) {
    return {
      label: "매각",
      dotCls: "bg-[var(--color-ink-300)]",
      chipCls: "font-semibold text-[var(--color-ink-500)]",
    };
  }
  if (r.includes("미납")) {
    return {
      label: "미납",
      dotCls: "bg-white ring-2 ring-[var(--color-ink-300)]",
      chipCls: "font-semibold text-[var(--color-ink-500)]",
    };
  }
  if (r.includes("유찰")) {
    return {
      label: "유찰",
      dotCls: "bg-white ring-2 ring-[var(--color-ink-300)]",
      chipCls: "font-semibold text-[var(--color-ink-500)]",
    };
  }
  if (weight === "current") {
    return {
      label: "진행",
      dotCls: "bg-[var(--color-ink-900)]",
      chipCls: "font-black text-[var(--color-ink-900)]",
    };
  }
  return {
    label: r || "—",
    dotCls: "bg-[var(--color-ink-300)]",
    chipCls: "text-[var(--color-ink-500)]",
  };
}
