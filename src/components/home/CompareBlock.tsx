"use client";

import { useId, useRef, useState, useEffect } from "react";
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
import { Car, FileText, Banknote, Building2, Clock } from "lucide-react";

/* Phase 1.2 (A-1-2) v50 cycle 5 — CompareBlock 비-sticky + 시퀀스 자연 cascade.
 * Stage 1 cycle 3 cycle 4 정정 7건:
 * 1. 박스 paradigm: bg-gray-100 → border-gray-200 only (답답 ↓ / bg 0)
 * 2. 라벨 size 14/16 + weight 500 + mb-8 lg:mb-12 (라벨 ↔ 숫자 균등 정합)
 * 3. 우측 라벨 색 #00C853 보존 (var(--brand-green) 정합)
 * 4. 화살표 chunky SVG + green gradient + 좌우 흔들 motion infinite
 * 5. batch red strong (#EF4444) + pulse infinite + "단축" → "절약"
 * 6. 카피 "단축" → "절약" (Compare 영역 한정)
 * 7. 모바일 순서: 좌·우 NumberFlow 사이 화살표 / 마지막 batch (CSS order paradigm) */

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

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
};

const barContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
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

/* ArrowChunky — 신규 paradigm (chunky filled polygon + green gradient + useId namespace) */
function ArrowChunky({ size, rotate }: { size: number; rotate?: boolean }) {
  const gradientId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={rotate ? { transform: "rotate(90deg)" } : undefined}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00E676" />
          <stop offset="100%" stopColor="#00A04A" />
        </linearGradient>
      </defs>
      <path
        d="M4 24 L36 24 L36 12 L60 32 L36 52 L36 40 L4 40 Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

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

        {/* 숫자 grid wrapper */}
        <div className="relative mb-10 lg:mb-32">
          {/* 박스 wrapper — border only (bg 0 / 답답 ↓) */}
          <div className="rounded-[28px] border border-gray-200 px-5 py-8 lg:rounded-[32px] lg:px-8 lg:py-12">
            {/* 숫자 비교 — 모바일 flex-col + CSS order / 데스크탑 lg:grid 3 col */}
            <div className="flex flex-col items-center gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
              {/* 좌측 (label + NumberFlow) — order-1 / lg:order-1 */}
              <div className="order-1 flex flex-col items-center text-center lg:order-1">
                <motion.div
                  variants={labelVariants}
                  initial="hidden"
                  animate={step >= 1 ? "visible" : "hidden"}
                  className="mb-8 whitespace-nowrap text-[14px] font-medium tracking-tight text-gray-500 lg:mb-12 lg:text-[16px]"
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

              {/* 데스크탑 가운데 wrapper (batch + arrow vertical stack) — hidden lg:flex / lg:order-2 */}
              <div className="hidden lg:order-2 lg:flex lg:flex-col lg:items-center lg:gap-3">
                {/* batch — entrance + infinite pulse (nested motion paradigm) */}
                <motion.div
                  variants={badgeVariants}
                  initial="hidden"
                  animate={step >= 4 ? "visible" : "hidden"}
                  className="whitespace-nowrap rounded-full bg-[#EF4444] px-[18px] py-[6px] text-white"
                >
                  <motion.span
                    animate={step >= 4 ? { scale: [1, 1.06, 1] } : {}}
                    transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block text-[18px] font-bold lg:text-[20px]"
                  >
                    98% 절약
                  </motion.span>
                </motion.div>

                {/* arrow — chunky SVG + 좌→우 흔들 infinite (lg only) */}
                <motion.div
                  animate={step >= 2 ? { x: [0, 6, 0] } : {}}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="flex justify-center"
                >
                  <ArrowChunky size={80} />
                </motion.div>
              </div>

              {/* 우측 (label + NumberFlow) — order-3 / lg:order-3 */}
              <div className="order-3 flex flex-col items-center text-center lg:order-3">
                <motion.div
                  variants={labelVariants}
                  initial="hidden"
                  animate={step >= 3 ? "visible" : "hidden"}
                  className="mb-8 whitespace-nowrap text-[14px] font-medium tracking-tight text-[var(--brand-green)] lg:mb-12 lg:text-[16px]"
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

              {/* 모바일 화살표 — order-2 / lg:hidden / 위→아래 흔들 infinite */}
              <motion.div
                animate={step >= 2 ? { y: [0, 6, 0] } : {}}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="order-2 flex justify-center lg:hidden"
              >
                <ArrowChunky size={56} rotate />
              </motion.div>

              {/* 모바일 batch — order-4 / lg:hidden / entrance + infinite pulse */}
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate={step >= 4 ? "visible" : "hidden"}
                className="order-4 whitespace-nowrap rounded-full bg-[#EF4444] px-[18px] py-[6px] text-white lg:hidden"
              >
                <motion.span
                  animate={step >= 4 ? { scale: [1, 1.06, 1] } : {}}
                  transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block text-[18px] font-bold"
                >
                  98% 절약
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Step 5 + 6 — 5단계 + stamp 광역 (박스 외부 / 변동 0) */}
        <div className="relative mx-auto max-w-4xl">
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
