import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { AnalysisFrontmatter } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { FEES } from "@/lib/constants";

/**
 * 분석 상세 사이드바 — 데스크톱 전용 sticky 4 block.
 *  block 1: 핵심 수치 MiniStat (감정가/최저가 brand-50 강조/보증금/기일/면적)
 *  block 2: CTA (입찰 대리 신청 + 카카오 상담)
 *  block 3: TOC 7섹션 (#section-NN 앵커, scroll-mt-24)
 *  block 4: 근거자료 mini list (대법원 / 네○○ / 국토부)
 *
 * 모바일 = MobileSticky 가 동등 역할. 본 사이드바는 lg+ 만 표시.
 */

const SECTION_LABELS: Array<{ id: string; label: string; title: string }> = [
  { id: "section-01", label: "01", title: "물건 개요" },
  { id: "section-02", label: "02", title: "입찰 경과" },
  { id: "section-03", label: "03", title: "권리 분석" },
  { id: "section-04", label: "04", title: "시세 비교" },
  { id: "section-05", label: "05", title: "투자 수익 시뮬레이션" },
  { id: "section-06", label: "06", title: "매각사례 참고" },
  { id: "section-07", label: "07", title: "종합 의견" },
];

export function DetailSidebar({ fm }: { fm: AnalysisFrontmatter }) {
  const applyHref = `/apply?case=${encodeURIComponent(fm.caseNumber)}`;
  const depositAmount = Math.round(fm.minPrice * 0.1);

  return (
    <aside aria-label="분석 사이드바" className="hidden lg:block">
      <div className="sticky top-28 flex flex-col gap-5">
        {/* block 1 + 2: 핵심 수치 + CTA — 단일 카드로 묶음 (정보 위계 통합) */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
          <div className="border-b border-[var(--color-border)] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
              핵심 수치
            </p>
            <div className="mt-3 space-y-3">
              <MiniStat
                label="감정가"
                value={fm.appraisalDisplay ?? formatKoreanWon(fm.appraisal)}
              />
              <div className="rounded-[var(--radius-md)] bg-[var(--color-brand-50)] p-3">
                <p className="text-[11px] font-bold text-[var(--color-brand-700)] tabular-nums">
                  {fm.round}차 최저가 · {fm.percent}%
                </p>
                <p className="mt-1 text-2xl font-black tabular-nums leading-none text-[var(--color-brand-700)]">
                  {fm.minPriceDisplay ?? formatKoreanWon(fm.minPrice)}
                </p>
              </div>
              <MiniStat
                label="보증금 (10%)"
                value={formatKoreanWon(depositAmount)}
              />
              <MiniStat
                label="입찰기일"
                value={`${fm.bidDate}${fm.bidTime ? ` ${fm.bidTime}` : ""}`}
              />
              <MiniStat
                label="면적"
                value={`${fm.areaM2.toLocaleString("ko-KR")}㎡ (${fm.areaPyeong.toLocaleString("ko-KR")}평)`}
              />
            </div>
          </div>

          <div className="space-y-2 p-5">
            <Link
              href={applyHref}
              className="flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-brand-600 px-5 text-sm font-black tracking-tight text-white shadow-[var(--shadow-card)] transition duration-150 ease-out hover:bg-brand-700"
            >
              이 물건 입찰 대리 신청
            </Link>
            <Link
              href="/contact"
              className="flex min-h-10 items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-ink-700)] transition duration-150 ease-out hover:bg-[var(--color-ink-100)]"
            >
              <MessageCircle size={14} aria-hidden="true" />
              카카오톡 상담
            </Link>
            <p className="pt-1 text-center text-[11px] text-[var(--color-ink-500)] tabular-nums">
              얼리버드 {(FEES.earlybird / 10_000).toLocaleString("ko-KR")}만원부터 ·
              패찰 시 보증금 당일 즉시 반환
            </p>
          </div>
        </div>

        {/* block 3: TOC */}
        <nav
          aria-label="섹션 목차"
          className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            목차
          </p>
          <ol className="mt-3 space-y-1.5 text-sm">
            {SECTION_LABELS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="group flex items-baseline gap-2 text-[var(--color-ink-700)] transition duration-150 ease-out hover:text-[var(--color-brand-700)]"
                >
                  <span className="text-[11px] font-black tabular-nums text-[var(--color-ink-500)] group-hover:text-brand-600">
                    {s.label}
                  </span>
                  <span className="font-medium">{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* block 4: 근거자료 mini */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5 text-xs text-[var(--color-ink-700)]">
          <p className="font-bold text-[var(--color-ink-900)]">근거 자료</p>
          <ul className="mt-2 space-y-1 text-[var(--color-ink-500)]">
            <li>· 대법원 경매정보 공식 데이터</li>
            <li>· 네○○ 부동산 매물 시세</li>
            <li>· 국토부 실거래가 공개시스템</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] font-medium text-[var(--color-ink-500)]">
        {label}
      </span>
      <span className="text-sm font-bold tabular-nums text-[var(--color-ink-900)]">
        {value}
      </span>
    </div>
  );
}
