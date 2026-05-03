/* Phase 1.2 (A-1-2) v6 — Trust (단순화 + 카피 v4 / CTA 광역 폐기).
 * h2 "지금까지 사고 0건." (광역 정수)
 * body "공인중개사 직접 입찰 + 보증보험 + 전용 계좌."
 * 검증 영역: inline caption — "매수신청대리인 등록 · 서울보증보험 가입 · 보증금 분리 보관"
 * 시각: charcoal dark + green radial glow center + 3 카드 광역 폐기 → 한 줄 정수. */

export function TrustCTA() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#111418] to-[#1A1F25] text-white"
    >
      {/* radial green glow center (Code 자유 #8). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,200,83,0.18), transparent 65%)",
        }}
      />

      <div className="container-app relative py-[var(--section-py)]">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="trust-heading"
            className="text-[var(--text-h2)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white"
            style={{ fontWeight: 800 }}
          >
            지금까지 사고{" "}
            <span className="text-[var(--brand-green)]">0건</span>.
          </h2>
          <p className="mt-6 text-[17px] leading-[1.6] text-white/70 lg:mt-8 lg:text-[20px]">
            공인중개사 직접 입찰 + 보증보험 + 전용 계좌.
          </p>

          {/* 검증 영역 — inline caption 한 줄. */}
          <p className="mt-8 text-[12px] uppercase tracking-[0.06em] text-white/40 lg:mt-12 lg:text-[13px]">
            매수신청대리인 등록 · 서울보증보험 가입 · 보증금 분리 보관
          </p>
        </div>
      </div>
    </section>
  );
}
