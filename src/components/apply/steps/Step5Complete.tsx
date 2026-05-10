"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Check,
  Home,
  FileText,
  CreditCard,
} from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import { computeDeposit, computeFee } from "@/lib/apply";
import { formatKoreanWon } from "@/lib/utils";
import { BANK_INFO, PAYMENT_PG_ENABLED } from "@/lib/constants";

export function Step5Complete({
  data,
  applicationId,
}: {
  data: ApplyFormData;
  applicationId: string;
}) {
  const [copiedField, setCopiedField] = useState<
    "account" | "amount" | null
  >(null);
  // cycle 1-D-A-4-2: manualEntry 폐기 → 매칭 단독 경로. bidDate / 보증금 모두 listing 기반.
  const fee = data.bidDate
    ? computeFee(data.bidDate)
    : { baseFee: 70000, tierLabel: "일반", successBonus: 50000, daysUntilBid: 0, tier: "standard" as const, description: "" };
  // cycle 1-D-A-4: matchedListing 단독 source (matchedPost 광역 폐기).
  const appraisal = data.matchedListing?.appraisal_amount ?? null;
  const deposit =
    appraisal != null
      ? computeDeposit(appraisal, data.bidInfo.rebid)
      : null;
  const depositPercentLabel = data.bidInfo.rebid ? "20%" : "10%";
  // 수수료 + 보증금 합계 (송금 시 한 번에 보낼 금액)
  const totalToSend = deposit !== null ? fee.baseFee + deposit : fee.baseFee;

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(
        `${BANK_INFO.bank} ${BANK_INFO.accountNumber}`
      );
      setCopiedField("account");
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore
    }
  }

  async function copyAmount() {
    try {
      await navigator.clipboard.writeText(String(totalToSend));
      setCopiedField("amount");
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore
    }
  }

  const bidDateLabel = data.bidDate
    ? `입찰일(${data.bidDate}) 전일 오후까지`
    : "입찰일 전일 오후까지";

  return (
    <div className="flex flex-col gap-8">
      <header className="rounded-[var(--radius-2xl)] border-2 border-[var(--color-ink-900)] bg-[var(--color-ink-50)]/60 p-8 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-white">
          <CheckCircle2 size={28} aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-ink-900)]">
          접수 완료
        </p>
        <h2 className="mt-2 text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
          신청이 접수되었습니다
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
          접수번호는{" "}
          <strong className="font-black tabular-nums text-[var(--color-ink-900)]">
            {applicationId}
          </strong>{" "}
          입니다. 아래 안내에 따라 수수료와 보증금을 송금해주세요.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-8">
        <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
          01. 수수료 송금
        </h3>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-[var(--color-ink-500)]">
              {fee.tierLabel} · 신청 시점 확정
            </p>
            <p className="mt-1 text-h2 font-black tabular-nums text-[var(--color-ink-900)]">
              {formatKoreanWon(fee.baseFee)}
            </p>
          </div>
          <p className="max-w-xs text-xs leading-5 text-[var(--color-ink-500)]">
            낙찰 성공 시 성공보수 {formatKoreanWon(fee.successBonus)}이 추가
            청구됩니다. 패찰 시 추가 청구는 없습니다.
          </p>
        </div>
      </section>

      {deposit !== null && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-8">
          <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
            02. 보증금 송금
          </h3>
          <div className="mt-4">
            <p className="text-xs text-[var(--color-ink-500)]">
              감정가의 {depositPercentLabel} · {bidDateLabel}
            </p>
            <p className="mt-1 text-h2 font-black tabular-nums text-[var(--color-ink-900)]">
              {formatKoreanWon(deposit)}
            </p>
            <p className="mt-3 text-xs leading-5 text-[var(--color-ink-500)]">
              {data.bidInfo.rebid
                ? "재경매 사건으로 체크하셔서 보증금이 감정가의 20%로 계산되었습니다. "
                : "일반 경매 기준 감정가의 10%로 적용되었습니다. 재경매 사건으로 확인되면 20%로 재계산하여 안내드립니다. "}
              <strong className="text-[var(--color-ink-900)]">
                패찰 시 보증금은 당일 즉시 반환
              </strong>
              됩니다.
            </p>
          </div>
        </section>
      )}

      <section className="rounded-[var(--radius-xl)] border-2 border-[var(--color-ink-900)] bg-[var(--color-ink-50)]/50 p-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-900)]">
          전용계좌 송금
        </h3>

        <p className="mt-2 rounded-[var(--radius-sm)] bg-white/60 px-3 py-2 text-xs leading-5 text-[var(--color-ink-700)]">
          아래 전용계좌로 보증금을 송금하시면, 본 입찰 대리가 최종 확정됩니다. 송금
          행위는 입찰 보증금 납부 및 대리 입찰 진행에 대한 동의로 간주됩니다.
        </p>

        {/* 송금 금액 강조 */}
        <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--color-ink-900)] bg-white p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold text-[var(--color-ink-500)]">
                총 송금 금액 (수수료{deposit !== null ? " + 보증금" : ""})
              </p>
              <p className="mt-1 text-h2 font-black tabular-nums text-[var(--color-ink-900)] sm:text-h1">
                {formatKoreanWon(totalToSend)}
              </p>
              <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                수수료 {formatKoreanWon(fee.baseFee)}
                {deposit !== null && (
                  <>
                    {" + 보증금 "}
                    {formatKoreanWon(deposit)}
                  </>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={copyAmount}
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm font-bold text-[var(--color-ink-900)] hover:border-[var(--color-ink-900)] hover:text-black"
            >
              {copiedField === "amount" ? (
                <>
                  <Check size={14} aria-hidden="true" />
                  금액 복사됨
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" />
                  금액 복사
                </>
              )}
            </button>
          </div>
        </div>

        {/* 계좌 정보 */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
              {BANK_INFO.bank}{" "}
              <span className="tabular-nums">{BANK_INFO.accountNumber}</span>
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-700)]">
              예금주 · {BANK_INFO.accountHolder}
            </p>
            <p className="mt-2 text-xs text-[var(--color-ink-500)]">
              송금 메모: {BANK_INFO.memo}
            </p>
          </div>
          <button
            type="button"
            onClick={copyAccount}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm font-bold text-[var(--color-ink-900)] hover:border-[var(--color-ink-900)] hover:text-black"
          >
            {copiedField === "account" ? (
              <>
                <Check size={14} aria-hidden="true" />
                복사됨
              </>
            ) : (
              <>
                <Copy size={14} aria-hidden="true" />
                계좌 복사
              </>
            )}
          </button>
        </div>
      </section>

      {/* 온라인 결제 (준비 중) — PAYMENT_PG_ENABLED 플래그 기반 */}
      {!PAYMENT_PG_ENABLED && (
        <section className="rounded-2xl border border-dashed border-gray-200 bg-[var(--color-surface-muted)] p-5 lg:p-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-100)] text-[var(--color-ink-500)]">
              <CreditCard size={18} aria-hidden="true" />
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-black text-[var(--color-ink-700)]">
                온라인 결제 (준비 중)
              </h3>
              <p className="mt-1 text-xs leading-5 text-[var(--color-ink-500)]">
                신용카드·간편결제 서비스를 준비하고 있습니다. 당분간은 위 전용계좌
                이체로 진행해주시고, 서비스 오픈 시 마이페이지에서 안내드립니다.
              </p>
            </div>
            <button
              type="button"
              disabled
              className="inline-flex min-h-9 shrink-0 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-3 text-xs font-bold text-[var(--color-ink-500)]"
            >
              준비 중
            </button>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-8">
        <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
          다음 단계
        </h3>
        <ol className="mt-4 flex flex-col gap-2 text-sm leading-6 text-[var(--color-ink-700)]">
          <li className="flex gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-[11px] font-black text-white">
              1
            </span>
            <span>
              <strong className="text-[var(--color-ink-900)]">
                접수 확인 연락
              </strong>
              을 안내드립니다. 접수번호 <strong>{applicationId}</strong>과 함께
              서류·보증금 확인을 안내드립니다.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-[11px] font-black text-white">
              2
            </span>
            <span>입찰일 전일까지 서류 최종 확인 및 보증금 입금 확인.</span>
          </li>
          <li className="flex gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-[11px] font-black text-white">
              3
            </span>
            <span>
              입찰일 당일 법원에서 대리 입찰 수행. 낙찰/패찰 결과를 당일 직접 통보합니다.
            </span>
          </li>
        </ol>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/analysis"
          className="inline-flex min-h-[var(--cta-h-app)] flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink-900)] hover:bg-[var(--color-ink-100)]"
        >
          <FileText size={16} aria-hidden="true" />
          다른 물건분석 보기
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-[var(--cta-h-app)] flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-5 text-sm font-bold text-white hover:bg-black"
        >
          <Home size={16} aria-hidden="true" />
          홈으로
        </Link>
      </div>
    </div>
  );
}
