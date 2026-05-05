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

/* Phase 1.2 (A-1-2) v43 — CompareBlock 8 Step 시퀀스 (스코어보드 플립 + % 단축 + dim only).
 * 정정 (Plan v43):
 * 1. 8 Step 시퀀스 (PPT 순서 / 좌→우 / 1개씩 발화)
 * 2. 좌 NumberFlow 0 → 255 (Step 2 / 300-1500ms / 1200ms / ease-out)
 * 3. 우 NumberFlow 255 → 3 (Step 5 / 2100-3300ms / 1200ms / back-out)
 * 4. "98% 단축" 배지 (Step 6 / 3300-3800ms / spring / ArrowRight 아래)
 * 5. X 취소선 영구 폐기 (5단계 카드 dim only / opacity 0.3)
 * 6. stamp 오버레이 (Step 8 / 4300-4800ms / charcoal bg + green text)
 * 7. h2 마침표 yellow + "3시간" charcoal + "시간으로" green (v42 보존)
 * 8. 모바일 좌우 침범 정정 (grid-cols-[1fr_auto_1fr] / "255"/"3" 70px / "분" 16px)
 * 9. 모바일 5단계 짧은 카피 ("휴가 30분" / 12px) / 데스크탑 긴 카피 ("휴가 신청 30분" / 18px)
 * 10. Blueprint Grid + dotted curve 보존 (Step 3-5 동시 발화 / 1500-3300ms)
 * 11. useInView once: true / amount 0.3 */

type Bar = {
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  labelMobile: string;
  labelDesktop: string;
  minutes: number;
};

const BAR_DATA: Bar[] = [
  { Icon: Car, labelMobile: "휴가", labelDesktop: "휴가 신청", minutes: 30 },
  { Icon: FileText, labelMobile: "서류", labelDesktop: "서류 준비", minutes: 45 },
  { Icon: Banknote, labelMobile: "수표", labelDesktop: "수표 발행", minutes: 30 },
  { Icon: Building2, labelMobile: "이동", labelDesktop: "법원 이동", minutes: 60 },
  { Icon: Clock, labelMobile: "대기", labelDesktop: "입찰 대기", minutes: 90 },
];

// Step 0 — h2 + 보조 카피 (진입 즉시)
const headVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const subCopyVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } },
};

// Step 1 — 좌 라벨 fade (0-300ms)
const leftLabelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

// Step 2 — 좌 NumberFlow span fade (300-1500ms / NumberFlow 자체 카운트 광역)
const leftNumberVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
};

// Step 3 — ArrowRight fade + 미세 pulse (1500-1800ms)
const arrowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 1.5 } },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.4, delay: 1.6, ease: "easeInOut" },
  },
};

// Step 4 — 우 라벨 fade (1800-2100ms)
const rightLabelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 1.8 } },
};

// Step 5 — 우 NumberFlow span fade (2100-3300ms / NumberFlow 자체 카운트 광역)
const rightNumberVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 2.1 } },
};

// Step 6 — "98% 단축" 배지 spring (3300-3800ms)
const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 3.3,
    },
  },
};

// Step 7 — 5 카드 fade + 즉시 dim 0.3 (3800-4300ms)
const barVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.3, transition: { duration: 0.5, delay: 3.8 } },
};

// Step 8 — stamp scale entrance (4300-4800ms)
const stampVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay: 4.3 },
  },
};

// dotted curve (Step 3-5 동시 / 1500-3300ms / 1.8s duration)
const dottedCurveVariants: Variants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: { duration: 1.8, delay: 1.5, ease: "easeInOut" },
  },
};

export function CompareBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [leftValue, setLeftValue] = useState(0);
  const [rightValue, setRightValue] = useState(255);
  const [leftAnimated, setLeftAnimated] = useState(false);
  const [rightAnimated, setRightAnimated] = useState(false);

  useEffect(() => {
    if (isInView) {
      // Step 2 — 300ms 후 좌 카운트 0 → 255 (1200ms ease-out 가속 후 정착)
      const t1 = setTimeout(() => {
        setLeftAnimated(true);
        setLeftValue(255);
      }, 300);
      // Step 5 — 2100ms 후 우 카운트 255 → 3 (1200ms back-out / 감속 후 정착)
      const t2 = setTimeout(() => {
        setRightAnimated(true);
        setRightValue(3);
      }, 2100);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
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
      {/* dotted curve 배경 SVG (좌 → 가운데 → 우 곡선 흐름 / Step 3-5 동시 발화) */}
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
        {/* Step 0 — h2 (진입 즉시) */}
        <motion.h2
          id="compare-heading"
          variants={headVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12 text-center text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-16 lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          법원 가는 3시간,
          <br />
          물건 보는 <span className="text-[var(--brand-green)]">시간으로</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        {/* 큰 숫자 비교 — grid-cols-[1fr_auto_1fr] / 모바일 좌우 침범 정합 */}
        <div className="mb-8 grid grid-cols-[1fr_auto_1fr] items-start gap-2 lg:mb-12 lg:items-center lg:gap-8">
          {/* Step 1 + 2 — 좌측 라벨 + 좌 NumberFlow 카운트 0 → 255 */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              variants={leftLabelVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-gray-400 lg:mb-4 lg:text-[14px]"
            >
              직접 가는 길
            </motion.div>
            <motion.div
              variants={leftNumberVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex items-baseline justify-center gap-1"
            >
              <span
                className="text-[70px] font-extrabold leading-none text-gray-400 lg:text-[200px]"
                style={{ fontWeight: 800 }}
              >
                <NumberFlow
                  value={leftValue}
                  animated={leftAnimated}
                  transformTiming={{
                    duration: 1200,
                    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  spinTiming={{
                    duration: 1200,
                    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </span>
              <span className="text-[16px] font-bold text-gray-400 lg:text-[40px]">분</span>
            </motion.div>
          </div>

          {/* Step 3 + 6 — 가운데 ArrowRight + "98% 단축" 배지 (데스크탑 ArrowRight 아래) */}
          <div className="flex flex-col items-center justify-center gap-3 lg:gap-4">
            <motion.div
              variants={arrowVariants}
              animate={isInView ? ["visible", "pulse"] : "hidden"}
              className="flex justify-center"
            >
              <ArrowRight size={48} strokeWidth={2} className="text-gray-400 lg:hidden" />
              <ArrowRight size={64} strokeWidth={2} className="hidden text-gray-400 lg:block" />
            </motion.div>
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="hidden whitespace-nowrap rounded-full bg-[#ECFDF5] px-4 py-1.5 text-[36px] font-extrabold text-[var(--brand-green)] lg:block"
              style={{ fontWeight: 800 }}
            >
              98% 단축
            </motion.div>
          </div>

          {/* Step 4 + 5 — 우측 라벨 + 우 NumberFlow 카운트 255 → 3 */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              variants={rightLabelVariants}
              initial="hidden"
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
                className="text-[70px] font-extrabold leading-none text-[var(--brand-green)] lg:text-[200px]"
                style={{ fontWeight: 800 }}
              >
                <NumberFlow
                  value={rightValue}
                  animated={rightAnimated}
                  transformTiming={{
                    duration: 1200,
                    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  spinTiming={{
                    duration: 1200,
                    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </span>
              <span className="text-[16px] font-bold text-[var(--brand-green)] lg:text-[40px]">분</span>
            </motion.div>

            {/* 모바일 배지 — "3" 아래 vertical stack */}
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mt-3 whitespace-nowrap rounded-full bg-[#ECFDF5] px-3 py-1 text-[24px] font-extrabold text-[var(--brand-green)] lg:hidden"
              style={{ fontWeight: 800 }}
            >
              98% 단축
            </motion.div>
          </div>
        </div>

        {/* Step 0 — 보조 카피 (진입 즉시 / h2 후속) */}
        <motion.div
          variants={subCopyVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12 text-center text-[28px] font-bold leading-[1.3] tracking-[-0.015em] text-gray-900 lg:mb-16 lg:text-[48px]"
          style={{ fontWeight: 700 }}
        >
          발품도 시간도, 단 한 번에.
        </motion.div>

        {/* Step 7 + 8 — 5 카드 + stamp 오버레이 */}
        <div className="relative mx-auto max-w-4xl">
          {/* Step 8 stamp (charcoal bg + green text / CTA 시각 충돌 회피) */}
          <motion.div
            variants={stampVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111418] px-4 py-2 text-[14px] font-bold text-[var(--brand-green)] lg:-top-5 lg:px-6 lg:py-2.5 lg:text-[18px]"
            style={{ fontWeight: 700 }}
          >
            이 모든 단계, 경매퀵이 대신합니다
          </motion.div>

          {/* Step 7 — 5 카드 grid (X 취소선 폐기 / dim only) */}
          <div className="grid grid-cols-5 gap-2 pt-6 lg:gap-4 lg:pt-8">
            {BAR_DATA.map(({ Icon, labelMobile, labelDesktop, minutes }) => (
              <motion.div
                key={labelDesktop}
                variants={barVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="flex flex-col items-center gap-1 lg:gap-2"
              >
                <Icon size={20} strokeWidth={2} className="text-gray-300" />
                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gray-200"
                    style={{ width: `${(minutes / 90) * 100}%` }}
                  />
                </div>
                <div className="text-[12px] font-semibold text-gray-400 lg:text-[18px]">
                  <span className="lg:hidden">
                    {labelMobile} {minutes}분
                  </span>
                  <span className="hidden lg:inline">
                    {labelDesktop} {minutes}분
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
