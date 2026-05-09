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
 * 마운트 시 자동 fetch → 4장 한 줄 썸네일 → 클릭 시 Lightbox.
 * 캡션 없음. 버튼 없음.
 */
export function PhotoGallery({ docid }: { docid: string }) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // 마운트 시 자동 fetch
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

  // Lightbox 키보드
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft")
        setLightboxIdx((i) =>
          i !== null ? (i - 1 + photos.length) % photos.length : null
        );
      if (e.key === "ArrowRight")
        setLightboxIdx((i) =>
          i !== null ? (i + 1) % photos.length : null
        );
    },
    [lightboxIdx, photos.length]
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
      {/* 4장 한 줄 썸네일 */}
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {photos.map((photo, idx) => (
          <button
            key={photo.seq}
            type="button"
            onClick={() => setLightboxIdx(idx)}
            className="group aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] transition hover:border-[var(--color-ink-700)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={`물건 사진 ${idx + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-gray-500">
        사진 출처: 대법원 경매정보
      </p>

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
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40"
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
                    (lightboxIdx - 1 + photos.length) % photos.length
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40"
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
