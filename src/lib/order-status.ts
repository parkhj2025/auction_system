import type { OrderStatus } from "@/types/order";

/**
 * 접수 상태 → 한글 라벨
 */
export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "접수 대기";
    case "confirmed":
      return "서류 확인 완료";
    case "deposit_received":
      return "보증금 입금 확인";
    case "bidding":
      return "입찰 수행 중";
    case "won":
      return "낙찰";
    case "lost":
      return "패찰";
    case "deposit_returned":
      return "보증금 반환 완료";
    case "settled":
      return "정산 완료";
    case "cancelled":
      return "취소";
  }
}

/**
 * 진행 단계 (0~5). 취소는 -1.
 * 0 접수 → 1 서류 확인 → 2 보증금 확인 → 3 입찰 수행 → 4 결과 통보 → 5 정산 완료
 */
export function getStatusStep(status: OrderStatus): number {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "deposit_received":
      return 2;
    case "bidding":
      return 3;
    case "won":
    case "lost":
      return 4;
    case "deposit_returned":
    case "settled":
      return 5;
    case "cancelled":
      return -1;
  }
}

/**
 * 상태별 배지 색상 (Tailwind 클래스)
 */
export function getStatusBadgeClass(status: OrderStatus): string {
  const step = getStatusStep(status);

  if (status === "cancelled") {
    return "bg-[var(--color-ink-100)] text-[var(--color-ink-500)]";
  }
  if (status === "won" || status === "settled") {
    return "bg-green-100 text-green-800";
  }
  if (status === "lost" || status === "deposit_returned") {
    return "bg-[var(--color-ink-100)] text-[var(--color-ink-700)]";
  }
  if (step <= 2) {
    return "bg-[var(--color-ink-50)] text-[var(--color-ink-900)]";
  }
  // bidding
  return "bg-yellow-100 text-yellow-800";
}

/**
 * 상태가 진행 중(열린 상태)인지 여부.
 * 대시보드에서 "진행 중" vs "완료" 구분용.
 */
export function isActiveStatus(status: OrderStatus): boolean {
  return ![
    "cancelled",
    "settled",
    "deposit_returned",
  ].includes(status);
}

/**
 * cycle 1-E-A-2 — OrderStatus → StatusGroup mapping paradigm (단일 source / Lessons [A] 정합).
 * /my dashboard MyStatsCards 광역 + /my/orders FilterChips 광역 양 광역 단일 source paradigm.
 */
export type StatusGroup =
  | "in_progress"
  | "pending"
  | "completed"
  | "cancelled"
  | "all";

export const STATUS_GROUPS: Record<StatusGroup, OrderStatus[]> = {
  in_progress: ["confirmed", "deposit_received", "bidding", "won", "lost"],
  pending: ["pending"],
  completed: ["deposit_returned", "settled"],
  cancelled: ["cancelled"],
  all: [
    "pending",
    "confirmed",
    "deposit_received",
    "bidding",
    "won",
    "lost",
    "deposit_returned",
    "settled",
    "cancelled",
  ],
};

export const STATUS_GROUP_LABEL: Record<StatusGroup, string> = {
  in_progress: "진행 중",
  pending: "입금 대기",
  completed: "완료",
  cancelled: "취소",
  all: "전체",
};

export function getStatusGroup(status: OrderStatus): Exclude<StatusGroup, "all"> {
  if (status === "pending") return "pending";
  if (status === "cancelled") return "cancelled";
  if (
    status === "confirmed" ||
    status === "deposit_received" ||
    status === "bidding" ||
    status === "won" ||
    status === "lost"
  ) {
    return "in_progress";
  }
  return "completed";
}

export function isValidStatusGroup(value: string): value is StatusGroup {
  return (
    value === "in_progress" ||
    value === "pending" ||
    value === "completed" ||
    value === "cancelled" ||
    value === "all"
  );
}

/**
 * 타임라인 6단계 정의. StatusTimeline 컴포넌트에서 사용.
 */
export const TIMELINE_STEPS = [
  { id: 0, label: "접수", shortLabel: "접수" },
  { id: 1, label: "서류 확인", shortLabel: "서류" },
  { id: 2, label: "보증금 확인", shortLabel: "보증금" },
  { id: 3, label: "입찰 수행", shortLabel: "입찰" },
  { id: 4, label: "결과 통보", shortLabel: "결과" },
  { id: 5, label: "정산", shortLabel: "정산" },
] as const;

/**
 * 수수료 티어 라벨
 */
export function getFeeTierLabel(tier: "earlybird" | "standard" | "rush"): string {
  switch (tier) {
    case "earlybird":
      return "사전 신청가";
    case "standard":
      return "일반";
    case "rush":
      return "급건";
  }
}
