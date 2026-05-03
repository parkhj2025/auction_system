"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/* Phase 1.2 (A-1-2) v10 — SmoothScroll wrapper (lenis 1.3.23).
 * 적용 범위: 메인 페이지 한정 (app/page.tsx wrap). /analysis/[slug] 등 다른 페이지 제외.
 * 분석 페이지 (DetailHero / TimelineSection / RightsAnalysisSection 등) motion useScroll 회귀 0.
 * SSR safe (useEffect client only). prefers-reduced-motion 자동 정지 (globals.css 정합). */

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
      autoResize: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
