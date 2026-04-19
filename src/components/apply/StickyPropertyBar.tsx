"use client";

import { CheckCircle2 } from "lucide-react";
import type { CourtListingSummary } from "@/types/apply";
import { formatKoreanWon } from "@/lib/utils";

/**
 * Step2~5에서 선택된 물건 정보를 상단에 고정 표시.
 * 2줄 구조: 1행 주소(제목급), 2행 메타 정보.
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
    // Phase 6 UX 수정: "수동 입력"(시스템 관점) → "고객 확인 완료 ✓"(고객 관점) + 체크 아이콘.
    return (
      <div className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3">
        <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink-700)]">
          <CheckCircle2
            size={14}
            className="shrink-0 text-brand-600"
            aria-hidden="true"
          />
          사건번호: <span className="tabular-nums">{caseNumber || "-"}</span>
          <span className="text-[var(--color-ink-500)]">·</span>
          <span className="text-brand-700">고객 확인 완료</span>
        </p>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 border-b border-brand-200 bg-brand-50/80 backdrop-blur-sm">
      <div className="border-l-4 border-brand-600 px-4 py-3">
        <div className="mx-auto max-w-5xl">
          {/* 1행: 라벨 + 주소 (Phase 6 UX 수정: "선택된 물건" → "자동 매칭 ✓" 톤 통일) */}
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={16}
              className="shrink-0 text-brand-600"
              aria-hidden="true"
            />
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-600">
              자동 매칭
            </span>
            <span className="text-sm font-bold text-[var(--color-ink-900)]">
              {listing.address_display}
            </span>
          </div>
          {/* 2행: 메타 정보 */}
          <div className="mt-1 ml-6 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[var(--color-ink-500)]">
            <span>{listing.case_number}</span>
            <span className="font-bold text-[var(--color-accent-red)]">
              최저가{" "}
              {listing.min_bid_amount != null
                ? formatKoreanWon(listing.min_bid_amount)
                : "-"}
            </span>
            <span>입찰일 {listing.bid_date ?? ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
