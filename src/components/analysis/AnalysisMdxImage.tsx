"use client";

import { useState } from "react";
import type { AnalysisCategory } from "@/types/content";

/**
 * 마크다운 본문의 ![alt](src)를 렌더.
 * - 실제 이미지가 존재하면 그대로 표시
 * - src가 비었거나 onError 발생 시 카테고리별 그라디언트 플레이스홀더로 대체
 * - Phase 1은 대부분 이미지가 없으므로 플레이스홀더가 주로 보이게 된다
 */

/* 이미지 폴백 그라디언트 — 중립화 (카테고리 무관 회색 통일) */
const GRADIENTS: Record<AnalysisCategory, string> = {
  danger: "from-[var(--color-ink-300)] via-[var(--color-ink-300)]/80 to-[var(--color-ink-100)]",
  safe: "from-[var(--color-ink-300)] via-[var(--color-ink-300)]/80 to-[var(--color-ink-100)]",
  edu: "from-[var(--color-ink-300)] via-[var(--color-ink-300)]/80 to-[var(--color-ink-100)]",
};

const CATEGORY_LABEL: Record<AnalysisCategory, string> = {
  danger: "주의",
  safe: "안정",
  edu: "교육",
};

export function AnalysisMdxImage({
  src,
  alt,
  category = "edu",
}: {
  src?: string;
  alt?: string;
  category?: AnalysisCategory;
}) {
  const [failed, setFailed] = useState(false);
  const gradient = GRADIENTS[category];
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <span
        role="img"
        aria-label={alt || "물건 이미지"}
        className={`mt-8 flex aspect-[16/9] w-full items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-gradient-to-br ${gradient}`}
      >
        <span className="flex flex-col items-center text-[var(--color-ink-700)]">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-ink-500)]">
            {CATEGORY_LABEL[category]}
          </span>
          <span className="mt-1 max-w-xs px-4 text-center text-sm font-medium text-[var(--color-ink-700)]">
            {alt || "이미지 준비 중"}
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className="mt-8 block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        className="block h-auto w-full"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
