"use client";

import { useRouter } from "next/navigation";
import type { StatusGroup } from "@/lib/order-status";
import { STATUS_GROUP_LABEL } from "@/lib/order-status";
import { cn } from "@/lib/utils";

/**
 * cycle 1-E-A-2 — /my/orders FilterChips 광역 5건 component.
 *
 * 광역 paradigm 정수:
 * - chip 5건 = 전체 + 진행 중 + 입금 대기 + 완료 + 취소
 * - URL params paradigm = router.push(`/my/orders?status={group}`) / 'all' 시점 = `/my/orders`
 * - 선택 시각 = bg-[var(--color-ink-900)] + text-white (charcoal #111418)
 * - 비선택 시각 = bg-white + border-[var(--color-ink-200)] + text-[var(--color-ink-700)] + hover
 * - 모바일 paradigm = overflow-x-auto + scrollbar-hide (horizontal scroll)
 * - tap target = 44px (iOS HIG)
 */

const ORDER: StatusGroup[] = [
  "all",
  "in_progress",
  "pending",
  "completed",
  "cancelled",
];

export function FilterChips({ active }: { active: StatusGroup }) {
  const router = useRouter();

  function handleClick(group: StatusGroup) {
    if (group === "all") {
      router.push("/my/orders");
    } else {
      router.push(`/my/orders?status=${group}`);
    }
  }

  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      <div className="flex gap-2 sm:flex-wrap">
        {ORDER.map((group) => {
          const isActive = group === active;
          return (
            <button
              key={group}
              type="button"
              onClick={() => handleClick(group)}
              className={cn(
                "inline-flex h-11 flex-shrink-0 items-center rounded-full border px-4 text-sm font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-900)]/30",
                isActive
                  ? "border-[var(--color-ink-900)] bg-[var(--color-ink-900)] text-white"
                  : "border-[var(--color-ink-200)] bg-white text-[var(--color-ink-700)] hover:border-[var(--color-ink-900)] hover:text-[var(--color-ink-900)]"
              )}
              aria-pressed={isActive}
            >
              {STATUS_GROUP_LABEL[group]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
