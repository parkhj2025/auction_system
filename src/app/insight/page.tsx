import type { Metadata } from "next";
import { getAllInsightCards } from "@/lib/content";
import { InsightHeader } from "@/components/insight/InsightHeader";
import { InsightArchive } from "@/components/insight/InsightArchive";

/* /insight v2 라우트 진입점 (work-012 재구축 v2).
 * server component + getAllInsightCards 호출 + InsightHeader + InsightArchive props drilling.
 * 사이트 광역 일관 paradigm (ContentCard + sm:grid-cols-2 + lg:grid-cols-3 + max-w-c-base).
 * 검색 + type tab + AND filter = InsightArchive client component 단독. */

export const metadata: Metadata = {
  title: "자료실",
  description: "경매 자료, 직접 정리하여 무료로 드립니다.",
};

export default function InsightPage() {
  const cards = getAllInsightCards();
  return (
    <main className="flex flex-1 flex-col">
      <InsightHeader />
      <InsightArchive cards={cards} />
    </main>
  );
}
