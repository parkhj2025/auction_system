import Link from "next/link";
import { ShieldCheck, Clock, ArrowRight } from "lucide-react";
import type { AnalysisFrontmatter } from "@/types/content";

/**
 * 상세 페이지 본문 하단의 전폭 CTA 카드.
 * 글을 다 읽은 독자가 바로 "이 물건으로 신청"까지 가도록 유도.
 */
export function ApplyCTA({ fm }: { fm: AnalysisFrontmatter }) {
  const applyHref = `/apply?case=${encodeURIComponent(fm.caseNumber)}`;

  return (
    <section
      aria-labelledby="apply-cta-heading"
      className="mt-20 overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-brand-950)] text-white"
    >
      <div className="relative px-6 py-12 sm:px-10 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl"
        />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-200">
              이 물건 입찰 대리
            </p>
            <h2
              id="apply-cta-heading"
              className="mt-3 text-2xl font-black leading-tight sm:text-3xl"
            >
              분석을 읽으셨다면, 법원은 저희가 갑니다
            </h2>
            <p className="mt-3 text-sm leading-6 text-brand-100 sm:text-base">
              사건번호 <span className="font-bold text-white">{fm.caseNumber}</span>{" "}
              정보를 자동으로 불러와 신청 페이지로 이동합니다. 패찰 시 보증금은
              전액 반환됩니다.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-brand-100">
              <li className="inline-flex items-center gap-1.5">
                <Clock size={14} aria-hidden="true" />
                신청 약 10분
              </li>
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} aria-hidden="true" />
                서울보증보험 가입
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-end">
            <Link
              href={applyHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-white px-6 text-base font-black text-[var(--color-brand-900)] shadow-[var(--shadow-lift)] transition hover:bg-brand-50"
            >
              이 물건 입찰 대리 신청
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-white/25 bg-white/10 px-6 text-sm font-bold text-white hover:bg-white/20"
            >
              수수료 안내
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
