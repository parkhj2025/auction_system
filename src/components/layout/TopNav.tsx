"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { PRIMARY_NAV, PRIMARY_CTA } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { UserMenu, type UserMenuProps } from "@/components/auth/UserMenu";
import { BRAND_NAME } from "@/lib/constants";

export function TopNav({ user }: { user: UserMenuProps | null }) {
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
    <header className="sticky top-0 z-40 border-b border-[var(--border-1)] bg-white">
      <div className="container-app flex h-14 items-center justify-between lg:h-16">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label={`${BRAND_NAME} 홈`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--text-primary)] text-xs font-bold text-white lg:h-8 lg:w-8 lg:text-sm">
            경
          </span>
          <span className="text-base font-bold tracking-tight text-[var(--text-primary)] lg:text-lg">
            {BRAND_NAME}
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
              className="rounded-md px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:flex md:items-center md:gap-2">
              <Link
                href={PRIMARY_CTA.href}
                className="inline-flex h-9 items-center rounded-lg bg-[var(--text-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-black lg:h-10"
              >
                {PRIMARY_CTA.label}
              </Link>
              <UserMenu {...user} />
            </div>
          ) : (
            <div className="hidden md:flex md:items-center md:gap-2">
              <Link
                href="/login"
                className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] lg:h-10"
              >
                로그인
              </Link>
              <Link
                href={PRIMARY_CTA.href}
                className="inline-flex h-9 items-center rounded-lg bg-[var(--text-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-black lg:h-10"
              >
                {PRIMARY_CTA.label}
              </Link>
            </div>
          )}
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
                  <span className="text-[length:var(--text-body)] font-bold text-[var(--color-ink-900)]">
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
            className="mt-3 flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-4 text-[length:var(--text-body)] font-bold text-white hover:bg-black"
          >
            {PRIMARY_CTA.label}
          </Link>
          {user ? (
            <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3">
              <p className="truncate text-sm font-bold text-[var(--color-ink-900)]">
                {user.displayName}
              </p>
              {user.email && (
                <p className="mt-0.5 truncate text-xs text-[var(--color-ink-500)]">
                  {user.email}
                </p>
              )}
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/my"
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 text-sm font-bold text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
                >
                  마이페이지
                </Link>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-3 flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 text-[length:var(--text-body)] font-bold text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
