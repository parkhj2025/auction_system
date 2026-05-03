"use client";

import { useEffect, useState, type CSSProperties } from "react";

/* Phase 1.2 (A-1-2) v9 — useScrollReveal hook (IntersectionObserver native + callback ref).
 * paradigm: callback ref (setElement) — react-hooks/refs lint 정합.
 * 4 영역 광역 사용 (Features / Insight / Pricing / Trust).
 * threshold 0.15 / rootMargin 50px / once: true / delay 영역 inline transition-delay.
 * IO 미지원 영역 fallback = .scroll-reveal CSS 영역 prefers-reduced-motion 영역 영역 정합 (광역 0%+ browser IO 지원). */

export type ScrollRevealOptions = {
  delay?: number;        /* ms */
  threshold?: number;    /* 0~1 (default 0.15) */
  rootMargin?: string;   /* default "50px" */
};

export type ScrollRevealReturn<T extends HTMLElement> = {
  ref: (node: T | null) => void;
  className: string;
  style: CSSProperties | undefined;
};

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): ScrollRevealReturn<T> {
  const { delay = 0, threshold = 0.15, rootMargin = "50px" } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<T | null>(null);

  useEffect(() => {
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, threshold, rootMargin]);

  const className = isVisible ? "scroll-reveal is-visible" : "scroll-reveal";
  const style: CSSProperties | undefined =
    delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return { ref: setElement, className, style };
}
