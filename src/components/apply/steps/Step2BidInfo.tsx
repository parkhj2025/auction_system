"use client";

// cycle 1-D-A-2 = 모바일 앱 form 토큰 광역 + minPrice fallback (matchedListing) + belowMin enforcement.
import { useState } from "react";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import type { ApplyFormData, ApplyBidInfo } from "@/types/apply";
import { formatPhone } from "@/lib/apply";
import { cn, formatKoreanWon } from "@/lib/utils";
import { FeeCalculatorInline } from "../FeeCalculator";
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
  // 상위 ApplyClient.handleVerified는 기존 2인자 (result, name) 시그니처 유지.
  // phone prefill은 handleVerified 내부에서 bid state 직접 업데이트.
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
  const hasErrors = Object.keys(errors).length > 0;

  // Phase 6.4 회귀 수정: 입력 필드 → 에러 메시지 ID 매핑 (handleNext scrollIntoView 대상).
  const ERROR_FIELD_TO_ID: Record<string, string> = {
    bidAmount: "bid-amount",
    applicantName: "applicant-name",
    phone: "applicant-phone",
    ssnFront: "applicant-ssn-front",
    ssnBack: "applicant-ssn-back",
    jointApplicantName: "joint-name",
    jointApplicantPhone: "joint-phone",
  };

  function clearError(key: string) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleVerified(
    result: PhoneVerifyResult,
    verifiedName: string,
    verifiedPhone: string,
  ) {
    onVerified(result, verifiedName);
    setVerifyModalOpen(false);
    // Phase 6.7.6: 이름 + 전화번호 모두 prefill (빈 상태일 때만 — 사용자가 본인인증 전
    // 이미 수동 입력한 값은 덮어쓰지 않음). formatPhone 재적용 불필요 — modal state는
    // 이미 "010-1234-5678" 포맷.
    const patch: Partial<ApplyBidInfo> = {};
    if (!bid.applicantName.trim()) patch.applicantName = verifiedName;
    if (!bid.phone.trim()) patch.phone = verifiedPhone;
    if (Object.keys(patch).length > 0) onBidInfoChange(patch);
  }
  const bidAmountNum = Number(bid.bidAmount.replace(/[^\d]/g, "")) || 0;
  // cycle 1-D-A-2: matchedListing.min_bid_amount fallback + matchedPost 보조.
  const minPrice =
    data.matchedListing?.min_bid_amount ??
    data.matchedPost?.minPrice ??
    0;
  const hasMinPrice =
    data.matchedListing !== null || data.matchedPost !== null;
  const belowMin = hasMinPrice && bidAmountNum > 0 && bidAmountNum < minPrice;

  function validate(): { ok: boolean; errors: Record<string, string> } {
    const next: Record<string, string> = {};
    if (!bid.bidAmount.trim() || bidAmountNum <= 0)
      next.bidAmount = "입찰 희망 금액을 입력해주세요.";
    // cycle 1-D-A-2: 최저가 미만 입찰 enforcement (단순 안내 → 차단).
    else if (belowMin)
      next.bidAmount = `최저가(${minPrice.toLocaleString("ko-KR")}원) 이상으로 입력해주세요.`;
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
    return { ok: Object.keys(next).length === 0, errors: next };
  }

  function handleNext() {
    const result = validate();
    if (result.ok) {
      onNext();
      return;
    }
    // Phase 6.4 회귀 수정: 첫 에러 필드로 scrollIntoView + focus.
    // hasErrors disabled 게이트가 1차 방어, 본 scrollTo는 사용자가 어디 막혔는지 즉시 안내.
    const firstKey = Object.keys(result.errors)[0];
    const elementId = ERROR_FIELD_TO_ID[firstKey];
    if (elementId && typeof document !== "undefined") {
      const el = document.getElementById(elementId);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    }
  }

  function inputClass(key: string) {
    // cycle 1-D-A-2: input height = var(--input-h-app) (56px / 모바일 앱 표준).
    const base =
      "h-[var(--input-h-app)] w-full rounded-[var(--radius-md)] border bg-white px-4 text-[length:var(--text-body)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] transition-colors duration-150 focus:outline-none";
    return errors[key]
      ? `${base} border-[var(--color-accent-red)] ring-2 ring-[var(--color-accent-red)]/20`
      : `${base} border-[var(--color-border)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20`;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
            입찰 정보를 입력해주세요
          </h2>
          <VerifiedBadge verified={data.verified} verifiedName={data.verifiedName} />
        </div>
        <p className="text-sm leading-6 text-[var(--color-ink-500)]">
          입찰 희망 금액과 신청인 정보는 위임 서류 작성에 사용됩니다.
          입력하신 정보는 암호화되어 전달되며 접수 외 용도로 사용되지 않습니다.
        </p>
        {!data.verified && (
          <button
            type="button"
            onClick={() => setVerifyModalOpen(true)}
            className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-ink-900)] bg-[var(--color-ink-50)] px-4 py-2 text-xs font-bold text-[var(--color-ink-900)] hover:bg-[var(--color-ink-100)]"
          >
            본인인증 시작하기
          </button>
        )}
      </header>

      <fieldset
        disabled={inputsDisabled}
        className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-5 disabled:opacity-60 lg:p-8"
      >
          {/* 입찰 금액 */}
          <div>
            <label
              htmlFor="bid-amount"
              className="mb-2.5 block text-[var(--label-fs-app)] font-bold text-[var(--color-ink-900)]"
            >
              입찰 희망 금액 <span className="text-[var(--color-accent-red)]">*</span>
            </label>
            <div className="relative">
              <input
                id="bid-amount"
                type="text"
                inputMode="numeric"
                placeholder={
                  hasMinPrice && minPrice > 0
                    ? `최저가 ${minPrice.toLocaleString("ko-KR")}원 이상`
                    : "원 단위로 입력"
                }
                value={bid.bidAmount}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^\d]/g, "");
                  onBidInfoChange({
                    bidAmount: cleaned ? Number(cleaned).toLocaleString("ko-KR") : "",
                  });
                  clearError("bidAmount");
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="applicant-name"
                className="mb-2.5 block text-[var(--label-fs-app)] font-bold text-[var(--color-ink-900)]"
              >
                성함 <span className="text-[var(--color-accent-red)]">*</span>
              </label>
              <input
                id="applicant-name"
                type="text"
                placeholder="홍길동"
                value={bid.applicantName}
                onChange={(e) => {
                  onBidInfoChange({ applicantName: e.target.value });
                  clearError("applicantName");
                }}
                className={inputClass("applicantName")}
              />
              {data.verified && bid.applicantName.trim() && (
                <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                  본인인증 완료 정보로 자동 입력됨
                </p>
              )}
              {errors.applicantName && (
                <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                  {errors.applicantName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="applicant-phone"
                className="mb-2.5 block text-[var(--label-fs-app)] font-bold text-[var(--color-ink-900)]"
              >
                연락처 <span className="text-[var(--color-accent-red)]">*</span>
              </label>
              <input
                id="applicant-phone"
                type="tel"
                inputMode="tel"
                placeholder="휴대폰번호를 입력해주세요"
                value={bid.phone}
                onChange={(e) => {
                  onBidInfoChange({ phone: formatPhone(e.target.value) });
                  clearError("phone");
                }}
                className={inputClass("phone")}
              />
              {data.verified && bid.phone.trim() && (
                <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                  본인인증 완료 정보로 자동 입력됨
                </p>
              )}
              {errors.phone && (
                <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* 주민번호 13자리 (앞 6 + 뒷 7) */}
          <div>
            <label className="mb-2.5 block text-[var(--label-fs-app)] font-bold text-[var(--color-ink-900)]">
              주민등록번호 <span className="text-[var(--color-accent-red)]">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="applicant-ssn-front"
                aria-label="주민등록번호 앞 6자리"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="앞 6자리"
                value={bid.ssnFront}
                onChange={(e) => {
                  onBidInfoChange({
                    ssnFront: e.target.value.replace(/\D/g, "").slice(0, 6),
                  });
                  clearError("ssnFront");
                }}
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
                placeholder="뒷 7자리"
                value={bid.ssnBack}
                onChange={(e) => {
                  onBidInfoChange({
                    ssnBack: e.target.value.replace(/\D/g, "").slice(0, 7),
                  });
                  clearError("ssnBack");
                }}
                className={`${inputClass("ssnBack")} tabular-nums`}
                autoComplete="off"
              />
            </div>
            <p className="mt-1 text-xs text-[var(--color-ink-500)]">
              위임장 작성에만 사용됩니다. 뒷 7자리는 저장되지 않으며, 서류 발급
              직후 즉시 폐기됩니다.
            </p>
            {(errors.ssnFront || errors.ssnBack) && (
              <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                {errors.ssnFront ?? errors.ssnBack}
              </p>
            )}
          </div>

          {/* 재경매 물건 여부 */}
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={bid.rebid}
                onChange={(e) =>
                  onBidInfoChange({ rebid: e.target.checked })
                }
                className="mt-0.5 h-5 w-5 rounded border-[var(--color-border)] accent-[var(--color-ink-900)]"
              />
              <div>
                <span className="text-sm font-bold text-[var(--color-ink-900)]">
                  재경매 물건 (보증금 20%)
                </span>
                <p className="mt-0.5 text-xs leading-5 text-[var(--color-ink-500)]">
                  재경매(대금 미납 이력) 사건이면 체크해주세요. 보증금이 감정가의
                  20%로 적용됩니다. 확실하지 않다면 비워두셔도 접수 후 확인하여
                  안내드립니다.
                </p>
              </div>
            </label>
          </div>

          {/* 공동입찰 */}
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={bid.jointBidding}
                onChange={(e) =>
                  onBidInfoChange({ jointBidding: e.target.checked })
                }
                className="h-5 w-5 rounded border-[var(--color-border)] accent-[var(--color-ink-900)]"
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
                    className="mb-2.5 block text-[var(--label-fs-app)] font-bold text-[var(--color-ink-900)]"
                  >
                    공동입찰인 성함
                  </label>
                  <input
                    id="joint-name"
                    type="text"
                    value={bid.jointApplicantName}
                    onChange={(e) => {
                      onBidInfoChange({ jointApplicantName: e.target.value });
                      clearError("jointApplicantName");
                    }}
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
                    className="mb-2.5 block text-[var(--label-fs-app)] font-bold text-[var(--color-ink-900)]"
                  >
                    공동입찰인 연락처
                  </label>
                  <input
                    id="joint-phone"
                    type="tel"
                    value={bid.jointApplicantPhone}
                    onChange={(e) => {
                      onBidInfoChange({
                        jointApplicantPhone: formatPhone(e.target.value),
                      });
                      clearError("jointApplicantPhone");
                    }}
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

          <FeeCalculatorInline fm={data.matchedPost} />
      </fieldset>

      <div className="flex items-center justify-between gap-2 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[var(--cta-h-app)] items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          이전
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={inputsDisabled || hasErrors}
          className={cn(
            "inline-flex min-h-[var(--cta-h-app)] items-center gap-2 rounded-full px-6 text-sm font-black transition-colors duration-150",
            !inputsDisabled && !hasErrors
              ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)]"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          )}
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
