"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import type { ApplyFormData, ApplyBidInfo } from "@/types/apply";
import { formatPhone } from "@/lib/apply";
import { formatKoreanWon } from "@/lib/utils";
import { FeeCalculator } from "../FeeCalculator";

export function Step2BidInfo({
  data,
  onBidInfoChange,
  onNext,
  onBack,
}: {
  data: ApplyFormData;
  onBidInfoChange: (patch: Partial<ApplyBidInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const bid = data.bidInfo;
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
      <header>
        <p className="text-xs font-black uppercase tracking-wider text-brand-600">
          Step 2
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
          입찰 정보를 입력해주세요
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
          입찰 희망 금액과 신청인 정보는 위임 서류 작성에 사용됩니다.
          입력하신 정보는 암호화되어 전달되며 접수 외 용도로 사용되지 않습니다.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
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

          {/* 주민번호 앞 6자리 */}
          <div>
            <label
              htmlFor="applicant-ssn"
              className="mb-2 block text-sm font-black text-[var(--color-ink-900)]"
            >
              주민등록번호 앞 6자리{" "}
              <span className="text-[var(--color-accent-red)]">*</span>
            </label>
            <input
              id="applicant-ssn"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="예: 900101"
              value={bid.ssnFront}
              onChange={(e) =>
                onBidInfoChange({
                  ssnFront: e.target.value.replace(/\D/g, "").slice(0, 6),
                })
              }
              className={`${inputClass("ssnFront")} tabular-nums`}
            />
            <p className="mt-1 text-xs text-[var(--color-ink-500)]">
              위임장 작성에만 사용되며 뒷자리는 받지 않습니다.
            </p>
            {errors.ssnFront && (
              <p className="mt-1 text-xs text-[var(--color-accent-red)]">
                {errors.ssnFront}
              </p>
            )}
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
      </div>

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
          className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-6 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-brand-700"
        >
          다음: 서류 업로드
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
