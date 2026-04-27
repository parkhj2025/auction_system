"use client";

/**
 * 02 입찰 경과 — 단계 5-4-2-fix-4 룰 9 (Side-by-Side Sticky + BiddingTimeline 카드 폐기).
 *
 * 변경 (형준님 룰 9):
 *  - 매각 회차 흐름 별도 카드 (단계 5-4-2-fix BiddingTimeline) 폐기
 *  - STEP 1→2 자연 흐름 single-column timeline + connecting line draw
 *  - 회차 번호·날짜·결과·가격 STEP 카드 헤더에 직접 통합
 *  - 현재 STEP scale 1.02 + 색상 위계 (1차 ink-300 weak / 2차 ink-900 strong)
 *
 * 시각 위계 (단계 5-4-2-fix 보존):
 *  - 진행 회차 → ink-900 strong + "현재" 칩 + scale 1.02
 *  - 과거 회차 (유찰·매각·미납) → ink-300 weak + opacity 0.6
 *
 * Typography (룰 14-B):
 *  - STEP 헤딩 = h4 (20px) font-semibold ink-900
 *  - 가격 (회차 핵심 수치) = h3 (24px) font-black ink-900
 *  - narrative = body (16px) ink-700
 *  - 라벨 (회차·결과·날짜) = caption (12px) ink-500
 */
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { BiddingHistoryEntry } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

export function TimelineSection({
  history,
}: {
  history: BiddingHistoryEntry[];
}) {
  if (!history || history.length === 0) return null;

  return (
    <ol className="mt-6 relative space-y-6 sm:space-y-8" aria-label="매각 회차 흐름">
      {history.map((entry, idx) => {
        const isCurrent = isCurrentEntry(entry);
        const isLast = idx === history.length - 1;
        return (
          <StepCard
            key={`${entry.round}-${idx}`}
            entry={entry}
            idx={idx}
            isCurrent={isCurrent}
            isLast={isLast}
            history={history}
          />
        );
      })}
    </ol>
  );
}

function StepCard({
  entry,
  idx,
  isCurrent,
  isLast,
  history,
}: {
  entry: BiddingHistoryEntry;
  idx: number;
  isCurrent: boolean;
  isLast: boolean;
  history: BiddingHistoryEntry[];
}) {
  const ref = useRef<HTMLLIElement>(null);
  // 룰 1: once: false — 위·아래 스크롤 재실행
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const resultLabel = resolveResultLabel(entry.result);
  const narrative = resolveStepNarrative(entry, idx, history);

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
      transition={{
        duration: 0.4,
        delay: idx * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative"
    >
      {/* connecting line (다음 step 으로) */}
      {!isLast ? (
        <motion.span
          aria-hidden="true"
          className="absolute left-4 top-12 h-[calc(100%-1rem)] w-px origin-top bg-[var(--color-border)]"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{
            duration: 0.6,
            delay: idx * 0.1 + 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ) : null}

      <div
        className={`relative rounded-[var(--radius-md)] border bg-white p-6 sm:p-8 transition-transform duration-[var(--duration-md)] ease-out ${
          isCurrent
            ? "scale-[1.02] border-[var(--color-ink-900)] shadow-[var(--shadow-card)]"
            : "border-[var(--color-border)] opacity-70"
        }`}
      >
        {/* dot marker (좌측 상단) */}
        <span
          aria-hidden="true"
          className={`absolute -left-px top-5 inline-flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full ring-4 ring-white ${
            isCurrent ? "bg-[var(--color-ink-900)]" : "bg-[var(--color-ink-300)]"
          }`}
        />

        {/* 헤더 — 회차 번호·결과·날짜 한 줄 통합 */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3
            className={`text-[length:var(--text-h4)] tabular-nums tracking-tight ${
              isCurrent
                ? "font-black text-[var(--color-ink-900)]"
                : "font-bold text-[var(--color-ink-500)]"
            }`}
          >
            {entry.round}차 {resultLabel}
          </h3>
          {isCurrent ? (
            <span className="rounded-[var(--radius-xs)] bg-[var(--color-ink-900)] px-2 py-0.5 text-[length:var(--text-caption)] font-black uppercase tracking-[0.18em] text-white">
              현재
            </span>
          ) : null}
          <span className="text-[length:var(--text-caption)] tabular-nums text-[var(--color-ink-500)]">
            {entry.date || "—"}
          </span>
        </div>

        {/* 가격 — 회차 핵심 수치 */}
        <p
          className={`mt-2 tabular-nums leading-tight ${
            isCurrent
              ? "text-[length:var(--text-h3)] font-black text-[var(--color-ink-900)]"
              : "text-[length:var(--text-h4)] font-bold text-[var(--color-ink-500)]"
          }`}
        >
          {entry.minimum != null ? formatKoreanWon(entry.minimum) : "—"}
          {entry.rate != null ? (
            <span
              className={`ml-2 text-[length:var(--text-body-sm)] font-medium ${
                isCurrent
                  ? "text-[var(--color-ink-700)]"
                  : "text-[var(--color-ink-500)]"
              }`}
            >
              감정가의 {entry.rate}%
            </span>
          ) : null}
        </p>

        {/* narrative */}
        {narrative ? (
          <p className="mt-3 text-[length:var(--text-body)] leading-[1.6] text-[var(--color-ink-700)]">
            {narrative}
          </p>
        ) : null}
      </div>
    </motion.li>
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
  if (r === "" || r.includes("진행")) return "진행";
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
  return result || "";
}
