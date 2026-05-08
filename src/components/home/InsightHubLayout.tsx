"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { motion } from "motion/react";
import type { InsightItem } from "@/lib/content";
import { PageHero } from "@/components/common/PageHero";

/* Phase 1.2 (A-1-2) v38 — InsightHubLayout (Hybrid paradigm / Editor's Pick + 콘텐츠 list).
 * paradigm (Plan v38):
 * - useSearchParams ?cat={slug} → 칩 자동 활성 + 본문 광역 filter
 * - 칩 클릭 = router.push 광역 URL 쿼리 변경
 * - 본문 = Editor's Pick (전체 active 시) + 콘텐츠 list (active filter)
 * - 카드 paradigm = 모바일 1-col / 데스크탑 2-col + 썸네일 4:3 + 텍스트 광역. */

type FilterKey = "all" | "analysis" | "guide" | "glossary" | "data";

const CHIPS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "analysis", label: "무료 물건분석" },
  { key: "guide", label: "경매 가이드" },
  { key: "glossary", label: "경매 용어" },
  { key: "data", label: "경매 빅데이터" },
];

const CATEGORY_BG_MAP: Record<string, string> = {
  analysis: "/images/insight/analysis.jpg",
  guide: "/images/insight/guide.jpg",
  glossary: "/images/insight/glossary.jpg",
  data: "/images/insight/data.jpg",
};

const CATEGORY_LABEL_MAP: Record<string, string> = {
  analysis: "무료 물건분석",
  guide: "경매 가이드",
  glossary: "경매 용어",
  data: "경매 빅데이터",
};

function filterPosts(posts: InsightItem[], chip: FilterKey): InsightItem[] {
  if (chip === "all") return posts;
  // glossary = guide 흡수 (현 paradigm 정합 / content.ts InsightChipKey 광역 보존).
  if (chip === "glossary") return posts.filter((p) => p.chip === "guide");
  return posts.filter((p) => p.chip === chip);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function InsightHubLayout({ allPosts }: { allPosts: InsightItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cat = (searchParams.get("cat") ?? "all") as FilterKey;
  const active: FilterKey = CHIPS.some((c) => c.key === cat) ? cat : "all";

  const filtered = useMemo(() => filterPosts(allPosts, active), [allPosts, active]);
  const totalCount = filtered.length;
  const editorsPick = active === "all" && allPosts.length > 0 ? allPosts[0] : null;
  const restPosts = editorsPick ? filtered.filter((p) => p.slug !== editorsPick.slug) : filtered;

  function onChipClick(key: FilterKey) {
    const target = key === "all" ? "/insight" : `/insight?cat=${key}`;
    router.push(target, { scroll: false });
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero 영역 = PageHero 광역 (sub-page 광역 템플릿 / 카피 정수 = 사업 정수 paradigm). */}
      <PageHero
        eyebrow="경매 인사이트"
        title={
          <>
            <span className="text-[var(--brand-green)]">숫자</span>로 판단하는 경매
            <span style={{ color: "#FFD43B" }}>.</span>
          </>
        }
        subtitle="분석부터 가이드까지, 숫자로 보여드립니다."
      >
        {/* 칩 5건 (URL 쿼리 ?cat={slug} 광역 자동 활성). */}
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((chip) => {
            const isActive = active === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => onChipClick(chip.key)}
                className={
                  "rounded-full px-5 py-2 text-[14px] font-semibold transition " +
                  (isActive
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200")
                }
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </PageHero>

      {/* 본문 영역 (bg-white / 카운트 + Editor's Pick + 콘텐츠 list). */}
      <section className="bg-white">
        <div className="container-app w-full py-12 lg:py-16">
          <p className="text-[14px] font-semibold text-gray-500 lg:text-[15px]">
            총{" "}
            <strong className="tabular-nums text-[#111418]">{totalCount}</strong>
            건
          </p>

          {/* Editor's Pick (전체 칩 active 시 단독). */}
          {editorsPick && (
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="mt-8 lg:mt-10"
            >
              <Link
                href={editorsPick.href}
                className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 lg:flex lg:items-stretch"
              >
                <div
                  aria-hidden="true"
                  className="aspect-[4/3] w-full bg-gray-100 bg-cover bg-center lg:aspect-auto lg:w-[45%]"
                  style={{ backgroundImage: `url("${CATEGORY_BG_MAP[editorsPick.chip] ?? ""}")` }}
                />
                <div className="flex flex-col justify-center gap-3 p-6 lg:flex-1 lg:p-10">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[var(--brand-green)]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--brand-green)]">
                      Editor&apos;s Pick
                    </span>
                    <span className="text-[12px] font-semibold text-gray-500 lg:text-[13px]">
                      {CATEGORY_LABEL_MAP[editorsPick.chip] ?? editorsPick.chipLabel}
                    </span>
                  </div>
                  <h2 className="text-[22px] font-extrabold leading-tight tracking-[-0.01em] text-[#111418] lg:text-[32px]">
                    {editorsPick.title}
                  </h2>
                  {editorsPick.subtitle && (
                    <p className="line-clamp-2 text-[14px] leading-relaxed text-gray-600 lg:text-[16px]">
                      {editorsPick.subtitle}
                    </p>
                  )}
                  <p className="text-[12px] font-medium text-gray-500 lg:text-[13px]">
                    {formatDate(editorsPick.publishedAt)}
                  </p>
                </div>
              </Link>
            </motion.div>
          )}

          {/* 콘텐츠 list (모바일 1-col / 데스크탑 2-col). */}
          {restPosts.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-4 lg:mt-12 lg:grid-cols-2 lg:gap-6">
              {restPosts.map((post) => (
                <motion.div
                  key={`${post.chip}-${post.slug}`}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={post.href}
                    className="group flex gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 lg:p-4"
                  >
                    <div
                      aria-hidden="true"
                      className="aspect-[4/3] w-[120px] flex-shrink-0 rounded-lg bg-gray-100 bg-cover bg-center lg:w-[160px]"
                      style={{ backgroundImage: `url("${CATEGORY_BG_MAP[post.chip] ?? ""}")` }}
                    />
                    <div className="flex flex-1 flex-col justify-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--brand-green)] lg:text-[12px]">
                        {CATEGORY_LABEL_MAP[post.chip] ?? post.chipLabel}
                      </span>
                      <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-[#111418] lg:text-[17px]">
                        {post.title}
                      </h3>
                      {post.subtitle && (
                        <p className="line-clamp-1 text-[12px] text-gray-500 lg:text-[13px]">
                          {post.subtitle}
                        </p>
                      )}
                      <p className="text-[11px] font-medium text-gray-400 lg:text-[12px]">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-[14px] text-gray-500">
              아직 콘텐츠가 없습니다.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
