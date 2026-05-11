/**
 * cycle 1-E-B-β — soft delete 광역 시각 indicator (admin 영역 단독).
 *
 * 광역 paradigm 정수:
 * - deleted_at NOT NULL 정합 시점 단독 표기 paradigm
 * - 사용자 영역 광역 노출 영역 0 (admin paradigm 단독)
 * - 광역 시각 토큰 = h-6 + px-2 + rounded-md + text-xs + font-bold (절대 크기 / 모바일·데스크탑 광역 단일 paradigm)
 * - red 색감 = bg-red-50 + text-red-600 + border-red-200 광역 (destructive paradigm 정합)
 */
export function SoftDeletedBadge() {
  return (
    <span className="inline-flex h-6 items-center rounded-md border border-red-200 bg-red-50 px-2 text-xs font-bold text-red-600">
      삭제 표시
    </span>
  );
}
