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
 * cycle 1-D-A-4-2 paradigm 회수: hero+strip paradigm 영구 폐기 → 4-col 동등 grid 단독 paradigm.
 *   - 모바일 + 데스크탑 광역 동일 paradigm (§A-9 + §A-12 정합).
 *   - 4장 광역 단독 표시 (5+ 사진 = 마지막 thumbnail "+N" overlay paradigm).
 *   - 클릭 시 lightbox 광역 전체 사진 영역 보존.
 *   - variant props 영구 폐기.
 */
export function PhotoGallery({ docid }: { docid: string }) {
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

  // 4장 단독 표시 (5+ = 마지막 thumbnail "+N" overlay paradigm).
  const visible = photos.slice(0, 4);
  const remaining = Math.max(0, photos.length - 4);
  const lastIdx = visible.length - 1;

  return (
    <>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {visible.map((photo, idx) => {
          const isLastWithRemaining = idx === lastIdx && remaining > 0;
          return (
            <button
              key={photo.seq}
              type="button"
              onClick={() => setLightboxIdx(idx)}
              className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-[var(--color-surface-muted)] transition-colors duration-150 hover:border-[var(--color-ink-700)]"
              aria-label={`물건 사진 ${idx + 1}${isLastWithRemaining ? ` (+${remaining}장 더)` : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={`물건 사진 ${idx + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
              />
              {isLastWithRemaining && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-base font-bold text-white">
                  +{remaining}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
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
