import type { InsightCardData } from "@/lib/content";
import { InsightCard } from "@/components/insight/InsightCard";

/* /insight feed (work-012 제로베이스 재구축).
 * 단일 컬럼 영구 (lg: grid 진입 0 / 잡지 paradigm 정수).
 * 카드 사이 = border-b border-gray-200 + py-10 / lg:py-14. */
export function InsightFeed({ cards }: { cards: InsightCardData[] }) {
  if (cards.length === 0) {
    return (
      <p className="py-16 text-center text-[14px] text-gray-500">
        아직 발행된 자료가 없습니다.
      </p>
    );
  }
  return (
    <ul className="border-t border-gray-200">
      {cards.map((card) => (
        <li
          key={card.id}
          className="border-b border-gray-200 py-10 lg:py-14"
        >
          <InsightCard card={card} />
        </li>
      ))}
    </ul>
  );
}
