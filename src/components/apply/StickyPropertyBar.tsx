"use client";

import { MapPin } from "lucide-react";
import type { CourtListingSummary } from "@/types/apply";
import { formatKoreanWon, formatBidDateTime } from "@/lib/utils";

/**
 * Step2~5에서 선택된 물건 정보를 상단에 고정 표시.
 * matchedListing이 있을 때만 렌더링.
 * 수동 입력 경로에서는 사건번호만 표시.
 */
export function StickyPropertyBar({
  listing,
  caseNumber,
  manualEntry,
}: {
  listing?: CourtListingSummary | null;
  caseNumber: string;
  manualEntry: boolean;
}) {
  if (!listing && !manualEntry) return null;

  if (manualEntry || !listing) {
    return (
      <div className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5">
        <p className="text-xs font-bold text-[var(--color-ink-700)]">
          사건번호: {caseNumber || "-"} — 수동 입력
        </p>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 border-b border-brand-100 bg-brand-50/60 px-4 py-2.5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="flex items-center gap-1 font-bold text-[var(--color-ink-900)]">
          <MapPin size={12} className="shrink-0 text-brand-600" aria-hidden="true" />
          {listing.address_display}
        </span>
        <span className="text-[var(--color-ink-500)]">
          {listing.case_number}
        </span>
        <span className="font-bold text-[var(--color-accent-red)]">
          최저가 {listing.min_bid_amount != null ? formatKoreanWon(listing.min_bid_amount) : "-"}
        </span>
        <span className="text-[var(--color-ink-500)]">
          입찰일 {formatBidDateTime(listing.bid_date, listing.bid_time)}
        </span>
      </div>
    </div>
  );
}
