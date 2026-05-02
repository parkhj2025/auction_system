"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { InsightChipKey, InsightItem } from "@/lib/content";

/* Phase 1.2 (A-1-2) v4 — 인사이트 4 카드뉴스 grid (시안 정합 본질).
 * chip filter row + 4 col grid (lg) / 2 col (md) / 1 col (mobile) + SVG 4 카테고리 정밀화.
 * chip 4건 navigator (분류 라벨 ≠ chip — CLAUDE.md 원칙 5 정합).
 * 카드 hover translateY -3 + shadow + border green/0.2 (영역 5 정수). */

const CHIPS: { key: InsightChipKey | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "analysis", label: "무료 물건분석" },
  { key: "insight", label: "시장 인사이트" },
  { key: "news", label: "뉴스" },
  { key: "guide", label: "경매 기본정보" },
];

export default function FreeAnalysisBlockClient({
  posts,
}: {
  posts: InsightItem[];
}) {
  const [active, setActive] = useState<InsightChipKey | "all">("all");

  const filtered = useMemo(() => {
    if (active === "all") return posts;
    return posts.filter((p) => p.chip === active);
  }, [posts, active]);

  return (
    <section
      aria-labelledby="insight-heading"
      className="bg-[var(--bg-primary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-2xl">
            <p className="section-eyebrow">경매 인사이트</p>
            <h2
              id="insight-heading"
              className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-[var(--text-primary)] lg:text-[40px]"
            >
              숫자로 읽는 경매
            </h2>
          </div>
          <Link
            href="/analysis"
            className="text-[14px] font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:text-[var(--brand-green-deep)]"
          >
            전체 보기 →
          </Link>
        </div>

        {/* chip filter row (시안 active charcoal / inactive outline). */}
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
                  "inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 " +
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

        {/* 4 col grid (lg) / 2 col (md) / 1 col (mobile). */}
        {filtered.length > 0 ? (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {filtered.slice(0, 8).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-1)] bg-white transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:-translate-y-1 hover:border-[var(--brand-green)]/20 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[var(--bg-secondary)]">
                    <CategoryThumbnail chip={item.chip} />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--brand-green-deep)]">
                      {item.chip === "analysis"
                        ? "무료 물건분석"
                        : item.chip === "insight"
                        ? "시장 인사이트"
                        : item.chip === "news"
                        ? "뉴스"
                        : "경매 기본정보"}
                    </span>
                    <h3 className="text-[16px] font-bold leading-[1.4] tracking-[-0.01em] text-[var(--text-primary)] line-clamp-2 lg:text-[17px]">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-[13px] leading-[1.55] text-[var(--text-secondary)] line-clamp-2 lg:text-[14px]">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
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

/* SVG 썸네일 4 카테고리 — green/yellow accent + 모노톤 base. */
function CategoryThumbnail({ chip }: { chip: InsightChipKey }) {
  if (chip === "analysis") {
    /* 무료 물건분석 = 도시 + 핀 (green). */
    return (
      <svg
        viewBox="0 0 320 200"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="320" height="200" fill="#FAFAFA" />
        <g fill="#E4E4E7">
          <rect x="20" y="120" width="36" height="80" />
          <rect x="62" y="100" width="42" height="100" />
          <rect x="110" y="80" width="50" height="120" />
          <rect x="166" y="110" width="40" height="90" />
          <rect x="212" y="90" width="48" height="110" />
          <rect x="266" y="125" width="34" height="75" />
        </g>
        <g transform="translate(160 60)">
          <circle cx="0" cy="0" r="14" fill="#00C853" />
          <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
          <path d="M0 14 L0 30" stroke="#00C853" strokeWidth="3" />
        </g>
      </svg>
    );
  }
  if (chip === "insight") {
    /* 시장 인사이트 = 차트 + green 트렌드. */
    return (
      <svg
        viewBox="0 0 320 200"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="320" height="200" fill="#FAFAFA" />
        <g stroke="#E4E4E7" strokeWidth="1">
          <line x1="40" y1="40" x2="40" y2="170" />
          <line x1="40" y1="170" x2="290" y2="170" />
        </g>
        <g fill="#E4E4E7">
          <rect x="60" y="115" width="20" height="55" />
          <rect x="100" y="95" width="20" height="75" />
          <rect x="140" y="75" width="20" height="95" />
          <rect x="180" y="105" width="20" height="65" />
          <rect x="220" y="65" width="20" height="105" />
        </g>
        <polyline
          points="70,110 110,90 150,70 190,100 230,60 260,40"
          fill="none"
          stroke="#00C853"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="260" cy="40" r="5" fill="#00C853" />
      </svg>
    );
  }
  if (chip === "news") {
    /* 뉴스 = 신문 + yellow accent. */
    return (
      <svg
        viewBox="0 0 320 200"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="320" height="200" fill="#FAFAFA" />
        <g>
          <rect
            x="80"
            y="40"
            width="160"
            height="130"
            rx="6"
            fill="#FFFFFF"
            stroke="#E4E4E7"
            strokeWidth="1.5"
          />
          <rect x="100" y="60" width="120" height="10" rx="2" fill="#111418" />
          <g fill="#E4E4E7">
            <rect x="100" y="80" width="120" height="3" />
            <rect x="100" y="90" width="120" height="3" />
            <rect x="100" y="100" width="120" height="3" />
            <rect x="100" y="110" width="80" height="3" />
            <rect x="100" y="125" width="120" height="3" />
            <rect x="100" y="135" width="100" height="3" />
          </g>
          <rect
            x="220"
            y="48"
            width="14"
            height="14"
            rx="2"
            fill="#FFD400"
          />
        </g>
      </svg>
    );
  }
  /* 경매 기본정보 = 법원 + 망치 + green 강조. */
  return (
    <svg
      viewBox="0 0 320 200"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="320" height="200" fill="#FAFAFA" />
      <polygon points="80,80 240,80 160,50" fill="#E4E4E7" />
      <g fill="#D4D4D8">
        <rect x="90" y="80" width="14" height="80" />
        <rect x="118" y="80" width="14" height="80" />
        <rect x="188" y="80" width="14" height="80" />
        <rect x="216" y="80" width="14" height="80" />
      </g>
      <rect x="76" y="158" width="168" height="6" fill="#111418" />
      <g transform="translate(160 110) rotate(20)">
        <rect x="-6" y="-30" width="12" height="50" rx="2" fill="#111418" />
        <rect x="-26" y="-44" width="52" height="22" rx="3" fill="#111418" />
        <circle cx="0" cy="-33" r="3" fill="#00C853" />
      </g>
    </svg>
  );
}
