"use client";

import { CheckCircle2 } from "lucide-react";
import type { CourtListingSummary } from "@/types/apply";

/**
 * Step2~5에서 선택된 사건 정보를 상단에 고정 표시.
 *
 * Phase 6.5 강화 (2026-04-19): 두 경로(매칭 성공/manualEntry) 시각 통일.
 * - 매칭 성공: "✓ 자동 매칭: {caseNumber} · {court} · 매각기일 {bidDate}"
 * - manualEntry: "✓ 고객 확인 완료: {caseNumber} · {court} · 매각기일 {bidDate}"
 * - 디자인: bg-slate-100 + border-l-4 border-[var(--color-ink-900)] + text-base + CheckCircle2 prefix
 * - "수동 입력" 시스템 관점 용어 완전 제거 → "고객 확인 완료" 고객 관점.
 */
export function StickyPropertyBar({
  listing,
  caseNumber,
  manualEntry,
  court,
  bidDate,
}: {
  listing?: CourtListingSummary | null;
  caseNumber: string;
  manualEntry: boolean;
  court: string;
  bidDate: string;
}) {
  if (!listing && !manualEntry) return null;

  const label = listing ? "자동 매칭" : "고객 확인 완료";
  const displayCaseNumber = listing?.case_number ?? caseNumber;
  const displayCourt = listing?.court_name ?? court;
  const displayBidDate = listing?.bid_date ?? bidDate;

  return (
    <div className="sticky top-0 z-10 border-b border-[var(--color-border)] border-l-4 border-l-[var(--color-ink-900)] bg-slate-100 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
        <CheckCircle2
          size={18}
          className="shrink-0 text-[var(--color-ink-900)]"
          aria-hidden="true"
        />
        <span className="text-base font-bold text-[var(--color-ink-900)]">
          {label}
        </span>
        <span className="text-base font-bold tabular-nums text-[var(--color-ink-900)]">
          {displayCaseNumber || "-"}
        </span>
        <span className="text-[var(--color-ink-500)]" aria-hidden="true">·</span>
        <span className="text-sm text-[var(--color-ink-700)]">
          {displayCourt || "-"}
        </span>
        <span className="text-[var(--color-ink-500)]" aria-hidden="true">·</span>
        <span className="text-sm text-[var(--color-ink-700)]">
          매각기일{" "}
          <span className="font-bold tabular-nums text-[var(--color-ink-900)]">
            {displayBidDate || "-"}
          </span>
        </span>
      </div>
    </div>
  );
}
