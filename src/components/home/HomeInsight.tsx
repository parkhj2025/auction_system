"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { INSIGHT_TILES } from "@/lib/constants";

/* cycle 1-G-γ-α — 메인 섹션 7: Insight.
 * paradigm: white bg + 4 카드 (모바일 1-col + 데스크탑 2-col 또는 4-col).
 * 카드 = magazine style (이미지 + label + title + preview + arrow). */

export function HomeInsight() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      className="border-t border-[var(--color-border)] bg-white py-20 sm:py-32"
    >
      <div className="container-app mx-auto w-full max-w-[1200px]">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]"
        >
          Insight
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-[var(--color-ink-900)] sm:text-[64px]"
        >
          분석 자료까지, <br className="hidden sm:block" />
          <span className="text-[var(--brand-green)]">무료로 드립니다</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {INSIGHT_TILES.map((tile, i) => (
            <motion.div
              key={tile.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.3 + i * 0.1,
              }}
            >
              <Link
                href={`/insight?cat=${tile.slug}`}
                className="group flex aspect-[4/1] flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
              >
                {/* 좌 이미지. */}
                <div className="relative w-1/2 overflow-hidden bg-[var(--color-ink-100)]">
                  <Image
                    src={`/images/insight/${tile.slug}.jpg`}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 300px, 50vw"
                    className="object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                  />
                </div>
                {/* 우 텍스트. */}
                <div className="flex w-1/2 flex-col justify-between p-5 sm:p-7">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--brand-green)]">
                      {tile.label}
                    </p>
                    <h3 className="mt-2 text-base font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-xl">
                      {tile.title}
                    </h3>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <p className="text-xs leading-5 text-[var(--color-ink-500)] sm:text-sm">
                      {tile.preview}
                    </p>
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-[var(--color-ink-500)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--brand-green)]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
