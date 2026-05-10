"use client";

import { useEffect } from "react";

/**
 * cycle 1-D-A-4-3 보강 1 정정 2 — 입찰 금액 확인 모달.
 *
 * 강제 모달 paradigm 정수 (ConfirmCaseModal paradigm 광역 정합):
 * - backdrop click 닫기 = 영구 폐기 (사용자 광역 행동 강제 paradigm)
 * - ESC 키 닫기 = 영구 폐기
 * - "확인" CTA = 다음 step 진입 paradigm
 * - "수정" CTA = modal 닫힘 + bidAmount 광역 보존 paradigm
 *
 * 흐름 paradigm:
 * - Step2 다음 CTA click → 검증 정합 사후 → modal pop
 * - 사용자 광역 = 입찰 금액 정확값 + 한글 표기 광역 인지 paradigm
 * - "확인" → setStep(3) / "수정" → modal 닫힘 + Step2 머무름
 */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  truncatedAmount: number;
  koreanAmount: string;
}

export function BidConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  truncatedAmount,
  koreanAmount,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      // 강제 모달 paradigm 정수 = ESC 닫기 영구 폐기.
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
      aria-labelledby="bid-confirm-modal-title"
    >
      <div className="mx-auto w-full max-w-[480px] rounded-2xl bg-white p-6">
        <h3
          id="bid-confirm-modal-title"
          className="text-lg font-black text-[var(--color-ink-900)]"
        >
          입찰 금액을 확인해주세요
        </h3>
        <div className="mt-4 space-y-2.5 text-base leading-7 text-[var(--color-ink-700)]">
          <p>
            <strong className="text-2xl font-black tabular-nums text-[var(--color-ink-900)]">
              {truncatedAmount.toLocaleString("ko-KR")}원
            </strong>
          </p>
          <p className="text-sm text-[var(--color-ink-500)]">
            한글 표기: {koreanAmount}
          </p>
          <p className="pt-1">위 금액으로 입찰합니다.</p>
          <p>천원 이하 단위는 자동으로 정리됩니다.</p>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="mt-6 inline-flex h-[var(--cta-h-app)] w-full items-center justify-center rounded-xl bg-[var(--brand-green)] text-base font-black text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
        >
          확인
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 inline-flex h-[var(--cta-h-app)] w-full items-center justify-center rounded-xl bg-transparent text-base font-bold text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-ink-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-300)]"
        >
          수정
        </button>
      </div>
    </div>
  );
}
