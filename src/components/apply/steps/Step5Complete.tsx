"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Copy, Check, Home } from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import { computeFee } from "@/lib/apply";
import { formatPaymentDeadline } from "@/lib/calendar";
import { formatKoreanWon } from "@/lib/utils";
import { DISPLAY_BANK } from "@/lib/constants";

/**
 * cycle 1-D-A-4-7 정정 — 신청 접수 완료 화면 (카피 정수 + red 색감 정수 + channel 영역 0).
 *
 * cycle 1-D-A-4-6 정정 사항 (보존):
 * - mockup default + DISPLAY_BANK paradigm
 * - h2 leading-[1.2] 정합
 * - 마이페이지 link 폐기 / "홈으로" 단독
 *
 * cycle 1-D-A-4-7 신규 정정:
 * - "입금 사후 접수가 완료됩니다" → "입금이 확인되면 접수가 완료됩니다" 정정 (직역 → 자연 paradigm)
 * - 알림 채널 명시 영역 0 paradigm ("알림을 보내드립니다" 단독)
 * - 입금 금액 dd = red color → ink-900 + font-black + text-2xl 정정 (영구 룰 §9 정합 / 정보 paradigm)
 */

export function Step5Complete({
  data,
  applicationId,
}: {
  data: ApplyFormData;
  applicationId: string;
}) {
  const [copied, setCopied] = useState(false);
  const fee = data.bidDate ? computeFee(data.bidDate) : null;
  const paymentDeadline = formatPaymentDeadline(data.bidDate);

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(DISPLAY_BANK.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-2xl border-2 border-[var(--brand-green)] bg-[var(--brand-green)]/5 p-6 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-green)] text-white">
          <CheckCircle2 size={28} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-2xl font-black leading-[1.2] tracking-[-0.015em] text-[var(--color-ink-900)]">
          신청이 접수되었습니다
        </h2>
        <div className="mt-3 space-y-1.5 text-sm leading-6 text-[var(--color-ink-700)]">
          <p>
            접수번호:{" "}
            <strong className="font-black tabular-nums text-[var(--color-ink-900)]">
              {applicationId}
            </strong>
          </p>
          <p>입금이 확인되면 알림과 함께 접수가 완료됩니다.</p>
        </div>
      </header>

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
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">입금자명</dt>
            <dd className="text-base font-bold text-[var(--color-ink-900)]">
              {data.depositorName || data.bidInfo.applicantName || "-"}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">입금 마감</dt>
            <dd className="text-base font-bold text-[var(--color-ink-900)]">
              {paymentDeadline}
            </dd>
          </div>
        </dl>
        <div className="mt-4 space-y-2 rounded-md bg-gray-50 p-3.5 text-sm leading-6 text-[var(--color-ink-700)]">
          <p>입금 마감까지 위 계좌로 수수료를 입금해주세요.</p>
          <p>입금이 확인되면 알림과 함께 접수가 완료됩니다.</p>
        </div>
      </div>

      <Link
        href="/"
        className="inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-ink-900)] px-5 text-base font-bold text-white hover:bg-black"
      >
        <Home size={16} aria-hidden="true" />
        홈으로
      </Link>
    </div>
  );
}
