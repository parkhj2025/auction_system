"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Hero 갤러리 (A′).
 *  - lg+: 좌측 main(3) + 우측 thumbnail strip 4장 세로 1열 (1)
 *  - mobile: main 위 + thumbs 가로 4장
 *  - lightbox 0. hover 시 brightness 105% 미세 변화만.
 *
 * thumbs 는 명시 props 가 없으면 cover URL 패턴(`.../{N}.webp`)에서 1~4 인덱스 자동 도출.
 * onError 시 해당 thumb 만 graceful 숨김 → 표시 카운터 자동 보정.
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
  const [coverFailed, setCoverFailed] = useState(false);

  const handleThumbError = (idx: number) => {
    setThumbs((prev) => prev.filter((_, i) => i !== idx));
  };

  const visibleThumbs = thumbs.length;
  const showCounter = visibleThumbs > 0 || (!!coverImage && !coverFailed);

  return (
    <div className="relative">
      {showCounter ? (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
          현장 사진 {visibleThumbs + (coverImage && !coverFailed ? 1 : 0)}장
        </span>
      ) : null}

      <div className="grid gap-2 lg:grid-cols-[3fr_1fr] lg:items-stretch">
        {/* Main cover */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-ink-100)]">
          {coverImage && !coverFailed ? (
            <Image
              src={coverImage}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition duration-150 ease-out hover:brightness-105"
              priority
              onError={() => setCoverFailed(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--color-ink-500)]">
              현장 사진 준비 중
            </div>
          )}
        </div>

        {/* Thumb strip — lg: column / mobile: row */}
        {visibleThumbs > 0 ? (
          <div className="flex gap-2 overflow-x-auto lg:grid lg:grid-cols-1 lg:grid-rows-4 lg:overflow-visible">
            {thumbs.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-ink-100)] lg:h-auto lg:w-full lg:aspect-square"
              >
                <Image
                  src={src}
                  alt={`${alt} 보조 사진 ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 20vw, 25vw"
                  className="object-cover transition duration-150 ease-out hover:brightness-110"
                  onError={() => handleThumbError(i)}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * coverImage URL 끝의 `/{idx}.webp` 패턴에서 1.webp ~ N.webp 도출.
 * 매칭 실패 시 빈 배열.
 */
function deriveThumbs(coverUrl: string | undefined, count: number): string[] {
  if (!coverUrl) return [];
  const match = coverUrl.match(/^(.*\/)\d+\.webp(\?.*)?$/);
  if (!match) return [];
  const base = match[1];
  const suffix = match[2] ?? "";
  return Array.from({ length: count }, (_, i) => `${base}${i + 1}.webp${suffix}`);
}
