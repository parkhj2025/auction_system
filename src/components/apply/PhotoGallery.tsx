"use client";

import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface PhotoItem {
  seq: number;
  url: string;
  caption: string;
  categoryCode: string;
}

/**
 * 인라인 사진 갤러리.
 * cycle 1-D-A-4-2: variant props 추가.
 *   - "grid" (default): 4col aspect-square 광역 (사이드바 320px 영역 / 4장 단독 + "+N" 안내)
 *   - "hero": hero 1장 (4:3) + thumbnail strip 3장 + "+N" 타일 (모바일 인라인 카드 영역)
 *   - 양 variant 광역 = 클릭 시 lightbox 광역 동일 paradigm.
 */
export function PhotoGallery({
  docid,
  variant = "grid",
}: {
  docid: string;
  variant?: "grid" | "hero";
}) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/court-listings/${docid}/photos`);
        const json = (await res.json()) as { photos: PhotoItem[] };
        if (!cancelled) setPhotos(json.photos ?? []);
      } catch {
        /* 사진 로드 실패 — 무시 (텍스트 정보는 유지) */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [docid]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft")
        setLightboxIdx((i) =>
          i !== null ? (i - 1 + photos.length) % photos.length : null,
        );
      if (e.key === "ArrowRight")
        setLightboxIdx((i) =>
          i !== null ? (i + 1) % photos.length : null,
        );
    },
    [lightboxIdx, photos.length],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-ink-500)]">
        <Loader2 size={12} className="animate-spin" aria-hidden="true" />
        사진 로딩 중...
      </div>
    );
  }

  if (photos.length === 0) return null;

  return (
    <>
      {variant === "hero" ? (
        <HeroLayout
          photos={photos}
          onSelect={(idx) => setLightboxIdx(idx)}
        />
      ) : (
        <GridLayout
          photos={photos}
          onSelect={(idx) => setLightboxIdx(idx)}
        />
      )}

      {/* Lightbox (양 variant 공통) */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxIdx(null)}
          role="dialog"
          aria-modal="true"
          aria-label="사진 상세보기"
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightboxIdx].url}
              alt={`물건 사진 ${lightboxIdx + 1}`}
              className="max-h-[85vh] max-w-full rounded-[var(--radius-lg)] object-contain"
            />
            <p className="mt-2 text-center text-sm text-white/80">
              {lightboxIdx + 1} / {photos.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white transition-colors duration-150 hover:bg-white/40"
            aria-label="닫기"
          >
            <X size={20} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(
                    (lightboxIdx - 1 + photos.length) % photos.length,
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition-colors duration-150 hover:bg-white/40"
                aria-label="이전 사진"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx((lightboxIdx + 1) % photos.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition-colors duration-150 hover:bg-white/40"
                aria-label="다음 사진"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

/** 데스크탑 사이드바 광역 = 4col aspect-square + 4장 단독 + "+N장 더보기" 안내. */
function GridLayout({
  photos,
  onSelect,
}: {
  photos: PhotoItem[];
  onSelect: (idx: number) => void;
}) {
  const visible = photos.slice(0, 4);
  const remaining = Math.max(0, photos.length - 4);

  return (
    <>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {visible.map((photo, idx) => (
          <button
            key={photo.seq}
            type="button"
            onClick={() => onSelect(idx)}
            className="group aspect-square overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] transition-colors duration-150 hover:border-[var(--color-ink-700)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={`물건 사진 ${idx + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      {remaining > 0 && (
        <p className="mt-1.5 text-[11px] text-gray-500">
          +{remaining}장 더보기 (사진 클릭 시 전체 보기)
        </p>
      )}
    </>
  );
}

/** 모바일 인라인 카드 광역 = hero 1장 (4:3) + thumbnail strip 3장 + "+N" 타일 paradigm. */
function HeroLayout({
  photos,
  onSelect,
}: {
  photos: PhotoItem[];
  onSelect: (idx: number) => void;
}) {
  const hero = photos[0];
  const stripPhotos = photos.slice(1, 4);
  const remaining = Math.max(0, photos.length - 4);
  const hasStrip = stripPhotos.length > 0 || remaining > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => onSelect(0)}
        className="mt-4 block w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] transition-colors duration-150 hover:border-[var(--color-ink-700)]"
        aria-label="사진 1 크게 보기"
      >
        <div className="aspect-[4/3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.url}
            alt="물건 대표 사진"
            className="h-full w-full object-cover"
          />
        </div>
      </button>
      {hasStrip && (
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {stripPhotos.map((photo, idx) => (
            <button
              key={photo.seq}
              type="button"
              onClick={() => onSelect(idx + 1)}
              className="group aspect-square overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] transition-colors duration-150 hover:border-[var(--color-ink-700)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={`물건 사진 ${idx + 2}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
              />
            </button>
          ))}
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => onSelect(4)}
              className="aspect-square overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-ink-100)] text-sm font-bold text-[var(--color-ink-700)] transition-colors duration-150 hover:border-[var(--color-ink-700)]"
              aria-label={`나머지 ${remaining}장 보기`}
            >
              +{remaining}
            </button>
          )}
        </div>
      )}
    </>
  );
}
