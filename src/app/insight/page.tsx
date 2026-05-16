import type { Metadata } from "next";
import { getAllInsightCards } from "@/lib/content";
import { InsightHeader } from "@/components/insight/InsightHeader";
import { InsightFeed } from "@/components/insight/InsightFeed";

/* /insight 라우트 진입점 (work-012 제로베이스 재구축).
 * server component 단독 + getAllInsightCards() 호출 + props drilling.
 * 잡지 paradigm + 단일 컬럼 영구 + 카드 분기 (미디어 카드 + 텍스트 카드) + 모노톤 + 미세 그린 포인트.
 * 폐기 광역: Hero + 카테고리 nav + 페이지네이션 + 일러스트 + ?cat=/?page= URL query + toast. */

export const metadata: Metadata = {
  title: "경매 자료",
  description: "인천법원 경매 자료를 직접 정리하여 무료로 드립니다.",
};

export default function InsightPage() {
  const cards = getAllInsightCards();
  return (
    <main className="mx-auto max-w-2xl px-5 lg:px-0">
      <InsightHeader />
      <InsightFeed cards={cards} />
    </main>
  );
}
