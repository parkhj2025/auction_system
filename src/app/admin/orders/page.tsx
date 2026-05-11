import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { OrderRow, OrderStatus } from "@/types/order";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { getStatusLabel } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "접수 목록",
};

const STATUS_FILTERS: Array<{ value: OrderStatus | "all"; label: string }> = [
  { value: "all", label: "전체" },
  { value: "pending", label: getStatusLabel("pending") },
  { value: "confirmed", label: getStatusLabel("confirmed") },
  { value: "deposit_received", label: getStatusLabel("deposit_received") },
  { value: "bidding", label: getStatusLabel("bidding") },
  { value: "won", label: getStatusLabel("won") },
  { value: "lost", label: getStatusLabel("lost") },
  { value: "settled", label: getStatusLabel("settled") },
  { value: "cancelled", label: getStatusLabel("cancelled") },
];

type SearchParams = Promise<{ status?: string }>;

export default async function AdminOrdersListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status: rawStatus } = await searchParams;
  const activeFilter = (rawStatus ?? "all") as OrderStatus | "all";

  const supabase = await createClient();
  // cycle 1-E-B-β — admin = 광역 view paradigm (deleted_at filter 영역 0 / soft delete case 광역 회수 정수)
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (activeFilter !== "all") {
    query = query.eq("status", activeFilter);
  }

  const { data: orders } = await query;
  const rows = (orders ?? []) as OrderRow[];

  // cycle 1-E-B-γ — super_admin 광역 권한 검수 (행 광역 trash icon button 진입 분기 paradigm)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isSuperAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isSuperAdmin = profile?.role === "super_admin";
  }

  return (
    <section className="mx-auto w-full max-w-[var(--c-base)] px-5 py-10 sm:px-8 sm:py-12">
      <header>
        <h1 className="text-h2 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h1">
          접수 목록
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-500)]">
          상태별 필터링 — 총 {rows.length}건
        </p>
      </header>

      {/* 필터 탭 */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const href =
            f.value === "all"
              ? "/admin/orders"
              : `/admin/orders?status=${f.value}`;
          const isActive = activeFilter === f.value;
          return (
            <Link
              key={f.value}
              href={href}
              className={cn(
                "inline-flex min-h-9 items-center rounded-full border px-4 text-xs font-bold transition",
                isActive
                  ? "border-[var(--color-ink-900)] bg-[var(--color-ink-900)] text-white"
                  : "border-[var(--color-border)] bg-white text-[var(--color-ink-700)] hover:border-[var(--color-ink-900)] hover:text-black"
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <AdminOrdersTable orders={rows} isSuperAdmin={isSuperAdmin} />
      </div>
    </section>
  );
}
