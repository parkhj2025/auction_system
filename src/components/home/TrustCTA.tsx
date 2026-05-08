"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";
import { Briefcase, Shield, Lock } from "lucide-react";

/* Phase 1.2 (A-1-2) v50 cycle 9 — TrustCTA Hero paradigm 광역 차용.
 * 정정 (Cycle 9):
 * 1. Hero 동영상 첫 frame poster bg (ffmpeg 추출 / hero-poster.jpg)
 * 2. section bg dark → poster jpg + light theme paradigm 정합
 * 3. green halo orb 3건 + trust-orb-float CSS 광역 폐기
 * 4. 큰 "0" + TextGenerateEffect 광역 폐기
 * 5. h2 1줄 통일 ("지금까지 사고 0건.") + Hero textShadow 차용 + "0건" yellow + 마침표 yellow
 * 6. Liquid Glass 박스 = Hero 박스 정확값 직접 차용 (3 trust + CTA + 캡션 단일 wrapper)
 * 7. 3 trust 카드 = Liquid Glass 박스 안 inline (별개 카드 bg 폐기 / icon white / label white/90)
 * 8. CTA shadow-2xl 폐기 + w-full + green primary 보존
 * 9. 캡션 색 white/70 + size 14·16
 * 10. motion + useInView + variants 5건 (fade / box / container / item / cta) 진입 paradigm
 * 11. aceternity TextGenerateEffect 광역 폐기 (사용처 0 정합) */

const CARDS = [
  { Icon: Briefcase, label: "공인중개사 직접 입찰" },
  { Icon: Shield, label: "보증보험 가입" },
  { Icon: Lock, label: "전용 계좌 분리 보관" },
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
      className="relative isolate flex min-h-[calc(100dvh-64px)] flex-col justify-center overflow-hidden py-16 lg:min-h-[calc(100dvh-80px)] lg:py-20"
    >
      {/* bg poster — Hero 동영상 첫 frame jpg (Next/Image fill / 정적 / 페이지 무거움 0). */}
      <Image
        src="/images/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority={false}
        sizes="100vw"
        className="-z-10 object-cover"
      />

      <div className="container-app relative z-10 flex w-full flex-col items-center gap-10 lg:gap-14">
        {/* h2 1줄 통일 + Hero textShadow 차용. */}
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
          지금까지 사고{" "}
          <span
            style={{
              color: "#FFD43B",
              textShadow:
                "0 0 32px rgba(255, 212, 59, 0.7), 0 0 64px rgba(255, 212, 59, 0.5), 0 4px 16px rgba(0, 0, 0, 0.5)",
            }}
          >
            0건
          </span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        {/* subtext. */}
        <motion.p
          variants={fadeVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="text-center text-[17px] font-medium leading-[1.6] text-white/80 lg:text-[24px]"
          style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(0, 0, 0, 0.5)" }}
        >
          매수신청대리인 등록 · 서울보증보험 가입 · 보증금 분리 보관
        </motion.p>

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
            {CARDS.map(({ Icon, label }) => (
              <motion.div
                key={label}
                variants={itemVariants}
                className="flex flex-col items-center text-center"
              >
                <Icon
                  size={28}
                  strokeWidth={2}
                  className="mb-2 text-white lg:mb-3 lg:h-8 lg:w-8"
                  aria-hidden="true"
                />
                <div className="text-[14px] font-medium text-white/90 lg:text-[18px]">
                  {label}
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
