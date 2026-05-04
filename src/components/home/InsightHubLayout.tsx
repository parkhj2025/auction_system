"use client";

import { useState } from "react";
import {
  InsightThumbnail,
  type InsightCategory,
  type InsightFeatured,
  type InsightCategorySlug,
} from "./InsightThumbnail";
import type { InsightFeaturedPost } from "@/lib/content";

/* Phase 1.2 (A-1-2) v37 — InsightHubLayout (/insight Topic Gateway / Hero + 본문 + state 단일 client).
 * paradigm (Plan v37):
 * - Hero 영역 (bg-[var(--color-surface-muted)] / /analysis 광역 정합)
 *   - 카테고리 라벨 "경매 인사이트"
 *   - h1 "경매가 처음이라면, 여기부터." (44/80 / "여기부터" green + 마침표 yellow)
 *   - subtitle "경매 가이드부터 시장 동향까지, 한 페이지에서."
 *   - 칩 5건 (전체 + 4 카테고리 / filter useState)
 * - 본문 영역 (bg-white)
 *   - 카운트 "총 N건"
 *   - 4 카드 grid (InsightThumbnail 광역 재사용 / 메인 paradigm 정합) */

type FilterKey = "all" | InsightCategorySlug;

const CATEGORIES: InsightCategory[] = [
  { slug: "analysis", label: "무료 물건분석", color: "green" },
  { slug: "guide", label: "경매 가이드", color: "blue" },
  { slug: "glossary", label: "경매 용어", color: "orange" },
  { slug: "news", label: "경매 뉴스", color: "purple" },
];

const FEATURED_BY_CATEGORY: Record<InsightCategorySlug, InsightFeatured> = {
  analysis: {
    title: "사건번호 하나면, 분석 끝",
    preview: "권리 · 시세 · 수익률 한 번에",
    count: 12,
  },
  guide: {
    title: "처음부터 차근차근",
    preview: "입찰 절차와 기본 개념",
    count: 8,
  },
  glossary: {
    title: "헷갈리는 용어, 한눈에",
    preview: "권리분석의 기본기",
    count: 24,
  },
  news: {
    title: "경매 시장의 흐름",
    preview: "사례 · 판례 · 정책 변화",
    count: 6,
  },
};

const CHIPS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "analysis", label: "무료 물건분석" },
  { key: "guide", label: "경매 가이드" },
  { key: "glossary", label: "경매 용어" },
  { key: "news", label: "경매 뉴스" },
];

export function InsightHubLayout({
  featuredByCategory,
}: {
  featuredByCategory: Record<InsightCategorySlug, InsightFeaturedPost>;
}) {
  const [active, setActive] = useState<FilterKey>("all");

  const filtered =
    active === "all"
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.slug === active);

  const totalCount = filtered.reduce(
    (sum, cat) => sum + FEATURED_BY_CATEGORY[cat.slug].count,
    0
  );

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero 영역 (bg gray-surface-muted / /analysis 정합). */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="container-app w-full py-16 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-wider text-[#111418]">
            경매 인사이트
          </p>
          <h1
            className="mt-2 text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[#111418] [text-wrap:balance] lg:text-[80px]"
            style={{ fontWeight: 800 }}
          >
            경매가 처음이라면,
            <br />
            <span className="text-[var(--brand-green)]">여기부터</span>
            <span style={{ color: "#FFD43B" }}>.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-7 text-gray-600 lg:text-[20px]">
            경매 가이드부터 시장 동향까지, 한 페이지에서.
          </p>

          {/* 칩 5건 (filter useState). */}
          <div className="mt-8 flex flex-wrap gap-2 lg:mt-10">
            {CHIPS.map((chip) => {
              const isActive = active === chip.key;
              return (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => setActive(chip.key)}
                  className={
                    "rounded-full px-5 py-2 text-[14px] font-semibold transition " +
                    (isActive
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200")
                  }
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 본문 영역 (bg-white / 카운트 + 4 카드 grid). */}
      <section className="bg-white">
        <div className="container-app w-full py-12 lg:py-16">
          <p className="text-[14px] font-semibold text-gray-500 lg:text-[15px]">
            총{" "}
            <strong className="tabular-nums text-[#111418]">{totalCount}</strong>
            건
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 lg:mt-8 lg:grid-cols-4 lg:gap-6">
            {filtered.map((cat) => (
              <InsightThumbnail
                key={cat.slug}
                category={cat}
                featured={FEATURED_BY_CATEGORY[cat.slug]}
                featuredPost={featuredByCategory[cat.slug]}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
