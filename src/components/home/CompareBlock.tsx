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

/* Phase 1.2 (A-1-2) v46 — CompareBlock 슬롯머신 + PPT Appear paradigm + 시퀀스 재정합.
 * 정정 (Plan v46):
 * 1. NumberFlow 슬롯머신 단순 transition (자리수 stagger setTimeout 폐기 / 좌 1 → 255 / 우 255 → 3)
 * 2. 배경 일러스트 영구 폐기 (형준님 (a) 채택 / public/illustrations + scripts/gen-compare-bg.ts 영구 삭제)
 * 3. "98% 단축" 위치 = ArrowRight 위 한 묶음 (가운데 column 안 vertical stack)
 * 4. 보조 카피 확대 entrance (scale 0.85 → 1 + fade / 500ms / cubic-bezier back-out)
 * 5. 5단계 PPT Appear stagger entrance (정상 색 / staggerChildren 0.08 / opacity 0 → 1 + y 12 → 0)
 * 6. 5단계 dim (Step 8 stamp 등장 시점 / opacity 1 → 0.3 / 동시 발화 / color 변경 0)
 * 7. stamp 5단계 가운데 absolute (top 50% / left 50% / translate -50% / z-10)
 * 8. 모바일 정합 보존 (px-5 / "255"·"3" 70 / 5단계 라벨 13 / 좌·우 라벨 18·24 weight 600)
 * 9. useInView once: true / amount 0.3 / 총 5초 8 Step
 *
 * 시퀀스:
 *   Step 0 (-300ms): h2
 *   Step 1 (0-300ms): 좌 라벨 fade
 *   Step 2 (300-1500ms): 좌 NumberFlow 1 → 255 슬롯머신
 *   Step 3 (1500-1900ms): ArrowRight + "98% 단축" 동시 (한 묶음)
 *   Step 4 (1900-2200ms): 우 라벨 fade
 *   Step 5 (2200-3400ms): 우 NumberFlow 255 → 3 슬롯머신
 *   Step 6 (3400-3900ms): 보조 카피 확대 entrance
 *   Step 7 (3900-4500ms): 5단계 PPT Appear stagger (정상 색)
 *   Step 8 (4500-5000ms): stamp + 5단계 dim 동시 */

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

// Step 0 — h2 (진입 즉시)
const headVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Step 1 — 좌 라벨 (0-300ms)
const leftLabelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

// Step 2 — 좌 NumberFlow span fade (300-1500ms)
const leftNumberVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
};

// Step 3 — ArrowRight (1500-1900ms)
const arrowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 1.5 } },
};

// Step 3 — "98% 단축" 배지 spring (1500-1900ms / ArrowRight 동시 / 한 묶음)
const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 1.5,
    },
  },
};

// Step 4 — 우 라벨 (1900-2200ms)
const rightLabelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 1.9 } },
};

// Step 5 — 우 NumberFlow span fade (2200-3400ms)
const rightNumberVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 2.2 } },
};

// Step 6 — 보조 카피 확대 entrance (3400-3900ms / scale 0.85 → 1 + fade / cubic-bezier back-out)
const subCopyVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 3.4,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

// Step 7 — 5 카드 PPT Appear stagger entrance (3900-4500ms)
const barContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 3.9,
    },
  },
};

// Step 7 + 8 — 5 카드 entrance + dim (Step 8 동시 발화 / color 변경 0)
const barVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  dim: {
    opacity: 0.3,
    transition: { duration: 0.5, delay: 4.6, ease: "easeInOut" },
  },
};

// Step 8 — stamp 5단계 가운데 absolute (4500-5000ms)
const stampVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay: 4.6 },
  },
};

export function CompareBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [leftValue, setLeftValue] = useState(1);
  const [rightValue, setRightValue] = useState(255);
  const [leftAnimated, setLeftAnimated] = useState(false);
  const [rightAnimated, setRightAnimated] = useState(false);

  useEffect(() => {
    if (isInView) {
      // Step 2 — 300ms 후 좌 슬롯머신 1 → 255 (1200ms slow-fast-slow)
      const t1 = setTimeout(() => {
        setLeftAnimated(true);
        setLeftValue(255);
      }, 300);
      // Step 5 — 2200ms 후 우 슬롯머신 255 → 3 (1200ms back-out)
      const t2 = setTimeout(() => {
        setRightAnimated(true);
        setRightValue(3);
      }, 2200);
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
      className="relative flex min-h-[calc(100vh-64px)] flex-col justify-center overflow-hidden bg-white py-12 lg:min-h-[calc(100vh-80px)] lg:py-16"
    >
      <div className="container-app w-full">
        {/* Step 0 — h2 */}
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

        {/* 큰 숫자 비교 — grid-cols-[1fr_auto_1fr] */}
        <div className="mb-12 grid grid-cols-[1fr_auto_1fr] items-center gap-2 lg:mb-16 lg:gap-8">
          {/* Step 1 + 2 — 좌측 라벨 + 좌 NumberFlow 1 → 255 (slow-fast-slow) */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              variants={leftLabelVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mb-2 text-[18px] font-semibold tracking-tight text-gray-500 lg:mb-4 lg:text-[24px]"
            >
              일반적인 방법
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
                  trend={1}
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

          {/* Step 3 — 가운데: "98% 단축" 배지 (위) + ArrowRight (아래) 한 묶음 */}
          <div className="flex flex-col items-center justify-center gap-2 lg:gap-3">
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="whitespace-nowrap rounded-full bg-[#ECFDF5] px-3 py-1 text-[24px] font-extrabold text-[var(--brand-green)] lg:px-4 lg:py-1.5 lg:text-[36px]"
              style={{ fontWeight: 800 }}
            >
              98% 단축
            </motion.div>
            <motion.div
              variants={arrowVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex justify-center"
            >
              <ArrowRight size={48} strokeWidth={2} className="text-gray-400 lg:hidden" />
              <ArrowRight size={64} strokeWidth={2} className="hidden text-gray-400 lg:block" />
            </motion.div>
          </div>

          {/* Step 4 + 5 — 우측 라벨 + 우 NumberFlow 255 → 3 (back-out) */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              variants={rightLabelVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mb-2 text-[18px] font-semibold tracking-tight text-[var(--brand-green)] lg:mb-4 lg:text-[24px]"
            >
              경매퀵을 이용하면
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
                  trend={-1}
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
          </div>
        </div>

        {/* Step 6 — 보조 카피 확대 entrance (scale 0.85 → 1 + fade / cubic-bezier back-out) */}
        <motion.div
          variants={subCopyVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12 text-center text-[28px] font-bold leading-[1.3] tracking-[-0.015em] text-gray-900 lg:mb-16 lg:text-[48px]"
          style={{ fontWeight: 700 }}
        >
          발품도 시간도, 단 한 번에.
        </motion.div>

        {/* Step 7 + 8 — 5 카드 PPT Appear stagger + dim + stamp 가운데 오버레이 */}
        <div className="relative mx-auto max-w-4xl">
          {/* Step 8 stamp — 5단계 가운데 absolute (top 50% / left 50% / translate -50%) */}
          <motion.div
            variants={stampVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#111418] px-5 py-2.5 text-[15px] font-bold text-[var(--brand-green)] lg:px-7 lg:py-3 lg:text-[20px]"
            style={{ fontWeight: 700 }}
          >
            이 모든 단계, 경매퀵이 대신합니다
          </motion.div>

          {/* Step 7 — 5 카드 PPT Appear stagger (정상 색) + Step 8 dim (동시 발화) */}
          <motion.div
            className="grid grid-cols-5 gap-2 lg:gap-4"
            variants={barContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {BAR_DATA.map(({ Icon, labelMobile, labelDesktop, minutes }) => (
              <motion.div
                key={labelDesktop}
                variants={barVariants}
                animate={isInView ? ["visible", "dim"] : "hidden"}
                className="flex flex-col items-center gap-2 lg:gap-3"
              >
                <Icon size={36} strokeWidth={2} className="text-gray-600 lg:hidden" />
                <Icon size={48} strokeWidth={2} className="hidden text-gray-600 lg:block" />
                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gray-400"
                    style={{ width: `${(minutes / 90) * 100}%` }}
                  />
                </div>
                <div className="text-[13px] font-semibold text-gray-700 lg:text-[18px]">
                  <span className="lg:hidden">
                    {labelMobile} {minutes}분
                  </span>
                  <span className="hidden lg:inline">
                    {labelDesktop} {minutes}분
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
