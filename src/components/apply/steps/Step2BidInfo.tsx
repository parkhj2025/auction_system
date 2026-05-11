"use client";

// cycle 1-D-A-2 = 모바일 앱 form 토큰 + minPrice fallback (matchedListing) + belowMin enforcement.
// cycle 1-D-A-4-2 = PhoneVerifyModal + VerifiedBadge + verifyModalOpen + inputsDisabled + handleVerified 광역 영구 폐기 (form fields 보존 / cycle 1-D-B 영역 정합).
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, AlertCircle, Check, HelpCircle } from "lucide-react";
import type { ApplyFormData, ApplyBidInfo } from "@/types/apply";
import { computeFee, formatPhone } from "@/lib/apply";
import { cn, formatKoreanWon, truncateBidAmount } from "@/lib/utils";
import { BidConfirmModal } from "../BidConfirmModal";

export function Step2BidInfo({
  data,
  onBidInfoChange,
  onBidConfirmedChange,
  onNext,
  onBack,
}: {
  data: ApplyFormData;
  onBidInfoChange: (patch: Partial<ApplyBidInfo>) => void;
  onBidConfirmedChange: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  // cycle 1-D-A-4-3 보강 1 정정: attemptedNext state 광역 = 다음 CTA click 시점 단독 검증 paradigm.
  // mount 시점 + onChange 시점 + onBlur 시점 = error 광역 표시 영역 0 paradigm.
  const [attemptedNext, setAttemptedNext] = useState(false);
  // cycle 1-D-A-4-3 보강 1 정정 2: BidConfirmModal pop paradigm (강제 모달 정수).
  const [bidConfirmOpen, setBidConfirmOpen] = useState(false);
  // cycle 1-D-A-4-7 정정: bidConfirmed = ApplyClient drilling paradigm (data.bidConfirmed read 단독).
  // 직전 cycle = useState internal → Step navigation 회귀 시점 false 회귀 NG 식별 → ApplyClient drilling 보존 paradigm.
  const bidConfirmed = data.bidConfirmed;
  const setBidConfirmed = onBidConfirmedChange;
  const bid = data.bidInfo;
  const hasErrors = Object.keys(errors).length > 0;
  const showErrors = attemptedNext;

  // cycle 1-D-A-4-2 보강 2: 재경매 ? icon → tooltip on-demand paradigm.
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tooltipOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setTooltipOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tooltipOpen]);

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

  const bidAmountNum = Number(bid.bidAmount.replace(/[^\d]/g, "")) || 0;
  // cycle 1-D-A-4: matchedListing.min_bid_amount 단독 (matchedPost 광역 폐기 정합).
  const minPrice = data.matchedListing?.min_bid_amount ?? 0;
  const hasMinPrice = data.matchedListing != null;
  const belowMin = hasMinPrice && bidAmountNum > 0 && bidAmountNum < minPrice;

  // 수수료 inline 압축 paradigm (FeeCalculatorInline dom 영구 폐기 / 토스 송금 결과 footer paradigm 정합).
  const bidDate = data.matchedListing?.bid_date ?? null;
  const fee = bidDate ? computeFee(bidDate) : null;

  function validate(amountNum: number = bidAmountNum): { ok: boolean; errors: Record<string, string> } {
    const next: Record<string, string> = {};
    // cycle 1-D-A-4-3 보강 1 정정: amountNum 광역 props = 다음 CTA click 시점 truncate 사후 값 광역 검증 paradigm.
    const isBelowMin = hasMinPrice && amountNum > 0 && amountNum < minPrice;
    if (amountNum <= 0)
      next.bidAmount = "입찰 희망 금액을 입력해주세요.";
    else if (isBelowMin)
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

  // cycle 1-D-A-4-3 보강 1 정정 4: "입찰가 확정" CTA → bidAmount 단독 검증 + modal pop paradigm.
  // 다음 CTA logic 분리 정수 = modal pop logic 영역 0 + setStep 즉시 진입 단독 paradigm.
  function handleConfirmBid() {
    setAttemptedNext(true);
    const truncated = truncateBidAmount(bidAmountNum);
    const isBelowMin = hasMinPrice && truncated > 0 && truncated < minPrice;
    if (truncated <= 0 || isBelowMin) {
      setErrors((prev) => ({
        ...prev,
        bidAmount:
          truncated <= 0
            ? "입찰 희망 금액을 입력해주세요."
            : `최저가(${minPrice.toLocaleString("ko-KR")}원) 이상으로 입력해주세요.`,
      }));
      if (typeof document !== "undefined") {
        const el = document.getElementById("bid-amount");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus();
      }
      return;
    }
    setBidConfirmOpen(true);
  }

  function handleNext() {
    // cycle 1-D-A-4-3 보강 1 정정 4: 다음 CTA = 모든 form validate + bidConfirmed === true → onNext() 즉시 paradigm.
    // BidConfirmModal pop logic 영역 0 = "입찰가 확정" CTA 단독 trigger paradigm.
    setAttemptedNext(true);
    const result = validate(bidAmountNum);
    if (result.ok && bidConfirmed) {
      onNext();
      return;
    }
    if (!result.ok) {
      const firstKey = Object.keys(result.errors)[0];
      const elementId = ERROR_FIELD_TO_ID[firstKey];
      if (elementId && typeof document !== "undefined") {
        const el = document.getElementById(elementId);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus();
      }
    }
  }

  // cycle 1-D-A-4-3 보강 1 정정 4: BidConfirmModal handler paradigm.
  // "확인" click → bidAmount truncate 갱신 + setBidConfirmed(true) + modal 닫힘 + Step2 머무름 paradigm.
  // 사용자 광역 다음 CTA 시점 = setStep(3) 즉시 진입 (modal pop 0).
  function handleBidConfirm() {
    const truncated = truncateBidAmount(bidAmountNum);
    const truncatedStr = truncated > 0 ? truncated.toLocaleString("ko-KR") : "";
    if (truncatedStr !== bid.bidAmount) {
      onBidInfoChange({ bidAmount: truncatedStr });
    }
    setBidConfirmed(true);
    setBidConfirmOpen(false);
  }

  function handleBidCancel() {
    // bidAmount 광역 보존 (사용자 광역 수정 paradigm).
    setBidConfirmOpen(false);
  }

  function inputClass(key: string) {
    // cycle 1-D-A-2: input height = var(--input-h-app) (56px / 모바일 앱 표준).
    // cycle 1-D-A-4-3 보강 1 정정: showErrors 분기 = attemptedNext 시점 단독 error border paradigm.
    const base =
      "h-[var(--input-h-app)] w-full rounded-[var(--radius-md)] border bg-white px-4 text-[length:var(--text-body)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] transition-colors duration-150 focus:outline-none";
    return showErrors && errors[key]
      ? `${base} border-[var(--color-accent-red)] ring-2 ring-[var(--color-accent-red)]/20`
      : `${base} border-[var(--color-border)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20`;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h2 className="text-2xl font-black leading-[1.2] tracking-[-0.015em] text-[var(--color-ink-900)]">
          입찰 정보를 입력해주세요
        </h2>
        <p className="text-sm leading-6 text-[var(--color-ink-500)]">
          위임 서류 작성에 필요한 정보입니다
        </p>
      </header>

      <fieldset
        className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-5"
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
                  // cycle 1-D-A-4-3 보강 1 정정: onChange = raw 보관 단독 (사용자 입력 시각 보존).
                  // truncate paradigm = "입찰가 확정" CTA click 시점 단독 (handleConfirmBid → modal "확인" → handleBidConfirm 광역).
                  // cycle 1-D-A-4-3 보강 1 정정 4: bidConfirmed = false 자동 회귀 paradigm (사용자 광역 갱신 시점 재확인 의무).
                  const cleaned = e.target.value.replace(/[^\d]/g, "");
                  const num = parseInt(cleaned, 10) || 0;
                  onBidInfoChange({
                    bidAmount: num > 0 ? num.toLocaleString("ko-KR") : "",
                  });
                  setBidConfirmed(false);
                  clearError("bidAmount");
                }}
                className={`${inputClass("bidAmount")} pr-12 tabular-nums`}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-ink-500)]">
                원
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-5 text-[var(--color-ink-500)]">
              만원 단위로 자동 정리됩니다.
            </p>
            {bidAmountNum > 0 && (
              <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                한글 표기: {formatKoreanWon(bidAmountNum)}
              </p>
            )}
            {showErrors && belowMin && !errors.bidAmount && (
              <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-accent-red)]">
                <AlertCircle size={12} aria-hidden="true" />
                최저가 미만의 입찰은 무효 처리됩니다.
              </p>
            )}
            {showErrors && errors.bidAmount && (
              <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                {errors.bidAmount}
              </p>
            )}
            {/* cycle 1-D-A-4-3 보강 1 정정 4: "입찰가 확정" CTA 별도 row paradigm.
                input 아래 = helper text + 한글 표기 + error 사후 위치 정합.
                bidConfirmed false 시점 = "입찰가 확정" + handleConfirmBid trigger.
                bidConfirmed true 시점 = "확정 완료 ✓" + disabled + cursor-default 시각 paradigm. */}
            <button
              type="button"
              onClick={handleConfirmBid}
              disabled={bidConfirmed || bidAmountNum <= 0}
              className={cn(
                "mt-3 inline-flex h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl px-5 text-base font-black transition-colors duration-200",
                bidConfirmed
                  ? "cursor-default bg-[var(--brand-green)] text-white"
                  : bidAmountNum > 0
                    ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
                    : "cursor-not-allowed bg-gray-200 text-gray-400",
              )}
              aria-label={bidConfirmed ? "입찰가 확정 완료" : "입찰가 확정"}
            >
              {bidConfirmed ? (
                <>
                  <Check size={18} aria-hidden="true" strokeWidth={3} />
                  확정 완료
                </>
              ) : (
                "입찰가 확정"
              )}
            </button>
          </div>

          {/* 신청인 (cycle 1-D-A-4-2 paradigm 회수: sm:grid 영구 폐기 → flex flex-col gap-4 단독) */}
          <div className="flex flex-col gap-4">
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
              {showErrors && errors.applicantName && (
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
                placeholder="010-1234-5678"
                value={bid.phone}
                onChange={(e) => {
                  onBidInfoChange({ phone: formatPhone(e.target.value) });
                  clearError("phone");
                }}
                className={inputClass("phone")}
              />
              {showErrors && errors.phone && (
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
            <p className="mt-1 text-xs leading-5 text-[var(--color-ink-500)]">
              위임장 발급 직후 뒷 7자리는 폐기됩니다
            </p>
            {showErrors && (errors.ssnFront || errors.ssnBack) && (
              <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                {errors.ssnFront ?? errors.ssnBack}
              </p>
            )}
          </div>

          {/* 재경매 = 일반 체크박스 + ? icon → tooltip on-demand paradigm.
              노란색 박스 dom 영구 폐기 (시각 분리 ↓ + 텍스트 위계 정합). */}
          <div ref={tooltipRef} className="relative flex items-center gap-2">
            <input
              id="rebid-checkbox"
              type="checkbox"
              checked={bid.rebid}
              onChange={(e) =>
                onBidInfoChange({ rebid: e.target.checked })
              }
              className="h-5 w-5 rounded border-[var(--color-border)] accent-[var(--brand-green)]"
            />
            <label
              htmlFor="rebid-checkbox"
              className="cursor-pointer text-base font-bold leading-7 text-[var(--color-ink-900)]"
            >
              재경매 물건 (보증금 20%)
            </label>
            <button
              type="button"
              aria-label="재경매 물건 안내"
              aria-expanded={tooltipOpen}
              onClick={() => setTooltipOpen((prev) => !prev)}
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
              className="rounded-full text-[var(--color-ink-500)] transition-colors duration-150 hover:text-[var(--color-ink-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
            >
              <HelpCircle size={18} aria-hidden="true" />
            </button>
            {tooltipOpen && (
              <div
                role="tooltip"
                className="absolute left-0 top-full z-10 mt-2 max-w-[280px] rounded-md bg-[var(--color-ink-900)] p-3 text-xs leading-5 text-white shadow-lg"
              >
                이전 낙찰자가 잔금을 미납한 사건이면 보증금이 20%로 올라가요. 확실하지 않으면 비워두세요.
                <span
                  className="absolute -top-1 left-4 h-2 w-2 rotate-45 bg-[var(--color-ink-900)]"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          {/* 공동입찰 = 일반 체크박스 paradigm (박스 dom 영구 폐기 / 시각 노이즈 ↓) */}
          <div>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={bid.jointBidding}
                onChange={(e) =>
                  onBidInfoChange({ jointBidding: e.target.checked })
                }
                className="h-5 w-5 rounded border-[var(--color-border)] accent-[var(--brand-green)]"
              />
              <span className="text-base font-bold leading-7 text-[var(--color-ink-900)]">
                공동입찰로 진행합니다
              </span>
            </label>
            {bid.jointBidding && (
              <div className="mt-4 flex flex-col gap-4">
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
                  {showErrors && errors.jointApplicantName && (
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
                  {showErrors && errors.jointApplicantPhone && (
                    <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                      {errors.jointApplicantPhone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 수수료 inline 정식 어휘 + 위계 paradigm (cycle 1-D-A-4-2 final).
              "신청가" 어휘 영구 폐기 → "입찰대리 수수료" 정식 단독.
              메인 가격 + 성공보수 = 동등 크기 (18px) + 색상 분리 paradigm 정합. */}
          {fee && (
            <div className="border-t border-[var(--color-ink-200)] pt-4">
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
      </fieldset>

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
          onClick={handleNext}
          disabled={(attemptedNext && hasErrors) || !bidConfirmed}
          className={cn(
            "inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl px-8 text-base font-black transition-colors duration-150 sm:w-auto sm:px-10",
            !((attemptedNext && hasErrors) || !bidConfirmed)
              ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          )}
        >
          다음: 서류 업로드
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      {/* cycle 1-D-A-4-3 보강 1 정정 2: 입찰 금액 확인 강제 모달 (검증 정합 사후 pop paradigm) */}
      <BidConfirmModal
        isOpen={bidConfirmOpen}
        onClose={handleBidCancel}
        onConfirm={handleBidConfirm}
        truncatedAmount={truncateBidAmount(bidAmountNum)}
        koreanAmount={formatKoreanWon(truncateBidAmount(bidAmountNum))}
      />
    </div>
  );
}
