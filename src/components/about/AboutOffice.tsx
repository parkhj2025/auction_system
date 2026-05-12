"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

/* cycle 1-G-β-γ-β — /about 섹션 5: Office (인천 사무실 mockup).
 * paradigm: surface-muted bg + asymmetric (좌 col-span-7 카드 + 우 col-span-5 인천 추상 지도).
 * 자체 SVG = 인천 추상 outline + brand-green dot (인천지방법원). */

export function AboutOffice() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--color-surface-muted)] py-20 sm:py-32"
    >
      <div className="container-app mx-auto grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* 좌 카드 (col-span-7). */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
            Office
          </p>
          <h2 className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-[var(--color-ink-900)] sm:text-[64px]">
            인천에서, <span className="text-[var(--brand-green)]">시작</span>합니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </h2>
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <span className="inline-flex items-center rounded-full bg-[var(--color-ink-100)] px-3 py-1 text-xs font-bold text-[var(--color-ink-700)]">
              2026년 상반기 오픈 예정
            </span>
            <p className="mt-5 text-base leading-7 text-[var(--color-ink-700)] sm:text-lg sm:leading-8">
              인천지방법원 인근에 사무소를 준비하고 있습니다.
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
              정확한 주소와 영업 시간은 오픈 시점에 안내드립니다.
            </p>
          </div>
        </motion.div>

        {/* 우 인천 추상 지도 (col-span-5). */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="flex items-center justify-center lg:col-span-5"
        >
          <IncheonMap />
        </motion.div>
      </div>
    </section>
  );
}

/* 자체 SVG — 인천 추상 outline + brand-green dot pulse. */
function IncheonMap() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full max-w-[400px]"
      aria-hidden="true"
    >
      {/* 인천 추상 outline (해안선 + 섬 단순화). */}
      <path
        d="M 80 120 Q 100 80, 160 90 Q 220 70, 270 100 Q 320 120, 330 180 Q 340 240, 310 290 Q 280 330, 220 320 Q 160 330, 110 300 Q 70 270, 70 210 Q 60 160, 80 120 Z"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeDasharray="6 4"
      />

      {/* 작은 섬 1 (좌). */}
      <circle cx="60" cy="200" r="12" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* 작은 섬 2 (하). */}
      <ellipse cx="180" cy="370" rx="20" ry="8" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* 격자 (지도 paradigm). */}
      <line x1="50" y1="200" x2="350" y2="200" stroke="#e2e8f0" strokeWidth="0.5" />
      <line x1="200" y1="50" x2="200" y2="350" stroke="#e2e8f0" strokeWidth="0.5" />

      {/* 인천지방법원 marker (가운데 / brand-green pulse). */}
      <motion.circle
        cx="200"
        cy="200"
        r="20"
        fill="#00C853"
        opacity="0.2"
        animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "200px 200px" }}
      />
      <circle cx="200" cy="200" r="10" fill="#00C853" />
      <circle cx="200" cy="200" r="4" fill="white" />

      {/* 라벨. */}
      <text
        x="200"
        y="240"
        textAnchor="middle"
        fill="#0f172a"
        fontSize="13"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        인천지방법원
      </text>
    </svg>
  );
}
