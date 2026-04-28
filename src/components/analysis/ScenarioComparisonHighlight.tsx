"use client";

/**
 * 시나리오 비교 요약 영역 시각 강조 wrap — 단계 5-4-2-fix-9 Phase 3.
 *
 * 본질 (Hero fix-8 Visual Weight Triangle 차용):
 *  - 색·라인·radius 차등 0 (룰 27 본문 카드 통일 본질 보존)
 *  - 여백·typography·motion 영역 강조
 *  - "정리 카드" 본질 (섹션 05 마지막 영역)
 *
 * remark plugin (analysis-blocks.ts) 이 "### 시나리오 비교 요약" h3 + 자식 노드
 * (image · table · footer 산문) 를 본 컴포넌트 children 으로 wrap 한다.
 *
 * once: true 사유 — 정리 카드 단일 진입 강조, 재진입 stagger 회피, 사용자 스크롤 노이즈 방지.
 */
import { motion } from "motion/react";
import type { ReactNode } from "react";

export function ScenarioComparisonHighlight({ children }: { children?: ReactNode }) {
  return (
    <motion.section
      className="mt-12 rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white p-8 sm:mt-16 sm:p-10 [&>h3]:!mt-2"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-10%" }}
    >
      <span className="block text-[length:var(--text-caption)] font-medium uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
        이 섹션의 정리
      </span>
      {children}
    </motion.section>
  );
}
