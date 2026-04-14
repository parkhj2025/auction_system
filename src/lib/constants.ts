/**
 * 경매퀵 서비스 상수
 * 수수료·회사 정보는 여기서만 관리한다.
 */

export const FEES = {
  earlybird: 50_000, // 얼리버드 (입찰일 7일+ 전)
  standard: 70_000, // 일반 (2~7일 전)
  rush: 100_000, // 급건 (2일 이내)
  successBonus: 50_000, // 낙찰 성공보수
} as const;

export const COMPANY = {
  name: "경매퀵",
  ceo: "박형준",
  court: "인천지방법원",
  comingSoonRegions: ["수원지방법원", "대전지방법원", "부산지방법원", "대구지방법원"] as const,
  kakaoChannelUrl: "#", // TODO: 실채널 URL
  phone: "", // TODO
  address: "", // TODO
} as const;

/** 법원 선택 드롭다운. 활성 법원은 현재 인천만. */
export const COURTS_ACTIVE = [
  { value: "incheon", label: "인천지방법원" },
] as const;

export const COURTS_COMING_SOON = [
  { value: "suwon", label: "수원지방법원" },
  { value: "daejeon", label: "대전지방법원" },
  { value: "busan", label: "부산지방법원" },
  { value: "daegu", label: "대구지방법원" },
] as const;

/**
 * Phase 1 수수료·보증금 안내용 전용계좌.
 * Phase 2 PG 연동 시 이 상수는 결제 페이지 뒤에서만 쓰이고 프런트엔드 표시는 사라짐.
 * TODO: 실제 운영 계좌번호로 교체 (사업자 확인 후)
 */
export const BANK_INFO = {
  bank: "국민은행",
  accountNumber: "000-0000-0000-00",
  accountHolder: `${COMPANY.name} (${COMPANY.ceo})`,
  memo: "사건번호와 신청인 이름을 함께 입력해주세요",
} as const;

/** /apply 스텝 폼의 단계 목록. ApplyStepIndicator와 ApplyClient가 공유. */
export const APPLY_STEPS = [
  { id: "property", label: "물건 확인", hint: "사건번호로 물건을 확인합니다" },
  { id: "bid-info", label: "입찰 정보", hint: "입찰가와 신청인 정보" },
  { id: "documents", label: "서류 업로드", hint: "전자본인서명확인서·신분증" },
  { id: "confirm", label: "확인·제출", hint: "수수료 확인 후 제출" },
  { id: "complete", label: "접수 완료", hint: "전용계좌 안내" },
] as const;

export type ApplyStepId = (typeof APPLY_STEPS)[number]["id"];

export const COMPLIANCE_ITEMS = [
  "본 콘텐츠는 대법원 경매정보 및 공공데이터를 기초로 작성된 참고 자료이며, 투자 권유가 아닙니다. 투자 판단에 대한 책임은 본인에게 있습니다.",
  "본 서비스는 공인중개사법에 따른 매수신청 대리(입찰 대리) 업무만을 수행하며, 권리분석·투자자문·명도 등의 업무는 포함되지 않습니다.",
  "주변 시세는 외부 부동산 플랫폼, 국토부 실거래가 공개시스템 등 외부 데이터를 참조하였으며, 실시간 시세와 차이가 있을 수 있습니다.",
  "본 콘텐츠에 포함된 수익 시뮬레이션은 공개된 시세 데이터를 기초로 산출한 참고 수치이며, 실제 투자 진행 시에는 반드시 법무사·변호사 등 전문가의 권리분석과 자문을 거치시기 바랍니다.",
] as const;
