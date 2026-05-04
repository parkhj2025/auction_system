import type { Metadata } from "next";
import { Suspense } from "react";
import { InsightHubLayout } from "@/components/home/InsightHubLayout";
import { getActiveInsightPosts } from "@/lib/content";

/* Phase 1.2 (A-1-2) v38 — /insight Topic Gateway hub (Hybrid paradigm).
 * paradigm: Hero (gray) + 본문 (white) + URL 쿼리 ?cat={slug} + Editor's Pick + 콘텐츠 list.
 * Suspense 광역 (useSearchParams CSR 광역 정합). */

export const metadata: Metadata = {
  title: "경매 인사이트",
  description:
    "물건분석 · 가이드 · 용어 · 뉴스 — 경매 가이드부터 시장 동향까지, 한 페이지에서.",
};

export default function InsightHubPage() {
  const allPosts = getActiveInsightPosts();
  return (
    <Suspense fallback={null}>
      <InsightHubLayout allPosts={allPosts} />
    </Suspense>
  );
}
