"use client";

import { useCallback, useEffect, useState } from "react";
import { Camera, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface PhotoItem {
  seq: number;
  url: string;
  caption: string;
  categoryCode: string;
}

/**
 * 온디맨드 사진 갤러리.
 * "사진 보기" 버튼 클릭 → /api/court-listings/{docid}/photos → 썸네일 그리드 + Lightbox.
 */
export function PhotoGallery({ docid }: { docid: string }) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  async function fetchPhotos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/court-listings/${docid}/photos`);
      const json = (await res.json()) as {
        photos: PhotoItem[];
        error?: string;
      };
      if (json.error && json.photos.length === 0) {
        setError(json.error);
      }
      setPhotos(json.photos);
      setLoaded(true);
    } catch {
      setError("사진을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  // 키보드 네비게이션
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

  // 아직 로드하지 않은 상태 — 버튼만 표시
  if (!loaded && !loading) {
    return (
      <button
        type="button"
        onClick={fetchPhotos}
        className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-brand-200 bg-white px-4 py-2.5 text-xs font-bold text-brand-600 transition hover:bg-brand-50"
      >
        <Camera size={14} aria-hidden="true" />
        사진 보기
      </button>
    );
  }

  // 로딩 중
  if (loading) {
    return (
      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-ink-500)]">
        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        사진을 불러오는 중입니다... (3~5초 소요)
      </div>
    );
  }

  // 에러 (사진 없음 포함)
  if (error || photos.length === 0) {
    return (
      <p className="mt-4 text-xs text-[var(--color-ink-500)]">
        {error ?? "이 물건에 등록된 사진이 없습니다."}
      </p>
    );
  }

  return (
    <>
      {/* 썸네일 그리드 */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {photos.map((photo, idx) => (
          <button
            key={photo.seq}
            type="button"
            onClick={() => setLightboxIdx(idx)}
            className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] transition hover:border-brand-400"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.caption}
              loading="lazy"
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
            <span className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-[10px] text-white">
              {photo.caption}
            </span>
          </button>
        ))}
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
              alt={photos[lightboxIdx].caption}
              className="max-h-[85vh] max-w-full rounded-[var(--radius-lg)] object-contain"
            />
            <p className="mt-2 text-center text-sm text-white/80">
              {photos[lightboxIdx].caption} ({lightboxIdx + 1}/{photos.length})
            </p>
          </div>

          {/* 닫기 */}
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40"
            aria-label="닫기"
          >
            <X size={20} />
          </button>

          {/* 이전 */}
          {photos.length > 1 && (
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
          )}

          {/* 다음 */}
          {photos.length > 1 && (
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
          )}
        </div>
      )}
    </>
  );
}
