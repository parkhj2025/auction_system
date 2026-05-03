"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { HeroBackground } from "./HeroBackground";

/* Phase 1.2 (A-1-2) v6 — Hero (typography-driven dark + mesh gradient + glass search card).
 * 일러스트 광역 폐기 / trust chip 광역 폐기 (Trust section 통합).
 * h1 "5만원, 인천 경매 입찰 다 됩니다." (v4 카피).
 * subtext "사건번호만 주시면, 법원은 저희가 갑니다."
 * 검색 CTA "사건번호 입력하기".
 * 시각: charcoal dark + animated mesh gradient + glass card 중앙. */

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
    <section className="relative isolate overflow-hidden text-white">
      <HeroBackground />

      <div className="container-app relative z-10 flex min-h-[640px] flex-col items-center justify-center py-24 text-center lg:min-h-[720px] lg:py-32">
        {/* h1 광역 정수 + subtext. */}
        <h1
          className="text-[44px] font-extrabold leading-[1.1] tracking-[-0.03em] text-white lg:text-[72px]"
          style={{ fontWeight: 800 }}
        >
          <span className="text-[var(--brand-green)]">5만원</span>, 인천 경매
          <br className="hidden sm:block" />
          입찰 다 됩니다.
        </h1>

        <p className="mt-5 max-w-xl text-[17px] leading-[1.6] text-white/70 lg:mt-7 lg:text-[19px]">
          사건번호만 주시면, 법원은 저희가 갑니다.
        </p>

        {/* glass search card — backdrop-blur + 미세 border + green focus. */}
        <form
          onSubmit={onSubmit}
          role="search"
          aria-label="사건번호 검색"
          className="group/search mt-10 flex h-16 w-full max-w-2xl items-center rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-[border-color,box-shadow] duration-200 focus-within:border-[var(--brand-green)] focus-within:bg-white/[0.08] focus-within:shadow-[0_0_0_4px_rgba(0,200,83,0.18),0_8px_32px_rgba(0,0,0,0.32)] lg:h-[72px]"
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
            className="h-full flex-1 bg-transparent pl-5 pr-2 text-[15px] text-white placeholder:text-white/40 outline-none lg:pl-6 lg:text-[16px]"
          />
          <button
            type="submit"
            className="mr-1.5 inline-flex h-13 items-center justify-center rounded-[14px] bg-[var(--brand-green)] px-5 text-[14px] font-bold text-white shadow-[var(--shadow-button-green)] transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418] lg:h-14 lg:px-6 lg:text-[15px]"
          >
            사건번호 입력하기
          </button>
        </form>
      </div>
    </section>
  );
}
