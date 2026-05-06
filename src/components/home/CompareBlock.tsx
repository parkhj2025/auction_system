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

/* Phase 1.2 (A-1-2) v50 cycle 5 — CompareBlock 비-sticky 회귀 + 시퀀스 자연 cascade 회복.
 * 정정 (Plan v50 cycle 5 / cycle 4 production NG 회복 / Q1-Q6 광역 통합):
 * 1. sticky paradigm 폐기 + 비-sticky 회귀 (형준님 "스크롤 턱 걸림" 회피)
 *    - wrapperRef declaration + wrapper div 광역 폐기
 *    - section className sticky / top-14 / lg:top-16 / z-30 광역 폐기
 *    - useScroll target = wrapperRef → sectionRef
 *    - useScroll offset = ["start start", "end end"] → ["start end", "end start"]
 *    - 자연 scroll + scroll-linked 시퀀스 fire / 콘텐츠 viewport 통과 시 fire
 *
 * 2. progress range / threshold 정정 (step 5 30% 빨리 fire)
 *    - range = [0.25, 0.65] → [0.15, 0.55]
 *    - 산식 = 0.15 + (start_ms / 8250) × 0.40
 *    - threshold 6건 = 0.150 / 0.247 / 0.295 / 0.392 / 0.417 / 0.526
 *    - step 5 0.517 → 0.417 (형준님 "단계별 너무 늦지 않게" 정합)
 *
 * 3. numbers wrapper 모바일 mb 단축 (형준님 "3분과 단계 표시 사이 여백 좁힘 / 하단 여백 ↑")
 *    - mb-16 lg:mb-24 → mb-10 lg:mb-32
 *    - 모바일 64 → 40 (-24 / 좁힘) + flex justify-center 위/아래 균등 분산 효과로 하단 ↑
 *
 * 4. 데스크탑 vertical 분산 "살짝" (형준님 "여백 살짝 늘리는 / 세련된 방식")
 *    - section py: lg:py-12 → lg:py-16 (48 → 64)
 *    - h2 wrapper mb: lg:mb-24 → lg:mb-32 (96 → 128)
 *    - numbers wrapper mb: lg:mb-24 → lg:mb-32 (96 → 128)
 *    - bars wrapper mb-0 보존 (마지막 콘텐츠)
 *    - 콘텐츠 821 → 917 (sticky lock 1016 안 / flex justify-center 위/아래 균등 ~50)
 *
 * 보존:
 * - useSpring 80/25/0.5/0.001 (광역 검증된 값)
 * - timeline 8.25초 (variants duration / staggerChildren 0.15 광역 보존)
 * - section min-h calc(100vh-56px) lg:calc(100vh-64px) / flex flex-col justify-center
 * - 모바일 py-6 / h2 mb-16 / numbers mb-10 / bars mb-0
 * - 단방향 advance Math.max guard / 초기 sync useEffect
 * - h2 진입 = useInView 별도 보존
 * - motion variants 7건 정의 / NumberFlow leftValue/rightValue 로직
 * - 일러스트 광역 폐기 (cycle 4 정합)
 * - ArrowDown / ArrowRight 분기 (cycle 4 정합)
 * - 모바일 numbers 세로 / 데스크탑 가로 분기 (cycle 4 정합)
 * - NumberFlow 96/200 / "분" 18/40 / ArrowDown 32 / ArrowRight 64 / h2 44/88
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
  const sectionRef = useRef<HTMLElement>(null);
  // h2 전용 진입 (scroll-linked 시퀀스와 별개 시스템)
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [step, setStep] = useState(0);

  // scroll-linked 시퀀스 진입 (motion v12 useScroll → useSpring smoothing → useTransform 임계값 → useMotionValueEvent)
  // cycle 5: sticky 폐기 + 비-sticky 회귀 / target = sectionRef / offset = ["start end", "end start"]
  // 자연 scroll 동안 section viewport 통과 시 progress 0 → 1 자연 fire (형준님 "스크롤 턱 걸림" NG 회피)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.5,
    restDelta: 0.001,
  });
  // progress range [0.15, 0.55] → 6 step 임계값 (산식: 0.15 + (start_ms / 8250) × 0.40)
  // cycle 5: step 5 threshold 0.517 → 0.417 (30% 빨리 fire / 형준님 "단계별 너무 늦지 않게" 정합)
  const stepValue = useTransform(smoothProgress, (p) => {
    if (p >= 0.526) return 6;
    if (p >= 0.417) return 5;
    if (p >= 0.392) return 4;
    if (p >= 0.295) return 3;
    if (p >= 0.247) return 2;
    if (p >= 0.15) return 1;
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
    <section
      ref={sectionRef}
      aria-labelledby="compare-heading"
      className="relative flex min-h-[calc(100vh-56px)] flex-col justify-center overflow-hidden bg-white py-16 lg:min-h-[calc(100vh-64px)] lg:py-16"
    >
        <div className="container-app w-full">
          {/* h2 (sectionInView trigger / step 진입 전 visible) */}
          <motion.h2
            id="compare-heading"
            variants={fadeVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            className="mb-16 text-center text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-32 lg:text-[88px]"
            style={{ fontWeight: 800 }}
          >
            법원 가는 3시간,
            <br />
            물건 보는 <span className="text-[var(--brand-green)]">시간으로</span>
            <span style={{ color: "#FFD43B" }}>.</span>
          </motion.h2>

          {/* 숫자 grid wrapper (3단 분리 / cycle 5: 모바일 mb-10 단축 + 데스크탑 lg:mb-32 분산) */}
          <div className="relative mb-10 lg:mb-32">
            {/* 숫자 비교 — 모바일 flex flex-col 세로 / 데스크탑 lg:grid 가로 */}
            <div className="flex flex-col items-center gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
            {/* Step 1 — 좌측 라벨 + 좌 NumberFlow 1 → 255 */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                variants={labelVariants}
                initial="hidden"
                animate={step >= 1 ? "visible" : "hidden"}
                className="mb-0 whitespace-nowrap text-[16px] font-semibold tracking-tight text-gray-500 lg:mb-4 lg:text-[24px]"
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
                className="mb-0 whitespace-nowrap text-[16px] font-semibold tracking-tight text-[var(--brand-green)] lg:mb-4 lg:text-[24px]"
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
  );
}
