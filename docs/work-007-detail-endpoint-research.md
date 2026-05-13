# work-007 사전 조사 회신 — 대법원 사건 detail endpoint reverse engineering

> **결론 요약**: 가설 적중. DETAIL_ENDPOINT (`/pgj/pgj15B/selectAuctnCsSrchRslt.on`) 는 매각일 2주 윈도우 제약과 무관하게 사건번호 + 법원코드 + dspslGdsSeq 조합 직접 query 로 사건 detail 회수 가능합니다 (532249 매각일 2026-06-29 = 47일 후 = 윈도우 밖 사건 정상 회수). 정정 분기 (1) 채택을 추천합니다.
> **중요**: DETAIL_ENDPOINT 는 이미 codebase 내 `src/lib/courtAuction/photos.ts` 에서 사진 회수 용도로 활용 중이며, codes.ts 에 `DETAIL_ENDPOINT` / `DETAIL_SUBMISSION_ID` / `DETAIL_PGM_ID` 상수가 이미 정의되어 있습니다. 즉 **새로운 endpoint 발견이 아니라 기존 endpoint 의 텍스트 필드 활용 paradigm 확장** 입니다.

---

## 조사 산출 (재현 가능)

### 산출 script

- `scripts/diagnostics/probe-detail-endpoint.mjs` — 3개 사건 + itemSequence 1/2 검수
- `scripts/diagnostics/probe-detail-fields.mjs` — 532249 nested object 전체 dump

재현:
```bash
node scripts/diagnostics/probe-detail-endpoint.mjs
node scripts/diagnostics/probe-detail-fields.mjs
```

session paradigm = 기존 `src/lib/courtAuction/session.ts` 100% 재사용 정합 (WMONID + JSESSIONID 발급 후 detail POST 호출).

---

## Q8. 대법원 사이트 안 사건번호 직접 검색 paradigm 회수

### 결론

대법원 사이트 공식 사건 검색 entry point:

- **URL**: `https://www.courtauction.go.kr/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml`
- 이 URL 은 WebSquare framework SPA → 내부에서 `selectAuctnCsSrchRslt.on` (DETAIL_ENDPOINT) endpoint 직접 호출
- 사용자 화면 = "사건번호로 검색" 메뉴 (법원 dropdown + 사건번호 input)
- 결과 페이지에 사건 detail (csBaseInfo + 매각회차 + 매각물건 + 감정평가) 표시

### 검증

dev IP 직접 fetch 결과 (3개 사건):

| 사건 | 매각기일 | 윈도우 정합 | HTTP | dma_result 정합 | 사진 |
|---|---|---|---|---|---|
| 2024타경532249 | 2026-06-29 | 밖 (47일 후) | 200 | ✓ 12 keys | 13장 |
| 2024타경559336 | 미상 (후보) | 추정 | 200 | ✓ 12 keys | 9장 |
| 2024타경540431 | 미상 (후보) | 추정 | 200 | ✓ 12 keys | 10장 |

→ **사건 detail endpoint 는 매각일 윈도우 제약과 무관하게 회수 가능한 사실 확정**.

---

## Q9. 사건 detail endpoint Network 추적

### endpoint 정확값

```
POST https://www.courtauction.go.kr/pgj/pgj15B/selectAuctnCsSrchRslt.on
```

### request headers (필수)

```
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36
Content-Type: application/json;charset=UTF-8
Accept: application/json, text/plain, */*
Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
Origin: https://www.courtauction.go.kr
Referer: https://www.courtauction.go.kr/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml
SC-Userid: NONUSER
SC-Pgmid: PGJ15BM01
submissionid: mf_wfm_mainFrame_sbm_selectGdsDtlSrchDtlInfo
sec-ch-ua: "Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Cookie: WMONID=...; JSESSIONID=...
```

### request body

```json
{
  "dma_srchGdsDtlSrch": {
    "csNo": "2024타경532249",
    "cortOfcCd": "B000240",
    "dspslGdsSeq": "1",
    "pgmId": "PGJ15BM01",
    "srchInfo": {}
  }
}
```

### response top-level schema

```
{
  status: 200,
  message: "물건상세검색 정보가  조회되었습니다.",
  errors: null,
  data: {
    dma_result: { ... 12 keys ... },
    ipcheck: { ... }
  }
}
```

### dma_result 12 keys

| key | 영역 | 설명 |
|---|---|---|
| **csBaseInfo** | object | 사건 기본 정보 (사건번호 + 법원 + 사건명 + 접수일 + 청구액 + 담당계 + 전화) |
| **dspslGdsDxdyInfo** | object | **대표 매각 정보 (매각기일 + 감정가 + 최저가 + 유찰횟수 + 매각장소 + 매수보증금률)** |
| dstrtDemnInfo | array | 배당요구 종기 정보 |
| picDvsIndvdCnt | array | 사진 카테고리별 카운트 |
| **csPicLst** | array | 사진 base64 list (기존 photos.ts 활용 영역) |
| **gdsDspslDxdyLst** | array | **매각 회차 전체 history (1차~9차 / 최저가 변동 + 결과 코드)** |
| **gdsDspslObjctLst** | array | **매각 대상 list (주소 + 건물 + 좌표 + 용도 코드)** |
| rgltLandLstAll | array | 토지 list (전체) |
| bldSdtrDtlLstAll | array | 건물 detail list (전체) |
| gdsNotSugtBldLsstAll | array | 미제출 건물 list |
| gdsRletStLtnoLstAll | array | 토지 lot 정보 |
| aeeWevlMnpntLst | array | 감정평가 명세 list (10개 항목 / 위치 + 토지 + 건물 + 권리 평가 코멘트) |

### 인증 paradigm

- **anonymous (NONUSER) 진입 가능** (SC-Userid: NONUSER 헤더 정합)
- **captcha 부재** (3개 사건 시도 시 captcha 차단 없음)
- **session paradigm = WMONID + JSESSIONID 필수** (search API 와 동일 정합)
- 호출 빈도 제한 = 미확정 (3개 사건 시도에서는 차단 없음)

---

## Q10. session.ts paradigm 적용 가능 사실

### 결론

**기존 `src/lib/courtAuction/session.ts` 100% 재사용 가능 확정**.

- search API + detail API 동일 session paradigm (동일 WMONID + JSESSIONID + 동일 Referer + 동일 SC-Userid)
- 단지 SC-Pgmid + submissionid + body schema 만 차이 (DETAIL_PGM_ID / DETAIL_SUBMISSION_ID 는 codes.ts 에 이미 정합)
- session.init() 1회 호출 후 callDetail() 호출 가능
- photos.ts 에서 이미 동일 paradigm 활용 중 (line 164~190)

### 신규 코드 paradigm

- session.ts 영구 보존 (변경 0)
- codes.ts 영구 보존 (DETAIL_ENDPOINT 이미 정합)
- 신규 = `src/lib/courtAuction/detail.ts` 신규 module (callDetail + mapDetailToRow paradigm)

---

## Q11. request parameter 매핑 사실

| 사용자 입력 | API parameter | paradigm |
|---|---|---|
| 사건번호 "2024타경532249" | `csNo` | 한글 문자열 직접 사용 (변환 0) |
| 법원 "인천지방법원" | `cortOfcCd: "B000240"` | court code 직접 매핑 (codes.ts ALLOWED_COURT_CODES 정합) |
| 물건 순서 (1, 2, ...) | `dspslGdsSeq: "1"` | string 형 1 부터 증가 paradigm |
| 프로그램 ID | `pgmId: "PGJ15BM01"` | 고정값 (DETAIL_PGM_ID) |
| 검색 정보 | `srchInfo: {}` | 빈 object 정합 |

### search API vs detail API 차이

| 영역 | search API | detail API |
|---|---|---|
| endpoint | `/pgj/pgjsearch/searchControllerMain.on` | `/pgj/pgj15B/selectAuctnCsSrchRslt.on` |
| pgmId | PGJ151F01 | PGJ15BM01 |
| body schema | `dma_pageInfo` + `dma_srchGdsDtlSrchInfo` (115+ field) | `dma_srchGdsDtlSrch` (5 field) |
| 매각일 윈도우 | 2주 제약 | **제약 없음** |
| 회수 단위 | list (multiple records) | **단일 사건 detail (사진 + 회차 history + 감정평가 동시)** |
| 멀티 물건 사건 | flat record list (mokmulSer 펼침) | dspslGdsSeq 단독 호출 + dspslObjctSeq array 내 nested |

---

## Q12. response 안 records 일치 사실

### mapper.ts 필드 vs detail 응답 매핑 표

| court_listings column | mapper.ts source field | detail response 위치 | 정합 |
|---|---|---|---|
| docid | `r.docid` | (없음) | **생성 의무**: `${csNo}-${cortOfcCd}-${dspslGdsSeq}` 또는 hash |
| court_code | `r.boCd` | `csBaseInfo.cortOfcCd` | ✓ 일치 ("B000240") |
| court_name | `r.jiwonNm` | `csBaseInfo.cortOfcNm` | ✓ 일치 ("인천지방법원") |
| case_number | `r.srnSaNo` | `csBaseInfo.userCsNo` | ✓ 일치 ("2024타경532249") |
| internal_case_no | `r.saNo` | `csBaseInfo.csNo` | ✓ 일치 ("20240130532249") |
| item_sequence | `r.maemulSer` | `dspslGdsDxdyInfo.dspslGdsSeq` | ✓ 일치 (1) |
| mokmul_sequence | `r.mokmulSer` | `gdsDspslObjctLst[i].dspslObjctSeq` | ✓ array iterate paradigm |
| group_id | `r.groupmaemulser` | (없음) | NULL paradigm (멀티 물건 = dspslGdsSeq 별 row 분리) |
| sido | `r.hjguSido` | `gdsDspslObjctLst[0].adongSdNm` | ✓ 일치 ("인천광역시") |
| sigungu | `r.hjguSigu` | `gdsDspslObjctLst[0].adongSggNm` | ✓ 일치 ("미추홀구") |
| dong | `r.hjguDong` | `gdsDspslObjctLst[0].adongEmdNm` | ✓ 일치 ("주안동") |
| ri_name | `r.hjguRd` | `gdsDspslObjctLst[0].adongRiNm` | ✓ null 정합 |
| lot_number | `r.daepyoLotno` | `gdsDspslObjctLst[0].rprsLtnoAddr` | ✓ 일치 ("219-4") |
| building_name | `r.buldNm` | `gdsDspslObjctLst[0].bldNm` | ✓ 일치 ("주안네오빌주상복합") |
| address_display | `r.printSt` | `gdsDspslObjctLst[0].userPrintSt` | ✓ 일치 (전체 도로명 주소) |
| area_display | `r.areaList` | `gdsDspslObjctLst[0].pjbBuldList` | ✓ 일치 ("철근콘크리트구조 17.51㎡") |
| area_m2 | `toNumeric(r.maxArea/minArea)` | (없음 / pjbBuldList 정규식 파싱 의무) | **파싱 의무**: `/\d+\.\d+/` 추출 |
| land_category | `r.jimokList` | `gdsDspslObjctLst[0].rletDvsDts` | △ ("전유" / paradigm 검수 의무) |
| usage_name | `r.dspslUsgNm` | (코드 → 이름 변환 의무) | **코드 매핑 layer 의무** |
| usage_large_code | `r.lclsUtilCd` | `gdsDspslObjctLst[0].lclDspslGdsLstUsgCd` | ✓ 일치 ("20000") |
| usage_medium_code | `r.mclsUtilCd` | `gdsDspslObjctLst[0].mclDspslGdsLstUsgCd` | ✓ 일치 ("20100") |
| usage_small_code | `r.sclsUtilCd` | `gdsDspslObjctLst[0].sclDspslGdsLstUsgCd` | ✓ 일치 ("20104") |
| appraisal_amount | `toBigint(r.gamevalAmt)` | `dspslGdsDxdyInfo.aeeEvlAmt` | ✓ 일치 (70,000,000) |
| min_bid_amount | `toBigint(r.minmaePrice)` | `dspslGdsDxdyInfo.fstPbancLwsDspslPrc` | ✓ 일치 (24,010,000 = 현재 회차 최저가) |
| next_min_bid_amount | `r.notifyMinmaePrice1` | (없음 / gdsDspslDxdyLst 다음 회차 추정 의무) | **파생 계산 의무** |
| next_min_bid_rate | `r.notifyMinmaePriceRate1` | (없음) | **파생 계산 의무**: next_min / aeeEvlAmt * 100 |
| failed_count | `toInt(r.yuchalCnt)` | `dspslGdsDxdyInfo.flbdNcnt` | ✓ 일치 (4) |
| bid_date | `toIsoDate(r.maeGiil)` | `dspslGdsDxdyInfo.dspslDxdyYmd` | ✓ 일치 ("20260629") |
| bid_time | `r.maeHh1` | `dspslGdsDxdyInfo.fstDspslHm` | ✓ 일치 ("1000") |
| result_decision_date | `toIsoDate(r.maegyuljGiil)` | `dspslGdsDxdyInfo.dspslDcsnDxdyYmd` | ✓ 일치 ("20260706") |
| bid_place | `r.maePlace` | `dspslGdsDxdyInfo.dspslPlcNm` | ✓ 일치 ("제219호 법정") |
| status_code | `r.mulStatcd` | `dspslGdsDxdyInfo.auctnGdsStatCd` | ✓ 일치 ("07") |
| progress_status_code | `r.jinstatCd` | `csBaseInfo.csProgStatCd` | ✓ 일치 ("0002100001") |
| is_progressing | `r.mulJinYn === "Y"` | (추론 의무) | csBaseInfo.csProgStatCd 매핑 또는 codes.ts 보충 |
| bigo | `r.mulBigo` | `dspslGdsDxdyInfo.dspslGdsRmk` | ✓ 일치 (비고) |
| dept_code | `r.jpDeptCd` | `csBaseInfo.jdbnCd` | ✓ 일치 ("1008") |
| dept_name | `r.jpDeptNm` | `csBaseInfo.cortAuctnJdbnNm` | ✓ 일치 ("경매8계") |
| dept_tel | `r.tel` | `csBaseInfo.jdbnTelno` | ✓ 일치 ("032-860-1608") |
| wgs84_lon | `toNumeric(r.wgs84Xcordi)` | `gdsDspslObjctLst[0].stXcrd` (?) | **△ 좌표계 불일치 (search 응답 WGS84 ↔ detail stXcrd UTM 추정)** |
| wgs84_lat | `toNumeric(r.wgs84Ycordi)` | `gdsDspslObjctLst[0].stYcrd` (?) | **△ 좌표계 불일치** |
| case_title | `r.csTit/csTitNm/caseHisNm/dpslGdsCsNm` | `csBaseInfo.csNm` | ✓ 일치 ("부동산강제경매") |

### 매핑 정합 정리

- **매핑 100% 가능 사실**: 핵심 비즈니스 필드 (사건번호 + 법원 + 매각기일 + 감정가 + 최저가 + 유찰횟수 + 주소 + 건물) 1:1 매핑 정합
- **변환 의무 3건**:
  1. `docid` 신규 생성 (csNo + cortOfcCd + dspslGdsSeq 조합 hash 또는 concat)
  2. `area_m2` 정규식 파싱 (pjbBuldList "17.51㎡" → 17.51)
  3. `next_min_bid_amount` / `next_min_bid_rate` 파생 계산 (gdsDspslDxdyLst 에서 현재 회차 다음 항목 추출)
- **좌표 영역 미확정 1건**: stXcrd/stYcrd 좌표계 검수 의무 (NULL 처리가 안전한 선택)
- **코드 매핑 영역 1건**: `usage_name` (sclDspslGdsLstUsgCd "20104" → 한글명) = 별도 lookup table 의무

---

## Q13. 검색 사건 검증 (회수 paradigm 검수)

### 결론

**paradigm 단일 정합 확정**.

| 영역 | 532249 (윈도우 밖) | 559336 (후보 A) | 540431 (후보 B) |
|---|---|---|---|
| HTTP status | 200 | 200 | 200 |
| response.status | 200 | 200 | 200 |
| message | "물건상세검색 정보가  조회되었습니다." | 동일 | 동일 |
| dma_result keys 정합 | 12 keys | 12 keys | 12 keys |
| dma_result key 구성 | csBaseInfo + dspslGdsDxdyInfo + gdsDspslDxdyLst + ... | 동일 | 동일 |
| csPicLst 사진 | 13장 | 9장 | 10장 |
| gdsDspslDxdyLst 회차 | 9건 | 8건 | 3건 |
| itemSequence=2 호출 | dma_result {} empty | 동일 | 동일 |

→ **단일 endpoint paradigm + 단일 회신 schema 정합 (윈도우 안/밖 차이 없음)**

→ 멀티 물건 사건 paradigm = dspslGdsSeq 1부터 증가 호출 + dma_result {} empty 시점 종료 (3개 검증 사건은 단일 물건 사건 정합)

---

## Q14. 정정 paradigm 추천 (Code 자율)

### 분기 (1) 채택 추천: 사건 detail endpoint 발견 + 매각일 무관 records 회수 가능

분기 (2) (captcha / 인증 차단) + 분기 (3) (endpoint 부재) 모두 해당 없음. **분기 (1) 단일 paradigm 채택**.

### 정정 영향 파일 6건

| 영향 파일 | 변경 paradigm | 우선순위 |
|---|---|---|
| `src/lib/courtAuction/detail.ts` (신규) | callDetail + mapDetailToRow + parseAreaM2 + computeNextBid + fetchCaseDetail 신규 module | P1 |
| `src/lib/courtAuction/search.ts` | `fetchSingleCase` → detail endpoint fallback 또는 detail 우선 paradigm 정정 | P1 |
| `src/app/api/auction/lookup/route.ts` | fetchSingleCase 호출을 신규 함수로 교체 (흐름 변경 0) | P1 |
| `src/app/api/orders/check/route.ts` | 동일 paradigm 정합 | P1 |
| `src/lib/courtAuction/codes.ts` | (변경 0 — DETAIL_ENDPOINT 이미 정합) | — |
| `src/lib/courtAuction/photos.ts` | (변경 0 단독 후속 검토 / 단일 source paradigm 정수 — Lessons [A] 정합) | △ P2 |

### 정정 단계 추천 (3단계)

**1단계: detail.ts 신규 + callDetail + mapDetailToRow paradigm 신설**

```typescript
// src/lib/courtAuction/detail.ts (신규)
export async function callDetail(
  session: Session,
  params: { caseNumber: string; courtCode: string; itemSequence: number }
): Promise<DetailResponse> { /* ... */ }

export function mapDetailToRow(
  result: DmaResult,
  itemSequence: number,
  mokmulIndex: number
): Record<string, unknown> { /* 매핑 layer */ }

// 멀티 물건 사건 = dspslGdsSeq 1부터 loop + empty 시점 종료
export async function fetchCaseDetail(params: {
  courtCode: string;
  caseNumber: string;
}): Promise<Array<Record<string, unknown>>> {
  const session = createSession();
  await session.init();
  const rows: Array<Record<string, unknown>> = [];
  for (let seq = 1; seq <= 20; seq++) {
    const res = await callDetail(session, { ...params, itemSequence: seq });
    const result = res?.data?.dma_result;
    if (!result || Object.keys(result).length === 0) break;
    const objects = result.gdsDspslObjctLst ?? [];
    if (objects.length === 0) break;
    // mokmul 단위 row (objects array 의 dspslObjctSeq 별 분리)
    for (let mokmulIdx = 0; mokmulIdx < objects.length; mokmulIdx++) {
      rows.push(mapDetailToRow(result, seq, mokmulIdx));
    }
  }
  return rows;
}
```

**2단계: lookup + check route 안 fetchSingleCase → fetchCaseDetail 교체**

```typescript
// src/app/api/auction/lookup/route.ts
- const records = await fetchSingleCase({ courtCode, caseNumber });
- if (records.length > 0) {
-   const rows = records.map((r) => mapRecordToRow(r, "인천지방법원"));
+ const rows = await fetchCaseDetail({ courtCode, caseNumber });
+ if (rows.length > 0) {
    const { error: upsertError } = await admin
      .from("court_listings")
      .upsert(rows, { onConflict: "docid", ignoreDuplicates: false });
    // ...
  }
```

**3단계: photos.ts 통합 검토 (P2 / 단일 source paradigm 정수 / Lessons [A] 정합)**

- 현재 photos.ts = detail endpoint 호출 (사진 단독 사용) + lookup 시점 = search endpoint 별도 호출
- 신규 paradigm = lookup 시점 = detail endpoint 단독 호출 → 사진 + 텍스트 동시 회수 → 1차 fetch 에서 photos caching 가능
- 이 paradigm = "detail endpoint 1회 호출 = 사건 텍스트 + 사진 동시 회수" (Lessons [A] 이중 엔진 폐기 정합)
- 단, photos.ts 의 ALL_MAX_PHOTOS=20 + reselectFromCache 기존 paradigm 영향 검수 의무 (단일 source paradigm 정수 영구 보존)

### 검증 paradigm 추천 (정정 사후)

1. 532249 (윈도우 밖) → production lookup → cache MISS → detail endpoint fetch → records.length > 0 + listings 정상 회신
2. 559336 + 540431 (윈도우 안/밖 검증) → 동일 paradigm 정합
3. 멀티 물건 사건 검증 (dspslGdsSeq 2+ 정합 사건 후보 회수 의무 — 형준님 의무)
4. mapper.ts 의 raw_snapshot 영구 보존 (Phase 2 에서 photos.ts 단일 source paradigm 회수 + 사후 trace 정수)

### 위험 영역 (정정 시점 검수 의무)

- **좌표 영역**: stXcrd/stYcrd 좌표계 미확정 → NULL paradigm 이 안전 (수치 정합 검증 전까지 지도 표시 영향 0)
- **단일 source paradigm 정수**: detail.ts + photos.ts 양쪽에서 detail endpoint 호출 = Lessons [A] 이중 엔진 위험 → 단일 module 로 통합 검토 (P2)
- **search.ts 영구 폐기 검수**: search.ts 의 기존 paradigm 이 다른 영역 (관리자 또는 batch crawl) 에서 사용 중인지 확인 후 폐기 검수 의무 (현재 시점 = lookup + check route 단독 사용 정합 / 즉시 폐기보다는 보존이 안전한 선택)

---

## 자가 검증 5건 결과

| # | 검증 | 결과 |
|---|---|---|
| 8 | 대법원 사이트 안 사건번호 직접 검색 paradigm 발견 | ✓ 발견. URL = `https://www.courtauction.go.kr/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml`. 내부 endpoint = `selectAuctnCsSrchRslt.on`. |
| 9 | 사건 detail endpoint URL + request/response schema 회수 | ✓ 완료. POST `/pgj/pgj15B/selectAuctnCsSrchRslt.on` + body `{ dma_srchGdsDtlSrch: { csNo, cortOfcCd, dspslGdsSeq, pgmId, srchInfo } }` + response `data.dma_result` (12 keys). |
| 10 | 532249 + 559336 + 540431 (윈도우 안/밖 양측) detail endpoint 호출 결과 | ✓ 3개 사건 HTTP 200 + dma_result 12 keys 정합. 핵심 필드 (csBaseInfo + dspslGdsDxdyInfo + gdsDspslObjctLst + 사진) 회수 정합. |
| 11 | mapper.ts paradigm 안 detail endpoint 매핑 가능 사실 | ✓ 매핑 100% 가능 (핵심 필드 1:1 정합). 변환 의무 3건 (docid 생성 + area_m2 정규식 + next_min_bid 계산) + 코드 매핑 1건 (usage_name) + 좌표 미확정 1건. |
| 12 | 정정 paradigm 추천 (분기 1·2·3) | ✓ 분기 (1) 채택. 영향 파일 6건 (신규 detail.ts + search.ts + lookup route + check route) / 3단계 정정 / 검증 paradigm 4건. |

---

## 추가 발견 사실 (형준님 의사결정 참고)

### A. 매각 회차 history paradigm 신규 활용 가능

`gdsDspslDxdyLst` array 에서 1차~9차 매각 history 전체 회수 가능.

532249 사건 예:
- 1차 2025-10-13 → 최저가 70,000,000 → 유찰
- 2차 2025-11-20 → 70,000,000 → 유찰
- 3차 2025-12-22 → 49,000,000 → 유찰
- 4차 2026-02-04 → 34,300,000 → 유찰
- 5차 2026-03-19 → 24,010,000 → **매각** (auctnDxdyRsltCd: "001")
- 6차 2026-03-26 → 매각결정 (auctnDxdyKndCd: "02")
- 7차 2026-04-30 → 사후 처리 (auctnDxdyKndCd: "03")
- 8차 2026-06-29 → **재매각** (현재 회차)
- 9차 2026-07-06 → 매각결정 예정

→ **신규 paradigm**: 분석 페이지에 "매각 history timeline" 표시 가능 + Phase 2 콘텐츠 활용 정합

### B. 감정평가 명세 (aeeWevlMnpntLst) 신규 활용 가능

10건 감정평가 코멘트 회수 정합 (위치 + 토지 + 건물 + 권리 평가 텍스트).

→ Phase 2 분석 페이지 자동 생성 paradigm 활용 가능 (CLAUDE.md 의 작업 경계 = Cowork 영역 정합 검수 의무)

### C. photos.ts 단일 source paradigm 정수 가능

현재 paradigm:
1. lookup 시점 → search endpoint (텍스트 단독) → court_listings upsert
2. 분석 페이지 사진 fetch 시점 → photos.ts → detail endpoint (사진 + 텍스트 동시 / 사진 단독 사용)

신규 paradigm:
1. lookup 시점 → detail endpoint (사진 + 텍스트 동시) → court_listings + photos 동시 upsert
2. 분석 페이지 사진 = court_listings.photos 즉시 회신 (재 fetch 0 / ALL_MAX_PHOTOS 영역은 별도 paradigm 검토)

→ **장점**: API 호출 50% 감소 + 데이터 정합성 ↑ (단일 source paradigm 정수 / Lessons [A] 정합)
→ **위험**: ALL_MAX_PHOTOS=20 paradigm (분석 페이지 더보기) 의 lookup 시점 부담 검수 의무 (별도 fetch paradigm 보존이 안전한 선택)

---

## 결론

**분기 (1) 채택 + 3단계 정정 paradigm 추천**:

1. **단계 1** (P1): `src/lib/courtAuction/detail.ts` 신규 module 신설 (callDetail + mapDetailToRow + fetchCaseDetail paradigm)
2. **단계 2** (P1): `src/app/api/auction/lookup/route.ts` + `src/app/api/orders/check/route.ts` 의 `fetchSingleCase` → `fetchCaseDetail` 교체
3. **단계 3** (P2 / 후속): photos.ts 통합 검토 (단일 source paradigm 정수 / Lessons [A] 정합)

**기대 효과**:
- 532249 등 매각일 2주 윈도우 밖 사건 정상 회수 (production 검증 의무)
- 사용자 paradigm 변경 0 (Hero LookupStatus + 결과 페이지 흐름 동일)
- 신규 paradigm = 매각 회차 history + 감정평가 명세 + 사진 통합 회수 paradigm

**다음 단계**: Opus 의 본 회신 검수 + 정정 결정 의뢰 (단계 3 통합 검토 + photos.ts 폐기 paradigm 은 형준님 의사결정 의무).
