"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { InsightFeaturedPost } from "@/lib/content";

/* Phase 1.2 (A-1-2) v35 — InsightThumbnail 매거진 카드 (3D 일러스트 + 구분선 + Featured + fallback).
 * 정정 (Plan v35):
 * 1. 이미지 = 3D 일러스트 png (실사 jpg 영구 폐기 / Gemini 재생성 / 브랜드 3색 + 한국인 캐릭터)
 * 2. 카드 안 광역 = 이미지 + 라벨/카운트 + 설명 + 구분선 + "이번 주 Featured" 또는 fallback
 * 3. Featured 1건 자동 (publishedAt DESC 첫 1건 / 콘텐츠 0건 = "곧 업데이트 예정" 정적 fallback)
 * 4. lift only hover (background 변화 0 / shadow-sm + hover:shadow-md 보존). */

export type InsightCategorySlug = "analysis" | "guide" | "glossary" | "news";
export type InsightCategoryColor = "green" | "blue" | "orange" | "purple";

export type InsightCategory = {
  slug: InsightCategorySlug;
  label: string;
  color: InsightCategoryColor;
};

export type InsightFeatured = {
  title: string;
  preview: string;
  count: number;
};

const HREF_MAP: Record<InsightCategorySlug, string> = {
  analysis: "/analysis",
  guide: "/guide",
  glossary: "/guide",
  news: "/news",
};

export function InsightThumbnail({
  category,
  featured,
  featuredPost,
}: {
  category: InsightCategory;
  featured: InsightFeatured;
  featuredPost: InsightFeaturedPost;
}) {
  const href = HREF_MAP[category.slug];
  const imageSrc = `/images/insight/${category.slug}.png`;

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="block">
      <Link
        href={href}
        className="group flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
      >
        {/* 상단 일러스트 영역 (50%) — bg-gray-50 미세 분리. */}
        <div className="relative flex-1 overflow-hidden bg-gray-50">
          <Image
            src={imageSrc}
            alt={category.label}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-contain p-4 lg:p-6"
          />
        </div>

        {/* 하단 텍스트 영역 (50%). */}
        <div className="flex flex-1 flex-col justify-between gap-3 px-4 py-4 lg:px-5 lg:py-5">
          {/* 라벨 + 카운트 + 설명. */}
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="truncate text-[15px] font-bold leading-tight tracking-[-0.01em] text-[#111418] lg:text-[20px]">
                {category.label}
              </h3>
              <span className="flex-shrink-0 text-[13px] font-medium text-gray-500 lg:text-[15px]">
                {featured.count}건
              </span>
            </div>
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-gray-600 lg:text-[14px]">
              {featured.title}
            </p>
          </div>

          {/* 구분선 + Featured 또는 fallback. */}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--brand-green)] lg:text-[11px]">
              이번 주 Featured
            </p>
            <p className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#111418] lg:text-[13px]">
              {featuredPost?.title ?? "곧 업데이트 예정"}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
