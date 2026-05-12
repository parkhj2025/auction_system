"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { COMPARE_ROWS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* cycle 1-G-γ-α — 메인 섹션 3: Compare (시간 세이브 비교).
 * paradigm: surface-muted bg + 5 row pill (좌 일반 ink + 우 우리 brand-green).
 * 5번 row "소요 시간" = 큰 대비 paradigm 단독 (text-xl sm:text-2xl). */

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
          5시간이 5분으로 줄어듭니다.
        </motion.p>

        {/* 5 row 비교. */}
        <div className="mt-14 flex flex-col gap-4">
          {COMPARE_ROWS.map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.3 + i * 0.12,
              }}
              className="grid grid-cols-1 items-center gap-3 lg:grid-cols-[1fr_200px_1fr]"
            >
              {/* 좌 pill (일반). */}
              <div
                className={cn(
                  "flex items-center justify-center rounded-full bg-[var(--color-ink-100)] px-6 py-4 text-center font-semibold text-[var(--color-ink-700)]",
                  row.emphasis
                    ? "text-xl font-black sm:text-2xl"
                    : "text-base sm:text-lg"
                )}
              >
                {row.left}
              </div>

              {/* 가운데 카테고리 label. */}
              <div
                className={cn(
                  "flex items-center justify-center text-center",
                  row.emphasis
                    ? "text-base font-black tracking-tight text-[var(--color-ink-900)] sm:text-lg"
                    : "text-sm font-medium text-[var(--color-ink-500)] sm:text-base"
                )}
              >
                {row.category}
              </div>

              {/* 우 pill (경매퀵). */}
              <div
                className={cn(
                  "flex items-center justify-center rounded-full bg-[var(--brand-green)] px-6 py-4 text-center font-semibold text-white",
                  row.emphasis
                    ? "text-xl font-black sm:text-2xl"
                    : "text-base sm:text-lg"
                )}
              >
                {row.right}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
