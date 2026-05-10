/**
 * orders 테이블 row 타입 (Supabase DB 스키마와 1:1 매핑).
 * 마이페이지/관리자 양쪽에서 공유.
 */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "deposit_received"
  | "bidding"
  | "won"
  | "lost"
  | "deposit_returned"
  | "settled"
  | "cancelled";

export type FeeTier = "earlybird" | "standard" | "rush";

export type DepositStatus = "pending" | "received" | "returned" | "forfeited";

/**
 * cycle 1-D-A-4-5 신규 — 수수료 입금 status enum.
 * deposit_waiting (default) = 입금 대기 / deposit_confirmed = 입금 확인 (admin 수동) / refunded = 환불 (cycle 1-E 사후).
 */
export type PaymentStatus = "deposit_waiting" | "deposit_confirmed" | "refunded";

export interface OrderRow {
  id: string;
  application_id: string;
  user_id: string;

  case_number: string;
  /** 매각회차 (Phase 6.7.6 신규 column / 동일 사건 다른 회차 = 별개 접수 paradigm). */
  auction_round: number;
  court: string;
  court_division: string | null;
  matched_slug: string | null;
  manual_entry: boolean;
  property_snapshot: Record<string, unknown> | null;

  bid_amount: number;
  applicant_name: string;
  phone: string;
  ssn_front: string | null;
  joint_bidding: boolean;
  joint_applicant_name: string | null;
  joint_applicant_phone: string | null;

  is_rebid: boolean;
  fee_tier: FeeTier;
  base_fee: number;
  success_bonus: number;

  deposit_amount: number | null;
  deposit_status: DepositStatus | null;
  deposit_received_at: string | null;
  deposit_returned_at: string | null;

  /** cycle 1-D-A-4-5 신규 — 수수료 입금 status (admin 수동 갱신 paradigm). */
  payment_status: PaymentStatus;
  /** cycle 1-D-A-4-5 신규 — 입금자명 (Step5Payment 사용자 입력 / default = applicant_name). */
  depositor_name: string | null;

  result: "won" | "lost" | "cancelled" | null;
  result_amount: number | null;
  result_note: string | null;
  result_at: string | null;

  status: OrderStatus;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DocumentRow {
  id: string;
  order_id: string;
  user_id: string;
  doc_type: "esign" | "id_card" | "other";
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
  deleted_at: string | null;
}
