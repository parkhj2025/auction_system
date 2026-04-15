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

export interface OrderRow {
  id: string;
  application_id: string;
  user_id: string;

  case_number: string;
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
