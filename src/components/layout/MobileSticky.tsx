import Link from "next/link";
import { PRIMARY_CTA } from "@/lib/navigation";

/**
 * 모바일 하단 고정 CTA.
 * - 모든 페이지에서 수임 전환 경로를 2클릭 이내로 유지 (CLAUDE.md §4-①).
 * - md 이상에서는 숨김 (데스크탑은 상단 GNB CTA가 그 역할을 한다).
 * - 본문 하단 여백: 이 바가 덮지 않도록 body에 pb-20 md:pb-0 적용.
 */
export function MobileSticky() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-white/95 backdrop-blur md:hidden"
      role="region"
      aria-label="빠른 신청"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3">
        <Link
          href="/analysis"
          className="flex min-h-12 flex-1 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm font-bold text-[var(--color-ink-900)] hover:bg-[var(--color-ink-100)]"
        >
          물건분석 보기
        </Link>
        <Link
          href={PRIMARY_CTA.href}
          className="flex min-h-12 flex-[1.3] items-center justify-center rounded-[var(--radius-md)] bg-brand-600 px-3 text-sm font-bold text-white shadow-[var(--shadow-card)] hover:bg-brand-700"
        >
          {PRIMARY_CTA.label}
        </Link>
      </div>
    </div>
  );
}
