"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

/* Phase 1.2 (A-1-2) v13 — Hero (mesh blob 3겹 비비드 + 입력 박스 비율 정정 + 4 카드 영구 폐기 + 1 column).
 * 정정 6건:
 * 1. 배경 = mesh blob 3겹 (green 0.45 / yellow 0.35 / green-light 0.30 / 부유 모션 40s/50s/60s)
 *    Aurora Background 영구 폐기 (옅음 NG)
 * 2. 입력 박스 비율 정정 (input flex-1 h-14/16 + button h-14/16 동일 + 컨테이너 max-w 600 + rounded-2xl shadow-md)
 * 3. 우측 4 카드 영구 폐기 (HeroDifferentiationGrid git rm)
 * 4. layout 1 column (모바일 + 데스크탑 동일 / 좌측 단독 max-w 800)
 * 5. h1 강제 line-break (lg+ only) 보존 + 44/80 보존
 * 6. CTA glow halo 보존 */

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
      {/* mesh blob 3겹 — 비비드 + 부유 모션 (모바일 + 데스크탑 동일). */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          aria-hidden="true"
          className="hero-mesh-blob-1 absolute"
          style={{
            top: "-10%",
            left: "-10%",
            width: "480px",
            height: "480px",
            background:
              "radial-gradient(circle, rgba(0, 200, 83, 0.45) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          aria-hidden="true"
          className="hero-mesh-blob-2 absolute"
          style={{
            top: "-5%",
            right: "-15%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(255, 212, 59, 0.35) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          aria-hidden="true"
          className="hero-mesh-blob-3 absolute"
          style={{
            bottom: "-15%",
            left: "20%",
            width: "360px",
            height: "360px",
            background:
              "radial-gradient(circle, rgba(110, 231, 183, 0.30) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
      </div>

      <div className="container-app relative z-10 py-16 lg:py-24">
        <div className="mx-auto max-w-[800px]">
          <h1
            className="text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:text-[80px]"
            style={{ fontWeight: 800 }}
          >
            법원에 가지 않고,<br className="hidden lg:inline" />{" "}
            <span className="text-[var(--brand-green)]">경매를 시작하다.</span>
          </h1>

          <p className="mt-5 text-[16px] font-medium leading-[1.6] text-[var(--text-secondary)] lg:mt-7 lg:text-[20px]">
            사건번호만 주시면, 법원은 저희가 갑니다.
          </p>

          {/* 입력 박스 — 비율 정정 (input + button h-14/16 동일 / max-w 600 / rounded-2xl shadow-md). */}
          <div className="relative mt-8 max-w-[600px] lg:mt-10">
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
      </div>
    </section>
  );
}
