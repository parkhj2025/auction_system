import Link from "next/link";
import { ShieldCheck, Clock, ArrowRight, MessageCircle } from "lucide-react";
import type { AnalysisFrontmatter } from "@/types/content";
import { FEES } from "@/lib/constants";

/**
 * 본문 하단 다크 CTA — preview prototype 패턴.
 *  - 헤드라인 + 사건번호 자동 prefill 안내
 *  - 신청 / 카카오 상담 2-CTA
 *  - 하단 3분할 그리드 (수수료 / 성공보수 / 패찰 시)
 */
export function ApplyCTA({ fm }: { fm: AnalysisFrontmatter }) {
  const applyHref = `/apply?case=${encodeURIComponent(fm.caseNumber)}`;
  const earlyMan = (FEES.earlybird / 10_000).toLocaleString("ko-KR");
  const stdMan = (FEES.standard / 10_000).toLocaleString("ko-KR");
  const successMan = (FEES.successBonus / 10_000).toLocaleString("ko-KR");

  return (
    <section
      aria-labelledby="apply-cta-heading"
      className="mt-10 overflow-hidden rounded-[var(--radius-2xl)] bg-[var(--color-ink-950)] text-white"
    >
      <div className="relative px-6 py-10 sm:px-10 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--color-ink-50)]0/30 blur-3xl"
        />

        <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-white/70">
          Next step
        </p>
        <h2
          id="apply-cta-heading"
          className="relative mt-3 max-w-2xl text-2xl font-black leading-snug sm:text-3xl"
        >
          분석은 끝났습니다.
          <br className="sm:hidden" /> 법원은 저희가 갑니다.
        </h2>
        <p className="relative mt-4 max-w-2xl text-sm leading-6 text-white/85 sm:text-[length:var(--text-body)]">
          사건번호 <span className="font-bold text-white tabular-nums">{fm.caseNumber}</span>{" "}
          정보를 자동으로 불러와 신청 페이지로 이동합니다. 패찰 시 보증금은 당일 즉시 반환됩니다.
        </p>

        <ul className="relative mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/85">
          <li className="inline-flex items-center gap-1.5">
            <Clock size={14} aria-hidden="true" />
            신청 약 10분
          </li>
          <li className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} aria-hidden="true" />
            서울보증보험 가입
          </li>
        </ul>

        <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={applyHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-white px-6 text-[length:var(--text-body)] font-black tracking-tight text-[var(--color-ink-900)] shadow-[var(--shadow-lift)] transition duration-150 ease-out hover:bg-[var(--color-ink-50)]"
          >
            이 물건 입찰 대리 신청
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-white/25 bg-white/10 px-6 text-sm font-bold text-white transition duration-150 ease-out hover:bg-white/20"
          >
            <MessageCircle size={16} aria-hidden="true" />
            카카오톡 상담
          </Link>
        </div>

        {/* 3-column fee grid */}
        <div className="relative mt-8 grid gap-4 border-t border-white/10 pt-6 text-xs text-white/85 sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/60">
              수수료
            </p>
            <p className="mt-1 text-sm font-bold text-white tabular-nums">
              얼리버드 {earlyMan}만원 · 일반 {stdMan}만원
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/60">
              성공보수
            </p>
            <p className="mt-1 text-sm font-bold text-white tabular-nums">
              낙찰 시 {successMan}만원 추가
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/60">
              패찰 시
            </p>
            <p className="mt-1 text-sm font-bold text-white">
              보증금 당일 즉시 반환
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
