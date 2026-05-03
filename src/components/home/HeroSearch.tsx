"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, FileText, Lock, type LucideIcon } from "lucide-react";

/* Phase 1.2 (A-1-2) v17 — Hero (overlay 폐기 + 페이딩 폐기 + 박스 위로 ↑ + 칩 3건 + 여백 ↑).
 * 정정 6건 (Plan v17):
 * 1. 박스 투명도 ↓ (bg-white/85 → bg-white/55 / backdrop-blur-2xl → backdrop-blur-xl / border-white/40 → border-white/50)
 * 2. 영상 overlay (bg-white/15) 영구 폐기
 * 3. 하단 페이딩 (linear-gradient → #FAFAFA) 영구 폐기
 * 4. 박스 transform = -translate-y-12 lg:-translate-y-20 (위로 ↑)
 * 5. 칩 3건 ("공인중개사 직접 입찰" + "보증보험 필수 가입" + "중복 대리 금지" / 칩 1만 ping)
 * 6. 박스 padding/gap ↑ (px-8 py-12 lg:px-12 lg:py-16 / gap-8 lg:gap-10) */

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
    <section className="relative isolate flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-white lg:min-h-[calc(100vh-80px)]">
      {/* 1. 동영상 배경 (z-0 / overlay 영구 폐기 / 페이딩 영구 폐기). */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* 2. frosted glass 박스 (z-10 / 위로 ↑ / 투명도 ↓). */}
      <div className="relative z-10 w-full px-4 lg:px-6">
        <div
          className="mx-auto flex max-w-[720px] -translate-y-12 flex-col items-center justify-center gap-8 rounded-[32px] border border-white/50 bg-white/55 px-8 py-12 text-center backdrop-blur-xl lg:-translate-y-20 lg:gap-10 lg:px-12 lg:py-16"
          style={{ boxShadow: "0 32px 80px -16px rgba(0, 0, 0, 0.25)" }}
        >
          {/* 칩 3건 — flex-wrap + gap-2 + justify-center / 칩 1만 ping. */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* 칩 1 — ping 모션. */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-green)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-green)]" />
              </span>
              <span className="text-[13px] font-semibold tracking-tight text-gray-700">
                공인중개사 직접 입찰
              </span>
            </div>

            {/* 칩 2 — 정적. */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-green)]" />
              <span className="text-[13px] font-semibold tracking-tight text-gray-700">
                보증보험 필수 가입
              </span>
            </div>

            {/* 칩 3 — 정적. */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-green)]" />
              <span className="text-[13px] font-semibold tracking-tight text-gray-700">
                중복 대리 금지
              </span>
            </div>
          </div>

          {/* h1 (보존). */}
          <h1
            className="text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:text-[80px]"
            style={{ fontWeight: 800 }}
          >
            법원에 가지 않고,<br />
            <span className="text-[var(--brand-green)]">경매를 시작하다.</span>
          </h1>

          {/* subtext (보존). */}
          <p className="text-[18px] font-medium leading-[1.6] text-gray-700 lg:text-[24px]">
            사건번호만 주시면, 법원은 저희가 갑니다.
          </p>

          {/* 입력 박스 (v13 보존). */}
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
                className="inline-flex h-14 items-center justify-center rounded-xl bg-[var(--brand-green)] px-8 text-[16px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-16 lg:text-[18px]"
              >
                사건번호 입력하기
              </button>
            </form>
          </div>

          {/* 데스크탑 3 강점 (보존 / 모바일 0). */}
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
