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

/* Phase 1.2 (A-1-2) v19 — PricingBlock (모바일 vertical + 데스크탑 horizontal grid timeline).
 * - 막대 wrapper 폐기 → 카드 안 bar 통합 (50/70/100% / 가격 비례)
 * - tick 폐기 → 카드별 marker (모바일 좌측 vline / 데스크탑 하단 hline)
 * - endpoint 빨간 원 + "입찰일" 라벨 + pulse infinite (영구 / 선택 무관)
 * - 카드 선택 paradigm (default 얼리버드 / click → setSelected / border + box-shadow + marker filled + ring pulse)
 * - scroll-linked 4단 (Compare 학습 정합 / 80/25/0.5/0.001 spring)
 * - Diff 2: 가격 모바일 40px (절대 크기 룰 정합)
 * - Diff 3: 데스크탑 timeline-wrap grid 재정의 + hline right-[12px] + marker column 안 left-1/2
 * - Diff 4: focus-visible ring #00C853/40 직접 (var 의존 0) */

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
  color: string;
  barWidth: number;
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
    color: "#00C853",
    barWidth: 50,
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
    color: "#F97316",
    barWidth: 70,
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
    color: "#EF4444",
    barWidth: 100,
  },
];

const VLINE_GRADIENT =
  "linear-gradient(180deg, #00C853 0%, #F97316 35%, #EF4444 75%, #EF4444 100%)";
const HLINE_GRADIENT =
  "linear-gradient(90deg, #00C853 0%, #F97316 35%, #EF4444 75%, #EF4444 100%)";

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const lineVariants: Variants = {
  hidden: { opacity: 0.3 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const markerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const endpointVariants: Variants = {
  hidden: { opacity: 0.3, scale: 0.4 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const PULSE_ANIMATE = { scale: [1, 2.8], opacity: [0.6, 0] };
const PULSE_TRANSITION = { duration: 2.2, repeat: Infinity, ease: "easeOut" as const };

export function PricingBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(0);

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

        {/* 모바일 vertical wrapper */}
        <div className="relative pl-[30px] lg:hidden">
          <motion.div
            aria-hidden="true"
            variants={lineVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            className="absolute bottom-0 left-[10px] top-0 w-[6px] rounded-full"
            style={{ background: VLINE_GRADIENT }}
          />

          {TIERS.map((tier, i) => {
            const isSelected = selected === i;
            const stepActive = step >= i + 2;
            return (
              <div key={tier.key} className="relative mb-[14px] last:mb-0">
                <div className="pointer-events-none absolute left-[-17px] top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    variants={markerVariants}
                    initial="hidden"
                    animate={stepActive ? "visible" : "hidden"}
                    className="relative h-5 w-5 rounded-full border-[2.5px]"
                    style={{
                      borderColor: tier.color,
                      backgroundColor: isSelected ? tier.color : "white",
                      transition: "background-color 0.35s ease-out",
                    }}
                  >
                    {isSelected && stepActive && (
                      <motion.span
                        aria-hidden="true"
                        animate={PULSE_ANIMATE}
                        transition={PULSE_TRANSITION}
                        className="absolute inset-0 rounded-full"
                        style={{ border: `2.5px solid ${tier.color}` }}
                      />
                    )}
                  </motion.div>
                </div>

                <PricingCard
                  tier={tier}
                  selected={isSelected}
                  stepActive={stepActive}
                  onClick={() => setSelected(i)}
                />
              </div>
            );
          })}

          {/* endpoint area — 모바일 / row-stack 외부 아래 */}
          <div className="relative mt-0 min-h-[50px] pl-[30px]">
            <div className="pointer-events-none absolute left-[13px] top-[-10px] z-10 -translate-x-1/2">
              <motion.div
                variants={endpointVariants}
                initial="hidden"
                animate={step >= 4 ? "visible" : "hidden"}
                className="relative h-5 w-5 rounded-full"
                style={{ backgroundColor: "#EF4444" }}
              >
                {step >= 4 && (
                  <motion.span
                    aria-hidden="true"
                    animate={PULSE_ANIMATE}
                    transition={PULSE_TRANSITION}
                    className="absolute inset-0 rounded-full"
                    style={{ border: "2.5px solid #EF4444" }}
                  />
                )}
              </motion.div>
            </div>
            <motion.div
              variants={fadeVariants}
              initial="hidden"
              animate={step >= 4 ? "visible" : "hidden"}
              className="absolute left-[13px] top-[18px] -translate-x-1/2 whitespace-nowrap text-[14px] font-medium"
              style={{ color: "#111418" }}
            >
              입찰일
            </motion.div>
          </div>
        </div>

        {/* 데스크탑 horizontal wrapper */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-6">
            {TIERS.map((tier, i) => {
              const isSelected = selected === i;
              const stepActive = step >= i + 2;
              return (
                <PricingCard
                  key={tier.key}
                  tier={tier}
                  selected={isSelected}
                  stepActive={stepActive}
                  onClick={() => setSelected(i)}
                />
              );
            })}
          </div>

          {/* horizontal timeline (Diff 3 grid 재정의 / hline right-[12px] / marker column 안) */}
          <div className="relative mt-12 grid h-[60px] grid-cols-3 gap-6">
            <motion.div
              aria-hidden="true"
              variants={lineVariants}
              initial="hidden"
              animate={sectionInView ? "visible" : "hidden"}
              className="absolute left-0 right-[12px] top-1/2 h-[8px] -translate-y-1/2 rounded-full"
              style={{ background: HLINE_GRADIENT }}
            />

            {TIERS.map((tier, i) => {
              const isSelected = selected === i;
              const stepActive = step >= i + 2;
              return (
                <div key={tier.key} className="relative">
                  <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      variants={markerVariants}
                      initial="hidden"
                      animate={stepActive ? "visible" : "hidden"}
                      className="relative h-6 w-6 rounded-full border-[2.5px]"
                      style={{
                        borderColor: tier.color,
                        backgroundColor: isSelected ? tier.color : "white",
                        transition: "background-color 0.35s ease-out",
                      }}
                    >
                      {isSelected && stepActive && (
                        <motion.span
                          aria-hidden="true"
                          animate={PULSE_ANIMATE}
                          transition={PULSE_TRANSITION}
                          className="absolute inset-0 rounded-full"
                          style={{ border: `2.5px solid ${tier.color}` }}
                        />
                      )}
                    </motion.div>
                  </div>
                </div>
              );
            })}

            <div className="pointer-events-none absolute right-0 top-1/2 z-10 -translate-y-1/2">
              <motion.div
                variants={endpointVariants}
                initial="hidden"
                animate={step >= 4 ? "visible" : "hidden"}
                className="relative h-6 w-6 rounded-full"
                style={{ backgroundColor: "#EF4444" }}
              >
                {step >= 4 && (
                  <motion.span
                    aria-hidden="true"
                    animate={PULSE_ANIMATE}
                    transition={PULSE_TRANSITION}
                    className="absolute inset-0 rounded-full"
                    style={{ border: "2.5px solid #EF4444" }}
                  />
                )}
              </motion.div>
              <motion.div
                variants={fadeVariants}
                initial="hidden"
                animate={step >= 4 ? "visible" : "hidden"}
                className="absolute left-1/2 top-[36px] -translate-x-1/2 whitespace-nowrap text-[16px] font-medium"
                style={{ color: "#111418" }}
              >
                입찰일
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type PricingCardProps = {
  tier: Tier;
  selected: boolean;
  stepActive: boolean;
  onClick: () => void;
};

function PricingCard({ tier, selected, stepActive, onClick }: PricingCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${tier.label} ${tier.price}만원 / ${tier.when}`}
      className="relative w-full cursor-pointer rounded-[14px] bg-white p-[14px] text-left transition-[border-color,box-shadow] duration-[350ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C853]/40 focus-visible:ring-offset-2 lg:rounded-3xl lg:p-8"
      style={{
        border: `2px solid ${selected ? tier.color : "#E5E7EB"}`,
        boxShadow: selected ? `0 4px 14px ${tier.color}24` : "none",
      }}
    >
      {tier.badge && (
        <div
          className="absolute left-3 top-[-10px] rounded-full px-[10px] py-1 text-[10px] font-medium text-white lg:left-6 lg:px-3 lg:text-[12px]"
          style={{ backgroundColor: "#00C853" }}
        >
          {tier.badge}
        </div>
      )}
      <div
        className="mb-2 text-[11px] font-medium lg:mb-4 lg:text-[14px]"
        style={{ color: tier.whenColor }}
      >
        {tier.when}
      </div>
      <div
        className="mb-[6px] text-[40px] font-extrabold leading-none tabular-nums text-[#111418] lg:mb-4 lg:text-[56px]"
        style={{ fontWeight: 800 }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: stepActive ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="inline-block"
        >
          <NumberFlow value={stepActive ? tier.price : 0} />
          만원
        </motion.span>
      </div>
      <div className="mb-3 text-[12px] font-medium text-gray-500 lg:mb-5 lg:text-[16px]">
        {tier.label}
      </div>
      <div className="mb-[14px] h-2 w-full overflow-hidden rounded-[4px] bg-[#F3F4F6]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: stepActive ? `${tier.barWidth}%` : 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
          style={{ backgroundColor: tier.color }}
        />
      </div>
      <div className="-mx-[2px] mb-2 h-px bg-gray-200" />
      <div className="space-y-1">
        <div className="text-[12.5px] font-medium lg:text-[15px]" style={{ color: "#111418" }}>
          {tier.keyword}
        </div>
        <div className="text-[11px] leading-[1.55] text-gray-500 lg:text-[14px]">
          {tier.reason1}
        </div>
        <div className="text-[11px] leading-[1.55] text-gray-500 lg:text-[14px]">
          {tier.reason2}
        </div>
      </div>
    </button>
  );
}
