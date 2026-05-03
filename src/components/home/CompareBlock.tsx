"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "motion/react";

/* Phase 1.2 (A-1-2) v9 — CompareBlock (scroll-driven 변환 / Apple AirPods 변형).
 * h2 "법원 가는 3시간, 물건 보는 시간으로." (보존)
 * 좌 + 우 split scene (3시간 흑백 vs 0시간 컬러 변환).
 * scroll progress 0% → 100%: 우측 grayscale 100→0 + scale 1→1.05 + numeric green ↑.
 * filter saturate 분리: desktop md+ 1.2 (Wise green 정수) / mobile < md 1.0 (chromium repaint 비용 ↓).
 * fallback: scroll API 미지원 = motion graceful (split scene 정수 보존). */

export function CompareBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* progress 0~0.5 = entrance / 0.5~1 = exit. peak = 0.5 (한복판 영역 영역 ↑). */
  const grayscale = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.05]);
  const greenOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

  /* useMotionTemplate — saturate CSS variable 영역 분리 (desktop 1.2 / mobile 1.0). */
  const filterValue = useMotionTemplate`grayscale(${grayscale}%) var(--saturate)`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="compare-heading"
      className="bg-[var(--bg-primary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <h2
          id="compare-heading"
          className="mx-auto max-w-4xl text-center text-[var(--text-h2)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--text-primary)] [text-wrap:balance]"
          style={{ fontWeight: 800 }}
        >
          법원 가는{" "}
          <span className="text-[var(--text-tertiary)]">3시간</span>, 물건 보는{" "}
          <span className="text-[var(--brand-green)]">시간으로.</span>
        </h2>

        {/* split scene 좌(흑백 보존) / 우(컬러 변환). */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:gap-10">
          {/* 좌 — 흑백 보존 (대비 정수). */}
          <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#1A1F25] p-8 text-white">
            <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-white/50">
              직접 가는 길
            </span>
            <div
              className="mt-4 text-[80px] font-extrabold leading-none tracking-tight text-white/70 lg:text-[140px]"
              style={{ fontWeight: 800 }}
            >
              3<span className="text-[40px] lg:text-[64px] opacity-80">시간</span>
            </div>
            <p className="mt-4 max-w-xs text-center text-[14px] leading-[1.6] text-white/60 lg:text-[16px]">
              반차 · 수표 발행 · 서류 준비 · 대기.
            </p>
          </div>

          {/* 우 — 스크롤 변환 (흑백 → 컬러 + scale + green ↑). */}
          <motion.div
            className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#E6FAEE] p-8 text-[var(--text-primary)] [--saturate:saturate(1)] md:[--saturate:saturate(1.2)]"
            style={{
              filter: filterValue,
              scale,
            }}
          >
            <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--brand-green-deep)]">
              경매퀵 길
            </span>
            <motion.div
              className="mt-4 text-[80px] font-extrabold leading-none tracking-tight lg:text-[140px]"
              style={{
                fontWeight: 800,
                color: "var(--brand-green-deep)",
                opacity: greenOpacity,
              }}
            >
              0<span className="text-[40px] lg:text-[64px] opacity-80">시간</span>
            </motion.div>
            <p className="mt-4 max-w-xs text-center text-[14px] leading-[1.6] text-[var(--text-secondary)] lg:text-[16px]">
              사건번호 입력 → 결과 알림. 그것만.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
