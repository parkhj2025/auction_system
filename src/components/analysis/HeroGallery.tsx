"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera } from "lucide-react";
import { Lightbox } from "./Lightbox";

/**
 * Hero 갤러리 — 단계 5-4-2-fix-4 룰 8.
 *
 * 변경 (형준님 룰 8 옵션 b):
 *  - 4 grid 폐기 → 첫 사진 원형 썸네일 (96px desktop / 72px mobile) 단일
 *  - 사진 영향력 축소 — 가격 strong + 사진 보조
 *  - 클릭 시 Lightbox modal expand (전체 사진 carousel — sequence 모드)
 *  - 라벨 "현장 사진 N장" 보존 (총 사진 수 표시)
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
    : deriveThumbs(coverImage, 4);

  const [thumbs, setThumbs] = useState<string[]>(initial);
  const [open, setOpen] = useState(false);

  if (thumbs.length === 0) return null;

  const handleError = () => {
    // 첫 사진 fail 시 다음 후보로 fallback
    setThumbs((prev) => prev.slice(1));
  };

  return (
    <>
      <div className="mt-7 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`${alt} 갤러리 열기 (${thumbs.length}장)`}
          className="group relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-border)] bg-[var(--color-ink-100)] outline-none transition-all duration-[var(--duration-sm)] ease-out hover:border-[var(--color-ink-900)] hover:shadow-[var(--shadow-card)] focus-visible:border-[var(--color-ink-900)] focus-visible:shadow-[0_0_0_3px_rgba(15,23,42,0.15)] sm:h-[96px] sm:w-[96px]"
        >
          <Image
            src={thumbs[0]}
            alt={`${alt} 대표 사진`}
            fill
            sizes="(min-width: 640px) 96px, 72px"
            className="object-cover transition-transform duration-[var(--duration-md)] ease-out group-hover:scale-105"
            onError={handleError}
          />
          {/* hover overlay — Camera 아이콘 */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[var(--color-ink-900)]/0 text-white opacity-0 transition-all duration-[var(--duration-sm)] ease-out group-hover:bg-[var(--color-ink-900)]/40 group-hover:opacity-100 group-focus-visible:bg-[var(--color-ink-900)]/40 group-focus-visible:opacity-100"
          >
            <Camera size={20} />
          </span>
        </button>
        <div>
          <p className="text-[length:var(--text-caption)] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            현장 사진
          </p>
          <p className="mt-1 text-[length:var(--text-body-sm)] tabular-nums text-[var(--color-ink-700)]">
            <span className="font-bold text-[var(--color-ink-900)]">
              {thumbs.length}장
            </span>{" "}
            · 클릭하여 전체보기
          </p>
        </div>
      </div>

      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        photos={thumbs}
        startIndex={0}
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
