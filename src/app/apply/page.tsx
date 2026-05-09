import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllAnalysisPosts } from "@/lib/content";
import { ApplyClient } from "@/components/apply/ApplyClient";

/* Stage 2 cycle 1-A 보강 1+ — /apply 본론 직진 paradigm.
 * 헤더 영역 광역 폐기 (PageHero · ApplyHeroMotion · 미니 헤더 · breadcrumb · details · 신청 가이드 link).
 * TopNav 직접 → ApplyClient 안 ApplyStepIndicator 직진 paradigm. */

// 로그인 상태에 따라 달라지는 페이지이므로 정적 캐싱 금지
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "입찰 대리 신청",
  description:
    "인천지방법원 경매 입찰 대리 웹 신청. 사건번호 확인 → 입찰 정보 → 서류 업로드 → 확인·제출 → 접수 완료. 사전 신청가 5만원부터. 패찰 시 보증금 당일 즉시 반환.",
};

export default function ApplyPage() {
  const posts = getAllAnalysisPosts().map((p) => p.frontmatter);

  return (
    <main className="flex flex-1 flex-col">
      <Suspense fallback={<ApplyLoading />}>
        <ApplyClient posts={posts} />
      </Suspense>
    </main>
  );
}

function ApplyLoading() {
  return (
    <section className="container-app py-16">
      <div className="h-10 w-48 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-ink-100)]" />
      <div className="mt-6 h-96 animate-pulse rounded-[var(--radius-xl)] bg-[var(--color-ink-100)]" />
    </section>
  );
}
