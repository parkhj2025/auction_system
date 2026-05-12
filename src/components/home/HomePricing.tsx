"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { PRICING_INCLUDES } from "@/lib/constants";

/* cycle 1-G-γ-α-α — 메인 섹션 4: Pricing (메인 사전 PricingBlock paradigm 영구 회복).
 * paradigm: white bg + h2 "신청이 빠를수록, 저렴합니다." (메인 사전 카피 SoT 영구 회복)
 *         + 3 카드 (얼리버드·일반·급건 / keyword + reason 광역 paradigm 회복)
 *         + barWidth progress bar (50% / 70% / 100%)
 *         + 4 chip (낙찰 성공보수 + 전용계좌 + 당일 반환 + 보증보험).
 * 사전 영구 룰 §13 정합 = orange #F97316 + red #EF4444 영구 폐기 → brand-green + ink scale 단독. */

type Tier = {
  key: "early" | "normal" | "rush";
  badge?: string;
  when: string;
  whenLabel: string;
  price: string;
  label: string;
  keyword: string;
  reason1: string;
  reason2: string;
  barWidth: number;
};

const TIERS: Tier[] = [
  {
    key: "early",
    badge: "최적 / 가장 많이 선택",
    when: "early",
    whenLabel: "7일+ 전",
    price: "5만원",
    label: "얼리버드",
    keyword: "여유 일정",
    reason1: "사건 검토 + 권리 분석 충분",
    reason2: "입찰 일정 협의 가능",
    barWidth: 50,
  },
  {
    key: "normal",
    when: "normal",
    whenLabel: "7~2일 전",
    price: "7만원",
    label: "일반",
    keyword: "표준 일정",
    reason1: "통상 처리 가능",
    reason2: "입찰 정상 진행",
    barWidth: 70,
  },
  {
    key: "rush",
    when: "rush",
    whenLabel: "2일 이내",
    price: "10만원",
    label: "급건",
    keyword: "긴급 처리",
    reason1: "당일 또는 익일 진행",
    reason2: "우선 배정 비용 추가",
    barWidth: 100,
  },
];

export function HomePricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="border-t border-[var(--color-border)] bg-white py-20 sm:py-32"
    >
      <div className="container-app mx-auto w-full max-w-[1200px]">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]"
        >
          Pricing
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-[var(--color-ink-900)] sm:text-[64px]"
        >
          신청이 빠를수록,
          <br />
          <span className="text-[var(--brand-green)]">저렴합니다</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-5 text-base leading-7 text-[var(--color-ink-500)] sm:text-lg sm:leading-8"
        >
          낙찰 시에는 성공보수 5만원 추가, 패찰 시 보증금 당일 즉시 반환됩니다.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <motion.article
              key={tier.key}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.3 + i * 0.15,
              }}
              className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-8"
            >
              {tier.badge && (
                <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-[var(--brand-green)] px-3 py-1 text-xs font-bold text-white">
                  {tier.badge}
                </span>
              )}
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
                {tier.whenLabel}
              </p>
              <p className="mt-4 text-[40px] font-black leading-none tabular-nums text-[var(--color-ink-900)] sm:text-[56px]">
                {tier.price}
              </p>
              <p className="mt-2 text-base font-semibold text-[var(--color-ink-700)]">
                {tier.label}
              </p>

              {/* progress bar (사전 paradigm 영구 회복 / 색만 brand-green 단독 정정). */}
              <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-[var(--color-ink-100)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${tier.barWidth}%` } : {}}
                  transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.6 + i * 0.15,
                  }}
                  className="h-full rounded-full bg-[var(--brand-green)]"
                />
              </div>

              <div className="mt-6 border-t border-gray-200 pt-5">
                <p className="text-sm font-bold text-[var(--color-ink-900)]">
                  {tier.keyword}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                  {tier.reason1}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-ink-500)]">
                  {tier.reason2}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* 공통 포함 사항 chip 4건. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.85 }}
          className="mt-12 text-center"
        >
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
            공통 포함 사항
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {PRICING_INCLUDES.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center rounded-full bg-[var(--color-ink-100)] px-4 py-2 text-sm font-semibold text-[var(--color-ink-700)]"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
