"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Shield, Award, Building2 } from "lucide-react";
import { ABOUT_PROOFS, type AboutProofIconKey } from "@/lib/constants";

/* cycle 1-G-β-γ-β — /about 섹션 3: 신뢰 근거 (Credentials).
 * paradigm: white bg + 3 카드 (lucide 아이콘 + line1 + line2 / brand-green 48px).
 * 박형준 개인 사진·자격증·등록증·보증보험증서 영역 영구 0 (영구 룰 §39). */

const ICON_MAP: Record<AboutProofIconKey, typeof Shield> = {
  shield: Shield,
  award: Award,
  building2: Building2,
};

export function AboutCredentials() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="border-t border-[var(--color-border)] bg-white py-20 sm:py-32"
    >
      <div className="container-app mx-auto w-full">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
          Credentials
        </p>
        <h2 className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-[var(--color-ink-900)] sm:text-[64px]">
          법원이 인정한 자격으로, <br className="hidden sm:block" />
          직접 입찰합니다
          <span style={{ color: "#FFD43B" }}>.</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {ABOUT_PROOFS.map((item, i) => {
            const Icon = ICON_MAP[item.iconKey];
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: i * 0.15,
                }}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-8"
              >
                <Icon
                  size={48}
                  strokeWidth={1.5}
                  className="text-[var(--brand-green)]"
                  aria-hidden="true"
                />
                <p className="mt-6 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-[32px]">
                  {item.line1}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
                  {item.line2}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
