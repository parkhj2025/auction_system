import { SectionHeader } from "./SectionHeader";

/**
 * 섹션 05 — 투자 수익 시뮬레이션.
 * 시나리오 A/B/C Tabs 컴포넌트는 단계 3-2(C 적용)에서 meta.json.sections.05_investment.scenarios 기반.
 * 본 단계는 헤더 + 본문 표 그대로.
 */
export function Section05Investment({ title }: { title: string }) {
  return (
    <SectionHeader
      num="05"
      title={title}
      intro="아래 수치는 공개 시세 데이터 기반 참고 수치입니다. 실제 투자 진행 시 전문가 자문이 필요합니다."
    />
  );
}
