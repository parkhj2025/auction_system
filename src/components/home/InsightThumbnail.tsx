"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { InsightFeaturedPost } from "@/lib/content";

/* Phase 1.2 (A-1-2) v37 — InsightThumbnail (실사 jpg 회복 + 벤토 컬러 폐기 + bg-gray-50 단일).
 * 정정 (Plan v37):
 * 1. 이미지 src .png → .jpg (실사 4종 git history 회복)
 * 2. INSIGHT_BG_MAP 광역 폐기 + 이미지 영역 배경 = bg-gray-50 단일 (벤토 컬러 광역 폐기)
 * 3. v36 layout 광역 보존 (flex-[13]:flex-[7] / Featured 영역 폐기 / 박스 입체감 v34).
 * 보존: featuredPost props (Phase B 재활용 / UI 잔존 0). */

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
  analysis: "/insight?cat=analysis",
  guide: "/insight?cat=guide",
  glossary: "/insight?cat=glossary",
  news: "/insight?cat=news",
};

export function InsightThumbnail({
  category,
  featured,
}: {
  category: InsightCategory;
  featured: InsightFeatured;
  featuredPost?: InsightFeaturedPost;
}) {
  const href = HREF_MAP[category.slug];
  const imageSrc = `/images/insight/${category.slug}.jpg`;

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="block">
      <Link
        href={href}
        className="group flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
      >
        {/* 상단 이미지 영역 (65%) — bg-gray-50 단일 (벤토 컬러 광역 폐기). */}
        <div className="relative flex-[13] overflow-hidden bg-gray-50">
          <Image
            src={imageSrc}
            alt={category.label}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* 하단 텍스트 영역 (35%) — white. */}
        <div className="flex flex-[7] flex-col justify-center gap-1.5 px-4 py-3 lg:px-5 lg:py-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate text-[15px] font-bold leading-tight tracking-[-0.01em] text-[#111418] lg:text-[20px]">
              {category.label}
            </h3>
            <span className="flex-shrink-0 text-[13px] font-medium text-gray-500 lg:text-[15px]">
              {featured.count}건
            </span>
          </div>
          <p className="line-clamp-2 text-[12px] leading-snug text-gray-600 lg:text-[14px]">
            {featured.title}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
