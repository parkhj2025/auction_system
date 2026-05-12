"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

/* cycle 1-G-γ — /service 섹션 1: Hero.
 * paradigm: charcoal 풀스크린 + asymmetric (좌 col-span-7 카피 + 우 col-span-5 SVG).
 * 자체 SVG = 사건번호 input → 흐름 → 망치 (gavel) 추상 paradigm (/about Hero SVG 차용 NG / 신규 paradigm). */

export function ServiceHero() {
  return (
    <section className="relative min-h-[90vh] w-full bg-[#111418] py-20 sm:py-28">
      <div className="container-app mx-auto grid h-full w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* 좌 카피 영역. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
            이용 절차
          </p>
          <h1 className="mt-4 text-[44px] font-black leading-[1.1] tracking-[-0.015em] text-white sm:text-[88px]">
            <span className="text-[var(--brand-green)]">사건번호</span> 입력부터, 낙찰까지
            <span style={{ color: "#FFD43B" }}>.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--color-ink-300)] sm:text-lg sm:leading-8">
            신청 · 서류 · 입찰 · 결과 — 한 번에 처리합니다.
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

        {/* 우 자체 SVG (사건번호 → 흐름 → 망치 추상). */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex items-center justify-center lg:col-span-5"
        >
          <ServiceFlow />
        </motion.div>
      </div>
    </section>
  );
}

/* 자체 SVG — 사건번호 input → 흐름 → 망치 추상 (continuous loop subtle). */
function ServiceFlow() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full max-w-[420px]"
      aria-hidden="true"
    >
      {/* 사건번호 input 추상 (좌상). */}
      <rect
        x="40"
        y="80"
        width="180"
        height="56"
        rx="14"
        fill="none"
        stroke="#00C853"
        strokeWidth="2"
      />
      <motion.rect
        x="56"
        y="100"
        width="80"
        height="6"
        rx="3"
        fill="#FFD43B"
        animate={{ width: [80, 120, 80] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <rect x="56" y="116" width="48" height="3" rx="1.5" fill="#475569" />

      {/* 화살표 (input → 가운데). */}
      <motion.path
        d="M 230 108 L 270 108"
        stroke="#00C853"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M 260 100 L 270 108 L 260 116"
        stroke="#00C853"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 가운데 흐름 = 5 step dot (vertical). */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.circle
            key={i}
            cx="300"
            cy={108 + i * 28}
            r="5"
            fill={i === 0 ? "#FFD43B" : "#00C853"}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
        {/* 연결 line. */}
        <line
          x1="300"
          y1="113"
          x2="300"
          y2={108 + 4 * 28 - 5}
          stroke="#00C853"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.4"
        />
      </g>

      {/* 화살표 (가운데 → 우하). */}
      <motion.path
        d="M 320 240 Q 350 280, 320 320"
        stroke="#00C853"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* 망치 (gavel) 추상 = 우하 결과. */}
      <g>
        <motion.g
          animate={{ rotate: [0, -15, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatDelay: 2.6,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "200px 340px" }}
        >
          {/* 망치 머리. */}
          <rect
            x="160"
            y="290"
            width="80"
            height="32"
            rx="6"
            fill="none"
            stroke="#00C853"
            strokeWidth="2.5"
          />
          {/* 망치 손잡이. */}
          <rect
            x="194"
            y="320"
            width="12"
            height="50"
            rx="3"
            fill="none"
            stroke="#00C853"
            strokeWidth="2.5"
          />
          {/* yellow accent. */}
          <circle cx="200" cy="306" r="4" fill="#FFD43B" />
        </motion.g>
        {/* 베이스 line. */}
        <line
          x1="150"
          y1="375"
          x2="250"
          y2="375"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* 작은 별 (장식 / 우상). */}
      <motion.circle
        cx="340"
        cy="60"
        r="2"
        fill="#FFD43B"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="370"
        cy="100"
        r="3"
        fill="#FFD43B"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
    </svg>
  );
}
