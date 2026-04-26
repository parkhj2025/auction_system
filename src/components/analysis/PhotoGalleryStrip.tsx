"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * dedicated 갤러리 strip — 본문 끝 RelatedCards 직전 또는 ApplyCTA 앞 위치.
 *  - thumb 8장 그리드 (lg+ 4-col / sm 3-col / mobile 2-col)
 *  - 각 thumb aspect-square + ~120px 작게
 *  - lightbox 0
 *  - 단계 3-1 G1 보강 ("mdx Img → null") 회귀 0 — Hero/본문 인라인 0건 보존
 *
 * Hero 의 HeroGallery 와 함께 동작. PhotoGalleryStrip 는 더 많은 사진 노출용.
 * meta.photos[] 를 photos prop 으로 받음. fallback 은 frontmatter.coverImage URL 패턴.
 */
export function PhotoGalleryStrip({
  photos,
  coverImage,
  alt,
  max = 8,
}: {
  photos?: string[];
  coverImage?: string;
  alt: string;
  max?: number;
}) {
  const initial = (() => {
    if (photos && photos.length > 0) return photos.slice(0, max);
    return deriveThumbs(coverImage, max);
  })();

  const [thumbs, setThumbs] = useState<string[]>(initial);
  if (thumbs.length === 0) return null;

  const handleError = (idx: number) => {
    setThumbs((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
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
          <div
            key={`${src}-${i}`}
            className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-ink-100)]"
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 180px, 33vw"
              className="object-cover transition duration-150 ease-out hover:brightness-110"
              onError={() => handleError(i)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function deriveThumbs(coverUrl: string | undefined, count: number): string[] {
  if (!coverUrl) return [];
  const m = coverUrl.match(/^(.*\/)\d+\.webp(\?.*)?$/);
  if (!m) return [];
  return Array.from({ length: count }, (_, i) => `${m[1]}${i}.webp${m[2] ?? ""}`);
}
