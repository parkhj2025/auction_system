"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type UserMenuProps = {
  displayName: string;
  email: string | null;
  initial: string;
  /** cycle 1-E-B 신규 — profiles.role 정합 시점 단독 "관리자" link 표기 paradigm. */
  isAdmin: boolean;
};

export function UserMenu({ displayName, email, initial, isAdmin }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="사용자 메뉴"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-sm font-black text-white transition hover:bg-black"
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lift)]"
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
              className="block px-4 py-2.5 text-sm font-medium text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
              role="menuitem"
            >
              마이페이지
            </Link>
            <Link
              href="/my/orders"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
              role="menuitem"
            >
              접수 내역
            </Link>
            <Link
              href="/my/profile"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
              role="menuitem"
            >
              내 정보
            </Link>
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
              role="menuitem"
            >
              입찰 대리 신청
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block border-t border-[var(--color-border)] px-4 py-2.5 text-sm font-bold text-[var(--color-ink-900)] hover:bg-[var(--color-ink-100)]"
                role="menuitem"
              >
                관리자
              </Link>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full border-t border-[var(--color-border)] px-4 py-2.5 text-left text-sm font-medium text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
              role="menuitem"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
