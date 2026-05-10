"use client";

// cycle 1-D-A-4-3: 발급증 영역 영구 폐기 + IssueGuideModal 신규 + info 박스 layered paradigm
//   + h2/sub/footer 카피 차별화 + Step1·Step2 paradigm 광역 통일.
import { useState } from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import type { ApplyFormData, ApplyDocuments } from "@/types/apply";
import { cn } from "@/lib/utils";
import { FileUpload } from "../FileUpload";
import { IssueGuideModal } from "../IssueGuideModal";

export function Step3Documents({
  data,
  onDocumentsChange,
  onNext,
  onBack,
}: {
  data: ApplyFormData;
  onDocumentsChange: (patch: Partial<ApplyDocuments>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { eSignFile, idFile } = data.documents;
  const canProceed = !!eSignFile && !!idFile;
  const [issueGuideOpen, setIssueGuideOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-black leading-[1.2] tracking-[-0.015em] text-[var(--color-ink-900)]">
          서류 업로드
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
          위임장 작성에 필요한 서류를 올려주세요
        </p>
      </header>

      {/* info 박스 layered paradigm: 첫 진입 사전 인지 (1줄) + button trigger → IssueGuideModal (양 서류 sequential 상세).
          곡률 = rounded-xl (12px) / 카드 rounded-2xl (16px) ⊃ info 박스 rounded-xl (12px) 시각 위계 SCALE. */}
      <div className="flex items-start gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3">
        <Info
          size={16}
          className="mt-0.5 shrink-0 text-[var(--color-ink-700)]"
          aria-hidden="true"
        />
        <p className="text-sm leading-6 text-[var(--color-ink-700)]">
          매수신청 대리에 필요한 서류예요.{" "}
          <button
            type="button"
            onClick={() => setIssueGuideOpen(true)}
            className="rounded font-bold text-[var(--brand-green)] underline-offset-2 transition-colors duration-150 hover:text-[var(--brand-green-deep)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
          >
            발급 방법
          </button>
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5">
        <FileUpload
          label="인감증명서 또는 본인서명사실확인서"
          description="둘 중 하나 발급해서 올려주세요"
          file={eSignFile}
          onFileChange={(f) => onDocumentsChange({ eSignFile: f })}
        />
        <FileUpload
          label="신분증 사본"
          description="주민등록증 / 운전면허증 / 여권 중 하나"
          file={idFile}
          onFileChange={(f) => onDocumentsChange({ idFile: f })}
        />
      </div>

      <p className="text-xs leading-5 text-[var(--color-ink-500)]">
        입찰 대리 업무에만 쓰이고, 3년 후 즉시 폐기돼요
      </p>

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
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl px-8 text-base font-black transition-colors duration-150 sm:w-auto sm:px-10",
            canProceed
              ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          )}
        >
          다음: 확인·제출
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      {/* cycle 1-D-A-4-3 재진입: IssueGuideModal mount (courtName props 영구 폐기 / 양 서류 sequential paradigm) */}
      <IssueGuideModal
        isOpen={issueGuideOpen}
        onClose={() => setIssueGuideOpen(false)}
      />
    </div>
  );
}
