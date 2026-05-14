"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  INSIGHT_NAV,
  isAnalysisSub,
  iconPath,
  type NavSelection,
} from "@/lib/insightMock";
import { ChevronRightIcon } from "@/components/insight/icons";

/* work-012 정정 3 — /insight 카테고리 nav.
 * 정정 영역 3: 5 카테고리 가운데 정렬 + "전체보기" 우측 끝.
 * 구조 보존: 4 독립 + 1 그룹("무료 물건분석") + 그룹 클릭 = sub nav 펼침 (하위 8건).
 * 아이콘 = Gemini PNG 풀컬러 (next/image / 아이콘 라이브러리 미사용). */

function IconTile({
  slug,
  label,
  size,
  active,
}: {
  slug: string;
  label: string;
  size: number;
  active: boolean;
}) {
  return (
    <span
      className={
        "flex items-center justify-center overflow-hidden rounded-2xl border bg-white transition-all " +
        (active
          ? "border-[var(--brand-green)] ring-2 ring-[var(--brand-green)]/35"
          : "border-[var(--color-border)] group-hover:border-[var(--brand-green)]/45")
      }
      style={{ width: size, height: size }}
    >
      <Image
        src={iconPath(slug)}
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function InsightCategoryNav({
  active,
  onSelect,
}: {
  active: NavSelection;
  onSelect: (next: NavSelection) => void;
}) {
  const expanded = active === "analysis" || isAnalysisSub(active);
  const group = INSIGHT_NAV.find((n) => n.kind === "group");

  return (
    <nav
      aria-label="인사이트 카테고리"
      className="border-b border-[var(--color-border)] bg-white"
    >
      <div className="mx-auto w-full max-w-7xl px-5">
        {/* 메인 nav: 5 카테고리 가운데 정렬 + 전체보기 우측 끝. */}
        <div className="relative">
          <ul className="flex justify-start gap-5 overflow-x-auto py-6 pr-24 lg:justify-center lg:gap-4">
            {INSIGHT_NAV.map((item) => {
              const isGroup = item.kind === "group";
              const isActive = isGroup ? expanded : active === item.slug;
              return (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() =>
                      isGroup
                        ? onSelect(expanded ? "all" : "analysis")
                        : onSelect(item.slug)
                    }
                    aria-pressed={isActive}
                    aria-expanded={isGroup ? expanded : undefined}
                    className="group flex w-[76px] flex-col items-center gap-2 rounded-xl py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45 focus-visible:ring-offset-2 lg:w-[88px]"
                  >
                    <IconTile
                      slug={item.slug}
                      label={item.label}
                      size={64}
                      active={isActive}
                    />
                    <span
                      className={
                        "flex items-center gap-0.5 text-center text-[12px] font-semibold leading-tight lg:text-[13px] " +
                        (isActive
                          ? "text-[#111418]"
                          : "text-[var(--color-ink-500)]")
                      }
                    >
                      {item.label}
                      {isGroup && (
                        <ChevronRightIcon
                          size={13}
                          className={
                            "transition-transform " +
                            (expanded ? "rotate-90" : "")
                          }
                        />
                      )}
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
              "absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg bg-white px-3 py-2 text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45 focus-visible:ring-offset-2 lg:text-[14px] " +
              (active === "all"
                ? "text-[var(--brand-green)]"
                : "text-[var(--color-ink-500)] hover:text-[#111418]")
            }
          >
            전체보기
            <ChevronRightIcon size={16} />
          </button>
        </div>

        {/* sub nav: "무료 물건분석" 그룹 하위 8 종류 (펼침 시 단독 노출). */}
        <AnimatePresence initial={false}>
          {expanded && group && group.kind === "group" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <ul className="flex justify-start gap-4 overflow-x-auto border-t border-[var(--color-border)] py-5 lg:justify-center lg:gap-5">
                {group.children.map((sub) => {
                  const isActive = active === sub.slug;
                  return (
                    <li key={sub.slug}>
                      <button
                        type="button"
                        onClick={() => onSelect(sub.slug)}
                        aria-pressed={isActive}
                        className="group flex w-[64px] flex-col items-center gap-1.5 rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45 focus-visible:ring-offset-2 lg:w-[72px]"
                      >
                        <IconTile
                          slug={sub.slug}
                          label={sub.label}
                          size={48}
                          active={isActive}
                        />
                        <span
                          className={
                            "text-center text-[11px] font-semibold leading-tight lg:text-[12px] " +
                            (isActive
                              ? "text-[#111418]"
                              : "text-[var(--color-ink-500)]")
                          }
                        >
                          {sub.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
