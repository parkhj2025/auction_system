"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMenu, type UserMenuProps } from "@/components/auth/UserMenu";
import { Logo } from "@/components/Logo";

/* Stage 2 cycle 1-A 보강 1+ — TopNav "신청하기" CTA 신규 mount (conversion 파이프라인 강화).
 * 모바일 = hamburger 좌측 inline (Logo·CTA·hamburger 3 column 정합)
 * 데스크탑 = user/login 좌측 inline (광역 우측 CTA + user 정합)
 * 광역 별개 2 Link (className 분기 lg:hidden / hidden lg:inline-flex). */

/* TopNav 본질 nav links (v5 Q5 형준님 결정 — 낙찰사례 폐기 + 경매 인사이트 메인).
 * lib/navigation.ts PRIMARY_NAV (모바일 drawer 본질) 본질 보존. */
const TOPNAV_LINKS = [
  { href: "/about", label: "서비스 소개" },
  { href: "/service", label: "이용 절차" },
  { href: "/insight", label: "경매 인사이트" },
  { href: "/faq", label: "FAQ" },
] as const;

export function TopNav({ user }: { user: UserMenuProps | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* scroll 8px+ 시 border 본질 추가 (Linear paradigm). */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={cn(
        "sticky top-0 z-40 bg-white/80 backdrop-blur-md transition-[border-color] duration-200",
        scrolled ? "border-b border-[var(--border-1)]" : "border-b border-transparent"
      )}
    >
      <div className="container-app flex h-14 items-center justify-between lg:h-16">
        <Logo />

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="주 메뉴"
        >
          {TOPNAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:text-[var(--text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Stage 2 cycle 1-A 보강 1+ — 모바일 CTA (hamburger 좌측 inline). */}
          <Link
            href="/apply"
            className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--brand-green)] px-3 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 lg:hidden"
          >
            신청하기
          </Link>
          {/* Stage 2 cycle 1-A 보강 1+ — 데스크탑 CTA (user/login 좌측 inline). */}
          <Link
            href="/apply"
            className="hidden h-10 items-center justify-center rounded-full bg-[var(--brand-green)] px-5 text-[15px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 lg:inline-flex"
          >
            신청하기
          </Link>
          {user ? (
            <div className="hidden lg:flex lg:items-center">
              <UserMenu {...user} />
            </div>
          ) : (
            <div className="hidden lg:flex lg:items-center">
              <Link
                href="/login"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-1)] text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
                aria-label="로그인"
              >
                <User size={18} strokeWidth={1.75} />
              </Link>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-drawer"
        className={cn("lg:hidden", open ? "block" : "hidden")}
      >
        <div
          className="fixed inset-x-0 top-14 bottom-0 z-30 bg-black/30"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <div className="relative z-40 border-t border-[var(--border-1)] bg-white px-5 py-5 shadow-[var(--shadow-card)]">
          <ul className="flex flex-col gap-1">
            {TOPNAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-4 text-[16px] font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {user ? (
            <div className="mt-3 rounded-2xl border border-[var(--border-1)] px-4 py-3">
              <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                {user.displayName}
              </p>
              {user.email && (
                <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                  {user.email}
                </p>
              )}
              <Link
                href="/my"
                onClick={() => setOpen(false)}
                className="mt-3 flex min-h-11 items-center justify-center rounded-xl border border-[var(--border-1)] px-4 text-sm font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              >
                마이페이지
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-3 flex min-h-12 items-center justify-center rounded-xl border border-[var(--border-1)] px-4 text-[16px] font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
