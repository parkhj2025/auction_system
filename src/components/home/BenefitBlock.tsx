"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Building2, FileText, Lock } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

/* Phase 1.2 (A-1-2) v13 — Features (sticky 카드 1건 교차 / 모바일 + 데스크탑 동일).
 * 정정: 모바일 vertical stack 폐기 → sticky paradigm 데스크탑과 동일.
 * min-height 300vh + sticky h-screen + scrollYProgress 카드 1건씩 fade.
 * 양방향 발화 (역방향 시 카드 복귀).
 * h2 강제 line-break 보존 (44/88).
 * 카드 모노톤 (white + gray shadow + green 단독 / yellow / blob / 색감 그림자 영구 폐기). */

const FEATURES = [
  {
    Icon: Building2,
    value: "0회",
    title: "법원 방문",
    desc: "신청 후 결과만 알림으로 받습니다.",
  },
  {
    Icon: FileText,
    value: "100%",
    title: "서류 비대면 처리",
    desc: "위임장부터 입찰표까지 모바일로.",
  },
  {
    Icon: Lock,
    value: "1개",
    title: "보증금 분리 보관",
    desc: "보증금 전용 계좌 + 보증보험 가입.",
  },
] as const;

export function BenefitBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* 카드 1 (0~0.30) / 카드 2 (0.30~0.62) / 카드 3 (0.62~1) */
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
      className="relative bg-[var(--bg-primary)]"
      style={{ minHeight: "300vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="container-app grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* 좌측 h2 + progress dots. */}
          <div className="space-y-6 lg:space-y-10">
            <h2
              id="features-heading"
              className="text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:text-[88px]"
              style={{ fontWeight: 800 }}
            >
              당신이 신경 쓸 일은<br />
              <span className="text-[var(--brand-green)]">사건번호 하나뿐.</span>
            </h2>
            <ProgressDots scrollProgress={scrollYProgress} total={3} />
          </div>

          {/* 우측 카드 1건씩 교차 (모바일 max-w 360 / 데스크탑 max-w 480). */}
          <div className="relative mx-auto aspect-square w-full max-w-[360px] lg:max-w-[480px] lg:mx-0">
            <motion.div
              style={{ opacity: card1Opacity, y: card1Y }}
              className="absolute inset-0"
            >
              <FeatureCard
                Icon={FEATURES[0].Icon}
                value={FEATURES[0].value}
                title={FEATURES[0].title}
                desc={FEATURES[0].desc}
              />
            </motion.div>
            <motion.div
              style={{ opacity: card2Opacity, y: card2Y }}
              className="absolute inset-0"
            >
              <FeatureCard
                Icon={FEATURES[1].Icon}
                value={FEATURES[1].value}
                title={FEATURES[1].title}
                desc={FEATURES[1].desc}
              />
            </motion.div>
            <motion.div
              style={{ opacity: card3Opacity, y: card3Y }}
              className="absolute inset-0"
            >
              <FeatureCard
                Icon={FEATURES[2].Icon}
                value={FEATURES[2].value}
                title={FEATURES[2].title}
                desc={FEATURES[2].desc}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
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
          <Dot key={i} index={i} scrollProgress={scrollProgress} />
        ))}
      </div>
      <CurrentLabel total={total} scrollProgress={scrollProgress} />
    </div>
  );
}

function Dot({
  index,
  scrollProgress,
}: {
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollProgress, (p) => {
    const active = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
    return active === index ? 1 : 0.4;
  });
  const bgColor = useTransform(scrollProgress, (p) => {
    const active = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
    return active === index ? "#00C853" : "#D1D5DB";
  });
  return (
    <motion.div
      style={{ opacity, backgroundColor: bgColor }}
      className="h-3 w-3 rounded-full"
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
