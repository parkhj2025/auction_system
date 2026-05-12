"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { COURTS_ACTIVE, COURTS_COMING_SOON } from "@/lib/constants";

/* cycle 1-G-β-γ-β — /about 섹션 6: Regions timeline.
 * paradigm: charcoal bg + 가운데 한국 추상 지도 SVG + 5 지역 list (모바일 1-col + 데스크탑 5-col).
 * 인천 = brand-green pulse / 4 지역 = ink-500 dot (오픈 예정). */

type RegionMarker = {
  value: string;
  label: string;
  x: number;
  y: number;
  active: boolean;
};

const REGION_MARKERS: RegionMarker[] = [
  { value: "incheon", label: "인천", x: 165, y: 195, active: true },
  { value: "suwon", label: "수원", x: 195, y: 230, active: false },
  { value: "daejeon", label: "대전", x: 215, y: 320, active: false },
  { value: "busan", label: "부산", x: 305, y: 470, active: false },
  { value: "daegu", label: "대구", x: 270, y: 380, active: false },
];

export function AboutRegions() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="bg-[#111418] py-20 sm:py-32"
    >
      <div className="container-app mx-auto w-full">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
          Regions
        </p>
        <h2 className="mt-4 text-[40px] font-black leading-[1.1] tracking-[-0.015em] text-white sm:text-[64px]">
          전국으로, <span className="text-[var(--brand-green)]">차근차근</span>
          <span style={{ color: "#FFD43B" }}>.</span>
        </h2>

        {/* 가운데 한국 추상 지도. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mt-12 flex items-center justify-center"
        >
          <KoreaMap markers={REGION_MARKERS} />
        </motion.div>

        {/* 5 지역 list. */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[...COURTS_ACTIVE, ...COURTS_COMING_SOON].map((c, i) => {
            const isActive = COURTS_ACTIVE.some((a) => a.value === c.value);
            return (
              <motion.article
                key={c.value}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.4 + i * 0.08,
                }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <span
                  aria-hidden="true"
                  className={
                    isActive
                      ? "h-3 w-3 rounded-full bg-[var(--brand-green)]"
                      : "h-3 w-3 rounded-full bg-[var(--color-ink-500)]"
                  }
                />
                <div className="flex-1">
                  <p
                    className={
                      isActive
                        ? "text-sm font-bold text-white"
                        : "text-sm font-semibold text-white/80"
                    }
                  >
                    {c.label}
                  </p>
                  <p
                    className={
                      isActive
                        ? "text-[11px] font-bold text-[var(--brand-green)]"
                        : "text-[11px] text-white/50"
                    }
                  >
                    {isActive ? "운영 중" : "오픈 예정"}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* 자체 SVG — 한국 추상 outline + 5 marker (인천 brand-green pulse). */
function KoreaMap({ markers }: { markers: RegionMarker[] }) {
  return (
    <svg
      viewBox="0 0 400 600"
      className="h-full w-full max-w-[400px]"
      aria-hidden="true"
    >
      {/* 한국 추상 outline (단순화). */}
      <path
        d="M 130 50 Q 180 30, 220 60 Q 250 80, 240 130 Q 260 160, 230 200
           Q 200 220, 200 260 Q 220 290, 240 340 Q 280 380, 290 430
           Q 310 470, 320 510 Q 310 540, 270 530 Q 230 540, 200 510
           Q 180 470, 170 430 Q 160 390, 170 350 Q 160 310, 150 270
           Q 140 230, 150 190 Q 130 160, 140 120 Q 120 90, 130 50 Z"
        fill="none"
        stroke="#475569"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* 5 marker. */}
      {markers.map((m) => (
        <g key={m.value}>
          {m.active && (
            <motion.circle
              cx={m.x}
              cy={m.y}
              r="18"
              fill="#00C853"
              opacity="0.25"
              animate={{ scale: [1, 1.8, 1], opacity: [0.25, 0, 0.25] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: `${m.x}px ${m.y}px` }}
            />
          )}
          <circle
            cx={m.x}
            cy={m.y}
            r={m.active ? 8 : 5}
            fill={m.active ? "#00C853" : "#64748b"}
          />
          <text
            x={m.x + 12}
            y={m.y + 4}
            fill={m.active ? "white" : "#cbd5e1"}
            fontSize="12"
            fontWeight={m.active ? "700" : "500"}
            fontFamily="system-ui, sans-serif"
          >
            {m.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
