"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import type { ApplyFormData, ApplyBidInfo } from "@/types/apply";
import { formatPhone } from "@/lib/apply";
import { formatKoreanWon } from "@/lib/utils";
import { FeeCalculator } from "../FeeCalculator";
import { PhoneVerifyModal } from "../PhoneVerifyModal";
import { VerifiedBadge } from "../VerifiedBadge";
import type { PhoneVerifyResult } from "@/lib/auth/phoneVerify";

export function Step2BidInfo({
  data,
  onBidInfoChange,
  onVerified,
  onNext,
  onBack,
}: {
  data: ApplyFormData;
  onBidInfoChange: (patch: Partial<ApplyBidInfo>) => void;
  onVerified: (result: PhoneVerifyResult, verifiedName: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Step2 mount 시 미인증이면 모달 자동 오픈. verified=true면 처음부터 닫힘.
  // 인증 후 닫힌 모달은 "본인인증 시작하기" 버튼으로 재오픈 가능 (verified=false인 경우).
  const [verifyModalOpen, setVerifyModalOpen] = useState(!data.verified);
  const bid = data.bidInfo;
  const inputsDisabled = !data.verified;

  function handleVerified(result: PhoneVerifyResult, verifiedName: string) {
    onVerified(result, verifiedName);
    setVerifyModalOpen(false);
    // 인증 시 입력한 이름을 신청인 이름에도 자동 채움 (수정 가능)
    if (!bid.applicantName.trim()) {
      onBidInfoChange({ applicantName: verifiedName });
    }
  }
  const bidAmountNum = Number(bid.bidAmount.replace(/[^\d]/g, "")) || 0;
  const minPrice = data.matchedPost?.minPrice ?? 0;
  const belowMin =
    data.matchedPost !== null && bidAmountNum > 0 && bidAmountNum < minPrice;

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!bid.bidAmount.trim() || bidAmountNum <= 0)
      next.bidAmount = "입찰 희망 금액을 입력해주세요.";
    if (!bid.applicantName.trim()) next.applicantName = "성함을 입력해주세요.";
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(bid.phone))
      next.phone = "010-0000-0000 형식으로 입력해주세요.";
    if (!/^\d{6}$/.test(bid.ssnFront))
      next.ssnFront = "주민등록번호 앞 6자리를 숫자로 입력해주세요.";
    if (!/^\d{7}$/.test(bid.ssnBack))
      next.ssnBack = "주민등록번호 뒷 7자리를 숫자로 입력해주세요.";
    if (bid.jointBidding) {
      if (!bid.jointApplicantName.trim())
        next.jointApplicantName = "공동입찰인 이름을 입력해주세요.";
      if (!/^\d{3}-\d{3,4}-\d{4}$/.test(bid.jointApplicantPhone))
        next.jointApplicantPhone = "공동입찰인 연락처를 입력해주세요.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  function inputClass(key: string) {
    return `h-12 w-full rounded-[var(--radius-md)] border bg-white px-4 text-base text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] ${
      errors[key]
        ? "border-[var(--color-accent-red)]"
        : "border-[var(--color-border)]"
    }`;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-wider text-brand-600">
            Step 2
          </p>
          <VerifiedBadge verified={data.verified} verifiedName={data.verifiedName} />
        </div>
        <div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
            입찰 정보를 입력해주세요
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
            입찰 희망 금액과 신청인 정보는 위임 서류 작성에 사용됩니다.
            입력하신 정보는 암호화되어 전달되며 접수 외 용도로 사용되지 않습니다.
          </p>
        </div>
        {!data.verified && (
          <button
            type="button"
            onClick={() => setVerifyModalOpen(true)}
            className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-md)] border border-brand-600 bg-brand-50 px-4 py-2 text-xs font-bold text-brand-700 hover:bg-brand-100"
          >
            본인인증 시작하기
          </button>
        )}
      </header>

      <fieldset
        disabled={inputsDisabled}
        className="grid gap-6 disabled:opacity-60 lg:grid-cols-[1.2fr_1fr]"
      >
        <div className="flex flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          {/* 입찰 금액 */}
          <div>
            <label
              htmlFor="bid-amount"
              className="mb-2 block text-sm font-black text-[var(--color-ink-900)]"
            >
              입찰 희망 금액 <span className="text-[var(--color-accent-red)]">*</span>
            </label>
            <div className="relative">
              <input
                id="bid-amount"
                type="text"
                inputMode="numeric"
                placeholder={
                  minPrice > 0
                    ? `최저가 ${minPrice.toLocaleString("ko-KR")}원 이상`
                    : "원 단위로 입력"
                }
                value={bid.bidAmount}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^\d]/g, "");
                  onBidInfoChange({
                    bidAmount: cleaned ? Number(cleaned).toLocaleString("ko-KR") : "",
                  });
                }}
                className={`${inputClass("bidAmount")} pr-12 tabular-nums`}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-ink-500)]">
                원
              </span>
            </div>
            {bidAmountNum > 0 && (
              <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                한글 표기: {formatKoreanWon(bidAmountNum)}
              </p>
            )}
            {belowMin && (
              <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-accent-red)]">
                <AlertCircle size={12} aria-hidden="true" />
                최저가 미만의 입찰은 무효 처리됩니다.
              </p>
            )}
            {errors.bidAmount && (
              <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                {errors.bidAmount}
              </p>
            )}
          </div>

          {/* 신청인 */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="applicant-name"
                className="mb-2 block text-sm font-black text-[var(--color-ink-900)]"
              >
                성함 <span className="text-[var(--color-accent-red)]">*</span>
              </label>
              <input
                id="applicant-name"
                type="text"
                placeholder="홍길동"
                value={bid.applicantName}
                onChange={(e) => onBidInfoChange({ applicantName: e.target.value })}
                className={inputClass("applicantName")}
              />
              {errors.applicantName && (
                <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                  {errors.applicantName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="applicant-phone"
                className="mb-2 block text-sm font-black text-[var(--color-ink-900)]"
              >
                연락처 <span className="text-[var(--color-accent-red)]">*</span>
              </label>
              <input
                id="applicant-phone"
                type="tel"
                inputMode="tel"
                placeholder="010-0000-0000"
                value={bid.phone}
                onChange={(e) =>
                  onBidInfoChange({ phone: formatPhone(e.target.value) })
                }
                className={inputClass("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* 주민번호 13자리 (앞 6 + 뒷 7) */}
          <div>
            <label className="mb-2 block text-sm font-black text-[var(--color-ink-900)]">
              주민등록번호 <span className="text-[var(--color-accent-red)]">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="applicant-ssn-front"
                aria-label="주민등록번호 앞 6자리"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={bid.ssnFront}
                onChange={(e) =>
                  onBidInfoChange({
                    ssnFront: e.target.value.replace(/\D/g, "").slice(0, 6),
                  })
                }
                className={`${inputClass("ssnFront")} tabular-nums`}
              />
              <span aria-hidden="true" className="text-[var(--color-ink-500)]">
                -
              </span>
              <input
                id="applicant-ssn-back"
                aria-label="주민등록번호 뒷 7자리"
                type="password"
                inputMode="numeric"
                maxLength={7}
                placeholder="0000000"
                value={bid.ssnBack}
                onChange={(e) =>
                  onBidInfoChange({
                    ssnBack: e.target.value.replace(/\D/g, "").slice(0, 7),
                  })
                }
                className={`${inputClass("ssnBack")} tabular-nums`}
                autoComplete="off"
              />
            </div>
            <p className="mt-1 text-xs text-[var(--color-ink-500)]">
              위임장 PDF 작성에만 사용됩니다. 뒷 7자리는 DB에 저장되지 않으며,
              PDF 생성 직후 메모리에서 즉시 폐기됩니다.
            </p>
            {(errors.ssnFront || errors.ssnBack) && (
              <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                {errors.ssnFront ?? errors.ssnBack}
              </p>
            )}
          </div>

          {/* 재경매 물건 여부 */}
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={bid.rebid}
                onChange={(e) =>
                  onBidInfoChange({ rebid: e.target.checked })
                }
                className="mt-0.5 h-5 w-5 rounded border-[var(--color-border)] accent-brand-600"
              />
              <div>
                <span className="text-sm font-bold text-[var(--color-ink-900)]">
                  재경매 물건 (보증금 20%)
                </span>
                <p className="mt-0.5 text-xs leading-5 text-[var(--color-ink-500)]">
                  법원이 지정한 재경매(대금미납 이력) 사건인 경우 체크하세요.
                  보증금이 감정가의 20%로 계산됩니다. 잘 모르시면 체크하지
                  말고 접수 후 확인 시 안내받으시면 됩니다.
                </p>
              </div>
            </label>
          </div>

          {/* 공동입찰 */}
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={bid.jointBidding}
                onChange={(e) =>
                  onBidInfoChange({ jointBidding: e.target.checked })
                }
                className="h-5 w-5 rounded border-[var(--color-border)] accent-brand-600"
              />
              <span className="text-sm font-bold text-[var(--color-ink-900)]">
                공동입찰로 진행합니다
              </span>
            </label>
            {bid.jointBidding && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="joint-name"
                    className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
                  >
                    공동입찰인 성함
                  </label>
                  <input
                    id="joint-name"
                    type="text"
                    value={bid.jointApplicantName}
                    onChange={(e) =>
                      onBidInfoChange({ jointApplicantName: e.target.value })
                    }
                    className={`${inputClass("jointApplicantName")} h-11 text-sm`}
                  />
                  {errors.jointApplicantName && (
                    <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                      {errors.jointApplicantName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="joint-phone"
                    className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
                  >
                    공동입찰인 연락처
                  </label>
                  <input
                    id="joint-phone"
                    type="tel"
                    value={bid.jointApplicantPhone}
                    onChange={(e) =>
                      onBidInfoChange({
                        jointApplicantPhone: formatPhone(e.target.value),
                      })
                    }
                    className={`${inputClass("jointApplicantPhone")} h-11 text-sm`}
                  />
                  {errors.jointApplicantPhone && (
                    <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                      {errors.jointApplicantPhone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside>
          <FeeCalculator fm={data.matchedPost} bidAmount={bidAmountNum} />
        </aside>
      </fieldset>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          이전
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={inputsDisabled}
          className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-6 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-[var(--color-ink-300)] disabled:shadow-none"
        >
          다음: 서류 업로드
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      {verifyModalOpen && (
        <PhoneVerifyModal
          initialName={bid.applicantName}
          initialSsnFront={bid.ssnFront}
          onVerified={handleVerified}
          onClose={() => setVerifyModalOpen(false)}
        />
      )}
    </div>
  );
}
