import type { Metadata } from "next";
import { InsightHubLayout } from "@/components/home/InsightHubLayout";
import { getFeaturedByCategory } from "@/lib/content";

/* Phase 1.2 (A-1-2) v37 — /insight Topic Gateway hub 광역 재구성.
 * paradigm: Hero (bg-gray-surface-muted) + 본문 (bg-white) 광역 분리 (/analysis 정합).
 * 메인 InsightBlock 단순 import 광역 폐기 (v33-v36). */

export const metadata: Metadata = {
  title: "경매 인사이트",
  description:
    "물건분석 · 가이드 · 용어 · 뉴스 — 경매 가이드부터 시장 동향까지, 한 페이지에서.",
};

export default function InsightHubPage() {
  const featuredByCategory = {
    analysis: getFeaturedByCategory("analysis"),
    guide: getFeaturedByCategory("guide"),
    glossary: getFeaturedByCategory("glossary"),
    news: getFeaturedByCategory("news"),
  };
  return <InsightHubLayout featuredByCategory={featuredByCategory} />;
}
