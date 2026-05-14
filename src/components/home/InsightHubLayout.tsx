"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { InsightItem } from "@/lib/content";
import { PageHero } from "@/components/common/PageHero";

/* Phase 1.2 (A-1-2) v38 — InsightHubLayout (Hybrid paradigm / Editor's Pick + 콘텐츠 list).
 *
 * work-011 정정 paradigm 단단:
 *   1+2+3. 카드 hover = Premium Editorial++ (Code 자율 통합) 단단:
 *     - 카드 lift -4px + 2-layer shadow (brand-green tinted + dark depth)
 *     - 사진 scale 1.05 + brightness 1.05
 *     - title underline brand-green 60% (편집자 craft)
 *     - ArrowRight CTA + group-hover translate-x + opacity reveal
 *     - cubic-bezier(0.16, 1, 0.3, 1) Vercel ease-out-expo + duration 400ms
 *     - Editor's Pick + rest 카드 동일 paradigm
 *   4. 모바일 sticky :hover 회피 = framer motion variants 단독 paradigm (whileHover + whileTap)
 *      + Tailwind hover: prefix 영역 0 (Tailwind v4 default `@media (hover:hover)` 분기 정합 + framer touch 자동 비활성 사실)
 *   5+6. /data + /glossary chip 폐기 (4 → 2 카테고리 + 전체 = 3 chip)
 *   7. CATEGORY_BG_MAP / CATEGORY_LABEL_MAP 안 data + glossary 영역 보존 (post.chip 광역 매칭 paradigm — 사전 콘텐츠 잔존 시점 fallback paradigm)
 */

type FilterKey = "all" | "analysis" | "guide";

const CHIPS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "analysis", label: "무료 물건분석" },
  { key: "guide", label: "경매 가이드" },
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
  return posts.filter((p) => p.chip === chip);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/* ─────────────────────────  motion variants (Premium Editorial++)  ───────────────────────── */

const CARD_TRANSITION = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

const cardVariants: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
  },
  hover: {
    y: -4,
    boxShadow:
      "0 12px 24px -8px rgba(0, 200, 83, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.08)",
  },
  tap: {
    scale: 0.98,
  },
};

const imageVariants: Variants = {
  rest: { scale: 1, filter: "brightness(1)" },
  hover: { scale: 1.05, filter: "brightness(1.05)" },
};

const titleVariants: Variants = {
  rest: { textDecorationColor: "rgba(0, 200, 83, 0)" },
  hover: { textDecorationColor: "rgba(0, 200, 83, 0.6)" },
};

const arrowVariants: Variants = {
  rest: { x: 0, opacity: 0.45 },
  hover: { x: 4, opacity: 1 },
};

/* ─────────────────────────  Main Layout  ───────────────────────── */

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
        {/* 칩 3건 (전체 + 무료 물건분석 + 경매 가이드 / work-011 정정 5+6 사후 4 → 2 카테고리). */}
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

          {/* Editor's Pick (전체 칩 active 시 단독 / 후보 5 paradigm 적용). */}
          {editorsPick && (
            <motion.div
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileTap="tap"
              variants={cardVariants}
              transition={CARD_TRANSITION}
              className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-[var(--brand-green)]/40 focus-within:ring-offset-2 lg:mt-10"
            >
              <Link
                href={editorsPick.href}
                className="group block focus-visible:outline-none lg:flex lg:items-stretch"
              >
                <motion.div
                  aria-hidden="true"
                  variants={imageVariants}
                  transition={CARD_TRANSITION}
                  className="aspect-[4/3] w-full origin-center bg-gray-100 bg-cover bg-center lg:aspect-auto lg:w-[45%]"
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
                  <motion.h2
                    variants={titleVariants}
                    transition={CARD_TRANSITION}
                    className="text-[22px] font-extrabold leading-tight tracking-[-0.01em] text-[#111418] lg:text-[32px]"
                    style={{
                      textDecorationLine: "underline",
                      textDecorationThickness: "2px",
                      textUnderlineOffset: "4px",
                    }}
                  >
                    {editorsPick.title}
                  </motion.h2>
                  {editorsPick.subtitle && (
                    <p className="line-clamp-2 text-[14px] leading-relaxed text-gray-600 lg:text-[16px]">
                      {editorsPick.subtitle}
                    </p>
                  )}
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="text-[12px] font-medium text-gray-500 lg:text-[13px]">
                      {formatDate(editorsPick.publishedAt)}
                    </p>
                    <motion.span
                      aria-hidden="true"
                      variants={arrowVariants}
                      transition={CARD_TRANSITION}
                      className="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--brand-green)] lg:text-[13px]"
                    >
                      자세히 보기
                      <ArrowRight size={16} strokeWidth={2.2} />
                    </motion.span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* 콘텐츠 list (모바일 1-col / 데스크탑 2-col / 후보 5 paradigm 적용). */}
          {restPosts.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-4 lg:mt-12 lg:grid-cols-2 lg:gap-6">
              {restPosts.map((post) => (
                <motion.div
                  key={`${post.chip}-${post.slug}`}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  whileTap="tap"
                  variants={cardVariants}
                  transition={CARD_TRANSITION}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-[var(--brand-green)]/40 focus-within:ring-offset-2"
                >
                  <Link
                    href={post.href}
                    className="group flex gap-4 p-3 focus-visible:outline-none lg:p-4"
                  >
                    <motion.div
                      aria-hidden="true"
                      variants={imageVariants}
                      transition={CARD_TRANSITION}
                      className="aspect-[4/3] w-[120px] flex-shrink-0 origin-center overflow-hidden rounded-lg bg-gray-100 bg-cover bg-center lg:w-[160px]"
                      style={{ backgroundImage: `url("${CATEGORY_BG_MAP[post.chip] ?? ""}")` }}
                    />
                    <div className="flex flex-1 flex-col justify-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--brand-green)] lg:text-[12px]">
                        {CATEGORY_LABEL_MAP[post.chip] ?? post.chipLabel}
                      </span>
                      <motion.h3
                        variants={titleVariants}
                        transition={CARD_TRANSITION}
                        className="line-clamp-2 text-[15px] font-bold leading-tight text-[#111418] lg:text-[17px]"
                        style={{
                          textDecorationLine: "underline",
                          textDecorationThickness: "2px",
                          textUnderlineOffset: "4px",
                        }}
                      >
                        {post.title}
                      </motion.h3>
                      {post.subtitle && (
                        <p className="line-clamp-1 text-[12px] text-gray-500 lg:text-[13px]">
                          {post.subtitle}
                        </p>
                      )}
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className="text-[11px] font-medium text-gray-400 lg:text-[12px]">
                          {formatDate(post.publishedAt)}
                        </p>
                        <motion.span
                          aria-hidden="true"
                          variants={arrowVariants}
                          transition={CARD_TRANSITION}
                          className="inline-flex items-center text-[var(--brand-green)]"
                        >
                          <ArrowRight size={14} strokeWidth={2.2} />
                        </motion.span>
                      </div>
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
