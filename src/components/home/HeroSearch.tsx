"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, FileText, MapPin } from "lucide-react";
import { COURTS_ACTIVE, COURTS_COMING_SOON, FEES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Mode = "case" | "address";

/**
 * 히어로 검색 — 두 세그먼트 동시 지원.
 * - A: 사건번호 → /analysis?court=&case=
 * - B: 주소·단지명 → /analysis?q=
 * Phase 1은 /analysis 목록 페이지로 쿼리 전달. Phase 2에서 실시간 조회 API로 교체.
 * 검색 로직은 onSubmit 한 곳에 모아 두어 교체가 용이하다.
 */
export function HeroSearch() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("case");
  const [court, setCourt] = useState<string>(COURTS_ACTIVE[0].value);
  const [caseNumber, setCaseNumber] = useState("");
  const [keyword, setKeyword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (mode === "case") {
      if (court) params.set("court", court);
      if (caseNumber.trim()) params.set("case", caseNumber.trim());
    } else {
      if (keyword.trim()) params.set("q", keyword.trim());
    }
    const qs = params.toString();
    router.push(qs ? `/analysis?${qs}` : "/analysis");
  }

  return (
    <section className="relative overflow-hidden bg-brand-700 text-white">
      {/* 장식: 오른쪽 상단 원형 발광, 과하지 않게 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20">
        <p className="text-sm font-medium tracking-wide text-brand-100">
          법원 안 가는 부동산 경매 입찰 대리
        </p>
        <h1 className="mt-3 text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl">
          입찰은 맡기고,
          <br className="sm:hidden" /> 얼리버드{" "}
          <span className="text-[var(--color-accent-yellow)]">
            {(FEES.earlybird / 10000).toLocaleString("ko-KR")}만원
          </span>
          부터
        </h1>
        <p className="mt-4 max-w-xl text-brand-100">
          공인중개사·서울보증보험 가입. 패찰 시 보증금 전액 반환.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 rounded-[var(--radius-xl)] bg-white p-4 shadow-[var(--shadow-lift)] sm:p-5"
        >
          {/* 탭 */}
          <div
            role="tablist"
            aria-label="검색 방식"
            className="flex gap-1 rounded-[var(--radius-md)] bg-[var(--color-ink-100)] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "case"}
              onClick={() => setMode("case")}
              className={cn(
                "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-3 text-sm font-bold transition",
                mode === "case"
                  ? "bg-white text-[var(--color-ink-900)] shadow-[var(--shadow-card)]"
                  : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
              )}
            >
              <FileText size={16} aria-hidden="true" />
              사건번호로 찾기
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "address"}
              onClick={() => setMode("address")}
              className={cn(
                "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-3 text-sm font-bold transition",
                mode === "address"
                  ? "bg-white text-[var(--color-ink-900)] shadow-[var(--shadow-card)]"
                  : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
              )}
            >
              <MapPin size={16} aria-hidden="true" />
              주소·단지명으로 찾기
            </button>
          </div>

          {/* 입력 영역 */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            {mode === "case" ? (
              <>
                <label className="sr-only" htmlFor="hero-court">
                  법원 선택
                </label>
                <select
                  id="hero-court"
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  className="h-12 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-ink-900)] sm:w-48"
                >
                  <optgroup label="서비스 중">
                    {COURTS_ACTIVE.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="서비스 준비 중">
                    {COURTS_COMING_SOON.map((c) => (
                      <option key={c.value} value={c.value} disabled>
                        {c.label}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <label className="sr-only" htmlFor="hero-case">
                  사건번호
                </label>
                <input
                  id="hero-case"
                  type="text"
                  inputMode="text"
                  placeholder="예: 2021타경521675"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  className="h-12 flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-base text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
                />
              </>
            ) : (
              <>
                <label className="sr-only" htmlFor="hero-keyword">
                  주소 또는 단지명
                </label>
                <input
                  id="hero-keyword"
                  type="search"
                  inputMode="search"
                  placeholder="예: 인천 미추홀구 주안동 · 덕산하이츠"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="h-12 flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-base text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
                />
              </>
            )}

            <button
              type="submit"
              className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-6 text-base font-bold text-white shadow-[var(--shadow-card)] transition hover:bg-brand-700"
            >
              <Search size={18} aria-hidden="true" />
              찾아보기
            </button>
          </div>

          {/* 보조 설명 */}
          <p className="mt-3 text-xs text-[var(--color-ink-500)]">
            {mode === "case" ? (
              <>
                사건번호를 알고 계신 경우, 해당 물건 상세로 바로 이동합니다.
                <span className="mt-0.5 block">
                  수원·대전·부산·대구 법원은 오픈 예정입니다. 오픈 시 공지사항에서
                  안내드립니다.
                </span>
              </>
            ) : (
              "경매 초보자라면 지역이나 단지명으로 최신 분석을 찾아보세요."
            )}
          </p>
        </form>

        <p className="mt-6 text-sm text-brand-100">
          수수료 체계 ·{" "}
          <a
            href="#pricing"
            className="font-bold text-white underline decoration-brand-300 underline-offset-4 hover:decoration-white"
          >
            얼리버드 5만 · 일반 7만 · 급건 10만
          </a>
        </p>
      </div>
    </section>
  );
}
