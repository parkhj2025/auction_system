/* Phase 1.2 (A-1-2) v6 — CompareBlock (typography-driven 대형 numeric / 카피 v4).
 * "비교" 라벨 광역 폐기.
 * h2 "법원 가는 3시간, 물건 보는 시간으로." (광역 정수)
 * 시각: 좌 "3 hours" 96px+ charcoal/40 → 우 "0 hours" 96px+ green
 * caption: 좌 "직접 입찰 시 법원 왕복 + 대기" / 우 "경매퀵 이용 시 신청 → 결과 알림" */

import { ArrowRight } from "lucide-react";

export function CompareBlock() {
  return (
    <section
      aria-labelledby="compare-heading"
      className="bg-[var(--bg-primary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <h2
          id="compare-heading"
          className="max-w-3xl text-[var(--text-h2)] font-extrabold leading-[1.1] tracking-[-0.025em] text-[var(--text-primary)]"
          style={{ fontWeight: 800 }}
        >
          법원 가는 <span className="text-[var(--brand-green)]">3시간</span>,
          <br className="hidden sm:block" />
          물건 보는 시간으로.
        </h2>

        {/* 대형 numeric typography 시각 — 96px mobile / 144px desktop. */}
        <div className="mt-12 flex flex-col items-stretch gap-6 lg:mt-20 lg:flex-row lg:items-center lg:justify-center lg:gap-12">
          {/* 좌 — 3 hours (직접 입찰). */}
          <div className="flex-1 text-center lg:text-right">
            <p
              className="text-[var(--text-num-xl)] font-extrabold leading-[0.95] tracking-[-0.04em] text-[var(--text-primary)]/30 tabular-nums"
              style={{ fontWeight: 800 }}
            >
              3h
            </p>
            <p className="mt-3 text-[14px] text-[var(--text-tertiary)] lg:mt-4 lg:text-[16px]">
              직접 입찰 시 법원 왕복 + 대기
            </p>
          </div>

          {/* arrow — 모바일 가운데 / 데스크탑 가운데. */}
          <div className="flex items-center justify-center text-[var(--text-tertiary)]">
            <ArrowRight
              size={32}
              strokeWidth={1.5}
              aria-hidden="true"
              className="lg:size-12"
            />
          </div>

          {/* 우 — 0 hours (경매퀵). */}
          <div className="flex-1 text-center lg:text-left">
            <p
              className="text-[var(--text-num-xl)] font-extrabold leading-[0.95] tracking-[-0.04em] text-[var(--brand-green)] tabular-nums"
              style={{ fontWeight: 800 }}
            >
              0h
            </p>
            <p className="mt-3 text-[14px] text-[var(--text-tertiary)] lg:mt-4 lg:text-[16px]">
              경매퀵 이용 시 신청 → 결과 알림
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
