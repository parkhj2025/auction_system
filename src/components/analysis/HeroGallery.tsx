"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Hero 갤러리 (G1 보강).
 *  - main 큰 이미지 폐기. thumbnail strip 4장만 가로 (lg+ / mobile 동일 grid-cols-4)
 *  - 각 thumb = aspect-square, max-w 약 140px, rounded-md
 *  - "현장 사진 N장" 카운터 inline 우측
 *  - lightbox 0
 *  - thumb URL = cover URL `.../{N}.webp` 패턴에서 0~3 인덱스 자동 도출
 */
export function HeroGallery({
  coverImage,
  photos,
  alt,
}: {
  coverImage?: string;
  photos?: string[];
  alt: string;
}) {
  const initial = (photos && photos.length > 0)
    ? photos.slice(0, 4)
    : deriveThumbs(coverImage, 4);

  const [thumbs, setThumbs] = useState<string[]>(initial);

  const handleThumbError = (idx: number) => {
    setThumbs((prev) => prev.filter((_, i) => i !== idx));
  };

  if (thumbs.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
          현장 사진
        </p>
        <span className="text-xs font-medium tabular-nums text-[var(--color-ink-500)]">
          {thumbs.length}장
        </span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
        {thumbs.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-ink-100)]"
          >
            <Image
              src={src}
              alt={`${alt} 보조 사진 ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 140px, 25vw"
              className="object-cover transition duration-150 ease-out hover:brightness-110"
              onError={() => handleThumbError(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * coverImage URL 끝의 `/{idx}.webp` 패턴에서 0.webp ~ (N-1).webp 도출.
 * 매칭 실패 시 빈 배열.
 */
function deriveThumbs(coverUrl: string | undefined, count: number): string[] {
  if (!coverUrl) return [];
  const match = coverUrl.match(/^(.*\/)\d+\.webp(\?.*)?$/);
  if (!match) return [];
  const base = match[1];
  const suffix = match[2] ?? "";
  return Array.from({ length: count }, (_, i) => `${base}${i}.webp${suffix}`);
}
