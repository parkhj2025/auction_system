"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";
import { Briefcase, Shield, Lock } from "lucide-react";

/* Phase 1.2 (A-1-2) v50 cycle 9-2 — TrustCTA 카피 + 배경 + 모바일 줄바꿈 정정.
 * 정정 (Cycle 9-2):
 * 1. h2 카피 광역 정정 ("지금껏 그래왔듯, / 앞으로도 안전하게.") + "안전하게" yellow + 마침표 yellow
 * 2. subtext 광역 폐기 (3 trust 카드 정수 중복)
 * 3. CARDS 데이터 line1 + line2 분리 (모바일 + 데스크탑 광역 2줄 강제 / `<br />` 명시)
 *    - 카드 2: "보증보험 가입" → "보증보험 / 지급보증" (가입 행위 → 지급보증 가치)
 * 4. bg image src hero-poster.jpg → trust-bg.jpg (Gemini 3 Pro Image / 추상 black-green flow) */

const CARDS = [
  { Icon: Briefcase, line1: "공인중개사", line2: "직접 입찰" },
  { Icon: Shield, line1: "보증보험", line2: "지급보증" },
  { Icon: Lock, line1: "전용 계좌", line2: "분리 보관" },
] as const;

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const boxVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.6 } },
};

export function TrustCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="trust-heading"
      className="relative isolate flex flex-col justify-center overflow-hidden py-20 lg:py-32"
    >
      {/* bg — Gemini 3 Pro Image / 추상 black-green flow (Next/Image fill / 정적 / 페이지 무거움 0). */}
      <Image
        src="/images/trust-bg.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority={false}
        sizes="100vw"
        className="-z-10 object-cover"
      />

      <div className="container-app relative z-10 flex w-full flex-col items-center gap-10 lg:gap-14">
        {/* h2 2줄 + Hero textShadow 차용 + "안전하게" yellow + 마침표 yellow. */}
        <motion.h2
          id="trust-heading"
          variants={fadeVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="text-center text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-white [text-wrap:balance] lg:text-[88px]"
          style={{
            fontWeight: 800,
            textShadow:
              "0 4px 24px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)",
          }}
        >
          지금껏 그래왔듯,
          <br />
          앞으로도{" "}
          <span
            style={{
              color: "#FFD43B",
              textShadow:
                "0 0 32px rgba(255, 212, 59, 0.7), 0 0 64px rgba(255, 212, 59, 0.5), 0 4px 16px rgba(0, 0, 0, 0.5)",
            }}
          >
            안전하게
          </span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        {/* Liquid Glass 박스 — Hero 정확값 직접 차용 (3 trust + CTA + 캡션 단일 wrapper). */}
        <motion.div
          variants={boxVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 rounded-[28px] px-6 py-7 lg:gap-8 lg:px-10 lg:py-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.20) 100%)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 32px 80px -16px rgba(0, 0, 0, 0.35)",
          }}
        >
          {/* 3 trust 카드 — 박스 안 inline horizontal 3-col + stagger. */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            className="grid w-full grid-cols-3 gap-3 lg:gap-6"
          >
            {CARDS.map(({ Icon, line1, line2 }) => (
              <motion.div
                key={line1}
                variants={itemVariants}
                className="flex flex-col items-center text-center"
              >
                <Icon
                  size={28}
                  strokeWidth={2}
                  className="mb-2 text-white lg:mb-3 lg:h-8 lg:w-8"
                  aria-hidden="true"
                />
                <div className="text-[14px] font-medium leading-tight text-white/90 lg:text-[18px]">
                  {line1}
                  <br />
                  {line2}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA 버튼 — green primary + w-full (Liquid Glass 안 inline). */}
          <motion.div
            variants={ctaVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            className="w-full"
          >
            <Link
              href="/apply"
              className="inline-flex w-full items-center justify-center rounded-full bg-[var(--brand-green)] px-12 py-4 text-[18px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:px-16 lg:py-5 lg:text-[20px]"
            >
              지금 신청하기
            </Link>
          </motion.div>

          {/* 캡션. */}
          <motion.p
            variants={ctaVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            className="text-[14px] text-white/70 lg:text-[16px]"
          >
            법원에 가지 않고, 경매를 시작하세요.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
