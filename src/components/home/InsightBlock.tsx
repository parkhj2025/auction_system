"use client";

import { useState } from "react";
import {
  InsightThumbnail,
  type InsightCategory,
  type InsightFeatured,
  type InsightCategorySlug,
} from "./InsightThumbnail";
import type { InsightFeaturedPost } from "@/lib/content";

/* Phase 1.2 (A-1-2) v35 — InsightBlock 매거진 카드 paradigm (Featured 자동 + 3D 일러스트).
 * 정정 (Plan v35):
 * 1. featuredByCategory props 진입 (server fetch / page.tsx + insight/page.tsx 광역)
 * 2. InsightThumbnail 매거진 카드 (구분선 + Featured 또는 fallback) 광역 정합 */

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

export function InsightBlock({
  featuredByCategory,
}: {
  featuredByCategory: Record<InsightCategorySlug, InsightFeaturedPost>;
}) {
  const [active, setActive] = useState<FilterKey>("all");

  const filtered =
    active === "all"
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.slug === active);

  return (
    <section
      aria-labelledby="insight-heading"
      className="flex min-h-[calc(100vh-64px)] flex-col justify-center bg-[#FAFAFA] py-12 lg:min-h-[calc(100vh-80px)] lg:py-16"
    >
      <div className="container-app w-full">
        <h2
          id="insight-heading"
          className="mb-8 text-[48px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-12 lg:text-[96px]"
          style={{ fontWeight: 800 }}
        >
          경매를 분석합니다
          <br />
          비용은 <span className="text-[var(--brand-green)]">무료</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </h2>

        {/* 카테고리 칩 5건. */}
        <div className="mb-8 flex flex-wrap gap-2 lg:mb-12">
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
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200")
                }
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* 4 카드 균등 grid. */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
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
  );
}
