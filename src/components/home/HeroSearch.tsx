"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useMemo } from "react";

/* Phase 1.2 (A-1-2) v7 — Hero (h1 v5 + Manako hero-infographic + 1.2fr/1fr).
 * h1 "법원에 가지 않고, 경매를 시작하다." (지역·가격 광역 폐기)
 * subtext "사건번호만 주시면, 법원은 저희가 갑니다."
 * 검색 CTA "사건번호 입력하기"
 * 우측: Manako-style hero-infographic.png (캐릭터 + 사무실 + green) */

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
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#E6FAEE] via-white to-white">
      <div className="container-app py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          {/* 좌측 — h1 + subtext + 검색 카드. */}
          <div>
            <h1
              className="text-[48px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)] lg:text-[80px]"
              style={{ fontWeight: 800 }}
            >
              법원에 가지 않고,
              <br />
              <span className="text-[var(--brand-green)]">경매를 시작하다.</span>
            </h1>

            <p className="mt-6 text-[17px] font-medium leading-[1.6] text-[var(--text-secondary)] lg:mt-8 lg:text-[19px]">
              사건번호만 주시면, 법원은 저희가 갑니다.
            </p>

            {/* 검색 카드. */}
            <form
              onSubmit={onSubmit}
              role="search"
              aria-label="사건번호 검색"
              className="group/search mt-8 flex h-16 max-w-xl items-center rounded-2xl border border-[var(--border-1)] bg-white shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-200 focus-within:border-[var(--brand-green)] focus-within:shadow-[0_0_0_4px_rgba(0,200,83,0.12),var(--shadow-card)] lg:mt-10 lg:h-[72px]"
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

          {/* 우측 — Manako hero-infographic (캐릭터 + 사무실). */}
          <div className="relative aspect-square w-full max-w-[560px] justify-self-center lg:justify-self-end">
            <Image
              src="/illustrations/hero-infographic.png"
              alt="홈에서 노트북으로 경매 입찰을 시작하는 사람"
              width={560}
              height={560}
              priority
              sizes="(max-width: 1024px) 90vw, 560px"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
