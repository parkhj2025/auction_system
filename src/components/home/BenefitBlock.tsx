"use client";

import { Building2, FileText, Lock } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { FeaturesStickyDesktop } from "./FeaturesStickyDesktop";

/* Phase 1.2 (A-1-2) v10 — Features (Sticky Scroll Reveal lg+ + vertical stack 강화 mobile + h2 56/120).
 * h2: "당신이 신경 쓸 일은\n사건번호 하나뿐." (강제 line-break + green accent on "사건번호 하나뿐").
 * lg+: 좌측 sticky h2 + 우측 카드 3장 progress 활성 (StickyScrollReveal).
 * mobile: vertical stack + 컬러 믹싱 (카드 1·3 green / 카드 2 yellow / hover lift / border-left 영구 폐기).
 * 카드 3건 (Code 결정 (i) "1개 / 전용 계좌" 보존):
 *   1. Building2 / 0회 / 법원 방문
 *   2. FileText / 100% / 서류 비대면 처리
 *   3. Lock / 1개 / 전용 계좌 분리 보관 */

import type { LucideIcon } from "lucide-react";

export type FeatureItem = {
  Icon: LucideIcon;
  value: string;
  title: string;
  desc: string;
};

export const FEATURES: FeatureItem[] = [
  {
    Icon: Building2,
    value: "0회",
    title: "법원 방문",
    desc: "신청 후 결과만 알림으로 받습니다. 평일 휴가 신청도, 수표 발행도, 오랜 대기도 0.",
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
];

export function BenefitBlock() {
  return (
    <section
      aria-labelledby="features-heading"
      className="bg-[var(--bg-primary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        {/* lg+: Sticky Scroll Reveal — 좌측 h2 sticky + 우측 카드 progress 활성. */}
        <div className="hidden lg:block">
          <FeaturesStickyDesktop features={FEATURES} />
        </div>

        {/* mobile: h2 + vertical stack 강화 (fade+slide+scale stagger 200ms). */}
        <div className="lg:hidden">
          <h2
            id="features-heading"
            className="max-w-3xl text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance]"
            style={{ fontWeight: 800 }}
          >
            당신이 신경 쓸 일은<br />
            <span className="text-[var(--brand-green)]">사건번호 하나뿐.</span>
          </h2>

          <ul className="mt-10 grid grid-cols-2 gap-4">
            {FEATURES.map((feat, idx) => {
              const colors = ["green", "yellow", "green-yellow"] as const;
              return (
                <FeatureCard
                  key={feat.title}
                  Icon={feat.Icon}
                  value={feat.value}
                  title={feat.title}
                  desc={feat.desc}
                  delay={idx * 80}
                  isWide={idx === 0}
                  color={colors[idx]}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
