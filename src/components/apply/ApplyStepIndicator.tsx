import { Check } from "lucide-react";
import { APPLY_STEPS, type ApplyStepId } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ApplyStepIndicator({
  current,
  completed,
}: {
  current: ApplyStepId;
  completed: Set<ApplyStepId>;
}) {
  const currentIndex = APPLY_STEPS.findIndex((s) => s.id === current);

  return (
    <nav
      aria-label="신청 진행 단계"
      className="border-b border-[var(--color-border)] bg-white"
    >
      <ol className="mx-auto flex w-full max-w-5xl items-center gap-0 overflow-x-auto px-4 py-5 sm:px-8">
        {APPLY_STEPS.map((step, i) => {
          const isCompleted = completed.has(step.id);
          const isCurrent = step.id === current;
          const isPast = i < currentIndex;

          return (
            <li
              key={step.id}
              className="flex min-w-max flex-1 items-center gap-2 sm:gap-2"
            >
              <div className="flex items-center gap-2 sm:gap-2">
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition",
                    isCompleted || isPast
                      ? "bg-[var(--color-ink-900)] text-white"
                      : isCurrent
                        ? "bg-[var(--color-ink-900)] text-white ring-4 ring-[var(--color-ink-900)]/15"
                        : "border border-[var(--color-border)] bg-white text-[var(--color-ink-500)]"
                  )}
                >
                  {isCompleted || isPast ? (
                    <Check size={14} aria-hidden="true" />
                  ) : (
                    i + 1
                  )}
                </span>
                <div className="hidden flex-col sm:flex">
                  <span
                    className={cn(
                      "text-[11px] font-black uppercase tracking-wider",
                      isCurrent
                        ? "text-[var(--color-ink-900)]"
                        : "text-[var(--color-ink-500)]"
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-[var(--color-ink-500)]">
                    {step.hint}
                  </span>
                </div>
              </div>
              {i < APPLY_STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "mx-2 h-px flex-1 sm:mx-3",
                    isPast ? "bg-[var(--color-ink-900)]" : "bg-[var(--color-border)]"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
