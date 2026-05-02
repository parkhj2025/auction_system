"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";

/* Phase 1.2 (A-1) — Hero · 모노톤 화이트 + 앱 스타일 + 인라인 사건번호 검색.
 * 본질:
 *  - 배경 흰 #FFFFFF (Aurora 폐기)
 *  - eyebrow → 본 cycle 색 보류 (text-tertiary 모노톤)
 *  - h1 단색 짙은 잉크 (lavender 그라데이션 폐기)
 *  - 인라인 사건번호 검색 input + "입찰 대리 시작" 버튼 (Phase 0.1 폐기 본질 부활)
 *  - CTA secondary "경매 인사이트 보기" → /analysis
 *  - 신뢰 strip 3건 (glass-pill 폐기 → 평평한 회색 chip)
 *  - floating card / network SVG / video-label 폐기
 *
 * 검색 분기 (client-side 사전 매칭):
 *  - 사건번호 NFC 정규화 + caseNumbers props 매칭
 *  - 매칭 → /analysis/[case] router.push
 *  - 미매칭 (사건번호 패턴) → /apply?case= router.push
 *  - 미매칭 (패턴 외) → /apply?case= 그대로 (서버 redirect 처리) */

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
    <section className="bg-[var(--bg-primary)] border-b border-[var(--border-1)]">
      <div className="container-app pb-[var(--hero-py-bottom)] pt-[var(--hero-py-top)]">
        <div className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* 좌측 카피 + 검색 + 신뢰 strip. */}
          <div>
            <p className="section-eyebrow">
              법원 안 가는 부동산 경매 입찰 대리
            </p>

            <h1 className="text-h1 mt-4 text-[var(--text-primary)]">
              입찰은 맡기고,
              <br />
              물건 보는 시간을 버세요
            </h1>

            <p className="text-body-lg mt-4 max-w-xl text-[var(--text-secondary)]">
              공인중개사·서울보증보험 가입. 입찰보증금 사고율 0%.
            </p>

            {/* 인라인 사건번호 검색 — input + 버튼. */}
            <form
              onSubmit={onSubmit}
              className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-stretch"
              role="search"
              aria-label="사건번호 검색"
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
                placeholder="사건번호를 입력하세요 (예: 2026타경500459)"
                className="h-10 flex-1 rounded-lg border border-[var(--border-1)] bg-white px-3.5 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none transition-colors focus:border-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]/10 lg:h-11 lg:px-4"
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--text-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]/30 focus-visible:ring-offset-2 lg:h-11 lg:px-6 lg:text-[15px]"
              >
                입찰 대리 시작
              </button>
            </form>

            <Link
              href="/analysis"
              className="text-body-sm mt-4 inline-flex items-center gap-1 font-medium text-[var(--text-primary)] hover:underline"
            >
              경매 인사이트 보기 →
            </Link>

            {/* 신뢰 strip 3건 — 모노톤 회색 chip. */}
            <div className="mt-10 flex flex-wrap gap-2">
              {["공인 자격", "사고율 0%", "보증보험 의무 가입"].map((label) => (
                <span
                  key={label}
                  className="text-meta inline-flex h-7 items-center rounded-full bg-[var(--bg-secondary)] border border-[var(--border-1)] px-3 text-[var(--text-secondary)]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* 우측 — 본 cycle 비움 (floating card / network SVG / video-label 폐기). */}
          <div aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
