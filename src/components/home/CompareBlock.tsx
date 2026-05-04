"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  Car,
  FileText,
  Banknote,
  Building2,
  Clock,
  ArrowRight,
} from "lucide-react";

/* Phase 1.2 (A-1-2) v16 — CompareBlock (큰 숫자 직접 비교 + 막대 5건 작은 영역).
 * 정정 (Plan v16):
 * 1. min-h calc(100vh-80px) + flex-col justify-center + 1 viewport 정합
 * 2. 큰 숫자 직접 비교 — 좌 "255분" gray-400 + 우 "3분" green / 80/200px / NumberFlow
 * 3. 가운데 ArrowRight 48/64px gray-400 + "85배 빠릅니다." 28/48px (85배 green)
 * 4. 하단 보조 — 막대 5건 (작은 영역 / max-w 4xl / 4px height) */

type Bar = {
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  label: string;
  minutes: number;
};

const BAR_DATA: Bar[] = [
  { Icon: Car, label: "휴가 신청", minutes: 30 },
  { Icon: FileText, label: "서류 준비", minutes: 45 },
  { Icon: Banknote, label: "수표 발행", minutes: 30 },
  { Icon: Building2, label: "법원 이동", minutes: 60 },
  { Icon: Clock, label: "입찰 대기", minutes: 90 },
];

export function CompareBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="compare-heading"
      className="flex min-h-[calc(100dvh-64px)] flex-col justify-center bg-white py-12 lg:min-h-[calc(100dvh-80px)] lg:py-16 snap-block"
    >
      <div className="container-app w-full">
        <h2
          id="compare-heading"
          className="mb-12 text-center text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-16 lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          법원 가는 <span className="text-gray-400">3시간,</span><br />
          물건 보는 <span className="text-[var(--brand-green)]">시간으로.</span>
        </h2>

        {/* 큰 숫자 직접 비교 — 좌 (gray) vs 우 (green). */}
        <div className="mb-12 grid grid-cols-3 items-center gap-6 lg:mb-16 lg:gap-8">
          {/* 좌측 — 직접 가는 길. */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-gray-400 lg:mb-4 lg:text-[14px]">
              직접 가는 길
            </div>
            <div className="text-[80px] font-extrabold leading-none text-gray-400 lg:text-[200px]" style={{ fontWeight: 800 }}>
              {isInView ? <NumberFlow value={255} /> : 0}
              <span className="ml-1 align-top text-[24px] lg:text-[48px]">분</span>
            </div>
          </div>

          {/* 가운데 — 화살표 + 합산. */}
          <div className="flex flex-col items-center gap-3 lg:gap-4">
            <ArrowRight size={48} strokeWidth={2} className="text-gray-400 lg:hidden" />
            <ArrowRight size={64} strokeWidth={2} className="hidden text-gray-400 lg:block" />
            <div className="text-center text-[28px] font-bold leading-tight lg:text-[48px]" style={{ fontWeight: 700 }}>
              <span className="text-[var(--brand-green)]">85배</span>
              <br className="lg:hidden" />
              <span className="text-gray-900"> 빠릅니다.</span>
            </div>
          </div>

          {/* 우측 — 경매퀵 길. */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--brand-green)] lg:mb-4 lg:text-[14px]">
              경매퀵 길
            </div>
            <div className="text-[80px] font-extrabold leading-none text-[var(--brand-green)] lg:text-[200px]" style={{ fontWeight: 800 }}>
              {isInView ? <NumberFlow value={3} /> : 0}
              <span className="ml-1 align-top text-[24px] lg:text-[48px]">분</span>
            </div>
          </div>
        </div>

        {/* 하단 보조 — 5건 막대 차트 (작은 영역). */}
        <div className="mx-auto grid max-w-4xl grid-cols-5 gap-2 lg:gap-4">
          {BAR_DATA.map(({ Icon, label, minutes }) => (
            <div key={label} className="flex flex-col items-center gap-1 lg:gap-2">
              <Icon size={20} strokeWidth={2} className="text-gray-400" />
              <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gray-300"
                  style={{ width: `${(minutes / 90) * 100}%` }}
                />
              </div>
              <div className="text-[11px] font-semibold text-gray-500 lg:text-[13px]">
                {label} {minutes}분
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
