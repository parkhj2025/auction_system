"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type Variants,
} from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  Car,
  FileText,
  Banknote,
  Building2,
  Clock,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

/* Phase 1.2 (A-1-2) v50 cycle 4 — CompareBlock 일러스트 폐기 + 모바일 numbers 세로 + NumberFlow 96.
 * 정정 (Plan v50 cycle 4 / cycle 3 production NG 광역 회복 / cycle 4 5건 GO + 추가 질의 5건 GO):
 * 1. 일러스트 광역 폐기 (스크롤 시스템 꼬임 회피 + 정수 폐기)
 *    - import Image from "next/image" 폐기 (사용 0)
 *    - 일러스트 wrapper div + Image element 폐기 (15 lines)
 *    - src `/illustrations/compare-bg-v49-...` 참조 폐기 (파일 자체 보존)
 *    - opacity 0.40 style 폐기
 *    - section className isolate 폐기 (일러스트 폐기 후 의미 0)
 *    - z-30 sticky 보존 (TopNav 정합)
 *
 * 2. section py 단축 + flex justify-center 보존 (cycle 3 정합)
 *    - py-10 lg:py-14 → py-6 lg:py-12 (40/56 → 24/48 / 모바일 16px ↓)
 *    - flex flex-col justify-center 보존 = 콘텐츠 viewport 중앙 lock + 위/아래 균등 분산
 *
 * 3. 모바일 numbers 세로 재배치 (255 ↓ → ↓ 3) + 데스크탑 가로 보존
 *    - 현 grid grid-cols-[1fr_auto_1fr] → flex flex-col items-center gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8
 *    - 모바일 = flex flex-col gap-4 (세로) / 데스크탑 = lg:grid (가로 보존)
 *
 * 4. ArrowDown 신규 import + 모바일 / 데스크탑 분기
 *    - lucide-react ArrowDown 신규 import (신규 npm 0)
 *    - <ArrowDown size={32} className="lg:hidden" /> + <ArrowRight size={64} className="hidden lg:block" />
 *
 * 5. 모바일 NumberFlow 비율 정정 (광역 1:2.08 정합)
 *    - 모바일 64 → 96 (좌 + 우) / 데스크탑 200 보존
 *    - 비율 = 1:2.08 (h2 광역 1:2 + TrustCTA "0" 1:1.75 사이 정합)
 *    - h2 44 vs NumberFlow 96 = 1:2.18 (데스크탑 88 vs 200 = 1:2.27 거의 정합)
 *
 * 6. 모바일 "분" 단위 비율 정정
 *    - 모바일 14 → 18 (좌 + 우) / 데스크탑 40 보존
 *    - 비율 = 1:2.22 (NumberFlow 1:2.08 정합)
 *
 * 보존:
 * - sticky 구조 (wrapperRef min-h-[200vh] + section sticky top-14 lg:top-16 z-30)
 * - section min-h calc(100vh-56px) lg:calc(100vh-64px) (TopNav 실측 정합)
 * - h2 mb-16 lg:mb-24 + numbers wrapper mb-16 lg:mb-24 + bars wrapper mb-0
 * - useScroll target=wrapperRef offset=["start start", "end end"] / useSpring 80/25/0.5/0.001
 * - progress range [0.25, 0.65] / threshold 6건 (0.250 / 0.347 / 0.395 / 0.492 / 0.517 / 0.625)
 * - staggerChildren 0.15 / 단방향 advance Math.max guard
 * - h2 진입 = useInView 별도 보존
 * - motion variants 7건 정의 / NumberFlow leftValue/rightValue 로직 + 내장 spin
 * - 데스크탑 절대 크기 (NumberFlow 200 / "분" 40 / ArrowRight 64) 광역 보존
 * - 카피 v4 SoT v39 (h2 + stamp 광역) */

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

const barContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // h2 전용 진입 (scroll-linked 시퀀스와 별개 시스템)
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [step, setStep] = useState(0);

  // scroll-linked 시퀀스 진입 (motion v12 useScroll → useSpring smoothing → useTransform 임계값 → useMotionValueEvent)
  // cycle 3: target = wrapperRef (sticky parent) / offset = ["start start", "end end"]
  // sticky lock 동안 wrapper의 100vh가 scroll → progress 0 → 1 자연 진입
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.5,
    restDelta: 0.001,
  });
  // progress range [0.25, 0.65] → 6 step 임계값 (산식: 0.25 + (start_ms / 8250) × 0.40)
  // cycle 2: step 4 → step 5 텀 0 (98% 단축 직후 즉시 5단계) / step 5 → step 6 텀 1500ms (5단계 충분 visible)
  const stepValue = useTransform(smoothProgress, (p) => {
    if (p >= 0.625) return 6;
    if (p >= 0.517) return 5;
    if (p >= 0.492) return 4;
    if (p >= 0.395) return 3;
    if (p >= 0.347) return 2;
    if (p >= 0.25) return 1;
    return 0;
  });
  // 단방향 advance (역행 시 step 회귀 0)
  useMotionValueEvent(stepValue, "change", (v) => {
    setStep((prev) => Math.max(prev, v));
  });
  // 초기 sync (페이지 reload mid-scroll 대비)
  useEffect(() => {
    setStep((prev) => Math.max(prev, stepValue.get()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // NumberFlow derived state (cascading render 회피)
  const leftValue = step >= 1 ? 255 : 1;
  const rightValue = step >= 3 ? 3 : 255;
  const leftAnimated = step >= 1;
  const rightAnimated = step >= 3;

  return (
    <div ref={wrapperRef} className="relative min-h-[200vh]">
      <section
        ref={sectionRef}
        aria-labelledby="compare-heading"
        className="sticky top-14 z-30 flex min-h-[calc(100vh-56px)] flex-col justify-center overflow-hidden bg-white py-6 lg:top-16 lg:min-h-[calc(100vh-64px)] lg:py-12"
      >
        <div className="container-app w-full">
          {/* h2 (sectionInView trigger / step 진입 전 visible) */}
          <motion.h2
            id="compare-heading"
            variants={fadeVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            className="mb-16 text-center text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-24 lg:text-[88px]"
            style={{ fontWeight: 800 }}
          >
            법원 가는 3시간,
            <br />
            물건 보는 <span className="text-[var(--brand-green)]">시간으로</span>
            <span style={{ color: "#FFD43B" }}>.</span>
          </motion.h2>

          {/* 숫자 grid wrapper (3단 분리 / cycle 4: 모바일 세로 / 데스크탑 가로 분기) */}
          <div className="relative mb-16 lg:mb-24">
            {/* 숫자 비교 — 모바일 flex flex-col 세로 / 데스크탑 lg:grid 가로 */}
            <div className="flex flex-col items-center gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
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
                  className="text-[96px] font-extrabold leading-none text-gray-400 lg:text-[200px]"
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
                <span className="text-[18px] font-bold text-gray-400 lg:text-[40px]">분</span>
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
                <ArrowDown size={32} strokeWidth={2} className="text-gray-400 lg:hidden" />
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
                  className="text-[96px] font-extrabold leading-none text-[var(--brand-green)] lg:text-[200px]"
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
                <span className="text-[18px] font-bold text-[var(--brand-green)] lg:text-[40px]">분</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Step 5 + 6 — 5단계 + stamp 광역 */}
        <div className="relative mx-auto max-w-4xl">
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
        </div>
      </section>
    </div>
  );
}
