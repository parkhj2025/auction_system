"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import type { FeatureItem } from "./BenefitBlock";

/* Phase 1.2 (A-1-2) v12 — Features Sticky 카드 1건씩 교차 등장 (lg+ only).
 * paradigm: min-height 300vh + sticky h-screen + scrollYProgress 카드 1건씩 fade.
 * 양방향: scrollYProgress 자동 (역방향 시 카드 복귀).
 * 컬러 믹싱: 카드 1 green / 카드 2 yellow / 카드 3 green-yellow mesh.
 * border-left 4px green 영구 폐기 (AI 슬롭 디자인 회피).
 * 카드 정방형 (aspect-square / max-width 480px) + 색감 그림자. */

type CardColor = "green" | "yellow" | "green-yellow";

const CARD_STYLES: Record<CardColor, { background: string; shadow: string; accent: string }> = {
  green: {
    background:
      "radial-gradient(circle at 0% 0%, rgba(0, 200, 83, 0.15) 0%, transparent 50%), white",
    shadow:
      "0 20px 40px -12px rgba(0, 200, 83, 0.25), 0 0 0 1px rgba(0, 200, 83, 0.05)",
    accent: "#00C853",
  },
  yellow: {
    background:
      "radial-gradient(circle at 100% 0%, rgba(255, 212, 59, 0.20) 0%, transparent 50%), white",
    shadow:
      "0 20px 40px -12px rgba(255, 212, 59, 0.30), 0 0 0 1px rgba(255, 212, 59, 0.08)",
    accent: "#FFD43B",
  },
  "green-yellow": {
    background:
      "radial-gradient(circle at 0% 100%, rgba(0, 200, 83, 0.15) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(255, 212, 59, 0.18) 0%, transparent 40%), white",
    shadow:
      "0 20px 40px -12px rgba(120, 180, 70, 0.25), 0 0 0 1px rgba(120, 180, 70, 0.06)",
    accent: "#00C853",
  },
};

export function FeaturesStickyDesktop({ features }: { features: FeatureItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* 카드 1 (0~0.30 활성), 카드 2 (0.30~0.62), 카드 3 (0.62~1) */
  const card1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.30, 0.38], [0, 1, 1, 0]);
  const card1Y = useTransform(scrollYProgress, [0, 0.05, 0.30, 0.38], [40, 0, 0, -40]);
  const card2Opacity = useTransform(scrollYProgress, [0.30, 0.38, 0.62, 0.70], [0, 1, 1, 0]);
  const card2Y = useTransform(scrollYProgress, [0.30, 0.38, 0.62, 0.70], [40, 0, 0, -40]);
  const card3Opacity = useTransform(scrollYProgress, [0.62, 0.70, 0.95, 1], [0, 1, 1, 1]);
  const card3Y = useTransform(scrollYProgress, [0.62, 0.70, 0.95, 1], [40, 0, 0, 0]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="features-heading"
      className="relative hidden bg-[var(--bg-primary)] lg:block"
      style={{ minHeight: "300vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="container-app grid w-full grid-cols-2 gap-12">
          {/* 좌측 sticky h2 + progress dots. */}
          <div className="space-y-10">
            <h2
              id="features-heading"
              className="text-[88px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance]"
              style={{ fontWeight: 800 }}
            >
              당신이 신경 쓸 일은<br />
              <span className="text-[var(--brand-green)]">사건번호 하나뿐.</span>
            </h2>
            <ProgressDots scrollProgress={scrollYProgress} total={3} />
          </div>

          {/* 우측 카드 1건씩 교차 등장 (정방형 / max-w 480 / 색감 그림자). */}
          <div className="relative mx-auto aspect-square w-full max-w-[480px]">
            <StickyCard
              feat={features[0]}
              opacity={card1Opacity}
              y={card1Y}
              color="green"
            />
            <StickyCard
              feat={features[1]}
              opacity={card2Opacity}
              y={card2Y}
              color="yellow"
            />
            <StickyCard
              feat={features[2]}
              opacity={card3Opacity}
              y={card3Y}
              color="green-yellow"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StickyCard({
  feat,
  opacity,
  y,
  color,
}: {
  feat: FeatureItem;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  color: CardColor;
}) {
  const style = CARD_STYLES[color];
  const Icon = feat.Icon;

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col justify-between rounded-3xl p-12"
      // background + shadow 영역 inline (motion style 분리 — opacity/y와 충돌 회피).
    >
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: style.background,
          boxShadow: style.shadow,
        }}
      />
      <div className="relative flex h-full flex-col justify-between">
        <Icon size={64} strokeWidth={2} style={{ color: style.accent }} />
        <div className="space-y-2">
          <div
            className="text-[64px] font-extrabold leading-none tracking-[-0.015em]"
            style={{ fontWeight: 800, color: style.accent }}
          >
            {feat.value}
          </div>
          <div className="text-[22px] font-bold text-[var(--text-primary)]">
            {feat.title}
          </div>
        </div>
        <div className="text-[16px] font-medium leading-[1.6] text-[var(--text-secondary)]">
          {feat.desc}
        </div>
      </div>
    </motion.div>
  );
}

function ProgressDots({
  scrollProgress,
  total,
}: {
  scrollProgress: MotionValue<number>;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <Dot key={i} index={i} total={total} scrollProgress={scrollProgress} />
        ))}
      </div>
      <CurrentLabel total={total} scrollProgress={scrollProgress} />
    </div>
  );
}

function Dot({
  index,
  total,
  scrollProgress,
}: {
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollProgress, (p) => {
    const active = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
    return active === index ? 1 : 0.3;
  });
  const scale = useTransform(scrollProgress, (p) => {
    const active = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
    return active === index ? 1 : 0.85;
  });
  void total;
  return (
    <motion.div
      style={{ opacity, scale }}
      className="h-3 w-3 rounded-full bg-[var(--brand-green)]"
    />
  );
}

function CurrentLabel({
  total,
  scrollProgress,
}: {
  total: number;
  scrollProgress: MotionValue<number>;
}) {
  const text = useTransform(scrollProgress, (p) => {
    const active = p < 0.33 ? 1 : p < 0.66 ? 2 : 3;
    return `${active} / ${total}`;
  });
  return (
    <motion.span className="text-[14px] font-medium text-[var(--text-tertiary)]">
      {text}
    </motion.span>
  );
}
