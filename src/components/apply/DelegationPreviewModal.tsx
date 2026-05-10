"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import { ContractAgreement } from "./ContractAgreement";

/**
 * cycle 1-D-A-4-5 회수 — 위임 계약서 미리보기 정보 모달.
 *
 * 직전 cycle 1-D-A-4-4 = 폐기 → cycle 1-D-A-4-5 = 회수 + repurpose paradigm:
 * - body = ContractAgreement (serif + bordered table + professional 정수)
 * - 이전 PDFKit fetch + iframe paradigm 회수 (HTML render 단독 / 신규 npm 영역 0)
 *
 * 정보 모달 paradigm 정수 (영구 룰 §31 정합):
 * - backdrop click 닫기 = OK
 * - ESC 키 닫기 = OK
 * - "닫기" CTA 단독 (취소·확인 분기 영역 0)
 *
 * 시각 토큰:
 * - max-w-[720px] (위임장 PDF aspect 정합 / Step3 IssueGuideModal 480 대비 ↑)
 * - rounded-2xl + p-6 + bg-white
 * - body = max-h overflow-y-auto + 자체 scroll
 */

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: ApplyFormData;
}

export function DelegationPreviewModal({ isOpen, onClose, data }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delegation-preview-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h3
            id="delegation-preview-title"
            className="text-lg font-black text-[var(--color-ink-900)]"
          >
            매수신청 대리 이용 계약서
          </h3>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-ink-500)] transition-colors duration-150 hover:bg-[var(--color-ink-100)] hover:text-[var(--color-ink-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <ContractAgreement data={data} />
        </div>

        <footer className="border-t border-gray-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-[var(--cta-h-app)] w-full items-center justify-center rounded-xl bg-[var(--brand-green)] text-base font-black text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
          >
            닫기
          </button>
        </footer>
      </div>
    </div>
  );
}
