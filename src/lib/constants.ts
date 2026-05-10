/**
 * 경매퀵 서비스 상수
 * 수수료·회사 정보는 여기서만 관리한다.
 *
 * -- 브랜드명 / 수임인 정보 변경 절차 (2026-04-18 env 상수화 적용) --
 * 1. 변경 대상: NEXT_PUBLIC_BRAND_NAME, NEXT_PUBLIC_AGENT_REGISTRATION_NUMBER,
 *    NEXT_PUBLIC_AGENT_OFFICE_ADDRESS, NEXT_PUBLIC_AGENT_CONTACT
 * 2. 로컬: .env.local 값 수정 → pnpm build 재실행 → 클라이언트 번들에 inline됨
 * 3. 프로덕션: Vercel Dashboard → Environment Variables 수정 → 재배포 → 모든
 *    페이지/PDF/메타에 일괄 반영. 코드 수정 불필요.
 * 4. NEXT_PUBLIC_ 접두사이지만 런타임 클라이언트에서 process.env 접근하지 않고,
 *    constants.ts의 빌드 타임 평가 결과(BRAND_NAME 등)만 export하여 안전.
 */

export const FEES = {
  earlybird: 50_000, // 사전 신청가 (입찰일 7일+ 전)
  standard: 70_000, // 일반 (2~7일 전)
  rush: 100_000, // 급건 (2일 이내)
  successBonus: 50_000, // 낙찰 성공보수
} as const;

/**
 * 서비스 브랜드명. 사용처: 풋터, 메타 title/description, FAQ 본문, PDF Author 등.
 * 사업자등록 후 또는 브랜드 결정 변경 시 NEXT_PUBLIC_BRAND_NAME 환경변수만 교체.
 */
export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME ?? "경매퀵";

/**
 * 수임인(공인중개사) 정보. 위임장 PDF에 표기되는 값들.
 * 사업자등록 완료 시점에 NEXT_PUBLIC_AGENT_* 환경변수로 실제 값 교체.
 * COMPANY 객체와 분리한 이유: 단일 출처(SSOT) 유지 + env 그룹화 가독성.
 */
export const AGENT_INFO = {
  registrationNo:
    process.env.NEXT_PUBLIC_AGENT_REGISTRATION_NUMBER ??
    "공인중개사 등록번호 미정 (사업자등록 후 갱신)",
  address:
    process.env.NEXT_PUBLIC_AGENT_OFFICE_ADDRESS ??
    "사무소 주소 미정 (사업자등록 후 갱신)",
  phone:
    process.env.NEXT_PUBLIC_AGENT_CONTACT ??
    "연락처 미정 (사업자등록 후 갱신)",
} as const;

/**
 * 개인정보 열람·정정·삭제 요청 연락처. PDF 경고문, /privacy 페이지에 사용.
 * 사업자등록 후 NEXT_PUBLIC_PRIVACY_CONTACT 환경변수로 실제 값 교체.
 */
export const PRIVACY_CONTACT =
  process.env.NEXT_PUBLIC_PRIVACY_CONTACT ??
  "연락처 준비 중 (사업자등록 후 갱신)";

export const COMPANY = {
  name: BRAND_NAME,
  ceo: "박형준",
  court: "인천지방법원",
  comingSoonRegions: ["수원지방법원", "대전지방법원", "부산지방법원", "대구지방법원"] as const,
  kakaoChannelUrl: "#", // TODO: 실채널 URL — 향후 NEXT_PUBLIC_KAKAO_CHANNEL_URL env 후보
  // address, phone 필드는 AGENT_INFO로 단일 출처화 (Phase 1-FINAL 2026-04-18)
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
  /** 대법원 경매정보 법원코드 (cortOfcCd). 크롤러·사진 API에서 사용. */
  courtCode?: string;
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
  { label: "인천지방법원", region: "인천", isServiced: true, courtCode: "B000240" },
  { label: "인천지방법원 부천지원", region: "인천", isServiced: false, courtCode: "B000241" },

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
 * 수수료·보증금 안내용 전용계좌 (legacy / Step5Complete 잔존 사용 영역).
 * cycle 1-D-A-4-5 = BANK_ACCOUNT (env 단일 source) 신규 paradigm 정합 정수 (사업자등록 사후 분기).
 * TODO: 사업자등록 완료 후 BANK_ACCOUNT env 갱신 + 본 BANK_INFO 폐기.
 */
export const BANK_INFO = {
  bank: "국민은행",
  accountNumber: "000-0000-0000-00",
  accountHolder: `${COMPANY.name} (${COMPANY.ceo})`,
  memo: "사건번호와 신청인 이름을 함께 입력해주세요",
} as const;

/**
 * cycle 1-D-A-4-6 정정 — mockup default + env 단독 분기 paradigm.
 *
 * 직전 cycle 1-D-A-4-5 conditional render paradigm 회수 → mockup default 광역 paradigm.
 *
 * 사업자등록 사전 (현재 Phase 1) = env 미설정 → MOCKUP_BANK 단독 render
 *   → Step5Payment + Step5Complete = mockup 입금 안내 카드 광역 (영역 0 zeros 명확 mockup paradigm)
 * 사업자등록 사후 = env 설정 → BANK_ACCOUNT.isConfigured === true → env source 단독 render
 *   → 코드 영역 0 / 형준님 .env.local + Vercel env 단일 갱신 paradigm
 *
 * NEXT_PUBLIC_ prefix 의무 = client component env 접근 paradigm (Next.js 정합).
 */
export const MOCKUP_BANK = {
  bankName: "우리은행",
  accountNumber: "0000-000-000000",
  accountHolder: "경매퀵 (박형준)",
} as const;

export const BANK_ACCOUNT = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME ?? "",
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "",
  accountHolder: process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER ?? "",
  isConfigured: !!(
    process.env.NEXT_PUBLIC_BANK_NAME &&
    process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER &&
    process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER
  ),
} as const;

/**
 * Step5Payment + Step5Complete render source 광역 단일 paradigm.
 * isConfigured 분기 = env 정합 시점 단독 / mockup default = Phase 1 paradigm 정수.
 */
export const DISPLAY_BANK = BANK_ACCOUNT.isConfigured
  ? BANK_ACCOUNT
  : MOCKUP_BANK;

/**
 * 온라인 결제(PG) 기능 플래그 (legacy / Step5Complete 잔존 사용 영역).
 * cycle 1-D-A-4-5 = 결제 paradigm 광역 = 단순 계좌이체 단독 (PG = Phase 10 사후 영역).
 */
export const PAYMENT_PG_ENABLED = false;

/**
 * /apply 스텝 폼의 단계 목록. ApplyStepIndicator와 ApplyClient가 공유.
 * cycle 1-D-A-4-5 = "payment" step 신규 추가 (4 → 5단계 광역).
 */
export const APPLY_STEPS = [
  { id: "property", label: "물건\n확인", hint: "사건번호로 물건을 확인합니다" },
  { id: "bid-info", label: "입찰\n정보", hint: "입찰가와 신청인 정보" },
  { id: "documents", label: "서류\n업로드", hint: "전자본인서명확인서·신분증" },
  { id: "confirm", label: "위임 계약·\n서명", hint: "위임 계약 확인 후 서명" },
  { id: "payment", label: "결제·\n접수", hint: "입금자명 확인 후 신청 접수" },
  { id: "complete", label: "접수\n완료", hint: "접수번호 + 입금 안내" },
] as const;

export type ApplyStepId = (typeof APPLY_STEPS)[number]["id"];

/* Phase 1.2 (A-1-2) v6 — InsightBlock 카테고리 색 시스템.
 * 4 카테고리: 무료 물건분석 (green) / 가이드 (blue) / 시장 인사이트 (orange) / 낙찰사례 (purple). */
export type InsightCategoryKey = "analysis" | "guide" | "insight" | "cases";

export const INSIGHT_CATEGORIES: Record<
  InsightCategoryKey,
  { label: string; color: string; bgVar: string }
> = {
  analysis: {
    label: "무료 물건분석",
    color: "#00C853",
    bgVar: "var(--cat-analysis)",
  },
  guide: { label: "가이드", color: "#3B82F6", bgVar: "var(--cat-guide)" },
  insight: {
    label: "시장 인사이트",
    color: "#F59E0B",
    bgVar: "var(--cat-insight)",
  },
  cases: { label: "낙찰사례", color: "#8B5CF6", bgVar: "var(--cat-cases)" },
};

export const COMPLIANCE_ITEMS = [
  "본 콘텐츠는 대법원 경매정보 및 공공데이터를 기초로 작성된 참고 자료이며, 투자 권유가 아닙니다. 투자 판단에 대한 책임은 본인에게 있습니다.",
  "본 서비스는 공인중개사법에 따른 매수신청 대리(입찰 대리) 업무만을 수행하며, 권리분석·투자자문·명도 등의 업무는 포함되지 않습니다.",
  "주변 시세는 외부 부동산 플랫폼, 국토부 실거래가 공개시스템 등 외부 데이터를 참조하였으며, 실시간 시세와 차이가 있을 수 있습니다.",
  "본 콘텐츠에 포함된 수익 시뮬레이션은 공개된 시세 데이터를 기초로 산출한 참고 수치이며, 실제 투자 진행 시에는 반드시 법무사·변호사 등 전문가의 권리분석과 자문을 거치시기 바랍니다.",
] as const;
