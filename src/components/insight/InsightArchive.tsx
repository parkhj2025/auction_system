"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ContentCard } from "@/components/common/ContentCard";
import type { InsightCardData, InsightCardType } from "@/lib/content";
import { cn } from "@/lib/utils";

/* /insight v2 archive (work-012 재구축 v2).
 * 검색 (client useState) + type tab + AND filter + ContentCard grid 광역 paradigm.
 * sticky 영역 = 검색 + tab 양측 단독 (헤더 = scroll 사후 disappear).
 * 미세 그린 3 영역: 활성 tab underline + 검색 focus border + ContentCard 제목 hover. */

type TabValue = "all" | InsightCardType;

const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "analysis", label: "분석" },
  { value: "guide", label: "가이드" },
  { value: "news", label: "뉴스" },
  { value: "data", label: "데이터" },
];

function normalize(s: string): string {
  return s.normalize("NFC").toLowerCase();
}

export function InsightArchive({ cards }: { cards: InsightCardData[] }) {
  const [tab, setTab] = useState<TabValue>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return cards.filter((c) => {
      if (tab !== "all" && c.type !== tab) return false;
      if (!q) return true;
      const hay = normalize([c.title, c.subtitle, c.typeLabel].join(" "));
      return hay.includes(q);
    });
  }, [cards, tab, query]);

  const hasFilter = tab !== "all" || query.trim().length > 0;
  const clearAll = () => {
    setTab("all");
    setQuery("");
  };

  return (
    <>
      {/* sticky 영역 — 검색 + tab 양측 단독 (헤더 = scroll 사후 disappear). */}
      <section
        aria-label="자료실 필터"
        className="sticky top-16 z-20 border-b border-[var(--color-border)] bg-white/95 backdrop-blur"
      >
        <div className="mx-auto w-full max-w-[var(--c-base)] px-5 sm:px-8">
          {/* 검색 bar */}
          <div className="pt-4">
            <label htmlFor="insight-search" className="sr-only">
              제목, 키워드 검색
            </label>
            <div className="group relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="insight-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="제목, 키워드 검색"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-[14px] text-[var(--color-ink-900)] placeholder:text-gray-400 transition-colors focus:border-[var(--brand-green)] focus:bg-white focus:outline-none"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="검색어 지우기"
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* type tab */}
          <nav
            aria-label="자료실 카테고리"
            className="-mb-px flex gap-6 overflow-x-auto pt-4"
            role="tablist"
          >
            {TABS.map((t) => {
              const isActive = tab === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setTab(t.value)}
                  className={cn(
                    "shrink-0 border-b-2 px-1 py-3 text-[14px] transition-colors lg:text-[15px]",
                    isActive
                      ? "border-[var(--brand-green)] font-bold text-[var(--color-ink-900)]"
                      : "border-transparent font-medium text-gray-500 hover:text-[var(--color-ink-900)]"
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* 결과 grid */}
      <section className="mx-auto w-full max-w-[var(--c-base)] px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-sm font-semibold text-[var(--color-ink-500)]">
          총{" "}
          <strong className="tabular-nums text-[var(--color-ink-900)]">
            {filtered.length}
          </strong>
          건
        </p>

        {filtered.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-[15px] font-semibold text-[var(--color-ink-900)]">
              검색 결과 0건
            </p>
            <p className="text-[13px] text-[var(--color-ink-500)]">
              검색어 또는 카테고리 변경 검수.
            </p>
            {hasFilter && (
              <button
                type="button"
                onClick={clearAll}
                className="mt-2 inline-flex h-9 items-center rounded-full border border-[var(--color-ink-200)] bg-white px-4 text-[13px] font-medium text-[var(--color-ink-700)] transition-colors hover:border-[var(--color-ink-900)] hover:text-[var(--color-ink-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45"
              >
                전체 보기
              </button>
            )}
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((card) => (
              <li key={card.id}>
                <ContentCard
                  href={card.href}
                  eyebrow={card.typeLabel}
                  title={card.title}
                  subtitle={card.subtitle || undefined}
                  date={card.publishedAt}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
