"use client";

import { useState } from "react";

/**
 * 마크다운 본문의 ![alt](src)를 렌더.
 * - 실제 이미지가 존재하면 그대로 표시
 * - src가 비었거나 onError 발생 시 중립 플레이스홀더로 대체
 * - v2: category prop 폐기 (원칙 5 — 내부 분류 라벨 비노출).
 *   기존 3종 그라디언트는 어차피 동일 회색 클래스였으므로 시각 변화 0.
 */

const PLACEHOLDER_GRADIENT =
  "from-[var(--color-ink-300)] via-[var(--color-ink-300)]/80 to-[var(--color-ink-100)]";

export function AnalysisMdxImage({
  src,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <span
        role="img"
        aria-label={alt || "물건 이미지"}
        className={`mt-8 flex aspect-[16/9] w-full items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-gradient-to-br ${PLACEHOLDER_GRADIENT}`}
      >
        <span className="flex flex-col items-center text-[var(--color-ink-700)]">
          <span className="max-w-xs px-4 text-center text-sm font-semibold text-[var(--color-ink-700)]">
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
