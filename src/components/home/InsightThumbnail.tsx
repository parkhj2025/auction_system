"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { InsightFeaturedPost } from "@/lib/content";

/* Phase 1.2 (A-1-2) v36 — InsightThumbnail (이미지 ↑ + 벤토 컬러 + Featured 영역 광역 폐기).
 * 정정 (Plan v36):
 * 1. 일러스트 영역 광역 ↑ (50% → 65% / flex-13:7) + padding 광역 ↓ (p-2 / 꽉 차게)
 * 2. 카테고리별 파스텔 배경 (green-50 / blue-50 / orange-50 / purple-50)
 * 3. 카드 안 Featured 영역 광역 폐기 (구분선 + 라벨 + 제목 + fallback 광역 0)
 * 4. 카드 높이 광역 ↓ (Featured 영역 만큼).
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
  analysis: "/analysis",
  guide: "/guide",
  glossary: "/guide",
  news: "/news",
};

const BG_MAP: Record<InsightCategoryColor, string> = {
  green: "bg-green-50",
  blue: "bg-blue-50",
  orange: "bg-orange-50",
  purple: "bg-purple-50",
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
  const imageSrc = `/images/insight/${category.slug}.png`;
  const bgClass = BG_MAP[category.color];

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="block">
      <Link
        href={href}
        className="group flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
      >
        {/* 상단 일러스트 영역 (65%) — 카테고리별 파스텔 배경 + 광역 padding ↓. */}
        <div className={`relative flex-[13] overflow-hidden ${bgClass}`}>
          <Image
            src={imageSrc}
            alt={category.label}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-contain p-2"
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
