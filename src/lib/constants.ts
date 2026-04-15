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
 * /apply 전용 — 전국 지방법원 + 주요 지원 목록 (지역 그룹 포함).
 *
 * 운영 원칙 (2026-04-15 확정):
 * 접수는 전국 어느 법원이든 받는다. 서비스 불가 지역(`isServiced: false`)도
 * 드롭다운에서 동일하게 선택 가능하며, 접수 후 관리자가 /admin에서 확인 시
 * 직접 대리 불가한 지역이면 반려(cancelled) 또는 협력사 연결로 안내한다.
 * 이렇게 해야 서비스 확대 시 코드 변경 없이 isServiced 플래그만 바꾸면 된다.
 *
 * `COURTS_ACTIVE` / `COURTS_COMING_SOON`은 홈·/about·RegionStrip 같은 마케팅
 * 화면에서 서비스 커버리지 메시지 용도로 계속 사용 (접수 폼과 분리).
 */
export type CourtOption = {
  label: string;
  region: string;
  isServiced: boolean;
};

export const COURTS_ALL: CourtOption[] = [
  // 서울
  { label: "서울중앙지방법원", region: "서울", isServiced: false },
  { label: "서울동부지방법원", region: "서울", isServiced: false },
  { label: "서울서부지방법원", region: "서울", isServiced: false },
  { label: "서울남부지방법원", region: "서울", isServiced: false },
  { label: "서울북부지방법원", region: "서울", isServiced: false },

  // 경기북부 (의정부지방법원 관할)
  { label: "의정부지방법원", region: "경기북부", isServiced: false },
  { label: "의정부지방법원 고양지원", region: "경기북부", isServiced: false },
  { label: "의정부지방법원 남양주지원", region: "경기북부", isServiced: false },
  { label: "의정부지방법원 파주지원", region: "경기북부", isServiced: false },
  { label: "의정부지방법원 동두천지원", region: "경기북부", isServiced: false },

  // 인천 (인천지방법원 관할)
  { label: "인천지방법원", region: "인천", isServiced: true },
  { label: "인천지방법원 부천지원", region: "인천", isServiced: false },

  // 경기남부 (수원지방법원 관할)
  { label: "수원지방법원", region: "경기남부", isServiced: false },
  { label: "수원지방법원 성남지원", region: "경기남부", isServiced: false },
  { label: "수원지방법원 여주지원", region: "경기남부", isServiced: false },
  { label: "수원지방법원 평택지원", region: "경기남부", isServiced: false },
  { label: "수원지방법원 안산지원", region: "경기남부", isServiced: false },
  { label: "수원지방법원 안양지원", region: "경기남부", isServiced: false },

  // 강원
  { label: "춘천지방법원", region: "강원", isServiced: false },
  { label: "춘천지방법원 강릉지원", region: "강원", isServiced: false },
  { label: "춘천지방법원 원주지원", region: "강원", isServiced: false },
  { label: "춘천지방법원 속초지원", region: "강원", isServiced: false },
  { label: "춘천지방법원 영월지원", region: "강원", isServiced: false },

  // 대전·충청
  { label: "대전지방법원", region: "대전·충청", isServiced: false },
  { label: "대전지방법원 홍성지원", region: "대전·충청", isServiced: false },
  { label: "대전지방법원 공주지원", region: "대전·충청", isServiced: false },
  { label: "대전지방법원 논산지원", region: "대전·충청", isServiced: false },
  { label: "대전지방법원 서산지원", region: "대전·충청", isServiced: false },
  { label: "대전지방법원 천안지원", region: "대전·충청", isServiced: false },
  { label: "청주지방법원", region: "대전·충청", isServiced: false },
  { label: "청주지방법원 충주지원", region: "대전·충청", isServiced: false },
  { label: "청주지방법원 제천지원", region: "대전·충청", isServiced: false },
  { label: "청주지방법원 영동지원", region: "대전·충청", isServiced: false },

  // 대구·경북
  { label: "대구지방법원", region: "대구·경북", isServiced: false },
  { label: "대구지방법원 서부지원", region: "대구·경북", isServiced: false },
  { label: "대구지방법원 안동지원", region: "대구·경북", isServiced: false },
  { label: "대구지방법원 경주지원", region: "대구·경북", isServiced: false },
  { label: "대구지방법원 김천지원", region: "대구·경북", isServiced: false },
  { label: "대구지방법원 상주지원", region: "대구·경북", isServiced: false },
  { label: "대구지방법원 의성지원", region: "대구·경북", isServiced: false },
  { label: "대구지방법원 영덕지원", region: "대구·경북", isServiced: false },
  { label: "대구지방법원 포항지원", region: "대구·경북", isServiced: false },

  // 부산·울산·경남
  { label: "부산지방법원", region: "부산·울산·경남", isServiced: false },
  { label: "부산지방법원 동부지원", region: "부산·울산·경남", isServiced: false },
  { label: "부산지방법원 서부지원", region: "부산·울산·경남", isServiced: false },
  { label: "울산지방법원", region: "부산·울산·경남", isServiced: false },
  { label: "창원지방법원", region: "부산·울산·경남", isServiced: false },
  { label: "창원지방법원 마산지원", region: "부산·울산·경남", isServiced: false },
  { label: "창원지방법원 진주지원", region: "부산·울산·경남", isServiced: false },
  { label: "창원지방법원 통영지원", region: "부산·울산·경남", isServiced: false },
  { label: "창원지방법원 밀양지원", region: "부산·울산·경남", isServiced: false },
  { label: "창원지방법원 거창지원", region: "부산·울산·경남", isServiced: false },

  // 광주·전라
  { label: "광주지방법원", region: "광주·전라", isServiced: false },
  { label: "광주지방법원 목포지원", region: "광주·전라", isServiced: false },
  { label: "광주지방법원 장흥지원", region: "광주·전라", isServiced: false },
  { label: "광주지방법원 순천지원", region: "광주·전라", isServiced: false },
  { label: "광주지방법원 해남지원", region: "광주·전라", isServiced: false },
  { label: "전주지방법원", region: "광주·전라", isServiced: false },
  { label: "전주지방법원 군산지원", region: "광주·전라", isServiced: false },
  { label: "전주지방법원 정읍지원", region: "광주·전라", isServiced: false },
  { label: "전주지방법원 남원지원", region: "광주·전라", isServiced: false },

  // 제주
  { label: "제주지방법원", region: "제주", isServiced: false },
];

/** 지역별 optgroup 렌더링용 — 법원 목록을 region별로 묶는다. */
export function groupCourtsByRegion(): Array<{
  region: string;
  courts: CourtOption[];
}> {
  const groups: Record<string, CourtOption[]> = {};
  for (const c of COURTS_ALL) {
    if (!groups[c.region]) groups[c.region] = [];
    groups[c.region].push(c);
  }
  return Object.entries(groups).map(([region, courts]) => ({ region, courts }));
}

/**
 * 수수료·보증금 안내용 전용계좌.
 * Phase 2 현재는 이 상수가 Step5Complete·마이페이지·관리자 뷰에서 노출됨.
 * Phase 3 PG 연동 시 이 상수는 서버 검증용으로만 쓰이고 프런트엔드 노출은 사라짐.
 * TODO: 사업자등록 완료 후 실제 운영 계좌번호로 교체.
 */
export const BANK_INFO = {
  bank: "국민은행",
  accountNumber: "000-0000-0000-00",
  accountHolder: `${COMPANY.name} (${COMPANY.ceo})`,
  memo: "사건번호와 신청인 이름을 함께 입력해주세요",
} as const;

/**
 * 온라인 결제(PG) 기능 플래그.
 * Phase 2 기간은 계좌이체만 지원. Phase 3에서 월 수임 20건+ 도달 시 PG 연동.
 * true로 전환되면 Step5Complete의 "온라인 결제 (준비 중)" 카드가 활성 결제
 * 버튼으로 교체되어야 함.
 */
export const PAYMENT_PG_ENABLED = false;

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
