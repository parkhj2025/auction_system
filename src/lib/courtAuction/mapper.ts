/**
 * 대법원 API 응답 record → court_listings row (cycle 1-D-A-3-2 TS 포팅).
 *
 * 원본: scripts/crawler/mapper.mjs (Stage 1 검증 / cycle 1-D-A 광역 case_title 확장).
 * 광역 paradigm = on-demand 단일 fetch 사후 mapper + upsert 광역 정합.
 */

import type { SearchRecord } from "./search";

/** 문자열 → BIGINT (빈값/숫자 변환 0 시 null). */
function toBigint(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(String(v).replace(/[^\d-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function toInt(v: unknown): number | null {
  const n = toBigint(v);
  return n === null ? null : Math.trunc(n);
}

function toNumeric(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** YYYYMMDD → ISO date (YYYY-MM-DD). 형식 NG = null. */
function toIsoDate(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!/^\d{8}$/.test(s)) return null;
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

/** SearchRecord → court_listings row (단일 fetch 광역 / upsert 광역 의무). */
export function mapRecordToRow(
  raw: SearchRecord,
  courtNameFallback?: string,
): Record<string, unknown> {
  const r = raw as Record<string, unknown> & {
    docid?: string;
    boCd?: string;
    jiwonNm?: string;
    srnSaNo?: string;
    saNo?: string;
    maemulSer?: unknown;
    mokmulSer?: unknown;
    groupmaemulser?: string;
    hjguSido?: string;
    hjguSigu?: string;
    hjguDong?: string;
    hjguRd?: string;
    daepyoLotno?: string;
    buldNm?: string;
    printSt?: string;
    areaList?: string;
    maxArea?: unknown;
    minArea?: unknown;
    jimokList?: string;
    dspslUsgNm?: string;
    lclsUtilCd?: string;
    mclsUtilCd?: string;
    sclsUtilCd?: string;
    gamevalAmt?: unknown;
    minmaePrice?: unknown;
    notifyMinmaePrice1?: unknown;
    notifyMinmaePriceRate1?: unknown;
    yuchalCnt?: unknown;
    maeGiil?: unknown;
    maeHh1?: string;
    maegyuljGiil?: unknown;
    maePlace?: string;
    mulStatcd?: string;
    jinstatCd?: string;
    mulJinYn?: string;
    mulBigo?: string;
    jpDeptCd?: string;
    jpDeptNm?: string;
    tel?: string;
    wgs84Xcordi?: unknown;
    wgs84Ycordi?: unknown;
    csTit?: string;
    csTitNm?: string;
    caseHisNm?: string;
    dpslGdsCsNm?: string;
  };

  return {
    docid: r.docid,
    court_code: r.boCd || "",
    court_name: r.jiwonNm || courtNameFallback || "",
    case_number: r.srnSaNo || "",
    internal_case_no: r.saNo ?? null,
    item_sequence: toInt(r.maemulSer) ?? 1,
    mokmul_sequence: toInt(r.mokmulSer) ?? 1,
    group_id: r.groupmaemulser ?? null,

    sido: r.hjguSido ?? null,
    sigungu: r.hjguSigu ?? null,
    dong: r.hjguDong ?? null,
    ri_name: r.hjguRd ?? null,
    lot_number: r.daepyoLotno ?? null,
    building_name: r.buldNm ?? null,
    address_display: r.printSt ?? null,

    area_display: r.areaList ?? null,
    area_m2: toNumeric(r.maxArea) ?? toNumeric(r.minArea),
    land_category: r.jimokList ?? null,
    usage_name: r.dspslUsgNm ?? null,
    usage_large_code: r.lclsUtilCd ?? null,
    usage_medium_code: r.mclsUtilCd ?? null,
    usage_small_code: r.sclsUtilCd ?? null,

    appraisal_amount: toBigint(r.gamevalAmt),
    min_bid_amount: toBigint(r.minmaePrice),
    next_min_bid_amount: toBigint(r.notifyMinmaePrice1),
    next_min_bid_rate: toInt(r.notifyMinmaePriceRate1),
    failed_count: toInt(r.yuchalCnt) ?? 0,
    bid_date: toIsoDate(r.maeGiil),
    bid_time: r.maeHh1 ?? null,
    result_decision_date: toIsoDate(r.maegyuljGiil),
    bid_place: r.maePlace ?? null,
    status_code: r.mulStatcd ?? null,
    progress_status_code: r.jinstatCd ?? null,
    is_progressing: r.mulJinYn === "Y",
    bigo: r.mulBigo ?? null,

    dept_code: r.jpDeptCd ?? null,
    dept_name: r.jpDeptNm ?? null,
    dept_tel: r.tel ?? null,

    wgs84_lon: toNumeric(r.wgs84Xcordi),
    wgs84_lat: toNumeric(r.wgs84Ycordi),

    // cycle 1-G-γ-α-η 정정 6 = photos + photos_fetched_at + photos_count 3 column 영구 제외.
    // 사유: upsert 광역 onConflict='docid' + ignoreDuplicates=false 광역 = payload 안 column
    //   부재 시점 기존 column 광역 NULL overwrite 회피 = seed-photos.mjs 광역 수동 호출
    //   결과 광역 photos JSONB 광역 영구 보존 paradigm.
    // 광역 ζ-1 정정 5 (seed-photos.mjs --docid 단독 paradigm) 광역 정합 + cycle ζ-1 정정 6+7
    //   safety check 광역 광역 정합.

    case_title:
      r.csTit || r.csTitNm || r.caseHisNm || r.dpslGdsCsNm || null,

    raw_snapshot: raw,
    last_seen_at: new Date().toISOString(),
    is_active: true,
  };
}
