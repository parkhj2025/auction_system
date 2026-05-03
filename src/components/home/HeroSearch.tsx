"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useMemo } from "react";
import { ShieldCheck, Building2, CheckCircle2 } from "lucide-react";

/* Phase 1.2 (A-1-2) v5 — Hero (형준님 리뷰 #1·#2·#3 + Opus #2·#3·#4·#5 광역 적용).
 * 좌측: h1 ("경매 입찰 대리" green 강조) + size 32/56 + subtext + 검색 카드 ("사건 의뢰하기") + Hero CTA row trust chip 3건.
 * 우측: Gemini hero-shield-courthouse.png (modern Korean courthouse + green shield + 노랑 motion).
 * 모바일: 검색 카드 위 작은 illustration (w-32 h-32).
 * grid: lg:grid-cols-[1.4fr_1fr] (좌 58% / 우 42%).
 * 노랑 trail 광역 폐기 (Brand 로고만 보존). */

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
    <section className="bg-[var(--bg-secondary)]">
      <div className="container-app pb-[var(--hero-py-bottom)] pt-[var(--hero-py-top)]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* 좌측 — h1 + subtext + 모바일 illustration + 검색 카드 + CTA row. */}
          <div>
            <h1
              className="text-[32px] font-extrabold leading-[1.25] tracking-[-0.025em] text-[var(--text-primary)] lg:text-[56px]"
              style={{ fontWeight: 800 }}
            >
              빠르고 안전한
              <br />
              <span className="text-[var(--brand-green)]">경매 입찰 대리</span>{" "}
              서비스
            </h1>

            <p className="mt-5 text-[16px] leading-[1.6] text-[var(--text-secondary)] lg:mt-6 lg:text-[18px]">
              전문가가 대신 입찰하고, 결과로 신뢰를 증명합니다.
            </p>

            {/* 모바일 illustration (Opus #3). 데스크탑 hide (우측 영역에서 표시). */}
            <div className="mt-8 flex justify-center lg:hidden">
              <Image
                src="/illustrations/hero-shield-courthouse.png"
                alt="modern courthouse with green shield"
                width={160}
                height={160}
                priority
                className="h-32 w-32 object-contain"
              />
            </div>

            {/* 검색 카드 통합 — input border 0 + green button + focus-within ring. */}
            <form
              onSubmit={onSubmit}
              role="search"
              aria-label="사건번호 검색"
              className="group/search mt-6 flex h-16 items-center rounded-2xl border border-[var(--border-1)] bg-white shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-200 focus-within:border-[var(--brand-green)] focus-within:shadow-[0_0_0_4px_rgba(0,200,83,0.12),var(--shadow-card)] lg:mt-8 lg:h-[68px]"
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
                사건 의뢰하기
              </button>
            </form>

            {/* Hero CTA row — trust chip 3건 (형준님 #3 + Opus #4). */}
            <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2.5">
              {[
                { icon: ShieldCheck, label: "서울보증보험" },
                { icon: Building2, label: "공인중개사" },
                { icon: CheckCircle2, label: "사고율 0%" },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-1)] bg-white px-3 py-1.5 text-[13px] font-semibold text-[var(--text-secondary)]"
                >
                  <Icon
                    size={14}
                    strokeWidth={2}
                    className="text-[var(--brand-green-deep)]"
                    aria-hidden="true"
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* 우측 — Gemini hero-shield-courthouse.png (Q4 / Opus #1·#5 노랑 trail 폐기). */}
          <div className="relative hidden aspect-square w-full max-w-[480px] justify-self-end lg:block">
            <Image
              src="/illustrations/hero-shield-courthouse.png"
              alt="modern Korean courthouse with green shield and white checkmark"
              width={480}
              height={480}
              priority
              sizes="(max-width: 1024px) 0px, 480px"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>

    </section>
  );
}
