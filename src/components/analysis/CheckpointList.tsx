"use client";

/**
 * 07 체크포인트 단락 fade-in stagger — 단계 5-4-2-fix-2 Phase 4.
 *
 * mdx remark plugin 이 H3 "체크포인트" 후 ol/ul 을 CheckpointList 로 wrap.
 * Container viewport 진입 시 ol 자식 li 들이 stagger fade-in (좌→우 + opacity).
 *
 * 자식 li 의 stagger 는 CSS animation-delay (각 li 의 nth-child) 활용.
 */
import { useInView } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";

export function CheckpointList({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // 룰 1 (단계 5-4-2-fix-3): once: false — 위·아래 스크롤 시 stagger 재실행
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <div
      ref={ref}
      className={`checkpoint-list mt-5 ${isInView ? "checkpoint-revealed" : ""}`}
    >
      {children}
    </div>
  );
}
