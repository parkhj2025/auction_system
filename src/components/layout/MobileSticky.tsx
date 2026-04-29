"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_CTA } from "@/lib/navigation";

/**
 * 모바일 하단 고정 CTA.
 * - 모든 페이지에서 수임 전환 경로를 2클릭 이내로 유지 (CLAUDE.md §4-①).
 * - md 이상에서는 숨김 (데스크탑은 상단 GNB CTA가 그 역할을 한다).
 * - 본문 하단 여백: 이 바가 덮지 않도록 body에 pb-20 md:pb-0 적용.
 * - /apply Step 진행 중 글로벌 CTA 오클릭 시 입력 데이터 손실 방지 가드 (Phase 6.5-POST-FIX 후속, 2026-04-19).
 */
export function MobileSticky() {
  const pathname = usePathname();
  // /apply 정확 일치(현재 Step Machine 단일 라우트) 시 Step 진행 중 데이터 손실 방지.
  // 향후 Step별 라우트 분리 시(/apply/step1 등) 조건 확장 필요.
  // /apply/guide 등 하위 정적 페이지는 노출 유지 (입력 데이터 없음 + 자연스러운 신청 전환 경로).
  if (pathname === "/apply") return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-white/95 backdrop-blur md:hidden"
      role="region"
      aria-label="빠른 신청"
    >
      <div className="mx-auto flex w-full max-w-[var(--c-base)] items-center gap-2 px-4 py-3">
        <Link
          href="/analysis"
          className="flex min-h-12 flex-1 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm font-bold text-[var(--color-ink-900)] hover:bg-[var(--color-ink-100)]"
        >
          물건분석 보기
        </Link>
        <Link
          href={PRIMARY_CTA.href}
          className="flex min-h-12 flex-[1.3] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-3 text-sm font-bold text-white shadow-[var(--shadow-card)] hover:bg-black"
        >
          {PRIMARY_CTA.label}
        </Link>
      </div>
    </div>
  );
}
