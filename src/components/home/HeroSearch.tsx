"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Building2, FileText, Lock } from "lucide-react";

/* Phase 1.2 (A-1-2) v28 — Hero 마지막 정정 (Hero 섹션 마무리 게이트).
 * 정정 3건 (Plan v28):
 * 1. h1 모바일 48 → 44 (자동 줄바꿈 0)
 * 2. 글래스 background rgba 0.25/0.12 → 0.35/0.20 (영상 발현 ↓ / 번쩍거림 약 50% ↓)
 * 3. 강점 컨테이너 음수 margin 폐기 (vstack gap-6 광범위 균등 / subtext 위/아래 여백 정합) */

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
    <section className="relative isolate flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center overflow-hidden bg-white px-6 lg:min-h-[calc(100dvh-80px)] lg:px-6">
      {/* 동영상 배경 (z-0 / overlay 0 / 페이딩 0 / query 증분 캐시 무효). */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4?v=3" type="video/mp4" />
      </video>

      {/* vstack — h1 + 모바일 subtext + 모바일 강점 + 박스. */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 lg:gap-14 w-full max-w-[800px]">
        {/* h1 (모바일 60px / 데스크탑 80px 보존). */}
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
            를 시작하세요.
          </span>
        </h1>

        {/* subtext 모바일 박스 밖 (17px). */}
        <p
          className="lg:hidden text-[17px] text-white/90 font-medium leading-[1.6] text-center"
          style={{
            textShadow:
              "0 2px 12px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          사건번호만 주시면, 법원은 저희가 갑니다.
        </p>

        {/* 강점 2건 모바일 박스 밖 (외부 gap-7 / 내부 gap-2 / 아이콘 18 / 라벨 14px). */}
        <div className="lg:hidden flex items-center justify-center gap-7">
          <div className="flex items-center gap-2">
            <Building2
              strokeWidth={2.2}
              className="w-[18px] h-[18px] flex-shrink-0 text-green-400"
            />
            <span
              className="text-[14px] text-white/95 font-semibold whitespace-nowrap"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              법원 방문 없음
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText
              strokeWidth={2.2}
              className="w-[18px] h-[18px] flex-shrink-0 text-green-400"
            />
            <span
              className="text-[14px] text-white/95 font-semibold whitespace-nowrap"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              서류 비대면
            </span>
          </div>
        </div>

        {/* Apple Liquid Glass 박스 (박스 padding py-7 / 박스 안 gap-4 / 데스크탑 보존). */}
        <div
          className="flex flex-col gap-5 lg:gap-8 w-full items-center rounded-[28px] px-6 py-7 lg:px-10 lg:py-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.20) 100%)",
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

          {/* 입력+CTA 모바일 세로 분리 + 넛지 (lg:hidden / form / 입력 h-16 / CTA h-16 / 넛지 15px). */}
          <form
            onSubmit={onSubmit}
            role="search"
            aria-label="사건번호 검색"
            className="lg:hidden flex flex-col gap-3 w-full"
          >
            <label htmlFor="hero-case-mobile" className="sr-only">
              사건번호
            </label>
            <p className="text-[15px] text-white/85 font-medium text-center">
              사건번호로 시작해보세요
            </p>
            <input
              id="hero-case-mobile"
              type="text"
              inputMode="text"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="사건번호 입력 (예: 2026타경500459)"
              className="w-full h-16 rounded-2xl bg-white px-5 text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none shadow-md"
            />
            <button
              type="submit"
              className="w-full h-16 rounded-2xl bg-[var(--brand-green)] inline-flex items-center justify-center text-[16px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2"
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

          {/* 보증금 캡션 모바일 박스 안 (gap-2 / Lock 16 / 라벨 14px). */}
          <div className="lg:hidden flex items-center justify-center gap-2 mt-1">
            <Lock
              strokeWidth={2.2}
              className="w-4 h-4 flex-shrink-0 text-green-400"
            />
            <span className="text-[14px] text-white/80 font-medium whitespace-nowrap">
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
