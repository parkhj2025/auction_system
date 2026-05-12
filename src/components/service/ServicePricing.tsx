"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SERVICE_PRICING_TIERS } from "@/lib/constants";

/* cycle 1-G-γ — /service 섹션 4: Pricing (정찰제 / 가격 작은 paradigm).
 * paradigm: surface-muted bg + 3 카드 (작은 가격 32/40px + 시점 강조 단독 / v62 일치).
 * 광역 chip = "낙찰 성공보수 +5만원". */

export function ServicePricing() {
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
          Pricing
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-[var(--color-ink-900)] sm:text-[64px]"
        >
          신청 시점으로, <span className="text-[var(--brand-green)]">정찰제</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {SERVICE_PRICING_TIERS.map((tier, i) => (
            <motion.article
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.3 + i * 0.15,
              }}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 transition-transform duration-200 hover:-translate-y-1 sm:p-10"
            >
              <h3 className="text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-[32px]">
                {tier.title}
              </h3>
              <span className="mt-3 inline-flex w-fit items-center rounded-full bg-[var(--color-ink-100)] px-3 py-1 text-sm font-semibold text-[var(--color-ink-700)]">
                {tier.dDay}
              </span>
              <p className="mt-8 text-[32px] font-black leading-none tabular-nums text-[var(--brand-green)] sm:text-[40px]">
                {tier.priceLabel}
              </p>
              <p className="mt-5 text-base leading-7 text-[var(--color-ink-500)]">
                {tier.body}
              </p>
            </motion.article>
          ))}
        </div>

        {/* 광역 chip = 낙찰 성공보수. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.85 }}
          className="mt-10 flex justify-center"
        >
          <span className="inline-flex items-center rounded-full bg-[var(--color-ink-100)] px-4 py-2 text-sm font-semibold text-[var(--color-ink-700)]">
            낙찰 성공보수 +5만원 (낙찰 시 단독 청구)
          </span>
        </motion.div>
      </div>
    </section>
  );
}
