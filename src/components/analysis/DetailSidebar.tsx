import Link from "next/link";
import { ShieldCheck, FileCheck } from "lucide-react";
import type { AnalysisFrontmatter } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { FEES } from "@/lib/constants";

/**
 * 우측 플로팅 사이드바.
 * 스크롤 위치와 관계없이 "입찰 대리 신청" CTA가 시야에 머물러야 한다.
 * 데스크탑 전용 — 모바일은 MobileSticky가 같은 역할.
 */
export function DetailSidebar({ fm }: { fm: AnalysisFrontmatter }) {
  const applyHref = `/apply?case=${encodeURIComponent(fm.caseNumber)}`;

  return (
    <aside
      aria-label="입찰 대리 신청 안내"
      className="hidden lg:block"
    >
      <div className="sticky top-28 flex flex-col gap-4">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            {fm.court}
            {fm.courtDivision ? ` · ${fm.courtDivision}` : ""}
          </p>
          <p className="mt-2 line-clamp-2 text-base font-black text-[var(--color-ink-900)]">
            {fm.buildingName ?? fm.title} {fm.ho ?? ""}
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-500)]">
            {fm.caseNumber}
          </p>

          <div className="mt-5 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
              {fm.round}차 최저가
            </p>
            <p className="mt-1 text-2xl font-black tabular-nums text-[var(--color-accent-red)]">
              {fm.minPriceDisplay ?? formatKoreanWon(fm.minPrice)}
            </p>
            <p className="mt-2 text-[11px] text-[var(--color-ink-500)]">
              입찰일 · {fm.bidDate}
              {fm.bidTime ? ` ${fm.bidTime}` : ""}
            </p>
          </div>

          <Link
            href={applyHref}
            className="mt-5 flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-brand-600 px-5 text-sm font-black text-white shadow-[var(--shadow-card)] transition hover:bg-brand-700"
          >
            이 물건 입찰 대리 신청
          </Link>

          <p className="mt-3 text-center text-[11px] text-[var(--color-ink-500)]">
            얼리버드 수수료 {(FEES.earlybird / 10_000).toLocaleString("ko-KR")}
            만원부터 · 패찰 시 보증금 전액 반환
          </p>
        </div>

        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
            안심 근거
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-xs text-[var(--color-ink-700)]">
            <li className="flex items-start gap-2">
              <ShieldCheck
                size={14}
                className="mt-0.5 shrink-0 text-brand-600"
                aria-hidden="true"
              />
              공인중개사 등록 · 서울보증보험 가입
            </li>
            <li className="flex items-start gap-2">
              <FileCheck
                size={14}
                className="mt-0.5 shrink-0 text-brand-600"
                aria-hidden="true"
              />
              전자본인서명확인서로 비대면 처리
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
