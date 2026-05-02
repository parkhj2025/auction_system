"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";

/* Phase 1.2 (A-1-2) v4 — Hero (시안 정합 본질).
 * 좌측: 캐치프레이즈 (h1 "빠르고(green) 안전한 / 경매 입찰 대리 서비스") + subtext + 검색 카드 통합 + Hero CTA row.
 * 우측: 3D Shield + Gavel 일러스트 (도시 silhouette ambient + green accent + yellow trail).
 * featured props 본질 = 보존 (다른 cycle에서 활용 가능 / 현재 미사용 — 룰 K-7 본질). */

export function HeroSearch({
  caseNumbers,
}: {
  caseNumbers: string[];
}) {
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
    <section className="bg-[var(--bg-secondary)]">
      <div className="container-app pb-[var(--hero-py-bottom)] pt-[var(--hero-py-top)]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* 좌측 — 캐치프레이즈 + 검색 카드 + CTA row. */}
          <div>
            <h1
              className="text-[32px] font-extrabold leading-[1.25] tracking-[-0.025em] text-[var(--text-primary)] lg:text-[56px]"
              style={{ fontWeight: 800 }}
            >
              <span className="text-[var(--brand-green)]">빠르고</span> 안전한
              <br />
              경매 입찰 대리 서비스
            </h1>

            <p className="mt-5 text-[16px] leading-[1.6] text-[var(--text-secondary)] lg:mt-6 lg:text-[18px]">
              전문가가 대신 입찰하고, 결과로 신뢰를 증명합니다.
            </p>

            {/* 검색 카드 통합 본질 — input border 0 + green button + focus-within ring (영역 3 정수). */}
            <form
              onSubmit={onSubmit}
              role="search"
              aria-label="사건번호 검색"
              className="group/search mt-8 flex h-16 items-center rounded-2xl border border-[var(--border-1)] bg-white shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-200 focus-within:border-[var(--brand-green)] focus-within:shadow-[0_0_0_4px_rgba(0,200,83,0.12),var(--shadow-card)] lg:h-[68px]"
            >
              <label htmlFor="hero-case" className="sr-only">
                사건번호
              </label>
              <input
                id="hero-case"
                type="text"
                inputMode="text"
                autoComplete="off"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="사건번호 입력 (예: 2026타경500459)"
                className="h-full flex-1 bg-transparent pl-5 pr-2 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none lg:pl-6 lg:text-[16px]"
              />
              <button
                type="submit"
                className="mr-1.5 inline-flex h-13 items-center justify-center rounded-[14px] bg-[var(--brand-green)] px-5 text-[14px] font-bold text-white shadow-[var(--shadow-button-green)] transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-14 lg:px-6 lg:text-[15px]"
              >
                분석 자료 보기
              </button>
            </form>

            {/* Hero CTA row — 좌 추천 + 우 green pulse dot. */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/analysis"
                className="text-[14px] font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:text-[var(--brand-green-deep)]"
              >
                이번 주 추천 물건 →
              </Link>
              <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--text-secondary)]">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[var(--brand-green)] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-green)]" />
                </span>
                사고율 0%
              </span>
            </div>
          </div>

          {/* 우측 — 3D Shield + Gavel 일러스트 (시안 정합 / Q2 결정). */}
          <div className="relative hidden aspect-square w-full max-w-[480px] justify-self-end lg:block">
            <ShieldGavelIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 3D Shield + Gavel isometric SVG 일러스트.
 * inline SVG path + transform skew (Three.js·webgl·외부 라이브러리 신규 0 / 룰 K-9 정합).
 * layer 본질: 그림자 ellipse / 도시 silhouette ambient / Shield (green gradient + 체크) / Gavel (charcoal). */
function ShieldGavelIllustration() {
  return (
    <svg
      viewBox="0 0 480 480"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="shield-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00E66B" />
          <stop offset="50%" stopColor="#00C853" />
          <stop offset="100%" stopColor="#00A040" />
        </linearGradient>
        <linearGradient id="shield-side" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#009640" />
          <stop offset="100%" stopColor="#007A33" />
        </linearGradient>
        <linearGradient id="gavel-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A2F36" />
          <stop offset="100%" stopColor="#111418" />
        </linearGradient>
        <radialGradient id="ambient-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,200,83,0.18)" />
          <stop offset="100%" stopColor="rgba(0,200,83,0)" />
        </radialGradient>
      </defs>

      {/* ambient green glow 배경. */}
      <circle cx="240" cy="240" r="200" fill="url(#ambient-glow)" />

      {/* 도시 silhouette (하단 ambient). */}
      <g opacity="0.12">
        <rect x="60" y="320" width="40" height="80" fill="#111418" />
        <rect x="105" y="290" width="48" height="110" fill="#111418" />
        <rect x="158" y="310" width="36" height="90" fill="#111418" />
        <rect x="200" y="280" width="44" height="120" fill="#111418" />
        <rect x="290" y="300" width="42" height="100" fill="#111418" />
        <rect x="338" y="320" width="38" height="80" fill="#111418" />
        <rect x="380" y="285" width="44" height="115" fill="#111418" />
      </g>

      {/* Shield 그림자 ellipse. */}
      <ellipse
        cx="200"
        cy="395"
        rx="100"
        ry="14"
        fill="rgba(17,20,24,0.18)"
      />

      {/* Shield 본질 (메인 face). */}
      <path
        d="M200 60 L120 90 L120 230 Q120 320 200 380 Q280 320 280 230 L280 90 Z"
        fill="url(#shield-grad)"
      />
      {/* Shield 우측면 (입체 본질). */}
      <path
        d="M200 60 L280 90 L280 230 Q280 320 200 380 L200 60 Z"
        fill="url(#shield-side)"
        opacity="0.7"
      />
      {/* Shield 체크마크. */}
      <path
        d="M160 215 L195 250 L250 175"
        stroke="white"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Gavel — 우상단 isometric. */}
      <g transform="translate(280 100) rotate(35)">
        {/* Gavel handle. */}
        <rect x="-8" y="0" width="16" height="160" rx="4" fill="#2A2F36" />
        {/* Gavel head. */}
        <rect
          x="-44"
          y="-20"
          width="88"
          height="44"
          rx="6"
          fill="url(#gavel-head)"
        />
        {/* Gavel head highlight. */}
        <rect
          x="-40"
          y="-16"
          width="80"
          height="6"
          rx="3"
          fill="rgba(255,255,255,0.18)"
        />
        {/* Gavel head 좌측면 (입체 본질). */}
        <path
          d="M-44 -20 L-50 -10 L-50 30 L-44 24 Z"
          fill="#0A0D11"
          opacity="0.5"
        />
      </g>

      {/* yellow motion trail (우측 후방 — 시안 정합). */}
      <g opacity="0.85">
        <path
          d="M380 140 L430 130"
          stroke="#FFD400"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M385 165 L440 155"
          stroke="#FFD400"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M380 190 L425 180"
          stroke="#FFD400"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.45"
        />
      </g>
    </svg>
  );
}
