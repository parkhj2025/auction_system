import type { Metadata } from "next";
import { InsightBlock } from "@/components/home/InsightBlock";
import { getFeaturedByCategory } from "@/lib/content";

/* Phase 1.2 (A-1-2) v35 — /insight hub 페이지 (매거진 카드 보존 / Topic Gateway = Phase B).
 * 홈 InsightBlock 광역 import + Featured server fetch + props 전달.
 * 콘텐츠 광역 ↑ 시 Topic Gateway 4 섹션 광역 진입 (별도 cycle). */

export const metadata: Metadata = {
  title: "경매 인사이트",
  description:
    "물건 분석 · 가이드 · 용어 · 뉴스 — 경매가 처음이라면, 여기부터.",
};

export default function InsightHubPage() {
  const featuredByCategory = {
    analysis: getFeaturedByCategory("analysis"),
    guide: getFeaturedByCategory("guide"),
    glossary: getFeaturedByCategory("glossary"),
    news: getFeaturedByCategory("news"),
  };
  return <InsightBlock featuredByCategory={featuredByCategory} />;
}
