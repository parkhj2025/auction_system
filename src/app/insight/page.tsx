import type { Metadata } from "next";
import { Suspense } from "react";
import { InsightHubLayout } from "@/components/insight/InsightHubLayout";

/* work-012 — /insight 풀 신규 재제작.
 * Hero 자동 슬라이드 + 6 카테고리 nav + 1-col 콘텐츠 list + Editor's Pick.
 * mock 데이터 단독 (Phase 1 = 콘텐츠 부재). Suspense = useSearchParams CSR 정합. */

export const metadata: Metadata = {
  title: "경매 인사이트",
  description:
    "경매 과정·용어·물건 분석·빅데이터 — 헷갈리는 경매를 정확하게 정리했습니다.",
};

export default function InsightHubPage() {
  return (
    <Suspense fallback={null}>
      <InsightHubLayout />
    </Suspense>
  );
}
