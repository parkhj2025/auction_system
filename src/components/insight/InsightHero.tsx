"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { INSIGHT_SLIDES, type InsightSlideCta } from "@/lib/insightMock";
import { ArrowRightIcon } from "@/components/insight/icons";

/* work-012 정정 2 — /insight Hero 자동 슬라이드 banner.
 * 정정 영역 1: 박스화 (Liquid Glass) + 가운데 정렬 + max-w-7xl (page 전체 width NG).
 * 보존: 3 슬라이드 / 카피 SoT / sub 카피 0 / motion + setInterval 5초 / dot indicator 3개.
 * carousel 라이브러리 미사용 / 아이콘 라이브러리 미사용 (inline SVG). */

const AUTO_MS = 5000;

/* Liquid Glass 박스 paradigm (사전 메인 Hero + TrustCTA 일관). */
const GLASS_DARK = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05))",
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.25), 0 32px 80px -16px rgba(0,0,0,0.35)",
};
const GLASS_LIGHT = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.30))",
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.6)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.7), 0 32px 80px -16px rgba(0,0,0,0.18)",
};

/* 슬라이드별 placeholder 일러스트 (단순 도형 / 박스 안 가운데). */
function SlideDecoration({ slideId, color }: { slideId: number; color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true" fill="none">
      {slideId === 1 && (
        <>
          <rect x="46" y="42" width="92" height="118" rx="8" stroke={color} strokeWidth="6" />
          <line x1="64" y1="72" x2="120" y2="72" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <line x1="64" y1="96" x2="120" y2="96" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <line x1="64" y1="120" x2="100" y2="120" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <circle cx="146" cy="150" r="22" fill={color} opacity="0.22" />
        </>
      )}
      {slideId === 2 && (
        <>
          <circle cx="100" cy="100" r="58" stroke={color} strokeWidth="6" />
          <path d="M82 100l13 13 26-30" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="28" y="30" width="24" height="24" rx="6" fill={color} opacity="0.22" />
          <rect x="150" y="148" width="30" height="30" rx="7" fill={color} opacity="0.22" />
        </>
      )}
      {slideId === 3 && (
        <>
          <circle cx="88" cy="88" r="42" stroke={color} strokeWidth="6" />
          <line x1="118" y1="118" x2="160" y2="160" stroke={color} strokeWidth="9" strokeLinecap="round" />
          <line x1="70" y1="88" x2="106" y2="88" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <line x1="88" y1="70" x2="88" y2="106" stroke={color} strokeWidth="6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function InsightHero({ onCta }: { onCta: (cta: InsightSlideCta) => void }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = INSIGHT_SLIDES.length;

  const go = useCallback(
    (next: number) => setIndex(((next % len) + len) % len),
    [len]
  );

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % len), AUTO_MS);
    return () => clearInterval(t);
  }, [paused, reduced, len]);

  const touchStartX = useRef<number | null>(null);

  const slide = INSIGHT_SLIDES[index];
  const isDark = slide.tone === "dark";
  const textColor = isDark ? "#FFFFFF" : "#111418";
  const decoColor = isDark ? "#FFFFFF" : "#00C853";
  const ctaBg = isDark ? "#FFFFFF" : "var(--brand-green)";
  const ctaText = isDark ? "#111418" : "#FFFFFF";

  return (
    <section
      aria-label="경매 인사이트 주요 안내"
      aria-roledescription="carousel"
      className="overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: slide.bg }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (dx > 48) go(index - 1);
        else if (dx < -48) go(index + 1);
        touchStartX.current = null;
      }}
    >
      <h1 className="sr-only">경매 인사이트</h1>

      <div className="mx-auto w-full max-w-7xl px-5 py-8 lg:py-12">
        {/* Liquid Glass 박스 (page 전체 width NG / 좌우 margin). */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={isDark ? GLASS_DARK : GLASS_LIGHT}
            className="flex min-h-[260px] flex-col items-center justify-center gap-5 rounded-[28px] px-6 py-7 text-center lg:min-h-[300px] lg:gap-6 lg:px-10 lg:py-8"
          >
            <div
              aria-hidden="true"
              className="h-[88px] w-[88px] shrink-0 lg:h-[112px] lg:w-[112px]"
            >
              <SlideDecoration slideId={slide.id} color={decoColor} />
            </div>

            <p
              className="max-w-2xl text-[26px] font-extrabold leading-[1.25] tracking-[-0.015em] [text-wrap:balance] lg:text-[40px]"
              style={{ color: textColor }}
            >
              {slide.copy}
            </p>

            <button
              type="button"
              onClick={() => onCta(slide.cta)}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 lg:text-[16px]"
              style={{
                backgroundColor: ctaBg,
                color: ctaText,
                ["--tw-ring-offset-color" as string]: slide.bg,
                ["--tw-ring-color" as string]: isDark ? "#FFFFFF" : "#00C853",
              }}
            >
              {slide.ctaLabel}
              <ArrowRightIcon size={18} />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* dot indicator 하단 3개 + 현재 슬라이드 강조. */}
        <div className="mt-5 flex justify-center gap-2.5">
          {INSIGHT_SLIDES.map((s, i) => {
            const isActive = i === index;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`${i + 1}번 슬라이드로 이동`}
                aria-current={isActive ? "true" : undefined}
                className="h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  width: isActive ? 28 : 10,
                  backgroundColor: isActive
                    ? textColor
                    : isDark
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(17,20,24,0.25)",
                  ["--tw-ring-offset-color" as string]: slide.bg,
                  ["--tw-ring-color" as string]: textColor,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
