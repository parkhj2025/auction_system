"use client";

/**
 * 04 시세 비교 — 단계 5-4-2-fix-5 룰 16 v3 (Step-down + horizontal slider 통합).
 *
 * 폐기 (단계 5-4-2-fix-3 룰 2 + 5-4-2-fix-4 룰 10 영역):
 *  - 4 세로 막대 패턴 폐기
 *  - 시세 평균 막대 폐기 (보조 텍스트로 대체)
 *  - 시세 평균 가로 라인 폐기
 *  - 5번째 세로 막대 폐기
 *  - log scale 폐기 (linear 복귀)
 *
 * NEW — Step-down 시각화 (FT step-down chart 패턴):
 *  [감정가 / 1차 시작가 1.78억]
 *           │  ← vertical line draw 0→1, 600ms
 *           ▼  text-h4 "30% 저감" + 화살표
 *  [2차 현재 진입가 1.246억]
 *           │
 *  [입찰가 horizontal slider]
 *
 * NEW — 입찰가 horizontal slider (chart 영역 외 라벨):
 *  - range 최저가 ~ 감정가
 *  - drag 시 marker y좌표 이동
 *  - 좌측 라벨 (whitespace-nowrap, bg-white shadow)
 *  - 우측 라벨 (정량 차이 %)
 *  - 색: brand-900 marker
 *
 * NEW — 시세평균 보조 텍스트 (대표성 한계 명시):
 *  - 위치: step-down 아래
 *  - 토큰: text-body-sm ink-500
 *  - 막대 표현 X
 *
 * 룰 1 once: false 적용 (위·아래 스크롤 재실행).
 * 모바일 노출 의무 보존 (룰 2/10): hidden sm:block 금지, mobile 100% width.
 */
import { motion, useInView } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import type { MarketMeta, BiddingHistoryEntry } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

interface PriceScatterProps {
  appraisal: number;
  market: MarketMeta;
  minPrice: number;
  round: number;
  history: BiddingHistoryEntry[];
}

export function PriceScatter({
  appraisal,
  market,
  minPrice,
  round,
  history,
}: PriceScatterProps) {
  const ref = useRef<HTMLDivElement>(null);
  // 룰 1: once: false — 위·아래 스크롤 재실행
  const inView = useInView(ref, { once: false, amount: 0.3 });

  const saleAvg = market.sale_avg ?? 0;
  const saleCount = market.sale_count ?? 0;

  // 1차 (이전·시작가) entry — 감정가 ≒ 1차 100% 수준 가정
  const firstEntry = history.find((h) => {
    const r = (h.result ?? "").trim();
    return r.includes("유찰") || r.includes("매각") || r.includes("미납");
  });
  const startPrice = firstEntry?.minimum ?? appraisal;
  const startRound = firstEntry?.round ?? 1;
  // 현재 회차 entry
  const currentEntry = history.find((h) => {
    const r = (h.result ?? "").trim();
    return r === "" || r.includes("진행");
  });
  const currentPrice = currentEntry?.minimum ?? minPrice;
  const currentRound = currentEntry?.round ?? round;

  const dropPercent = startPrice > 0
    ? Math.round(((startPrice - currentPrice) / startPrice) * 100)
    : 0;

  // 룰 20-A: horizontal slider 폐기 — userPriceWon 등 state 제거

  // count-up
  const animatedDropAppraisal = useCountUp(
    Math.round(((appraisal - currentPrice) / appraisal) * 100),
    inView,
    600,
    1700
  );

  return (
    <div
      ref={ref}
      className="rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white p-6 sm:p-8"
    >
      <div className="flex items-baseline justify-between">
        <p className="text-[length:var(--text-caption)] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
          가격 흐름
        </p>
        {saleCount > 0 ? (
          <p className="text-[length:var(--text-caption)] tabular-nums text-[var(--color-ink-500)]">
            인근 매물{" "}
            <span className="font-black text-[var(--color-ink-900)]">
              {saleCount}건
            </span>{" "}
            평균
          </p>
        ) : null}
      </div>

      {/* Step-down 시각화 (FT 패턴) */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {/* 1차 시작가 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[length:var(--text-caption)] font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
            {startRound}차 시작가
          </p>
          <p className="mt-1 text-[length:var(--text-h2)] font-black tabular-nums leading-[var(--lh-tight)] text-[var(--color-ink-700)]">
            {formatKoreanWon(startPrice)}
          </p>
          <p className="mt-1 text-[length:var(--text-caption)] tabular-nums text-[var(--color-ink-500)]">
            감정가의 {Math.round((startPrice / appraisal) * 100)}%
          </p>
        </motion.div>

        {/* connector 1차 → 2차 (vertical line draw + 30% 저감 라벨) */}
        <div className="relative flex flex-col items-center">
          <motion.span
            aria-hidden="true"
            className="block h-12 w-0.5 origin-top bg-[var(--color-ink-300)]"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 whitespace-nowrap rounded-[var(--radius-xs)] bg-white px-2 py-0.5 text-[length:var(--text-caption)] font-bold tabular-nums text-[var(--color-ink-900)] shadow-[var(--shadow-card)]"
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            <ArrowDown size={12} aria-hidden="true" />
            {dropPercent}% 저감
          </motion.div>
        </div>

        {/* 2차 현재 진입가 (강조) */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.4, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center rounded-[var(--radius-xs)] bg-[var(--color-ink-900)] px-2 py-0.5 text-[length:var(--text-caption)] font-black uppercase tracking-[0.18em] text-white">
            현재
          </span>
          <p className="mt-2 text-[length:var(--text-caption)] font-bold uppercase tracking-wider text-[var(--color-ink-700)]">
            {currentRound}차 진입가
          </p>
          <p className="mt-1 text-[length:var(--text-display)] font-black tabular-nums leading-[var(--lh-tight)] text-[var(--color-ink-900)]">
            {formatKoreanWon(currentPrice)}
          </p>
          <p className="mt-1 text-[length:var(--text-body-sm)] tabular-nums text-[var(--color-ink-700)]">
            감정가의{" "}
            <span className="font-black text-[var(--color-ink-900)]">
              {Math.round((currentPrice / appraisal) * 100)}%
            </span>{" "}
            · 감정가 대비{" "}
            <span className="font-black text-[var(--color-ink-900)]">
              −{animatedDropAppraisal}%
            </span>
          </p>
        </motion.div>
      </div>

      {/* 시세평균 보조 텍스트 (대표성 한계 명시) — 막대 표현 X */}
      {saleAvg > 0 && saleCount > 0 ? (
        <motion.div
          className="mt-8 border-t border-[var(--color-border)] pt-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.6 }}
        >
          <p className="text-[length:var(--text-body-sm)] leading-relaxed text-[var(--color-ink-500)]">
            <span className="font-bold text-[var(--color-ink-700)]">참고:</span>{" "}
            인근 매물 {saleCount}건 평균 약{" "}
            <span className="font-bold tabular-nums text-[var(--color-ink-900)]">
              {formatKoreanWon(saleAvg)}
            </span>
            . <span className="text-[var(--color-ink-500)]">표본 평균이며 본 단지 직접 비교는 아닙니다 (시세 대표성 한계).</span>
          </p>
        </motion.div>
      ) : null}

      {/* 룰 20-A (단계 5-4-2-fix-6): 입찰가 horizontal slider 영역 폐기.
       * step-down 시각화 + 시세 평균 보조 텍스트 본질만 보존 (형준님 평가 영역). */}
    </div>
  );
}

function useCountUp(
  target: number,
  active: boolean,
  duration: number,
  delay: number
): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    let raf = 0;
    const t0Ref = { t0: 0 };
    const tick = (now: number) => {
      if (t0Ref.t0 === 0) t0Ref.t0 = now;
      const progress = Math.min(1, (now - t0Ref.t0) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    const timeoutId = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(timeoutId);
    };
  }, [active, target, duration, delay]);
  return value;
}
