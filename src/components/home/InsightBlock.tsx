"use client";

import { useState } from "react";
import {
  InsightThumbnail,
  type InsightCategory,
  type InsightFeatured,
  type InsightCategorySlug,
} from "./InsightThumbnail";

/* Phase 1.2 (A-1-2) v32 — InsightBlock 모던 비즈니스 paradigm (벤토 회귀 + 모노톤 + subtext 폐기).
 * 정정 (Plan v32):
 * 1. subtext 광역 폐기 (다른 블록 정합)
 * 2. h2 마침표 "." yellow #FFD43B 보존 (v31 결정)
 * 3. h2 size 광역 보존 (v31 / 48 / 96)
 * 4. 4 카드 = InsightThumbnail 벤토 그리드 회귀 + 모던 비즈니스 실사 (별도 파일) */

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

export function InsightBlock() {
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
          경매가 처음이라면,<br />
          <span className="text-[var(--brand-green)]">여기부터</span>
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
