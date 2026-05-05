"use client";

import { useRef } from "react";
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

/* Phase 1.2 (A-1-2) v48 — CompareBlock 스크롤 trigger + 모바일 라벨 한 줄 + stamp 경매퀵 yellow + 일러스트 신규.
 * 정정 (Plan v48):
 * 1. 각 요소별 useInView 분리 (Compare section 자체 useInView 폐기 / 자동 타이머 0)
 *    h2 / 좌 라벨 / 좌 숫자 / arrow / 우 라벨 / 우 숫자 / 배지 / 보조 카피 / 5단계 container / stamp 광역 분리 ref
 *    사용자 스크롤 시 각 요소 viewport 진입 발화 (한 개씩)
 * 2. 모바일 우 라벨 "경매퀵을 이용하면" 한 줄 (폰트 18 → 16 / whitespace-nowrap / 카피 변경 0)
 * 3. stamp "경매퀵" #FFD43B yellow accent (span 분리)
 * 4. 모바일 비율 v47 보존 ("255"/"3" 64 / ArrowRight 32 / 배지 20)
 * 5. v48 신규 일러스트 (compare-bg-v48-a-cityscape-wide.png / 16:5 ULTRA WIDE / 형준님 (a) 채택)
 * 6. 일러스트 위치 = 숫자 grid + 보조 카피 광역 wrapper / inset-0 / -z-10 / opacity 0.12
 * 7. 일러스트 production 노출 의무 (Next/Image fill / sizes 100vw / object-cover) */

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
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const numberVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const arrowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
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
  // 각 요소별 ref 광역 분리 (스크롤 trigger 의무 / 자동 타이머 0)
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const leftLabelRef = useRef<HTMLDivElement>(null);
  const leftNumberRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const rightLabelRef = useRef<HTMLDivElement>(null);
  const rightNumberRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subCopyRef = useRef<HTMLDivElement>(null);
  const barContainerRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  const h2InView = useInView(h2Ref, { once: true, amount: 0.5 });
  const leftLabelInView = useInView(leftLabelRef, { once: true, amount: 0.7 });
  const leftNumberInView = useInView(leftNumberRef, { once: true, amount: 0.7 });
  const arrowInView = useInView(arrowRef, { once: true, amount: 0.7 });
  const rightLabelInView = useInView(rightLabelRef, { once: true, amount: 0.7 });
  const rightNumberInView = useInView(rightNumberRef, { once: true, amount: 0.7 });
  const badgeInView = useInView(badgeRef, { once: true, amount: 0.7 });
  const subCopyInView = useInView(subCopyRef, { once: true, amount: 0.7 });
  const barContainerInView = useInView(barContainerRef, { once: true, amount: 0.5 });
  const stampInView = useInView(stampRef, { once: true, amount: 0.5 });

  // NumberFlow trigger = 좌·우 숫자 viewport 진입 시 (derived state / cascading render 회피)
  const leftValue = leftNumberInView ? 255 : 1;
  const rightValue = rightNumberInView ? 3 : 255;
  const leftAnimated = leftNumberInView;
  const rightAnimated = rightNumberInView;

  return (
    <section
      aria-labelledby="compare-heading"
      className="relative flex min-h-[calc(100vh-64px)] flex-col justify-center overflow-hidden bg-white py-12 lg:min-h-[calc(100vh-80px)] lg:py-16"
    >
      <div className="container-app w-full">
        {/* h2 (자체 ref + useInView) */}
        <motion.h2
          ref={h2Ref}
          id="compare-heading"
          variants={fadeVariants}
          initial="hidden"
          animate={h2InView ? "visible" : "hidden"}
          className="mb-12 text-center text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-16 lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          법원 가는 3시간,
          <br />
          물건 보는 <span className="text-[var(--brand-green)]">시간으로</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        {/* 일러스트 광역 wrapper (숫자 grid + 보조 카피 광역 후면) */}
        <div className="relative">
          {/* 일러스트 배경 (compare-bg-v48-a-cityscape-wide.png / opacity 0.12) */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden="true"
          >
            <Image
              src="/illustrations/compare-bg-v48-a-cityscape-wide.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{ opacity: 0.12 }}
            />
          </div>

          {/* 숫자 비교 grid */}
          <div className="mb-12 grid grid-cols-[1fr_auto_1fr] items-center gap-2 lg:mb-16 lg:gap-8">
            {/* 좌측 — 라벨 + NumberFlow 1 → 255 */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                ref={leftLabelRef}
                variants={labelVariants}
                initial="hidden"
                animate={leftLabelInView ? "visible" : "hidden"}
                className="mb-2 whitespace-nowrap text-[16px] font-semibold tracking-tight text-gray-500 lg:mb-4 lg:text-[24px]"
              >
                일반적인 방법
              </motion.div>
              <motion.div
                ref={leftNumberRef}
                variants={numberVariants}
                initial="hidden"
                animate={leftNumberInView ? "visible" : "hidden"}
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

            {/* 가운데 — "98% 단축" 배지 + ArrowRight (각 자체 ref) */}
            <div className="flex flex-col items-center justify-center gap-2 lg:gap-3">
              <motion.div
                ref={badgeRef}
                variants={badgeVariants}
                initial="hidden"
                animate={badgeInView ? "visible" : "hidden"}
                className="whitespace-nowrap rounded-full bg-[#ECFDF5] px-3 py-1 text-[20px] font-extrabold text-[var(--brand-green)] lg:px-4 lg:py-1.5 lg:text-[36px]"
                style={{ fontWeight: 800 }}
              >
                98% 단축
              </motion.div>
              <motion.div
                ref={arrowRef}
                variants={arrowVariants}
                initial="hidden"
                animate={arrowInView ? ["visible", "pulse"] : "hidden"}
                className="flex justify-center"
              >
                <ArrowRight size={32} strokeWidth={2} className="text-gray-400 lg:hidden" />
                <ArrowRight size={64} strokeWidth={2} className="hidden text-gray-400 lg:block" />
              </motion.div>
            </div>

            {/* 우측 — 라벨 + NumberFlow 255 → 3 (모바일 한 줄 정합) */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                ref={rightLabelRef}
                variants={labelVariants}
                initial="hidden"
                animate={rightLabelInView ? "visible" : "hidden"}
                className="mb-2 whitespace-nowrap text-[16px] font-semibold tracking-tight text-[var(--brand-green)] lg:mb-4 lg:text-[24px]"
              >
                경매퀵을 이용하면
              </motion.div>
              <motion.div
                ref={rightNumberRef}
                variants={numberVariants}
                initial="hidden"
                animate={rightNumberInView ? "visible" : "hidden"}
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

          {/* 보조 카피 (자체 ref + useInView) */}
          <motion.div
            ref={subCopyRef}
            variants={subCopyVariants}
            initial="hidden"
            animate={subCopyInView ? "visible" : "hidden"}
            className="mb-12 text-center text-[28px] font-bold leading-[1.3] tracking-[-0.015em] text-gray-900 lg:mb-16 lg:text-[48px]"
            style={{ fontWeight: 700 }}
          >
            발품도 시간도, 단 한 번에.
          </motion.div>
        </div>

        {/* 5 카드 + stamp (일러스트 영역 외) */}
        <div className="relative mx-auto max-w-4xl">
          {/* stamp (자체 ref + useInView / 5단계 가운데 absolute / "경매퀵" yellow accent) */}
          <motion.div
            ref={stampRef}
            variants={stampVariants}
            initial="hidden"
            animate={stampInView ? "visible" : "hidden"}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#111418] px-5 py-2.5 text-[18px] font-bold text-[var(--brand-green)] lg:px-8 lg:py-3.5 lg:text-[30px]"
            style={{ fontWeight: 700 }}
          >
            이 모든 단계,{" "}
            <span style={{ color: "#FFD43B" }}>경매퀵</span>
            이 대신합니다
          </motion.div>

          {/* 5 카드 PPT Appear stagger + dim (stamp 등장 시점 동시) */}
          <motion.div
            ref={barContainerRef}
            className="grid grid-cols-5 gap-2 lg:gap-4"
            variants={barContainerVariants}
            initial="hidden"
            animate={barContainerInView ? "visible" : "hidden"}
          >
            {BAR_DATA.map(({ Icon, labelMobile, labelDesktop, minutes }) => (
              <motion.div
                key={labelDesktop}
                variants={barVariants}
                animate={
                  barContainerInView
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
