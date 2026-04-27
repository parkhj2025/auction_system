"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

/**
 * Hero 갤러리 — 단계 5-4-2-fix-5 룰 15-B.
 *
 * 변경 (단계 5-4-2-fix-4 룰 8 단일 원형 → 룰 15 grid):
 *  - meta.photos 전체 사진 grid (4 한정 폐기)
 *  - mobile 3 col / sm 4 / md 5 / lg 6 col
 *  - 각 썸네일 aspect-square + rounded-md + hover overlay
 *  - 클릭 시 Lightbox modal expand (sequence 모드)
 *  - "4 한정" / "클릭하여 전체보기" 텍스트 폐기
 *
 * 룰 15-D — 페이지 맨 아래 별도 PhotoGalleryStrip 폐기 (Hero 일원화).
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
  const initial = photos && photos.length > 0
    ? photos
    : deriveThumbs(coverImage, 8);

  const [thumbs, setThumbs] = useState<string[]>(initial);
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (thumbs.length === 0) return null;

  const handleError = (idx: number) => {
    setThumbs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClick = (idx: number) => {
    setStartIndex(idx);
    setOpen(true);
  };

  return (
    <>
      <div className="mt-7">
        <p className="text-[length:var(--text-caption)] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
          현장 사진 <span className="ml-1 tabular-nums text-[var(--color-ink-900)]">{thumbs.length}장</span>
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6">
          {thumbs.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => handleClick(idx)}
              aria-label={`${alt} ${idx + 1}번 크게 보기`}
              className="group relative aspect-square w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-ink-100)] outline-none transition-all duration-[var(--duration-sm)] ease-out hover:border-[var(--color-ink-900)] focus-visible:border-[var(--color-ink-900)] focus-visible:shadow-[0_0_0_3px_rgba(15,23,42,0.15)]"
            >
              <Image
                src={src}
                alt={`${alt} ${idx + 1}`}
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 768px) 20vw, (min-width: 640px) 25vw, 33vw"
                className="object-cover transition-transform duration-[var(--duration-md)] ease-out group-hover:scale-105"
                onError={() => handleError(idx)}
              />
              {/* hover overlay */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[var(--color-ink-900)]/0 transition-all duration-[var(--duration-sm)] ease-out group-hover:bg-[var(--color-ink-900)]/30 group-focus-visible:bg-[var(--color-ink-900)]/30"
              />
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        photos={thumbs}
        startIndex={startIndex}
        mode="sequence"
        alt={alt}
      />
    </>
  );
}

function deriveThumbs(coverUrl: string | undefined, count: number): string[] {
  if (!coverUrl) return [];
  const match = coverUrl.match(/^(.*\/)\d+\.webp(\?.*)?$/);
  if (!match) return [];
  const base = match[1];
  const suffix = match[2] ?? "";
  return Array.from({ length: count }, (_, i) => `${base}${i}.webp${suffix}`);
}
