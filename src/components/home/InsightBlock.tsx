"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { BarChart3, BookOpen, TrendingUp, Trophy } from "lucide-react";
import {
  INSIGHT_CATEGORIES,
  type InsightCategoryKey,
} from "@/lib/constants";

/* Phase 1.2 (A-1-2) v6 — InsightBlock (광역 우산 + 카테고리 색 + TodayAnalysis 통합).
 * h2 "경매가 처음이라면, 여기부터." (eyebrow 폐기)
 * subtext "물건 분석 · 가이드 · 시장 동향 · 낙찰 사례."
 * chip filter 5건 / 카드 6건 (TodayAnalysis 통합 첫 카드 col-span-2).
 * 카드 thumbnail = 카테고리 색 bg + 카테고리 lucide icon. */

type FilterKey = InsightCategoryKey | "all";

const CHIPS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "analysis", label: "무료 물건분석" },
  { key: "guide", label: "가이드" },
  { key: "insight", label: "시장 인사이트" },
  { key: "cases", label: "낙찰사례" },
];

const CATEGORY_ICON: Record<
  InsightCategoryKey,
  React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }>
> = {
  analysis: BarChart3,
  guide: BookOpen,
  insight: TrendingUp,
  cases: Trophy,
};

type Card = {
  cat: InsightCategoryKey;
  title: string;
  brief: string;
  metric?: string;
  date?: string;
  href: string;
  featured?: boolean;
};

/* TodayAnalysis 통합 본질 — 첫 카드 = 오늘의 무료 물건분석 강조 (col-span-2). */
const CARDS: Card[] = [
  {
    cat: "analysis",
    title: "보증금 1.88억 인수 오피스텔, HUG 말소동의로 1.25억 진입",
    brief: "감정가 2.55억 / 4회 유찰 / 임차보증금 인수 구조 분석.",
    metric: "감정가 −51%",
    date: "오늘의 무료 물건분석",
    href: "/analysis/2026타경500459",
    featured: true,
  },
  {
    cat: "analysis",
    title: "감정가 대비 −27% 진입선",
    brief: "권리 깨끗한 다세대 분석.",
    metric: "−27%",
    href: "/analysis",
  },
  {
    cat: "guide",
    title: "경매 입찰가, 얼마에 써야 할까",
    brief: "낙찰가 산정의 3가지 기준.",
    href: "/guide",
  },
  {
    cat: "guide",
    title: "경매 절차 전체 흐름",
    brief: "입찰부터 명도까지 4단계.",
    href: "/guide",
  },
  {
    cat: "insight",
    title: "경매 시황 — 4월 3주차",
    brief: "낙찰가율 소폭 상승.",
    metric: "+2.4%",
    href: "/news",
  },
  {
    cat: "cases",
    title: "인천 오피스텔 1.25억 낙찰",
    brief: "경매퀵 입찰 대리 사례.",
    metric: "1.25억",
    href: "/news",
  },
];

export function InsightBlock() {
  const [active, setActive] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    if (active === "all") return CARDS;
    return CARDS.filter((c) => c.cat === active);
  }, [active]);

  return (
    <section
      aria-labelledby="insight-heading"
      className="bg-[var(--bg-secondary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="max-w-3xl">
          <h2
            id="insight-heading"
            className="text-[var(--text-h2)] font-extrabold leading-[1.1] tracking-[-0.025em] text-[var(--text-primary)]"
            style={{ fontWeight: 800 }}
          >
            경매가 처음이라면, 여기부터.
          </h2>
          <p className="mt-4 text-[16px] leading-[1.6] text-[var(--text-secondary)] lg:mt-5 lg:text-[18px]">
            물건 분석 · 가이드 · 시장 동향 · 낙찰 사례.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="콘텐츠 카테고리"
          className="mt-8 flex flex-wrap gap-2"
        >
          {CHIPS.map((chip) => {
            const isActive = active === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(chip.key)}
                className={
                  "inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]/40 focus-visible:ring-offset-2 " +
                  (isActive
                    ? "bg-[var(--text-primary)] text-white"
                    : "border border-[var(--border-1)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]")
                }
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {filtered.map((item, idx) => {
              const Icon = CATEGORY_ICON[item.cat];
              const cat = INSIGHT_CATEGORIES[item.cat];
              const isFeatured = item.featured && active === "all";
              return (
                <li
                  key={`${item.cat}-${idx}`}
                  className={isFeatured ? "col-span-2 lg:col-span-2" : ""}
                >
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-1)] bg-white transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:-translate-y-1 hover:border-[var(--text-primary)]/15 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    {/* thumbnail — 카테고리 색 bg + 카테고리 lucide icon + 강조 metric. */}
                    <div
                      className={
                        "relative flex items-center justify-center overflow-hidden " +
                        (isFeatured ? "aspect-[16/9]" : "aspect-[16/10]")
                      }
                      style={{
                        background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}cc 100%)`,
                      }}
                    >
                      <Icon
                        size={isFeatured ? 56 : 36}
                        strokeWidth={1.5}
                        className="text-white/85"
                        aria-hidden={true}
                      />
                      {item.metric && (
                        <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                          {item.metric}
                        </span>
                      )}
                      {item.date && (
                        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                          {item.date}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 p-4 lg:p-5">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.06em] lg:text-[11px]"
                        style={{ color: cat.color }}
                      >
                        {cat.label}
                      </span>
                      <h3
                        className={
                          "font-bold leading-[1.4] tracking-[-0.01em] text-[var(--text-primary)] line-clamp-2 " +
                          (isFeatured
                            ? "text-[18px] lg:text-[22px]"
                            : "text-[14px] lg:text-[17px]")
                        }
                      >
                        {item.title}
                      </h3>
                      <p
                        className={
                          "leading-[1.55] text-[var(--text-secondary)] line-clamp-2 " +
                          (isFeatured
                            ? "text-[13px] lg:text-[15px]"
                            : "text-[12px] lg:text-[14px]")
                        }
                      >
                        {item.brief}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-8 text-[14px] text-[var(--text-tertiary)]">
            해당 카테고리의 콘텐츠가 곧 공개됩니다.
          </p>
        )}
      </div>
    </section>
  );
}
