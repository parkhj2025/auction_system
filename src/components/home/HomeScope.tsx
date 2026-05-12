"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Check, X } from "lucide-react";
import { SERVICE_SCOPE_DO, SERVICE_SCOPE_DONT } from "@/lib/constants";

/* cycle 1-G-γ-α — 메인 섹션 2: Scope.
 * paradigm: white bg + 2-col (모바일 1-col stack) + DO brand-green chip + DON'T ink-100 chip.
 * DON'T h3 정정 = "별도 위임 흐름" (사전 "전문가 영역" 영구 폐기 / 우리 비전문가 느낌 NG). */

export function HomeScope() {
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
          Scope
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-[var(--color-ink-900)] sm:text-[64px]"
        >
          우리가 <span className="text-[var(--brand-green)]">하는 일</span>, 그리고 <br className="hidden sm:block" />
          하지 않는 일
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* DO 카드. */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
          >
            <span className="inline-flex items-center rounded-full bg-[var(--brand-green)] px-3 py-1 text-xs font-bold text-white">
              DO
            </span>
            <h3 className="mt-5 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-[28px]">
              매수신청 대리
            </h3>
            <ul className="mt-6 flex flex-col gap-3">
              {SERVICE_SCOPE_DO.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check
                    size={20}
                    strokeWidth={2.5}
                    className="mt-0.5 shrink-0 text-[var(--brand-green)]"
                    aria-hidden="true"
                  />
                  <span className="text-base leading-7 text-[var(--color-ink-900)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>

          {/* DON'T 카드 (h3 정정 = "별도 위임 흐름"). */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
          >
            <span className="inline-flex items-center rounded-full bg-[var(--color-ink-100)] px-3 py-1 text-xs font-bold text-[var(--color-ink-700)]">
              DON&apos;T
            </span>
            <h3 className="mt-5 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-[28px]">
              별도 위임 흐름
            </h3>
            <ul className="mt-6 flex flex-col gap-3">
              {SERVICE_SCOPE_DONT.map((item) => (
                <li key={item} className="flex gap-3">
                  <X
                    size={20}
                    strokeWidth={2.5}
                    className="mt-0.5 shrink-0 text-[var(--color-ink-500)]"
                    aria-hidden="true"
                  />
                  <span className="text-base leading-7 text-[var(--color-ink-700)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-base leading-8 text-[var(--color-ink-500)] sm:text-lg sm:leading-9">
            범위 밖의 업무는 법무사 · 변호사 등 전문가에게 별도 위임해야 합니다.
          </p>
          <p className="mt-2 text-base leading-8 text-[var(--color-ink-500)] sm:text-lg sm:leading-9">
            이 경계가 고객과 저희 모두를 보호합니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
