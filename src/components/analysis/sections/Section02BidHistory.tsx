import { SectionHeader } from "./SectionHeader";

/**
 * 섹션 02 — 입찰 경과.
 * Timeline 시각은 본문 표를 그대로 사용. 헤더만 baseline 변종.
 */
export function Section02BidHistory({ title }: { title: string }) {
  return (
    <SectionHeader num="02" title={title} />
  );
}
