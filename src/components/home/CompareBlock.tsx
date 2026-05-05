"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
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

/* Phase 1.2 (A-1-2) v45 — CompareBlock 모던 일러스트 배경 + 시퀀스 재구성 + NumberFlow 수직 + 라벨 ↑.
 * 정정 (Plan v45):
 * 1. Blueprint Grid + 잔존 곡선 영구 폐기 (section background-image / dotted curve SVG 광역 0)
 * 2. 모던 일러스트 배경 (compare-bg-a-cityscape.png / Next/Image fill / opacity 0.18)
 * 3. NumberFlow 수직 회전 정합 (좌 trend={1} / 우 trend={-1})
 * 4. "98% 단축" 좌·우 가운데 시각 연결 (grid 외 별도 row / v44 patch 보존)
 * 5. 시퀀스 재구성 (10 Step / 총 5.3초)
 *    Step 0 (-300ms): h2 (진입 즉시)
 *    Step 1 (0-300ms): 좌 라벨 fade
 *    Step 2 (300-1500ms): 좌 NumberFlow 0 → 255 (trend=1)
 *    Step 3 (1500-1800ms): ArrowRight fade + pulse
 *    Step 4 (1800-2100ms): 우 라벨 fade
 *    Step 5 (2100-3300ms): 우 NumberFlow 255 → 3 (trend=-1)
 *    Step 6 (3300-3800ms): "98% 단축" 배지 spring
 *    Step 7 (3800-4300ms): 보조 카피 fade + y 16 → 0 (Step 7 진입 의무 / 고정 노출 0)
 *    Step 8 (4300-4800ms): 5단계 카드 fade + 즉시 dim 0.3
 *    Step 9 (4800-5300ms): stamp
 * 6. 좌·우 라벨 시인성 ↑ (모바일 18 / 데스크탑 24 / font-bold 700)
 * 7. useInView once: true / amount 0.3 (재발화 0) */

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

// Step 1 — 좌 라벨 fade (0-300ms)
const leftLabelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

// Step 2 — 좌 NumberFlow span fade (300-1500ms)
const leftNumberVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
};

// Step 3 — ArrowRight fade + pulse (1500-1800ms)
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

// Step 5 — 우 NumberFlow span fade (2100-3300ms)
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

// Step 7 — 보조 카피 fade + y 16 → 0 (3800-4300ms / 단축 배지 후 발화)
const subCopyVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 3.8 } },
};

// Step 8 — 5 카드 fade + 즉시 dim 0.3 (4300-4800ms)
const barVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.3, transition: { duration: 0.5, delay: 4.3 } },
};

// Step 9 — stamp (4800-5300ms)
const stampVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay: 4.8 },
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
      // Step 2 — 300ms 후 좌 카운트 0 → 255
      const t1 = setTimeout(() => {
        setLeftAnimated(true);
        setLeftValue(255);
      }, 300);
      // Step 5 — 2100ms 후 우 카운트 255 → 3
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
      className="relative flex min-h-[calc(100vh-64px)] flex-col justify-center overflow-hidden bg-white py-12 lg:min-h-[calc(100vh-80px)] lg:py-16"
    >
      {/* 모던 일러스트 배경 (compare-bg-a-cityscape.png / opacity 0.18) */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/illustrations/compare-bg-a-cityscape.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ opacity: 0.18 }}
        />
      </div>

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
          {/* Step 1 + 2 — 좌측 라벨 + 좌 NumberFlow 0 → 255 (trend=1) */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              variants={leftLabelVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mb-2 text-[18px] font-bold tracking-tight text-gray-500 lg:mb-4 lg:text-[24px]"
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

          {/* Step 3 — 가운데 ArrowRight + 미세 pulse */}
          <div className="flex flex-col items-center justify-center gap-3 lg:gap-4">
            <motion.div
              variants={arrowVariants}
              animate={isInView ? ["visible", "pulse"] : "hidden"}
              className="flex justify-center"
            >
              <ArrowRight size={48} strokeWidth={2} className="text-gray-400 lg:hidden" />
              <ArrowRight size={64} strokeWidth={2} className="hidden text-gray-400 lg:block" />
            </motion.div>
          </div>

          {/* Step 4 + 5 — 우측 라벨 + 우 NumberFlow 255 → 3 (trend=-1) */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              variants={rightLabelVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mb-2 text-[18px] font-bold tracking-tight text-[var(--brand-green)] lg:mb-4 lg:text-[24px]"
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

        {/* Step 6 — "98% 단축" 배지 (grid 외 별도 row / 좌·우 가운데 시각 연결) */}
        <motion.div
          variants={badgeVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-8 flex justify-center lg:mb-12"
        >
          <div
            className="whitespace-nowrap rounded-full bg-[#ECFDF5] px-3 py-1 text-[24px] font-extrabold text-[var(--brand-green)] lg:px-4 lg:py-1.5 lg:text-[36px]"
            style={{ fontWeight: 800 }}
          >
            98% 단축
          </div>
        </motion.div>

        {/* Step 7 — 보조 카피 (단축 배지 후 발화 / 고정 노출 0) */}
        <motion.div
          variants={subCopyVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12 text-center text-[28px] font-bold leading-[1.3] tracking-[-0.015em] text-gray-900 lg:mb-16 lg:text-[48px]"
          style={{ fontWeight: 700 }}
        >
          발품도 시간도, 단 한 번에.
        </motion.div>

        {/* Step 8 + 9 — 5 카드 + stamp 오버레이 */}
        <div className="relative mx-auto max-w-4xl">
          {/* Step 9 stamp (charcoal bg + green text) */}
          <motion.div
            variants={stampVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111418] px-4 py-2 text-[14px] font-bold text-[var(--brand-green)] lg:-top-5 lg:px-6 lg:py-2.5 lg:text-[18px]"
            style={{ fontWeight: 700 }}
          >
            이 모든 단계, 경매퀵이 대신합니다
          </motion.div>

          {/* Step 8 — 5 카드 grid (X 취소선 0 / dim only) */}
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
