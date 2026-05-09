/**
 * 대법원 경매정보 API 상수.
 *
 * 근거: 2026-04-15 리버스 엔지니어링 + 2026-04-17 PoC 확정.
 * cycle 1-D-A-3-2 (2026-05-09): 검색 API 광역 상수 통합 (mass 수집 paradigm 광역 폐기 + on-demand 단일 fetch 정합).
 */

export const COURT_AUCTION = {
  BASE_URL: "https://www.courtauction.go.kr",
  INIT_ENDPOINT: "/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml",

  /** 검색 API (cycle 1-D-A-3-2 = 단일 사건번호 광역 정확 fetch) */
  SEARCH_ENDPOINT: "/pgj/pgjsearch/searchControllerMain.on",
  SEARCH_SUBMISSION_ID: "mf_wfm_mainFrame_sbm_selectGdsDtlSrch",
  SEARCH_PGM_ID: "PGJ151F01",

  /** 상세+사진 API (온디맨드) */
  DETAIL_ENDPOINT: "/pgj/pgj15B/selectAuctnCsSrchRslt.on",
  DETAIL_SUBMISSION_ID:
    "mf_wfm_mainFrame_sbm_selectGdsDtlSrchDtlInfo",
  DETAIL_PGM_ID: "PGJ15BM01",

  /** 검색 페이로드 분류 코드 (검증 완료 / 변동 0) */
  CORT_AUCTN_SRCH_COND_CD: "0004601",
  MVPRP_RLET_DVS_CD: "00031R",
  BID_DVS_CD: "000331",
  CORT_ST_DVS: "1",
  STAT_NUM: 1,
  NOTIFY_LOC: "off",

  /** 공통 헤더 값 */
  SC_USERID: "NONUSER",
  USER_AGENT:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
} as const;
