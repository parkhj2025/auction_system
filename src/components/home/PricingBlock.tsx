import { PricingTimeline } from "./PricingTimeline";

/* Phase 1.2 (A-1-2) v16 — PricingBlock (#FAFAFA + caption 상단 1줄 + 카드 3건 + timeline).
 * 정정 (Plan v16):
 * 1. 배경 #FAFAFA + min-h calc(100vh-80px) + flex-col justify-center
 * 2. caption 상단 1줄 = "5만원부터 · 낙찰 시 +5만원 (성공 보수) · 패찰 시 보증금 전액 반환"
 * 3. 카드 3건 grid (강조 = green border / yellow 영구 폐기)
 * 4. timeline 보존 + 원 ↔ 줄 absolute positioning */

export function PricingBlock() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="flex min-h-[calc(100dvh-64px)] flex-col justify-center bg-[#FAFAFA] py-12 lg:min-h-[calc(100dvh-80px)] lg:py-16 snap-block"
    >
      <div className="container-app w-full">
        <h2
          id="pricing-heading"
          className="mb-4 text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          신청이 빠를수록,<br />
          <span className="text-[var(--brand-green)]">저렴합니다.</span>
        </h2>

        <p className="mb-12 text-[14px] text-gray-600 lg:mb-16 lg:text-[16px]">
          5만원부터 · 낙찰 시 +5만원 (성공 보수) · 패찰 시 보증금 전액 반환
        </p>

        {/* 3 카드 grid — 강조 카드 = green border / yellow 영구 폐기. */}
        <div className="mb-12 grid grid-cols-1 gap-4 lg:mb-16 lg:grid-cols-3 lg:gap-6">
          {/* 카드 1 — 얼리버드 (강조). */}
          <article className="relative rounded-3xl border-2 border-[var(--brand-green)] bg-white p-6 shadow-lg lg:p-8">
            <div className="absolute -top-3 left-6 rounded-full bg-[var(--brand-green)] px-3 py-1 text-[11px] font-bold text-white lg:text-[12px]">
              가장 많이 선택
            </div>
            <div className="mb-3 text-[12px] font-bold text-[var(--brand-green)] lg:mb-4 lg:text-[14px]">
              7일+ 전
            </div>
            <div className="mb-3 text-[40px] font-extrabold leading-none text-gray-900 lg:mb-4 lg:text-[56px]" style={{ fontWeight: 800 }}>
              5만원
            </div>
            <div className="text-[14px] text-gray-600 lg:text-[16px]">얼리버드</div>
          </article>

          {/* 카드 2 — 일반. */}
          <article className="rounded-3xl border border-gray-200 bg-white p-6 lg:p-8">
            <div className="mb-3 text-[12px] font-bold text-orange-500 lg:mb-4 lg:text-[14px]">
              7~2일 전
            </div>
            <div className="mb-3 text-[40px] font-extrabold leading-none text-gray-900 lg:mb-4 lg:text-[56px]" style={{ fontWeight: 800 }}>
              7만원
            </div>
            <div className="text-[14px] text-gray-600 lg:text-[16px]">일반</div>
          </article>

          {/* 카드 3 — 급건. */}
          <article className="rounded-3xl border border-gray-200 bg-white p-6 lg:p-8">
            <div className="mb-3 text-[12px] font-bold text-red-500 lg:mb-4 lg:text-[14px]">
              2일 이내
            </div>
            <div className="mb-3 text-[40px] font-extrabold leading-none text-gray-900 lg:mb-4 lg:text-[56px]" style={{ fontWeight: 800 }}>
              10만원
            </div>
            <div className="text-[14px] text-gray-600 lg:text-[16px]">급건</div>
          </article>
        </div>

        <PricingTimeline />
      </div>
    </section>
  );
}
