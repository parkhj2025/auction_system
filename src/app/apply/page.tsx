import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import { getAllAnalysisPosts } from "@/lib/content";
import { ApplyClient } from "@/components/apply/ApplyClient";
import { ApplyChecklist } from "@/components/apply/ApplyChecklist";

// 로그인 상태에 따라 달라지는 페이지이므로 정적 캐싱 금지
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "입찰 대리 신청",
  description:
    "인천지방법원 경매 입찰 대리 웹 신청. 사건번호 확인 → 입찰 정보 → 서류 업로드 → 확인·제출 → 접수 완료. 얼리버드 5만원부터. 패찰 시 보증금 당일 즉시 반환.",
};

export default function ApplyPage() {
  const posts = getAllAnalysisPosts().map((p) => p.frontmatter);

  return (
    <main className="flex flex-1 flex-col">
      {/* 섹션 헤더 + 사전 안내 */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-5xl px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs font-semibold text-[var(--color-ink-500)]"
          >
            <Link href="/" className="hover:text-[var(--color-ink-900)]">
              홈
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="text-[var(--color-ink-700)]">입찰 대리 신청</span>
          </nav>

          <p className="mt-5 text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            입찰 대리 신청
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl">
            5분이면 끝나는 웹 접수
          </h1>
          <p className="mt-3 max-w-2xl text-[length:var(--text-body)] leading-7 text-[var(--color-ink-500)]">
            사건번호 확인부터 서류 업로드, 확인·제출까지 이 페이지에서
            완결됩니다. 접수 후 확인 연락은 카카오톡으로 드립니다.{" "}
            <Link
              href="/apply/guide"
              className="font-bold text-[var(--color-ink-900)] underline decoration-[var(--color-ink-200)] underline-offset-2 hover:text-black"
            >
              처음이세요? 신청 가이드
            </Link>
          </p>

          <details className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 open:pb-6">
            <summary className="cursor-pointer list-none text-sm font-black text-[var(--color-ink-900)]">
              신청 전 안심 근거 5가지 (펼쳐보기)
              <span className="ml-2 text-xs font-semibold text-[var(--color-ink-500)]">
                확인·제출 단계에서 다시 체크합니다
              </span>
            </summary>
            <div className="mt-4">
              <ApplyChecklist
                values={[true, true, true, true, true]}
                displayOnly
              />
            </div>
          </details>
        </div>
      </section>

      <Suspense fallback={<ApplyLoading />}>
        <ApplyClient posts={posts} />
      </Suspense>
    </main>
  );
}

function ApplyLoading() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="h-10 w-48 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-ink-100)]" />
      <div className="mt-6 h-96 animate-pulse rounded-[var(--radius-xl)] bg-[var(--color-ink-100)]" />
    </section>
  );
}
