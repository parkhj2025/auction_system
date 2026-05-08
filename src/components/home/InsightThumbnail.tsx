"use client";

import Image from "next/image";
import Link from "next/link";

/* Phase 1.2 (A-1-2) v50 cycle 8-2 — InsightThumbnail Magazine Editorial split paradigm.
 * 정정 (Cycle 8-2):
 * 1. 카드 비율 aspect-[3/4] → aspect-[2/1] (가로 긴 와이드)
 * 2. flex-col → flex-row (좌 이미지 50% / 우 텍스트 50% split)
 * 3. 이미지 wrapper flex-[15] → w-1/2 / 텍스트 wrapper flex-[6] → w-1/2
 * 4. grayscale-[0.5] → grayscale (광역 모노톤 강화)
 * 5. dot + CATEGORY_DOT_COLOR + InsightCategoryColor + InsightCategory.color 광역 폐기
 * 6. eyebrow 카테고리 라벨 신규 (메인 h3 위)
 * 7. 메인 h3 = featured.title 직접 (featuredPost props 광역 회수)
 * 8. sub = featured.preview (preview 필드 신규 활용)
 * 9. 우하단 화살표 보존 (cycle 8 정정 10 정합) */

export type InsightCategorySlug = "analysis" | "guide" | "glossary" | "data";

export type InsightCategory = {
  slug: InsightCategorySlug;
  label: string;
};

export type InsightFeatured = {
  title: string;
  preview: string;
};

const HREF_MAP: Record<InsightCategorySlug, string> = {
  analysis: "/insight?cat=analysis",
  guide: "/insight?cat=guide",
  glossary: "/insight?cat=glossary",
  data: "/insight?cat=data",
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
    <Link
      href={href}
      className="group flex aspect-[2/1] flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
    >
      {/* 좌 이미지 영역 (50%) — 광역 모노톤 / hover 컬러 + scale. */}
      <div className="relative w-1/2 overflow-hidden bg-gray-50">
        <Image
          src={imageSrc}
          alt={category.label}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover grayscale brightness-95 transition-[transform,filter] duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
        />
      </div>

      {/* 우 텍스트 영역 (50%) — eyebrow + h3 + sub + 우하단 화살표 (cycle 8-3 size ↑). */}
      <div className="flex w-1/2 flex-col justify-center gap-2 px-4 py-3 lg:gap-2.5 lg:px-5 lg:py-4">
        <span className="text-[14px] font-medium tracking-[0.02em] text-gray-500 lg:text-[18px]">
          {category.label}
        </span>
        <h3 className="line-clamp-2 text-[18px] font-bold leading-snug tracking-[-0.01em] text-[#111418] lg:text-[24px]">
          {featured.title}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <p className="line-clamp-1 text-[14px] font-medium text-gray-600 lg:text-[16px]">
            {featured.preview}
          </p>
          <span
            aria-hidden="true"
            className="flex-shrink-0 text-[18px] text-gray-400 transition-transform duration-300 group-hover:translate-x-1 lg:text-[20px]"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
