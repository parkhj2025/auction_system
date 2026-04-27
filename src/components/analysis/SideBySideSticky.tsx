"use client";

/**
 * 단계 5-4-2: scrollytelling Side-by-Side Sticky 공통 wrapper (Layout Pattern 1).
 *
 * 좌측 narrative steps + 우측 sticky graphic.
 * 좌측 step scroll position 에 따라 active step 인덱스 props 으로 전달 — 우측 graphic 이 active step 별 다른 state 표시.
 *
 * 모바일 (< md): stack fallback. 우측 graphic 이 좌측 step 위 또는 아래 inline 으로 노출 + sticky 비활성.
 *
 * case study 인용:
 *  - scrollytelling 스킬 Layout Pattern 1 (Most Common) — "graphic becomes 'stuck' while narrative text scrolls alongside"
 *  - Apple "Split-Column 80% 비중"
 */
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface Step {
  id: string;
  /** 좌측 narrative 텍스트 본문 (string 또는 ReactNode) */
  body: ReactNode;
}

interface SideBySideStickyProps {
  steps: Step[];
  /** 우측 sticky graphic 렌더 — activeIdx 받아 그 state 표시 */
  graphic: (activeIdx: number) => ReactNode;
  /** 모바일에서 graphic 노출 위치: 'top' (steps 위) | 'bottom' (steps 아래). default 'top'. */
  mobileGraphicPosition?: "top" | "bottom";
}

export function SideBySideSticky({
  steps,
  graphic,
  mobileGraphicPosition = "top",
}: SideBySideStickyProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // IntersectionObserver — 좌측 step 의 active 감지
  useEffect(() => {
    const observers = stepRefs.current.map((el, idx) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(idx);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      return obs;
    });
    return () => {
      for (const obs of observers) obs?.disconnect();
    };
  }, [steps.length]);

  return (
    <div className="mt-6">
      {/* 모바일: stack — graphic top 또는 bottom */}
      <div className="md:hidden">
        {mobileGraphicPosition === "top" ? (
          <div className="mb-6">{graphic(activeIdx)}</div>
        ) : null}
        <ol className="space-y-8">
          {steps.map((s, idx) => (
            <li
              key={s.id}
              ref={(el) => {
                stepRefs.current[idx] = el;
              }}
            >
              <StepBody idx={idx} active={activeIdx === idx}>
                {s.body}
              </StepBody>
            </li>
          ))}
        </ol>
        {mobileGraphicPosition === "bottom" ? (
          <div className="mt-6">{graphic(activeIdx)}</div>
        ) : null}
      </div>

      {/* md+: Side-by-Side Sticky */}
      <div className="hidden gap-8 md:grid md:grid-cols-[40%_60%]">
        <ol className="space-y-24">
          {steps.map((s, idx) => (
            <li
              key={s.id}
              ref={(el) => {
                stepRefs.current[idx] = el;
              }}
              className="min-h-[40vh]"
            >
              <StepBody idx={idx} active={activeIdx === idx}>
                {s.body}
              </StepBody>
            </li>
          ))}
        </ol>
        <div className="relative">
          <div className="sticky top-24">{graphic(activeIdx)}</div>
        </div>
      </div>
    </div>
  );
}

function StepBody({
  idx,
  active,
  children,
}: {
  idx: number;
  active: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // 룰 1 (단계 5-4-2-fix-3): once: false — 위·아래 스크롤 시 step 진입 재실행
  const inView = useInView(ref, { once: false, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-50"
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
        Step {String(idx + 1).padStart(2, "0")}
      </span>
      <div className="mt-2 text-[var(--color-ink-700)]">{children}</div>
    </motion.div>
  );
}
