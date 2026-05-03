"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";

/* Phase 1.2 (A-1-2) v5 — InsightBlock (★ 신규 / 형준님 #5·#6 광역 적용).
 * "경매 인사이트" 광역 우산 (FreeAnalysisBlock 폐기 흡수).
 * eyebrow / h2 / sub + chip filter 5건 (전체 / 무료 물건분석 / 가이드 / 시장 인사이트 / 낙찰사례) +
 * 6 카드 (각 카테고리 1-2 카드) + Gemini 4 일러스트 import + grid mobile 2 col / md 3 col / lg 4 col. */

type Category = "all" | "analysis" | "guide" | "insight" | "cases";

const CHIPS: { key: Category; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "analysis", label: "무료 물건분석" },
  { key: "guide", label: "가이드" },
  { key: "insight", label: "시장 인사이트" },
  { key: "cases", label: "낙찰사례" },
];

const CARDS = [
  {
    cat: "analysis" as const,
    label: "무료 물건분석",
    title: "감정가 대비 −27% 진입선",
    desc: "권리 깨끗한 다세대 분석",
    img: "/illustrations/insight-cases-building.png",
    href: "/analysis",
  },
  {
    cat: "analysis" as const,
    label: "무료 물건분석",
    title: "임차보증금 인수 구조",
    desc: "HUG 말소동의 + 진입가 검토",
    img: "/illustrations/insight-cases-building.png",
    href: "/analysis",
  },
  {
    cat: "guide" as const,
    label: "가이드",
    title: "경매 입찰가, 얼마에 써야 할까",
    desc: "낙찰가 산정의 3가지 기준",
    img: "/illustrations/insight-guide-book.png",
    href: "/guide",
  },
  {
    cat: "guide" as const,
    label: "가이드",
    title: "경매 절차 전체 흐름",
    desc: "입찰부터 명도까지 4단계",
    img: "/illustrations/insight-guide-book.png",
    href: "/guide",
  },
  {
    cat: "insight" as const,
    label: "시장 인사이트",
    title: "경매 시황 — 4월 3주차",
    desc: "낙찰가율 소폭 상승",
    img: "/illustrations/insight-market-chart.png",
    href: "/news",
  },
  {
    cat: "cases" as const,
    label: "낙찰사례",
    title: "인천 오피스텔 1.25억 낙찰",
    desc: "경매퀵 입찰 대리 사례",
    img: "/illustrations/insight-news.png",
    href: "/news",
  },
];

export function InsightBlock() {
  const [active, setActive] = useState<Category>("all");

  const filtered = useMemo(() => {
    if (active === "all") return CARDS;
    return CARDS.filter((c) => c.cat === active);
  }, [active]);

  return (
    <section
      aria-labelledby="insight-heading"
      className="bg-[var(--bg-primary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-2xl">
            <p className="section-eyebrow">콘텐츠</p>
            <h2
              id="insight-heading"
              className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-[var(--text-primary)] lg:text-[40px]"
            >
              경매 인사이트
            </h2>
            <p className="mt-3 text-[14px] leading-[1.6] text-[var(--text-secondary)] lg:text-[16px]">
              물건분석부터 시장 동향까지, 경매 정보를 한 곳에서.
            </p>
          </div>
          <Link
            href="/analysis"
            className="text-[14px] font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:text-[var(--brand-green-deep)]"
          >
            전체 보기 →
          </Link>
        </div>

        {/* chip filter row 5건 (Code 자유 #4 — active charcoal + white text). */}
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

        {/* mobile 2 col / md 3 col / lg 4 col (형준님 #6). */}
        {filtered.length > 0 ? (
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {filtered.map((item, idx) => (
              <li key={`${item.cat}-${idx}`}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-1)] bg-white transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:-translate-y-1 hover:border-[var(--brand-green)]/20 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-secondary)]">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-4 lg:p-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--brand-green-deep)] lg:text-[11px]">
                      {item.label}
                    </span>
                    <h3 className="text-[14px] font-bold leading-[1.4] tracking-[-0.01em] text-[var(--text-primary)] line-clamp-2 lg:text-[17px]">
                      {item.title}
                    </h3>
                    <p className="text-[12px] leading-[1.55] text-[var(--text-secondary)] line-clamp-2 lg:text-[14px]">
                      {item.desc}
                    </p>
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
