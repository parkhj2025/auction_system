"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* Phase 1.2 (A-1-2) v9 — TrustCTA (광역 그룹 통합 + CTA 흡수 + floating orb + scroll reveal 4 영역).
 * h2 "지금까지 사고 0건." (보존)
 * body "공인중개사 직접 입찰 + 보증보험 + 전용 계좌." (보존)
 * caption "매수신청대리인 등록 · 서울보증보험 가입 · 보증금 분리 보관" (보존)
 * NEW CTA caption "법원에 가지 않고, 경매를 시작하세요." (Footer 흡수)
 * NEW CTA "지금 신청하기" 큰 button green (Footer 흡수)
 * NEW floating gradient orb 1-2건 (CSS @keyframes / GPU accelerated / 우상단 + 좌하단 대각선)
 * scroll reveal 4 영역 (h2 / body / caption / CTA group / delay stagger 0/100/200/300ms). */

export function TrustCTA() {
  const { ref: h2Ref, className: h2Class, style: h2Style } =
    useScrollReveal<HTMLHeadingElement>();
  const { ref: bodyRef, className: bodyClass, style: bodyStyle } =
    useScrollReveal<HTMLParagraphElement>({ delay: 100 });
  const { ref: captionRef, className: captionClass, style: captionStyle } =
    useScrollReveal<HTMLParagraphElement>({ delay: 200 });
  const { ref: ctaRef, className: ctaClass, style: ctaStyle } =
    useScrollReveal<HTMLDivElement>({ delay: 300 });

  return (
    <section
      aria-labelledby="trust-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#111418] to-[#1A1F25] text-white"
    >
      {/* radial green glow center (보존). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,200,83,0.18), transparent 65%)",
        }}
      />

      {/* floating gradient orb 2건 (대각선 우상단 + 좌하단 / GPU accelerated). */}
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

      <div className="container-app relative py-[var(--section-py)]">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            ref={h2Ref}
            id="trust-heading"
            className={`${h2Class} text-[var(--text-h2)] font-extrabold leading-[1.05] tracking-[-0.025em] text-white [text-wrap:balance]`}
            style={{ ...h2Style, fontWeight: 800 }}
          >
            지금까지 사고{" "}
            <span className="text-[var(--brand-green)]">0건</span>.
          </h2>

          {/* body strong — 자신감 본문 정수 (size ↑ + weight 700). */}
          <p
            ref={bodyRef}
            className={`${bodyClass} mt-8 text-[17px] font-bold leading-[1.6] text-white/85 lg:mt-10 lg:text-[22px]`}
            style={{ ...bodyStyle, fontWeight: 700 }}
          >
            공인중개사 직접 입찰 + 보증보험 + 전용 계좌.
          </p>

          {/* 검증 영역 — inline caption 한 줄 (보존). */}
          <p
            ref={captionRef}
            className={`${captionClass} mt-8 text-[12px] uppercase tracking-[0.08em] text-white/45 lg:mt-12 lg:text-[14px]`}
            style={captionStyle}
          >
            매수신청대리인 등록 · 서울보증보험 가입 · 보증금 분리 보관
          </p>

          {/* CTA group — caption + button (Footer 흡수 영역 / 광역 한 그룹). */}
          <div
            ref={ctaRef}
            className={`${ctaClass} mt-12 flex flex-col items-center gap-5 lg:mt-16`}
            style={ctaStyle}
          >
            <p className="text-[18px] font-bold leading-[1.4] text-white lg:text-[22px]" style={{ fontWeight: 700 }}>
              법원에 가지 않고,{" "}
              <span className="text-[var(--brand-green)]">경매를 시작하세요.</span>
            </p>
            <Link
              href="/apply"
              className="inline-flex h-14 shrink-0 items-center justify-center rounded-[14px] bg-[var(--brand-green)] px-10 text-[16px] font-bold text-white shadow-[var(--shadow-button-green)] transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-16 lg:px-12 lg:text-[17px]"
            >
              지금 신청하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
