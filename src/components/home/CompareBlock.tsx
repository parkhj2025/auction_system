"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import NumberFlow from "@number-flow/react";
import { Car, FileText, Banknote, Building2, Clock, Smartphone } from "lucide-react";

/* Phase 1.2 (A-1-2) v10 — CompareBlock (5+1 막대 차트 + Lucide 24px + NumberFlow 8건 + "85" 240px).
 * h2: "법원 가는 3시간, / 물건 보는 시간으로." (강제 line-break / 모바일 + 데스크탑 동일).
 * 좌측 5단계 (gray #94A3B8 / 변환 0): 휴가 신청 30분 / 서류 준비 45분 / 수표 발행 30분 / 법원 이동 60분 / 입찰 대기 90분.
 * 우측 1단계 (gray → green scroll progress): 사건번호 입력 3분.
 * 결론: "85" CountUp 0→85 (240px 데스크탑 / 120px 모바일) + "배 빠릅니다".
 * 모션: 막대 좌→우 scaleX 0→1 stagger 100ms / 우측 색 변환 / NumberFlow 8건. */

type Step = {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  minutes: number;
};

const LEFT_STEPS: Step[] = [
  { Icon: Car, label: "휴가 신청", minutes: 30 },
  { Icon: FileText, label: "서류 준비", minutes: 45 },
  { Icon: Banknote, label: "수표 발행", minutes: 30 },
  { Icon: Building2, label: "법원 이동", minutes: 60 },
  { Icon: Clock, label: "입찰 대기", minutes: 90 },
];

const RIGHT_STEP: Step = {
  Icon: Smartphone,
  label: "사건번호 입력",
  minutes: 3,
};

const LEFT_TOTAL = LEFT_STEPS.reduce((sum, s) => sum + s.minutes, 0); /* 255 */
const RATIO = Math.round(LEFT_TOTAL / RIGHT_STEP.minutes); /* 85 */
const MAX_BAR = 90; /* 막대 최대 width 기준 (입찰 대기 90분 = 100%). */

export function CompareBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="compare-heading"
      className="bg-[var(--bg-primary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <h2
          id="compare-heading"
          className="mx-auto max-w-5xl text-center text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          법원 가는{" "}
          <span className="text-[var(--text-tertiary)]">3시간</span>,<br />
          물건 보는{" "}
          <span className="text-[var(--brand-green)]">시간으로.</span>
        </h2>

        {/* 5+1 split: mobile 세로 stack / lg+ 가로 split. */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          {/* 좌측 — 직접 가는 길 (gray / 5 단계). */}
          <div className="flex flex-col gap-5">
            <p className="text-[14px] font-bold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
              직접 가는 길
            </p>
            {LEFT_STEPS.map((step, idx) => (
              <CompareBar
                key={step.label}
                step={step}
                isInView={isInView}
                delay={idx * 100}
                color="gray"
              />
            ))}
            <div className="mt-4 flex items-baseline justify-end gap-2 border-t border-[var(--border-1)] pt-5">
              <span className="text-[14px] font-medium text-[var(--text-secondary)]">총</span>
              <span
                className="text-[48px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] lg:text-[72px]"
                style={{ fontWeight: 800 }}
              >
                {isInView ? <NumberFlow value={LEFT_TOTAL} /> : 0}
              </span>
              <span className="text-[18px] font-medium text-[var(--text-secondary)] lg:text-[22px]">분</span>
            </div>
          </div>

          {/* 우측 — 경매퀵 길 (gray → green / 1 단계). */}
          <div className="flex flex-col gap-5">
            <p className="text-[14px] font-bold uppercase tracking-[0.1em] text-[var(--brand-green-deep)]">
              경매퀵 길
            </p>
            <CompareBar
              step={RIGHT_STEP}
              isInView={isInView}
              delay={500}
              color="green"
            />
            <div className="mt-4 flex items-baseline justify-end gap-2 border-t border-[var(--border-1)] pt-5">
              <span className="text-[14px] font-medium text-[var(--text-secondary)]">총</span>
              <span
                className="text-[48px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--brand-green-deep)] lg:text-[72px]"
                style={{ fontWeight: 800 }}
              >
                {isInView ? <NumberFlow value={RIGHT_STEP.minutes} /> : 0}
              </span>
              <span className="text-[18px] font-medium text-[var(--text-secondary)] lg:text-[22px]">분</span>
            </div>
          </div>
        </div>

        {/* 결론 — "85배 빠릅니다." 1줄 인라인 (Plan v11 정정). */}
        <div className="mt-12 flex items-baseline justify-center gap-3 lg:mt-20">
          <span
            className="text-[80px] font-extrabold leading-[1] tracking-[-0.02em] text-[var(--brand-green)] lg:text-[160px]"
            style={{ fontWeight: 800 }}
          >
            {isInView ? <NumberFlow value={RATIO} /> : 0}
          </span>
          <span
            className="text-[24px] font-bold text-[var(--text-primary)] lg:text-[36px]"
            style={{ fontWeight: 700 }}
          >
            배 빠릅니다.
          </span>
        </div>
      </div>
    </section>
  );
}

function CompareBar({
  step,
  isInView,
  delay,
  color,
}: {
  step: Step;
  isInView: boolean;
  delay: number;
  color: "gray" | "green";
}) {
  const widthPercent = (step.minutes / MAX_BAR) * 100;
  const Icon = step.Icon;

  return (
    <div className="flex items-center gap-3">
      <Icon size={24} className="text-[var(--text-secondary)] flex-shrink-0" />
      <span className="w-[88px] flex-shrink-0 text-[14px] font-medium text-[var(--text-primary)] lg:text-[15px]">
        {step.label}
      </span>
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 0.8,
            delay: delay / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute inset-y-0 left-0 origin-left rounded-full"
          style={{
            width: `${widthPercent}%`,
            background: color === "green" ? "var(--brand-green)" : "#94A3B8",
          }}
        />
      </div>
      <span className="w-[64px] flex-shrink-0 text-right text-[18px] font-bold text-[var(--text-primary)] lg:text-[22px]">
        {isInView ? <NumberFlow value={step.minutes} suffix="분" /> : "0분"}
      </span>
    </div>
  );
}
