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

/* Phase 1.2 (A-1-2) v47 — CompareBlock 시퀀스 분리 + stamp 스크롤 트리거 + 일러스트 위치 정합.
 * 정정 (Plan v47):
 * 1. 모바일 비율 정합 ("255"/"3" 70 → 64 / "분" 16 → 14 / ArrowRight 48 → 32)
 * 2. 시퀀스 1 = 8 Step (Compare useInView / once amount 0.3)
 * 3. 시퀀스 2 = stamp 자체 useInView (별도 ref / once amount 0.5)
 * 4. stamp 크기 ↑ (모바일 14 → 18 / 데스크탑 18 → 30 / padding 정정)
 * 5. 일러스트 위치 = 보조 카피 영역 후면 (-inset-y-8 lg:-inset-y-12 / 5단계 + 좌우 라벨 침범 0)
 * 6. "98% 단축" Step 6 진입 (delay 3.3 / ArrowRight 동시 발화 폐기 / 좌·우 정착 후)
 * 7. 보조 카피 Step 7 진입 (delay 3.8 / 단축 후)
 * 8. 5단계 PPT Appear Step 8 진입 (delay 4.4 / staggerChildren 0.1 / 정상 색 가독성)
 * 9. 5단계 dim = 시퀀스 2 trigger 시 발화 (시퀀스 1 진입 시 정상 색)
 *
 * 시퀀스 1 (Compare useInView / 총 5초 8 Step):
 *   Step 0: h2 (진입 즉시)
 *   Step 1 (0-300ms): 좌 라벨
 *   Step 2 (300-1500ms): 좌 NumberFlow 1 → 255
 *   Step 3 (1500-1800ms): ArrowRight + pulse
 *   Step 4 (1800-2100ms): 우 라벨
 *   Step 5 (2100-3300ms): 우 NumberFlow 255 → 3
 *   Step 6 (3300-3800ms): "98% 단축" 배지 entrance
 *   Step 7 (3800-4400ms): 보조 카피 확대 entrance
 *   Step 8 (4400-5000ms): 5단계 PPT Appear stagger (정상 색)
 *
 * 시퀀스 2 (stamp 스크롤 trigger / amount 0.5):
 *   stamp scale entrance + 5단계 dim 동시 (color 변경 0) */

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

// Step 0 — h2
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

// Step 3 — ArrowRight fade + pulse (1500-1800ms)
const arrowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 1.5 } },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.4, delay: 1.6, ease: "easeInOut" },
  },
};

// Step 4 — 우 라벨 (1800-2100ms)
const rightLabelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 1.8 } },
};

// Step 5 — 우 NumberFlow span fade (2100-3300ms)
const rightNumberVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 2.1 } },
};

// Step 6 — "98% 단축" 배지 spring (3300-3800ms / 좌·우 정착 후)
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

// Step 7 — 보조 카피 확대 entrance (3800-4400ms)
const subCopyVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 3.8,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

// Step 8 — 5 카드 PPT Appear stagger entrance (4400-5000ms)
const barContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 4.4,
    },
  },
};

// 5 카드 entrance + dim (시퀀스 2 trigger 시 발화 / color 변경 0)
const barVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  dim: { opacity: 0.3, transition: { duration: 0.5, ease: "easeInOut" } },
};

// 시퀀스 2 — stamp scale entrance (스크롤 trigger)
const stampVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export function CompareBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const stampInView = useInView(stampRef, { once: true, amount: 0.5 });
  const [leftValue, setLeftValue] = useState(1);
  const [rightValue, setRightValue] = useState(255);
  const [leftAnimated, setLeftAnimated] = useState(false);
  const [rightAnimated, setRightAnimated] = useState(false);

  useEffect(() => {
    if (isInView) {
      const t1 = setTimeout(() => {
        setLeftAnimated(true);
        setLeftValue(255);
      }, 300);
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

        {/* 숫자 비교 + 보조 카피 영역 (일러스트 배경 wrapping) */}
        <div className="relative">
          {/* 일러스트 배경 (보조 카피 영역 광역 후면 / 5단계 + 좌우 라벨 침범 0) */}
          <div
            className="pointer-events-none absolute inset-x-0 -inset-y-8 -z-10 lg:-inset-y-12"
            aria-hidden="true"
          >
            <Image
              src="/illustrations/compare-bg-a-cityscape.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{ opacity: 0.12 }}
            />
          </div>

          {/* 숫자 비교 grid — grid-cols-[1fr_auto_1fr] / 모바일 비율 정합 */}
          <div className="mb-12 grid grid-cols-[1fr_auto_1fr] items-center gap-2 lg:mb-16 lg:gap-8">
            {/* Step 1 + 2 — 좌측 라벨 + 좌 NumberFlow 1 → 255 */}
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

            {/* Step 3 + 6 — 가운데: ArrowRight + "98% 단축" 배지 (Step 6 별도 발화 / Step 3 ArrowRight 단독) */}
            <div className="flex flex-col items-center justify-center gap-2 lg:gap-3">
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="whitespace-nowrap rounded-full bg-[#ECFDF5] px-3 py-1 text-[20px] font-extrabold text-[var(--brand-green)] lg:px-4 lg:py-1.5 lg:text-[36px]"
                style={{ fontWeight: 800 }}
              >
                98% 단축
              </motion.div>
              <motion.div
                variants={arrowVariants}
                animate={isInView ? ["visible", "pulse"] : "hidden"}
                className="flex justify-center"
              >
                <ArrowRight size={32} strokeWidth={2} className="text-gray-400 lg:hidden" />
                <ArrowRight size={64} strokeWidth={2} className="hidden text-gray-400 lg:block" />
              </motion.div>
            </div>

            {/* Step 4 + 5 — 우측 라벨 + 우 NumberFlow 255 → 3 */}
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

          {/* Step 7 — 보조 카피 확대 entrance */}
          <motion.div
            variants={subCopyVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mb-12 text-center text-[28px] font-bold leading-[1.3] tracking-[-0.015em] text-gray-900 lg:mb-16 lg:text-[48px]"
            style={{ fontWeight: 700 }}
          >
            발품도 시간도, 단 한 번에.
          </motion.div>
        </div>

        {/* Step 8 + 시퀀스 2 — 5 카드 + stamp (별도 useInView trigger) */}
        <div className="relative mx-auto max-w-4xl">
          {/* 시퀀스 2 stamp — 자체 useInView trigger / 5단계 가운데 absolute */}
          <motion.div
            ref={stampRef}
            variants={stampVariants}
            initial="hidden"
            animate={stampInView ? "visible" : "hidden"}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#111418] px-5 py-2.5 text-[18px] font-bold text-[var(--brand-green)] lg:px-8 lg:py-3.5 lg:text-[30px]"
            style={{ fontWeight: 700 }}
          >
            이 모든 단계, 경매퀵이 대신합니다
          </motion.div>

          {/* Step 8 — 5 카드 PPT Appear stagger (정상 색) + 시퀀스 2 dim (stamp 등장 시점) */}
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
                animate={
                  isInView
                    ? stampInView
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
      </div>
    </section>
  );
}
