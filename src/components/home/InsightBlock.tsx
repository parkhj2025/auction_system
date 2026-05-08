"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";
import {
  InsightThumbnail,
  type InsightCategory,
  type InsightFeatured,
  type InsightCategorySlug,
} from "./InsightThumbnail";
import type { InsightFeaturedPost } from "@/lib/content";

/* Phase 1.2 (A-1-2) v50 cycle 8 — InsightBlock Magazine Editorial Poster Card paradigm.
 * 정정 (Cycle 8):
 * 1. motion + useInView 진입 애니메이션 (Pricing/Reviews 정합)
 * 2. h2 motion.h2 + fadeVariants (y:20 / duration:0.6 / easeOut)
 * 3. 카드 grid wrapper containerVariants (staggerChildren:0.1 / delayChildren:0.2)
 * 4. 각 카드 cardVariants (y:20 / duration:0.5 / easeOut)
 * 5. 칩 5건 + filter state 광역 폐기 (모든 카드 항상 4건 표시)
 * 6. FEATURED_BY_CATEGORY count + preview 필드 광역 폐기 (title fallback only)
 * 7. news → data slug 광역 정합 ("경매 빅데이터") */

const CATEGORIES: InsightCategory[] = [
  { slug: "analysis", label: "무료 물건분석", color: "green" },
  { slug: "guide", label: "경매 가이드", color: "blue" },
  { slug: "glossary", label: "경매 용어", color: "orange" },
  { slug: "data", label: "경매 빅데이터", color: "purple" },
];

const FEATURED_BY_CATEGORY: Record<InsightCategorySlug, InsightFeatured> = {
  analysis: { title: "사건번호 하나면, 분석 끝" },
  guide: { title: "처음부터 차근차근" },
  glossary: { title: "헷갈리는 용어, 한눈에" },
  data: { title: "공식 데이터, 가공해 드립니다" },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function InsightBlock({
  featuredByCategory,
}: {
  featuredByCategory: Record<InsightCategorySlug, InsightFeaturedPost>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="insight-heading"
      className="flex min-h-[calc(100vh-64px)] flex-col justify-center bg-[#FAFAFA] py-12 lg:min-h-[calc(100vh-80px)] lg:py-16"
    >
      <div className="container-app w-full">
        <motion.h2
          id="insight-heading"
          variants={fadeVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="mb-8 text-[48px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-12 lg:text-[96px]"
          style={{ fontWeight: 800 }}
        >
          분석 자료까지,
          <br />
          <span className="text-[var(--brand-green)]">무료로 드립니다</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        {/* 4 카드 균등 grid + stagger 진입. */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6"
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.slug} variants={cardVariants}>
              <InsightThumbnail
                category={cat}
                featured={FEATURED_BY_CATEGORY[cat.slug]}
                featuredPost={featuredByCategory[cat.slug]}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
