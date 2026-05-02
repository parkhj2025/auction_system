"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Shield, Building2, UserCheck } from "lucide-react";

/* Phase 1.2 (A-1-2) v4 — TrustCTA (시안 정합 본질).
 * dark Charcoal gradient bg + radial green glow + 배지 3건 (green gradient icon-wrap + box-shadow 입체) +
 * scroll-revealed stagger (Opus 자유 3 본 cycle 진입) + CTA 2 (primary green / secondary on-dark).
 * 영역 8 정수 — Anthropic safety / Vercel trust paradigm 정합. */

const BADGES = [
  {
    icon: Shield,
    title: "서울보증보험",
    desc: "보증금 사고 0% — 입찰 보증금은 전액 보장됩니다.",
  },
  {
    icon: Building2,
    title: "매수신청대리인 등록",
    desc: "공인중개사법에 따른 정식 등록 대리인.",
  },
  {
    icon: UserCheck,
    title: "공인중개사 직접 입찰",
    desc: "전문가가 법원에 직접 출석하여 입찰.",
  },
] as const;

export function TrustCTA() {
  const ref = useRef<HTMLUListElement>(null);
  const [revealed, setRevealed] = useState(false);

  /* Opus 자유 3 — IntersectionObserver scroll-revealed stagger (영역 8 정수). */
  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="trust-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#111418] to-[#1A1F25] text-white"
    >
      {/* radial green glow (우상단 hotspot). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,200,83,0.16), transparent 60%)",
        }}
      />

      <div className="container-app relative py-[var(--section-py)]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-white/60">
            신뢰
          </p>
          <h2
            id="trust-heading"
            className="mt-3 text-[36px] font-bold leading-[1.15] tracking-[-0.025em] text-white lg:text-[48px]"
          >
            사고율 0%
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-white/70 lg:text-[17px]">
            공인 자격 + 보증보험 + 전용계좌 관리.
          </p>
        </div>

        {/* 배지 3건 — green gradient icon-wrap + box-shadow 입체 + stagger reveal. */}
        <ul
          ref={ref}
          className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-3 lg:gap-6"
        >
          {BADGES.map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className={
                "stagger-item rounded-3xl border border-white/8 bg-white/[0.04] p-7 backdrop-blur-md lg:p-8 " +
                (revealed ? "is-visible" : "")
              }
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00E66B] to-[#00A040] text-white shadow-[0_8px_24px_rgba(0,200,83,0.32),inset_0_1px_0_rgba(255,255,255,0.2)]">
                <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-[18px] font-bold leading-[1.4] tracking-[-0.01em] text-white lg:text-[20px]">
                {title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-white/60 lg:text-[14px]">
                {desc}
              </p>
            </li>
          ))}
        </ul>

        {/* CTA 2 — primary green + secondary on-dark. */}
        <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/apply"
            className="inline-flex h-13 w-full items-center justify-center rounded-[14px] bg-[var(--brand-green)] px-8 text-[15px] font-bold text-white shadow-[var(--shadow-button-green)] transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418] sm:w-auto lg:h-14 lg:px-10 lg:text-[16px]"
          >
            입찰 대리 신청
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-13 w-full items-center justify-center rounded-[14px] border border-white/12 bg-white/8 px-8 text-[15px] font-bold text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418] sm:w-auto lg:h-14 lg:px-10 lg:text-[16px]"
          >
            카카오톡 문의
          </Link>
        </div>
      </div>
    </section>
  );
}
