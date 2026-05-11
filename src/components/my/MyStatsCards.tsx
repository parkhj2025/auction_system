import Link from "next/link";
import { Inbox, Wallet, CheckCircle2, List } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StatusGroup } from "@/lib/order-status";
import { STATUS_GROUP_LABEL } from "@/lib/order-status";

/**
 * cycle 1-E-A-2 — /my dashboard stats 카드 4개 component.
 *
 * 광역 paradigm 정수:
 * - admin StatsCards 광역 재사용 paradigm 회수 (별개 component 정수)
 * - 시각 토큰 = cycle 1-E-A 카드 paradigm 정합 차용 (rounded-2xl + border-gray-200 + p-5 + hover:shadow-md)
 * - drill-down href paradigm = /my/orders?status={group} (FilterChips 광역 정합)
 * - icon paradigm = lucide-react (Inbox / Wallet / CheckCircle2 / List)
 * - grid paradigm = 모바일 2-col + 데스크탑 4-col
 */

type StatGroup = Exclude<StatusGroup, "cancelled">;

const ICONS: Record<StatGroup, LucideIcon> = {
  in_progress: Inbox,
  pending: Wallet,
  completed: CheckCircle2,
  all: List,
};

const ORDER: StatGroup[] = ["in_progress", "pending", "completed", "all"];

export function MyStatsCards({
  counts,
}: {
  counts: Record<StatGroup, number>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {ORDER.map((group) => {
        const Icon = ICONS[group];
        const href =
          group === "all" ? "/my/orders" : `/my/orders?status=${group}`;
        return (
          <Link
            key={group}
            href={href}
            className="group flex min-h-[7.5rem] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:border-[var(--color-ink-900)] hover:shadow-md"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-50)] text-[var(--color-ink-900)]">
              <Icon size={18} aria-hidden="true" />
            </span>
            <div className="mt-3">
              <p className="text-xs font-bold text-[var(--color-ink-500)]">
                {STATUS_GROUP_LABEL[group]}
              </p>
              <p className="mt-1 text-2xl font-black tabular-nums text-[var(--color-ink-900)] sm:text-3xl">
                {counts[group]}
                <span className="ml-0.5 text-sm font-bold text-[var(--color-ink-500)]">
                  건
                </span>
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
