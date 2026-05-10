"use client";

import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import type { ApplyFormData, ApplyDocuments } from "@/types/apply";
import { cn } from "@/lib/utils";
import { FileUpload } from "../FileUpload";

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
  const { eSignFile, idFile, eSignCertFile } = data.documents;
  const canProceed = !!eSignFile && !!idFile;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
          서류를 업로드해주세요
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
          대법원 전자민원에서 발급한 전자본인서명확인서와 신분증 사본이
          필요합니다. 두 서류는 위임장 작성과 본인 확인에 사용됩니다.
        </p>
      </header>

      <div className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-4 text-sm">
        <Info
          size={16}
          className="mt-0.5 shrink-0 text-[var(--color-ink-900)]"
          aria-hidden="true"
        />
        <p className="leading-6 text-[var(--color-ink-700)]">
          전자본인서명확인서는{" "}
          <strong className="text-[var(--color-ink-900)]">
            대법원 전자민원센터
          </strong>
          에서 공동인증서 또는 금융인증서로 발급받을 수 있습니다. 발급 후 PDF
          파일을 그대로 업로드하시면 됩니다.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 md:grid-cols-2 lg:grid-cols-3 lg:p-8">
        <FileUpload
          label="전자본인서명확인서"
          description="대법원 전자민원센터에서 발급한 PDF 파일을 올려주세요."
          file={eSignFile}
          onFileChange={(f) => onDocumentsChange({ eSignFile: f })}
          helperLink={{
            href: "https://ecfs.scourt.go.kr",
            text: "발급 방법 안내",
          }}
        />
        <FileUpload
          label="신분증 사본"
          description="주민등록증 · 운전면허증 · 여권 중 하나. PDF 또는 이미지."
          file={idFile}
          onFileChange={(f) => onDocumentsChange({ idFile: f })}
        />
        <FileUpload
          label="전자본인서명확인서 발급증"
          description="정부24에서 발급한 발급증 PDF 또는 이미지. 수요기관: 인천지방법원 집행관."
          file={eSignCertFile ?? null}
          onFileChange={(f) => onDocumentsChange({ eSignCertFile: f })}
          helperLink={{
            href: "https://www.gov.kr",
            text: "정부24 발급 안내",
          }}
        />
      </div>

      <p className="text-xs leading-5 text-[var(--color-ink-500)]">
        업로드된 파일은 입찰 대리 업무에만 사용되며, 법정 보관 기간(접수일 기준
        3년) 이후 즉시 파기됩니다. 보관 중에는 보안 처리된 환경에서만
        관리됩니다.
      </p>

      <div className="flex items-center justify-between gap-2 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[var(--cta-h-app)] items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "inline-flex min-h-[var(--cta-h-app)] items-center gap-2 rounded-full px-6 text-sm font-black transition-colors duration-150",
            canProceed
              ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)]"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          )}
        >
          다음: 확인·제출
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
