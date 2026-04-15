import type { Metadata } from "next";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { OrderRow } from "@/types/order";
import { OrderCard } from "@/components/my/OrderCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "접수 내역",
  description: "지금까지 신청한 모든 입찰 대리 접수 내역을 확인할 수 있습니다.",
};

export default async function MyOrdersListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const rows = (orders ?? []) as OrderRow[];

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header>
        <p className="text-xs font-black uppercase tracking-wider text-brand-600">
          Orders
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl">
          전체 접수 내역
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-500)]">
          총 {rows.length}건
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-16 text-center">
          <Inbox
            size={32}
            className="text-[var(--color-ink-500)]"
            aria-hidden="true"
          />
          <p className="text-sm font-black text-[var(--color-ink-900)]">
            접수 내역이 없습니다
          </p>
          <Link
            href="/apply"
            className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700"
          >
            입찰 대리 신청
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {rows.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}
