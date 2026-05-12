"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Building2, FileText, Lock } from "lucide-react";

/* cycle 1-G-γ-α-β — HomeHero 사전 HeroSearch paradigm 전체 회복 (commit 2d2601e 기준).
 * - 모바일 + 데스크탑 풀스크린 (min-h dvh paradigm 회복)
 * - vstack 가운데 정렬 + Liquid Glass 박스 + form 통합 회복
 * - chip 2건 + Lock caption + 데스크탑 강점 3건 광역 회복
 * - 백그라운드 단독 변경 = video hero-bg.mp4 영구 폐기 → 자체 SVG 일러스트 (continuous loop)
 * - h1 + subtitle textShadow paradigm 회복 (가독성 + glow). */

export function HomeHero({ caseNumbers }: { caseNumbers: string[] }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const normalizedCases = useMemo(
    () => new Set(caseNumbers.map((c) => c.normalize("NFC"))),
    [caseNumbers]
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const normalized = trimmed.normalize("NFC");
    if (normalizedCases.has(normalized)) {
      router.push(`/analysis/${encodeURIComponent(normalized)}`);
    } else {
      router.push(`/apply?case=${encodeURIComponent(normalized)}`);
    }
  }

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center overflow-hidden bg-[#111418] px-6 lg:min-h-[calc(100dvh-80px)]">
      {/* 백그라운드 SVG 일러스트 (continuous loop / video 영구 폐기 사후 신규). */}
      <HeroFlowBackground />

      {/* vstack — h1 + 모바일 subtext + 모바일 chip + 박스. */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 lg:gap-14 w-full max-w-[800px]">
        {/* h1 (모바일 44px / 데스크탑 88px). */}
        <h1
          className="w-full text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-white [text-wrap:balance] lg:text-[88px]"
          style={{
            fontWeight: 800,
            textShadow:
              "0 4px 24px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)",
          }}
        >
          법원에 가지 않고,<br />
          <span
            style={{
              color: "#FFD43B",
              textShadow:
                "0 0 32px rgba(255, 212, 59, 0.7), 0 0 64px rgba(255, 212, 59, 0.5), 0 4px 16px rgba(0, 0, 0, 0.5)",
            }}
          >
            경매를 시작하세요.
          </span>
        </h1>

        {/* subtext 모바일 박스 밖 (17px). */}
        <p
          className="lg:hidden text-[17px] text-white/90 font-medium leading-[1.6] text-center"
          style={{
            textShadow:
              "0 2px 12px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          사건번호만 주시면, 법원은 저희가 갑니다.
        </p>

        {/* 모바일 chip 2건 (외부 gap-7 / 아이콘 18 / 라벨 14px). */}
        <div className="lg:hidden flex items-center justify-center gap-7">
          <div className="flex items-center gap-2">
            <Building2
              strokeWidth={2.2}
              className="w-[18px] h-[18px] flex-shrink-0 text-green-400"
            />
            <span
              className="text-[14px] text-white/95 font-semibold whitespace-nowrap"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              법원 방문 없음
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText
              strokeWidth={2.2}
              className="w-[18px] h-[18px] flex-shrink-0 text-green-400"
            />
            <span
              className="text-[14px] text-white/95 font-semibold whitespace-nowrap"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              서류 비대면
            </span>
          </div>
        </div>

        {/* Apple Liquid Glass 박스 (회복). */}
        <div
          className="flex flex-col gap-5 lg:gap-8 w-full items-center rounded-[28px] px-6 py-7 lg:px-10 lg:py-8"
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
          {/* subtext 데스크탑 박스 안 (24px). */}
          <p
            className="hidden lg:block text-center text-[24px] font-medium leading-[1.6] text-white/90"
            style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)" }}
          >
            사건번호만 주시면, 법원은 저희가 갑니다.
          </p>

          {/* 모바일 form (vertical / input h-16 + CTA h-16). */}
          <form
            onSubmit={onSubmit}
            role="search"
            aria-label="사건번호 검색"
            className="lg:hidden flex flex-col gap-3 w-full"
          >
            <label htmlFor="hero-case-mobile" className="sr-only">
              사건번호
            </label>
            <p className="text-[15px] text-white/85 font-medium text-center">
              사건번호로 시작해보세요
            </p>
            <input
              id="hero-case-mobile"
              type="text"
              inputMode="text"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="사건번호 입력 (예: 2026타경500459)"
              className="w-full h-16 rounded-2xl bg-white px-5 text-[16px] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] outline-none shadow-md"
            />
            <button
              type="submit"
              className="w-full h-16 rounded-2xl bg-[var(--brand-green)] inline-flex items-center justify-center text-[16px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2"
            >
              조회하기
            </button>
          </form>

          {/* 데스크탑 form (horizontal 통합 / max-w 600). */}
          <form
            onSubmit={onSubmit}
            role="search"
            aria-label="사건번호 검색"
            className="hidden lg:flex w-full max-w-[600px] items-center rounded-2xl bg-white p-1.5 shadow-md transition-shadow duration-200 focus-within:shadow-lg"
          >
            <label htmlFor="hero-case-desktop" className="sr-only">
              사건번호
            </label>
            <input
              id="hero-case-desktop"
              type="text"
              inputMode="text"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="사건번호 입력 (예: 2026타경500459)"
              className="h-16 flex-1 bg-transparent px-6 text-[18px] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-16 items-center justify-center rounded-xl bg-[var(--brand-green)] px-12 text-[18px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2"
            >
              조회하기
            </button>
          </form>

          {/* 모바일 보증금 caption (form 사후 / 박스 안). */}
          <div className="lg:hidden flex items-center justify-center gap-2 mt-1">
            <Lock
              strokeWidth={2.2}
              className="w-4 h-4 flex-shrink-0 text-green-400"
            />
            <span className="text-[14px] text-white/80 font-medium whitespace-nowrap">
              보증금 전용계좌로 분리 보관
            </span>
          </div>

          {/* 데스크탑 강점 3건 가로 1행. */}
          <div className="hidden lg:flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Building2
                strokeWidth={2}
                className="h-5 w-5 flex-shrink-0 text-green-400"
              />
              <span className="whitespace-nowrap text-[15px] font-semibold text-white/95">
                법원 방문 없음
              </span>
            </div>
            <div className="h-5 w-px flex-shrink-0 bg-white/30" />
            <div className="flex items-center gap-2">
              <FileText
                strokeWidth={2}
                className="h-5 w-5 flex-shrink-0 text-green-400"
              />
              <span className="whitespace-nowrap text-[15px] font-semibold text-white/95">
                서류 비대면
              </span>
            </div>
            <div className="h-5 w-px flex-shrink-0 bg-white/30" />
            <div className="flex items-center gap-2">
              <Lock
                strokeWidth={2}
                className="h-5 w-5 flex-shrink-0 text-green-400"
              />
              <span className="whitespace-nowrap text-[15px] font-semibold text-white/95">
                보증금 전용계좌
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 자체 SVG 백그라운드 일러스트 (continuous loop / video 영구 폐기 사후 신규).
 * paradigm: 법원 building skyline 추상 + 망치 + 사건 흐름 line + floating dot 광역.
 * 색 = charcoal bg + brand-green stroke + yellow accent + white opacity 변주.
 * opacity = 0.3 (textShadow 동시 가독성 회수). */
function HeroFlowBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="hero-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111418" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#111418" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#111418" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00C853" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 광역 광채 (가운데 brand-green glow). */}
        <motion.circle
          cx="800"
          cy="450"
          r="500"
          fill="url(#hero-glow)"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "800px 450px" }}
        />

        {/* 법원 building skyline 추상 (하단). */}
        <g opacity="0.35">
          <rect x="120" y="640" width="80" height="160" fill="none" stroke="#00C853" strokeWidth="1.5" />
          <rect x="220" y="580" width="100" height="220" fill="none" stroke="#00C853" strokeWidth="1.5" />
          <rect x="340" y="620" width="70" height="180" fill="none" stroke="#00C853" strokeWidth="1.5" />
          {/* 가운데 = 법원 (큰 paradigm). */}
          <g>
            <rect x="700" y="500" width="200" height="300" fill="none" stroke="#00C853" strokeWidth="2" />
            {/* 기둥 6개. */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={i}
                x1={720 + i * 32}
                y1="560"
                x2={720 + i * 32}
                y2="780"
                stroke="#00C853"
                strokeWidth="1.5"
              />
            ))}
            {/* 지붕 삼각. */}
            <path
              d="M 690 500 L 800 440 L 910 500 Z"
              fill="none"
              stroke="#00C853"
              strokeWidth="2"
            />
            {/* yellow dot accent. */}
            <circle cx="800" cy="470" r="6" fill="#FFD43B" />
          </g>
          <rect x="1000" y="600" width="90" height="200" fill="none" stroke="#00C853" strokeWidth="1.5" />
          <rect x="1110" y="640" width="80" height="160" fill="none" stroke="#00C853" strokeWidth="1.5" />
          <rect x="1210" y="580" width="100" height="220" fill="none" stroke="#00C853" strokeWidth="1.5" />
          <rect x="1330" y="620" width="70" height="180" fill="none" stroke="#00C853" strokeWidth="1.5" />
        </g>

        {/* 흐름 line (좌→우 dashed / opacity 약화). */}
        <motion.line
          x1="100"
          y1="180"
          x2="1500"
          y2="180"
          stroke="#00C853"
          strokeWidth="1"
          strokeDasharray="8 12"
          opacity="0.35"
          animate={{ strokeDashoffset: [-20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.line
          x1="100"
          y1="720"
          x2="1500"
          y2="720"
          stroke="#00C853"
          strokeWidth="1"
          strokeDasharray="8 12"
          opacity="0.35"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* 망치 (gavel) 우상단 추상. */}
        <motion.g
          opacity="0.4"
          animate={{ rotate: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          style={{ transformOrigin: "1380px 220px" }}
        >
          <rect x="1320" y="160" width="120" height="40" rx="6" fill="none" stroke="#00C853" strokeWidth="2" />
          <rect x="1370" y="200" width="20" height="80" rx="3" fill="none" stroke="#00C853" strokeWidth="2" />
          <circle cx="1380" cy="180" r="5" fill="#FFD43B" />
        </motion.g>

        {/* 사건번호 input 추상 좌상단. */}
        <g opacity="0.4">
          <rect x="160" y="160" width="260" height="56" rx="14" fill="none" stroke="#00C853" strokeWidth="2" />
          <motion.rect
            x="180"
            y="180"
            width="120"
            height="6"
            rx="3"
            fill="#FFD43B"
            animate={{ width: [120, 180, 120] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x="180" y="196" width="80" height="3" rx="1.5" fill="#00C853" opacity="0.6" />
        </g>

        {/* floating dot 광역 (5건 / 각 다른 cycle). */}
        {[
          { cx: 280, cy: 380, r: 3, delay: 0 },
          { cx: 520, cy: 280, r: 4, delay: 0.4 },
          { cx: 1120, cy: 340, r: 3, delay: 0.8 },
          { cx: 1280, cy: 480, r: 5, delay: 1.2 },
          { cx: 460, cy: 540, r: 3, delay: 1.6 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="#FFD43B"
            opacity="0.5"
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot.delay,
            }}
            style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
          />
        ))}

        {/* 광역 fade overlay (가독성 회복 paradigm). */}
        <rect width="1600" height="900" fill="url(#hero-fade)" />
      </svg>
    </div>
  );
}
