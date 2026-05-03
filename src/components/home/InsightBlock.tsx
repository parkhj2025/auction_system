"use client";

import { useState, useMemo } from "react";
import { type InsightCategoryKey } from "@/lib/constants";
import { type ThumbnailKind } from "./InsightThumbnail";
import { InsightCard } from "./InsightCard";

/* Phase 1.2 (A-1-2) v9 — InsightBlock (bento 2x2 + 1x1 5건 + 큰 숫자 typography + 색 분배 6건).
 * h2 "경매가 처음이라면, 여기부터." (green accent on "여기부터")
 * desktop bento: grid-cols-4 grid-rows-2 (큰 1 col-span-2 row-span-2 + 작은 5 col-span-1 row-span-1)
 * mobile: grid-cols-2 (큰 카드 col-span-2 + 작은 5 col-span-1)
 * 색 분배: green 2 (analysis) + blue 2 (guide) + orange 1 (insight) + purple 1 (cases)
 * scroll reveal + hover lift 광역 (Card 컴포넌트 분리 영역). */

type FilterKey = InsightCategoryKey | "all";

const CHIPS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "analysis", label: "무료 물건분석" },
  { key: "guide", label: "가이드" },
  { key: "insight", label: "시장 인사이트" },
  { key: "cases", label: "낙찰사례" },
];

export type InsightCardData = {
  cat: InsightCategoryKey;
  kind: ThumbnailKind;
  title: string;
  brief: string;
  metric?: string;
  date?: string;
  href: string;
  featured?: boolean;
};

const CARDS: InsightCardData[] = [
  {
    cat: "analysis",
    kind: "hug-deposit",
    title: "보증금 1.88억 인수 오피스텔, HUG 말소동의로 1.25억 진입",
    brief: "감정가 2.55억 / 4회 유찰 / 임차보증금 인수 구조 분석.",
    metric: "감정가 −51%",
    date: "주요 무료 물건분석",
    href: "/analysis/2026타경500459",
    featured: true,
  },
  {
    cat: "analysis",
    kind: "price-drop",
    title: "감정가 대비 −27% 진입선",
    brief: "권리 깨끗한 다세대 분석.",
    metric: "−27%",
    href: "/analysis",
  },
  {
    cat: "guide",
    kind: "bid-criteria",
    title: "경매 입찰가, 얼마에 써야 할까",
    brief: "낙찰가 산정의 3가지 기준.",
    href: "/guide",
  },
  {
    cat: "guide",
    kind: "process-flow",
    title: "경매 절차 전체 흐름",
    brief: "입찰부터 명도까지 4단계.",
    href: "/guide",
  },
  {
    cat: "insight",
    kind: "market-trend",
    title: "경매 시황 — 4월 3주차",
    brief: "낙찰가율 소폭 상승.",
    metric: "+4.2%p",
    href: "/news",
  },
];
/* v11 정정: auction-trophy (cases / purple) 6번 카드 영구 폐기 (bento 6→5건). */

export function InsightBlock() {
  const [active, setActive] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    if (active === "all") return CARDS;
    return CARDS.filter((c) => c.cat === active);
  }, [active]);

  return (
    <section
      aria-labelledby="insight-heading"
      className="bg-[var(--bg-secondary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="max-w-3xl">
          <h2
            id="insight-heading"
            className="text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:text-[88px]"
            style={{ fontWeight: 800 }}
          >
            경매가 처음이라면,<br className="lg:hidden" />{" "}
            <span className="text-[var(--brand-green)]">여기부터.</span>
          </h2>
          <p className="mt-5 text-[17px] font-medium leading-[1.6] text-[var(--text-secondary)] lg:mt-6 lg:text-[19px]">
            물건 분석 · 가이드 · 시장 동향 · 낙찰 사례.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="콘텐츠 카테고리"
          className="mt-8 flex flex-wrap gap-2"
        >
          {CHIPS.map((chip) => {
            const isActive = active === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(chip.key)}
                className={
                  "inline-flex h-10 items-center rounded-full px-4 text-[14px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]/40 focus-visible:ring-offset-2 " +
                  (isActive
                    ? "bg-[var(--text-primary)] text-white"
                    : "border border-[var(--border-1)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]")
                }
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <ul className="mt-8 grid grid-cols-2 gap-3 lg:mt-12 lg:grid-cols-4 lg:grid-rows-2 lg:gap-6">
            {filtered.map((item, idx) => {
              const isFeatured = !!item.featured && active === "all";
              return (
                <InsightCard
                  key={`${item.cat}-${idx}`}
                  data={item}
                  isFeatured={isFeatured}
                  delay={idx * 80}
                />
              );
            })}
          </ul>
        ) : (
          <p className="mt-8 text-[14px] text-[var(--text-tertiary)]">
            해당 카테고리의 콘텐츠가 곧 공개됩니다.
          </p>
        )}
      </div>
    </section>
  );
}
