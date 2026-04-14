import Link from "next/link";
import { ChevronRight, Info } from "lucide-react";
import { formatKoreanDate } from "@/lib/utils";

/**
 * /terms · /privacy · /refund 공용 법적 문서 레이아웃.
 * - 상단: breadcrumb + 문서 제목 + 시행일 + 참고 초안 디스클레이머
 * - 본문: children (조·항 구조의 JSX)
 * - 하단: 문의 연결 + 홈 복귀 링크
 */
export function LegalLayout({
  title,
  intro,
  effectiveDate,
  lastUpdated,
  children,
}: {
  title: string;
  intro?: string;
  effectiveDate: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs font-medium text-[var(--color-ink-500)]"
          >
            <Link href="/" className="hover:text-[var(--color-ink-900)]">
              홈
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="text-[var(--color-ink-700)]">{title}</span>
          </nav>
          <p className="mt-5 text-xs font-black uppercase tracking-wider text-brand-600">
            법적 고지
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-4 text-base leading-7 text-[var(--color-ink-500)]">
              {intro}
            </p>
          )}
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--color-ink-500)]">
            <div className="flex gap-2">
              <dt className="font-bold uppercase tracking-wider">시행일</dt>
              <dd className="tabular-nums text-[var(--color-ink-700)]">
                {formatKoreanDate(effectiveDate)}
              </dd>
            </div>
            {lastUpdated && (
              <div className="flex gap-2">
                <dt className="font-bold uppercase tracking-wider">최종 개정</dt>
                <dd className="tabular-nums text-[var(--color-ink-700)]">
                  {formatKoreanDate(lastUpdated)}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-8 flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 py-4 text-xs leading-5 text-[var(--color-ink-700)]">
            <Info
              size={14}
              className="mt-0.5 shrink-0 text-brand-600"
              aria-hidden="true"
            />
            <p>
              본 문서는 서비스 구조 공개를 위한 <strong>참고 초안</strong>이며,
              법률 전문가의 검토를 거쳐 정식 시행일 전 최종 확정됩니다. 최종
              확정본과 현 초안 사이에 차이가 있을 수 있으며, 이용자는 최종
              확정본을 기준으로 권리·의무를 판단하시기 바랍니다.
            </p>
          </div>
        </div>
      </section>

      <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="legal-body flex flex-col gap-10 text-[var(--color-ink-700)]">
          {children}
        </div>

        <div className="mt-16 border-t border-[var(--color-border)] pt-8">
          <p className="text-sm text-[var(--color-ink-500)]">
            본 문서와 관련한 문의는{" "}
            <Link
              href="/contact"
              className="font-bold text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
            >
              문의하기
            </Link>{" "}
            또는 카카오톡 채널로 연락해주세요.
          </p>
        </div>
      </article>
    </main>
  );
}

/** 법적 문서 내부에서 사용하는 조(Article) 블록. */
export function Article({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`article-${number}`}
      className="scroll-mt-24"
      id={`article-${number}`}
    >
      <h2
        id={`article-${number}-heading`}
        className="flex items-baseline gap-3 border-t border-[var(--color-border)] pt-8 text-xl font-black tracking-tight text-[var(--color-ink-900)] first:border-t-0 first:pt-0"
      >
        <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-600">
          {number}
        </span>
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-4 text-base leading-7">
        {children}
      </div>
    </section>
  );
}

/** 항목 번호가 매겨진 리스트. */
export function Clauses({ children }: { children: React.ReactNode }) {
  return (
    <ol className="flex list-decimal flex-col gap-2 pl-6 marker:font-bold marker:text-brand-600">
      {children}
    </ol>
  );
}
