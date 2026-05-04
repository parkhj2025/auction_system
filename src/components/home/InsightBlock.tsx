"use client";

import { useState } from "react";
import {
  InsightThumbnail,
  type InsightCategory,
  type InsightFeatured,
  type InsightCategorySlug,
} from "./InsightThumbnail";

/* Phase 1.2 (A-1-2) v31 — InsightBlock 다큐 / 게티 paradigm (실사 + glass morphic + 텍스트 ↑).
 * 정정 (Plan v31):
 * 1. h2 size ↑ (44 → 48 / 88 → 96)
 * 2. h2 마침표 "." yellow #FFD43B (Hero 정합 미세 발현)
 * 3. subtext size ↑ (16 → 17 / 20 → 22)
 * 4. 4 카드 = InsightThumbnail 광역 재구성 (실사 이미지 + Hero glass morphic / 별도 파일) */

type FilterKey = "all" | InsightCategorySlug;

const CATEGORIES: InsightCategory[] = [
  { slug: "analysis", label: "무료 물건분석", color: "green" },
  { slug: "guide", label: "경매 가이드", color: "blue" },
  { slug: "glossary", label: "경매 용어", color: "orange" },
  { slug: "news", label: "경매 뉴스", color: "purple" },
];

const FEATURED_BY_CATEGORY: Record<InsightCategorySlug, InsightFeatured> = {
  analysis: {
    title: "주요 무료 물건분석",
    preview: "감정가 -51% / 4회 유찰",
    count: 12,
  },
  guide: {
    title: "경매 입찰가, 얼마에 써야 할까",
    preview: "시세 / 위험 / 수익률 3 기준",
    count: 8,
  },
  glossary: {
    title: "말소기준권리란?",
    preview: "권리 분석의 출발점",
    count: 24,
  },
  news: {
    title: "미추홀구 오피스텔 4회 유찰",
    preview: "HUG 말소동의 + 임차보증금 인수",
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
          className="mb-4 text-[48px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-6 lg:text-[96px]"
          style={{ fontWeight: 800 }}
        >
          경매가 처음이라면,<br />
          <span className="text-[var(--brand-green)]">여기부터</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </h2>

        <p className="mb-8 text-[17px] text-gray-600 lg:mb-12 lg:text-[22px]">
          물건 분석 · 가이드 · 용어 · 뉴스.
        </p>

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
