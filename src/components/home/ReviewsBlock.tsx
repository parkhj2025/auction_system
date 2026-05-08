"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";
import { ReviewsMarquee } from "./ReviewsMarquee";

/* Phase 1.2 (A-1-2) v2 — ReviewsBlock 광역 재작성.
 * - 현 grid 6 카드 + "예시로 작성된 후기입니다." sub 광역 폐기
 * - 신규 paradigm: 2-row 양방향 marquee + chat bubble + 이모지 avatar (ReviewsMarquee 분리)
 * - section bg-white + h2 정정 ("번거로움은 맡기고, / 일상에 투자하세요.") + sub 폐기
 * - h2 강조: "투자하세요" green / 쉼표 + 마침표 yellow #FFD43B (영구 룰 §9 정합) */

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function ReviewsBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="reviews-heading"
      className="bg-white py-16 lg:py-24"
    >
      <div className="container-app w-full">
        <motion.h2
          id="reviews-heading"
          variants={fadeVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-8 text-[48px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-12 lg:text-[96px]"
          style={{ fontWeight: 800 }}
        >
          번거로움은 맡기고
          <span style={{ color: "#FFD43B" }}>,</span>
          <br />
          일상에 <span className="text-[var(--brand-green)]">투자하세요</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>
      </div>

      <ReviewsMarquee />
    </section>
  );
}
