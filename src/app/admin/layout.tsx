import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col bg-[var(--color-surface-muted)]">
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-5 sm:px-6 sm:pt-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-white">
              <Shield size={12} aria-hidden="true" />
            </span>
            <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-700)]">
              관리자
            </p>
          </div>
          <nav
            aria-label="Breadcrumb"
            className="mt-3 flex items-center gap-1 text-xs font-semibold text-[var(--color-ink-500)]"
          >
            <Link href="/admin" className="hover:text-[var(--color-ink-900)]">
              대시보드
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <Link
              href="/admin/orders"
              className="hover:text-[var(--color-ink-900)]"
            >
              접수 목록
            </Link>
          </nav>
        </div>
      </section>

      <div className="flex-1">{children}</div>
    </main>
  );
}
