import type { AnalysisFrontmatter } from "./content";

/** court_listings 테이블에서 조회한 물건 요약 (Step1 매칭 카드용) */
export interface CourtListingSummary {
  docid: string;
  court_name: string;
  case_number: string;
  address_display: string | null;
  appraisal_amount: number | null;
  min_bid_amount: number | null;
  bid_date: string | null;
  bid_time: string | null;
  usage_name: string | null;
  area_display: string | null;
  failed_count: number;
  item_sequence: number;
  mokmul_sequence: number;
  photos_fetched_at: string | null;
}

export type FeeTier = "earlybird" | "standard" | "rush";

export interface FeeComputation {
  tier: FeeTier;
  tierLabel: string;
  baseFee: number;
  successBonus: number;
  /** 오늘 기준 입찰일까지 남은 일수. 음수면 과거. */
  daysUntilBid: number;
  description: string;
}

export interface ApplyBidInfo {
  bidAmount: string; // 원 단위 문자열. 최종 제출 시 숫자 변환
  applicantName: string;
  phone: string;
  ssnFront: string; // 주민등록번호 앞 6자리
  jointBidding: boolean;
  jointApplicantName: string;
  jointApplicantPhone: string;
  /** 재경매(대금미납 이력) 사건 여부. true면 보증금이 감정가의 20%로 계산됨. */
  rebid: boolean;
}

export interface ApplyDocuments {
  eSignFile: File | null;
  idFile: File | null;
  /** 전자본인서명확인서 발급증 (정부24 발급) */
  eSignCertFile?: File | null;
}

export interface ApplyFormData {
  caseNumber: string;
  court: string;
  matchedPost: AnalysisFrontmatter | null;
  /** court_listings에서 매칭된 물건 (PoC D10 기반) */
  matchedListing?: CourtListingSummary | null;
  /** matchedPost 없이 사용자가 수동으로 입력했는지 */
  manualEntry: boolean;
  bidInfo: ApplyBidInfo;
  documents: ApplyDocuments;
  checklist: boolean[];
}

export interface ApplySubmissionResult {
  ok: boolean;
  applicationId?: string;
  error?: string;
}

export const INITIAL_APPLY_DATA: ApplyFormData = {
  caseNumber: "",
  court: "인천지방법원",
  matchedPost: null,
  manualEntry: false,
  bidInfo: {
    bidAmount: "",
    applicantName: "",
    phone: "",
    ssnFront: "",
    jointBidding: false,
    jointApplicantName: "",
    jointApplicantPhone: "",
    rebid: false,
  },
  documents: {
    eSignFile: null,
    idFile: null,
  },
  checklist: [false, false, false, false, false],
};
