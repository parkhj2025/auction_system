"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ABOUT_PROBLEMS } from "@/lib/constants";

/* cycle 1-G-β-γ-γ — /about 섹션 2: Problems (고객 problem 직접 표현).
 * paradigm: white bg + 4 카드 (모바일 1-col + 데스크탑 2-col) + 큰 카피 + sub.
 * scroll-triggered stagger 진입. */

export function AboutProblems() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="border-t border-[var(--color-border)] bg-white py-20 sm:py-32"
    >
      <div className="container-app mx-auto w-full max-w-[1100px]">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]"
        >
          Why we exist
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-[var(--color-ink-900)] sm:text-[64px]"
        >
          경매의 시작이 <span className="text-[var(--brand-green)]">가장 큰 벽</span>이었습니다
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {ABOUT_PROBLEMS.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.3 + i * 0.1,
              }}
              className="rounded-2xl border border-gray-200 bg-white p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-8"
            >
              <p className="text-2xl font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-[32px]">
                {item.bigCopy}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink-500)] sm:text-base">
                {item.subCopy}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
