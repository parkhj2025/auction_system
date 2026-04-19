"use client";

import { useEffect, useMemo, useRef } from "react";
import { Check, X, Info } from "lucide-react";
import { AGENT_SEAL_PENDING_NOTICE } from "@/lib/legal";

/**
 * 위임장 PDF 미리보기 모달 (Phase 6.5-POST-FIX, 2026-04-19).
 *
 * 흐름: Step4Confirm 동의 체크박스 클릭 → /api/preview-delegation POST → 본 모달 →
 *       "확인" → 동의 체크박스 ON / "취소" → 체크박스 OFF
 *
 * - iframe + blob URL로 서버 생성 PDF 시각 노출 (브라우저 내장 PDF 뷰어)
 * - "취소"(좌) = 동의 보류 (체크박스 미체크 유지) / "확인"(우) = 위임장 내용 동의 확정
 * - 하단 배너: AGENT_SEAL_PENDING_NOTICE (legal.ts 단일 소스)
 *
 * 보안: PDF는 서버 PDFKit 단일 소스 생성. 본 모달은 시각 확인 + 동의 확정 게이트.
 * Storage 저장은 별도 /api/orders/[id]/generate-delegation에서 수행 (제출 시점).
 */
interface Props {
  pdfBytes: Uint8Array | null;
  onConfirm: () => void;
  onCancel: () => void;
  submitting: boolean;
}

export function PDFPreviewModal({
  pdfBytes,
  onConfirm,
  onCancel,
  submitting,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // pdfBytes로부터 blob URL을 useMemo로 계산하고, cleanup만 useEffect에서 처리.
  // React 19 react-hooks/set-state-in-effect 회피.
  const blobUrl = useMemo(() => {
    if (!pdfBytes) return null;
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  }, [pdfBytes]);

  useEffect(() => {
    if (!blobUrl) return;
    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      // 제출 중이 아닐 때만 Esc로 닫기 허용 (수정 경로)
      if (e.key === "Escape" && !submitting) {
        onCancel();
      } else if (e.key === "Escape") {
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel, submitting]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => {
        // 제출 중 배경 dismiss 차단 + 정상 시에는 배경 클릭으로 수정 경로
        if (!submitting) onCancel();
      }}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lift)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-6 py-4">
          <h2
            id="pdf-preview-title"
            className="text-base font-black text-[var(--color-ink-900)]"
          >
            위임장 내용 확인
          </h2>
        </div>

        <div className="flex-1 overflow-hidden bg-[var(--color-surface-muted)]">
          {blobUrl ? (
            <iframe
              src={blobUrl}
              title="위임장 PDF 최종 확인"
              className="h-full w-full border-0"
              style={{ minHeight: "60vh" }}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-sm text-[var(--color-ink-500)]">
              PDF 생성 중...
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 border-t border-[var(--color-border)] bg-slate-50 px-6 py-3">
          <Info
            size={14}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-slate-500"
          />
          <p className="text-xs leading-5 text-slate-700">
            {AGENT_SEAL_PENDING_NOTICE}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] bg-white px-6 py-4">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={16} aria-hidden="true" />
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting || !pdfBytes}
            className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-6 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-[var(--color-ink-300)] disabled:shadow-none"
          >
            확인
            <Check size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
