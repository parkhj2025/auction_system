"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";

/* Phase 1.2 (A-1-2) v2 — Hero · 카피 광역 압축 + 콘텐츠 카드 1건 신규.
 * 변경:
 *  - eyebrow "법원 안 가는 부동산 경매 입찰 대리" 폐기 (h1으로 표현)
 *  - h1 "입찰은 맡기고, 물건 보는 시간을 버세요" → "법원 안 가도, 경매 입찰, 됩니다" (압축)
 *  - subtext "공인중개사·서울보증보험 가입. 입찰보증금 사고율 0%." → "수수료 5만원부터. 사고율 0%." (1줄)
 *  - 검색 버튼 "입찰 대리 시작 →" → "입찰 대리 시작" (화살표 폐기)
 *  - trust chip 3건 폐기 (subtext 흡수)
 *  - 우측 콘텐츠 카드 1건 신규 (카드뉴스 본질 — 썸네일 SVG + 카테고리 chip + 제목 + 짧은 설명) */

type Featured = {
  slug: string;
  title: string;
  subtitle?: string;
  caseNumber: string;
  address: string;
} | null;

export function HeroSearch({
  caseNumbers,
  featured,
}: {
  caseNumbers: string[];
  featured: Featured;
}) {
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
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* 좌측 — 카피 + 검색. */}
          <div>
            <h1 className="text-display text-[var(--text-primary)]">
              법원 안 가도,
              <br />
              경매 입찰, 됩니다
            </h1>

            <p className="text-body-lg mt-5 text-[var(--text-secondary)]">
              수수료 5만원부터. 사고율 0%.
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
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
                className="h-14 flex-1 rounded-xl border border-[var(--border-1)] bg-white px-5 text-[17px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none transition-colors focus:border-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]/10"
              />
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-lg bg-[var(--button-bg)] px-6 text-[17px] font-[590] text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]/30 focus-visible:ring-offset-2"
              >
                입찰 대리 시작
              </button>
            </form>

            <Link
              href="/analysis"
              className="text-body-sm mt-5 inline-flex items-center gap-1 font-medium text-[var(--text-primary)] hover:underline"
            >
              경매 인사이트 보기 →
            </Link>
          </div>

          {/* 우측 — Featured 콘텐츠 카드 1건 (카드뉴스 본질). */}
          {featured && (
            <Link
              href={`/analysis/${featured.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border-1)] bg-white transition-[transform,box-shadow] duration-[250ms] ease-out hover:-translate-y-0.5 hover:scale-[1.005] hover:shadow-sm"
              aria-label={`${featured.title} 분석 자료 보기`}
            >
              {/* 썸네일 영역 16:9 — inline SVG 도시 silhouette 본질. */}
              <div className="relative aspect-[16/9] overflow-hidden bg-[var(--bg-secondary)]">
                <svg
                  viewBox="0 0 320 180"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  aria-hidden="true"
                  preserveAspectRatio="xMidYMid slice"
                >
                  {/* 배경 그라데이션 */}
                  <rect width="320" height="180" fill="#FAFAFA" />
                  {/* 도시 silhouette (건물 5개) */}
                  <g fill="#E4E4E7">
                    <rect x="20" y="100" width="36" height="80" />
                    <rect x="62" y="80" width="42" height="100" />
                    <rect x="110" y="60" width="50" height="120" />
                    <rect x="166" y="90" width="40" height="90" />
                    <rect x="212" y="70" width="48" height="110" />
                    <rect x="266" y="105" width="34" height="75" />
                  </g>
                  {/* 건물 창 (도트) */}
                  <g fill="#D4D4D8">
                    <rect x="120" y="78" width="6" height="6" />
                    <rect x="135" y="78" width="6" height="6" />
                    <rect x="120" y="93" width="6" height="6" />
                    <rect x="135" y="93" width="6" height="6" />
                    <rect x="222" y="88" width="6" height="6" />
                    <rect x="237" y="88" width="6" height="6" />
                    <rect x="247" y="88" width="6" height="6" />
                    <rect x="222" y="103" width="6" height="6" />
                    <rect x="237" y="103" width="6" height="6" />
                  </g>
                  {/* 위치 핀 */}
                  <g transform="translate(160 50)">
                    <circle cx="0" cy="0" r="14" fill="#18181B" />
                    <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
                    <path d="M0 14 L0 30" stroke="#18181B" strokeWidth="3" />
                  </g>
                </svg>
              </div>

              {/* 본문. */}
              <div className="flex flex-col gap-3 p-6">
                <span className="text-meta inline-flex h-6 w-fit items-center rounded-full border border-[var(--border-1)] bg-[var(--bg-secondary)] px-2.5 text-[var(--text-secondary)]">
                  무료 물건분석
                </span>
                <h3 className="text-h3 text-[var(--text-primary)] group-hover:underline">
                  {featured.title}
                </h3>
                {featured.subtitle && (
                  <p className="text-body-sm line-clamp-2 text-[var(--text-secondary)]">
                    {featured.subtitle}
                  </p>
                )}
                <p className="text-meta text-[var(--text-tertiary)]">
                  {featured.caseNumber} · {featured.address}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
