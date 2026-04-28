"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask } from "pdfjs-dist";
import { Check, X, Info } from "lucide-react";
import { AGENT_SEAL_PENDING_NOTICE } from "@/lib/legal";

/**
 * 위임장 PDF 미리보기 모달 (Phase 6.7.5, 2026-04-20).
 *
 * 흐름: Step4Confirm 동의 체크박스 클릭 → /api/preview-delegation POST → 본 모달 →
 *       "확인" → 동의 체크박스 ON / "취소" → 체크박스 OFF
 *
 * Phase 6.7.5 변경: iframe + blob URL 방식 폐기 → pdfjs-dist canvas 렌더.
 * Android Chrome이 iframe PDF 인라인 렌더 미지원(Chromium issue 40668174 외)이라
 * 폰에서 "열기" 버튼만 보이고 무반응하던 증상 해소. 데스크톱/Android/iOS 동일 UX.
 *
 * - pdfjs-dist 5.x dynamic import로 worker 번들 분리 (Step4 진입 시 lazy load)
 * - Worker URL: Next.js static import (new URL(..., import.meta.url))
 * - 1페이지 고정 렌더 (위임장 1페이지 전제, 확장 시 Phase 6.7.6 별도 작업)
 * - devicePixelRatio 대응으로 모바일 고해상도 렌더
 * - touch-action: pan-y (수직 스크롤만 허용, pinch-zoom 미지원)
 *
 * 보안: PDF는 서버 PDFKit 단일 소스 생성. pdfjs는 렌더 전용 → Lessons Learned [A]
 * 이중 엔진 원칙 위반 아님. Storage 저장은 /api/orders/[id]/generate-delegation.
 */
interface Props {
  pdfBytes: Uint8Array | null;
  onConfirm: () => void;
  onCancel: () => void;
  submitting: boolean;
}

type RenderState = "loading" | "rendered" | "error";

export function PDFPreviewModal({
  pdfBytes,
  onConfirm,
  onCancel,
  submitting,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderState, setRenderState] = useState<RenderState>("loading");

  useEffect(() => {
    if (!pdfBytes) {
      setRenderState("loading");
      return;
    }

    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;

    (async () => {
      try {
        setRenderState("loading");
        // Phase 6.7.5: legacy build for Samsung Internet compatibility.
        // standard build (pdfjs-dist/build/*) uses Uint8Array.prototype.toHex()
        // which is ES 2025 proposal, not shipped in Samsung Internet (Chromium v138).
        // Legacy build transpiles to ES5 target and avoids new APIs.
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const workerUrl = new URL(
          "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
          import.meta.url,
        );
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl.toString();

        const data = new Uint8Array(pdfBytes);
        loadingTask = pdfjs.getDocument({ data });
        const pdfDoc = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdfDoc.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas 2d context unavailable");
        ctx.scale(dpr, dpr);

        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        if (cancelled) return;

        setRenderState("rendered");
      } catch (err) {
        console.error("[PDFPreviewModal] render failed", err);
        if (!cancelled) setRenderState("error");
      }
    })();

    return () => {
      cancelled = true;
      if (loadingTask) {
        loadingTask.destroy().catch(() => {});
      }
    };
  }, [pdfBytes]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
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
            className="text-[length:var(--text-body)] font-black text-[var(--color-ink-900)]"
          >
            위임장 내용 확인
          </h2>
        </div>

        <div
          className="flex-1 overflow-auto bg-[var(--color-surface-muted)]"
          style={{ touchAction: "pan-y", minHeight: "60vh" }}
        >
          {renderState === "loading" && (
            <div className="flex h-full items-center justify-center p-8 text-sm text-[var(--color-ink-500)]">
              PDF 생성 중...
            </div>
          )}
          {renderState === "error" && (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-[var(--color-accent-red)]">
              미리보기를 불러오지 못했습니다. 취소 후 다시 시도해주세요.
            </div>
          )}
          <div
            className="justify-center p-4"
            style={{ display: renderState === "rendered" ? "flex" : "none" }}
          >
            <canvas ref={canvasRef} className="max-w-full" />
          </div>
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
            className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-6 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-black disabled:cursor-not-allowed disabled:bg-[var(--color-ink-300)] disabled:shadow-none"
          >
            확인
            <Check size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
