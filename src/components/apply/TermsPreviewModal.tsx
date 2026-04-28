"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";
import { TermsContent } from "@/components/legal/TermsContent";

/**
 * 서비스 이용약관 모달 — Step4Confirm 동의 라벨에서 호출 (Phase 6.5-POST 작업 7).
 * /terms 페이지와 동일한 TermsContent 컴포넌트 소비 (단일 소스).
 */
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsPreviewModal({ isOpen, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lift)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2
            id="terms-preview-title"
            className="text-[length:var(--text-body)] font-black text-[var(--color-ink-900)]"
          >
            서비스 이용약관
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="legal-body flex flex-col gap-10 text-[var(--color-ink-700)]">
            <TermsContent />
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-3">
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-ink-900)] underline-offset-2 hover:underline"
          >
            <ExternalLink size={12} aria-hidden="true" />
            전체 페이지로 보기 (새 탭)
          </Link>
        </div>
      </div>
    </div>
  );
}
