import type { Metadata } from "next";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { OrderRow } from "@/types/order";
import { OrderCard } from "@/components/my/OrderCard";
import { FilterChips } from "@/components/my/FilterChips";
import {
  STATUS_GROUPS,
  isValidStatusGroup,
  STATUS_GROUP_LABEL,
  type StatusGroup,
} from "@/lib/order-status";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "전체 신청",
  description: "지금까지 신청한 모든 입찰 대리 접수 내역을 확인할 수 있습니다.",
};

type SearchParams = Promise<{ status?: string }>;

export default async function MyOrdersListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status: rawStatus } = await searchParams;
  const active: StatusGroup =
    rawStatus && isValidStatusGroup(rawStatus) ? rawStatus : "all";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let query = supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (active !== "all") {
    query = query.in("status", STATUS_GROUPS[active] as unknown as string[]);
  }

  const { data: orders } = await query;
  const rows = (orders ?? []) as OrderRow[];

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
      <header>
        <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
          Orders
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.015em] leading-[1.2] text-[var(--color-ink-900)] sm:text-3xl">
          전체 신청
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-500)]">
          총 {rows.length}건
        </p>
      </header>

      <div className="mt-6">
        <FilterChips active={active} />
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-16 text-center">
          <Inbox
            size={32}
            className="text-[var(--color-ink-500)]"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-black text-[var(--color-ink-900)]">
              {active === "all"
                ? "접수 내역이 없습니다"
                : `${STATUS_GROUP_LABEL[active]} 상태의 신청이 없습니다`}
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink-500)]">
              {active === "all"
                ? "입찰 대리를 신청해보세요."
                : "다른 상태를 확인하시거나 대시보드로 돌아가세요."}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {active !== "all" ? (
              <Link
                href="/my"
                className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink-900)] hover:border-[var(--color-ink-900)] hover:text-black"
              >
                대시보드로 돌아가기
              </Link>
            ) : null}
            <Link
              href="/apply"
              className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-5 text-sm font-bold text-white hover:bg-black"
            >
              입찰 대리 신청
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {rows.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}
