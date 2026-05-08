import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getAllAnalysisPosts } from "@/lib/content";
import { ApplyClient } from "@/components/apply/ApplyClient";
import { ApplyChecklist } from "@/components/apply/ApplyChecklist";
import { ApplyHeroMotion } from "@/components/apply/ApplyHeroMotion";
import { PageHero } from "@/components/common/PageHero";

/* Stage 2 cycle 1-A — 헤더 광역 PageHero 차용 + ApplyChecklist 별개 section 즉시 노출.
 * 보강 (cycle 1-A 1차 후속):
 * 1. ApplyHeroMotion client wrapper 추출 (server component 광역 보존 + motion 광역 적용)
 * 2. PageHero + ApplyChecklist section = ApplyHeroMotion children 광역 stagger 진입
 * 3. breadcrumb 광역 폐기 (PageHero 차용 sub-page 광역 일관성 정합)
 * 4. PageHero h1 size 88 정정 (별개 파일 / 광역 sub-page 일괄 정합) */

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

        <section
          aria-label="신청 전 안심 근거"
          className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8 sm:py-12"
        >
          <ApplyChecklist values={[true, true, true, true, true]} displayOnly />
        </section>
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
