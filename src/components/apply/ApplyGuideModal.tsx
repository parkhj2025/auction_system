"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/* Stage 2 cycle 1-A 보강 2 — 신청 가이드 modal.
 * paradigm = PhoneVerifyModal 정합 (fixed inset-0 + bg-black/50 + p-4 + dismiss).
 * ApplyStepIndicator 안 도움말 버튼 클릭 trigger. */

const STEPS = [
  {
    title: "물건 확인",
    body: "사건번호로 입찰할 물건을 확인합니다.",
  },
  {
    title: "입찰 정보",
    body: "입찰가와 신청인 정보를 입력합니다.",
  },
  {
    title: "서류 업로드",
    body: "전자본인서명확인서와 신분증을 업로드합니다.",
  },
  {
    title: "확인·제출",
    body: "수수료를 확인하고 제출합니다.",
  },
  {
    title: "접수 완료",
    body: "보증금 송금 안내를 받습니다.",
  },
] as const;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyGuideModal({ isOpen, onClose }: Props) {
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
      aria-labelledby="apply-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors duration-150 hover:bg-gray-100 hover:text-[#111418] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <h2
          id="apply-guide-title"
          className="text-[20px] font-extrabold tracking-tight text-[#111418] sm:text-[24px]"
        >
          신청 가이드
        </h2>
        <p className="mt-2 text-[14px] text-gray-500 sm:text-[15px]">
          5단계로 끝나는 웹 접수 흐름입니다.
        </p>

        <ol className="mt-6 flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111418] text-[13px] font-bold text-white"
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-[#111418]">
                  {step.title}
                </p>
                <p className="mt-0.5 text-[13px] leading-5 text-gray-500 sm:text-[14px]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-md)] bg-[#111418] text-sm font-bold text-white transition-colors duration-150 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
        >
          확인
        </button>
      </div>
    </div>
  );
}
