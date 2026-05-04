"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Building2, FileText, Lock } from "lucide-react";

/* Phase 1.2 (A-1-2) v22 — Hero CTA 모바일 단축 + 3 강점 모바일 세로 layout + 라벨 변경.
 * 정정 2건 (Plan v22):
 * 1. CTA 버튼 모바일 "조회" / 데스크탑 "조회하기" 분기 + 모바일 padding px-6
 * 2. 3 강점 layout 모바일 세로 / 데스크탑 가로 분기 + 라벨 3건 단축 + 모바일 텍스트 14px */

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
    <section className="relative isolate flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden bg-white px-6 lg:min-h-[calc(100vh-80px)] lg:px-6">
      {/* 1. 동영상 배경 (z-0 / overlay 0 / 페이딩 0). */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* 2. 콘텐츠 광역 vertical stack (z-10 / h1 + 박스 동일 폭). */}
      <div className="relative z-10 flex w-full max-w-[800px] flex-col items-center gap-10 text-center lg:gap-14">
        {/* h1 영상 위 직접 표시 — "경매" yellow + halo / 첫 줄 white + 검정 backdrop. */}
        <h1
          className="w-full text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-white [text-wrap:balance] lg:text-[80px]"
          style={{
            fontWeight: 800,
            textShadow:
              "0 4px 24px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)",
          }}
        >
          법원에 가지 않고,<br />
          <span
            style={{
              color: "#FFD43B",
              textShadow:
                "0 0 32px rgba(255, 212, 59, 0.7), 0 0 64px rgba(255, 212, 59, 0.5), 0 4px 16px rgba(0, 0, 0, 0.5)",
            }}
          >
            경매
          </span>
          <span
            className="text-white"
            style={{
              textShadow:
                "0 4px 24px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)",
            }}
          >
            를 시작하다.
          </span>
        </h1>

        {/* Apple Liquid Glass 박스 = subtext + 입력 + 3 강점 1행 (모바일/데스크탑 통일). */}
        <div
          className="flex w-full flex-col items-center gap-6 rounded-[28px] px-6 py-6 lg:gap-8 lg:px-10 lg:py-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.06) 100%)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 32px 80px -16px rgba(0, 0, 0, 0.35)",
          }}
        >
          {/* subtext 박스 안 진입 — text-white/90 + font-medium + 약화 textShadow. */}
          <p
            className="text-center text-[16px] font-medium leading-[1.6] text-white/90 lg:text-[24px]"
            style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)" }}
          >
            사건번호만 주시면, 법원은 저희가 갑니다.
          </p>

          {/* 입력 박스 — "조회하기" 보존. */}
          <div className="relative w-full max-w-[600px]">
            <form
              onSubmit={onSubmit}
              role="search"
              aria-label="사건번호 검색"
              className="flex w-full items-center rounded-2xl bg-white p-1.5 shadow-md transition-shadow duration-200 focus-within:shadow-lg"
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
                className="h-14 flex-1 bg-transparent px-6 text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none lg:h-16"
              />
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-[var(--brand-green)] px-6 text-[16px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-16 lg:px-12 lg:text-[18px]"
              >
                <span className="lg:hidden">조회</span>
                <span className="hidden lg:inline">조회하기</span>
              </button>
            </form>
          </div>

          {/* 3 강점 — 모바일 세로 / 데스크탑 가로 분기 + 흰색 톤. */}
          <div className="flex flex-col items-start justify-start gap-3 lg:flex-row lg:items-center lg:justify-center lg:gap-6">
            <div className="flex items-center gap-2">
              <Building2
                strokeWidth={2}
                className="h-[18px] w-[18px] flex-shrink-0 text-green-400 lg:h-5 lg:w-5"
              />
              <span className="whitespace-nowrap text-[14px] font-semibold text-white/95 lg:text-[15px]">
                법원 방문 없음
              </span>
            </div>
            <div className="hidden lg:block h-5 w-px flex-shrink-0 bg-white/30" />
            <div className="flex items-center gap-2">
              <FileText
                strokeWidth={2}
                className="h-[18px] w-[18px] flex-shrink-0 text-green-400 lg:h-5 lg:w-5"
              />
              <span className="whitespace-nowrap text-[14px] font-semibold text-white/95 lg:text-[15px]">
                서류 비대면
              </span>
            </div>
            <div className="hidden lg:block h-5 w-px flex-shrink-0 bg-white/30" />
            <div className="flex items-center gap-2">
              <Lock
                strokeWidth={2}
                className="h-[18px] w-[18px] flex-shrink-0 text-green-400 lg:h-5 lg:w-5"
              />
              <span className="whitespace-nowrap text-[14px] font-semibold text-white/95 lg:text-[15px]">
                보증금 전용계좌
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
