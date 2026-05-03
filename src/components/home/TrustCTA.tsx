"use client";

import Link from "next/link";
import { Briefcase, Shield, Lock } from "lucide-react";
import { TextGenerateEffect } from "@/components/aceternity/TextGenerateEffect";

/* Phase 1.2 (A-1-2) v16 — TrustCTA (justify-between + 0 비율 ↓ + 3 카드 모바일 3 col + CTA + caption).
 * 정정 (Plan v16):
 * 1. min-h calc(100vh-80px) + flex-col justify-between (광역 분포 / CTA 광역 영역 정합)
 * 2. "0" 160/280px (현 ↓) + "지금까지" 18/24 + "건의 사고" 24/40
 * 3. 3 카드 모바일도 3 col (max-w 4xl) — Briefcase / Shield / Lock
 * 4. CTA 광역 표시 + caption "법원에 가지 않고, 경매를 시작하세요." */

const CARDS = [
  { Icon: Briefcase, label: "공인중개사 직접 입찰" },
  { Icon: Shield, label: "보증보험 가입" },
  { Icon: Lock, label: "전용 계좌 분리 보관" },
] as const;

export function TrustCTA() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="relative flex min-h-[calc(100vh-64px)] flex-col justify-between overflow-hidden bg-gray-900 py-16 lg:min-h-[calc(100vh-80px)] lg:py-20"
    >
      {/* 배경 radial green glow. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,200,83,0.18), transparent 65%)",
        }}
      />

      {/* floating gradient orb (보존). */}
      <span
        aria-hidden="true"
        className="trust-orb-float pointer-events-none absolute right-[8%] top-[12%] h-[260px] w-[260px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,200,83,0.35), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <span
        aria-hidden="true"
        className="trust-orb-float-delay pointer-events-none absolute bottom-[10%] left-[6%] h-[200px] w-[200px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,200,83,0.25), transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="container-app relative z-10 flex w-full flex-1 flex-col justify-between gap-12 lg:gap-16">
        {/* 상단 — h2 + body. */}
        <div className="mt-8 flex flex-col items-center text-center lg:mt-12">
          <div
            id="trust-heading"
            className="mb-2 text-[18px] text-gray-300 lg:mb-4 lg:text-[24px]"
          >
            지금까지
          </div>
          <TextGenerateEffect
            words="0"
            filter={false}
            duration={0.8}
            className="mb-2 text-[160px] font-extrabold leading-none tracking-[-0.02em] text-[var(--brand-green)] lg:mb-4 lg:text-[280px]"
          />
          <div className="text-[24px] font-bold text-white lg:text-[40px]" style={{ fontWeight: 700 }}>
            건의 사고
          </div>
          <p className="mt-3 text-[14px] text-gray-400 lg:mt-4 lg:text-[16px]">
            매수신청대리인 등록 · 서울보증보험 가입 · 보증금 분리 보관
          </p>
        </div>

        {/* 가운데 — 3 카드 모바일도 3 col. */}
        <div className="mx-auto grid w-full max-w-4xl grid-cols-3 gap-3 lg:gap-6">
          {CARDS.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-3xl bg-gray-800 p-4 text-center lg:p-6"
            >
              <Icon size={36} strokeWidth={2} className="mb-2 text-[var(--brand-green)] lg:mb-3" />
              <div className="text-[13px] font-bold text-white lg:text-[16px]">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 — CTA. */}
        <div className="flex flex-col items-center gap-3 lg:gap-4">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-full bg-[var(--brand-green)] px-12 py-4 text-[18px] font-bold text-white shadow-2xl transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:px-16 lg:py-5 lg:text-[20px]"
          >
            지금 신청하기
          </Link>
          <p className="text-[13px] text-gray-400 lg:text-[14px]">
            법원에 가지 않고, 경매를 시작하세요.
          </p>
        </div>
      </div>
    </section>
  );
}
