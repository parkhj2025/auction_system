import type { Metadata } from "next";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { OrderRow } from "@/types/order";
import { OrderCard } from "@/components/my/OrderCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "마이페이지",
  description:
    "내 접수 현황과 진행 상태를 한 곳에서 확인하세요. 진행 중 접수, 최근 완료, 내 정보 관리.",
};

const ACTIVE_STATUSES = [
  "pending",
  "confirmed",
  "deposit_received",
  "bidding",
  "won",
  "lost",
] as const;

const COMPLETED_STATUSES = ["settled", "deposit_returned", "cancelled"] as const;

export default async function MyDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 미들웨어가 이미 보호하지만 타입 내로잉용 가드
  if (!user) return null;

  const [{ data: activeOrders }, { data: completedOrders }] = await Promise.all(
    [
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .in("status", ACTIVE_STATUSES)
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .in("status", COMPLETED_STATUSES)
        .order("created_at", { ascending: false })
        .limit(3),
    ]
  );

  const active = (activeOrders ?? []) as OrderRow[];
  const completed = (completedOrders ?? []) as OrderRow[];

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            My Page
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl">
            접수 현황
          </h1>
        </div>
        <Link
          href="/my/profile"
          className="inline-flex min-h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm font-bold text-[var(--color-ink-700)] hover:border-[var(--color-ink-900)] hover:text-black"
        >
          내 정보
        </Link>
      </header>

      {/* 진행 중 접수 */}
      <div className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
            진행 중
          </h2>
          <Link
            href="/my/orders"
            className="text-xs font-bold text-[var(--color-ink-900)] hover:text-black"
          >
            전체 내역 보기
          </Link>
        </div>

        {active.length === 0 ? (
          <EmptyActive />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {active.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      {/* 최근 완료 */}
      {completed.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
            최근 완료
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function EmptyActive() {
  return (
    <div className="mt-4 flex flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-12 text-center">
      <Inbox
        size={32}
        className="text-[var(--color-ink-500)]"
        aria-hidden="true"
      />
      <div>
        <p className="text-sm font-black text-[var(--color-ink-900)]">
          아직 접수 내역이 없습니다
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-500)]">
          물건분석을 둘러보고 입찰 대리를 신청해보세요.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/analysis"
          className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink-900)] hover:border-[var(--color-ink-900)] hover:text-black"
        >
          물건분석 보기
        </Link>
        <Link
          href="/apply"
          className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-5 text-sm font-bold text-white hover:bg-black"
        >
          입찰 대리 신청
        </Link>
      </div>
    </div>
  );
}
