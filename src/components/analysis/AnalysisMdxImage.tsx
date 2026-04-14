"use client";

import { useState } from "react";
import type { AnalysisCategory } from "@/types/content";

/**
 * 마크다운 본문의 ![alt](src)를 렌더.
 * - 실제 이미지가 존재하면 그대로 표시
 * - src가 비었거나 onError 발생 시 카테고리별 그라디언트 플레이스홀더로 대체
 * - Phase 1은 대부분 이미지가 없으므로 플레이스홀더가 주로 보이게 된다
 */

const GRADIENTS: Record<AnalysisCategory, string> = {
  danger:
    "from-[var(--color-accent-red)] via-[var(--color-accent-red)]/80 to-[var(--color-accent-red-soft)]",
  safe:
    "from-[var(--color-accent-green)] via-[var(--color-accent-green)]/80 to-[var(--color-accent-green-soft)]",
  edu: "from-brand-700 via-brand-500 to-brand-200",
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
        <span className="flex flex-col items-center text-white">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/80">
            {CATEGORY_LABEL[category]}
          </span>
          <span className="mt-1 max-w-xs px-4 text-center text-sm font-medium text-white/95">
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
