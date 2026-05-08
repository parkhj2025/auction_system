"use client";

import Image from "next/image";
import Link from "next/link";
import type { InsightFeaturedPost } from "@/lib/content";

/* Phase 1.2 (A-1-2) v50 cycle 8 — InsightThumbnail Magazine Editorial Poster Card paradigm.
 * 정정 (Cycle 8):
 * 1. outer motion.div + inline boxShadow 광역 폐기 (그림자 0 / Compare 정합)
 * 2. CSS hover paradigm 정합 (transition-transform duration-300 ease-out hover:-translate-y-1)
 * 3. 이미지 wrapper flex-[13] → flex-[15] / 텍스트 wrapper flex-[7] → flex-[6] (4:5 시각 비율)
 * 4. 이미지 grayscale-[0.5] brightness-95 + group-hover:grayscale-0 group-hover:brightness-100
 * 5. h3 메인 = featuredPost?.title || featured.title (실 콘텐츠 first post 활용)
 * 6. sub line = 색 dot + 카테고리 라벨 + 우측 화살표 (매거진 micro detail)
 * 7. count "N건" 광역 폐기
 * 8. news → data slug 광역 정합 ("경매 빅데이터") */

export type InsightCategorySlug = "analysis" | "guide" | "glossary" | "data";
export type InsightCategoryColor = "green" | "blue" | "orange" | "purple";

export type InsightCategory = {
  slug: InsightCategorySlug;
  label: string;
  color: InsightCategoryColor;
};

export type InsightFeatured = {
  title: string;
};

const HREF_MAP: Record<InsightCategorySlug, string> = {
  analysis: "/insight?cat=analysis",
  guide: "/insight?cat=guide",
  glossary: "/insight?cat=glossary",
  data: "/insight?cat=data",
};

const CATEGORY_DOT_COLOR: Record<InsightCategoryColor, string> = {
  green: "#00C853",
  blue: "#4DABF7",
  orange: "#F97316",
  purple: "#9775FA",
};

export function InsightThumbnail({
  category,
  featured,
  featuredPost,
}: {
  category: InsightCategory;
  featured: InsightFeatured;
  featuredPost?: InsightFeaturedPost;
}) {
  const href = HREF_MAP[category.slug];
  const imageSrc = `/images/insight/${category.slug}.jpg`;
  const mainTitle = featuredPost?.title || featured.title;
  const dotColor = CATEGORY_DOT_COLOR[category.color];

  return (
    <Link
      href={href}
      className="group flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
    >
      {/* 상단 이미지 영역 (≈71%) — bg-gray-50 fallback. */}
      <div className="relative flex-[15] overflow-hidden bg-gray-50">
        <Image
          src={imageSrc}
          alt={category.label}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover grayscale-[0.5] brightness-95 transition-[transform,filter] duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
        />
      </div>

      {/* 하단 텍스트 영역 (≈29%) — white. */}
      <div className="flex flex-[6] flex-col justify-center gap-2 px-4 py-3 lg:px-5 lg:py-4">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug tracking-[-0.01em] text-[#111418] lg:text-[18px]">
          {mainTitle}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 flex-shrink-0 rounded-full lg:h-2 lg:w-2"
              style={{ backgroundColor: dotColor }}
            />
            <span className="text-[12px] font-medium text-gray-500 lg:text-[14px]">
              {category.label}
            </span>
          </div>
          <span
            aria-hidden="true"
            className="text-[14px] text-gray-400 transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
