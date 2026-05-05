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

/* Phase 1.2 (A-1-2) v49 — CompareBlock 시퀀스 순서 정합 + 비슷한 속도 + 보조 카피 크기 ↑ + 일러스트 production.
 * 정정 (Plan v49):
 * 1. 시퀀스 순서 정합 (형준님 캡처 정합 / setTimeout chain / 1→2→3→4→5→6→7)
 *    Step 1 (0ms):    좌 라벨 + 좌 NumberFlow 1 → 255
 *    Step 2 (600ms):  ArrowRight + pulse
 *    Step 3 (1200ms): 우 라벨 + 우 NumberFlow 255 → 3
 *    Step 4 (1800ms): "98% 단축" 배지
 *    Step 5 (2400ms): 5단계 PPT Appear stagger
 *    Step 6 (3000ms): stamp + 5단계 dim 동시
 *    Step 7 (3600ms): 보조 카피 (마지막 / layout 위치 = 5단계 + stamp 후)
 * 2. 비슷한 속도 밸런스 (각 순번 간 600ms / Compare section useInView trigger)
 * 3. 모바일 좌우 여백 정합 (px-5 / container-app 광역)
 * 4. 보조 카피 크기 ↑ (모바일 28 / 데스크탑 44)
 * 5. 배경 일러스트 production 노출 (compare-bg-v49-a-refined-cityscape.png / 16:5 ULTRA WIDE)
 *
 * 보존 (v48):
 * - 모바일 우 라벨 한 줄 (whitespace-nowrap / 폰트 16)
 * - stamp "경매퀵" yellow accent (span 분리)
 * - 모바일 비율 ("255"/"3" 64 / ArrowRight 32 / 배지 20) */

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

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const labelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const numberVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const arrowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.4, delay: 0.1, ease: "easeInOut" },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
};

const subCopyVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

const barContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const barVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  dim: { opacity: 0.3, transition: { duration: 0.5, ease: "easeInOut" } },
};

const stampVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export function CompareBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!sectionInView) return;
    let cancelled = false;
    const advance = (n: number, delay: number) => {
      setTimeout(() => {
        if (!cancelled) setStep(n);
      }, delay);
    };
    advance(1, 0);
    advance(2, 600);
    advance(3, 1200);
    advance(4, 1800);
    advance(5, 2400);
    advance(6, 3000);
    advance(7, 3600);
    return () => {
      cancelled = true;
    };
  }, [sectionInView]);

  // NumberFlow derived state (cascading render 회피)
  const leftValue = step >= 1 ? 255 : 1;
  const rightValue = step >= 3 ? 3 : 255;
  const leftAnimated = step >= 1;
  const rightAnimated = step >= 3;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="compare-heading"
      className="relative flex min-h-[calc(100vh-64px)] flex-col justify-center overflow-hidden bg-white py-12 lg:min-h-[calc(100vh-80px)] lg:py-16"
    >
      <div className="container-app w-full">
        {/* h2 (sectionInView trigger / step 진입 전 visible) */}
        <motion.h2
          id="compare-heading"
          variants={fadeVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="mb-12 text-center text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-16 lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          법원 가는 3시간,
          <br />
          물건 보는 <span className="text-[var(--brand-green)]">시간으로</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        {/* 일러스트 + 숫자 grid 광역 wrapper */}
        <div className="relative mb-12 lg:mb-16">
          {/* 일러스트 배경 (compare-bg-v49-a-refined-cityscape.png / opacity 0.12) */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden="true"
          >
            <Image
              src="/illustrations/compare-bg-v49-a-refined-cityscape.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{ opacity: 0.12 }}
            />
          </div>

          {/* 숫자 비교 grid */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 lg:gap-8">
            {/* Step 1 — 좌측 라벨 + 좌 NumberFlow 1 → 255 */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                variants={labelVariants}
                initial="hidden"
                animate={step >= 1 ? "visible" : "hidden"}
                className="mb-2 whitespace-nowrap text-[16px] font-semibold tracking-tight text-gray-500 lg:mb-4 lg:text-[24px]"
              >
                일반적인 방법
              </motion.div>
              <motion.div
                variants={numberVariants}
                initial="hidden"
                animate={step >= 1 ? "visible" : "hidden"}
                className="flex items-baseline justify-center gap-1"
              >
                <span
                  className="text-[64px] font-extrabold leading-none text-gray-400 lg:text-[200px]"
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
                <span className="text-[14px] font-bold text-gray-400 lg:text-[40px]">분</span>
              </motion.div>
            </div>

            {/* Step 2 + 4 — 가운데 ArrowRight + "98% 단축" 배지 */}
            <div className="flex flex-col items-center justify-center gap-2 lg:gap-3">
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate={step >= 4 ? "visible" : "hidden"}
                className="whitespace-nowrap rounded-full bg-[#ECFDF5] px-3 py-1 text-[20px] font-extrabold text-[var(--brand-green)] lg:px-4 lg:py-1.5 lg:text-[36px]"
                style={{ fontWeight: 800 }}
              >
                98% 단축
              </motion.div>
              <motion.div
                variants={arrowVariants}
                initial="hidden"
                animate={step >= 2 ? ["visible", "pulse"] : "hidden"}
                className="flex justify-center"
              >
                <ArrowRight size={32} strokeWidth={2} className="text-gray-400 lg:hidden" />
                <ArrowRight size={64} strokeWidth={2} className="hidden text-gray-400 lg:block" />
              </motion.div>
            </div>

            {/* Step 3 — 우측 라벨 + 우 NumberFlow 255 → 3 */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                variants={labelVariants}
                initial="hidden"
                animate={step >= 3 ? "visible" : "hidden"}
                className="mb-2 whitespace-nowrap text-[16px] font-semibold tracking-tight text-[var(--brand-green)] lg:mb-4 lg:text-[24px]"
              >
                경매퀵을 이용하면
              </motion.div>
              <motion.div
                variants={numberVariants}
                initial="hidden"
                animate={step >= 3 ? "visible" : "hidden"}
                className="flex items-baseline justify-center gap-1"
              >
                <span
                  className="text-[64px] font-extrabold leading-none text-[var(--brand-green)] lg:text-[200px]"
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
                <span className="text-[14px] font-bold text-[var(--brand-green)] lg:text-[40px]">분</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Step 5 + 6 — 5단계 + stamp 광역 */}
        <div className="relative mx-auto mb-12 max-w-4xl lg:mb-16">
          {/* Step 6 stamp — 5단계 가운데 absolute / "경매퀵" yellow accent */}
          <motion.div
            variants={stampVariants}
            initial="hidden"
            animate={step >= 6 ? "visible" : "hidden"}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#111418] px-5 py-2.5 text-[18px] font-bold text-[var(--brand-green)] lg:px-8 lg:py-3.5 lg:text-[30px]"
            style={{ fontWeight: 700 }}
          >
            이 모든 단계,{" "}
            <span style={{ color: "#FFD43B" }}>경매퀵</span>
            이 대신합니다
          </motion.div>

          {/* Step 5 — 5단계 PPT Appear stagger / Step 6 dim 동시 */}
          <motion.div
            className="grid grid-cols-5 gap-2 lg:gap-4"
            variants={barContainerVariants}
            initial="hidden"
            animate={step >= 5 ? "visible" : "hidden"}
          >
            {BAR_DATA.map(({ Icon, labelMobile, labelDesktop, minutes }) => (
              <motion.div
                key={labelDesktop}
                variants={barVariants}
                animate={
                  step >= 5
                    ? step >= 6
                      ? ["visible", "dim"]
                      : "visible"
                    : "hidden"
                }
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

        {/* Step 7 — 보조 카피 (마지막 / 모바일 28 / 데스크탑 44 / weight 700) */}
        <motion.div
          variants={subCopyVariants}
          initial="hidden"
          animate={step >= 7 ? "visible" : "hidden"}
          className="text-center text-[28px] font-bold leading-[1.3] tracking-[-0.015em] text-gray-900 lg:text-[44px]"
          style={{ fontWeight: 700 }}
        >
          발품도 시간도, 단 한 번에.
        </motion.div>
      </div>
    </section>
  );
}
