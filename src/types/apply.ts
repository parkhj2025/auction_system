import type { AnalysisFrontmatter } from "./content";

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
}

export interface ApplyDocuments {
  eSignFile: File | null;
  idFile: File | null;
}

export interface ApplyFormData {
  caseNumber: string;
  court: string;
  matchedPost: AnalysisFrontmatter | null;
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
  },
  documents: {
    eSignFile: null,
    idFile: null,
  },
  checklist: [false, false, false, false, false],
};
