import { SectionHeader } from "./SectionHeader";

/**
 * 섹션 03 — 권리 분석.
 * 등기부·임차인 등 본문 표/리스트는 baseline. 위험도 카드 등은 단계 3-2 어댑터 후 검토.
 * 분류 어휘 금지: "위험"·"함정"·"매력" 사용 금지. "권리관계" 사실 어휘만.
 */
export function Section03Rights({ title }: { title: string }) {
  return (
    <SectionHeader num="03" title={title} badge="권리관계" />
  );
}
