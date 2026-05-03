"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { FeatureItem } from "./BenefitBlock";

/* Phase 1.2 (A-1-2) v10 — Features Sticky Scroll Reveal (lg+ only).
 * 좌측 sticky h2 (120px) + 우측 카드 3장 progress 활성.
 * h2: "당신이 신경 쓸 일은\n사건번호\n하나뿐." (강제 3 line-break — Sticky w-1/2 ≈ 640px overflow 회피).
 * 우측 카드: scroll progress 따라 active 강조 (border-left + shadow + scale 1.02). */

export function FeaturesStickyDesktop({ features }: { features: FeatureItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={sectionRef} className="relative grid grid-cols-2 gap-12">
      {/* 좌측 sticky h2 (2 line 강제 — "당신이 신경 쓸 일은" + br + "사건번호 하나뿐."). */}
      <div className="sticky top-24 self-start">
        <h2
          id="features-heading"
          className="text-[120px] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--text-primary)] [text-wrap:balance]"
          style={{ fontWeight: 800 }}
        >
          당신이 신경 쓸 일은<br />
          <span className="text-[var(--brand-green)]">사건번호 하나뿐.</span>
        </h2>
      </div>

      {/* 우측 카드 3장 vertical stack (각 카드 100vh 영역 → progress 활성). */}
      <div className="flex flex-col gap-12 py-[20vh]">
        {features.map((feat, idx) => (
          <StickyFeatureCard
            key={feat.title}
            feat={feat}
            index={idx}
            total={features.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}

function StickyFeatureCard({
  feat,
  index,
  total,
  progress,
}: {
  feat: FeatureItem;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start - 0.1, start, end, end + 0.1], [0.4, 1, 1, 0.4]);
  const scale = useTransform(progress, [start - 0.1, start, end, end + 0.1], [0.98, 1.02, 1.02, 0.98]);

  const Icon = feat.Icon;

  return (
    <motion.div
      style={{ opacity, scale }}
      className="flex aspect-[4/3] flex-col gap-5 rounded-3xl border-l-4 border-l-[var(--brand-green)] border border-[var(--border-1)] bg-white p-10 shadow-[var(--shadow-card-hover)]"
    >
      <Icon size={64} className="text-[var(--brand-green)]" />
      <div>
        <span
          className="block text-[120px] font-extrabold leading-none tracking-[-0.025em] text-[var(--text-primary)]"
          style={{ fontWeight: 800 }}
        >
          {feat.value}
        </span>
        <h3 className="mt-4 text-[28px] font-bold leading-[1.3] tracking-[-0.01em] text-[var(--text-primary)]">
          {feat.title}
        </h3>
        <p className="mt-3 text-[18px] font-medium leading-[1.6] text-[var(--text-secondary)]">
          {feat.desc}
        </p>
      </div>
    </motion.div>
  );
}
