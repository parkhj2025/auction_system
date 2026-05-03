"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_CTA } from "@/lib/navigation";

/**
 * Phase 1.2 (A-1-2) v5 — Mobile sticky bottom bar (Opus #1 광역 적용).
 * 단일 button "무료 상담 신청" full-width green (이중 button → 단일 통일).
 * - 모든 페이지에서 수임 전환 경로를 1클릭 (CLAUDE.md §4-①).
 * - md 이상에서는 숨김 (데스크탑은 상단 GNB CTA가 그 역할을 한다).
 * - /apply 진행 중 데이터 손실 방지 가드.
 */
export function MobileSticky() {
  const pathname = usePathname();
  if (pathname === "/apply") return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border-1)] bg-white/95 backdrop-blur md:hidden"
      role="region"
      aria-label="무료 상담 신청"
    >
      <div className="container-app flex items-center px-5 py-3">
        <Link
          href={PRIMARY_CTA.href}
          className="flex h-13 w-full items-center justify-center rounded-[14px] bg-[var(--brand-green)] px-4 text-[15px] font-bold text-white shadow-[var(--shadow-button-green)] transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2"
        >
          사건번호 입력하기
        </Link>
      </div>
    </div>
  );
}
