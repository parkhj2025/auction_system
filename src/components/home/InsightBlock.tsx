"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";
import {
  InsightThumbnail,
  type InsightCategory,
  type InsightFeatured,
  type InsightCategorySlug,
} from "./InsightThumbnail";

/* Phase 1.2 (A-1-2) v50 cycle 8-2 — InsightBlock Magazine Editorial split paradigm.
 * 정정 (Cycle 8-2):
 * 1. 카드 grid 모바일 1-col / 데스크탑 2-col (cycle 8 grid-cols-2 / lg:grid-cols-4 회수)
 * 2. CATEGORIES color 필드 광역 폐기
 * 3. FEATURED_BY_CATEGORY 4 카테고리 카피 광역 정정 (호기심 paradigm + preview 필드 부활)
 * 4. featuredPost props 활용 광역 회수 (featured.title 직접) */

const CATEGORIES: InsightCategory[] = [
  { slug: "analysis", label: "무료 물건분석" },
  { slug: "guide", label: "경매 가이드" },
  { slug: "glossary", label: "경매 용어" },
  { slug: "data", label: "경매 빅데이터" },
];

const FEATURED_BY_CATEGORY: Record<InsightCategorySlug, InsightFeatured> = {
  analysis: {
    title: "이 물건, 왜 유찰됐을까",
    preview: "권리·시세·수익률 한 눈에",
  },
  guide: {
    title: "경매, 어디서부터 시작할까",
    preview: "낙찰까지 한 흐름",
  },
  glossary: {
    title: "이 단어, 무슨 뜻이지",
    preview: "사례로 풀어쓴 경매 사전",
  },
  data: {
    title: "지금 시장, 어디로 가나",
    preview: "데이터가 보여주는 흐름",
  },
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

export function InsightBlock() {
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

        {/* 4 카드 grid — 모바일 1-col 4-row / 데스크탑 2-col 2-row + stagger 진입. */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6"
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.slug} variants={cardVariants}>
              <InsightThumbnail
                category={cat}
                featured={FEATURED_BY_CATEGORY[cat.slug]}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
