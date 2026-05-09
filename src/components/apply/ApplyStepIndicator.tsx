"use client";

import { useState } from "react";
import { Check, HelpCircle } from "lucide-react";
import { APPLY_STEPS, type ApplyStepId } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ApplyGuideModal } from "./ApplyGuideModal";

/* Stage 2 cycle 1-B 보강 1 — ApplyStepIndicator 광역 재구성.
 * 2-row paradigm + sticky top + 매칭 메타 inline:
 *   상단 row = STEP 강조 + 매칭 메타 (Step2~4 단독) (좌) + 도움말 버튼 (우)
 *   중간 row = 5 step 원 + 라벨 + progress line (광역 노출)
 * sticky top-0 z-30 = scroll 시 상단 고정.
 * 토큰 매핑 = #111418 charcoal + #00C853 green + gray-* (메인 정합).
 * client component (도움말 modal state). */

export function ApplyStepIndicator({
  current,
  completed,
  caseNumber,
  court,
  bidDate,
}: {
  current: ApplyStepId;
  completed: Set<ApplyStepId>;
  caseNumber?: string;
  court?: string;
  bidDate?: string;
}) {
  const [guideOpen, setGuideOpen] = useState(false);
  const currentIndex = APPLY_STEPS.findIndex((s) => s.id === current);
  const currentStep = APPLY_STEPS[currentIndex];
  const stepNumber = currentIndex + 1;
  // 매칭 메타 = Step2 (bid-info) / Step3 (documents) / Step4 (confirm) 단독.
  const showMeta =
    current === "bid-info" || current === "documents" || current === "confirm";

  return (
    <>
      <nav
        aria-label="신청 진행 단계"
        className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-white"
      >
        <div className="container-app py-5">
          {/* 상단 row — STEP 강조 + 매칭 메타 (조건부) + 도움말 버튼. */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-[15px] font-bold text-[#111418] sm:text-[17px]">
                <span className="text-[#00C853]">STEP {stepNumber} / 5</span>
                <span className="mx-2 text-gray-300" aria-hidden="true">·</span>
                <span>{currentStep?.label.replace(/\n/g, " ") ?? ""}</span>
              </p>
              {showMeta && (
                <p className="truncate text-xs text-gray-600 sm:text-sm">
                  <span className="font-semibold tabular-nums text-[#111418]">
                    {caseNumber || "-"}
                  </span>
                  <span className="mx-1.5 text-gray-300" aria-hidden="true">·</span>
                  <span>{court || "-"}</span>
                  <span className="mx-1.5 text-gray-300" aria-hidden="true">·</span>
                  매각기일{" "}
                  <span className="font-semibold tabular-nums text-[#111418]">
                    {bidDate || "-"}
                  </span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 text-[13px] font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-[#111418] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 sm:h-9 sm:px-4 sm:text-[14px]"
              aria-label="신청 가이드 열기"
            >
              <HelpCircle size={16} aria-hidden="true" className="sm:h-[18px] sm:w-[18px]" />
              도움말
            </button>
          </div>

          {/* 중간 row — 5 step 원 + 라벨 (광역 노출) + progress line. */}
          <ol className="mt-5 flex items-start gap-0">
            {APPLY_STEPS.map((step, i) => {
              const isCompleted = completed.has(step.id);
              const isCurrent = step.id === current;
              const isPast = i < currentIndex;
              const isLast = i === APPLY_STEPS.length - 1;

              return (
                <li
                  key={step.id}
                  className={cn("flex items-start", !isLast && "flex-1")}
                >
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                    <span
                      aria-current={isCurrent ? "step" : undefined}
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold transition-colors duration-150 sm:h-10 sm:w-10 sm:text-[15px]",
                        isCompleted || isPast
                          ? "bg-[#111418] text-white"
                          : isCurrent
                            ? "bg-[#00C853] text-white ring-4 ring-[#00C853]/20"
                            : "border border-gray-300 bg-white text-gray-500"
                      )}
                    >
                      {isCompleted || isPast ? (
                        <Check size={14} aria-hidden="true" className="sm:h-4 sm:w-4" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span
                      className={cn(
                        "whitespace-pre-line break-keep text-center leading-tight text-[12px] sm:text-[14px]",
                        isCurrent
                          ? "font-bold text-[#111418]"
                          : isCompleted || isPast
                            ? "font-medium text-[#111418]"
                            : "font-medium text-gray-500"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className={cn(
                        "mt-[18px] h-[2px] flex-1 rounded-full sm:mt-[20px]",
                        isPast ? "bg-[#00C853]" : "bg-gray-200"
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      <ApplyGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />
    </>
  );
}
