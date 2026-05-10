
/** 매각물건(item) 단위 요약 — 같은 item 내의 mokmul을 통합한 결과 */
export interface CourtListingSummary {
  /** 대표 docid (item 내 첫 번째 mokmul) */
  docid: string;
  court_name: string;
  case_number: string;
  /** 대표 주소 (건물 주소 우선, 없으면 토지) */
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
  /** 같은 item 내 구성 부동산 수 (토지+건물 등). 1이면 단독, 2+이면 일괄 */
  component_count: number;
  /** 매각회차 — failed_count + 1 (서버 주입). 신건은 1. Phase 6.7.6. */
  auction_round: number;
  /** 사이드바 fallback 주소 — sido + sigungu + dong (1-D-A) */
  sido: string | null;
  sigungu: string | null;
  dong: string | null;
  /** 사건명 (raw_snapshot 광역 추출 / null 시 UI fallback). 1-D-A. */
  case_title: string | null;
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
  ssnFront: string; // 주민등록번호 앞 6자리 (DB ssn_front, status 종료 시 자동 NULL)
  /**
   * 주민등록번호 뒷 7자리.
   * **메모리 전용** — DB에 저장되지 않는다.
   * 위임장 PDF 생성 시점에만 사용 → 업로드 성공 후 즉시 클리어.
   * (Phase 4 정책 — 2026-04-19)
   */
  ssnBack: string;
  jointBidding: boolean;
  jointApplicantName: string;
  jointApplicantPhone: string;
  /** 재경매(대금미납 이력) 사건 여부. true면 보증금이 감정가의 20%로 계산됨. */
  rebid: boolean;
}

export interface ApplyDocuments {
  eSignFile: File | null;
  idFile: File | null;
}

export interface ApplyFormData {
  caseNumber: string;
  court: string;
  /** court_listings에서 매칭된 물건 (대법원 fetch 단독 source / cycle 1-D-A-4 정합) */
  matchedListing?: CourtListingSummary | null;
  /**
   * 매각기일 (YYYY-MM-DD).
   * cycle 1-D-A-4-2: manualEntry paradigm 광역 영구 폐기 → 매칭 성공 시 listing.bid_date 자동 복사 단독.
   * 빈 문자열 ""이 미입력 상태.
   */
  bidDate: string;
  /** 물건 종류 — 매칭 시 listing.usage_name에서 자동 복사. cycle 1-D-A-4-2: manualEntry 폐기. */
  propertyType: string;
  /** 물건 주소. 매칭 시 listing.address_display에서 자동 복사. cycle 1-D-A-4-2: manualEntry 폐기. */
  propertyAddress: string;
  /** 사건 정보 확인 체크박스 동의 여부 (매칭 성공 경로 게이트). */
  caseConfirmedByUser: boolean;
  /** 사건 정보 확인 시점 KST ISO timestamp. 분쟁 시 위임인의 정보 입력·확인 시각 입증 근거. */
  caseConfirmedAt: string | null;
  /**
   * 매각회차 (Phase 6.7.6). 같은 사건번호의 다른 회차는 별도 접수로 허용.
   * cycle 1-D-A-4-2: manualEntry 폐기 → 매칭 성공 경로 listing.auction_round 자동 복사 단독.
   */
  auctionRound: number;
  bidInfo: ApplyBidInfo;
  documents: ApplyDocuments;
  /** 위임인 서명 (PNG base64 dataURL). 빈 캔버스면 null. Phase 3. */
  signature: string | null;
  /** 위임장 내용 확인 + 서명 위임 동의 */
  agreedDelegation: boolean;
  /** 개인정보 처리방침 동의 */
  agreedPrivacy: boolean;
  /** 서비스 이용약관 동의 */
  agreedTerms: boolean;
  /**
   * 입금자명 (Step5Payment 단독 / cycle 1-D-A-4-5 신규).
   * default = bidInfo.applicantName / 사용자 수정 가능 paradigm.
   * 사업자등록 사후 = 입금자명 매칭 paradigm 백엔드 검증 영역 (admin 영역).
   */
  depositorName: string;
  /**
   * 입찰가 확정 사후 true paradigm (cycle 1-D-A-4-7 신규).
   * 직전 cycle 1-D-A-4-3 = Step2BidInfo internal state → Step navigation 회귀 시점 false 회귀 NG 식별.
   * cycle 1-D-A-4-7 = ApplyClient drilling paradigm 갱신 → Step navigation 회귀 시점 보존 정수.
   * input bidAmount onChange 시점 = false 자동 회귀 paradigm (사용자 갱신 시점 재확인 의무).
   * BidConfirmModal "확인" click 시점 = true paradigm.
   */
  bidConfirmed: boolean;
}

export interface ApplySubmissionResult {
  ok: boolean;
  applicationId?: string;
  error?: string;
}

export const INITIAL_APPLY_DATA: ApplyFormData = {
  caseNumber: "",
  court: "인천지방법원",
  bidDate: "",
  propertyType: "",
  propertyAddress: "",
  caseConfirmedByUser: false,
  caseConfirmedAt: null,
  auctionRound: 1,
  bidInfo: {
    bidAmount: "",
    applicantName: "",
    phone: "",
    ssnFront: "",
    ssnBack: "",
    jointBidding: false,
    jointApplicantName: "",
    jointApplicantPhone: "",
    rebid: false,
  },
  documents: {
    eSignFile: null,
    idFile: null,
  },
  signature: null,
  agreedDelegation: false,
  agreedPrivacy: false,
  agreedTerms: false,
  depositorName: "",
  bidConfirmed: false,
};
