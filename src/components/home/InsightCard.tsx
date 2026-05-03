"use client";

import Link from "next/link";
import { INSIGHT_CATEGORIES } from "@/lib/constants";
import { InsightThumbnail } from "./InsightThumbnail";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { InsightCardData } from "./InsightBlock";

/* Phase 1.2 (A-1-2) v9 — InsightCard (bento + scroll reveal + hover lift).
 * isFeatured = true → 큰 카드 (col-span-2 row-span-2 / aspect 16:10 / typography ↑)
 * isFeatured = false → 작은 카드 (col-span-1 row-span-1 / aspect-square) */

export function InsightCard({
  data,
  isFeatured,
  delay = 0,
}: {
  data: InsightCardData;
  isFeatured: boolean;
  delay?: number;
}) {
  const { ref: revealRef, className: revealClass, style: revealStyle } =
    useScrollReveal<HTMLLIElement>({ delay });
  const cat = INSIGHT_CATEGORIES[data.cat];

  return (
    <li
      ref={revealRef}
      className={`${revealClass} ${isFeatured ? "col-span-2 lg:col-span-2 lg:row-span-2" : ""}`}
      style={revealStyle}
    >
      <Link
        href={data.href}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-1)] bg-white transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-[var(--text-primary)]/15 hover:shadow-[var(--shadow-card-hover)]"
      >
        {/* 썸네일 — 큰 숫자 typography + 미세 도식 (콘텐츠별 6건 차별화). */}
        <div
          className={
            "relative overflow-hidden " +
            (isFeatured ? "aspect-[16/10]" : "aspect-square")
          }
        >
          <InsightThumbnail
            cat={data.cat}
            kind={data.kind}
            isLarge={isFeatured}
          />
          {data.metric && (
            <span className="absolute right-3 top-3 z-20 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[12px] font-bold text-white backdrop-blur-md">
              {data.metric}
            </span>
          )}
          {data.date && (
            <span className="absolute left-3 top-3 z-20 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur-md">
              {data.date}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4 lg:p-6">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.06em] lg:text-[12px]"
            style={{ color: cat.color }}
          >
            {cat.label}
          </span>
          <h3
            className={
              "font-bold leading-[1.4] tracking-[-0.01em] text-[var(--text-primary)] line-clamp-2 " +
              (isFeatured
                ? "text-[20px] lg:text-[28px]"
                : "text-[16px] lg:text-[19px]")
            }
          >
            {data.title}
          </h3>
          <p
            className={
              "font-medium leading-[1.55] text-[var(--text-secondary)] line-clamp-2 " +
              (isFeatured
                ? "text-[14px] lg:text-[17px]"
                : "text-[13px] lg:text-[15px]")
            }
          >
            {data.brief}
          </p>
        </div>
      </Link>
    </li>
  );
}
