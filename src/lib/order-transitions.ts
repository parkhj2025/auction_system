import type { OrderStatus } from "@/types/order";
import { getStatusLabel } from "./order-status";

/**
 * 상태 전이 규칙. 현재 상태에서 전이 가능한 다음 상태 목록.
 *
 * 의도된 누락: won → cancelled, lost → cancelled 등 예외 전이는 포함하지 않음.
 * 경매 실무 예외 케이스가 실제 발생하면 그때 추가. 플랜 v2026-04-15 확정.
 */
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["deposit_received", "cancelled"],
  deposit_received: ["bidding", "cancelled"],
  bidding: ["won", "lost"],
  won: ["settled"],
  lost: ["deposit_returned"],
  deposit_returned: ["settled"],
  settled: [],
  cancelled: [],
};

/**
 * 전이 가능 여부 확인.
 */
export function isTransitionAllowed(
  from: OrderStatus,
  to: OrderStatus
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/**
 * 현재 상태에서 선택 가능한 다음 상태 옵션 목록 (label 포함).
 */
export function getNextStatusOptions(
  current: OrderStatus
): Array<{ value: OrderStatus; label: string }> {
  return ALLOWED_TRANSITIONS[current].map((s) => ({
    value: s,
    label: getStatusLabel(s),
  }));
}

/**
 * 종료 상태 여부. SSN이 이미 자동 삭제되었을 가능성이 높음.
 */
export function isTerminalStatus(status: OrderStatus): boolean {
  return (
    status === "won" ||
    status === "lost" ||
    status === "cancelled" ||
    status === "deposit_returned" ||
    status === "settled"
  );
}
