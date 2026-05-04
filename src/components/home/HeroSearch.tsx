"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Building2, FileText, Lock } from "lucide-react";

/* Phase 1.2 (A-1-2) v20 — Hero 모바일 비율 정합 + 글래스 투명도 약화 + 강점 1행 통일.
 * 정정 4건 (Plan v20):
 * 1. section padding 모바일 px-4 → px-6 (좌우 여백 확보)
 * 2. 박스 background rgba 0.22/0.08 → 0.18/0.06 (투명도 약화)
 * 3. 모바일 carousel 폐기 + 3 강점 1행 모바일/데스크탑 통일 (반응형 13/15 + 18/20 + gap-3/6)
 * 4. carousel 관련 motion 모듈 + useEffect import 영구 삭제 */

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
                className="inline-flex h-14 items-center justify-center rounded-xl bg-[var(--brand-green)] px-10 text-[16px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-16 lg:px-12 lg:text-[18px]"
              >
                조회하기
              </button>
            </form>
          </div>

          {/* 3 강점 1행 (모바일/데스크탑 통일) — 흰색 톤. */}
          <div className="flex items-center justify-center gap-3 lg:gap-6">
            <div className="flex items-center gap-1.5 lg:gap-2">
              <Building2
                strokeWidth={2}
                className="h-[18px] w-[18px] flex-shrink-0 text-green-400 lg:h-5 lg:w-5"
              />
              <span className="whitespace-nowrap text-[13px] font-semibold text-white/95 lg:text-[15px]">
                법원 방문 0회
              </span>
            </div>
            <div className="h-[18px] w-px flex-shrink-0 bg-white/30 lg:h-5" />
            <div className="flex items-center gap-1.5 lg:gap-2">
              <FileText
                strokeWidth={2}
                className="h-[18px] w-[18px] flex-shrink-0 text-green-400 lg:h-5 lg:w-5"
              />
              <span className="whitespace-nowrap text-[13px] font-semibold text-white/95 lg:text-[15px]">
                서류 비대면 100%
              </span>
            </div>
            <div className="h-[18px] w-px flex-shrink-0 bg-white/30 lg:h-5" />
            <div className="flex items-center gap-1.5 lg:gap-2">
              <Lock
                strokeWidth={2}
                className="h-[18px] w-[18px] flex-shrink-0 text-green-400 lg:h-5 lg:w-5"
              />
              <span className="whitespace-nowrap text-[13px] font-semibold text-white/95 lg:text-[15px]">
                보증금 분리 보관
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
