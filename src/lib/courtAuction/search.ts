/**
 * 대법원 경매정보 검색 API 광역 (cycle 1-D-A-3-2).
 *
 * paradigm = on-demand 단일 사건 fetch (mass 수집 광역 폐기).
 * 근거: scripts/crawler/api.mjs 광역 PoC (Stage 1) → TS 포팅.
 *
 * 흐름:
 *   1. session.init() (WMONID 쿠키 광역 발급)
 *   2. callSearch({ courtCode, caseNumber }) → POST /pgj/pgjsearch/searchControllerMain.on
 *   3. 응답 dlt_srchResult[] → mapper.ts → court_listings row 광역
 *   4. /api/orders/check 광역 = upsert + 즉시 회신
 */

import { COURT_AUCTION } from "./codes";
import { createSession } from "./session";

type Session = ReturnType<typeof createSession>;

/** 응답 record 형태 (raw / 117 필드 광역 / mapper 광역 변환 의무) */
export type SearchRecord = Record<string, unknown> & {
  docid?: string;
  srnSaNo?: string;
  jiwonNm?: string;
};

interface SearchResponse {
  status: number;
  message?: string;
  data?: {
    dlt_srchResult?: SearchRecord[];
    dma_pageInfo?: { totalCnt?: string };
  };
  errors?: { errorMessage?: string } | unknown;
}

interface SearchParams {
  courtCode: string;
  caseNumber: string;
  /** 입찰일 광역 검색 범위 — 단일 사건 fetch에서는 기본값 광역 (최근 1년 + 향후 1년). */
  bidStart?: string; // YYYYMMDD
  bidEnd?: string; // YYYYMMDD
  pageSize?: number;
}

/**
 * dma_srchGdsDtlSrchInfo 페이로드 광역 (서버 광역 = 전체 필드 검증).
 * 모든 필드 빈 문자열 초기화 사후 검색 조건 광역 덮어쓰기.
 */
function buildSearchPayload({
  courtCode,
  caseNumber,
  bidStart = "20200101", // 광역 기본 = 최근 5년 광역 매각 사건 광역 수용
  bidEnd = "20301231", // 광역 기본 = 향후 5년 광역
  pageSize = 50,
}: SearchParams) {
  return {
    dma_pageInfo: {
      pageNo: 1,
      pageSize,
      bfPageNo: "",
      startRowNo: "",
      totalCnt: "",
      totalYn: "Y",
      groupTotalCount: "",
    },
    dma_srchGdsDtlSrchInfo: {
      rletDspslSpcCondCd: "",
      bidDvsCd: COURT_AUCTION.BID_DVS_CD,
      mvprpRletDvsCd: COURT_AUCTION.MVPRP_RLET_DVS_CD,
      cortAuctnSrchCondCd: COURT_AUCTION.CORT_AUCTN_SRCH_COND_CD,
      rprsAdongSdCd: "",
      rprsAdongSggCd: "",
      rprsAdongEmdCd: "",
      rdnmSdCd: "",
      rdnmSggCd: "",
      rdnmNo: "",
      mvprpDspslPlcAdongSdCd: "",
      mvprpDspslPlcAdongSggCd: "",
      mvprpDspslPlcAdongEmdCd: "",
      rdDspslPlcAdongSdCd: "",
      rdDspslPlcAdongSggCd: "",
      rdDspslPlcAdongEmdCd: "",
      cortOfcCd: courtCode,
      jdbnCd: "",
      execrOfcDvsCd: "",
      lclDspslGdsLstUsgCd: "",
      mclDspslGdsLstUsgCd: "",
      sclDspslGdsLstUsgCd: "",
      cortAuctnMbrsId: "",
      aeeEvlAmtMin: "",
      aeeEvlAmtMax: "",
      lwsDspslPrcRateMin: "",
      lwsDspslPrcRateMax: "",
      flbdNcntMin: "",
      flbdNcntMax: "",
      objctArDtsMin: "",
      objctArDtsMax: "",
      mvprpArtclKndCd: "",
      mvprpArtclNm: "",
      mvprpAtchmPlcTypCd: "",
      notifyLoc: COURT_AUCTION.NOTIFY_LOC,
      lafjOrderBy: "",
      pgmId: COURT_AUCTION.SEARCH_PGM_ID,
      csNo: caseNumber,
      cortStDvs: COURT_AUCTION.CORT_ST_DVS,
      statNum: COURT_AUCTION.STAT_NUM,
      bidBgngYmd: bidStart,
      bidEndYmd: bidEnd,
      dspslDxdyYmd: "",
      fstDspslHm: "",
      scndDspslHm: "",
      thrdDspslHm: "",
      fothDspslHm: "",
      dspslPlcNm: "",
      lwsDspslPrcMin: "",
      lwsDspslPrcMax: "",
      grbxTypCd: "",
      gdsVendNm: "",
      fuelKndCd: "",
      carMdyrMax: "",
      carMdyrMin: "",
      carMdlNm: "",
      sideDvsCd: "",
    },
  };
}

/**
 * 검색 API 단일 호출. session 광역 init 사후 호출 의무.
 * timeout 광역 = 15초 (cycle 1-D-A-3-2 광역 자율 결정).
 */
export async function callSearch(
  session: Session,
  params: SearchParams,
): Promise<SearchResponse> {
  const payload = buildSearchPayload(params);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(
      `${COURT_AUCTION.BASE_URL}${COURT_AUCTION.SEARCH_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "User-Agent": COURT_AUCTION.USER_AGENT,
          "Content-Type": "application/json;charset=UTF-8",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          Origin: COURT_AUCTION.BASE_URL,
          Referer: `${COURT_AUCTION.BASE_URL}/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml`,
          "SC-Userid": COURT_AUCTION.SC_USERID,
          "SC-Pgmid": COURT_AUCTION.SEARCH_PGM_ID,
          submissionid: COURT_AUCTION.SEARCH_SUBMISSION_ID,
          "sec-ch-ua":
            '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Cookie: session.cookieHeader(),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      },
    );

    session.mergeResponseCookies(res);

    const text = await res.text();
    let json: SearchResponse;
    try {
      json = JSON.parse(text) as SearchResponse;
    } catch {
      throw new Error(
        `Search API JSON parse failed (HTTP ${res.status}): ${text.slice(0, 300)}`,
      );
    }

    if (!res.ok) {
      const errMsg =
        (json.errors as { errorMessage?: string })?.errorMessage ??
        `HTTP ${res.status}`;
      throw new Error(`Search API error: ${errMsg}`);
    }

    if (json.errors) {
      throw new Error(`Search API errors: ${JSON.stringify(json.errors)}`);
    }

    if (json.status !== 200) {
      throw new Error(
        `Search API non-200 status: ${json.status} ${json.message ?? ""}`,
      );
    }

    return json;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 단일 사건번호 광역 fetch + 응답 records 회신.
 * 호출자 광역 = mapper + upsert paradigm 광역 처리 의무.
 */
export async function fetchSingleCase(params: {
  courtCode: string;
  caseNumber: string;
}): Promise<SearchRecord[]> {
  const session = createSession();
  await session.init();
  const response = await callSearch(session, {
    courtCode: params.courtCode,
    caseNumber: params.caseNumber,
  });
  return response.data?.dlt_srchResult ?? [];
}
