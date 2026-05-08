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

/* Phase 1.2 (A-1-2) v50 cycle 5 — CompareBlock 비-sticky + 시퀀스 자연 cascade.
 * Stage 1 cycle 3 cycle 3 정정 추가:
 * - h2 강조 광역 확장 ("물건 보는 시간으로" green / 마침표 yellow / 1줄 charcoal)
 * - 박스 wrapper 신규 (bg-gray-100 / 28-32 radius / 5단계 + stamp 영역 시각 분리)
 *
 * 보존: useSpring 80/25/0.5/0.001 / threshold 6건 / NumberFlow / motion variants 7건 /
 *       ArrowDown·ArrowRight 분기 / 5단계 + stamp paradigm */

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
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [step, setStep] = useState(0);

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
  const stepValue = useTransform(smoothProgress, (p) => {
    if (p >= 0.526) return 6;
    if (p >= 0.417) return 5;
    if (p >= 0.392) return 4;
    if (p >= 0.295) return 3;
    if (p >= 0.247) return 2;
    if (p >= 0.15) return 1;
    return 0;
  });
  useMotionValueEvent(stepValue, "change", (v) => {
    setStep((prev) => Math.max(prev, v));
  });
  useEffect(() => {
    setStep((prev) => Math.max(prev, stepValue.get()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {/* h2 */}
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
          <span className="text-[var(--brand-green)]">물건 보는 시간으로</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        {/* 숫자 grid wrapper (mb 정수 보존 / 박스는 inner) */}
        <div className="relative mb-10 lg:mb-32">
          {/* 박스 wrapper (cycle 3 cycle 3) — bg-gray-100 모노톤 / 5단계 + stamp 영역 시각 분리 */}
          <div className="rounded-[28px] bg-gray-100 px-5 py-8 lg:rounded-[32px] lg:px-8 lg:py-12">
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
        </div>

        {/* Step 5 + 6 — 5단계 + stamp 광역 (박스 외부) */}
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
