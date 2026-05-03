"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FileSearch, BookOpen, ScrollText, Newspaper, type LucideIcon } from "lucide-react";

/* Phase 1.2 (A-1-2) v16 — InsightThumbnail (Editorial Card paradigm / 3:4 / 60-40 split).
 * 카테고리 4건: analysis green / guide blue / glossary orange / news purple (낙찰사례 영구 폐기).
 * 상단 60% (flex-3) = 카테고리 색 + 아이콘 36 + 라벨 + 카드 수.
 * 하단 40% (flex-2) = white + 미리보기 제목 + 본문. */

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

const ICON_MAP: Record<InsightCategorySlug, LucideIcon> = {
  analysis: FileSearch,
  guide: BookOpen,
  glossary: ScrollText,
  news: Newspaper,
};

const COLOR_MAP: Record<InsightCategoryColor, { bg: string; text: string }> = {
  green: { bg: "#00C853", text: "#FFFFFF" },
  blue: { bg: "#4DABF7", text: "#FFFFFF" },
  orange: { bg: "#F97316", text: "#FFFFFF" },
  purple: { bg: "#9775FA", text: "#FFFFFF" },
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
  const Icon = ICON_MAP[category.slug];
  const colors = COLOR_MAP[category.color];
  const href = HREF_MAP[category.slug];

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="block"
    >
      <Link
        href={href}
        className="group block aspect-[3/4] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
      >
        <div className="flex h-full flex-col">
          {/* 상단 60% — 카테고리 색 배경. */}
          <div
            className="flex flex-[3] flex-col justify-between p-5 lg:p-6"
            style={{ backgroundColor: colors.bg }}
          >
            <Icon size={36} color={colors.text} strokeWidth={2} />
            <div>
              <div
                className="text-[16px] font-bold lg:text-[20px]"
                style={{ color: colors.text }}
              >
                {category.label}
              </div>
              <div
                className="mt-1 text-[12px] opacity-80 lg:text-[14px]"
                style={{ color: colors.text }}
              >
                {featured.count}건
              </div>
            </div>
          </div>

          {/* 하단 40% — white 미리보기. */}
          <div className="flex flex-[2] flex-col justify-center bg-white p-5 lg:p-6">
            <div className="mb-2 line-clamp-2 text-[13px] font-bold leading-snug text-gray-900 lg:text-[14px]">
              {featured.title}
            </div>
            <div className="line-clamp-1 text-[11px] text-gray-500 lg:text-[12px]">
              {featured.preview}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
