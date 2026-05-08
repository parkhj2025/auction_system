import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getAllAnalysisPosts } from "@/lib/content";
import { ApplyClient } from "@/components/apply/ApplyClient";
import { ApplyHeroMotion } from "@/components/apply/ApplyHeroMotion";
import { PageHero } from "@/components/common/PageHero";

/* Stage 2 cycle 1-A — 헤더 광역 PageHero 차용 + 광역 motion stagger 진입.
 * cycle 1-A 보강 (ApplyChecklist 광역 폐기):
 * - 별개 section mount + import 광역 폐기 (형준님 진의 = 안심 5건 광역 0)
 * - ApplyChecklist.tsx 파일 자체 보존 (/service 광역 사용 / 별개 cycle 영역) */

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
      <ApplyHeroMotion>
        <PageHero
          eyebrow="STEP 1 신청서 작성"
          title={
            <>
              신청부터 입찰까지,<br />
              5분이면{" "}
              <span style={{ color: "#FFD43B" }}>됩니다.</span>
            </>
          }
          subtitle="사건번호만 있으면 5단계로 끝납니다. 작성 중 어려운 부분은 직접 도와드립니다."
        >
          <Link
            href="/apply/guide"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#111418] underline decoration-[var(--color-ink-200)] underline-offset-2 hover:text-black"
          >
            처음이세요? 신청 가이드
          </Link>
        </PageHero>
      </ApplyHeroMotion>

      <Suspense fallback={<ApplyLoading />}>
        <ApplyClient posts={posts} />
      </Suspense>
    </main>
  );
}

function ApplyLoading() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
      <div className="h-10 w-48 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-ink-100)]" />
      <div className="mt-6 h-96 animate-pulse rounded-[var(--radius-xl)] bg-[var(--color-ink-100)]" />
    </section>
  );
}
