"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Check,
  Home,
  FileText,
} from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import { computeFee } from "@/lib/apply";
import { formatKoreanWon } from "@/lib/utils";
import { BANK_ACCOUNT } from "@/lib/constants";

/**
 * cycle 1-D-A-4-5 광역 재구성 — 신청 접수 완료 화면 (Step6 conceptually).
 *
 * conditional render paradigm (BANK_ACCOUNT.isConfigured 분기):
 * - 사업자등록 사전 = "카카오톡 직접 안내" 카피 단독 render
 * - 사업자등록 사후 = 입금 안내 카드 광역 render
 *
 * 직전 paradigm 광역 폐기:
 * - 보증금 송금 영역 (deposit_amount paradigm) = 회수 (수수료 단독 + 보증금 = 별개 paradigm 영역)
 * - 온라인 결제 (PG) 카드 = 회수 (Phase 10 사후 영역)
 * - 다음 단계 ol = 회수 (간소화 paradigm)
 *
 * 보존:
 * - 접수번호 발급 (applicationId GQ-YYYYMMDD-NNNN 친화 형식)
 * - 마이페이지 link
 * - 홈으로 link
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

  async function copyAccount() {
    if (!BANK_ACCOUNT.isConfigured) return;
    try {
      await navigator.clipboard.writeText(BANK_ACCOUNT.accountNumber);
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
        <h2 className="mt-4 text-2xl font-black tracking-[-0.015em] text-[var(--color-ink-900)]">
          신청이 접수되었습니다
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-700)]">
          접수번호{" "}
          <strong className="font-black tabular-nums text-[var(--color-ink-900)]">
            {applicationId}
          </strong>
          {BANK_ACCOUNT.isConfigured
            ? " 입금 사후 카카오톡 또는 SMS로 접수 완료 안내드립니다."
            : " 대리인 박형준 (공인중개사)이 카카오톡 또는 SMS로 입금 계좌를 직접 안내드립니다."}
        </p>
      </header>

      {/* conditional render: 사업자등록 사전 = 카카오톡 안내 / 사후 = 입금 안내 카드 */}
      {BANK_ACCOUNT.isConfigured ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="text-base font-black text-[var(--color-ink-900)]">
            입금 안내
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex flex-col gap-1">
              <dt className="text-xs text-[var(--color-ink-500)]">은행</dt>
              <dd className="font-bold text-[var(--color-ink-900)]">
                {BANK_ACCOUNT.bankName}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs text-[var(--color-ink-500)]">계좌번호</dt>
              <dd className="flex items-center justify-between gap-2">
                <span className="font-bold tabular-nums text-[var(--color-ink-900)]">
                  {BANK_ACCOUNT.accountNumber}
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
              <dt className="text-xs text-[var(--color-ink-500)]">예금주</dt>
              <dd className="font-bold text-[var(--color-ink-900)]">
                {BANK_ACCOUNT.accountHolder}
              </dd>
            </div>
            {fee && (
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-[var(--color-ink-500)]">입금 금액</dt>
                <dd className="text-lg font-black tabular-nums text-[var(--color-accent-red)]">
                  {formatKoreanWon(fee.baseFee)}
                </dd>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <dt className="text-xs text-[var(--color-ink-500)]">입금자명</dt>
              <dd className="font-bold text-[var(--color-ink-900)]">
                {data.depositorName || data.bidInfo.applicantName || "-"}
              </dd>
            </div>
          </dl>
          <p className="mt-4 rounded-md bg-gray-50 p-3.5 text-xs leading-6 text-[var(--color-ink-700)]">
            입금 확인은 영업일 기준 30분 안에 처리됩니다. 입금 확인 사후 접수가 완료되며, 카카오톡 또는 SMS로 안내드립니다.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="text-base font-black text-[var(--color-ink-900)]">
            다음 단계
          </h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink-700)]">
            대리인 박형준 (공인중개사)이 곧 카카오톡 또는 SMS로 연락드립니다. 안내해드린 입금 계좌로 입찰 대리 수수료를 입금하시면 신청이 완료됩니다.
          </p>
          <p className="mt-3 rounded-md bg-gray-50 p-3.5 text-xs leading-6 text-[var(--color-ink-700)]">
            입금 사후 접수가 완료되며, 카카오톡 또는 SMS로 추가 안내드립니다.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Link
          href="/my/orders"
          className="inline-flex min-h-[var(--cta-h-app)] flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-ink-900)] bg-white px-5 text-base font-bold text-[var(--color-ink-900)] hover:bg-[var(--color-ink-50)]"
        >
          <FileText size={16} aria-hidden="true" />
          내 신청 보기
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-[var(--cta-h-app)] flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-ink-900)] px-5 text-base font-bold text-white hover:bg-black"
        >
          <Home size={16} aria-hidden="true" />
          홈으로
        </Link>
      </div>
    </div>
  );
}
