"use client";

import {
  BarChart3,
  BookOpen,
  Building2,
  ChevronRight,
  Compass,
  FileSearch,
  Route,
  type LucideIcon,
} from "lucide-react";
import { INSIGHT_CATEGORIES, type InsightCategorySlug } from "@/lib/insightMock";

/* work-012 — /insight 카테고리 nav (정정 영역 2).
 * 6 카테고리 + "전체보기" 우측 끝. 아이콘 = placeholder (사후 Gemini PNG 일러스트 교체).
 * 카테고리 클릭 = 해당 list 단독 노출 (별개 page 진입 0). */

export const CATEGORY_ICON: Record<InsightCategorySlug, LucideIcon> = {
  process: Route,
  glossary: BookOpen,
  usage: Building2,
  analysis: FileSearch,
  data: BarChart3,
  guide: Compass,
};

export type NavSelection = InsightCategorySlug | "all";

export function InsightCategoryNav({
  active,
  onSelect,
}: {
  active: NavSelection;
  onSelect: (next: NavSelection) => void;
}) {
  return (
    <nav
      aria-label="인사이트 카테고리"
      className="border-b border-[var(--color-border)] bg-white"
    >
      <div className="container-app w-full">
        <div className="flex items-center gap-5 overflow-x-auto py-6 lg:justify-between lg:gap-2">
          <ul className="flex shrink-0 items-start gap-5 lg:gap-2">
            {INSIGHT_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICON[cat.slug];
              const isActive = active === cat.slug;
              return (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => onSelect(cat.slug)}
                    aria-pressed={isActive}
                    className="group flex w-[68px] flex-col items-center gap-2 rounded-xl py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45 focus-visible:ring-offset-2 lg:w-[88px]"
                  >
                    <span
                      className={
                        "flex h-14 w-14 items-center justify-center rounded-full transition-colors lg:h-16 lg:w-16 " +
                        (isActive
                          ? "bg-[var(--brand-green)] text-white"
                          : "bg-[var(--color-ink-100)] text-[#111418] group-hover:bg-[var(--brand-green-soft)]")
                      }
                    >
                      <Icon
                        size={26}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </span>
                    <span
                      className={
                        "text-center text-[12px] font-semibold leading-tight lg:text-[13px] " +
                        (isActive ? "text-[#111418]" : "text-[var(--color-ink-500)]")
                      }
                    >
                      {cat.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* "전체보기" 우측 끝 + → 화살표. */}
          <button
            type="button"
            onClick={() => onSelect("all")}
            aria-pressed={active === "all"}
            className={
              "flex shrink-0 items-center gap-1 self-center rounded-lg px-3 py-2 text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45 focus-visible:ring-offset-2 lg:text-[14px] " +
              (active === "all"
                ? "text-[var(--brand-green)]"
                : "text-[var(--color-ink-500)] hover:text-[#111418]")
            }
          >
            전체보기
            <ChevronRight size={16} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  );
}
