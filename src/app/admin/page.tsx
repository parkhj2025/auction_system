import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { OrderRow } from "@/types/order";
import { StatsCards } from "@/components/admin/StatsCards";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자 대시보드",
};

const ACTIVE_STATUSES = [
  "pending",
  "confirmed",
  "deposit_received",
  "bidding",
] as const;

function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function endOfWeekIso(): string {
  const d = new Date();
  const day = d.getDay(); // 0=일, 6=토
  const daysUntilSunday = (7 - day) % 7;
  d.setDate(d.getDate() + daysUntilSunday);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: recent } = await supabase
    .from("orders")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(20);

  const rows = (recent ?? []) as OrderRow[];

  // 통계 계산 — 작은 데이터셋이라 별도 쿼리 대신 클라이언트 집계로 충분.
  // 정확한 통계는 /admin/orders 필터로 확인하도록 유도.
  const { data: allActive } = await supabase
    .from("orders")
    .select("id, status, deposit_status, property_snapshot")
    .is("deleted_at", null)
    .in("status", ACTIVE_STATUSES);

  const active = (allActive ?? []) as Array<
    Pick<OrderRow, "id" | "status" | "deposit_status" | "property_snapshot">
  >;

  const today = todayIso();
  const weekEnd = endOfWeekIso();

  const pendingCount = active.filter((o) => o.status === "pending").length;
  const depositPendingCount = active.filter(
    (o) =>
      (o.status === "confirmed" || o.status === "deposit_received") &&
      o.deposit_status === "pending"
  ).length;

  const bidDateOf = (o: (typeof active)[number]): string | null => {
    const snap = o.property_snapshot as { bidDate?: string } | null;
    return snap?.bidDate ?? null;
  };

  const todayBidCount = active.filter((o) => bidDateOf(o) === today).length;
  const thisWeekBidCount = active.filter((o) => {
    const bd = bidDateOf(o);
    return bd !== null && bd >= today && bd <= weekEnd;
  }).length;

  return (
    <section className="mx-auto w-full max-w-[var(--c-base)] px-5 py-10 sm:px-8 sm:py-12">
      <header>
        <h1 className="text-h2 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h1">
          대시보드
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-500)]">
          접수 현황과 주요 지표를 한눈에 확인하세요. 전체 내역은{" "}
          <Link
            href="/admin/orders"
            className="font-bold text-[var(--color-ink-900)] hover:text-black"
          >
            접수 목록
          </Link>
          에서 필터링할 수 있습니다.
        </p>
      </header>

      <div className="mt-8">
        <StatsCards
          stats={[
            {
              label: "신규 접수",
              value: pendingCount,
              hint: "서류 확인 대기",
              href: "/admin/orders?status=pending",
              icon: "inbox",
            },
            {
              label: "보증금 미확인",
              value: depositPendingCount,
              hint: "입금 대기 중",
              href: "/admin/orders?status=confirmed",
              icon: "wallet",
              accent: "yellow",
            },
            {
              label: "오늘 입찰",
              value: todayBidCount,
              hint: today,
              href: "/admin/orders",
              icon: "today",
            },
            {
              label: "이번 주 입찰",
              value: thisWeekBidCount,
              hint: `~ ${weekEnd}`,
              href: "/admin/orders",
              icon: "week",
            },
          ]}
        />
      </div>

      <div className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-black text-[var(--color-ink-900)]">
            최근 접수 {rows.length}건
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[var(--color-ink-900)] hover:text-black"
          >
            전체 목록 보기
          </Link>
        </div>
        <div className="mt-4">
          <AdminOrdersTable orders={rows} />
        </div>
      </div>
    </section>
  );
}
