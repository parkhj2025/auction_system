"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
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
} from "lucide-react";

/* Phase 1.2 (A-1-2) v50 cycle 2 — CompareBlock 여백 단축 + timeline 정정 + 일러스트 visible.
 * 정정 (Plan v50 cycle 2 / 1차 NG 3건 fix):
 * 1. NG 1 여백 단축
 *    - section: flex flex-col justify-center 제거 (콘텐츠 vertical 중앙 정렬 자동 빈공간 NG)
 *    - section: py-12 lg:py-16 → py-10 lg:py-14
 *    - section: min-h 유지 (scroll-linked 시퀀스 거리 보장 / 옵션 B 채택)
 *    - h2 mb: mb-12 lg:mb-16 → mb-8 lg:mb-12
 *    - numbers wrapper mb: mb-12 lg:mb-16 → mb-8 lg:mb-12
 *    - bars wrapper mb: mb-12 lg:mb-16 → mb-0 (마지막 콘텐츠)
 *
 * 2. NG 2 timeline 정정 (8.25초 / step 4 → step 5 즉시 / step 5 → step 6 1500ms)
 *    Step 1 (progress 0.250): 좌 라벨 + 좌 NumberFlow 1 → 255
 *    Step 2 (progress 0.347): ArrowRight + pulse
 *    Step 3 (progress 0.395): 우 라벨 + 우 NumberFlow 255 → 3
 *    Step 4 (progress 0.492): "98% 단축" 배지
 *    Step 5 (progress 0.517): 5단계 PPT Appear stagger (98% 단축 직후 즉시)
 *    Step 6 (progress 0.625): stamp + 5단계 dim 동시 (5단계 1500ms 충분 visible 후)
 *    threshold 산식: 0.25 + (start_ms / 8250) × 0.40
 *    progress range: [0.25, 0.75] → [0.25, 0.65] (사용자 화면 중간 도달 시 시퀀스 종료)
 *    barContainerVariants staggerChildren: 0.1 → 0.15 (5단계 인지 시간 ↑)
 *
 * 3. NG 3 일러스트 production 시각 노출
 *    - section className에 isolate 추가 (Tailwind isolation: isolate / stacking context root 형성)
 *    - 진단: 이전 -z-10이 section bg-white 뒤로 propagate → invisible NG
 *    - isolate 후: section 안 stacking root → -z-10 일러스트가 bg-white 위 / 콘텐츠 뒤 visible 보장
 *    - opacity 0.18 → 0.25 (visibility 마진 / NG 시 0.30 cycle)
 *
 * 보존:
 * - h2 진입 = useInView 별도 보존 (sectionInView amount 0.3)
 * - motion variants 7건 정의 (staggerChildren만 0.15 정정 / 그 외 변환 0)
 * - NumberFlow leftValue/rightValue 로직 + 내장 spin (transformTiming/spinTiming 1200ms)
 * - useScroll offset ["start end", "end start"] / useSpring 80/25/0.5/0.001
 * - 단방향 advance Math.max guard / 카피 v4 SoT v39 + 절대 크기 광역 */

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
    <section
      ref={sectionRef}
      aria-labelledby="compare-heading"
      className="relative isolate min-h-[calc(100vh-64px)] overflow-hidden bg-white py-10 lg:min-h-[calc(100vh-80px)] lg:py-14"
    >
      <div className="container-app w-full">
        {/* h2 (sectionInView trigger / step 진입 전 visible) */}
        <motion.h2
          id="compare-heading"
          variants={fadeVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="mb-8 text-center text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-12 lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          법원 가는 3시간,
          <br />
          물건 보는 <span className="text-[var(--brand-green)]">시간으로</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        {/* 일러스트 + 숫자 grid 광역 wrapper */}
        <div className="relative mb-8 lg:mb-12">
          {/* 일러스트 배경 (compare-bg-v49-a-refined-cityscape.png / opacity 0.25 / section isolate stacking 정합) */}
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
              style={{ opacity: 0.25 }}
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
