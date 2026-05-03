"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useMemo } from "react";

/* Phase 1.2 (A-1-2) v9 — Hero (split-screen + maximalist h1 + product mockup + 배경 모션 2층 + CTA glow halo).
 * h1 mobile 56 / desktop 96 (maximalist) + lg 강제 line-break + letter-spacing -0.025em + line-height 1.05.
 * subtext "사건번호만 주시면, 법원은 저희가 갑니다." (보존)
 * CTA "사건번호 입력하기" + glow halo (radial green pulse 4s).
 * 우측 (lg+): 분석 페이지 production mockup screenshot (V0 PNG).
 * 배경 모션 2층: mesh rotate (120s) + dot shift (60s 우상단). */

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
      {/* Hero 배경 모션 2층 (광역 / pointer-events 0). */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* 1층: mesh gradient 회전 (광역 / opacity 0.04 / 120s spin). */}
        <div
          aria-hidden="true"
          className="hero-mesh-rotate absolute -inset-[20%] opacity-[0.04]"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%,
              var(--brand-green) 0deg,
              transparent 90deg,
              var(--brand-green) 180deg,
              transparent 270deg,
              var(--brand-green) 360deg)`,
            filter: "blur(80px)",
          }}
        />
        {/* 2층: dot grid 이동 (우상단 60%×40% / opacity 0.06 / 60s dotShift). */}
        <div
          aria-hidden="true"
          className="hero-dot-shift absolute right-0 top-0 h-[60%] w-[40%] opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--brand-green) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container-app relative py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          {/* 좌측 — h1 + subtext + 검색 카드 + CTA glow halo. */}
          <div>
            <h1
              className="text-[56px] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--text-primary)] [text-wrap:balance] lg:text-[96px]"
              style={{ fontWeight: 800 }}
            >
              법원에 가지 않고,<br className="hidden lg:inline" />{" "}
              <span className="text-[var(--brand-green)]">경매를 시작하다.</span>
            </h1>

            <p className="mt-6 text-[17px] font-medium leading-[1.6] text-[var(--text-secondary)] lg:mt-8 lg:text-[19px]">
              사건번호만 주시면, 법원은 저희가 갑니다.
            </p>

            {/* 검색 카드 + CTA glow halo (CTA button 후방 영역). */}
            <div className="relative mt-8 max-w-xl lg:mt-10">
              {/* CTA glow halo (radial green / opacity 0.3-0.5 pulse / 4s). */}
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
                  className="mr-1.5 inline-flex h-13 items-center justify-center rounded-[14px] bg-[var(--brand-green)] px-5 text-[14px] font-bold text-white shadow-[var(--shadow-button-green)] transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-14 lg:px-6 lg:text-[15px]"
                >
                  사건번호 입력하기
                </button>
              </form>
            </div>
          </div>

          {/* 우측 — 분석 페이지 production mockup (lg+ 영역). */}
          <div className="relative hidden aspect-[1280/800] w-full max-w-[640px] justify-self-end overflow-hidden rounded-2xl border border-[var(--border-1)] shadow-[var(--shadow-card-lg)] lg:block">
            <Image
              src="/illustrations/hero-product-mockup.png"
              alt="경매퀵 분석 페이지 — 권리분석·시세비교·수익시뮬 광역 정수"
              width={1280}
              height={800}
              priority
              sizes="(max-width: 1024px) 0px, 640px"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
