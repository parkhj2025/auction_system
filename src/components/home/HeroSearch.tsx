"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { motion } from "motion/react";

/* Phase 1.2 (A-1-2) v14 — Hero (mesh blob 4겹 비비드 강화 + 분석 카드 mockup + 4 카드 영구 폐기).
 * 정정 5건:
 * 1. 배경 mesh blob 4겹 (green 0.85 + yellow 0.65 + green-light 0.55 + green-deep 0.50 / blur 50-80px / 모션 25-40s)
 *    v13 3겹 / opacity 0.45 / blur 80-120px = 옅음 NG → 4겹 + 강한 색감 + 큰 blob + 짧은 blur
 * 2. 우측 분석 카드 mockup (데스크탑 only / 사건번호 → 분석 결과 흐름 / rotate -3deg + hover scale 1.02)
 * 3. 차별화 grid 영구 폐기 (해당 컴포넌트 import 0 / Hero 4 라벨 카피 영역 진입 0)
 * 4. 좌측 max-w 640 + h1 line-break + 입력 박스 v13 보존 (max-w 600 + p-1.5 + rounded-2xl shadow-md)
 * 5. 모바일 우측 카드 0 (hidden lg:flex) + 좌측 단독 layout */

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
    <section className="relative isolate overflow-hidden bg-white">
      {/* Hero 배경 mesh blob 4겹 (비비드 강화 / 큰 blob + 짧은 blur + 강한 opacity). */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          aria-hidden="true"
          className="hero-mesh-blob-1 absolute"
          style={{
            top: "-15%",
            left: "-15%",
            width: "640px",
            height: "640px",
            background:
              "radial-gradient(circle, rgba(0, 200, 83, 0.85) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div
          aria-hidden="true"
          className="hero-mesh-blob-2 absolute"
          style={{
            top: "-10%",
            right: "-10%",
            width: "560px",
            height: "560px",
            background:
              "radial-gradient(circle, rgba(255, 212, 59, 0.65) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          aria-hidden="true"
          className="hero-mesh-blob-3 absolute"
          style={{
            bottom: "-15%",
            left: "15%",
            width: "520px",
            height: "520px",
            background:
              "radial-gradient(circle, rgba(110, 231, 183, 0.55) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          aria-hidden="true"
          className="hero-mesh-blob-4 absolute"
          style={{
            top: "35%",
            left: "45%",
            width: "480px",
            height: "480px",
            background:
              "radial-gradient(circle, rgba(0, 136, 56, 0.50) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="container-app relative z-10 min-h-[80vh] py-24 lg:min-h-[90vh] lg:py-32">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* 좌측 — h1 + subtext + 입력 박스 (모바일 + 데스크탑 동일). */}
          <div className="z-10 max-w-[640px] flex-1 space-y-8 lg:space-y-10">
            <h1
              className="text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:text-[80px]"
              style={{ fontWeight: 800 }}
            >
              법원에 가지 않고,<br />
              <span className="text-[var(--brand-green)]">경매를 시작하다.</span>
            </h1>

            <p className="text-[18px] font-medium leading-[1.6] text-[var(--text-secondary)] lg:text-[24px]">
              사건번호만 주시면, 법원은 저희가 갑니다.
            </p>

            {/* 입력 박스 (v13 보존 — max-w 600 + p-1.5 + rounded-2xl shadow-md). */}
            <div className="relative max-w-[600px]">
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
          </div>

          {/* 우측 분석 카드 mockup (데스크탑 only / 모바일 0). */}
          <div className="hidden max-w-[560px] flex-1 items-center justify-center lg:flex">
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="flex h-[480px] w-[400px] flex-col justify-between rounded-3xl bg-white p-8"
              style={{ boxShadow: "0 24px 60px rgba(0, 0, 0, 0.15)" }}
            >
              {/* 헤더. */}
              <div className="space-y-3">
                <div className="text-[12px] font-bold tracking-wider text-[var(--brand-green)]">
                  분석 결과
                </div>
                <div className="text-[20px] font-bold leading-tight text-gray-900">
                  2026타경500459
                </div>
                <div className="text-[14px] text-gray-600">
                  미추홀구 오피스텔
                </div>
              </div>

              {/* 가격 영역. */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[14px] text-gray-600">감정가</span>
                  <span className="text-[18px] font-bold text-gray-900">
                    1억 8,500만원
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[14px] text-gray-600">최저가 (49%)</span>
                  <span className="text-[24px] font-bold text-[var(--brand-green)]">
                    9,100만원
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[14px] text-gray-600">유찰 횟수</span>
                  <span className="text-[16px] font-bold text-gray-900">4회</span>
                </div>
              </div>

              {/* 권리 영역. */}
              <div className="space-y-2 rounded-2xl bg-gray-50 p-4">
                <div className="text-[12px] font-bold tracking-wider text-gray-500">
                  권리 영역
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="text-[14px] text-gray-700">
                    HUG 말소동의 1건
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="text-[14px] text-gray-700">
                    임차보증금 인수 1건
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
