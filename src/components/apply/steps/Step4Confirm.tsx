"use client";

import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import { FeeCalculator } from "../FeeCalculator";
import { ApplyChecklist } from "../ApplyChecklist";
import { formatKoreanWon } from "@/lib/utils";

export function Step4Confirm({
  data,
  onChecklistChange,
  onSubmit,
  onBack,
  submitting,
  submitError,
}: {
  data: ApplyFormData;
  onChecklistChange: (idx: number, checked: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
  const allChecked = data.checklist.every(Boolean);
  const bid = data.bidInfo;
  const bidAmount = Number(bid.bidAmount.replace(/[^\d]/g, "")) || 0;

  function maskSsn(v: string) {
    if (!v) return "";
    return `${v.slice(0, 2)}****`;
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-black uppercase tracking-wider text-brand-600">
          Step 4
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
          내용을 확인하고 제출해주세요
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
          아래 5가지 안심 근거를 모두 확인하시면 제출이 가능합니다. 제출 후
          접수번호가 발급되며, 전용계좌 정보를 안내드립니다.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* 입력 요약 */}
        <section className="flex flex-col gap-5">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-black text-[var(--color-ink-900)]">
              입찰 정보 요약
            </h3>
            <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">법원 · 사건번호</dt>
                <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                  {data.court} · {data.caseNumber}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">입찰일</dt>
                <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                  {data.matchedPost?.bidDate ?? "상담원 확인 필요"}
                  {data.matchedPost?.bidTime ? ` ${data.matchedPost.bidTime}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">입찰 희망 금액</dt>
                <dd className="mt-1 font-black tabular-nums text-[var(--color-accent-red)]">
                  {bidAmount > 0 ? formatKoreanWon(bidAmount) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">신청인</dt>
                <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                  {bid.applicantName} · {bid.phone}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">주민번호 앞자리</dt>
                <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                  {maskSsn(bid.ssnFront)}
                </dd>
              </div>
              {bid.jointBidding && (
                <div>
                  <dt className="text-xs text-[var(--color-ink-500)]">공동입찰인</dt>
                  <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                    {bid.jointApplicantName} · {bid.jointApplicantPhone}
                  </dd>
                </div>
              )}
            </dl>
            <h3 className="mt-6 text-sm font-black text-[var(--color-ink-900)]">
              제출 서류
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--color-ink-700)]">
              <li>· 전자본인서명확인서: {data.documents.eSignFile?.name ?? "-"}</li>
              <li>· 신분증 사본: {data.documents.idFile?.name ?? "-"}</li>
            </ul>
          </div>

          {/* 체크리스트 */}
          <div>
            <h3 className="mb-3 text-sm font-black text-[var(--color-ink-900)]">
              안심 근거 확인 (모두 체크)
            </h3>
            <ApplyChecklist
              values={data.checklist}
              onChange={onChecklistChange}
            />
          </div>
        </section>

        <aside>
          <FeeCalculator fm={data.matchedPost} bidAmount={bidAmount} />
        </aside>
      </div>

      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-accent-red)] bg-[var(--color-accent-red-soft)] px-5 py-4 text-sm text-[var(--color-accent-red)]"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {submitError}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)] disabled:opacity-50"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          이전
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!allChecked || submitting}
          className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-6 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-[var(--color-ink-300)] disabled:shadow-none"
        >
          {submitting ? "제출 중..." : "신청 제출"}
          {!submitting && <Send size={16} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
