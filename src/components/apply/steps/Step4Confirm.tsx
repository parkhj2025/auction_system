"use client";

import { useState } from "react";
import { ArrowLeft, AlertCircle, FileText, Send } from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import { ContractAgreement } from "../ContractAgreement";
import { SignatureModal } from "../SignatureModal";
import { PrivacyPreviewModal } from "../PrivacyPreviewModal";
import { TermsPreviewModal } from "../TermsPreviewModal";
import { computeFee } from "@/lib/apply";
import { cn, formatKoreanWon } from "@/lib/utils";

/**
 * cycle 1-D-A-4-4 광역 재구성 paradigm:
 * - ContractAgreement (formal 5조) + 동의 카드 + 수수료 inline (Step2 차용) + CTA 단순화.
 * - 위임 정보 요약 / 위임인 서명 별도 카드 영구 폐기 (ContractAgreement 안 흡수 정수).
 * - 마지막 동의 체크박스 click → SignatureModal 자동 pop paradigm (강제 모달).
 * - "취소" 시점 = lastCheckedAgreement 단독 회복 paradigm + 서명 image 회수.
 * - DelegationPreviewModal + PDFPreviewModal + /api/preview-delegation route 광역 폐기 정합.
 */

type AgreementKey = "agreedDelegation" | "agreedPrivacy" | "agreedTerms";

export function Step4Confirm({
  data,
  onSignatureChange,
  onAgreementChange,
  onSubmit,
  onBack,
  submitting,
  submitError,
}: {
  data: ApplyFormData;
  onSignatureChange: (dataUrl: string | null) => void;
  onAgreementChange: (key: AgreementKey, value: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  // cycle 1-D-A-4-4: 마지막 click된 동의 체크박스 추적 paradigm.
  // SignatureModal "취소" 시점 = 직전 체크박스 단독 정확 회복 paradigm 정수.
  const [lastCheckedAgreement, setLastCheckedAgreement] =
    useState<AgreementKey | null>(null);

  const allAgreed =
    data.agreedDelegation && data.agreedPrivacy && data.agreedTerms;
  const hasSignature = !!data.signature;
  const canSubmit = hasSignature && allAgreed && !submitting;

  // 수수료 inline (Step2 차용 paradigm).
  const fee = data.bidDate ? computeFee(data.bidDate) : null;

  function handleAgreementClick(key: AgreementKey, nextValue: boolean) {
    onAgreementChange(key, nextValue);
    if (!nextValue) return;
    // 광역 동의 정합 시점 trigger (key === 마지막 click 광역).
    const willAllAgree =
      (key === "agreedDelegation" || data.agreedDelegation) &&
      (key === "agreedPrivacy" || data.agreedPrivacy) &&
      (key === "agreedTerms" || data.agreedTerms);
    if (willAllAgree && !hasSignature) {
      setLastCheckedAgreement(key);
      setSignatureModalOpen(true);
    }
  }

  function handleSignatureCancel() {
    setSignatureModalOpen(false);
    if (lastCheckedAgreement) {
      onAgreementChange(lastCheckedAgreement, false);
      setLastCheckedAgreement(null);
    }
    // 서명 image 회수 paradigm (사용자 prompt 정수).
    onSignatureChange(null);
  }

  function handleSignatureConfirm(dataUrl: string) {
    onSignatureChange(dataUrl);
    setSignatureModalOpen(false);
    setLastCheckedAgreement(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-black leading-[1.2] tracking-[-0.015em] text-[var(--color-ink-900)]">
          위임 계약 내용을 확인하고 서명해주세요
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-500)]">
          아래 매수신청 대리 이용 계약서 내용을 확인하시고, 동의 후 서명해주세요. 서명은 위임장 입찰의뢰인 자리에 그대로 담깁니다.
        </p>
      </header>

      <ContractAgreement data={data} signatureDataUrl={data.signature} />

      {/* 동의 카드 + 수수료 inline */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-black text-[var(--color-ink-900)]">
          위임 동의
        </h3>
        <ul className="mt-4 flex flex-col gap-3">
          <li className="flex items-start gap-2.5">
            <input
              id="agree-delegation"
              type="checkbox"
              checked={data.agreedDelegation}
              onChange={(e) =>
                handleAgreementClick("agreedDelegation", e.target.checked)
              }
              className="mt-1.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--brand-green)]"
            />
            <label
              htmlFor="agree-delegation"
              className="flex-1 cursor-pointer text-[var(--label-fs-app)] font-bold leading-7 text-[var(--color-ink-900)]"
            >
              위 위임 계약 내용을 확인하였으며, 매수신청 대리를 위임합니다.
            </label>
          </li>
          <li className="flex items-start gap-2.5">
            <input
              id="agree-privacy"
              type="checkbox"
              checked={data.agreedPrivacy}
              onChange={(e) =>
                handleAgreementClick("agreedPrivacy", e.target.checked)
              }
              className="mt-1.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--brand-green)]"
            />
            <label
              htmlFor="agree-privacy"
              className="flex-1 cursor-pointer text-[var(--label-fs-app)] font-bold leading-7 text-[var(--color-ink-900)]"
            >
              개인정보 처리방침에 동의합니다.
              <button
                type="button"
                onClick={() => setPrivacyOpen(true)}
                className="ml-2 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-ink-500)] underline-offset-2 hover:underline"
              >
                <FileText size={12} aria-hidden="true" />
                내용 보기
              </button>
            </label>
          </li>
          <li className="flex items-start gap-2.5">
            <input
              id="agree-terms"
              type="checkbox"
              checked={data.agreedTerms}
              onChange={(e) =>
                handleAgreementClick("agreedTerms", e.target.checked)
              }
              className="mt-1.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--brand-green)]"
            />
            <label
              htmlFor="agree-terms"
              className="flex-1 cursor-pointer text-[var(--label-fs-app)] font-bold leading-7 text-[var(--color-ink-900)]"
            >
              서비스 이용약관에 동의합니다.
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="ml-2 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-ink-500)] underline-offset-2 hover:underline"
              >
                <FileText size={12} aria-hidden="true" />
                내용 보기
              </button>
            </label>
          </li>
        </ul>
        {fee && (
          <div className="mt-5 border-t border-[var(--color-ink-200)] pt-4">
            <div className="text-sm font-medium text-[var(--color-ink-500)]">
              입찰대리 수수료
            </div>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-lg font-bold text-[var(--color-ink-900)]">
                {formatKoreanWon(fee.baseFee)}
              </span>
              <span className="text-lg font-bold text-[var(--color-ink-500)]">
                낙찰 시 성공보수 +5만원
              </span>
            </div>
            <p className="mt-1.5 text-xs text-[var(--color-ink-500)]">
              {fee.tierLabel} · 입찰일까지 {Math.max(0, fee.daysUntilBid)}일 남음
            </p>
          </div>
        )}
      </div>

      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-accent-red)] bg-[var(--color-accent-red-soft)] px-5 py-4 text-sm text-[var(--color-accent-red)]"
        >
          <AlertCircle
            size={16}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          {submitError}
        </div>
      )}

      <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-5 text-base font-bold text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-ink-100)] disabled:opacity-50 sm:w-auto"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          이전
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={cn(
            "inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl px-8 text-base font-black transition-colors duration-150 sm:w-auto sm:px-10",
            canSubmit
              ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          )}
        >
          {submitting ? "제출 중..." : "신청 제출"}
          {!submitting && <Send size={16} aria-hidden="true" />}
        </button>
      </div>

      {signatureModalOpen && (
        <SignatureModal
          onCancel={handleSignatureCancel}
          onConfirm={handleSignatureConfirm}
        />
      )}

      <PrivacyPreviewModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />
      <TermsPreviewModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
      />
    </div>
  );
}
