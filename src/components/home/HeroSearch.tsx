"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, FileText, Lock, type LucideIcon } from "lucide-react";

/* Phase 1.2 (A-1-2) v19 — Hero (yellow 경매 + subtext 박스 안 + Apple Liquid Glass + 흰색 톤 통일).
 * 정정 6건 (Plan v19):
 * 1. h1 "경매" span yellow #FFD43B + yellow halo / "를 시작하다." white + 검정 backdrop
 * 2. subtext 위치 = vertical stack → 박스 안 최상단 (영상 위 직접 폐기)
 * 3. 박스 = Apple Liquid Glass (frosted glass className 폐기 / inline style 광역)
 * 4. 박스 안 subtext font-size 16/24 + text-white/90 + 약화 textShadow
 * 5. 데스크탑 3 강점 흰색 톤 (라벨 white/95 + 아이콘 green-400 + divider white/30)
 * 6. 모바일 carousel 흰색 톤 (라벨 white/95 + body white/70 + 아이콘 green-400 + dots white) */

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

      {/* 2. 콘텐츠 광역 vertical stack (z-10 / h1 + 박스). */}
      <div className="relative z-10 flex w-full max-w-[800px] flex-col items-center gap-10 text-center lg:gap-14">
        {/* h1 영상 위 직접 표시 — "경매" yellow + halo / 첫 줄 white + 검정 backdrop. */}
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
            style={{
              color: "#FFD43B",
              textShadow:
                "0 0 32px rgba(255, 212, 59, 0.7), 0 0 64px rgba(255, 212, 59, 0.5), 0 4px 16px rgba(0, 0, 0, 0.5)",
            }}
          >
            경매
          </span>
          <span
            className="text-white"
            style={{
              textShadow:
                "0 4px 24px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)",
            }}
          >
            를 시작하다.
          </span>
        </h1>

        {/* Apple Liquid Glass 박스 = subtext + 입력 + 데스크탑 3 강점 + 모바일 carousel. */}
        <div
          className="flex w-full flex-col items-center gap-6 rounded-[28px] px-6 py-6 lg:gap-8 lg:px-10 lg:py-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 100%)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 32px 80px -16px rgba(0, 0, 0, 0.35)",
          }}
        >
          {/* subtext 박스 안 진입 — text-white/90 + font-medium + 약화 textShadow. */}
          <p
            className="text-center text-[16px] font-medium leading-[1.6] text-white/90 lg:text-[24px]"
            style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)" }}
          >
            사건번호만 주시면, 법원은 저희가 갑니다.
          </p>

          {/* 입력 박스 — "조회하기" 보존. */}
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

          {/* 데스크탑 3 강점 (lg:flex / 모바일 0) — 흰색 톤. */}
          <div className="hidden items-center gap-12 lg:flex">
            <div className="flex items-center gap-3">
              <Building2 size={20} className="text-green-400" strokeWidth={2} />
              <span className="text-[15px] font-semibold text-white/95">
                법원 방문 0회
              </span>
            </div>
            <div className="h-5 w-px bg-white/30" />
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-green-400" strokeWidth={2} />
              <span className="text-[15px] font-semibold text-white/95">
                서류 비대면 100%
              </span>
            </div>
            <div className="h-5 w-px bg-white/30" />
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-green-400" strokeWidth={2} />
              <span className="text-[15px] font-semibold text-white/95">
                보증금 분리 보관
              </span>
            </div>
          </div>

          {/* 모바일 carousel (lg:hidden) — 흰색 톤. */}
          <div className="w-full lg:hidden">
            <HeroMobileCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}

/* HeroMobileCarousel — Hero 박스 안 모바일 only (lg:hidden / height 80px / 4초 자동 / 흰색 톤). */
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
          <Icon size={24} strokeWidth={2} className="shrink-0 text-green-400" />
          <div className="flex flex-col items-start">
            <span className="text-[15px] font-bold text-white/95">{current.label}</span>
            <span className="text-[12px] text-white/70">{current.body}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {STRENGTHS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === index ? "h-2 w-6 bg-white" : "h-2 w-2 bg-white/30"
            }`}
            aria-label={`강점 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
