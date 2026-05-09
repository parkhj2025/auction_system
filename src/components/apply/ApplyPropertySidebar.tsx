"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { CourtListingSummary } from "@/types/apply";
import { formatKoreanWon } from "@/lib/utils";
import { PhotoGallery } from "./PhotoGallery";

/**
 * Stage 2 cycle 1-D-A — 사건 정보 사이드바.
 * - 데스크탑 (lg+) = 우측 column / sticky top.
 * - 모바일 = inline + collapse paradigm (chevron toggle / 기본 펼침).
 * - mount 조건: data.matchedListing 있을 때만 (manualEntry = mount 0).
 * - Step1·2·3·4 노출 / Step5 mount 0 (ApplyClient 광역 분기).
 */

interface Props {
  listing: CourtListingSummary;
  isResale?: boolean;
}

function deriveCaseTitle(listing: CourtListingSummary): string {
  if (listing.case_title?.trim()) return listing.case_title.trim();
  // fallback = "{용도} · {sido} {sigungu} {dong}"
  const usage = listing.usage_name ?? "";
  const addressShort = [listing.sido, listing.sigungu, listing.dong]
    .filter(Boolean)
    .join(" ");
  const composed = [usage, addressShort].filter(Boolean).join(" · ");
  return composed || "사건 정보";
}

function calculateDeposit(
  minBid: number | null,
  isResale: boolean,
): number | null {
  if (!minBid) return null;
  return Math.round(minBid * (isResale ? 0.2 : 0.1));
}

export function ApplyPropertySidebar({ listing, isResale = false }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const title = deriveCaseTitle(listing);
  const deposit = calculateDeposit(listing.min_bid_amount, isResale);
  const depositRate = isResale ? "20%" : "10%";

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-5 lg:sticky lg:top-[160px] lg:p-6">
      {/* 모바일 toggle (lg에서는 항상 펼침) */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between gap-2 lg:hidden"
        aria-expanded={!collapsed}
      >
        <p className="min-w-0 flex-1 truncate text-left text-sm font-bold text-[var(--color-ink-900)]">
          {title}
        </p>
        {collapsed ? (
          <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-gray-500" />
        ) : (
          <ChevronUp size={18} aria-hidden="true" className="shrink-0 text-gray-500" />
        )}
      </button>

      {/* 데스크탑 헤더 */}
      <p className="hidden text-base font-bold text-[var(--color-ink-900)] lg:block">
        {title}
      </p>

      <div className={collapsed ? "hidden lg:mt-4 lg:block" : "mt-4"}>
        {/* 사진 thumbnail 영역 */}
        <PhotoGallery docid={listing.docid} />

        {/* 사건 메타 */}
        <dl className="mt-4 flex flex-col gap-3">
          <div>
            <dt className="text-xs text-gray-500">사건번호 · 법원</dt>
            <dd className="mt-0.5 text-sm font-bold tabular-nums text-[var(--color-ink-900)]">
              {listing.case_number} · {listing.court_name}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">매각기일</dt>
            <dd className="mt-0.5 text-sm font-bold tabular-nums text-[var(--color-ink-900)]">
              {listing.bid_date ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">감정가</dt>
            <dd className="mt-0.5 text-sm font-bold tabular-nums text-[var(--color-ink-900)]">
              {listing.appraisal_amount != null
                ? formatKoreanWon(listing.appraisal_amount)
                : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">최저가</dt>
            <dd className="mt-0.5 text-base font-black tabular-nums text-red-500">
              {listing.min_bid_amount != null
                ? formatKoreanWon(listing.min_bid_amount)
                : "-"}
            </dd>
          </div>
          {deposit !== null && (
            <div className="rounded-md bg-yellow-50 px-3 py-2">
              <dt className="text-xs text-gray-700">
                입찰보증금 · {depositRate} 자동 계산
              </dt>
              <dd className="mt-0.5 text-base font-bold tabular-nums text-[var(--color-ink-900)]">
                {formatKoreanWon(deposit)}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-gray-500">유찰</dt>
            <dd className="mt-0.5 text-sm font-bold text-[var(--color-ink-900)]">
              {listing.failed_count === 0
                ? "신건"
                : `${listing.failed_count}회`}
            </dd>
          </div>
          {listing.area_display && (
            <div>
              <dt className="text-xs text-gray-500">면적</dt>
              <dd className="mt-0.5 text-sm font-bold text-[var(--color-ink-900)]">
                {listing.area_display}
              </dd>
            </div>
          )}
          {listing.usage_name && (
            <div>
              <dt className="text-xs text-gray-500">용도</dt>
              <dd className="mt-0.5 text-sm font-bold text-[var(--color-ink-900)]">
                {listing.usage_name}
              </dd>
            </div>
          )}
        </dl>

        {/* 출처 footer */}
        <p className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-500">
          공공저작물 · 대법원 경매정보
        </p>
      </div>
    </aside>
  );
}
