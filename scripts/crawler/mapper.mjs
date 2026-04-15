/**
 * 대법원 API 응답 레코드(117 필드) → court_listings 테이블 row 변환.
 *
 * 원본 필드(`raw`)는 `raw_snapshot` JSONB에 그대로 보존해서,
 * 나중에 스키마 추가 시 필드 이름만 바꾸면 재매핑 가능.
 */

/**
 * 문자열 → BIGINT (빈값이면 null).
 * 대법원 응답은 숫자도 문자열로 오는 경우가 많음.
 */
function toBigint(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(String(v).replace(/[^\d-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/**
 * 문자열 → INT
 */
function toInt(v) {
  const n = toBigint(v);
  return n === null ? null : Math.trunc(n);
}

/**
 * 문자열 → NUMERIC (소수 허용)
 */
function toNumeric(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/**
 * YYYYMMDD 문자열 → ISO date 문자열 (YYYY-MM-DD).
 * 잘못된 형식이면 null.
 */
function toIsoDate(v) {
  if (!v || typeof v !== "string") return null;
  const s = v.trim();
  if (!/^\d{8}$/.test(s)) return null;
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

/**
 * 응답 레코드 1건 → court_listings row.
 *
 * 응답 필드명은 2026-04-15 검색 API 응답 기준.
 * courtName은 `jiwonNm` 필드가 있지만 일부 응답에서 누락될 수 있으므로
 * 외부에서 주입받는 courtNameFallback을 기본값으로 사용.
 */
export function mapRecordToRow(raw, { courtNameFallback } = {}) {
  return {
    docid: raw.docid,
    court_code: raw.boCd || "",
    court_name: raw.jiwonNm || courtNameFallback || "",
    case_number: raw.srnSaNo || "",
    internal_case_no: raw.saNo || null,
    item_sequence: toInt(raw.maemulSer) ?? 1,
    mokmul_sequence: toInt(raw.mokmulSer) ?? 1,
    group_id: raw.groupmaemulser || null,

    // 주소
    sido: raw.hjguSido || null,
    sigungu: raw.hjguSigu || null,
    dong: raw.hjguDong || null,
    ri_name: raw.hjguRd || null,
    lot_number: raw.daepyoLotno || null,
    building_name: raw.buldNm || null,
    address_display: raw.printSt || null,

    // 면적 / 지목 / 용도
    area_display: raw.areaList || null,
    area_m2: toNumeric(raw.maxArea) ?? toNumeric(raw.minArea),
    land_category: raw.jimokList || null,
    usage_name: raw.dspslUsgNm || null,
    usage_large_code: raw.lclsUtilCd || null,
    usage_medium_code: raw.mclsUtilCd || null,
    usage_small_code: raw.sclsUtilCd || null,

    // 경매 정보
    appraisal_amount: toBigint(raw.gamevalAmt),
    min_bid_amount: toBigint(raw.minmaePrice),
    next_min_bid_amount: toBigint(raw.notifyMinmaePrice1),
    next_min_bid_rate: toInt(raw.notifyMinmaePriceRate1),
    failed_count: toInt(raw.yuchalCnt) ?? 0,
    bid_date: toIsoDate(raw.maeGiil),
    bid_time: raw.maeHh1 || null,
    result_decision_date: toIsoDate(raw.maegyuljGiil),
    bid_place: raw.maePlace || null,
    status_code: raw.mulStatcd || null,
    progress_status_code: raw.jinstatCd || null,
    is_progressing: raw.mulJinYn === "Y",
    bigo: raw.mulBigo || null,

    // 담당
    dept_code: raw.jpDeptCd || null,
    dept_name: raw.jpDeptNm || null,
    dept_tel: raw.tel || null,

    // 좌표
    wgs84_lon: toNumeric(raw.wgs84Xcordi),
    wgs84_lat: toNumeric(raw.wgs84Ycordi),

    // 사진 — 크롤러 단계에서는 null (온디맨드 수집)
    photos: null,
    photos_fetched_at: null,
    photos_count: 0,

    // 원본 보존
    raw_snapshot: raw,

    // 운영 메타 (last_seen_at은 upsert 시 서버에서 now()로 갱신)
    last_seen_at: new Date().toISOString(),
    is_active: true,
  };
}
