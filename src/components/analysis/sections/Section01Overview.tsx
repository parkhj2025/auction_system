import { SectionHeader } from "./SectionHeader";

/**
 * 섹션 01 — 물건 개요.
 * 본문은 일반 마크다운(표·문단). 헤더만 섹션별 baseline 변종.
 * 정보 그리드 2열·역세권 배지 등은 단계 3-2(C 적용)에서 meta.json 기반 신규.
 */
export function Section01Overview({ title }: { title: string }) {
  return (
    <SectionHeader
      num="01"
      title={title}
      badge="물건 정보"
      badgeTone="info"
    />
  );
}
