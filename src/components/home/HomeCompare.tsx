"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Check } from "lucide-react";
import { COMPARE_DIRECT_STEPS, COMPARE_QUICK_STEPS } from "@/lib/constants";

/* cycle 1-G-γ-α-α — 메인 섹션 3: Compare (2-col 비교 카드 / 신규 paradigm).
 * paradigm: surface-muted bg + 좌 ink-100 (5시간 / 5단계) + 우 brand-green (10분 / 2단계).
 * 사전 cycle 1-G-γ-α 5 row pill paradigm 영구 폐기 (바토너 추종 NG). */

export function HomeCompare() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--color-surface-muted)] py-20 sm:py-32"
    >
      <div className="container-app mx-auto w-full max-w-[1200px]">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]"
        >
          Compare
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-[var(--color-ink-900)] sm:text-[64px]"
        >
          법원 가는 시간에서, <br className="hidden sm:block" />
          <span className="text-[var(--brand-green)]">물건 보는 시간</span>으로
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-5 text-base leading-7 text-[var(--color-ink-500)] sm:text-lg sm:leading-8"
        >
          5단계가 2단계로, 5시간이 10분으로 줄어듭니다.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* 좌 카드 (직접 입찰 / ink-100). */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col rounded-2xl bg-[var(--color-ink-100)] p-8 sm:p-10"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
              직접 입찰
            </p>
            <p className="mt-6 text-5xl font-black leading-none tabular-nums text-[var(--color-ink-700)] sm:text-7xl">
              5시간
            </p>
            <p className="mt-4 text-sm font-semibold text-[var(--color-ink-500)] sm:text-base">
              5단계
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {COMPARE_DIRECT_STEPS.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink-300)] text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-6 text-[var(--color-ink-700)]">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>

          {/* 우 카드 (경매퀵 대리 / brand-green). */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
            className="flex flex-col rounded-2xl bg-[var(--brand-green)] p-8 sm:p-10"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">
              경매퀵 대리
            </p>
            <p className="mt-6 text-5xl font-black leading-none tabular-nums text-white sm:text-7xl">
              10분
            </p>
            <p className="mt-4 text-sm font-semibold text-white/80 sm:text-base">
              2단계
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {COMPARE_QUICK_STEPS.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                    <Check size={12} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-6 text-white">
                    {i + 1}. {step}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
