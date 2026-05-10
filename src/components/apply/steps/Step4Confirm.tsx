"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, AlertCircle, FileText, Send } from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import { FeeCalculator } from "../FeeCalculator";
import { SignatureCanvas } from "../SignatureCanvas";
import { DelegationPreviewModal } from "../DelegationPreviewModal";
// pdfjs-dist 번들을 Step4 진입 시점으로 lazy load (Phase 6.7.5)
const PDFPreviewModal = dynamic(
  () => import("../PDFPreviewModal").then((m) => m.PDFPreviewModal),
  { ssr: false },
);
import { PrivacyPreviewModal } from "../PrivacyPreviewModal";
import { TermsPreviewModal } from "../TermsPreviewModal";
import { cn, formatKoreanWon } from "@/lib/utils";
import { getKSTDateTimeIso } from "@/lib/datetime";
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
  // 위임장 내용 미리보기 (HTML, 서명 전 동의 시점 참고용 — 보조 링크)
  const [previewOpen, setPreviewOpen] = useState(false);
  // Phase 6.5-POST-FIX (2026-04-19): 위임장 동의 체크박스 클릭 시 서버 PDF fetch + 모달
  const [delegationPdfFetching, setDelegationPdfFetching] = useState(false);
  const [delegationPdfBytes, setDelegationPdfBytes] = useState<Uint8Array | null>(null);
  const [delegationPdfModalOpen, setDelegationPdfModalOpen] = useState(false);
  const [delegationPdfError, setDelegationPdfError] = useState<string | null>(null);
  // 개인정보/이용약관 모달
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const bid = data.bidInfo;
  const bidAmount = Number(bid.bidAmount.replace(/[^\d]/g, "")) || 0;
  const allAgreed = data.agreedDelegation && data.agreedPrivacy && data.agreedTerms;
  const hasSignature = !!data.signature;
  // 제출 버튼 활성화: 서명 + 3 동의 + 제출 중 아님
  const canSubmit = hasSignature && allAgreed && !submitting;

  function maskSsn(v: string) {
    if (!v) return "";
    return `${v.slice(0, 2)}****`;
  }

  // 미리보기 모달용 DelegationData 구성. ssnBack과 signatureDataUrl은 placeholder.
  // Phase 4-CONFIRM: data.bidDate non-null 승격으로 boundary throw 제거.
  // bidDate/propertyAddress는 Step1 매칭 경로에서 listing 자동 복사 (cycle 1-D-A-4-2 manualEntry 폐기 정합).
  const previewData: DelegationData = useMemo(() => {
    // cycle 1-D-A-4: matchedListing 단독 source (matchedPost 광역 폐기).
    const appraisal = data.matchedListing?.appraisal_amount ?? 0;
    const depositRate = bid.rebid ? REBID_DEPOSIT_RATE : NORMAL_DEPOSIT_RATE;
    const deposit = Math.floor(appraisal * depositRate);
    return {
      delegator: {
        name: bid.applicantName,
        ssnFront: bid.ssnFront,
        ssnBack: bid.ssnBack,
        address:
          data.propertyAddress ||
          data.matchedListing?.address_display ||
          "",
        phone: bid.phone,
      },
      caseNumber: data.caseNumber,
      courtLabel: data.court,
      bidDate: data.bidDate,
      bidAmount,
      deposit,
      signatureDataUrl: null,
      createdAt: getKSTDateTimeIso(),
    };
  }, [data, bid, bidAmount]);

  /**
   * 위임장 동의 체크박스 클릭 핸들러 (Phase 6.5-POST-FIX, 2026-04-19).
   *
   * - 이미 ON 상태에서 클릭 → 단순 OFF (Modal 안 띄움, 서버 호출 없음)
   * - OFF 상태에서 클릭 (서명 완료 전제) → /api/preview-delegation POST → PDFPreviewModal 노출
   * - 실패 시 에러 토스트 + 체크박스 OFF 유지
   * - 재체크 시 매번 새로 서버 왕복 (no-cache)
   */
  async function handleAgreeDelegationClick() {
    // 현재 ON → 단순 OFF
    if (data.agreedDelegation) {
      onAgreementChange("agreedDelegation", false);
      return;
    }
    // 서명 미완료 시 클릭 무시 (UI에서 disabled 처리하지만 이중 가드)
    if (!hasSignature) return;

    setDelegationPdfFetching(true);
    setDelegationPdfError(null);
    try {
      const res = await fetch("/api/preview-delegation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ssnBack: bid.ssnBack,
          signatureDataUrl: data.signature,
          applyData: {
            delegator: {
              name: previewData.delegator.name,
              ssnFront: previewData.delegator.ssnFront,
              address: previewData.delegator.address,
              phone: previewData.delegator.phone,
            },
            caseNumber: previewData.caseNumber,
            courtLabel: previewData.courtLabel,
            bidDate: previewData.bidDate,
            bidAmount: previewData.bidAmount,
            deposit: previewData.deposit,
            createdAt: previewData.createdAt,
          },
        }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(
          errJson.error ?? "위임장 미리보기 생성에 실패했습니다.",
        );
      }
      const buf = await res.arrayBuffer();
      setDelegationPdfBytes(new Uint8Array(buf));
      setDelegationPdfModalOpen(true);
    } catch (err) {
      console.error("[Step4Confirm] preview fetch failed");
      setDelegationPdfError(
        err instanceof Error
          ? err.message
          : "위임장 미리보기 생성에 실패했습니다. 다시 시도해주세요.",
      );
    } finally {
      setDelegationPdfFetching(false);
    }
  }

  function handlePdfModalCancel() {
    setDelegationPdfModalOpen(false);
    setDelegationPdfBytes(null);
    // 체크박스 미체크 상태 유지 (agreedDelegation 변경 없음)
  }

  function handlePdfModalConfirm() {
    setDelegationPdfModalOpen(false);
    setDelegationPdfBytes(null);
    onAgreementChange("agreedDelegation", true);
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
          서명하고 위임에 동의해주세요
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
          위임장에 서명하고 3가지 항목에 동의하시면 제출이 가능합니다. 제출 후
          접수번호가 발급되며, 전용계좌 정보를 안내드립니다.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-4">
          {/* 입력 요약 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-base font-black text-[var(--color-ink-900)]">
              입찰 정보 요약
            </h3>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">법원 · 사건번호</dt>
                <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                  {data.court} · {data.caseNumber}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">입찰일</dt>
                <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                  {data.bidDate || "확인 후 안내"}
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
            <h3 className="mt-6 text-base font-black text-[var(--color-ink-900)]">
              제출 서류
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--color-ink-700)]">
              <li>· 전자본인서명확인서: {data.documents.eSignFile?.name ?? "-"}</li>
              <li>· 신분증 사본: {data.documents.idFile?.name ?? "-"}</li>
            </ul>
          </div>

          {/* 서명 영역 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-base font-black text-[var(--color-ink-900)]">
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
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-base font-black text-[var(--color-ink-900)]">동의</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm leading-6 text-[var(--color-ink-700)]">
              <li className="flex items-start gap-2">
                <input
                  id="agree-delegation"
                  type="checkbox"
                  checked={data.agreedDelegation}
                  onChange={handleAgreeDelegationClick}
                  disabled={!hasSignature || delegationPdfFetching || submitting}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-ink-900)] disabled:cursor-not-allowed disabled:opacity-50"
                />
                <label
                  htmlFor="agree-delegation"
                  className={`flex-1 ${!hasSignature ? "cursor-not-allowed text-[var(--color-ink-500)]" : "cursor-pointer"}`}
                >
                  위임장 내용을 확인하였으며, 위 서명으로 매수신청대리를 위임합니다.
                  {delegationPdfFetching && (
                    <span className="ml-2 text-xs text-[var(--color-ink-500)]">
                      (위임장 준비 중...)
                    </span>
                  )}
                  {!hasSignature && (
                    <span className="ml-2 text-xs text-[var(--color-accent-red)]">
                      먼저 서명을 완료해주세요
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-ink-900)] underline-offset-2 hover:underline"
                  >
                    <FileText size={12} aria-hidden="true" />
                    위임장 내용 미리보기
                  </button>
                </label>
              </li>
              <li className="flex items-start gap-2">
                <input
                  id="agree-privacy"
                  type="checkbox"
                  checked={data.agreedPrivacy}
                  onChange={(e) => onAgreementChange("agreedPrivacy", e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-ink-900)]"
                />
                <label htmlFor="agree-privacy" className="flex-1 cursor-pointer">
                  개인정보 처리방침에 동의합니다.
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-ink-900)] underline-offset-2 hover:underline"
                  >
                    <FileText size={12} aria-hidden="true" />
                    내용 보기
                  </button>
                </label>
              </li>
              <li className="flex items-start gap-2">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={data.agreedTerms}
                  onChange={(e) => onAgreementChange("agreedTerms", e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-ink-900)]"
                />
                <label htmlFor="agree-terms" className="flex-1 cursor-pointer">
                  서비스 이용약관에 동의합니다.
                  <button
                    type="button"
                    onClick={() => setTermsOpen(true)}
                    className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-ink-900)] underline-offset-2 hover:underline"
                  >
                    <FileText size={12} aria-hidden="true" />
                    내용 보기
                  </button>
                </label>
              </li>
            </ul>
          </div>
        </section>

        <aside>
          <FeeCalculator
            bidDate={data.matchedListing?.bid_date ?? null}
            appraisal={data.matchedListing?.appraisal_amount ?? null}
            bidAmount={bidAmount}
          />
        </aside>
      </div>

      {(submitError || delegationPdfError) && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-accent-red)] bg-[var(--color-accent-red-soft)] px-5 py-4 text-sm text-[var(--color-accent-red)]"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {submitError ?? delegationPdfError}
        </div>
      )}

      <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting || delegationPdfFetching}
          className="inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-base font-bold text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-ink-100)] disabled:opacity-50 sm:w-auto"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          이전
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={cn(
            "inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-full px-8 text-base font-black transition-colors duration-150 sm:w-auto sm:px-10",
            canSubmit
              ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          )}
        >
          {submitting ? "제출 중..." : "제출"}
          {!submitting && <Send size={16} aria-hidden="true" />}
        </button>
      </div>

      <DelegationPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={previewData}
      />

      {delegationPdfModalOpen && (
        <PDFPreviewModal
          pdfBytes={delegationPdfBytes}
          onConfirm={handlePdfModalConfirm}
          onCancel={handlePdfModalCancel}
          submitting={submitting}
        />
      )}

      <PrivacyPreviewModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />
      <TermsPreviewModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
      />
    </div>
  );
}
