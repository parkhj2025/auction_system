"use client";

import { useRef, useState, useEffect } from "react";
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

/* Phase 1.2 (A-1-2) v41 — CompareBlock (3 phase choreography + 보조 카피 정정 + Blueprint Grid + h2 마침표 yellow).
 * 정정 (Plan v41):
 * 1. 보조 카피 "85배 빠릅니다." → "발품도 시간도, 단 한 번에." (에너지 + 시간 + 단계 제거 동시 정합)
 * 2. h2 마침표 yellow #FFD43B (Insight + PageHero paradigm 확장)
 * 3. Phase 1 entrance (0~600ms) — 라벨 + 5 막대 wave (60ms stagger) + 우 큰 숫자 + ArrowRight + 보조 카피
 * 4. Phase 2 dim (600~1100ms) — 좌 5 막대 opacity 1 → 0.3 (단계 제거 시각화)
 * 5. Phase 3 NumberFlow (1100~1600ms) — 좌 255 / 우 3 동시 발화 + ArrowRight bounce + 우 큰 숫자 pulse
 * 6. Blueprint Grid 배경 (24px / rgba(229,231,235,0.5) / Stripe·Linear·Vercel paradigm)
 * 7. useInView once: true / amount 0.3 (재발화 0)
 * 8. 보조 카피 grid 외 별도 row (모바일 28px 한 줄 정합)
 * 9. 분 단위 baseline 통일 (flex items-baseline + 좌우 동일 패러다임)
 * 10. layout 모션 0 (collapse 0 / AnimatePresence 0 / 모바일 lag 차단) */

type Bar = {
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  label: string;
  minutes: number;
};

const BAR_DATA: Bar[] = [
  { Icon: Car, label: "휴가 신청", minutes: 30 },
  { Icon: FileText, label: "서류 준비", minutes: 45 },
  { Icon: Banknote, label: "수표 발행", minutes: 30 },
  { Icon: Building2, label: "법원 이동", minutes: 60 },
  { Icon: Clock, label: "입찰 대기", minutes: 90 },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const labelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const barVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  dim: {
    opacity: 0.3,
    transition: { duration: 0.5, delay: 0.6, ease: "easeInOut" },
  },
};

const arrowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
  bounce: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.4, delay: 1.1, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const subCopyVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.4 } },
};

const rightNumberVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut", delay: 0.2 },
  },
  pulse: {
    scale: [1, 1.02, 1],
    transition: { duration: 0.6, delay: 1.1, ease: "easeInOut" },
  },
};

export function CompareBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setStarted(true), 1100);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="compare-heading"
      className="flex min-h-[calc(100vh-64px)] flex-col justify-center py-12 lg:min-h-[calc(100vh-80px)] lg:py-16"
      style={{
        backgroundColor: "white",
        backgroundImage:
          "linear-gradient(to right, rgba(229,231,235,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(229,231,235,0.5) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="container-app w-full">
        <h2
          id="compare-heading"
          className="mb-12 text-center text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-16 lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          법원 가는 <span className="text-gray-400">3시간,</span>
          <br />
          물건 보는 <span className="text-[var(--brand-green)]">시간으로</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </h2>

        {/* 큰 숫자 직접 비교 — 좌 (gray) vs 가운데 (ArrowRight) vs 우 (green) */}
        <motion.div
          className="mb-8 grid grid-cols-3 items-center gap-4 lg:mb-12 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* 좌측 — 직접 가는 길 */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              variants={labelVariants}
              className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-gray-400 lg:mb-4 lg:text-[14px]"
            >
              직접 가는 길
            </motion.div>
            <div className="flex items-baseline justify-center gap-1">
              <span
                className="text-[80px] font-extrabold leading-none text-gray-400 lg:text-[200px]"
                style={{ fontWeight: 800 }}
              >
                {started ? <NumberFlow value={255} /> : "0"}
              </span>
              <span className="text-[20px] font-bold text-gray-400 lg:text-[40px]">분</span>
            </div>
          </div>

          {/* 가운데 — 화살표 only */}
          <motion.div
            variants={arrowVariants}
            animate={isInView ? ["visible", "bounce"] : "hidden"}
            className="flex justify-center"
          >
            <ArrowRight size={48} strokeWidth={2} className="text-gray-400 lg:hidden" />
            <ArrowRight size={64} strokeWidth={2} className="hidden text-gray-400 lg:block" />
          </motion.div>

          {/* 우측 — 경매퀵 길 */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              variants={labelVariants}
              className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--brand-green)] lg:mb-4 lg:text-[14px]"
            >
              경매퀵 길
            </motion.div>
            <motion.div
              variants={rightNumberVariants}
              animate={isInView ? ["visible", "pulse"] : "hidden"}
              className="flex items-baseline justify-center gap-1"
            >
              <span
                className="text-[80px] font-extrabold leading-none text-[var(--brand-green)] lg:text-[200px]"
                style={{ fontWeight: 800 }}
              >
                {started ? <NumberFlow value={3} /> : "0"}
              </span>
              <span className="text-[20px] font-bold text-[var(--brand-green)] lg:text-[40px]">분</span>
            </motion.div>
          </div>
        </motion.div>

        {/* 보조 카피 (grid 외 / 한 줄 정합) */}
        <motion.div
          variants={subCopyVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12 text-center text-[28px] font-bold leading-[1.3] tracking-[-0.015em] text-gray-900 lg:mb-16 lg:text-[48px]"
          style={{ fontWeight: 700 }}
        >
          발품도 시간도, 단 한 번에.
        </motion.div>

        {/* 하단 5 막대 — wave entrance + Phase 2 dim */}
        <motion.div
          className="mx-auto grid max-w-4xl grid-cols-5 gap-2 lg:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {BAR_DATA.map(({ Icon, label, minutes }) => (
            <motion.div
              key={label}
              variants={barVariants}
              animate={isInView ? ["visible", "dim"] : "hidden"}
              className="flex flex-col items-center gap-1 lg:gap-2"
            >
              <Icon size={20} strokeWidth={2} className="text-gray-400" />
              <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gray-300"
                  style={{ width: `${(minutes / 90) * 100}%` }}
                />
              </div>
              <div className="text-[11px] font-semibold text-gray-500 lg:text-[13px]">
                {label} {minutes}분
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
