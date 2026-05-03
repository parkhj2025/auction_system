"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Building2, FileText, Lock, type LucideIcon } from "lucide-react";

/* Phase 1.2 (A-1-2) v15 — StrengthsCarousel (모바일 only / lg:hidden / Hero 직 아래).
 * Features 섹션 영구 폐기 정합 — 3 강점 carousel paradigm 신규.
 * 자동 전환 4000ms + AnimatePresence mode wait + initial x +60 / animate x 0 / exit x -60.
 * hover 일시정지 + dot navigation. */

type Strength = {
  icon: LucideIcon;
  bigNumber: string;
  label: string;
  body: string;
};

const STRENGTHS: Strength[] = [
  {
    icon: Building2,
    bigNumber: "0회",
    label: "법원 방문",
    body: "신청 후 결과만 알림으로 받습니다.",
  },
  {
    icon: FileText,
    bigNumber: "100%",
    label: "서류 비대면 처리",
    body: "위임장부터 입찰표까지 모바일로.",
  },
  {
    icon: Lock,
    bigNumber: "1개",
    label: "보증금 분리 보관",
    body: "보증금 전용 계좌 + 보증보험 가입.",
  },
];

export function StrengthsCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % STRENGTHS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="bg-white px-4 py-16 lg:hidden">
      <div className="mx-auto max-w-[600px]">
        <div
          className="relative mx-auto aspect-square w-full max-w-[360px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <StrengthCard {...STRENGTHS[index]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* dot navigation. */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {STRENGTHS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "h-3 w-8 bg-[var(--brand-green)]"
                  : "h-3 w-3 bg-gray-300 opacity-40"
              }`}
              aria-label={`강점 ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StrengthCard({ icon: Icon, bigNumber, label, body }: Strength) {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
      <Icon size={56} strokeWidth={2} className="text-[var(--brand-green)]" />
      <div className="space-y-2">
        <div
          className="text-[56px] font-extrabold leading-none tracking-[-0.015em] text-[var(--brand-green)]"
          style={{ fontWeight: 800 }}
        >
          {bigNumber}
        </div>
        <div className="text-[18px] font-bold text-gray-900">{label}</div>
      </div>
      <div className="text-[14px] leading-relaxed text-gray-600">{body}</div>
    </div>
  );
}
