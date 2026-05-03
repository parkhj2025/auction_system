"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { AuroraBackground } from "@/components/aceternity/AuroraBackground";
import { HeroDifferentiationGrid } from "@/components/HeroDifferentiationGrid";

/* Phase 1.2 (A-1-2) v11 — Hero (Aurora Background + 4 grid lg+ + h1 44/80).
 * 좌측 (lg w-1/2): h1 + subtext + CTA + glow halo (보존).
 * 우측 (lg w-1/2 / mobile 0): 4 큰 숫자 grid (0회 / 5만원~ / 0건 / +5만원).
 * 배경: Aurora Background (모바일 + 데스크탑 모두 / 60s 자율 모션 / GPU accelerated).
 * h1 line-break: lg+ 강제 br / mobile 자연 줄바꿈 + text-wrap balance. */

export function HeroSearch({ caseNumbers }: { caseNumbers: string[] }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const normalizedCases = useMemo(
    () => new Set(caseNumbers.map((c) => c.normalize("NFC"))),
    [caseNumbers]
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const normalized = trimmed.normalize("NFC");
    if (normalizedCases.has(normalized)) {
      router.push(`/analysis/${encodeURIComponent(normalized)}`);
    } else {
      router.push(`/apply?case=${encodeURIComponent(normalized)}`);
    }
  }

  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Aurora Background — 모바일 + 데스크탑 자율 모션 (60s ease-in-out infinite / GPU accelerated). */}
      <AuroraBackground className="pointer-events-none absolute inset-0 h-full w-full" showRadialGradient={true}>
        <></>
      </AuroraBackground>

      <div className="container-app relative z-20 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* 좌측 — h1 + subtext + 검색 카드 + CTA glow halo. */}
          <div>
            <h1
              className="text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:text-[80px]"
              style={{ fontWeight: 800 }}
            >
              법원에 가지 않고,<br className="hidden lg:inline" />{" "}
              <span className="text-[var(--brand-green)]">경매를 시작하다.</span>
            </h1>

            <p className="mt-5 text-[16px] font-medium leading-[1.6] text-[var(--text-secondary)] lg:mt-7 lg:text-[20px]">
              사건번호만 주시면, 법원은 저희가 갑니다.
            </p>

            {/* 검색 카드 + CTA glow halo. */}
            <div className="relative mt-8 max-w-xl lg:mt-10">
              <div
                aria-hidden="true"
                className="cta-glow-pulse pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, var(--brand-green) 0%, transparent 70%)",
                }}
              />
              <form
                onSubmit={onSubmit}
                role="search"
                aria-label="사건번호 검색"
                className="group/search relative flex h-16 items-center rounded-2xl border border-[var(--border-1)] bg-white shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-200 focus-within:border-[var(--brand-green)] focus-within:shadow-[0_0_0_4px_rgba(0,200,83,0.12),var(--shadow-card)] lg:h-[72px]"
              >
                <label htmlFor="hero-case" className="sr-only">
                  사건번호
                </label>
                <input
                  id="hero-case"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="사건번호 입력 (예: 2026타경500459)"
                  className="h-full flex-1 bg-transparent pl-5 pr-2 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none lg:pl-6 lg:text-[16px]"
                />
                <button
                  type="submit"
                  className="mr-1.5 inline-flex h-13 items-center justify-center rounded-[14px] bg-[var(--brand-green)] px-5 text-[20px] font-bold text-white shadow-[var(--shadow-button-green)] transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-14 lg:px-6 lg:text-[24px]"
                >
                  사건번호 입력하기
                </button>
              </form>
            </div>
          </div>

          {/* 우측 — 4 큰 숫자 grid (lg+ only / mobile 0). */}
          <HeroDifferentiationGrid />
        </div>
      </div>
    </section>
  );
}
