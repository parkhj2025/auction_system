"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Send, AlertCircle, ExternalLink, FileText } from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import { FeeCalculator } from "../FeeCalculator";
import { SignatureCanvas } from "../SignatureCanvas";
import { DelegationPreviewModal } from "../DelegationPreviewModal";
import { formatKoreanWon } from "@/lib/utils";
import type { DelegationData } from "@/lib/pdf/delegationTemplate";

type AgreementKey = "agreedDelegation" | "agreedPrivacy" | "agreedTerms";

const REBID_DEPOSIT_RATE = 0.2;
const NORMAL_DEPOSIT_RATE = 0.1;

export function Step4Confirm({
  data,
  onSignatureChange,
  onAgreementChange,
  onSubmit,
  onBack,
  submitting,
  submitError,
}: {
  data: ApplyFormData;
  onSignatureChange: (dataUrl: string | null) => void;
  onAgreementChange: (key: AgreementKey, value: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const bid = data.bidInfo;
  const bidAmount = Number(bid.bidAmount.replace(/[^\d]/g, "")) || 0;
  const allAgreed = data.agreedDelegation && data.agreedPrivacy && data.agreedTerms;
  const hasSignature = !!data.signature;
  const canSubmit = hasSignature && allAgreed && !submitting;

  function maskSsn(v: string) {
    if (!v) return "";
    return `${v.slice(0, 2)}****`;
  }

  // 미리보기 모달용 DelegationData 구성. ssnBack과 signatureDataUrl은 placeholder.
  const previewData: DelegationData = useMemo(() => {
    const appraisal = data.matchedPost?.appraisal ?? 0;
    const depositRate = bid.rebid ? REBID_DEPOSIT_RATE : NORMAL_DEPOSIT_RATE;
    const deposit = Math.floor(appraisal * depositRate);
    return {
      delegator: {
        name: bid.applicantName,
        ssnFront: bid.ssnFront,
        ssnBack: bid.ssnBack,
        address: data.matchedPost?.address ?? "",
        phone: bid.phone,
      },
      caseNumber: data.caseNumber,
      courtLabel: data.court,
      bidDate: data.matchedPost?.bidDate ?? new Date().toISOString().slice(0, 10),
      bidAmount,
      deposit,
      signatureDataUrl: null,
      createdAt: new Date().toISOString(),
    };
  }, [data, bid, bidAmount]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-black uppercase tracking-wider text-brand-600">
          Step 4
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
          서명하고 위임에 동의해 주세요
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
          위임장에 서명하고 3가지 항목에 동의하시면 제출이 가능합니다. 제출 후
          접수번호가 발급되며, 전용계좌 정보를 안내드립니다.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="flex flex-col gap-5">
          {/* 입력 요약 */}
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

          {/* 서명 영역 */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-black text-[var(--color-ink-900)]">
              위임인 서명
            </h3>
            <p className="mt-1 text-xs text-[var(--color-ink-500)]">
              아래 영역에 마우스 또는 손가락으로 서명해 주세요. 서명은 위임장 PDF에
              그대로 인쇄됩니다.
            </p>
            <div className="mt-3">
              <SignatureCanvas onChange={onSignatureChange} disabled={submitting} />
            </div>
            {!hasSignature && (
              <p className="mt-2 text-xs text-[var(--color-accent-red)]">
                서명이 비어 있습니다.
              </p>
            )}
          </div>

          {/* 3개 동의 + 미리보기 */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-black text-[var(--color-ink-900)]">동의</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm leading-6 text-[var(--color-ink-700)]">
              <li className="flex items-start gap-3">
                <input
                  id="agree-delegation"
                  type="checkbox"
                  checked={data.agreedDelegation}
                  onChange={(e) => onAgreementChange("agreedDelegation", e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-brand-600"
                />
                <label htmlFor="agree-delegation" className="flex-1 cursor-pointer">
                  위임장 내용을 확인하였으며, 위 서명으로 매수신청대리를 위임합니다.
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-brand-600 underline-offset-2 hover:underline"
                  >
                    <FileText size={12} aria-hidden="true" />
                    위임장 미리보기
                  </button>
                </label>
              </li>
              <li className="flex items-start gap-3">
                <input
                  id="agree-privacy"
                  type="checkbox"
                  checked={data.agreedPrivacy}
                  onChange={(e) => onAgreementChange("agreedPrivacy", e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-brand-600"
                />
                <label htmlFor="agree-privacy" className="flex-1 cursor-pointer">
                  개인정보 처리방침에 동의합니다.
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-brand-600 underline-offset-2 hover:underline"
                  >
                    <ExternalLink size={12} aria-hidden="true" />
                    내용 보기
                  </a>
                </label>
              </li>
              <li className="flex items-start gap-3">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={data.agreedTerms}
                  onChange={(e) => onAgreementChange("agreedTerms", e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-brand-600"
                />
                <label htmlFor="agree-terms" className="flex-1 cursor-pointer">
                  서비스 이용약관에 동의합니다.
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-brand-600 underline-offset-2 hover:underline"
                  >
                    <ExternalLink size={12} aria-hidden="true" />
                    내용 보기
                  </a>
                </label>
              </li>
            </ul>
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
          disabled={!canSubmit}
          className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-6 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-[var(--color-ink-300)] disabled:shadow-none"
        >
          {submitting ? "제출 중..." : "신청 제출"}
          {!submitting && <Send size={16} aria-hidden="true" />}
        </button>
      </div>

      <DelegationPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={previewData}
      />
    </div>
  );
}
