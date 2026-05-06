"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import NumberFlow from "@number-flow/react";

/* Phase 1.2 (A-1-2) v17 — PricingBlock (시안 B + X / 막대 ascending + 카드 + horizontal timeline).
 * - h2 + sub + 막대 grid 3열 + 카드 grid 3열 + 타임라인 horizontal
 * - scroll-linked step 4단 (Compare cycle 5 학습 정합 / 80/25/0.5/0.001 spring / 0.150·0.295·0.392·0.526 threshold)
 * - step 1 → 막대 진입 + line fade / step 2~4 → dot + 가격 카운트업 stagger
 * - Diff 1: h2 텍스트 색 #111418 직접
 * - Diff 2: dot halo 4px / hex 2E (18%)
 * - Diff 3: barVariants dynamic variant + custom={i} (motion v12 prop override 회피) */

type Tier = {
  key: "early" | "normal" | "rush";
  badge?: string;
  when: string;
  whenColor: string;
  price: number;
  label: string;
  keyword: string;
  reason1: string;
  reason2: string;
  barColor: string;
  barHeightMobile: number;
  barHeightDesktop: number;
  emphasis: boolean;
  dotPosition: number;
};

const TIERS: Tier[] = [
  {
    key: "early",
    badge: "최적 / 가장 많이 선택",
    when: "7일+ 전",
    whenColor: "#00C853",
    price: 5,
    label: "얼리버드",
    keyword: "여유 일정",
    reason1: "사건 검토 + 권리 분석 충분",
    reason2: "입찰 일정 협의 가능",
    barColor: "#00C853",
    barHeightMobile: 45,
    barHeightDesktop: 80,
    emphasis: true,
    dotPosition: 16,
  },
  {
    key: "normal",
    when: "7~2일 전",
    whenColor: "#F97316",
    price: 7,
    label: "일반",
    keyword: "표준 일정",
    reason1: "통상 처리 가능",
    reason2: "입찰 정상 진행",
    barColor: "#F97316",
    barHeightMobile: 63,
    barHeightDesktop: 112,
    emphasis: false,
    dotPosition: 50,
  },
  {
    key: "rush",
    when: "2일 이내",
    whenColor: "#EF4444",
    price: 10,
    label: "급건",
    keyword: "긴급 처리",
    reason1: "당일 또는 익일 진행",
    reason2: "우선 배정 비용 추가",
    barColor: "#EF4444",
    barHeightMobile: 90,
    barHeightDesktop: 160,
    emphasis: false,
    dotPosition: 84,
  },
];

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const barVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 },
  }),
};

const dotVariants: Variants = {
  hidden: { opacity: 0.4, scale: 0.7, boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
  visible: (color: string) => ({
    opacity: 1,
    scale: 1.2,
    boxShadow: `0 0 0 4px ${color}2E`,
    transition: { duration: 0.5, ease: "easeOut" },
  }),
};

const lineVariants: Variants = {
  hidden: { opacity: 0.2 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const priceVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export function PricingBlock() {
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
    if (p >= 0.526) return 4;
    if (p >= 0.392) return 3;
    if (p >= 0.295) return 2;
    if (p >= 0.150) return 1;
    return 0;
  });
  useMotionValueEvent(stepValue, "change", (v) => {
    setStep((prev) => Math.max(prev, v));
  });
  useEffect(() => {
    setStep((prev) => Math.max(prev, stepValue.get()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      aria-labelledby="pricing-heading"
      className="flex min-h-[calc(100vh-64px)] flex-col justify-center bg-[#FAFAFA] py-12 lg:min-h-[calc(100vh-80px)] lg:py-16"
    >
      <div className="container-app w-full">
        <motion.h2
          id="pricing-heading"
          variants={fadeVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="mb-4 text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[#111418] [text-wrap:balance] lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          신청이 빠를수록,
          <br />
          <span className="text-[#00C853]">저렴합니다</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        <motion.p
          variants={fadeVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="mb-10 text-[14px] text-gray-500 lg:mb-14 lg:text-[16px]"
        >
          5만원부터 · 낙찰 시 +5만원 (성공 보수) · 패찰 시 보증금 전액 반환
        </motion.p>

        {/* 막대 ascending wrapper — 카드 색 동기 / 5:7:10 비례 / scaleY origin bottom */}
        <div
          aria-hidden="true"
          className="mb-6 grid h-[90px] grid-cols-3 items-end gap-3 lg:mb-10 lg:h-[160px] lg:gap-6"
        >
          {TIERS.map((tier, i) => (
            <div key={tier.key} className="relative flex h-full items-end justify-center">
              <motion.div
                variants={barVariants}
                custom={i}
                initial="hidden"
                animate={step >= 1 ? "visible" : "hidden"}
                style={{
                  height: `${tier.barHeightMobile}px`,
                  backgroundColor: tier.barColor,
                  transformOrigin: "bottom",
                  ["--bar-h-lg" as string]: `${tier.barHeightDesktop}px`,
                }}
                className="w-full rounded-t-lg lg:!h-[var(--bar-h-lg)]"
              />
            </div>
          ))}
        </div>

        {/* 카드 grid 3건 — 강조 (카드 1) green border + 뱃지 / 단계별 설명 3줄 */}
        <div className="mb-12 grid grid-cols-1 gap-4 lg:mb-16 lg:grid-cols-3 lg:gap-6">
          {TIERS.map((tier, i) => (
            <motion.article
              key={tier.key}
              variants={fadeVariants}
              initial="hidden"
              animate={sectionInView ? "visible" : "hidden"}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`relative rounded-3xl bg-white p-6 lg:p-8 ${
                tier.emphasis
                  ? "border-2 shadow-lg"
                  : "border border-gray-200"
              }`}
              style={tier.emphasis ? { borderColor: "#00C853" } : undefined}
            >
              {tier.badge && (
                <div
                  className="absolute -top-3 left-6 rounded-full px-3 py-1 text-[11px] font-medium text-white lg:text-[12px]"
                  style={{ backgroundColor: "#00C853" }}
                >
                  {tier.badge}
                </div>
              )}
              <div
                className="mb-3 text-[12px] font-medium lg:mb-4 lg:text-[14px]"
                style={{ color: tier.whenColor }}
              >
                {tier.when}
              </div>
              <div
                className="mb-3 text-[40px] font-extrabold leading-none text-gray-900 lg:mb-4 lg:text-[56px]"
                style={{ fontWeight: 800 }}
              >
                <motion.span
                  variants={priceVariants}
                  initial="hidden"
                  animate={step >= i + 2 ? "visible" : "hidden"}
                  className="inline-block"
                >
                  <NumberFlow value={step >= i + 2 ? tier.price : 0} />
                  만원
                </motion.span>
              </div>
              <div className="mb-4 text-[14px] font-medium text-gray-600 lg:mb-5 lg:text-[16px]">
                {tier.label}
              </div>
              <div className="space-y-1.5">
                <div
                  className="text-[13px] font-medium lg:text-[15px]"
                  style={{ color: "#111418" }}
                >
                  {tier.keyword}
                </div>
                <div className="text-[12px] leading-[1.55] text-gray-500 lg:text-[14px]">
                  {tier.reason1}
                </div>
                <div className="text-[12px] leading-[1.55] text-gray-500 lg:text-[14px]">
                  {tier.reason2}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* horizontal timeline — line green→orange→red / dot 3건 + 라벨 */}
        <div className="relative mx-auto mt-8 w-full max-w-3xl lg:mt-12">
          <motion.div
            aria-hidden="true"
            variants={lineVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, #00C853 0%, #F97316 50%, #EF4444 100%)",
            }}
          />
          <div className="relative h-[14px]">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.key}
                variants={dotVariants}
                custom={tier.barColor}
                initial="hidden"
                animate={step >= i + 2 ? "visible" : "hidden"}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                style={{
                  left: `${tier.dotPosition}%`,
                  width: 14,
                  height: 14,
                  border: `2.5px solid ${tier.barColor}`,
                }}
              />
            ))}
          </div>
          <div className="relative mt-2 h-5">
            {TIERS.map((tier) => (
              <div
                key={tier.key}
                className="absolute -translate-x-1/2 text-[10px] font-medium text-gray-400"
                style={{ left: `${tier.dotPosition}%` }}
              >
                {tier.when}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
