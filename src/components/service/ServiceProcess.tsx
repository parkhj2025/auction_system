"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SERVICE_PROCESS_STEPS } from "@/lib/constants";

/* cycle 1-G-γ — /service 섹션 3: Process (5단계).
 * paradigm: brand-green 풀스크린 + horizontal step flow SVG + 5 step 카드 (모바일 1-col + 데스크탑 5-col).
 * 카톡 명시 영구 폐기 (Step 2 + Step 5). */

export function ServiceProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] w-full bg-[var(--brand-green)] py-20 sm:py-28"
    >
      <div className="container-app mx-auto w-full">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs font-bold uppercase tracking-wider text-white"
        >
          Process
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 text-[56px] font-black leading-[1.05] tracking-[-0.015em] text-white sm:text-[96px]"
        >
          접수부터 정산까지, 다섯 단계
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        {/* horizontal step flow SVG. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="mt-14 hidden lg:block"
        >
          <ProcessStepFlow inView={inView} />
        </motion.div>

        {/* 5 step 카드 (모바일 1-col + 데스크탑 5-col). */}
        <div className="mt-12 grid grid-cols-1 gap-5 lg:mt-10 lg:grid-cols-5">
          {SERVICE_PROCESS_STEPS.map((step, i) => (
            <motion.article
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.5 + i * 0.15,
              }}
              className="flex flex-col rounded-2xl border border-white/20 bg-transparent p-6 sm:p-8"
            >
              <p className="text-[48px] font-black leading-none tabular-nums text-white sm:text-[72px]">
                {step.number}
              </p>
              <h3 className="mt-6 text-2xl font-black tracking-tight text-white sm:text-[32px]">
                {step.title}
              </h3>
              <span className="mt-3 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                {step.dDay}
              </span>
              <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                {step.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 자체 SVG — horizontal step flow (5 step + 연결 line + scroll-triggered draw). */
function ProcessStepFlow({ inView }: { inView: boolean }) {
  const stepX = [80, 230, 380, 530, 680];

  return (
    <svg
      viewBox="0 0 760 120"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* 연결 line (draw). */}
      <motion.line
        x1="80"
        y1="60"
        x2="680"
        y2="60"
        stroke="white"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 0.6 } : {}}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
      />

      {/* 5 step circle. */}
      {stepX.map((x, i) => (
        <g key={i}>
          <motion.circle
            cx={x}
            cy="60"
            r="22"
            fill={i === 0 ? "#FFD43B" : "white"}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: 0.6 + i * 0.18,
            }}
          />
          <motion.text
            x={x}
            y="66"
            textAnchor="middle"
            fill={i === 0 ? "#111418" : "#00C853"}
            fontSize="14"
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: 0.8 + i * 0.18,
            }}
          >
            0{i + 1}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}
