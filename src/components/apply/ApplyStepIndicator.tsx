"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { APPLY_STEPS, type ApplyStepId } from "@/lib/constants";
import { ApplyGuideModal } from "./ApplyGuideModal";

/* cycle 1-D-A-2 = 모바일 앱 form paradigm 광역 (토스·카카오 차용).
 * 하단 fixed bar paradigm:
 *   - progress bar (h-1) + 채워진 영역 = bg-[var(--brand-green)]
 *   - 현 step 명 + 도움말 버튼 단독 (5 step 원·라벨 광역 폐기 / 매칭 메타 line 사이드바 단독)
 *   - safe-area-inset-bottom 정합 (모바일 + 데스크탑 광역)
 * mobile·desktop 동일 dom (분기 0). */

export function ApplyStepIndicator({
  current,
}: {
  current: ApplyStepId;
  /**
   * cycle 1-D-A-2: completed / caseNumber / court / bidDate / hasMatchedListing
   * props 광역 폐기 (5 step 원 + 매칭 메타 line 폐기 정수 정합).
   */
  completed?: Set<ApplyStepId>;
  caseNumber?: string;
  court?: string;
  bidDate?: string;
  hasMatchedListing?: boolean;
}) {
  const [guideOpen, setGuideOpen] = useState(false);
  const currentIndex = APPLY_STEPS.findIndex((s) => s.id === current);
  const currentStep = APPLY_STEPS[currentIndex];
  const stepNumber = currentIndex + 1;
  const total = APPLY_STEPS.length;
  const progressPercent = (stepNumber / total) * 100;

  return (
    <>
      <nav
        aria-label="신청 진행 단계"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-white"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* progress bar */}
        <div
          className="h-1 w-full bg-gray-200"
          role="progressbar"
          aria-valuenow={stepNumber}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`${stepNumber} / ${total} 단계`}
        >
          <div
            className="h-full bg-[var(--brand-green)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 현 step 명 + 도움말 */}
        <div className="container-app flex items-center justify-between gap-3 py-3 lg:py-4">
          <p className="min-w-0 truncate text-sm font-bold text-[var(--color-ink-900)] sm:text-base">
            <span className="text-[var(--brand-green)]">
              STEP {stepNumber} / {total}
            </span>
            <span className="mx-2 text-gray-300" aria-hidden="true">·</span>
            <span>{currentStep?.label.replace(/\n/g, " ") ?? ""}</span>
          </p>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            aria-label="신청 가이드 열기"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 text-[13px] font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-[var(--color-ink-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 sm:px-4 sm:text-[14px]"
          >
            <HelpCircle size={16} aria-hidden="true" />
            도움말
          </button>
        </div>
      </nav>

      <ApplyGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}
