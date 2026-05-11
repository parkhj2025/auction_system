import { Check } from "lucide-react";
import type { OrderStatus, OrderStatusLogRow } from "@/types/order";
import {
  TIMELINE_STEPS,
  getStatusStep,
  getStatusLabel,
} from "@/lib/order-status";
import { formatKoreanDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * 접수 상태 타임라인 (hybrid paradigm).
 *
 * cycle 1-E-A-2 paradigm 정수:
 * - 모바일 = vertical timeline (overflow-x-auto 회수 / 가독성 ↑)
 * - 데스크탑 = horizontal stepper (광역 공간 활용 paradigm)
 * - 시각 분기 paradigm (완료 green + Check / 진행 중 green + ring + pulse / 대기 gray)
 * - sub-label paradigm (statusLogs 정합 시점 단독 = order_status_log timestamp 광역)
 *
 * cancelled 광역 = 별개 배너 paradigm (timeline 영역 0).
 * StatusTimeline 광역 = 사용자 영역 + admin 영역 양 광역 단일 source paradigm (Lessons [A] 정합).
 * admin 영역 = statusLogs prop 영역 0 paradigm (optional / StatusLogHistory 별개 component 광역).
 */
export function StatusTimeline({
  status,
  statusLogs,
}: {
  status: OrderStatus;
  statusLogs?: OrderStatusLogRow[];
}) {
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
          문의가 있으시면 고객지원팀으로 연락해주세요.
        </p>
      </div>
    );
  }

  // status → step.id mapping paradigm (광역 statusLogs 광역 timestamp 광역 추출)
  // 광역 step.id 광역 정합 시점 단독 timestamp 광역 표기 paradigm
  const getStepTimestamp = (stepId: number): string | null => {
    if (!statusLogs || statusLogs.length === 0) return null;
    // 해당 step.id 광역 정합 시점 진입 timestamp 광역 = to_status getStatusStep === stepId 광역 가장 최근 log
    const matched = statusLogs.find(
      (log) => getStatusStep(log.to_status) === stepId
    );
    return matched ? formatKoreanDate(matched.created_at) : null;
  };

  return (
    <>
      {/* 모바일 vertical timeline */}
      <ol
        className="flex flex-col gap-0 sm:hidden"
        aria-label={`진행 상태: ${getStatusLabel(status)}`}
      >
        {TIMELINE_STEPS.map((step, idx) => {
          const isComplete = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isLast = idx === TIMELINE_STEPS.length - 1;
          const timestamp = getStepTimestamp(idx);

          return (
            <li
              key={step.id}
              className={cn(
                "relative flex gap-4",
                isLast ? "pb-0" : "pb-6"
              )}
            >
              {/* icon column */}
              <div className="relative flex w-10 flex-shrink-0 flex-col items-center">
                <StepCircle
                  isComplete={isComplete}
                  isCurrent={isCurrent}
                  stepNumber={idx + 1}
                  size="sm"
                />
                {/* connecting line (마지막 step 영역 0) */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-1/2 top-8 h-full w-0.5 -translate-x-1/2",
                      isComplete ? "bg-green-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>

              {/* label column */}
              <div className="flex-1 pt-1">
                <p
                  className={cn(
                    "text-base",
                    isComplete || isCurrent
                      ? "font-bold text-[var(--color-ink-900)]"
                      : "font-medium text-[var(--color-ink-400)]"
                  )}
                >
                  {step.label}
                </p>
                {timestamp && (
                  <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                    {timestamp}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* 데스크탑 horizontal stepper */}
      <ol
        className="relative hidden items-start justify-between sm:flex"
        aria-label={`진행 상태: ${getStatusLabel(status)}`}
      >
        {TIMELINE_STEPS.map((step, idx) => {
          const isComplete = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isLast = idx === TIMELINE_STEPS.length - 1;
          const timestamp = getStepTimestamp(idx);

          return (
            <li
              key={step.id}
              className="relative flex flex-1 flex-col items-center"
            >
              <div className="relative flex w-full items-center justify-center">
                <StepCircle
                  isComplete={isComplete}
                  isCurrent={isCurrent}
                  stepNumber={idx + 1}
                  size="md"
                />
                {/* connecting line — 다음 step 광역 연결 (마지막 step 영역 0) */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-1/2 top-5 h-0.5 w-full",
                      isComplete ? "bg-green-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
              <p
                className={cn(
                  "mt-3 text-center text-sm",
                  isComplete || isCurrent
                    ? "font-bold text-[var(--color-ink-900)]"
                    : "font-medium text-[var(--color-ink-400)]"
                )}
              >
                {step.label}
              </p>
              {timestamp && (
                <p className="mt-1 text-center text-xs text-[var(--color-ink-500)]">
                  {timestamp}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}

/**
 * step circle 시각 분기 paradigm.
 * 완료 = bg-green-500 + Check icon
 * 진행 중 = bg-green-500 + ring + animate-pulse + number
 * 대기 = bg-gray-100 + number (gray)
 */
function StepCircle({
  isComplete,
  isCurrent,
  stepNumber,
  size,
}: {
  isComplete: boolean;
  isCurrent: boolean;
  stepNumber: number;
  size: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? 16 : 20;
  const numberClass =
    size === "sm" ? "text-sm font-bold" : "text-base font-bold";

  if (isComplete) {
    return (
      <div
        className={cn(
          "relative z-10 flex shrink-0 items-center justify-center rounded-full bg-green-500",
          sizeClass
        )}
      >
        <Check
          size={iconSize}
          className="text-white"
          strokeWidth={3}
          aria-hidden="true"
        />
      </div>
    );
  }

  if (isCurrent) {
    return (
      <div
        className={cn(
          "relative z-10 flex shrink-0 animate-pulse items-center justify-center rounded-full bg-green-500 ring-4 ring-green-100",
          sizeClass
        )}
      >
        <span className={cn("text-white", numberClass)}>{stepNumber}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative z-10 flex shrink-0 items-center justify-center rounded-full bg-gray-100",
        sizeClass
      )}
    >
      <span className={cn("text-gray-400", numberClass)}>{stepNumber}</span>
    </div>
  );
}
