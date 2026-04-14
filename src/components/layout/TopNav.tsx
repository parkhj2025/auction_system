"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { PRIMARY_NAV, PRIMARY_CTA } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function TopNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="경매퀵 홈"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-brand-600 text-sm font-black text-white">
            경
          </span>
          <span className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
            경매퀵
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="주 메뉴"
        >
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--color-ink-700)] transition hover:bg-[var(--color-ink-100)] hover:text-[var(--color-ink-900)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={PRIMARY_CTA.href}
            className="hidden h-10 items-center rounded-[var(--radius-md)] bg-brand-600 px-4 text-sm font-bold text-white shadow-[var(--shadow-card)] transition hover:bg-brand-700 md:inline-flex"
          >
            {PRIMARY_CTA.label}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)] md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-drawer"
        className={cn(
          "md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div
          className="fixed inset-x-0 top-16 bottom-0 z-30 bg-black/30"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <div className="relative z-40 border-t border-[var(--color-border)] bg-white px-4 py-4 shadow-[var(--shadow-lift)]">
          <ul className="flex flex-col gap-1">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 flex-col justify-center rounded-[var(--radius-md)] px-4 py-2 hover:bg-[var(--color-ink-100)]"
                >
                  <span className="text-base font-bold text-[var(--color-ink-900)]">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="mt-0.5 text-xs text-[var(--color-ink-500)]">
                      {item.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={PRIMARY_CTA.href}
            onClick={() => setOpen(false)}
            className="mt-3 flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-brand-600 px-4 text-base font-bold text-white hover:bg-brand-700"
          >
            {PRIMARY_CTA.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
