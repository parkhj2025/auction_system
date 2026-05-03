"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Building2, FileText, Lock } from "lucide-react";

/* Phase 1.2 (A-1-2) v15 — Hero (동영상 배경 + center 정렬 + 칩 + 데스크탑 3 강점 1행).
 * 정정 9건:
 * 1. 동영상 배경 /videos/hero-bg.mp4 (autoplay muted loop playsInline / object-cover / z-0)
 * 2. 가독성 overlay bg-white/30 + 하단 페이딩 white linear-gradient (z-1)
 * 3. center 정렬 단독 (max-w 800 / text-center / items-center)
 * 4. 칩 = "공인중개사 직접 입찰" + ping 점 green (white/80 + backdrop-blur-sm + rounded-full)
 * 5. h1 + subtext (v14 보존) + 입력 박스 (v13 보존 max-w 600 + p-1.5 + rounded-2xl shadow-md)
 * 6. 데스크탑 3 강점 1행 (Lucide 20px green + 라벨 15px) — hidden lg:flex
 * 7. 모바일 우측 분석 카드 영역 0 / Hero 4 카드 영역 0 (영구 폐기) */

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
    <section className="relative isolate flex min-h-[80vh] items-center justify-center overflow-hidden bg-white lg:min-h-[90vh]">
      {/* 1. 동영상 배경 (z-0). */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* 2. 가독성 overlay (z-1 / white 30%). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-white/30"
      />

      {/* 3. 하단 페이딩 → white (z-1 / h-40% bottom-0). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[40%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.6) 50%, #FFFFFF 100%)",
        }}
      />

      {/* 4. 콘텐츠 center (z-10 / max-w 800). */}
      <div className="container-app relative z-10 mx-auto flex max-w-[800px] flex-col items-center gap-8 py-24 text-center lg:gap-12 lg:py-32">
        {/* 4-1. 칩 — "공인중개사 직접 입찰" + ping 점 green. */}
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/60 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-green)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-green)]" />
          </span>
          <span className="text-[13px] font-semibold tracking-tight text-gray-700">
            공인중개사 직접 입찰
          </span>
        </div>

        {/* 4-2. h1 (v14 보존). */}
        <h1
          className="text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:text-[80px]"
          style={{ fontWeight: 800 }}
        >
          법원에 가지 않고,<br />
          <span className="text-[var(--brand-green)]">경매를 시작하다.</span>
        </h1>

        {/* 4-3. subtext (v14 보존). */}
        <p className="text-[18px] font-medium leading-[1.6] text-gray-700 lg:text-[24px]">
          사건번호만 주시면, 법원은 저희가 갑니다.
        </p>

        {/* 4-4. 입력 박스 (v13 보존). */}
        <div className="relative w-full max-w-[600px]">
          <div
            aria-hidden="true"
            className="cta-glow-pulse pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-2xl"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--brand-green) 0%, transparent 70%)",
            }}
          />
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
              className="inline-flex h-14 items-center justify-center rounded-xl bg-[var(--brand-green)] px-8 text-[16px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-16 lg:text-[18px]"
            >
              사건번호 입력하기
            </button>
          </form>
        </div>

        {/* 4-5. 데스크탑 3 강점 1행 (모바일 0). */}
        <div className="mt-4 hidden items-center gap-12 lg:flex">
          <div className="flex items-center gap-3">
            <Building2 size={20} className="text-[var(--brand-green)]" strokeWidth={2} />
            <span className="text-[15px] font-semibold text-gray-700">
              법원 방문 0회
            </span>
          </div>
          <div className="h-5 w-px bg-gray-300" />
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-[var(--brand-green)]" strokeWidth={2} />
            <span className="text-[15px] font-semibold text-gray-700">
              서류 비대면 100%
            </span>
          </div>
          <div className="h-5 w-px bg-gray-300" />
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-[var(--brand-green)]" strokeWidth={2} />
            <span className="text-[15px] font-semibold text-gray-700">
              보증금 분리 보관
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
