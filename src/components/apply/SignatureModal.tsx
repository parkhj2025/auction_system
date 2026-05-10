"use client";

import { useEffect, useState } from "react";
import { SignatureCanvas } from "./SignatureCanvas";
import { cn } from "@/lib/utils";

/**
 * cycle 1-D-A-4-4 신규 — 서명 강제 모달.
 *
 * 강제 모달 paradigm 정수 (영구 룰 §31 정합 / ConfirmCaseModal·BidConfirmModal 광역 정합):
 * - backdrop click 닫기 = 영구 폐기
 * - ESC 키 닫기 = 영구 폐기
 * - "취소" CTA = modal 닫힘 + 마지막 체크박스 unchecked + 서명 image 회수 (Step4Confirm handleSignatureCancel)
 * - "서명 완료" CTA = signatureDataUrl 회수 + 위임장 자리 image 표기 + modal 닫힘
 *
 * 흐름 paradigm:
 * - Step4 마지막 동의 체크박스 click → 광역 동의 정합 시점 → modal pop
 * - 사용자 서명 → "서명 완료" → onConfirm(dataUrl)
 * - 또는 "취소" → onCancel (직전 체크박스 unchecked 회복)
 *
 * mount paradigm (lint rule react-hooks/set-state-in-effect 정합):
 * - 부모 (Step4Confirm) = `{signatureModalOpen && <SignatureModal ... />}` 조건부 mount
 * - 매 open = fresh component mount = canvas + state 광역 자동 초기화 paradigm
 *
 * disabled gate paradigm:
 * - 서명 영역 비어있음 시점 = "서명 완료" CTA disabled (bg-gray-200 text-gray-400 cursor-not-allowed)
 * - 서명 정합 시점 = "서명 완료" CTA enable (brand-green)
 */

interface Props {
  onCancel: () => void;
  onConfirm: (signatureDataUrl: string) => void;
}

export function SignatureModal({ onCancel, onConfirm }: Props) {
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  function handleConfirm() {
    if (!signatureDataUrl) return;
    onConfirm(signatureDataUrl);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signature-modal-title"
    >
      <div className="mx-auto w-full max-w-[480px] rounded-2xl bg-white p-6">
        <h3
          id="signature-modal-title"
          className="text-lg font-black text-[var(--color-ink-900)]"
        >
          서명을 진행해주세요
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-700)]">
          마우스 또는 손가락으로 아래 영역에 서명해주세요. 서명은 위임장
          입찰의뢰인 자리에 그대로 인쇄됩니다.
        </p>
        <div className="mt-4">
          <SignatureCanvas
            onChange={setSignatureDataUrl}
            heightClass="h-48"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-[var(--cta-h-app)] flex-1 items-center justify-center rounded-xl bg-transparent text-base font-bold text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-ink-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-300)]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!signatureDataUrl}
            className={cn(
              "inline-flex h-[var(--cta-h-app)] flex-1 items-center justify-center rounded-xl text-base font-black transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]",
              signatureDataUrl
                ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
                : "cursor-not-allowed bg-gray-200 text-gray-400",
            )}
          >
            서명 완료
          </button>
        </div>
      </div>
    </div>
  );
}
