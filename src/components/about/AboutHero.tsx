"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

/* cycle 1-G-β-γ-β — /about 섹션 1: Hero.
 * paradigm: 풀스크린 charcoal bg + asymmetric (좌 col-span-7 카피 + 우 col-span-5 자체 SVG).
 * 자체 SVG = 시계 + 번개 + 궤도 추상 (brand-green stroke + yellow accent).
 * motion v12 = 시계 회전 + 번개 깜빡 + 궤도 회전 (continuous loop). */

export function AboutHero() {
  return (
    <section className="relative min-h-[90vh] w-full bg-[#111418] py-20 sm:py-28">
      <div className="container-app mx-auto grid h-full w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* 좌 카피 영역 (col-span-7). */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
            About 경매퀵
          </p>
          <h1 className="mt-4 text-[44px] font-black leading-[1.1] tracking-[-0.015em] text-white sm:text-[88px]">
            <span className="text-[var(--brand-green)]">공인중개사</span>가 직접 갑니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--color-ink-300)] sm:text-lg sm:leading-8">
            투자자의 시간을, 다시 투자에 돌립니다.
          </p>
          <div className="mt-8">
            <Link
              href="/apply"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--brand-green)] px-6 text-base font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418]"
            >
              입찰 대리 신청
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        {/* 우 자체 SVG 영역 (col-span-5). */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex items-center justify-center lg:col-span-5"
        >
          <HeroOrbit />
        </motion.div>
      </div>
    </section>
  );
}

/* 자체 SVG — 시계 + 번개 + 궤도 추상 (brand-green stroke + yellow accent). */
function HeroOrbit() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full max-w-[420px]"
      aria-hidden="true"
    >
      {/* 외곽 궤도 (천천한 회전). */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle
          cx="200"
          cy="200"
          r="170"
          fill="none"
          stroke="#00C853"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.4"
        />
        <circle cx="200" cy="30" r="4" fill="#00C853" opacity="0.8" />
      </motion.g>

      {/* 중간 궤도 (역회전). */}
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke="#00C853"
          strokeWidth="1"
          opacity="0.3"
        />
        <circle cx="320" cy="200" r="3" fill="#FFD43B" />
      </motion.g>

      {/* 시계 (중심). */}
      <g>
        <circle
          cx="200"
          cy="200"
          r="70"
          fill="none"
          stroke="#00C853"
          strokeWidth="2"
        />
        {/* 시침 (천천한 회전). */}
        <motion.line
          x1="200"
          y1="200"
          x2="200"
          y2="150"
          stroke="#00C853"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        />
        {/* 분침 (빠른 회전). */}
        <motion.line
          x1="200"
          y1="200"
          x2="200"
          y2="140"
          stroke="#FFD43B"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        />
        <circle cx="200" cy="200" r="4" fill="#FFD43B" />
        {/* 12 + 3 + 6 + 9 시각 마커. */}
        <circle cx="200" cy="138" r="2" fill="#00C853" />
        <circle cx="262" cy="200" r="2" fill="#00C853" />
        <circle cx="200" cy="262" r="2" fill="#00C853" />
        <circle cx="138" cy="200" r="2" fill="#00C853" />
      </g>

      {/* 번개 (좌상단 / 깜빡). */}
      <motion.path
        d="M 90 110 L 75 145 L 90 145 L 80 175 L 105 135 L 90 135 Z"
        fill="#FFD43B"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
