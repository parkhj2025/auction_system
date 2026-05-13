"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, AlertCircle, Send, Copy, Check } from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import { computeFee } from "@/lib/apply";
import { formatPaymentDeadline } from "@/lib/calendar";
import { cn, formatKoreanWon } from "@/lib/utils";
import { DISPLAY_BANK, COURTS_ALL } from "@/lib/constants";

/**
 * cycle 1-D-A-4-7 정정 — 결제·접수 단계 (카피 정수 + red 색감 정수 + channel 영역 0 paradigm).
 *
 * cycle 1-D-A-4-6 정정 사항 (보존):
 * - mockup default + DISPLAY_BANK paradigm
 * - 입금 마감 자동 표기 (calendar utility)
 * - h2 / sub 카피
 *
 * cycle 1-D-A-4-7 신규 정정:
 * - "입금 사후" → "입금이 확인되면" 정정 (직역 → 자연 paradigm)
 * - "카카오톡으로 알림" → "알림을 보내드립니다" 단독 (channel 명시 영역 0)
 * - 입금 금액 dd = red color → ink-900 + font-black + text-2xl 정정 (영구 룰 §9 정합 / 정보 paradigm)
 * - 입찰 희망 금액 = red 보존 (가격 한정 paradigm 정수 정합)
 */

type Props = {
  data: ApplyFormData;
  onDepositorNameChange: (name: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  submitError: string | null;
};

export function Step5Payment({
  data,
  onDepositorNameChange,
  onSubmit,
  onBack,
  submitting,
  submitError,
}: Props) {
  const [copied, setCopied] = useState(false);

  // work-005 정정 5 = 1물건 1고객 race 회피 3차 단계 (Step5 결제 submit 직전 재 호출).
  // Hero (1차) + Step1 (2차) + Step5 (3차 / 본 정정) + DB unique constraint (4차 / 최종 안전망).
  const [raceChecking, setRaceChecking] = useState(false);
  const [raceBlocked, setRaceBlocked] = useState(false);

  const bid = data.bidInfo;
  const bidAmount = Number(bid.bidAmount.replace(/[^\d]/g, "")) || 0;
  const fee = data.bidDate ? computeFee(data.bidDate) : null;
  const paymentDeadline = formatPaymentDeadline(data.bidDate);

  // 입금자명 default = applicantName (mount 시점 단독 / 사용자 수정 우선 paradigm).
  useEffect(() => {
    if (!data.depositorName && bid.applicantName) {
      onDepositorNameChange(bid.applicantName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // work-005 정정 5 = submit 직전 is_case_active 재 호출 paradigm.
  // Step1 caseTaken alert 사후 사용자 광역 단계 진입 사후 시점 광역 race condition 회피 의무.
  async function handlePreSubmitCheck() {
    if (raceChecking) return;
    setRaceChecking(true);
    setRaceBlocked(false);
    try {
      const selectedCourt = COURTS_ALL.find((c) => c.label === data.court);
      const courtCode = selectedCourt?.courtCode ?? "";
      const res = await fetch("/api/orders/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseNumber: data.caseNumber,
          courtCode,
          courtName: data.court,
          round: data.auctionRound ?? 1,
        }),
      });
      const json = (await res.json()) as { available?: boolean | null };
      if (json.available === false) {
        setRaceBlocked(true);
        return;
      }
      onSubmit();
    } catch {
      // network NG 시점 = DB unique constraint 4차 안전망 paradigm 정합 → onSubmit 자연 진입.
      onSubmit();
    } finally {
      setRaceChecking(false);
    }
  }

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(DISPLAY_BANK.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select input
    }
  }

  const canSubmit =
    !!data.depositorName.trim() && !submitting && !raceChecking && !raceBlocked;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-black leading-[1.2] tracking-[-0.015em] text-[var(--color-ink-900)]">
          신청 정보를 확인해주세요
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
          아래 계좌로 입찰 대리 수수료를 입금하시면 접수가 완료됩니다.
        </p>
      </header>

      {/* 신청 정보 요약 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
          신청 정보
        </h3>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm">
          <div>
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">사건번호</dt>
            <dd className="mt-1 text-base font-bold tabular-nums text-[var(--color-ink-900)]">
              {data.caseNumber || "-"}
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
            <dd className="mt-1 text-base font-bold tabular-nums text-[var(--color-accent-red)]">
              {bidAmount > 0 ? formatKoreanWon(bidAmount) : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">신청인</dt>
            <dd className="mt-1 text-base font-bold text-[var(--color-ink-900)]">
              {bid.applicantName || "-"}
            </dd>
          </div>
          {fee && (
            <div className="col-span-2 mt-1 border-t border-[var(--color-ink-200)] pt-3">
              <dt className="text-sm font-medium text-[var(--color-ink-500)]">
                입찰대리 수수료
              </dt>
              <dd className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-lg font-bold tabular-nums text-[var(--color-ink-900)]">
                  {formatKoreanWon(fee.baseFee)}
                </span>
                <span className="text-sm font-bold text-[var(--color-ink-500)]">
                  낙찰 시 +5만원
                </span>
                <span className="text-xs text-[var(--color-ink-500)]">
                  ({fee.tierLabel})
                </span>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* 입금자명 input */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <label
          htmlFor="depositor-name"
          className="mb-2.5 block text-[var(--label-fs-app)] font-bold text-[var(--color-ink-900)]"
        >
          입금자명 <span className="text-[var(--color-accent-red)]">*</span>
        </label>
        <p className="mb-3 text-xs leading-5 text-[var(--color-ink-500)]">
          입금하실 분의 성함을 입력해주세요. 신청인과 다른 경우 수정해주세요.
        </p>
        <input
          id="depositor-name"
          type="text"
          value={data.depositorName}
          onChange={(e) => onDepositorNameChange(e.target.value)}
          placeholder="홍길동"
          className="h-[var(--input-h-app)] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-[length:var(--text-body)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] transition-colors duration-150 focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
        />
      </div>

      {/* 입금 안내 카드 (mockup default + env 정합 시점 단독 분기) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
          입금 안내
        </h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">은행</dt>
            <dd className="text-base font-bold text-[var(--color-ink-900)]">
              {DISPLAY_BANK.bankName}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">계좌번호</dt>
            <dd className="flex items-center justify-between gap-2">
              <span className="font-bold tabular-nums text-[var(--color-ink-900)]">
                {DISPLAY_BANK.accountNumber}
              </span>
              <button
                type="button"
                onClick={copyAccount}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--color-ink-900)] hover:bg-[var(--color-ink-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
              >
                {copied ? (
                  <>
                    <Check size={12} aria-hidden="true" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy size={12} aria-hidden="true" />
                    복사
                  </>
                )}
              </button>
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">예금주</dt>
            <dd className="text-base font-bold text-[var(--color-ink-900)]">
              {DISPLAY_BANK.accountHolder}
            </dd>
          </div>
          {fee && (
            <div className="flex flex-col gap-1">
              <dt className="text-sm font-medium text-[var(--color-ink-500)]">입금 금액</dt>
              <dd className="text-2xl font-black tabular-nums text-[var(--color-ink-900)]">
                {formatKoreanWon(fee.baseFee)}
              </dd>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">입금 마감</dt>
            <dd className="text-base font-bold text-[var(--color-ink-900)]">
              {paymentDeadline}
            </dd>
          </div>
        </dl>
        <div className="mt-4 rounded-md bg-gray-50 p-3.5 text-sm leading-6 text-[var(--color-ink-700)]">
          <p>입금이 확인되면 알림과 함께 접수가 완료됩니다.</p>
        </div>
      </div>

      {/* work-005 정정 5 = race condition 차단 alert (Step5 직전 재 호출 사후 isActive=true 시점). */}
      {raceBlocked && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-accent-red)] bg-[var(--color-accent-red-soft)] px-5 py-4 text-sm leading-6 text-[var(--color-accent-red)]"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-bold">접수가 막 차단됐습니다</p>
            <p className="mt-1 text-xs leading-5 text-[var(--color-ink-700)]">
              조금 전 다른 고객의 신청이 먼저 접수됐습니다. 같은 회차는 중복 접수가 불가합니다. 사건 조회부터 다시 진행해주세요.
            </p>
          </div>
        </div>
      )}

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
          disabled={submitting || raceChecking}
          className="inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-5 text-base font-bold text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-ink-100)] disabled:opacity-50 sm:w-auto"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          이전
        </button>
        <button
          type="button"
          onClick={handlePreSubmitCheck}
          disabled={!canSubmit}
          className={cn(
            "inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl px-8 text-base font-black transition-colors duration-150 sm:w-auto sm:px-10",
            canSubmit
              ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          )}
        >
          {raceChecking
            ? "확인 중..."
            : submitting
              ? "접수 중..."
              : "신청 접수"}
          {!submitting && !raceChecking && <Send size={16} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
