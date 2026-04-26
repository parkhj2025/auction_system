import { SectionHeader } from "./SectionHeader";

/**
 * 섹션 06 — 매각사례 참고.
 * 4칸 카드 그리드는 단계 3-2(C 적용) 영역. 본 단계는 헤더 + 본문 표 baseline.
 */
export function Section06SaleHistory({ title }: { title: string }) {
  return (
    <SectionHeader num="06" title={title} />
  );
}
