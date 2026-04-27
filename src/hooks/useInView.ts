"use client";

/**
 * 단계 5-4-1: IntersectionObserver native API wrapper hook.
 *  scroll-triggered reveal 의 entry 감지를 라이브러리 추가 없이 처리.
 *  ui-ux-pro-max#motion-meaning + #stagger-sequence + web-design-guidelines#interruptibility 정합.
 *
 *  사용처: DropRateBar / TimelineSection / MarketCompareScatter 등 스크롤 reveal 컴포넌트.
 *  prefers-reduced-motion 은 globals.css 의 글로벌 룰이 처리 (animation/transition 강제 0).
 */
import { useEffect, useRef, useState } from "react";

interface UseInViewOptions extends IntersectionObserverInit {
  /** true 면 첫 진입 시 1회만 trigger (재진입 시 모션 0) — 인지 부담 회피 권장 default */
  once?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { once = true, threshold = 0.3, rootMargin = "0px", root = null } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // SSR 환경에서는 useEffect 자체가 실행되지 않음. 클라이언트에서는 IntersectionObserver 항상 존재 (Safari 12.1+ / Chrome 51+ / Firefox 55+ — 97%+ 커버).
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin, root }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, threshold, rootMargin, root]);

  return { ref, inView };
}
