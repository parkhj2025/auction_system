import Link from "next/link";

/* Phase 1.2 (A-1) — TrustCTA · 모노톤 화이트 + 단순 카드 본질.
 * 본질:
 *  - bg-aurora-trustcta + glass-card 폐기 → 단순 흰 배경 + 카드 본질
 *  - 카피 v1.1 §C-5: eyebrow / h1 / subtext / CTA 2건
 *  - CTA primary "입찰 대리 신청" → /apply (본 cycle 색 본질 보류 — text-primary 본질만)
 *  - CTA secondary "카카오톡 문의" — 본 cycle href는 /contact placeholder (실 카카오톡 링크 별도 cycle) */
export function TrustCTA() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="bg-[var(--bg-secondary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow justify-center">안전한 입찰 대리</p>
          <h2
            id="trust-heading"
            className="text-h1 mt-3 text-[var(--text-primary)]"
          >
            보증보험 가입,
            <br />
            사고율 0%
          </h2>
          <p className="text-body mt-4 text-[var(--text-secondary)]">
            공인중개사 + 매수신청대리인 등록 + 서울보증보험 가입. 입찰보증금은
            전용계좌에서만 관리합니다.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
            <Link
              href="/apply"
              className="inline-flex h-10 min-h-10 items-center justify-center rounded-lg bg-[var(--text-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-black lg:h-11 lg:px-6 lg:text-[15px]"
            >
              입찰 대리 신청
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-10 min-h-10 items-center justify-center rounded-lg border border-[var(--border-1)] bg-[var(--bg-primary)] px-5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)] lg:h-11 lg:px-6 lg:text-[15px]"
            >
              카카오톡 문의
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
