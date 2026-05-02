"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { InsightChipKey, InsightItem } from "@/lib/content";

/* Phase 1.2 (A-1) — 경매 인사이트 블록 (모노톤 화이트 + chip 4 navigator).
 * 본질:
 *  - chip 4건 = 굵직한 섹션 navigator (분류 라벨 ≠ chip — CLAUDE.md 원칙 5 정합)
 *  - getActiveInsightPosts() = analysis + guide + news 통합 + status published + publishedAt DESC
 *  - chip 클릭 시 client-side filter (분리 라우트 X)
 *  - "시장 인사이트" chip은 본 cycle 카드 0건이지만 navigator 본질로 노출 (Q7 결정 영역)
 *  - testimonial 폐기 / "이번 주" "오늘" "지금" 폐기 표현 0
 *  - 카피 v1.1 §C-2: eyebrow / h1 / subtext / CTA */

const CHIPS: { key: InsightChipKey | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "analysis", label: "무료 물건분석" },
  { key: "insight", label: "시장 인사이트" },
  { key: "news", label: "뉴스" },
  { key: "guide", label: "경매 기본정보" },
];

export default function FreeAnalysisBlockClient({ posts }: { posts: InsightItem[] }) {
  const [active, setActive] = useState<InsightChipKey | "all">("all");

  const filtered = useMemo(() => {
    if (active === "all") return posts;
    return posts.filter((p) => p.chip === active);
  }, [posts, active]);

  return (
    <section
      aria-labelledby="insight-heading"
      className="bg-[var(--bg-primary)] border-b border-[var(--border-1)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="max-w-2xl">
          <p className="section-eyebrow">경매 인사이트</p>
          <h2
            id="insight-heading"
            className="text-h1 mt-3 text-[var(--text-primary)]"
          >
            숫자로 읽는 경매
          </h2>
          <p className="text-body mt-3 text-[var(--text-secondary)]">
            물건분석, 시장 데이터, 부동산 이슈까지. 경매에 대한 분석 자료를
            무료로 제공합니다.
          </p>
        </div>

        {/* chip 4건 navigator. */}
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
                  "text-meta inline-flex h-7 items-center rounded-full px-3 font-medium transition-colors " +
                  (isActive
                    ? "bg-[var(--text-primary)] text-white"
                    : "border border-[var(--border-1)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]")
                }
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* 콘텐츠 카드 그리드. */}
        {filtered.length > 0 ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {filtered.slice(0, 6).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-xl border border-[var(--border-1)] bg-[var(--bg-primary)] p-4 transition-all hover:-translate-y-0.5 hover:bg-[var(--bg-secondary)] lg:p-5"
                >
                  <span className="text-meta inline-flex h-6 w-fit items-center rounded-full border border-[var(--border-1)] bg-[var(--bg-secondary)] px-2.5 font-medium text-[var(--text-secondary)]">
                    {item.chipLabel}
                  </span>
                  <h3 className="text-h3 mt-3 text-[var(--text-primary)] group-hover:underline">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-body-sm mt-2 line-clamp-2 text-[var(--text-secondary)]">
                      {item.subtitle}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body mt-6 text-[var(--text-tertiary)]">
            해당 카테고리의 콘텐츠가 곧 공개됩니다.
          </p>
        )}

        <div className="mt-8">
          <Link
            href="/analysis"
            className="text-body-sm inline-flex items-center gap-1 font-medium text-[var(--text-primary)] hover:underline"
          >
            경매 인사이트 전체 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
