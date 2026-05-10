"use client";

import { useEffect } from "react";

/**
 * cycle 1-D-A-4-2 보강 1 — 사건 정보 이중 확인 modal.
 *
 * 흐름:
 * - Step1Property 체크박스 click (unchecked → checked) → setIsOpen(true)
 * - "확인" click = onConfirm() (Step2 자동 진입 / caseConfirmedByUser 보존)
 * - "취소" click = onCancel() (checked 회복 + Step1 머무름)
 * - backdrop click 닫기 = 영구 폐기 (확인/취소 단독 진입 강제)
 * - ESC 키 닫기 = 영구 폐기 (동일 paradigm)
 *
 * 본문 ul 3 항목 = footer inline ul 영구 폐기 사후 광역 이전.
 */
interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmCaseModal({ isOpen, onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      // ESC 차단 paradigm (확인/취소 단독 진입 강제)
      if (e.key === "Escape") {
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-case-modal-title"
    >
      <div className="mx-auto w-full max-w-[480px] rounded-2xl bg-white p-6">
        <h3
          id="confirm-case-modal-title"
          className="text-lg font-black text-[var(--color-ink-900)]"
        >
          사건 정보를 확인해주세요
        </h3>
        <div className="mt-4 space-y-2.5 text-base leading-7 text-[var(--color-ink-700)]">
          <p>입찰 전 사건 정보를 한 번 더 확인해주세요.</p>
          <p>정보 오류로 인한 책임은 부담하지 않습니다.</p>
          <p>입찰가는 만원 단위로만 입력 가능합니다.</p>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="mt-6 inline-flex h-[var(--cta-h-app)] w-full items-center justify-center rounded-xl bg-[var(--brand-green)] text-base font-black text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
        >
          확인
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 inline-flex h-[var(--cta-h-app)] w-full items-center justify-center rounded-xl bg-transparent text-base font-bold text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-ink-50)]"
        >
          취소
        </button>
      </div>
    </div>
  );
}
