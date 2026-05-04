"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

/* Phase 1.2 (A-1-2) v31 — InsightThumbnail (다큐 실사 이미지 + Hero paradigm glass morphic).
 * 카테고리 4건: analysis green / guide blue / glossary orange / news purple.
 * 카드 광역 = aspect-[3/4] / 실사 이미지 (Gemini 3 Pro Image / 다큐) 광역 배경.
 * 하단 glass morphic = Hero 박스 paradigm 정합 (rgba 0.35/0.20 + blur(40) saturate(180) + border + inset highlight).
 * 텍스트 광역 ↑ (라벨 24/32 + 카드 수 14/18 + 제목 16/20 + 미리보기 13/15). */

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

const ACCENT_MAP: Record<InsightCategoryColor, string> = {
  green: "#00C853",
  blue: "#4DABF7",
  orange: "#F97316",
  purple: "#9775FA",
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
  const accent = ACCENT_MAP[category.color];
  const href = HREF_MAP[category.slug];
  const imageSrc = `/images/insight/${category.slug}.jpg`;

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="block">
      <Link
        href={href}
        className="group relative block aspect-[3/4] overflow-hidden rounded-3xl shadow-md transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
      >
        {/* 실사 이미지 광역 배경. */}
        <Image
          src={imageSrc}
          alt={category.label}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* 약한 하단 그라데이션 (이미지 → 텍스트 가독성 정합). */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        {/* 하단 glass morphic 영역 (Hero paradigm 정합). */}
        <div
          className="absolute inset-x-3 bottom-3 rounded-[20px] px-5 py-4 lg:inset-x-4 lg:bottom-4 lg:rounded-[24px] lg:px-6 lg:py-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.20) 100%)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 16px 40px -8px rgba(0, 0, 0, 0.35)",
          }}
        >
          {/* 라벨 + 카드 수 (한 행 정합). */}
          <div className="flex items-baseline justify-between gap-3">
            <h3
              className="text-[24px] font-bold leading-tight tracking-[-0.01em] text-white lg:text-[32px]"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              {category.label}
            </h3>
            <span
              className="flex-shrink-0 text-[14px] font-semibold lg:text-[18px]"
              style={{ color: accent, textShadow: "0 1px 4px rgba(0, 0, 0, 0.4)" }}
            >
              {featured.count}건
            </span>
          </div>

          {/* 미리보기 제목 + 본문. */}
          <div className="mt-3">
            <p
              className="line-clamp-2 text-[16px] font-semibold leading-snug text-white/95 lg:text-[20px]"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              {featured.title}
            </p>
            <p
              className="mt-1 line-clamp-1 text-[13px] text-white/80 lg:text-[15px]"
              style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)" }}
            >
              {featured.preview}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
