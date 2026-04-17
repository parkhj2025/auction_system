/**
 * 대법원 경매정보 API 상수.
 *
 * 근거: 2026-04-15 리버스 엔지니어링 + 2026-04-17 PoC 확정.
 * scripts/crawler/codes.mjs 와 동기화 유지.
 */

export const COURT_AUCTION = {
  BASE_URL: "https://www.courtauction.go.kr",
  INIT_ENDPOINT: "/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml",

  /** 상세+사진 API (온디맨드) */
  DETAIL_ENDPOINT: "/pgj/pgj15B/selectAuctnCsSrchRslt.on",
  DETAIL_SUBMISSION_ID:
    "mf_wfm_mainFrame_sbm_selectGdsDtlSrchDtlInfo",
  DETAIL_PGM_ID: "PGJ15BM01",

  /** 공통 헤더 값 */
  SC_USERID: "NONUSER",
  USER_AGENT:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
} as const;
