"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

/**
 * Hero 갤러리 — Hero 본문 하부 thumbnail strip 가로 4열.
 *  - 각 thumb 클릭 → Lightbox 모달 (sequence 모드 + 키보드 ←→)
 *  - 단계 3-1 G1 보존: main 큰 이미지 폐기, thumb strip 만
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
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (thumbs.length === 0) return null;

  const handleThumbError = (idx: number) => {
    setThumbs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClick = (idx: number) => {
    setStartIndex(idx);
    setOpen(true);
  };

  return (
    <>
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
            <button
              type="button"
              key={`${src}-${i}`}
              onClick={() => handleClick(i)}
              aria-label={`${alt} ${i + 1}번 크게 보기`}
              className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-ink-100)] transition duration-150 ease-out hover:brightness-110"
            >
              <Image
                src={src}
                alt={`${alt} 보조 사진 ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 140px, 25vw"
                className="object-cover"
                onError={() => handleThumbError(i)}
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
