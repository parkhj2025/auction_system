import type { Metadata } from "next";
import { InsightBlock } from "@/components/home/InsightBlock";

/* Phase 1.2 (A-1-2) v33 — /insight hub 페이지 신규.
 * 헤더 메뉴 "경매 인사이트" 진입 paradigm.
 * 홈 InsightBlock 광역 import (DRY 정합 / 4 카드 + 칩 5건 + h2 + 마침표 yellow).
 * 콘텐츠 광역 list 진입 0 (Phase 1.3 후 별도 cycle). */

export const metadata: Metadata = {
  title: "경매 인사이트",
  description:
    "물건 분석 · 가이드 · 용어 · 뉴스 — 경매가 처음이라면, 여기부터.",
};

export default function InsightHubPage() {
  return <InsightBlock />;
}
