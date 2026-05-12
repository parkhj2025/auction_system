"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SERVICE_TRUST_CHIPS } from "@/lib/constants";

/* cycle 1-G-γ — /service 섹션 5: CTA 마무리 (charcoal bg).
 * paradigm: 가운데 정렬 + 양 button + 3 짧은 chip (Trust 짧은 요약 / 5가지 안전장치 별개 섹션 영구 폐기). */

export function ServiceCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="bg-[#111418] py-20 sm:py-32"
    >
      <div className="container-app mx-auto w-full max-w-[800px] text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]"
        >
          Ready
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-white sm:text-[64px]"
        >
          지금, <span className="text-[var(--brand-green)]">시작</span>합니다
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-6 text-base leading-7 text-[var(--color-ink-300)] sm:text-lg sm:leading-8"
        >
          사건번호 한 번이면 충분합니다.
        </motion.p>

        {/* 양 button. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/apply"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--brand-green)] px-6 text-base font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418]"
          >
            입찰 대리 신청
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            href="/faq"
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 px-6 text-base font-bold text-white transition-colors duration-150 hover:bg-white/10"
          >
            자주 묻는 질문 보기
          </Link>
        </motion.div>

        {/* 3 짧은 chip = Trust 요약. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {SERVICE_TRUST_CHIPS.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80"
            >
              {chip}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
