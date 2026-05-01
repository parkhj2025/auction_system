import Link from "next/link";
import { ArrowRight, ShieldCheck, Wallet, TrendingDown } from "lucide-react";
import { FEES } from "@/lib/constants";

/* Phase 1 — Hero · Aurora Calm + Video Hero placeholder + Liquid Glass.
 * 본질:
 *  - .bg-aurora (radial 광원 3건 + linear deep navy mesh)
 *  - .network-pattern (abstract dot+line SVG overlay)
 *  - .video-label ▶ "추상 모션 영상" placeholder (Phase 3 영상 자산 자리)
 *  - h1 "5만원부터" .text-aurora-lavender 그라데이션 (lavender-300→200→100)
 *  - CTA primary 흰 (text-primary on white pill)
 *  - CTA secondary .glass-pill (blur 14px + white/8 bg)
 *  - Trust strip 3건 .glass-pill (CTA 직후 가로 strip + white/15 구분선)
 *  - Hero floating .glass-card 시안 정적 ("12건 / 평균 -27% / 오늘 입찰 3건"). */
export function HeroSearch() {
  const earlybirdManwon = (FEES.earlybird / 10000).toLocaleString("ko-KR");

  return (
    <section className="bg-aurora relative isolate overflow-hidden">
      {/* Abstract network pattern overlay (Phase 3 영상 자산 본질의 placeholder). */}
      <div aria-hidden="true" className="network-pattern absolute inset-0 opacity-60" />

      <div className="container-aurora relative grid items-center gap-10 pb-[var(--hero-py-bottom)] pt-[var(--hero-py-top)] lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        {/* 좌측 카피 + CTA + 신뢰 strip. */}
        <div>
          <div className="flex items-center gap-3">
            <span className="section-eyebrow text-[var(--lavender-300)]">
              법원 안 가는 부동산 경매 입찰 대리
            </span>
            <span className="video-label">추상 모션 영상</span>
          </div>

          <h1 className="text-display mt-5 font-bold">
            입찰은 맡기고,
            <br />
            얼리버드 <span className="text-aurora-lavender">{earlybirdManwon}만원부터</span>
          </h1>

          <p className="text-body-lg mt-5 max-w-xl text-[var(--text-on-aurora-muted)]">
            공인중개사·서울보증보험 가입. 패찰 시 보증금 당일 즉시 반환.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/apply"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-[var(--text-primary)] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              입찰 대리 신청
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/analysis"
              className="glass-pill inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              무료 물건분석 보기
            </Link>
          </div>

          {/* 신뢰 strip 3건 — CTA 직후 가로 strip + white/15 구분선. */}
          <div className="mt-12 flex flex-col gap-4 border-t border-[var(--glass-border)] pt-6 text-[var(--text-on-aurora-muted)] sm:flex-row sm:items-center sm:gap-x-10 sm:gap-y-4">
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-meta">
              <ShieldCheck size={14} aria-hidden="true" />
              공인중개사·서울보증보험 가입
            </span>
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-meta">
              <Wallet size={14} aria-hidden="true" />
              패찰 시 보증금 당일 즉시 반환
            </span>
            <span className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-meta font-semibold text-white">
              얼리버드 {earlybirdManwon}만원부터 시작
            </span>
          </div>
        </div>

        {/* 우측 Hero floating glass card — 시안 정적 데이터. */}
        <aside
          aria-label="이번 주 경매 요약"
          className="glass-card relative rounded-[var(--r-card-lg)] p-[var(--card-p)] text-white shadow-[0_24px_60px_-15px_rgba(15,23,42,0.45)]"
        >
          <p className="section-eyebrow text-[var(--lavender-300)]">이번 주 인천 경매</p>
          <h2 className="text-h3 mt-3 font-semibold text-white">
            지금 입찰 대리할 수 있는 물건
          </h2>

          <dl className="mt-6 grid gap-5">
            <div className="flex items-baseline justify-between gap-4 border-b border-[var(--glass-border)] pb-4">
              <dt className="text-meta text-[var(--text-on-aurora-faint)]">분석 완료</dt>
              <dd className="text-num-lg text-white">12건</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-[var(--glass-border)] pb-4">
              <dt className="text-meta text-[var(--text-on-aurora-faint)]">평균 최저가</dt>
              <dd className="text-num-md inline-flex items-center gap-1 text-[var(--lavender-200)]">
                <TrendingDown size={18} aria-hidden="true" />
                감정가의 −27%
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-meta text-[var(--text-on-aurora-faint)]">오늘 입찰 예정</dt>
              <dd className="text-num-md text-white">3건</dd>
            </div>
          </dl>

          <Link
            href="/analysis"
            className="text-meta mt-6 inline-flex items-center gap-1 font-semibold text-[var(--lavender-200)] hover:text-white"
          >
            오늘 입찰 물건 보기
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </section>
  );
}
