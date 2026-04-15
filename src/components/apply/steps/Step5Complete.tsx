"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Copy, Check, Home, FileText } from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import { computeDeposit, computeFee } from "@/lib/apply";
import { formatKoreanWon } from "@/lib/utils";
import { BANK_INFO } from "@/lib/constants";

export function Step5Complete({
  data,
  applicationId,
}: {
  data: ApplyFormData;
  applicationId: string;
}) {
  const [copied, setCopied] = useState(false);
  const fee = data.matchedPost
    ? computeFee(data.matchedPost.bidDate)
    : { baseFee: 70000, tierLabel: "일반", successBonus: 50000, daysUntilBid: 0, tier: "standard" as const, description: "" };
  const deposit = data.matchedPost
    ? computeDeposit(data.matchedPost.appraisal, data.bidInfo.rebid)
    : null;
  const depositPercentLabel = data.bidInfo.rebid ? "20%" : "10%";

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(
        `${BANK_INFO.bank} ${BANK_INFO.accountNumber}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const bidDateLabel = data.matchedPost?.bidDate
    ? `입찰일(${data.matchedPost.bidDate}) 전일 오후까지`
    : "입찰일 전일 오후까지";

  return (
    <div className="flex flex-col gap-8">
      <header className="rounded-[var(--radius-2xl)] border-2 border-brand-600 bg-brand-50/40 p-8 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white">
          <CheckCircle2 size={28} aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-brand-600">
          접수 완료
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
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

      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
          01. 수수료 송금
        </h3>
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-[var(--color-ink-500)]">
              {fee.tierLabel} · 신청 시점 확정
            </p>
            <p className="mt-1 text-3xl font-black tabular-nums text-[var(--color-ink-900)]">
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
        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
            02. 보증금 송금
          </h3>
          <div className="mt-4">
            <p className="text-xs text-[var(--color-ink-500)]">
              감정가의 {depositPercentLabel} · {bidDateLabel}
            </p>
            <p className="mt-1 text-3xl font-black tabular-nums text-[var(--color-ink-900)]">
              {formatKoreanWon(deposit)}
            </p>
            <p className="mt-3 text-xs leading-5 text-[var(--color-ink-500)]">
              {data.bidInfo.rebid
                ? "재경매 사건으로 체크하셔서 보증금이 감정가의 20%로 계산되었습니다. "
                : "일반 경매 기준 감정가의 10%로 계산되었습니다. 재경매 사건이면 접수 확인 시 안내 후 20%로 재계산됩니다. "}
              <strong className="text-[var(--color-ink-900)]">
                패찰 시 보증금은 전액 반환
              </strong>
              됩니다.
            </p>
          </div>
        </section>
      )}

      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
          전용계좌
        </h3>
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
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm font-bold text-[var(--color-ink-900)] hover:border-brand-600 hover:text-brand-700"
          >
            {copied ? (
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

      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
          다음 단계
        </h3>
        <ol className="mt-4 flex flex-col gap-3 text-sm leading-6 text-[var(--color-ink-700)]">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-black text-white">
              1
            </span>
            <span>
              접수 확인 연락이{" "}
              <strong className="text-[var(--color-ink-900)]">
                카카오톡
              </strong>
              으로 전달됩니다. 접수번호 <strong>{applicationId}</strong>과 함께
              서류·보증금 확인을 안내드립니다.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-black text-white">
              2
            </span>
            <span>입찰일 전일까지 서류 최종 확인 및 보증금 입금 확인.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-black text-white">
              3
            </span>
            <span>
              입찰일 당일 법원에서 대리 입찰 수행. 낙찰/패찰 결과를 당일 카카오톡으로 통보합니다.
            </span>
          </li>
        </ol>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/analysis"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink-900)] hover:bg-[var(--color-ink-100)]"
        >
          <FileText size={16} aria-hidden="true" />
          다른 물건분석 보기
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700"
        >
          <Home size={16} aria-hidden="true" />
          홈으로
        </Link>
      </div>
    </div>
  );
}
