/**
 * 대법원 경매정보 검색 API 호출 래퍼.
 *
 * 엔드포인트: POST /pgj/pgjsearch/searchControllerMain.on
 * 요청: { dma_pageInfo, dma_srchGdsDtlSrchInfo }
 * 응답: { status, message, data: { dma_pageInfo, dlt_srchResult, ipcheck }, errors }
 *
 * 2026-04-15 확인된 필수 헤더:
 * - submissionid: mf_wfm_mainFrame_sbm_selectGdsDtlSrch
 * - SC-Userid: SYSTEM
 * - Referer: /pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml
 * - Origin: https://www.courtauction.go.kr
 */

import { SEARCH_API_CONSTANTS } from "./codes.mjs";

const {
  BASE_URL,
  SEARCH_ENDPOINT,
  SUBMISSION_ID,
  SC_USERID,
  PGM_ID,
  CORT_AUCTN_SRCH_COND_CD,
  MVPRP_RLET_DVS_CD,
  BID_DVS_CD,
  CORT_ST_DVS,
  STAT_NUM,
  NOTIFY_LOC,
  USER_AGENT,
} = SEARCH_API_CONSTANTS;

/**
 * dma_srchGdsDtlSrchInfo 필드 기본값 템플릿.
 * 모든 필드를 빈 문자열로 초기화한 뒤 검색 조건만 덮어쓴다.
 * 2026-04-15 Chrome DevTools 캡처 기준 — 서버가 전체 필드 존재를 검증함.
 */
function buildSearchPayload({
  courtCode,
  bidStart,
  bidEnd,
  pageNo = 1,
  pageSize = 10,
  usageLargeCode = "",
  usageMediumCode = "",
  usageSmallCode = "",
  caseNumber = "",
}) {
  return {
    dma_pageInfo: {
      pageNo,
      pageSize,
      bfPageNo: "",
      startRowNo: "",
      totalCnt: "",
      totalYn: "Y",
      groupTotalCount: "",
    },
    dma_srchGdsDtlSrchInfo: {
      rletDspslSpcCondCd: "",
      bidDvsCd: BID_DVS_CD,
      mvprpRletDvsCd: MVPRP_RLET_DVS_CD,
      cortAuctnSrchCondCd: CORT_AUCTN_SRCH_COND_CD,
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
      lclDspslGdsLstUsgCd: usageLargeCode,
      mclDspslGdsLstUsgCd: usageMediumCode,
      sclDspslGdsLstUsgCd: usageSmallCode,
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
      notifyLoc: NOTIFY_LOC,
      lafjOrderBy: "",
      pgmId: PGM_ID,
      csNo: caseNumber,
      cortStDvs: CORT_ST_DVS,
      statNum: STAT_NUM,
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
 * 검색 API 단일 호출. 성공 시 파싱된 응답 객체 반환.
 * 실패 시 throw — 호출자가 재시도/로그 결정.
 */
export async function callSearch(session, params) {
  const payload = buildSearchPayload(params);

  const res = await fetch(`${BASE_URL}${SEARCH_ENDPOINT}`, {
    method: "POST",
    headers: {
      "User-Agent": USER_AGENT,
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      Origin: BASE_URL,
      Referer: `${BASE_URL}/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml`,
      "SC-Userid": SC_USERID,
      submissionid: SUBMISSION_ID,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Cookie: session.cookieHeader(),
    },
    body: JSON.stringify(payload),
  });

  // 응답 쿠키가 있으면 세션에 병합 (WMONID 갱신 대비)
  session.mergeResponseCookies(res);

  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(
      `Search API JSON parse failed (HTTP ${res.status}): ${text.slice(0, 300)}`
    );
  }

  if (!res.ok) {
    const errMsg = json?.errors?.errorMessage || `HTTP ${res.status}`;
    throw new Error(`Search API error: ${errMsg}`);
  }

  if (json.errors) {
    throw new Error(`Search API errors: ${JSON.stringify(json.errors)}`);
  }

  if (json.status !== 200) {
    throw new Error(
      `Search API non-200 status: ${json.status} ${json.message}`
    );
  }

  return json;
}
