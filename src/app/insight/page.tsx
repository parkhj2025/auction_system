import type { Metadata } from "next";
import { Suspense } from "react";
import { InsightHubLayout } from "@/components/insight/InsightHubLayout";
import { getAllInsightCards } from "@/lib/content";

/* 단계 2.5 (work-012) — /insight server reader 진입 paradigm.
 * server component 안 getAllInsightCards() 호출 + InsightHubLayout 안 props drilling.
 * mock 폐기 사후 실 content/{analysis,guide,data}/ reader 단독 정합.
 * 첫 카드 자동 featured = publishedAt desc 정렬 최상단 (별개 featured 필드 영역 0).
 * Suspense = InsightHubLayout 안 useSearchParams CSR 정합 보존. */

export const metadata: Metadata = {
  title: "경매 인사이트",
  description:
    "경매 과정·용어·물건 분석·빅데이터 — 헷갈리는 경매를 정확하게 정리했습니다.",
};

export default function InsightHubPage() {
  const cards = getAllInsightCards();
  const editorsPick = cards[0] ?? null;
  return (
    <Suspense fallback={null}>
      <InsightHubLayout cards={cards} editorsPick={editorsPick} />
    </Suspense>
  );
}
