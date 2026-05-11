import type { Metadata } from "next";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { MyStatsCards } from "@/components/my/MyStatsCards";
import { STATUS_GROUPS } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "내 신청",
  description: "신청 상태를 한눈에 확인하세요.",
};

export default async function MyDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 미들웨어가 이미 보호하지만 타입 내로잉용 가드
  if (!user) return null;

  // cycle 1-E-A-2 — dashboard counts fetch (status + count 광역 단일 query / 클라이언트 집계)
  const { data: ordersData } = await supabase
    .from("orders")
    .select("status")
    .eq("user_id", user.id)
    .is("deleted_at", null);

  const orders = (ordersData ?? []) as Array<{ status: string }>;
  const totalCount = orders.length;

  const countOf = (groupKey: keyof typeof STATUS_GROUPS) =>
    orders.filter((o) =>
      (STATUS_GROUPS[groupKey] as readonly string[]).includes(o.status)
    ).length;

  const counts = {
    in_progress: countOf("in_progress"),
    pending: countOf("pending"),
    completed: countOf("completed"),
    all: totalCount,
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
      <header className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            My Page
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-[-0.015em] leading-[1.2] text-[var(--color-ink-900)] sm:text-3xl">
            내 신청
          </h1>
          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            신청 상태를 한눈에 확인하세요.
          </p>
        </div>
        <Link
          href="/my/profile"
          className="inline-flex min-h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm font-bold text-[var(--color-ink-700)] hover:border-[var(--color-ink-900)] hover:text-black"
        >
          내 정보
        </Link>
      </header>

      {totalCount === 0 ? (
        <EmptyActive />
      ) : (
        <div className="mt-8">
          <MyStatsCards counts={counts} />
        </div>
      )}
    </section>
  );
}

function EmptyActive() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-12 text-center">
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
          경매 인사이트를 둘러보고 입찰 대리를 신청해보세요.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/insight"
          className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink-900)] hover:border-[var(--color-ink-900)] hover:text-black"
        >
          경매 인사이트 보기
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
