"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { BRAND_NAME } from "@/lib/constants";

/* cycle 1-G-β-γ-β — /about 섹션 4: About 경매퀵.
 * paradigm: charcoal bg + asymmetric (좌 col-span-7 카피 + 우 col-span-5 phone mockup).
 * 자체 SVG phone mockup (charcoal frame + brand-green accent) + floating motion. */

export function AboutCompany() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="bg-[#111418] py-20 sm:py-32"
    >
      <div className="container-app mx-auto grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* 좌 카피 영역 (col-span-7). */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
            About
          </p>
          <h2 className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-white sm:text-[64px]">
            경매를 <span className="text-[var(--brand-green)]">다시</span> 정의합니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </h2>
          <div className="mt-8 space-y-5">
            <p className="text-base leading-8 text-[var(--color-ink-300)] sm:text-lg sm:leading-9">
              경매는 시간과 거리가 모두 부담이었습니다.
            </p>
            <p className="text-base leading-8 text-[var(--color-ink-300)] sm:text-lg sm:leading-9">
              법원까지의 거리, 입찰 당일의 휴가, 결과를 기다리는 시간.
            </p>
            <p className="text-base leading-8 text-[var(--color-ink-300)] sm:text-lg sm:leading-9">
              우리는 그 모든 거품을 걷어내고, 투자자가 경매 자체에 집중할 수
              있도록 돕습니다.
            </p>
          </div>
        </motion.div>

        {/* 우 phone mockup (col-span-5). */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="flex items-center justify-center lg:col-span-5"
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}

/* 자체 SVG phone mockup — /apply 화면 추상 paradigm + floating animation. */
function PhoneMockup() {
  return (
    <motion.svg
      viewBox="0 0 280 560"
      className="h-full w-full max-w-[280px]"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      aria-label={`${BRAND_NAME} 신청 화면 mockup`}
    >
      {/* phone frame (charcoal outline + brand-green accent). */}
      <rect
        x="10"
        y="10"
        width="260"
        height="540"
        rx="32"
        fill="#1a1d22"
        stroke="#00C853"
        strokeWidth="1.5"
      />
      <rect
        x="20"
        y="20"
        width="240"
        height="520"
        rx="24"
        fill="#0b0d10"
      />

      {/* status bar. */}
      <rect x="105" y="32" width="70" height="8" rx="4" fill="#1a1d22" />

      {/* progress indicator (step bar). */}
      <rect x="40" y="68" width="200" height="3" rx="2" fill="#1a1d22" />
      <rect x="40" y="68" width="120" height="3" rx="2" fill="#00C853" />
      <text
        x="40"
        y="92"
        fill="#00C853"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.5"
      >
        STEP 3 / 6
      </text>
      <text
        x="40"
        y="108"
        fill="white"
        fontSize="13"
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
      >
        서류 업로드
      </text>

      {/* form card 1. */}
      <rect
        x="32"
        y="130"
        width="216"
        height="80"
        rx="14"
        fill="#1a1d22"
        stroke="#2a2d33"
      />
      <rect x="48" y="148" width="50" height="6" rx="3" fill="#3a3d43" />
      <rect x="48" y="166" width="180" height="3" rx="1.5" fill="#2a2d33" />
      <rect x="48" y="180" width="120" height="3" rx="1.5" fill="#2a2d33" />

      {/* form card 2 (active). */}
      <rect
        x="32"
        y="226"
        width="216"
        height="80"
        rx="14"
        fill="#1a1d22"
        stroke="#00C853"
        strokeWidth="1.5"
      />
      <rect x="48" y="244" width="60" height="6" rx="3" fill="#00C853" />
      <rect x="48" y="262" width="180" height="3" rx="1.5" fill="#3a3d43" />
      <rect x="48" y="276" width="100" height="3" rx="1.5" fill="#3a3d43" />
      <circle cx="232" cy="266" r="6" fill="#00C853" />

      {/* form card 3. */}
      <rect
        x="32"
        y="322"
        width="216"
        height="80"
        rx="14"
        fill="#1a1d22"
        stroke="#2a2d33"
      />
      <rect x="48" y="340" width="50" height="6" rx="3" fill="#3a3d43" />
      <rect x="48" y="358" width="180" height="3" rx="1.5" fill="#2a2d33" />
      <rect x="48" y="372" width="80" height="3" rx="1.5" fill="#2a2d33" />

      {/* CTA button. */}
      <rect
        x="32"
        y="468"
        width="216"
        height="48"
        rx="12"
        fill="#00C853"
      />
      <rect x="105" y="486" width="70" height="10" rx="5" fill="white" />
    </motion.svg>
  );
}
