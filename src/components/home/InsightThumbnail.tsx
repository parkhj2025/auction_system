"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

/* Phase 1.2 (A-1-2) v34 — InsightThumbnail (미세 gray 그림자 입체감 + v33 정수 보존).
 * 정정 (Plan v34):
 * 1. shadow-sm + hover:shadow-md (gray 무채색 단독 / 색감 그림자 영구 폐기)
 * 보존: 벤토 그리드 + 모노톤 텍스트 + 부동산 실사 + border-gray-200. */

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
}: {
  category: InsightCategory;
  featured: InsightFeatured;
}) {
  const href = HREF_MAP[category.slug];
  const imageSrc = `/images/insight/${category.slug}.jpg`;

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="block">
      <Link
        href={href}
        className="group block aspect-[3/4] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
      >
        <div className="flex h-full flex-col">
          {/* 상단 65% — 실사 이미지 광역. */}
          <div className="relative flex-[13] overflow-hidden">
            <Image
              src={imageSrc}
              alt={category.label}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* 하단 35% — white 텍스트 영역 (모노톤). */}
          <div className="flex flex-[7] flex-col justify-between bg-white px-4 py-3 lg:px-5 lg:py-4">
            {/* 라벨 + 카드 수 (한 행 정합). */}
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="truncate text-[15px] font-bold leading-tight tracking-[-0.01em] text-[#111418] lg:text-[20px]">
                {category.label}
              </h3>
              <span className="flex-shrink-0 text-[13px] font-medium text-gray-500 lg:text-[15px]">
                {featured.count}건
              </span>
            </div>

            {/* 미리보기 제목 + 캡션. */}
            <div>
              <p className="line-clamp-1 text-[13px] font-semibold leading-snug text-[#111418] lg:text-[16px]">
                {featured.title}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[12px] text-gray-500 lg:text-[14px]">
                {featured.preview}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
