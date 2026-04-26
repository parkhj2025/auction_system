"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * 사진 라이트박스 — 의존성 추가 0 자체 구현.
 *  - mode="sequence": 좌우 이동 + 카운터 + 키보드 ←→
 *  - mode="single":   단독 표시 (좌우 이동 0)
 *  - 공통: ESC / X 버튼 / 배경 클릭 닫기, body scroll lock
 *
 * open=true 일 때만 Inner mount → idx state initial=startIndex 보장.
 * (open false→true 전환 시 fresh state, set-state-in-effect 회피)
 */
export function Lightbox({
  open,
  onClose,
  photos,
  startIndex = 0,
  mode = "sequence",
  alt = "사진",
}: {
  open: boolean;
  onClose: () => void;
  photos: string[];
  startIndex?: number;
  mode?: "sequence" | "single";
  alt?: string;
}) {
  if (!open) return null;
  return (
    <LightboxInner
      onClose={onClose}
      photos={photos}
      startIndex={startIndex}
      mode={mode}
      alt={alt}
    />
  );
}

function LightboxInner({
  onClose,
  photos,
  startIndex,
  mode,
  alt,
}: {
  onClose: () => void;
  photos: string[];
  startIndex: number;
  mode: "sequence" | "single";
  alt: string;
}) {
  const [idx, setIdx] = useState(startIndex);
  const total = photos.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (mode === "sequence" && total > 1) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setIdx((i) => (i - 1 + total) % total);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          setIdx((i) => (i + 1) % total);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [total, onClose, mode]);

  if (total === 0) return null;

  const safeIdx = Math.min(Math.max(idx, 0), total - 1);
  const src = photos[safeIdx];
  const showNav = mode === "sequence" && total > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X size={20} aria-hidden="true" />
      </button>

      <div
        className="relative max-h-[90vh] max-w-[92vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={`${alt} ${safeIdx + 1}`}
          width={1600}
          height={1600}
          sizes="92vw"
          className="h-auto max-h-[90vh] w-auto max-w-[92vw] object-contain"
          unoptimized
        />
      </div>

      {showNav ? (
        <>
          <button
            type="button"
            aria-label="이전 사진"
            onClick={(e) => {
              e.stopPropagation();
              setIdx((i) => (i - 1 + total) % total);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="다음 사진"
            onClick={(e) => {
              e.stopPropagation();
              setIdx((i) => (i + 1) % total);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={24} aria-hidden="true" />
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold tabular-nums text-white">
            {safeIdx + 1} / {total}
          </span>
        </>
      ) : null}
    </div>
  );
}
