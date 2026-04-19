"use client";

import { useEffect, useMemo, useRef } from "react";
import { ArrowLeft, FileText, Send, Info } from "lucide-react";
import { AGENT_SEAL_PENDING_NOTICE } from "@/lib/legal";

/**
 * 클라이언트 pdf-lib로 생성된 위임장 PDF의 최종 확인 모달 (Phase 6.5-POST 작업 4).
 *
 * 흐름: Step4Confirm "최종 확인" → 클라이언트 PDF 생성 → 본 모달 → "이 PDF로 제출" → 서버 재생성
 *
 * - iframe + blob URL로 PDF 시각 노출 (브라우저 내장 PDF 뷰어)
 * - "수정"(좌)으로 Step4 복귀 / "이 PDF로 제출"(우)로 실제 submit
 * - 제출 중 (submitting): 두 버튼 disabled, Esc/배경 dismiss 차단
 * - 하단 배너: AGENT_SEAL_PENDING_NOTICE (legal.ts 단일 소스)
 *
 * 보안: 본 모달의 PDF blob은 미리보기 전용. Storage 저장 PDF는 onConfirm 호출 시
 * 서버가 동일 데이터로 재생성한다 (PDF 바이너리는 서버로 전송하지 않음).
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
          <FileText
            size={18}
            aria-hidden="true"
            className="text-brand-600"
          />
          <h2
            id="pdf-preview-title"
            className="text-base font-black text-[var(--color-ink-900)]"
          >
            최종 PDF 확인
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
            <ArrowLeft size={16} aria-hidden="true" />
            수정
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting || !pdfBytes}
            className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-6 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-[var(--color-ink-300)] disabled:shadow-none"
          >
            {submitting ? "제출 중..." : "이 PDF로 제출"}
            {!submitting && <Send size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}
