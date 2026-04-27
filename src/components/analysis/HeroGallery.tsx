"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Lightbox } from "./Lightbox";

/**
 * Hero 갤러리 — 단계 5-4-2-fix-6 룰 18 (한 줄 carousel).
 *
 * 변경 (단계 5-4-2-fix-5 룰 15-B grid 폐기 후 재구성):
 *  - 8장 grid 패턴 폐기 → 한 줄 carousel
 *  - desktop: slide width ~60% + 좌·우 partial peek
 *  - mobile: slide width ~80% + 우측 partial peek
 *  - aspect-ratio 4:3 + height 360~400px desktop / 240px mobile
 *  - arrow 버튼 + native scroll-snap (swipe 자연 호환) + dots indicator
 *  - 클릭 → Lightbox modal expand (sequence 모드)
 *
 * a11y (W3C ARIA Carousel APG):
 *  - role="region" + aria-roledescription="carousel" + aria-label="현장 사진 N장"
 *  - 이전·다음 버튼 + aria-label
 *  - 키보드 Tab focus + ←→ slide + Enter Lightbox open
 *  - prefers-reduced-motion: scroll-behavior auto (motion 무시)
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
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (thumbs.length === 0) return null;

  const handleError = (idx: number) => {
    setThumbs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClick = (idx: number) => {
    setStartIndex(idx);
    setOpen(true);
  };

  const scrollToIdx = (idx: number) => {
    if (!trackRef.current) return;
    const slide = trackRef.current.children[idx] as HTMLElement | undefined;
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      setActiveIdx(idx);
    }
  };

  const next = () => scrollToIdx(Math.min(thumbs.length - 1, activeIdx + 1));
  const prev = () => scrollToIdx(Math.max(0, activeIdx - 1));

  return (
    <>
      <div
        className="mt-7"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${alt} ${thumbs.length}장`}
      >
        <div className="flex items-baseline justify-between">
          <p className="text-[length:var(--text-caption)] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            현장 사진{" "}
            <span className="ml-1 tabular-nums text-[var(--color-ink-900)]">
              {thumbs.length}장
            </span>
          </p>
        </div>

        <div className="relative mt-3">
          {/* arrow 버튼 */}
          <button
            type="button"
            onClick={prev}
            disabled={activeIdx === 0}
            aria-label="이전 사진"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-ink-700)] shadow-[var(--shadow-card)] transition-all duration-[var(--duration-sm)] ease-out hover:scale-105 hover:bg-[var(--color-ink-50)] hover:text-[var(--color-ink-900)] disabled:opacity-0"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={activeIdx === thumbs.length - 1}
            aria-label="다음 사진"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-ink-700)] shadow-[var(--shadow-card)] transition-all duration-[var(--duration-sm)] ease-out hover:scale-105 hover:bg-[var(--color-ink-50)] hover:text-[var(--color-ink-900)] disabled:opacity-0"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>

          {/* track — native scroll-snap (swipe 자연 호환) */}
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="사진 슬라이드"
          >
            {thumbs.map((src, idx) => (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => handleClick(idx)}
                aria-label={`${alt} ${idx + 1}번 크게 보기`}
                aria-roledescription="slide"
                className="group relative aspect-[4/3] h-60 shrink-0 snap-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-ink-100)] outline-none transition-all duration-[var(--duration-sm)] ease-out hover:border-[var(--color-ink-900)] focus-visible:border-[var(--color-ink-900)] focus-visible:shadow-[0_0_0_3px_rgba(15,23,42,0.15)] sm:h-[360px] md:h-[400px]"
                style={{
                  width: "min(80%, 480px)",
                }}
              >
                <Image
                  src={src}
                  alt={`${alt} ${idx + 1}`}
                  fill
                  sizes="(min-width: 1024px) 60vw, (min-width: 640px) 70vw, 80vw"
                  className="object-cover transition-transform duration-[var(--duration-md)] ease-out group-hover:scale-105"
                  onError={() => handleError(idx)}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[var(--color-ink-900)]/0 transition-all duration-[var(--duration-sm)] ease-out group-hover:bg-[var(--color-ink-900)]/20 group-focus-visible:bg-[var(--color-ink-900)]/20"
                />
              </button>
            ))}
          </div>

          {/* dots indicator */}
          <div
            role="tablist"
            aria-label="사진 슬라이드 페이지"
            className="mt-3 flex items-center justify-center gap-2"
          >
            {thumbs.map((_, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`사진 ${idx + 1} 으로 이동`}
                  onClick={() => scrollToIdx(idx)}
                  className="group inline-flex h-6 w-6 items-center justify-center"
                >
                  <span
                    className={`inline-block rounded-full transition-all duration-[var(--duration-sm)] ${
                      isActive
                        ? "h-2 w-6 bg-[var(--color-ink-900)]"
                        : "h-2 w-2 bg-[var(--color-ink-300)] group-hover:bg-[var(--color-ink-700)]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
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
