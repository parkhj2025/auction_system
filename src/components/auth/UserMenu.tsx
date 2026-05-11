"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogoutConfirmModal } from "./LogoutConfirmModal";

export type UserMenuProps = {
  displayName: string;
  email: string | null;
  initial: string;
  /** cycle 1-E-B 신규 — profiles.role 정합 시점 단독 "관리자" link 표기 paradigm. */
  isAdmin: boolean;
};

/**
 * cycle 1-E-A-3 — UserMenu dropdown paradigm 정수:
 * - focus-visible ring 광역 menu item 광역 (룰 33-1 정합)
 * - 로그아웃 destructive 색감 (red-600 text + red-50 hover bg + red-700 hover text)
 * - dropdown viewport overflow 방지 (max-w-[calc(100vw-16px)])
 * - 로그아웃 click → LogoutConfirmModal pop paradigm
 */
export function UserMenu({ displayName, email, initial, isAdmin }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function handleLogoutClick() {
    setOpen(false);
    setLogoutOpen(true);
  }

  return (
    <>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="사용자 메뉴"
          aria-expanded={open}
          aria-haspopup="menu"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-sm font-black text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
        >
          {initial}
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-12 z-50 w-60 max-w-[calc(100vw-16px)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lift)]"
          >
            <div className="border-b border-[var(--color-border)] px-4 py-3">
              <p className="truncate text-sm font-bold text-[var(--color-ink-900)]">
                {displayName}
              </p>
              {email && (
                <p className="mt-0.5 truncate text-xs text-[var(--color-ink-500)]">
                  {email}
                </p>
              )}
            </div>
            <div className="py-1">
              <Link
                href="/my"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-ink-100)] focus-visible:bg-[var(--color-ink-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-green)]/40"
                role="menuitem"
              >
                마이페이지
              </Link>
              <Link
                href="/my/orders"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-ink-100)] focus-visible:bg-[var(--color-ink-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-green)]/40"
                role="menuitem"
              >
                신청 내역
              </Link>
              <Link
                href="/my/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-ink-100)] focus-visible:bg-[var(--color-ink-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-green)]/40"
                role="menuitem"
              >
                내 정보
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="block border-t border-[var(--color-border)] px-4 py-2.5 text-sm font-bold text-[var(--color-ink-900)] transition-colors duration-150 hover:bg-[var(--color-ink-100)] focus-visible:bg-[var(--color-ink-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-green)]/40"
                  role="menuitem"
                >
                  관리자
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full border-t border-[var(--color-border)] px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700 focus-visible:bg-red-50 focus-visible:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-600/40"
                role="menuitem"
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>

      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      />
    </>
  );
}
