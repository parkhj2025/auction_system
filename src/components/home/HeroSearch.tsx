"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Building2, FileText, Lock } from "lucide-react";

/* Phase 1.2 (A-1-2) v23 — Hero 모바일 layout 광범위 재배치 (ChatGPT 시안 정합).
 * 정정 광범위 (Plan v23):
 * 1. vstack gap 모바일 → gap-6 (콘텐츠 늘어남 흡수) / 데스크탑 lg:gap-14 보존
 * 2. subtext 모바일 vstack 안 박스 밖 (lg:hidden 16px) / 데스크탑 박스 안 (hidden lg:block 24px) 분리
 * 3. 강점 모바일 2건 vstack 안 박스 밖 (lg:hidden 가로) / 데스크탑 3건 박스 안 (hidden lg:flex 가로) 분리
 * 4. 박스 안 gap 모바일 gap-3 / 데스크탑 lg:gap-8 (입력+CTA 세로 분리 정합)
 * 5. 입력+CTA 모바일 세로 분리 (lg:hidden form) / 데스크탑 통합 (hidden lg:flex form)
 * 6. 보증금 캡션 모바일 박스 안 신규 (lg:hidden / Lock 14 + 13 white/80)
 * 7. CTA 모바일 "조회" 단축 폐기 → "조회하기" 풀폭 통일 */

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
      {/* 동영상 배경 (z-0 / overlay 0 / 페이딩 0). */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* vstack — h1 + 모바일 subtext + 모바일 강점 + 박스. */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 lg:gap-14 w-full max-w-[800px]">
        {/* h1 (보존). */}
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

        {/* subtext 모바일 박스 밖 (h1 아래 / 영상 위 직접). */}
        <p
          className="lg:hidden text-center text-[16px] font-medium leading-[1.6] text-white/90"
          style={{
            textShadow:
              "0 2px 12px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          사건번호만 주시면, 법원은 저희가 갑니다.
        </p>

        {/* 강점 2건 모바일 박스 밖 (subtext 아래 / 영상 위 직접 / 가로 1행). */}
        <div className="lg:hidden flex items-center justify-center gap-6 -mt-2">
          <div className="flex items-center gap-1.5">
            <Building2
              strokeWidth={2.2}
              className="h-4 w-4 flex-shrink-0 text-green-400"
            />
            <span
              className="whitespace-nowrap text-[13px] font-semibold text-white/95"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              법원 방문 없음
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText
              strokeWidth={2.2}
              className="h-4 w-4 flex-shrink-0 text-green-400"
            />
            <span
              className="whitespace-nowrap text-[13px] font-semibold text-white/95"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              서류 비대면
            </span>
          </div>
        </div>

        {/* Apple Liquid Glass 박스 = 데스크탑 subtext + 입력+CTA + 모바일 보증금 캡션 + 데스크탑 강점. */}
        <div
          className="flex flex-col gap-3 lg:gap-8 w-full items-center rounded-[28px] px-6 py-6 lg:px-10 lg:py-8"
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
          {/* subtext 데스크탑 박스 안 (hidden lg:block 24px). */}
          <p
            className="hidden lg:block text-center text-[24px] font-medium leading-[1.6] text-white/90"
            style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)" }}
          >
            사건번호만 주시면, 법원은 저희가 갑니다.
          </p>

          {/* 입력+CTA 모바일 세로 분리 (lg:hidden / form). */}
          <form
            onSubmit={onSubmit}
            role="search"
            aria-label="사건번호 검색"
            className="lg:hidden flex flex-col gap-3 w-full"
          >
            <label htmlFor="hero-case-mobile" className="sr-only">
              사건번호
            </label>
            <input
              id="hero-case-mobile"
              type="text"
              inputMode="text"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="사건번호 입력 (예: 2026타경500459)"
              className="h-14 w-full rounded-2xl bg-white px-5 text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none shadow-md"
            />
            <button
              type="submit"
              className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[var(--brand-green)] text-[16px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2"
            >
              조회하기
            </button>
          </form>

          {/* 입력+CTA 데스크탑 통합 (hidden lg:flex / max-w 600 / v22 보존). */}
          <form
            onSubmit={onSubmit}
            role="search"
            aria-label="사건번호 검색"
            className="hidden lg:flex w-full max-w-[600px] items-center rounded-2xl bg-white p-1.5 shadow-md transition-shadow duration-200 focus-within:shadow-lg"
          >
            <label htmlFor="hero-case-desktop" className="sr-only">
              사건번호
            </label>
            <input
              id="hero-case-desktop"
              type="text"
              inputMode="text"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="사건번호 입력 (예: 2026타경500459)"
              className="h-16 flex-1 bg-transparent px-6 text-[18px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-16 items-center justify-center rounded-xl bg-[var(--brand-green)] px-12 text-[18px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2"
            >
              조회하기
            </button>
          </form>

          {/* 보증금 캡션 모바일 박스 안 (lg:hidden / Lock 14 + 13 white/80). */}
          <div className="lg:hidden flex items-center justify-center gap-1.5 mt-1">
            <Lock
              strokeWidth={2.2}
              className="h-3.5 w-3.5 flex-shrink-0 text-green-400"
            />
            <span className="whitespace-nowrap text-[13px] font-medium text-white/80">
              보증금 전용계좌로 분리 보관
            </span>
          </div>

          {/* 강점 3건 데스크탑 박스 안 가로 1행 (hidden lg:flex / v22 보존). */}
          <div className="hidden lg:flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Building2
                strokeWidth={2}
                className="h-5 w-5 flex-shrink-0 text-green-400"
              />
              <span className="whitespace-nowrap text-[15px] font-semibold text-white/95">
                법원 방문 없음
              </span>
            </div>
            <div className="h-5 w-px flex-shrink-0 bg-white/30" />
            <div className="flex items-center gap-2">
              <FileText
                strokeWidth={2}
                className="h-5 w-5 flex-shrink-0 text-green-400"
              />
              <span className="whitespace-nowrap text-[15px] font-semibold text-white/95">
                서류 비대면
              </span>
            </div>
            <div className="h-5 w-px flex-shrink-0 bg-white/30" />
            <div className="flex items-center gap-2">
              <Lock
                strokeWidth={2}
                className="h-5 w-5 flex-shrink-0 text-green-400"
              />
              <span className="whitespace-nowrap text-[15px] font-semibold text-white/95">
                보증금 전용계좌
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
