/**
 * 대법원 경매정보 API 관련 정적 코드표.
 *
 * 출처: 2026-04-15 리버스 엔지니어링으로 확보한 데이터
 *   - /pgj/pgjComm/selectCortOfcCdLst.on → 전국 법원 60개
 *   - /pgj/pgj002/selectLclLst.on → 용도 대분류 4개
 *   - /pgj/pgj002/selectMclLst.on?code={lcl} → 각 대분류별 중분류
 *
 * 이 파일을 정적 상수로 유지하는 이유: 매번 API 호출 피하고 WAF 부담 최소화.
 * 법원·용도 분류 자체는 수년에 한 번 바뀌므로 하드코딩해도 무방.
 */

/**
 * 대법원 경매 기준 전국 법원 목록.
 * value = cortOfcCd (B로 시작하는 부동산 경매 사무소 코드)
 */
export const COURT_CODES = {
  // 서울권
  seoul_central: { code: "B000210", name: "서울중앙지방법원", region: "서울" },
  seoul_east: { code: "B000211", name: "서울동부지방법원", region: "서울" },
  seoul_south: { code: "B000212", name: "서울남부지방법원", region: "서울" },
  seoul_north: { code: "B000213", name: "서울북부지방법원", region: "서울" },
  seoul_west: { code: "B000215", name: "서울서부지방법원", region: "서울" },
  uijeongbu: { code: "B000214", name: "의정부지방법원", region: "경기북부" },
  goyang: { code: "B214807", name: "고양지원", region: "경기북부" },
  namyangju: { code: "B214804", name: "남양주지원", region: "경기북부" },

  // 경기·인천 (인천지방법원 관할) — 현재 서비스 지역
  incheon: { code: "B000240", name: "인천지방법원", region: "인천" },
  bucheon: { code: "B000241", name: "부천지원", region: "인천" },

  // 경기남부 (수원지방법원 관할)
  suwon: { code: "B000250", name: "수원지방법원", region: "경기남부" },
  seongnam: { code: "B000251", name: "성남지원", region: "경기남부" },
  yeoju: { code: "B000252", name: "여주지원", region: "경기남부" },
  pyeongtaek: { code: "B000253", name: "평택지원", region: "경기남부" },
  ansan: { code: "B250826", name: "안산지원", region: "경기남부" },
  anyang: { code: "B000254", name: "안양지원", region: "경기남부" },

  // 강원
  chuncheon: { code: "B000260", name: "춘천지방법원", region: "강원" },
  gangneung: { code: "B000261", name: "강릉지원", region: "강원" },
  wonju: { code: "B000262", name: "원주지원", region: "강원" },
  sokcho: { code: "B000263", name: "속초지원", region: "강원" },
  yeongwol: { code: "B000264", name: "영월지원", region: "강원" },

  // 충청
  cheongju: { code: "B000270", name: "청주지방법원", region: "충북" },
  chungju: { code: "B000271", name: "충주지원", region: "충북" },
  jecheon: { code: "B000272", name: "제천지원", region: "충북" },
  yeongdong: { code: "B000273", name: "영동지원", region: "충북" },
  daejeon: { code: "B000280", name: "대전지방법원", region: "충남" },
  hongseong: { code: "B000281", name: "홍성지원", region: "충남" },
  nonsan: { code: "B000282", name: "논산지원", region: "충남" },
  cheonan: { code: "B000283", name: "천안지원", region: "충남" },
  gongju: { code: "B000284", name: "공주지원", region: "충남" },
  seosan: { code: "B000285", name: "서산지원", region: "충남" },

  // 대구·경북
  daegu: { code: "B000310", name: "대구지방법원", region: "대구경북" },
  // ... (Phase 3 확장 시 추가)

  // 이하 부산·광주·제주 등 — 현재 Phase 2.5에서는 인천만 사용
};

/**
 * 검색할 "서비스 중" 법원 목록. 현재는 인천만.
 * Phase 3에서 수원·서울 등 확장 시 여기에 추가.
 */
export const ACTIVE_CRAWL_COURTS = [COURT_CODES.incheon];

/**
 * 용도 대분류 (lclDspslGdsLstUsgCd).
 * 2026-04-15 selectLclLst.on 응답 기준.
 */
export const USAGE_LARGE = {
  TOJI: { code: "10000", name: "토지" },
  GEONMUL: { code: "20000", name: "건물" },
  CHARYANG: { code: "30000", name: "차량및운송장비" },
  ETC: { code: "40000", name: "기타" },
};

/**
 * 용도 중분류 (mclDspslGdsLstUsgCd).
 * 2026-04-15 selectMclLst.on 응답 기준.
 */
export const USAGE_MEDIUM = {
  // 10000 토지
  JIMOK: { code: "10100", name: "지목", parent: "10000" },
  // 20000 건물 — 주거용은 여기!
  JUGEO: { code: "20100", name: "주거용건물", parent: "20000" },
  SANGEOP: { code: "21100", name: "상업용및업무용", parent: "20000" },
  SANEOP: { code: "22100", name: "산업용및기타특수용", parent: "20000" },
  YONGDO_BOKHAP: { code: "23100", name: "용도복합용", parent: "20000" },
  // 30000 차량및운송장비
  VEHICLE: { code: "30100", name: "차량", parent: "30000" },
  HEAVY: { code: "31100", name: "중기", parent: "30000" },
  SHIP: { code: "32100", name: "선박", parent: "30000" },
  AIRCRAFT: { code: "33100", name: "항공기", parent: "30000" },
  MOTOR: { code: "34100", name: "이륜차", parent: "30000" },
  // 40000 기타
  RIGHT: { code: "40100", name: "권리", parent: "40000" },
  OTHER: { code: "40200", name: "기타", parent: "40000" },
};

/**
 * 검색 API 호출 시 사용할 고정 상수.
 * 2026-04-15 Chrome DevTools 캡처 기준.
 */
export const SEARCH_API_CONSTANTS = {
  BASE_URL: "https://www.courtauction.go.kr",
  SEARCH_ENDPOINT: "/pgj/pgjsearch/searchControllerMain.on",
  INIT_ENDPOINT: "/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml",

  // WebSquare 필수 고정값
  SUBMISSION_ID: "mf_wfm_mainFrame_sbm_selectGdsDtlSrch",
  SC_USERID: "SYSTEM",
  PGM_ID: "PGJ151F01",

  // 부동산 경매 검색 조건 (차량·동산 아님)
  CORT_AUCTN_SRCH_COND_CD: "0004601",
  MVPRP_RLET_DVS_CD: "00031R",
  BID_DVS_CD: "000331",
  CORT_ST_DVS: "1",
  STAT_NUM: 1,
  NOTIFY_LOC: "off",

  // Chrome 147 표준 UA (2026-04-17 형준님 cURL 기준)
  USER_AGENT:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
};
