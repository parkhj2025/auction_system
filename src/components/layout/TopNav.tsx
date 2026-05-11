"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMenu, type UserMenuProps } from "@/components/auth/UserMenu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

/* cycle 1-E-A-3-γ — TopNav 인증 button 단순화:
 * - "신청하기" CTA 영구 폐기 (Hero "조회하기" 단독 진입점 / 중복 회수)
 * - "로그인" + "회원가입" 통합 → "로그인" 단독 (Google OAuth handle_new_user trigger 자동 가입 paradigm)
 * - "로그인" button 시각 = primary CTA (brand-green solid + white text + font-bold)
 * - 모바일 상단 우측 = hamburger 단독
 * - 모바일 드로어 비로그인 = "로그인" 단독 button (primary CTA 시각 일관성)
 *
 * cycle 1-E-A-3-β 영구 보존 paradigm:
 * - 모바일 드로어 로그인 시점 = 사용자 정보 + 마이페이지 + 내 정보 + (조건부) 관리자 + separator + 로그아웃 button
 * - 모바일 드로어 로그아웃 button = red-600 + 즉시 signOut 실행 (산업 표준 paradigm 정합)
 */

const TOPNAV_LINKS = [
  { href: "/about", label: "서비스 소개" },
  { href: "/service", label: "이용 절차" },
  { href: "/insight", label: "경매 인사이트" },
  { href: "/faq", label: "FAQ" },
] as const;

export function TopNav({ user }: { user: UserMenuProps | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

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

  async function handleMobileLogout() {
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

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
          {user ? (
            <div className="hidden lg:flex lg:items-center">
              <UserMenu {...user} />
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden h-10 items-center justify-center rounded-full bg-[var(--brand-green)] px-5 text-[15px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 lg:inline-flex"
            >
              로그인
            </Link>
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
            <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border-1)]">
              <div className="px-4 py-3">
                <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                  {user.displayName}
                </p>
                {user.email && (
                  <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                    {user.email}
                  </p>
                )}
              </div>
              <Link
                href="/my"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-t border-[var(--border-1)] px-4 text-[15px] font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)]"
              >
                마이페이지
              </Link>
              <Link
                href="/my/profile"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-t border-[var(--border-1)] px-4 text-[15px] font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)]"
              >
                내 정보
              </Link>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-t border-[var(--border-1)] px-4 text-[15px] font-bold text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--bg-secondary)]"
                >
                  관리자
                </Link>
              )}
              <button
                type="button"
                onClick={handleMobileLogout}
                className="flex min-h-12 w-full items-center border-t border-[var(--border-1)] px-4 text-left text-[15px] font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--brand-green)] px-4 text-[16px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)]"
              >
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
