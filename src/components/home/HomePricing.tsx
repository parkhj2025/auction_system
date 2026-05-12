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

/* cycle 1-G-γ-α-β — Pricing 사전 PricingBlock paradigm 전체 회복 (commit 2d2601e 기준).
 * - 풀스크린 min-h + bg surface-muted + h2 44/88px 회복
 * - button click + selected paradigm 회복 (사전 c0f8a10 article default 정정 폐기)
 * - NumberFlow CountUp + scroll-triggered timeline (vline + marker + pulse + endpoint "입찰일") 회복
 * - 3-tier 색감 회복 (green + orange + red / §13 임시 예외 paradigm)
 * - literal hex → var 토큰 광역 정정 (§A-2 + §29 정합)
 * - 4 chip (낙찰 성공보수 등) 영구 폐기 (sub paragraph 단독 회복). */

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

export function HomePricing() {
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
    if (p >= 0.25) return 1;
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
      className="flex min-h-[calc(100vh-64px)] flex-col justify-center bg-[var(--color-surface-muted)] py-12 lg:min-h-[calc(100vh-80px)] lg:py-16"
    >
      <div className="container-app w-full">
        <motion.p
          variants={fadeVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]"
        >
          Pricing
        </motion.p>
        <motion.h2
          id="pricing-heading"
          variants={fadeVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="mb-4 text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--color-ink-900)] [text-wrap:balance] lg:text-[88px]"
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
          className="mb-10 text-base leading-7 text-[var(--color-ink-500)] lg:mb-14 lg:text-lg lg:leading-8"
        >
          낙찰 시에는 성공보수 5만원 추가, 패찰 시 보증금 당일 즉시 반환됩니다.
        </motion.p>

        {/* 모바일 vertical wrapper. */}
        <div className="relative pl-[30px] lg:hidden">
          <motion.div
            aria-hidden="true"
            variants={lineVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            className="absolute left-[10px] top-0 w-[6px] rounded-full"
            style={{ background: VLINE_GRADIENT, bottom: "50px" }}
          />

          {TIERS.map((tier, i) => {
            const isSelected = selected === i;
            const stepActive = step >= 1;
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

          {/* endpoint area (모바일 / pl-[30px] 영역 0 / left-[-17px] vline center 정합). */}
          <div className="relative mt-0 min-h-[50px]">
            <div className="pointer-events-none absolute left-[-17px] top-[-10px] z-10 -translate-x-1/2">
              <motion.div
                variants={endpointVariants}
                initial="hidden"
                animate={step >= 1 ? "visible" : "hidden"}
                className="relative h-5 w-5 rounded-full"
                style={{ backgroundColor: "#EF4444" }}
              >
                {step >= 1 && (
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
              animate={step >= 1 ? "visible" : "hidden"}
              className="absolute left-[-17px] top-[18px] -translate-x-1/2 whitespace-nowrap text-[14px] font-medium"
              style={{ color: "var(--color-ink-900)" }}
            >
              입찰일
            </motion.div>
          </div>
        </div>

        {/* 데스크탑 horizontal wrapper. */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-6">
            {TIERS.map((tier, i) => {
              const isSelected = selected === i;
              const stepActive = step >= 1;
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

          {/* horizontal timeline (정정 0 / stepActive 광역 step >= 1). */}
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
              const stepActive = step >= 1;
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
                animate={step >= 1 ? "visible" : "hidden"}
                className="relative h-6 w-6 rounded-full"
                style={{ backgroundColor: "#EF4444" }}
              >
                {step >= 1 && (
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
                animate={step >= 1 ? "visible" : "hidden"}
                className="absolute left-1/2 top-[36px] -translate-x-1/2 whitespace-nowrap text-[16px] font-medium"
                style={{ color: "var(--color-ink-900)" }}
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
      className="relative w-full cursor-pointer rounded-[14px] bg-white p-[14px] text-left transition-[border-color,box-shadow] duration-[350ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 lg:rounded-3xl lg:p-8"
      style={{
        border: `2px solid ${selected ? tier.color : "var(--color-border)"}`,
        boxShadow: selected ? `0 4px 14px ${tier.color}24` : "none",
      }}
    >
      {tier.badge && (
        <div
          className="absolute left-3 top-[-10px] rounded-full px-[10px] py-1 text-[10px] font-medium text-white lg:left-6 lg:px-3 lg:text-[12px]"
          style={{ backgroundColor: "var(--brand-green)" }}
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
        className="mb-[6px] text-[40px] font-extrabold leading-none tabular-nums text-[var(--color-ink-900)] lg:mb-4 lg:text-[56px]"
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
      <div className="mb-3 text-[12px] font-medium text-[var(--color-ink-500)] lg:mb-5 lg:text-[16px]">
        {tier.label}
      </div>
      <div className="mb-[14px] h-2 w-full overflow-hidden rounded-[4px] bg-[var(--color-ink-100)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: stepActive ? `${tier.barWidth}%` : 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
          style={{ backgroundColor: tier.color }}
        />
      </div>
      <div className="-mx-[2px] mb-2 h-px bg-[var(--color-border)]" />
      <div className="space-y-1">
        <div className="text-[12.5px] font-medium lg:text-[15px]" style={{ color: "var(--color-ink-900)" }}>
          {tier.keyword}
        </div>
        <div className="text-[11px] leading-[1.55] text-[var(--color-ink-500)] lg:text-[14px]">
          {tier.reason1}
        </div>
        <div className="text-[11px] leading-[1.55] text-[var(--color-ink-500)] lg:text-[14px]">
          {tier.reason2}
        </div>
      </div>
    </button>
  );
}
