import Link from "next/link";
import { Inbox, Wallet, CalendarDays, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type Stat = {
  label: string;
  value: number;
  hint: string;
  href: string;
  icon: "inbox" | "wallet" | "today" | "week";
  accent?: "blue" | "yellow";
};

const ICONS = {
  inbox: Inbox,
  wallet: Wallet,
  today: CalendarDays,
  week: Calendar,
};

export function StatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = ICONS[stat.icon];
        return (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-sm transition hover:border-brand-600 hover:shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)]",
                  stat.accent === "yellow"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-brand-50 text-brand-700"
                )}
              >
                <Icon size={18} aria-hidden="true" />
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-ink-500)]">
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-black tabular-nums text-[var(--color-ink-900)]">
                {stat.value}
                <span className="ml-0.5 text-sm font-bold text-[var(--color-ink-500)]">
                  건
                </span>
              </p>
              <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                {stat.hint}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
