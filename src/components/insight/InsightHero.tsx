"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { INSIGHT_SLIDES, type InsightSlideCta } from "@/lib/insightMock";

/* work-012 — /insight Hero 자동 슬라이드 banner (정정 영역 1).
 * 3 슬라이드 / sub 카피 0 / motion + setInterval 단독 (carousel 라이브러리 미사용).
 * 자동 전환 5초 default / hover·focus 시 일시정지 / dot indicator 하단 3개. */

const AUTO_MS = 5000;

const THEME: Record<
  string,
  { bg: string; text: string; ctaBg: string; ctaText: string; deco: string }
> = {
  charcoal: {
    bg: "#111418",
    text: "#FFFFFF",
    ctaBg: "var(--brand-green)",
    ctaText: "#FFFFFF",
    deco: "#00C853",
  },
  green: {
    bg: "var(--brand-green)",
    text: "#FFFFFF",
    ctaBg: "#FFFFFF",
    ctaText: "#111418",
    deco: "#FFFFFF",
  },
  surface: {
    bg: "var(--color-surface-muted)",
    text: "#111418",
    ctaBg: "var(--brand-green)",
    ctaText: "#FFFFFF",
    deco: "#00C853",
  },
};

/* 슬라이드별 placeholder 일러스트 (단순 도형 / 사후 Gemini PNG 교체 paradigm). */
function SlideDecoration({ slideId, color }: { slideId: number; color: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full"
      aria-hidden="true"
      fill="none"
    >
      {slideId === 1 && (
        <>
          <rect x="34" y="50" width="92" height="118" rx="8" stroke={color} strokeWidth="6" />
          <line x1="52" y1="78" x2="108" y2="78" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <line x1="52" y1="100" x2="108" y2="100" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <line x1="52" y1="122" x2="88" y2="122" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <circle cx="140" cy="62" r="30" fill={color} opacity="0.18" />
        </>
      )}
      {slideId === 2 && (
        <>
          <circle cx="100" cy="100" r="58" stroke={color} strokeWidth="6" />
          <path d="M84 100l12 12 24-28" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="30" y="30" width="26" height="26" rx="6" fill={color} opacity="0.2" />
          <rect x="148" y="146" width="34" height="34" rx="8" fill={color} opacity="0.2" />
        </>
      )}
      {slideId === 3 && (
        <>
          <circle cx="84" cy="84" r="40" stroke={color} strokeWidth="6" />
          <line x1="112" y1="112" x2="156" y2="156" stroke={color} strokeWidth="8" strokeLinecap="round" />
          <line x1="68" y1="84" x2="100" y2="84" stroke={color} strokeWidth="6" strokeLinecap="round" />
          <line x1="84" y1="68" x2="84" y2="100" stroke={color} strokeWidth="6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function InsightHero({
  onCta,
}: {
  onCta: (cta: InsightSlideCta) => void;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = INSIGHT_SLIDES.length;

  const go = useCallback((next: number) => setIndex(((next % len) + len) % len), [len]);

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % len), AUTO_MS);
    return () => clearInterval(t);
  }, [paused, reduced, len]);

  const touchStartX = useRef<number | null>(null);

  const slide = INSIGHT_SLIDES[index];
  const theme = THEME[slide.theme];

  return (
    <section
      aria-label="경매 인사이트 주요 안내"
      aria-roledescription="carousel"
      className="relative overflow-hidden"
      style={{ backgroundColor: theme.bg }}
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

      <div className="container-app w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[280px] flex-col items-start justify-center gap-6 py-14 lg:min-h-[360px] lg:flex-row lg:items-center lg:justify-between lg:py-20"
          >
            <div className="max-w-xl">
              <p
                className="text-[28px] font-extrabold leading-[1.25] tracking-[-0.015em] [text-wrap:balance] lg:text-[44px]"
                style={{ color: theme.text }}
              >
                {slide.copy}
              </p>
              <button
                type="button"
                onClick={() => onCta(slide.cta)}
                className="mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 lg:text-[16px]"
                style={{
                  backgroundColor: theme.ctaBg,
                  color: theme.ctaText,
                  // ring offset 색 = 현재 슬라이드 bg 정합
                  ["--tw-ring-offset-color" as string]: theme.bg,
                }}
              >
                {slide.ctaLabel}
                <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>

            <div
              aria-hidden="true"
              className="h-[120px] w-[120px] shrink-0 lg:h-[200px] lg:w-[200px]"
            >
              <SlideDecoration slideId={slide.id} color={theme.deco} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* dot indicator 하단 3개 + 현재 슬라이드 강조. */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2.5 lg:bottom-7">
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
                  ? theme.text
                  : slide.theme === "surface"
                    ? "rgba(17,20,24,0.25)"
                    : "rgba(255,255,255,0.4)",
                ["--tw-ring-offset-color" as string]: theme.bg,
                ["--tw-ring-color" as string]: theme.text,
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
