"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { motion } from "motion/react";

/* cycle 1-G-γ-α — 메인 섹션 1: Hero.
 * paradigm: charcoal 풀스크린 + asymmetric (좌 col-span-7 카피·폼 + 우 col-span-5 SVG).
 * 사건번호 폼 = 메인 사전 HeroSearch paradigm 차용 (charcoal bg 안 단단함).
 * 우 자체 SVG = /service Hero SVG 영구 보존 차용 (사건번호 input → 5 dot → 망치). */

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
    <section className="relative w-full overflow-hidden bg-[#111418] py-16 sm:py-20 lg:min-h-[90vh] lg:py-28">
      {/* 모바일 SVG = absolute bg + opacity 약화 paradigm (lg:hidden / 카피·폼 위 z-index 앞). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.18] lg:hidden"
      >
        <ServiceFlow />
      </div>

      <div className="container-app relative z-10 mx-auto grid h-full w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* 좌 영역 (카피 + 사건번호 폼). */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <h1 className="text-[44px] font-black leading-[1.1] tracking-[-0.015em] text-white sm:text-[88px]">
            법원에 가지 않고,
            <br />
            <span style={{ color: "#FFD43B" }}>경매를 시작하세요.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--color-ink-300)] sm:text-lg sm:leading-8">
            사건번호만 주시면, 법원은 저희가 갑니다.
          </p>

          {/* 사건번호 폼 카드 (charcoal bg 안 white/5 paradigm). */}
          <form
            onSubmit={onSubmit}
            role="search"
            aria-label="사건번호 검색"
            className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm sm:p-8"
          >
            <label htmlFor="hero-case" className="text-sm font-semibold text-white">
              사건번호로 시작해보세요
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <input
                id="hero-case"
                type="text"
                inputMode="text"
                autoComplete="off"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="예: 2026타경500459"
                className="h-14 flex-1 rounded-xl bg-white px-5 text-base text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] outline-none focus:ring-2 focus:ring-[var(--brand-green)]/40"
              />
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-[var(--brand-green)] px-6 text-base font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418]"
              >
                조회하기
              </button>
            </div>
          </form>
        </motion.div>

        {/* 우 자체 SVG (데스크탑 단독 / 모바일 = absolute bg paradigm 광역 분기). */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="hidden items-center justify-center lg:col-span-5 lg:flex"
        >
          <ServiceFlow />
        </motion.div>
      </div>
    </section>
  );
}

/* 자체 SVG — /service Hero SVG 영구 보존 차용. */
function ServiceFlow() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full max-w-[420px]"
      aria-hidden="true"
    >
      {/* 사건번호 input 추상. */}
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

      {/* 화살표. */}
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

      {/* 5 step dot (vertical). */}
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

      {/* 망치 (gavel) 추상. */}
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
          <circle cx="200" cy="306" r="4" fill="#FFD43B" />
        </motion.g>
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

      {/* 별 (yellow 깜빡). */}
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
