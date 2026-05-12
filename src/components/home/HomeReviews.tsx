"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ReviewsMarquee } from "./ReviewsMarquee";

/* cycle 1-G-γ-α — 메인 섹션 6: Reviews.
 * paradigm: charcoal bg + ReviewsMarquee 차용 (사전 콘텐츠 영구 보존). */

export function HomeReviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      className="bg-[#111418] py-20 sm:py-32"
    >
      <div className="container-app mx-auto w-full max-w-[1200px]">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]"
        >
          Reviews
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-white sm:text-[64px]"
        >
          번거로움은 맡기고, <br className="hidden sm:block" />
          <span className="text-[var(--brand-green)]">일상에 투자</span>하세요
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>
      </div>
      <ReviewsMarquee />
    </section>
  );
}
