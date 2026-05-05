"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, type Variants } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  Car,
  FileText,
  Banknote,
  Building2,
  Clock,
  ArrowRight,
} from "lucide-react";

/* Phase 1.2 (A-1-2) v42 — CompareBlock 5 phase choreography (잭팟 + X 취소선 + 배지 + stamp + dotted curve).
 * 정정 (Plan v42):
 * 1. h2 "3시간" 회색 변조 폐기 (charcoal 통일)
 * 2. Phase 1 entrance (0-300ms) — 라벨 + 좌 255 + 우 3 + 5 카드 wave + ArrowRight + 보조 카피
 * 3. Phase 2 잭팟 (300-1900ms) — NumberFlow 255 → 3 / cubic-bezier(0.34, 1.56, 0.64, 1) / 1600ms
 * 4. Phase 3 strike + dim (1500-2100ms) — X 취소선 5 카드 stagger + 5 카드 + 좌 255 + 좌 라벨 dim
 * 5. Phase 4 settle + curve (1900-2400ms) — ArrowRight bounce + dotted curve + 배지 spring entrance
 * 6. "−252분" 배지 (#ECFDF5 bg + #00C853 text / 모바일 24 / 데스크탑 36)
 * 7. Phase 5 stamp (2400-2900ms) — charcoal #111418 bg + green text (CTA 시각 충돌 회피)
 * 8. trigger useInView once: true / amount 0.3
 * 9. dotted curve SVG (좌 → 가운데 → 우 / opacity 0.15 / stroke-dasharray)
 * 10. h2 마침표 yellow (보존)
 * 11. skeleton 도식 폐기 (Code 정정 채택 / 11 layer 누적 회피) */

type Bar = {
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  label: string;
  minutes: number;
};

const BAR_DATA: Bar[] = [
  { Icon: Car, label: "휴가 신청", minutes: 30 },
  { Icon: FileText, label: "서류 준비", minutes: 45 },
  { Icon: Banknote, label: "수표 발행", minutes: 30 },
  { Icon: Building2, label: "법원 이동", minutes: 60 },
  { Icon: Clock, label: "입찰 대기", minutes: 90 },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const labelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  dim: { opacity: 0.4, transition: { duration: 0.5, delay: 1.5, ease: "easeInOut" } },
};

const leftNumberVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  dim: { opacity: 0.4, transition: { duration: 0.5, delay: 1.5, ease: "easeInOut" } },
};

const rightNumberVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

const barVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  dim: { opacity: 0.25, transition: { duration: 0.5, delay: 1.5, ease: "easeInOut" } },
};

const arrowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
  bounce: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.4, delay: 1.9, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const subCopyVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.4 } },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 15, delay: 1.9 },
  },
};

const stampVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay: 2.4, ease: "easeOut" },
  },
};

const dottedCurveVariants: Variants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: { duration: 0.4, delay: 1.5, ease: "easeOut" },
  },
};

export function CompareBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [rightValue, setRightValue] = useState(255);
  const [rightAnimated, setRightAnimated] = useState(false);

  useEffect(() => {
    if (isInView) {
      // Phase 2 — 300ms 후 잭팟 발화 (255 → 3 / 1600ms back-out spring)
      const t = setTimeout(() => {
        setRightAnimated(true);
        setRightValue(3);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="compare-heading"
      className="relative flex min-h-[calc(100vh-64px)] flex-col justify-center overflow-hidden py-12 lg:min-h-[calc(100vh-80px)] lg:py-16"
      style={{
        backgroundColor: "white",
        backgroundImage:
          "linear-gradient(to right, rgba(229,231,235,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(229,231,235,0.5) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* dotted curve 배경 SVG (좌 → 가운데 → 우 곡선 흐름) */}
      <motion.svg
        className="pointer-events-none absolute inset-x-0 top-[42%] z-0 h-[180px] -translate-y-1/2 lg:top-[45%] lg:h-[260px]"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        fill="none"
        style={{ opacity: 0.18 }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.path
          d="M 100 130 Q 500 30, 900 110"
          stroke="rgb(156 163 175)"
          strokeWidth={2}
          strokeDasharray="6 6"
          strokeLinecap="round"
          variants={dottedCurveVariants}
        />
      </motion.svg>

      <div className="container-app relative z-10 w-full">
        <h2
          id="compare-heading"
          className="mb-12 text-center text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-16 lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          법원 가는 3시간,
          <br />
          물건 보는 <span className="text-[var(--brand-green)]">시간으로</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </h2>

        {/* 큰 숫자 직접 비교 — 좌 (gray + dim) vs 가운데 (배지 + ArrowRight) vs 우 (green 잭팟) */}
        <motion.div
          className="mb-8 grid grid-cols-3 items-start gap-4 lg:mb-12 lg:items-center lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* 좌측 — 직접 가는 길 (Phase 3 dim 0.4) */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              variants={labelVariants}
              animate={isInView ? ["visible", "dim"] : "hidden"}
              className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-gray-400 lg:mb-4 lg:text-[14px]"
            >
              직접 가는 길
            </motion.div>
            <motion.div
              variants={leftNumberVariants}
              animate={isInView ? ["visible", "dim"] : "hidden"}
              className="flex items-baseline justify-center gap-1"
            >
              <span
                className="text-[80px] font-extrabold leading-none text-gray-400 lg:text-[200px]"
                style={{ fontWeight: 800 }}
              >
                <NumberFlow value={255} />
              </span>
              <span className="text-[20px] font-bold text-gray-400 lg:text-[40px]">분</span>
            </motion.div>
          </div>

          {/* 가운데 — 데스크탑 배지 (ArrowRight 위) + ArrowRight bounce */}
          <div className="flex flex-col items-center justify-center gap-3 lg:gap-4">
            {/* 데스크탑 배지 */}
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="hidden whitespace-nowrap rounded-full bg-[#ECFDF5] px-4 py-1.5 text-[36px] font-extrabold text-[var(--brand-green)] lg:block"
              style={{ fontWeight: 800 }}
            >
              −252분
            </motion.div>
            <motion.div
              variants={arrowVariants}
              animate={isInView ? ["visible", "bounce"] : "hidden"}
              className="flex justify-center"
            >
              <ArrowRight size={48} strokeWidth={2} className="text-gray-400 lg:hidden" />
              <ArrowRight size={64} strokeWidth={2} className="hidden text-gray-400 lg:block" />
            </motion.div>
          </div>

          {/* 우측 — 경매퀵 길 (잭팟 카운트 255 → 3) */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              variants={labelVariants}
              animate={isInView ? "visible" : "hidden"}
              className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--brand-green)] lg:mb-4 lg:text-[14px]"
            >
              경매퀵 길
            </motion.div>
            <motion.div
              variants={rightNumberVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex items-baseline justify-center gap-1"
            >
              <span
                className="text-[80px] font-extrabold leading-none text-[var(--brand-green)] lg:text-[200px]"
                style={{ fontWeight: 800 }}
              >
                <NumberFlow
                  value={rightValue}
                  animated={rightAnimated}
                  transformTiming={{
                    duration: 1600,
                    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  spinTiming={{
                    duration: 1600,
                    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </span>
              <span className="text-[20px] font-bold text-[var(--brand-green)] lg:text-[40px]">분</span>
            </motion.div>

            {/* 모바일 배지 — "3" 아래 vertical stack */}
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mt-3 whitespace-nowrap rounded-full bg-[#ECFDF5] px-3 py-1 text-[24px] font-extrabold text-[var(--brand-green)] lg:hidden"
              style={{ fontWeight: 800 }}
            >
              −252분
            </motion.div>
          </div>
        </motion.div>

        {/* 보조 카피 (grid 외 / 한 줄 정합) */}
        <motion.div
          variants={subCopyVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12 text-center text-[28px] font-bold leading-[1.3] tracking-[-0.015em] text-gray-900 lg:mb-16 lg:text-[48px]"
          style={{ fontWeight: 700 }}
        >
          발품도 시간도, 단 한 번에.
        </motion.div>

        {/* 5 단계 카드 + stamp */}
        <div className="relative mx-auto max-w-4xl">
          {/* stamp — 5단계 위 가운데 (charcoal bg + green text / CTA 시각 충돌 회피) */}
          <motion.div
            variants={stampVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111418] px-4 py-2 text-[14px] font-bold text-[var(--brand-green)] lg:-top-5 lg:px-6 lg:py-2.5 lg:text-[18px]"
            style={{ fontWeight: 700 }}
          >
            이 모든 단계, 경매퀵이 대신합니다
          </motion.div>

          {/* 5 카드 grid — wave entrance + dim + X 취소선 */}
          <motion.div
            className="grid grid-cols-5 gap-2 pt-6 lg:gap-4 lg:pt-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {BAR_DATA.map(({ Icon, label, minutes }, idx) => (
              <motion.div
                key={label}
                variants={barVariants}
                animate={isInView ? ["visible", "dim"] : "hidden"}
                className="relative flex flex-col items-center gap-1 lg:gap-2"
              >
                {/* X 취소선 SVG — 카드 위 absolute / vector-effect non-scaling-stroke */}
                <svg
                  className="pointer-events-none absolute inset-0 z-10"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <motion.line
                    x1="20"
                    y1="20"
                    x2="80"
                    y2="80"
                    stroke="rgb(156 163 175)"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    className="[stroke-width:1.5] lg:[stroke-width:2]"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 1.5 + idx * 0.06,
                      ease: "easeOut",
                    }}
                  />
                  <motion.line
                    x1="80"
                    y1="20"
                    x2="20"
                    y2="80"
                    stroke="rgb(156 163 175)"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    className="[stroke-width:1.5] lg:[stroke-width:2]"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 1.5 + idx * 0.06,
                      ease: "easeOut",
                    }}
                  />
                </svg>

                <Icon size={20} strokeWidth={2} className="text-gray-400" />
                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gray-300"
                    style={{ width: `${(minutes / 90) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] font-semibold text-gray-500 lg:text-[13px]">
                  {label} {minutes}분
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
