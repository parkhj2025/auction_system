import Link from "next/link";
import { ArrowRight, ShieldCheck, Wallet } from "lucide-react";
import { FEES } from "@/lib/constants";

/* Phase 0 Hero — 검색 폼 제거 + CTA 2개 + 신뢰 strip 3건 (Hero 검정 배경 안).
 * 기존 typeahead·법원 select·useRouter dispatch 전체 회수 (다음 cycle 시점에서 필요 시 별도 검색 페이지로 분리). */
export function HeroSearch() {
  const earlybirdManwon = (FEES.earlybird / 10000).toLocaleString("ko-KR");

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[var(--c-base)] px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <p className="text-sm font-semibold tracking-wide text-white/85">
          법원 안 가는 부동산 경매 입찰 대리
        </p>
        <h1 className="mt-4 text-display font-bold leading-[1.05] tracking-tight">
          입찰은 맡기고,
          <br className="sm:hidden" /> 얼리버드{" "}
          <span className="text-white">{earlybirdManwon}만원</span>부터
        </h1>
        <p className="mt-5 max-w-xl text-body-lg text-white/85">
          공인중개사·서울보증보험 가입. 패찰 시 보증금 당일 즉시 반환.
        </p>

        <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/apply"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            입찰 대리 신청
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            href="/analysis"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-transparent px-8 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            무료 물건분석 보기
          </Link>
        </div>

        {/* 신뢰 strip 3건 — CTA 직후 가로 strip + white/15 구분선 (5블록 본질 — 별도 블록으로 인지하지 않음). */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-white/85 sm:flex-row sm:items-center sm:gap-x-10 sm:gap-y-4">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={16} aria-hidden="true" className="text-white/60" />
            공인중개사·서울보증보험 가입
          </span>
          <span className="inline-flex items-center gap-2">
            <Wallet size={16} aria-hidden="true" className="text-white/60" />
            패찰 시 보증금 당일 즉시 반환
          </span>
          <span className="inline-flex items-center gap-2 font-semibold text-white">
            얼리버드 {earlybirdManwon}만원부터 시작
          </span>
        </div>
      </div>
    </section>
  );
}
