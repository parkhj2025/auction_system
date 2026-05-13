/**
 * 대법원 경매정보 사건 detail API (work-007 신규).
 *
 * paradigm = on-demand 단일 사건 detail fetch (search API 2주 윈도우 제약 회피).
 * endpoint = `/pgj/pgj15B/selectAuctnCsSrchRslt.on` (DETAIL_ENDPOINT) — 매각일 윈도우 무관 사건 detail 회수 정합.
 *
 * 흐름:
 *   1. session.init() (WMONID + JSESSIONID 발급)
 *   2. callDetail({ caseNumber, courtCode, itemSequence }) → POST DETAIL_ENDPOINT
 *   3. dma_result (csBaseInfo + dspslGdsDxdyInfo + gdsDspslObjctLst + gdsDspslDxdyLst 등 12 keys) → mapper layer → court_listings row
 *   4. dspslGdsSeq 1부터 증가 호출 + dma_result {} empty 시점 종료 (멀티 물건 사건 paradigm)
 *
 * 호환성 의무:
 *   회신 row schema = mapper.ts(search 응답) 동등 = lookup + orders/check 호출부 흐름 변경 0 + court_listings upsert paradigm 정합.
 *
 * 산출 search response 대비 변환 의무 4건:
 *   1. docid 생성 (search 응답에는 직접 있음 / detail에는 없음) — boCd + csNo + dspslGdsSeq + dspslObjctSeq concat (23자 ASCII, 기존 search docid 형식 정합)
 *   2. area_m2 정규식 파싱 (pjbBuldList "철근콘크리트구조 17.51㎡" → 17.51)
 *   3. next_min_bid_amount + next_min_bid_rate 파생 계산 (gdsDspslDxdyLst 안 현재 회차 직전 회차 추정)
 *   4. usage_name 키워드 추출 (bldDtlDts + bldNm + rletDvsDts 안 한글 키워드 추출 — 코드→한글 lookup table 직접 작성 회피)
 *
 * 좌표 paradigm:
 *   stXcrd/stYcrd (detail) ≠ wgs84Xcordi/Ycordi (search) 좌표계 불일치 — 검증된 변환 layer 부재.
 *   동시에 search 응답 wgs84 = 정수 truncate (lon 126 / lat 37) 사실 = 신뢰도 0.
 *   결정: wgs84_lon / wgs84_lat NULL 보존 (안전한 선택 / 분석 페이지 안 지도 표시 영향 검수 의무).
 *
 * 호환성 검증 (dev IP / 2026-05-13):
 *   - 532249 (윈도우 밖 / 매각일 2026-06-29) → records.length=1 + dma_result 12 keys 정합
 *   - 559336 + 540431 (윈도우 안 후보) → 동일 schema 정합
 *
 * 폐기 영역 0: search.ts fetchSingleCase 보존 (photos.ts + seed-photos.mjs + 다른 사용처 정합).
 */

import { COURT_AUCTION } from "./codes";
import { createSession } from "./session";

type Session = ReturnType<typeof createSession>;

/* ─────────────────────────  Detail response schema  ───────────────────────── */

interface CsBaseInfo {
  cortOfcCd?: string;
  cortOfcNm?: string;
  cortSptNm?: string;
  csNo?: string;
  csNm?: string;
  csRcptYmd?: string;
  csCmdcYmd?: string;
  clmAmt?: number;
  jdbnCd?: string;
  cortAuctnJdbnNm?: string;
  jdbnTelno?: string;
  csProgStatCd?: string;
  userCsNo?: string;
  [k: string]: unknown;
}

interface DspslGdsDxdyInfo {
  cortOfcCd?: string;
  csNo?: string;
  dspslGdsSeq?: number;
  auctnGdsStatCd?: string;
  flbdNcnt?: number;
  aeeEvlAmt?: number;
  fstPbancLwsDspslPrc?: number;
  bidDvsCd?: string;
  dspslDxdyYmd?: string;
  fstDspslHm?: string;
  dspslDcsnDxdyYmd?: string;
  prchDposRate?: number;
  dspslPlcNm?: string;
  dspslGdsRmk?: string;
  cortOfcNm?: string;
  [k: string]: unknown;
}

interface GdsDspslDxdyItem {
  dxdyYmd?: string;
  dxdyHm?: string;
  dxdyPlcNm?: string;
  auctnDxdyKndCd?: string;
  auctnDxdyRsltCd?: string | null;
  auctnDxdyGdsStatCd?: string | null;
  tsLwsDspslPrc?: number | null;
  dspslAmt?: number | null;
  [k: string]: unknown;
}

interface GdsDspslObjctItem {
  cortOfcCd?: string;
  csNo?: string;
  dspslGdsSeq?: number;
  dspslObjctSeq?: number;
  rletDvsDts?: string;
  pjbBuldList?: string;
  aeeEvlAmt?: number;
  lclDspslGdsLstUsgCd?: string;
  mclDspslGdsLstUsgCd?: string;
  sclDspslGdsLstUsgCd?: string;
  adongSdNm?: string;
  adongSggNm?: string;
  adongEmdNm?: string;
  adongRiNm?: string | null;
  rprsLtnoAddr?: string;
  bldNm?: string;
  bldDtlDts?: string;
  userPrintSt?: string;
  stXcrd?: number;
  stYcrd?: number;
  [k: string]: unknown;
}

export interface DmaResult {
  csBaseInfo?: CsBaseInfo;
  dspslGdsDxdyInfo?: DspslGdsDxdyInfo;
  gdsDspslDxdyLst?: GdsDspslDxdyItem[];
  gdsDspslObjctLst?: GdsDspslObjctItem[];
  csPicLst?: unknown[];
  [k: string]: unknown;
}

interface DetailResponse {
  status?: number;
  message?: string;
  errors?: unknown;
  data?: {
    dma_result?: DmaResult;
    ipcheck?: unknown;
  };
}

/* ─────────────────────────  Helpers  ───────────────────────── */

function toBigint(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(String(v).replace(/[^\d-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function toInt(v: unknown): number | null {
  const n = toBigint(v);
  return n === null ? null : Math.trunc(n);
}

/** YYYYMMDD → ISO date (YYYY-MM-DD). 형식 불일치 = null. */
function toIsoDate(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!/^\d{8}$/.test(s)) return null;
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

/** "철근콘크리트구조 17.51㎡" → 17.51. 정규식 추출 NG = null. */
function parseAreaM2(v: unknown): number | null {
  if (typeof v !== "string") return null;
  const m = v.match(/(\d+(?:\.\d+)?)\s*㎡/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

/**
 * docid 생성 — search API 응답 docid 형식 정합 (23자 ASCII).
 * 형식: ${boCd 7자}${csNo 14자}${dspslGdsSeq}${dspslObjctSeq}
 * 예: "B000240" + "20240130532249" + "1" + "1" = "B0002402024013053224911"
 */
function buildDocid(
  cortOfcCd: string,
  csNo: string,
  dspslGdsSeq: number,
  dspslObjctSeq: number,
): string {
  return `${cortOfcCd}${csNo}${dspslGdsSeq}${dspslObjctSeq}`;
}

/**
 * group_id 생성 — search API mapper 의 r.groupmaemulser 형식 정합 (22자 ASCII).
 * 형식: ${boCd}${csNo}${dspslGdsSeq} (mokmul 영역 0)
 */
function buildGroupId(
  cortOfcCd: string,
  csNo: string,
  dspslGdsSeq: number,
): string {
  return `${cortOfcCd}${csNo}${dspslGdsSeq}`;
}

/**
 * usage_name 추출 — bldDtlDts + bldNm 안 한글 매물 유형 키워드 매칭.
 * 코드 → 한글 lookup table 직접 작성 회피 paradigm (false data 위험 회피).
 *
 * source 우선순위: bldDtlDts → bldNm. (rletDvsDts "전유" / "공유" = 구분 명칭 / 매물 유형 keyword 충돌 회피 — source 제외).
 *
 * 단일 글자 keyword ("전" / "답" / "대") 영구 폐기: "전유" / "공유" 등의 구분 명칭과 substring 충돌 위험.
 *   토지 사건 검수 시 사용처 영역 0 paradigm 보수적 결정 — null 보존이 안전한 선택.
 *   향후 토지 사건 광역 회수 필요 시점 별개 paradigm (코드 매핑 layer) 추가 검토.
 */
const USAGE_KEYWORDS = [
  "아파트",
  "오피스텔",
  "다세대주택",
  "단독주택",
  "연립주택",
  "다가구주택",
  "빌라",
  "근린생활시설",
  "상가",
  "공장",
  "창고",
  "사무실",
  "주택",
  "토지",
  "대지",
  "임야",
];

function extractUsageName(
  bldDtlDts?: string,
  bldNm?: string,
): string | null {
  const sources = [bldDtlDts ?? "", bldNm ?? ""];
  for (const src of sources) {
    if (!src) continue;
    for (const kw of USAGE_KEYWORDS) {
      if (src.includes(kw)) return kw;
    }
  }
  return null;
}

/**
 * next_min_bid_amount + next_min_bid_rate 파생 계산.
 *
 * paradigm: gdsDspslDxdyLst 안 현재 dspslDxdyYmd (현재 회차 매각기일) 항목 직후 항목 추출.
 *   - 현재 회차 유찰 시점 = 직후 회차 = 다음 회차 최저가
 *   - 현재 회차 매각 시점 = 직후 회차 = 매각결정/대금납부 단계 (tsLwsDspslPrc null)
 *
 * 안전 기본값: 일치 항목 부재 또는 tsLwsDspslPrc null 시 next_min_bid_amount/rate 둘 다 null.
 */
function deriveNextBid(
  list: GdsDspslDxdyItem[] | undefined,
  currentBidDate: string | undefined,
  appraisalAmount: number | null,
): { next_min_bid_amount: number | null; next_min_bid_rate: number | null } {
  if (!list || list.length === 0 || !currentBidDate) {
    return { next_min_bid_amount: null, next_min_bid_rate: null };
  }
  // 현재 회차 매각기일 일치 항목 + 직후 항목 추출 (auctnDxdyKndCd "01" = 매각기일 단독)
  const auctionItems = list.filter((it) => it.auctnDxdyKndCd === "01");
  const idx = auctionItems.findIndex((it) => it.dxdyYmd === currentBidDate);
  if (idx < 0 || idx + 1 >= auctionItems.length) {
    return { next_min_bid_amount: null, next_min_bid_rate: null };
  }
  const next = auctionItems[idx + 1];
  const nextMin = toBigint(next.tsLwsDspslPrc);
  if (nextMin === null || nextMin === 0) {
    return { next_min_bid_amount: null, next_min_bid_rate: null };
  }
  const rate =
    appraisalAmount && appraisalAmount > 0
      ? Math.round((nextMin / appraisalAmount) * 100)
      : null;
  return { next_min_bid_amount: nextMin, next_min_bid_rate: rate };
}

/* ─────────────────────────  callDetail  ───────────────────────── */

/**
 * DETAIL_ENDPOINT 단일 호출. session.init() 사후 호출 의무.
 * timeout = 15초 (search.ts paradigm 정합).
 */
export async function callDetail(
  session: Session,
  params: {
    caseNumber: string;
    courtCode: string;
    itemSequence: number;
  },
): Promise<DetailResponse> {
  const { caseNumber, courtCode, itemSequence } = params;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(
      `${COURT_AUCTION.BASE_URL}${COURT_AUCTION.DETAIL_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "User-Agent": COURT_AUCTION.USER_AGENT,
          "Content-Type": "application/json;charset=UTF-8",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          Origin: COURT_AUCTION.BASE_URL,
          Referer: `${COURT_AUCTION.BASE_URL}${COURT_AUCTION.INIT_ENDPOINT}`,
          "SC-Userid": COURT_AUCTION.SC_USERID,
          "SC-Pgmid": COURT_AUCTION.DETAIL_PGM_ID,
          submissionid: COURT_AUCTION.DETAIL_SUBMISSION_ID,
          "sec-ch-ua":
            '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Cookie: session.cookieHeader(),
        },
        body: JSON.stringify({
          dma_srchGdsDtlSrch: {
            csNo: caseNumber,
            cortOfcCd: courtCode,
            dspslGdsSeq: String(itemSequence),
            pgmId: COURT_AUCTION.DETAIL_PGM_ID,
            srchInfo: {},
          },
        }),
        signal: controller.signal,
      },
    );

    session.mergeResponseCookies(res);

    const text = await res.text();
    let json: DetailResponse;
    try {
      json = JSON.parse(text) as DetailResponse;
    } catch {
      throw new Error(
        `Detail API JSON parse 실패 (HTTP ${res.status}): ${text.slice(0, 300)}`,
      );
    }

    if (!res.ok) {
      const errMsg =
        (json.errors as { errorMessage?: string })?.errorMessage ??
        `HTTP ${res.status}`;
      throw new Error(`Detail API error: ${errMsg}`);
    }

    if (json.errors) {
      throw new Error(`Detail API errors: ${JSON.stringify(json.errors)}`);
    }

    if (json.status !== 200) {
      throw new Error(
        `Detail API non-200 status: ${json.status} ${json.message ?? ""}`,
      );
    }

    return json;
  } finally {
    clearTimeout(timeoutId);
  }
}

/* ─────────────────────────  mapDetailToRow  ───────────────────────── */

/**
 * dma_result + mokmulIndex → court_listings row 매핑.
 *
 * 호환성 의무: mapper.ts 의 mapRecordToRow(search) 회신 row schema 와 동등.
 * lookup + orders/check 호출부 안 흐름 변경 0 + upsert(onConflict='docid') paradigm 정합.
 */
export function mapDetailToRow(
  result: DmaResult,
  mokmulIndex: number,
  courtNameFallback?: string,
): Record<string, unknown> {
  const base = result.csBaseInfo ?? {};
  const dxdyInfo = result.dspslGdsDxdyInfo ?? {};
  const objects = result.gdsDspslObjctLst ?? [];
  const obj = objects[mokmulIndex] ?? ({} as GdsDspslObjctItem);

  const cortOfcCd = String(base.cortOfcCd ?? obj.cortOfcCd ?? "");
  const csNo = String(base.csNo ?? obj.csNo ?? "");
  const dspslGdsSeq = Number(dxdyInfo.dspslGdsSeq ?? obj.dspslGdsSeq ?? 1);
  const dspslObjctSeq = Number(obj.dspslObjctSeq ?? mokmulIndex + 1);

  const docid = buildDocid(cortOfcCd, csNo, dspslGdsSeq, dspslObjctSeq);
  const groupId = buildGroupId(cortOfcCd, csNo, dspslGdsSeq);

  const appraisalAmount = toBigint(dxdyInfo.aeeEvlAmt ?? obj.aeeEvlAmt);
  const minBidAmount = toBigint(dxdyInfo.fstPbancLwsDspslPrc);
  const bidDate = toIsoDate(dxdyInfo.dspslDxdyYmd);

  const { next_min_bid_amount, next_min_bid_rate } = deriveNextBid(
    result.gdsDspslDxdyLst,
    typeof dxdyInfo.dspslDxdyYmd === "string"
      ? dxdyInfo.dspslDxdyYmd
      : undefined,
    appraisalAmount,
  );

  const usageName = extractUsageName(obj.bldDtlDts, obj.bldNm);

  return {
    docid,
    court_code: cortOfcCd,
    court_name: base.cortOfcNm || courtNameFallback || "",
    case_number: base.userCsNo || "",
    internal_case_no: csNo || null,
    item_sequence: dspslGdsSeq,
    mokmul_sequence: dspslObjctSeq,
    group_id: groupId,

    sido: obj.adongSdNm ?? null,
    sigungu: obj.adongSggNm ?? null,
    dong: obj.adongEmdNm ?? null,
    ri_name: obj.adongRiNm ?? null,
    lot_number: obj.rprsLtnoAddr ?? null,
    building_name: obj.bldNm ?? null,
    address_display: obj.userPrintSt ?? null,

    area_display: obj.pjbBuldList ?? null,
    area_m2: parseAreaM2(obj.pjbBuldList),
    land_category: obj.rletDvsDts ?? null,
    usage_name: usageName,
    usage_large_code: obj.lclDspslGdsLstUsgCd ?? null,
    usage_medium_code: obj.mclDspslGdsLstUsgCd ?? null,
    usage_small_code: obj.sclDspslGdsLstUsgCd ?? null,

    appraisal_amount: appraisalAmount,
    min_bid_amount: minBidAmount,
    next_min_bid_amount,
    next_min_bid_rate,
    failed_count: toInt(dxdyInfo.flbdNcnt) ?? 0,
    bid_date: bidDate,
    bid_time:
      typeof dxdyInfo.fstDspslHm === "string" ? dxdyInfo.fstDspslHm : null,
    result_decision_date: toIsoDate(dxdyInfo.dspslDcsnDxdyYmd),
    bid_place: dxdyInfo.dspslPlcNm ?? null,
    status_code: dxdyInfo.auctnGdsStatCd ?? null,
    progress_status_code: base.csProgStatCd ?? null,
    /**
     * is_progressing — csProgStatCd 매핑.
     * search API mulJinYn="Y" 동등 paradigm — 진행 사건 단독 true.
     * csProgStatCd "0002100001" 등 진행 코드 매핑 (codes.ts 명세 부재 → 보수적 paradigm).
     * 안전한 선택: auctnGdsStatCd "00" / "07" 등 진행 시점 true (현재 회차 매각 진행 정합).
     */
    is_progressing:
      dxdyInfo.auctnGdsStatCd !== undefined &&
      dxdyInfo.auctnGdsStatCd !== null &&
      String(dxdyInfo.auctnGdsStatCd) !== "" &&
      String(dxdyInfo.auctnGdsStatCd) !== "99",
    bigo: dxdyInfo.dspslGdsRmk ?? null,

    dept_code: base.jdbnCd ?? null,
    dept_name: base.cortAuctnJdbnNm ?? null,
    dept_tel: base.jdbnTelno ?? null,

    /**
     * 좌표 paradigm — wgs84_lon/lat NULL 보존.
     * 사유: detail 응답 stXcrd/stYcrd 좌표계 미확정 (UTM-K 추정) + search 응답 wgs84 = 정수 truncate 신뢰도 0.
     * 분석 페이지 안 지도 표시 영향 검수 의무 (별개 paradigm 영역 / 후속 work).
     */
    wgs84_lon: null,
    wgs84_lat: null,

    /**
     * photos + photos_count + photos_fetched_at column 영구 제외 paradigm
     * (work-002 정정 6 + cycle 1-G-γ-α-η 정정 6 영구 보존).
     *
     * 사유: upsert(onConflict='docid', ignoreDuplicates=false) paradigm 안 column 부재 시점
     *   기존 photos NULL overwrite 회피 = seed-photos.mjs 수동 호출 결과 보존 paradigm.
     */

    case_title: base.csNm ?? null,

    raw_snapshot: result,
    last_seen_at: new Date().toISOString(),
    is_active: true,
  };
}

/* ─────────────────────────  fetchCaseDetail  ───────────────────────── */

/**
 * 단일 사건번호 + 법원코드 → court_listings row[] 회신.
 *
 * 흐름:
 *   1. createSession() + session.init() (WMONID + JSESSIONID 발급)
 *   2. dspslGdsSeq 1부터 증가 호출 + dma_result {} empty 또는 gdsDspslObjctLst [] empty 시점 종료
 *   3. 각 dspslGdsSeq 안 gdsDspslObjctLst.length 만큼 mokmulIndex 반복 (mokmul 단위 row 분리)
 *
 * 안전 상한: dspslGdsSeq 20 (대법원 사건 안 물건 수 초과 0 사실 정합 + 무한 loop 회피).
 *
 * 호환성 의무:
 *   lookup + orders/check route 호출부 안 fetchSingleCase 동등 paradigm — records.length > 0 분기 + map(r => mapRecordToRow(r, courtName)) → upsert 흐름 변경 0.
 *   detail.ts paradigm 안 mapper 단계 통합 (호출부 안 mapRecordToRow 호출 폐기 + 직접 row[] 회신).
 */
export async function fetchCaseDetail(params: {
  courtCode: string;
  caseNumber: string;
  courtNameFallback?: string;
}): Promise<Array<Record<string, unknown>>> {
  const { courtCode, caseNumber, courtNameFallback } = params;
  const session = createSession();
  await session.init();

  const rows: Array<Record<string, unknown>> = [];
  const MAX_ITEM_SEQ = 20;

  for (let seq = 1; seq <= MAX_ITEM_SEQ; seq++) {
    const response = await callDetail(session, {
      caseNumber,
      courtCode,
      itemSequence: seq,
    });
    const result = response.data?.dma_result;
    if (!result || Object.keys(result).length === 0) break;

    const objects = result.gdsDspslObjctLst ?? [];
    if (objects.length === 0) break;

    for (let mokmulIdx = 0; mokmulIdx < objects.length; mokmulIdx++) {
      rows.push(mapDetailToRow(result, mokmulIdx, courtNameFallback));
    }
  }

  return rows;
}
