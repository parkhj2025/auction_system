"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ABOUT_VALUES } from "@/lib/constants";

/* cycle 1-G-β-γ-β — /about 섹션 2: 가치 제안.
 * paradigm: 풀스크린 brand-green bg + 가운데 자체 SVG (시간·이동·집중 추상) + 3 카드 (모바일 1-col + 데스크탑 3-col).
 * motion v12 = h2 fade + SVG draw + 3 카드 stagger. */

export function AboutValues() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] w-full bg-[var(--brand-green)] py-20 sm:py-28"
    >
      <div className="container-app mx-auto flex w-full flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs font-bold uppercase tracking-wider text-white"
        >
          Why us
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 text-[56px] font-black leading-[1.05] tracking-[-0.015em] text-white sm:text-[96px]"
        >
          세 가지로, 새롭게 갑니다
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        {/* 가운데 자체 SVG (시간·이동·집중 추상 / scroll-triggered draw). */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="mt-12 w-full max-w-[600px]"
        >
          <ValuesFlow inView={inView} />
        </motion.div>

        {/* 3 카드 (모바일 1-col + 데스크탑 3-col / stagger). */}
        <div className="mt-16 grid w-full grid-cols-1 gap-5 md:grid-cols-3">
          {ABOUT_VALUES.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.5 + i * 0.15,
              }}
              className="flex flex-col rounded-2xl border border-white/20 bg-transparent p-6 text-left sm:p-8"
            >
              <p className="text-[80px] font-black leading-none tabular-nums text-white sm:text-[120px]">
                {item.bigCopy}
              </p>
              <p className="mt-6 text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
                {item.subCopy}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 자체 SVG — 시간·이동·집중 추상 (white outline + yellow accent). */
function ValuesFlow({ inView }: { inView: boolean }) {
  return (
    <svg
      viewBox="0 0 600 200"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* 좌 = 시간 (시계). */}
      <g>
        <motion.circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        />
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="65"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
        />
        <motion.line
          x1="100"
          y1="100"
          x2="125"
          y2="100"
          stroke="#FFD43B"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.4 }}
        />
        <circle cx="100" cy="100" r="3" fill="#FFD43B" />
      </g>

      {/* 화살표 1 (좌 → 가운데). */}
      <motion.path
        d="M 165 100 L 235 100"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#arrow-w)"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1.6 }}
      />

      {/* 가운데 = 이동 (화살표 + 점). */}
      <g>
        <motion.circle
          cx="300"
          cy="100"
          r="50"
          fill="none"
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1.8 }}
        />
        <motion.path
          d="M 280 100 L 320 100 M 308 88 L 320 100 L 308 112"
          stroke="#FFD43B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 2.4 }}
        />
      </g>

      {/* 화살표 2 (가운데 → 우). */}
      <motion.path
        d="M 365 100 L 435 100"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut", delay: 2.8 }}
      />

      {/* 우 = 집중 (큰 원 + 작은 원). */}
      <g>
        <motion.circle
          cx="500"
          cy="100"
          r="50"
          fill="none"
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 3 }}
        />
        <motion.circle
          cx="500"
          cy="100"
          r="30"
          fill="none"
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1, ease: "easeOut", delay: 3.4 }}
        />
        <motion.circle
          cx="500"
          cy="100"
          r="10"
          fill="#FFD43B"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 3.8 }}
        />
      </g>

      <defs>
        <marker
          id="arrow-w"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="white" />
        </marker>
      </defs>
    </svg>
  );
}
