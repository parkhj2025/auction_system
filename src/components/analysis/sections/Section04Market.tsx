import { SectionHeader } from "./SectionHeader";

/**
 * 섹션 04 — 시세 비교.
 * 본 단지 vs 주변 시세 카드 비교는 단계 3-2(C 적용)에서 meta.json.market_data 활용.
 * 본 단계는 헤더 + 본문 표만 baseline.
 */
export function Section04Market({ title }: { title: string }) {
  return (
    <SectionHeader
      num="04"
      title={title}
      badge="시세 비교"
      badgeTone="info"
    />
  );
}
