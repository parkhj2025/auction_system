import { Check } from "lucide-react";
import type { OrderStatus } from "@/types/order";
import { TIMELINE_STEPS, getStatusStep, getStatusLabel } from "@/lib/order-status";
import { cn } from "@/lib/utils";

/**
 * 접수 상태 타임라인 (가로 스텝 인디케이터).
 * Phase 1 ApplyStepIndicator 스타일과 일관성 유지.
 * cancelled는 별도 배너 표시 (타임라인 아님).
 */
export function StatusTimeline({ status }: { status: OrderStatus }) {
  const currentStep = getStatusStep(status);

  if (status === "cancelled") {
    return (
      <div
        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-4"
        role="status"
      >
        <p className="text-sm font-bold text-[var(--color-ink-700)]">
          접수가 취소되었습니다
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-500)]">
          문의가 있으시면 카카오톡 채널로 연락해주세요.
        </p>
      </div>
    );
  }

  return (
    <ol
      className="flex items-start gap-1 overflow-x-auto pb-1"
      aria-label={`진행 상태: ${getStatusLabel(status)}`}
    >
      {TIMELINE_STEPS.map((step, idx) => {
        const isComplete = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isFuture = idx > currentStep;

        return (
          <li key={step.id} className="flex min-w-[92px] flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {/* 왼쪽 라인 */}
              <div
                className={cn(
                  "h-0.5 flex-1",
                  idx === 0
                    ? "invisible"
                    : isComplete || isCurrent
                      ? "bg-brand-600"
                      : "bg-[var(--color-border)]"
                )}
              />
              {/* 원형 마커 */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black",
                  isComplete &&
                    "border-brand-600 bg-brand-600 text-white",
                  isCurrent &&
                    "border-brand-600 bg-white text-brand-700 shadow-[0_0_0_4px_rgba(37,99,235,0.15)]",
                  isFuture &&
                    "border-[var(--color-border)] bg-white text-[var(--color-ink-500)]"
                )}
              >
                {isComplete ? (
                  <Check size={14} aria-hidden="true" />
                ) : (
                  idx + 1
                )}
              </div>
              {/* 오른쪽 라인 */}
              <div
                className={cn(
                  "h-0.5 flex-1",
                  idx === TIMELINE_STEPS.length - 1
                    ? "invisible"
                    : isComplete
                      ? "bg-brand-600"
                      : "bg-[var(--color-border)]"
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 text-center text-[11px] font-bold leading-tight sm:text-xs",
                (isComplete || isCurrent) && "text-[var(--color-ink-900)]",
                isFuture && "text-[var(--color-ink-500)]"
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
