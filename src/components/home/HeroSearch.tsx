"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, FileText, Lock, type LucideIcon } from "lucide-react";

/* Phase 1.2 (A-1-2) v18 — Hero (h1 + subtext 영상 위 직접 / 박스 = 입력 + 강점 단독).
 * 정정 8건 (Plan v18):
 * 1. section flex = flex-col items-center justify-center
 * 2. 콘텐츠 광역 vertical stack (gap-10 lg:gap-14 / max-w 800)
 * 3. h1 영상 위 직접 표시 (white + green + glow / 박스 진입 0)
 * 4. subtext 영상 위 직접 표시 (white/90 + glow / 박스 진입 0)
 * 5. frosted glass 박스 = 입력 + 데스크탑 3 강점 + 모바일 carousel 단독
 * 6. CTA 버튼 카피 단축 + px-10 lg:px-12
 * 7. 신뢰 칩 3건 진입 0 (Trust 섹션 caption 정합 보존)
 * 8. 박스 transform translate-y 폐기 + padding ↓ + 모서리 28 */

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
    <section className="relative isolate flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden bg-white px-4 lg:min-h-[calc(100vh-80px)] lg:px-6">
      {/* 1. 동영상 배경 (z-0 / overlay 0 / 페이딩 0). */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* 2. 콘텐츠 광역 vertical stack (z-10 / h1 + subtext + 박스). */}
      <div className="relative z-10 flex w-full max-w-[800px] flex-col items-center gap-10 text-center lg:gap-14">
        {/* h1 영상 위 직접 표시 — white + green + glow. */}
        <h1
          className="text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-white [text-wrap:balance] lg:text-[80px]"
          style={{
            fontWeight: 800,
            textShadow:
              "0 4px 24px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)",
          }}
        >
          법원에 가지 않고,<br />
          <span
            className="text-[var(--brand-green)]"
            style={{
              textShadow:
                "0 0 32px rgba(0, 200, 83, 0.7), 0 0 64px rgba(0, 200, 83, 0.5), 0 4px 16px rgba(0, 0, 0, 0.5)",
            }}
          >
            경매를 시작하다.
          </span>
        </h1>

        {/* subtext 영상 위 직접 표시 — white/90 + glow. */}
        <p
          className="text-[18px] font-medium leading-[1.6] text-white/90 lg:text-[24px]"
          style={{
            textShadow:
              "0 2px 12px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          사건번호만 주시면, 법원은 저희가 갑니다.
        </p>

        {/* frosted glass 박스 = 입력 + 데스크탑 3 강점 + 모바일 carousel 단독. */}
        <div
          className="flex w-full flex-col items-center gap-6 rounded-[28px] border border-white/50 bg-white/55 px-6 py-6 backdrop-blur-xl lg:gap-8 lg:px-10 lg:py-8"
          style={{ boxShadow: "0 32px 80px -16px rgba(0, 0, 0, 0.25)" }}
        >
          {/* 입력 박스 — "조회하기" 단축. */}
          <div className="relative w-full max-w-[600px]">
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
                className="inline-flex h-14 items-center justify-center rounded-xl bg-[var(--brand-green)] px-10 text-[16px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-16 lg:px-12 lg:text-[18px]"
              >
                조회하기
              </button>
            </form>
          </div>

          {/* 데스크탑 3 강점 (lg:flex / 모바일 0). */}
          <div className="hidden items-center gap-12 lg:flex">
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

          {/* 모바일 carousel (보존 / lg:hidden). */}
          <div className="w-full lg:hidden">
            <HeroMobileCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}

/* HeroMobileCarousel — Hero 박스 안 모바일 only (lg:hidden / height 80px / 4초 자동). */
type Strength = {
  icon: LucideIcon;
  label: string;
  body: string;
};

const STRENGTHS: Strength[] = [
  { icon: Building2, label: "법원 방문 0회", body: "신청 후 결과만 받습니다." },
  { icon: FileText, label: "서류 비대면 100%", body: "위임장부터 입찰표까지." },
  { icon: Lock, label: "보증금 분리 보관", body: "전용 계좌 + 보증보험." },
];

function HeroMobileCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % STRENGTHS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = STRENGTHS[index];
  const Icon = current.icon;

  return (
    <div
      className="relative h-[80px] w-full"
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center gap-3"
        >
          <Icon size={24} strokeWidth={2} className="shrink-0 text-[var(--brand-green)]" />
          <div className="flex flex-col items-start">
            <span className="text-[15px] font-bold text-gray-900">{current.label}</span>
            <span className="text-[12px] text-gray-600">{current.body}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {STRENGTHS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === index ? "h-2 w-6 bg-[var(--brand-green)]" : "h-2 w-2 bg-gray-300"
            }`}
            aria-label={`강점 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
