"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  FileText,
  PenLine,
  RotateCcw,
} from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import { DelegationPreviewModal } from "../DelegationPreviewModal";
import { SignatureModal } from "../SignatureModal";
import { PrivacyPreviewModal } from "../PrivacyPreviewModal";
import { TermsPreviewModal } from "../TermsPreviewModal";
import { computeFee } from "@/lib/apply";
import { cn, formatKoreanWon } from "@/lib/utils";

/**
 * cycle 1-D-A-4-5 광역 재구성 paradigm:
 * - 직전 cycle 1-D-A-4-4 inline ContractAgreement paradigm 회수 → modal 안 view paradigm 회복.
 * - "위임장 내용 보기" button → DelegationPreviewModal trigger (정보 모달 / max-w-720).
 * - 마지막 동의 자동 pop paradigm 회수 → "✍ 서명하기" button click 단독 trigger paradigm.
 * - 서명 사후 preview 카드 (image + "다시 서명" button).
 * - 다음 CTA = "다음: 결제 →" (Step5Payment 진입 paradigm 정합).
 */

type AgreementKey = "agreedDelegation" | "agreedPrivacy" | "agreedTerms";

type Props = {
  data: ApplyFormData;
  onSignatureChange: (dataUrl: string | null) => void;
  onAgreementChange: (key: AgreementKey, value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
};

function maskSsnFront(v: string) {
  if (!v) return "";
  return `${v.slice(0, 2)}****`;
}

export function Step4Confirm({
  data,
  onSignatureChange,
  onAgreementChange,
  onNext,
  onBack,
}: Props) {
  const [delegationOpen, setDelegationOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [signatureOpen, setSignatureOpen] = useState(false);

  const bid = data.bidInfo;
  const bidAmount = Number(bid.bidAmount.replace(/[^\d]/g, "")) || 0;
  const allAgreed =
    data.agreedDelegation && data.agreedPrivacy && data.agreedTerms;
  const hasSignature = !!data.signature;
  const canProceed = allAgreed && hasSignature;
  const canSign = data.agreedDelegation;

  const fee = data.bidDate ? computeFee(data.bidDate) : null;

  function handleSignatureConfirm(dataUrl: string) {
    onSignatureChange(dataUrl);
    setSignatureOpen(false);
  }

  function handleSignatureCancel() {
    setSignatureOpen(false);
  }

  function handleResign() {
    onSignatureChange(null);
    setSignatureOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-black leading-[1.2] tracking-[-0.015em] text-[var(--color-ink-900)]">
          위임 계약을 확인하고 서명해주세요
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
          위임장 내용을 확인하시고, 동의 후 서명해주세요. 서명은 위임장에 그대로 담깁니다.
        </p>
      </header>

      {/* 입찰 정보 요약 (압축 paradigm) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
          신청 정보 요약
        </h3>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm">
          <div>
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">법원 · 사건번호</dt>
            <dd className="mt-1 text-base font-bold tabular-nums text-[var(--color-ink-900)]">
              {data.court} · {data.caseNumber}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">매각기일</dt>
            <dd className="mt-1 text-base font-bold tabular-nums text-[var(--color-ink-900)]">
              {data.bidDate || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">입찰 희망 금액</dt>
            <dd className="mt-1 text-base font-black tabular-nums text-[var(--color-accent-red)]">
              {bidAmount > 0 ? formatKoreanWon(bidAmount) : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">신청인</dt>
            <dd className="mt-1 text-base font-bold text-[var(--color-ink-900)]">
              {bid.applicantName} · {maskSsnFront(bid.ssnFront)}
            </dd>
          </div>
        </dl>
      </div>

      {/* 위임장 미리보기 button (DelegationPreviewModal trigger) */}
      <button
        type="button"
        onClick={() => setDelegationOpen(true)}
        className="inline-flex h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-ink-900)] bg-white text-base font-bold text-[var(--color-ink-900)] transition-colors duration-150 hover:bg-[var(--color-ink-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
      >
        <FileText size={18} aria-hidden="true" />
        위임장 내용 보기
      </button>

      {/* 동의 + 서명 카드 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
          위임 동의
        </h3>
        <ul className="mt-4 flex flex-col gap-3.5">
          <li className="flex items-start gap-2.5">
            <input
              id="agree-delegation"
              type="checkbox"
              checked={data.agreedDelegation}
              onChange={(e) =>
                onAgreementChange("agreedDelegation", e.target.checked)
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
              onChange={(e) => onAgreementChange("agreedPrivacy", e.target.checked)}
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
              onChange={(e) => onAgreementChange("agreedTerms", e.target.checked)}
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

        {/* 서명 영역 (체크박스 1번 enable gate) */}
        <div className="mt-5 border-t border-[var(--color-ink-200)] pt-5">
          {!hasSignature ? (
            <button
              type="button"
              onClick={() => setSignatureOpen(true)}
              disabled={!canSign}
              className={cn(
                "inline-flex h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl text-base font-black transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]",
                canSign
                  ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
                  : "cursor-not-allowed bg-gray-200 text-gray-400",
              )}
              aria-label="서명하기"
            >
              <PenLine size={18} aria-hidden="true" />
              서명하기
            </button>
          ) : (
            <div>
              <p className="mb-2.5 text-sm font-bold text-[var(--color-ink-900)]">
                서명 완료
              </p>
              <div className="relative flex h-20 items-center justify-center overflow-hidden rounded-md border border-[var(--color-ink-900)] bg-white">
                <Image
                  src={data.signature ?? ""}
                  alt="입찰의뢰인 서명"
                  width={400}
                  height={80}
                  unoptimized
                  className="h-full w-auto object-contain"
                />
              </div>
              <button
                type="button"
                onClick={handleResign}
                className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] hover:underline"
              >
                <RotateCcw size={14} aria-hidden="true" />
                다시 서명
              </button>
            </div>
          )}
          {!canSign && !hasSignature && (
            <p className="mt-2.5 flex items-center gap-1.5 text-xs text-[var(--color-ink-500)]">
              <AlertCircle size={12} aria-hidden="true" />
              위임 계약 동의 후 서명할 수 있습니다.
            </p>
          )}
        </div>

        {/* 수수료 inline (Step2 차용 paradigm) */}
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

      <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-5 text-base font-bold text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-ink-100)] sm:w-auto"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl px-8 text-base font-black transition-colors duration-150 sm:w-auto sm:px-10",
            canProceed
              ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          )}
        >
          다음: 결제
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      <DelegationPreviewModal
        isOpen={delegationOpen}
        onClose={() => setDelegationOpen(false)}
        data={data}
      />

      {signatureOpen && (
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
