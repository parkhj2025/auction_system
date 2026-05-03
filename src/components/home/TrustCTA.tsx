"use client";

import Link from "next/link";
import { User, Shield, Lock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Spotlight } from "@/components/aceternity/Spotlight";
import { TextGenerateEffect } from "@/components/aceternity/TextGenerateEffect";

/* Phase 1.2 (A-1-2) v10 — TrustCTA ("0" 200/400 정적 + Spotlight lg+ + Text Generate + 3 아이콘 카드 + CTA).
 * 레이아웃: charcoal #111418 + Spotlight (lg+ only) / mobile radial green glow.
 * "지금까지" 24/36px → "0" 200/400px green (Text Generate Effect fade-in) → "건의 사고" 32/56px.
 * 3 아이콘 카드 (User/Shield/Lock 64px / 모바일 stack / 데스크탑 horizontal) — 본문 16/18px.
 * "법원에 가지 않고, 경매를 시작하세요." 36/64px → CTA "지금 신청하기" 32/56px + glow halo.
 * scroll reveal 4 영역 (h2 / 0 / 3 카드 / CTA / stagger 150ms). */

const CARDS = [
  { Icon: User, label: "공인중개사 직접 입찰" },
  { Icon: Shield, label: "보증보험 가입" },
  { Icon: Lock, label: "전용 계좌 분리 보관" },
] as const;

export function TrustCTA() {
  const { ref: h2Ref, className: h2Class, style: h2Style } =
    useScrollReveal<HTMLDivElement>();
  const { ref: zeroRef, className: zeroClass, style: zeroStyle } =
    useScrollReveal<HTMLDivElement>({ delay: 150 });
  const { ref: cardsRef, className: cardsClass, style: cardsStyle } =
    useScrollReveal<HTMLDivElement>({ delay: 300 });
  const { ref: ctaRef, className: ctaClass, style: ctaStyle } =
    useScrollReveal<HTMLDivElement>({ delay: 450 });

  return (
    <section
      aria-labelledby="trust-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#111418] to-[#1A1F25] text-white"
    >
      {/* Spotlight (lg+ only / 좌상 → 우하 / green tint). */}
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#00C853" />

      {/* Mobile radial green glow (lg- 보존). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full lg:hidden"
        style={{
          background:
            "radial-gradient(circle, rgba(0,200,83,0.18), transparent 65%)",
        }}
      />

      {/* Floating gradient orb (보존 / 우상단 + 좌하단). */}
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

      <div className="container-app relative z-10 py-[var(--section-py)]">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* "지금까지" + "0" + "건의 사고" 분리. */}
          <div
            ref={h2Ref}
            className={`${h2Class}`}
            style={h2Style}
            id="trust-heading"
          >
            <span className="block text-[24px] font-medium text-white/60 lg:text-[36px]">
              지금까지
            </span>
          </div>

          <div
            ref={zeroRef}
            className={`${zeroClass} mt-2 lg:mt-4`}
            style={zeroStyle}
          >
            <TextGenerateEffect
              words="0"
              filter={false}
              duration={0.8}
              className="text-[200px] font-extrabold leading-none tracking-[-0.04em] text-[var(--brand-green)] lg:text-[400px]"
            />
          </div>

          <span className="mt-2 block text-[32px] font-bold text-white lg:mt-4 lg:text-[56px]" style={{ fontWeight: 700 }}>
            건의 사고
          </span>

          {/* 3 아이콘 카드 (User / Shield / Lock 64px). */}
          <div
            ref={cardsRef}
            className={`${cardsClass} mt-12 grid w-full grid-cols-1 gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-6`}
            style={cardsStyle}
          >
            {CARDS.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <Icon size={64} className="text-[var(--brand-green)]" />
                <p className="text-center text-[16px] font-medium leading-[1.5] text-white/85 lg:text-[18px]">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* caption — 검증 영역 (보존). */}
          <p className="mt-8 text-[12px] uppercase tracking-[0.08em] text-white/45 lg:mt-10 lg:text-[14px]">
            매수신청대리인 등록 · 서울보증보험 가입 · 보증금 분리 보관
          </p>

          {/* 결합 멘트 + CTA. */}
          <div
            ref={ctaRef}
            className={`${ctaClass} mt-12 flex flex-col items-center gap-6 lg:mt-16`}
            style={ctaStyle}
          >
            <p className="text-[36px] font-bold leading-[1.3] text-white lg:text-[64px] [text-wrap:balance]" style={{ fontWeight: 700 }}>
              법원에 가지 않고,{" "}
              <span className="text-[var(--brand-green)]">경매를 시작하세요.</span>
            </p>
            <div className="relative">
              <span
                aria-hidden="true"
                className="cta-glow-pulse pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, var(--brand-green) 0%, transparent 70%)",
                }}
              />
              <Link
                href="/apply"
                className="inline-flex h-16 items-center justify-center gap-2 rounded-[14px] bg-[var(--brand-green)] px-12 text-[32px] font-bold text-white shadow-[var(--shadow-button-green)] transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-20 lg:px-16 lg:text-[56px]"
                style={{ fontWeight: 700 }}
              >
                지금 신청하기
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
