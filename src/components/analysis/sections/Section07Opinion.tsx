import { SectionHeader } from "./SectionHeader";

/**
 * 섹션 07 — 종합 의견.
 * 본문 산문 + "체크포인트" 박스(post.md의 H3 "체크포인트")는 baseline mdx 처리에 맡김.
 * 분류 어휘 금지(원칙 5): "교훈"·"매력" 사용 금지. "체크포인트"·"종합" 사실 어휘만.
 */
export function Section07Opinion({ title }: { title: string }) {
  return (
    <SectionHeader
      num="07"
      title={title}
      badge="종합 의견"
      badgeTone="info"
    />
  );
}
