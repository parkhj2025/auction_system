"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SERVICE_PROCESS_STEPS } from "@/lib/constants";

/* cycle 1-G-γ-α — 메인 섹션 4: Process (5단계 / /service Process 차용 paradigm 영구 보존). */

export function HomeProcess() {
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

        {/* horizontal step flow SVG (데스크탑 단독). */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="mt-14 hidden lg:block"
        >
          <ProcessStepFlow inView={inView} />
        </motion.div>

        {/* 5 step 카드 (5-col horizontal 압축 paradigm). */}
        <div className="mt-12 grid grid-cols-1 gap-4 lg:mt-10 lg:grid-cols-5">
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
              className="flex flex-col rounded-2xl border border-white/20 bg-transparent p-4 sm:p-6"
            >
              <p className="text-[40px] font-black leading-none tabular-nums text-white sm:text-[56px]">
                {step.number}
              </p>
              <h3 className="mt-4 text-xl font-black tracking-tight text-white sm:text-2xl">
                {step.title}
              </h3>
              <span className="mt-2 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white sm:text-sm">
                {step.dDay}
              </span>
              <p className="mt-4 text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                {step.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStepFlow({ inView }: { inView: boolean }) {
  const stepX = [80, 230, 380, 530, 680];
  return (
    <svg
      viewBox="0 0 760 120"
      className="h-full w-full"
      aria-hidden="true"
    >
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
