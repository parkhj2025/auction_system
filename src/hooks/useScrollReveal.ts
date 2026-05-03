"use client";

import { useEffect, useState, type CSSProperties } from "react";

/* Phase 1.2 (A-1-2) v11 — useScrollReveal hook (양방향 발화 / once: false 광역).
 * 정정: amount 0.1 (즉시 발화) + once default false (위↓아래↑ scroll 매번 발화).
 * 4 섹션 적용 (Features / Insight / Pricing / Trust). */

export type ScrollRevealOptions = {
  delay?: number;        /* ms */
  threshold?: number;    /* 0~1 (default 0.1) */
  rootMargin?: string;   /* default "50px" */
  once?: boolean;        /* default false (양방향 발화) */
};

export type ScrollRevealReturn<T extends HTMLElement> = {
  ref: (node: T | null) => void;
  className: string;
  style: CSSProperties | undefined;
};

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): ScrollRevealReturn<T> {
  const {
    delay = 0,
    threshold = 0.1,
    rootMargin = "50px",
    once = false,
  } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<T | null>(null);

  useEffect(() => {
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else {
          if (!once) setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, threshold, rootMargin, once]);

  const className = isVisible ? "scroll-reveal is-visible" : "scroll-reveal";
  const style: CSSProperties | undefined =
    delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return { ref: setElement, className, style };
}
