import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function MyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-5xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs font-semibold text-[var(--color-ink-500)]"
          >
            <Link href="/" className="hover:text-[var(--color-ink-900)]">
              홈
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <Link href="/my" className="hover:text-[var(--color-ink-900)]">
              마이페이지
            </Link>
          </nav>
        </div>
      </section>

      <div className="flex-1">{children}</div>
    </main>
  );
}
