"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Users, Award, ShieldCheck } from "lucide-react";
import { ABOUT_TRUST, type AboutTrustIconKey } from "@/lib/constants";

/* cycle 1-G-β-γ-γ — /about 섹션 4: Trust System (Credentials 통합 paradigm).
 * paradigm: surface-muted bg + 3 카드 (lucide 96px + line1 28/36px + 본문 text-base sm:text-lg).
 * 풍성 paradigm = p-8 sm:p-10 + 큰 lucide + 큰 line1 + 충분 본문 (사전 Credentials 작은 paradigm 폐기). */

const ICON_MAP: Record<AboutTrustIconKey, typeof Users> = {
  users: Users,
  award: Award,
  shieldCheck: ShieldCheck,
};

export function AboutTrust() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--color-surface-muted)] py-20 sm:py-32"
    >
      <div className="container-app mx-auto w-full max-w-[1100px]">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]"
        >
          Trust System
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-[var(--color-ink-900)] sm:text-[64px]"
        >
          안전을, <span className="text-[var(--brand-green)]">시스템</span>으로 만들었습니다
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ABOUT_TRUST.map((item, i) => {
            const Icon = ICON_MAP[item.iconKey];
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.3 + i * 0.15,
                }}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 transition-transform duration-200 hover:-translate-y-1 sm:p-10"
              >
                <Icon
                  size={96}
                  strokeWidth={1.5}
                  className="text-[var(--brand-green)]"
                  aria-hidden="true"
                />
                <p className="mt-8 text-[28px] font-black tracking-tight text-[var(--color-ink-900)] sm:text-[36px]">
                  {item.line1}
                </p>
                <p className="mt-4 text-base leading-7 text-[var(--color-ink-500)] sm:text-lg sm:leading-8">
                  {item.body}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
