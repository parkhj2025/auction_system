"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

/**
 * dedicated 갤러리 strip — 본문 끝 위치.
 *  - thumb 8장 그리드 (lg+ 4-col / sm 3-col / mobile 2-col)
 *  - 각 thumb 클릭 → Lightbox 모달 (sequence 모드: 좌우 이동·키보드·카운터)
 *  - single 모드 prop 지원 (본문 인라인 단독 표시 — 좌우 이동 0)
 *  - 단계 3-1 G1 ("mdx Img → null") 보존 — Hero·본문 인라인 사진 0건
 */
export function PhotoGalleryStrip({
  photos,
  coverImage,
  alt,
  max = 8,
  mode = "sequence",
}: {
  photos?: string[];
  coverImage?: string;
  alt: string;
  max?: number;
  mode?: "sequence" | "single";
}) {
  const initial = (() => {
    if (photos && photos.length > 0) return photos.slice(0, max);
    return deriveThumbs(coverImage, max);
  })();

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
      <section
        aria-label="현장 사진"
        className="mt-12 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 sm:p-6"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-700)]">
            현장 사진
          </p>
          <span className="text-xs font-medium tabular-nums text-[var(--color-ink-500)]">
            {thumbs.length}장
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
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
                alt={`${alt} ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 180px, 33vw"
                className="object-cover"
                onError={() => handleError(i)}
              />
            </button>
          ))}
        </div>
      </section>

      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        photos={thumbs}
        startIndex={startIndex}
        mode={mode}
        alt={alt}
      />
    </>
  );
}

function deriveThumbs(coverUrl: string | undefined, count: number): string[] {
  if (!coverUrl) return [];
  const m = coverUrl.match(/^(.*\/)\d+\.webp(\?.*)?$/);
  if (!m) return [];
  return Array.from({ length: count }, (_, i) => `${m[1]}${i}.webp${m[2] ?? ""}`);
}
