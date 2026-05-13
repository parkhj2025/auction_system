# work-007 정정 회신 결과 — fetchSingleCase → fetchCaseDetail 함수 교체

> **결론**: 정정 3건 자율 실행 완료 + 자가 검증 8건 PASS. work-005 흐름 + work-001~006 정정 영역 영구 보존 정합. dev IP 검증 3 사건 (532249 + 559336 + 540431) 전반 fetchCaseDetail 정상 회수 + 매핑 정합.
> **commit 대기**: 형준님 회신 검수 + Vercel deploy 의뢰 대기 시점.

---

## 정정 3건 git diff

### 정정 1 — src/lib/courtAuction/detail.ts 신규 module 신설 (525 lines)

**구조 (Code 자율 설계)**:

```typescript
// type definitions
interface CsBaseInfo { /* 사건 기본 정보 */ }
interface DspslGdsDxdyInfo { /* 대표 매각 정보 */ }
interface GdsDspslDxdyItem { /* 매각 회차 history 단일 항목 */ }
interface GdsDspslObjctItem { /* 매각 대상 단일 항목 */ }
export interface DmaResult { /* dma_result 12 keys */ }

// helpers (변환 4건)
function toBigint(v: unknown): number | null
function toInt(v: unknown): number | null
function toIsoDate(v: unknown): string | null
function parseAreaM2(v: unknown): number | null // 변환 2 — "철근콘크리트구조 17.51㎡" → 17.51
function buildDocid(cortOfcCd, csNo, dspslGdsSeq, dspslObjctSeq): string // 변환 1 — 23자 ASCII
function buildGroupId(cortOfcCd, csNo, dspslGdsSeq): string // 22자 ASCII
function extractUsageName(bldDtlDts?, bldNm?): string | null // 변환 4 — 키워드 매칭
function deriveNextBid(list, currentBidDate, appraisalAmount): {...} // 변환 3 — 다음 회차 추출

// public exports
export async function callDetail(session, params): Promise<DetailResponse>
export function mapDetailToRow(result, mokmulIndex, courtNameFallback?): Record<string, unknown>
export async function fetchCaseDetail(params): Promise<Array<Record<string, unknown>>>
```

**fetchCaseDetail 호출부 signature 정합**:
- `fetchCaseDetail({ courtCode, caseNumber, courtNameFallback })` → `Array<Record<string, unknown>>`
- fetchSingleCase + mapRecordToRow 통합 흐름 흡수 paradigm → 호출부 안 mapRecordToRow 호출 폐기 + 직접 row[] 회신
- 멀티 물건 사건 paradigm = dspslGdsSeq 1~20 loop + dma_result {} empty 또는 gdsDspslObjctLst [] empty 시점 종료
- mokmul 단위 row 분리 paradigm (gdsDspslObjctLst.length 만큼 mokmulIndex 반복)

**좌표 처리 결과 (Code 자율 결정)**:
- `wgs84_lon: null` + `wgs84_lat: null` 보존
- 사유: detail 응답 stXcrd/stYcrd 좌표계 미확정 (UTM-K 추정) + search 응답 wgs84 검증 결과 정수 truncate (lon 126 / lat 37) 신뢰도 0 사실
- 안전한 선택 paradigm — 분석 페이지 안 지도 표시 영향 검수는 후속 work 영역

**photos field 처리**:
- photos / photos_count / photos_fetched_at column 영구 제외 paradigm 보존
- 사유: mapper.ts photos NULL hardcoded 폐기 (work-002 정정 6) + cycle 1-G-γ-α-η 정정 6 영구 보존 정합
- upsert(onConflict='docid', ignoreDuplicates=false) paradigm 안 column 부재 시점 기존 photos NULL overwrite 회피 = seed-photos.mjs 결과 보존

### 정정 2 — src/app/api/auction/lookup/route.ts 함수 교체 (12 lines diff)

**import 변경 1건**:
```diff
-import { fetchSingleCase } from "@/lib/courtAuction/search";
-import { mapRecordToRow } from "@/lib/courtAuction/mapper";
+import { fetchCaseDetail } from "@/lib/courtAuction/detail";
```

**호출 변경 1건**:
```diff
 if (!cacheHit) {
 try {
- const records = await fetchSingleCase({ courtCode, caseNumber });
- if (records.length > 0) {
- const rows = records.map((r) => mapRecordToRow(r, "인천지방법원"));
+ const rows = await fetchCaseDetail({
+ courtCode,
+ caseNumber,
+ courtNameFallback: "인천지방법원",
+ });
+ if (rows.length > 0) {
 const { error: upsertError } = await admin
 .from("court_listings")
 .upsert(rows, { onConflict: "docid", ignoreDuplicates: false });
```

**주석 보강 1건**: 헤더 paradigm 주석 안 work-007 정정 사실 명시.

**보존 단계 (work-005 흐름 영구 보존)**:
- cache lookup 단계 + TTL 24h 전반 + is_active=true filter 전반 정합 영구 보존
- cache hit 즉시 회신 paradigm 보존
- fetchError 처리 + fetch_failed 분기 보존 (work-005 정정 1 영구 보존)
- closedFresh 분기 (within 24h closed) 보존 + work-001 정정 6 safety check (court_name '(seed-photos)' 차단) 보존
- not_found 단독 회신 paradigm 영구 보존 (work-005 정정 1 closedStale 분기 폐기)
- groupByItem + listings[0].auction_round + is_case_active RPC → already_taken / active 분기 보존 (work-005 정정 2 영구 보존)

### 정정 3 — src/app/api/orders/check/route.ts 함수 교체 (15 lines diff)

**import 변경 1건**: 정정 2 동등 paradigm.

**호출 변경 1건**: 정정 2 동등 paradigm (`courtNameFallback: courtName` 형준님 의도 정합).

**주석 정합 + 보강 1건**: 헤더 paradigm 주석 안 "광역" 어휘 (룰 정수 위반) 정정 + work-007 사실 명시.

**보존 단계 (work-005 흐름 영구 보존)**:
- 로그인 의무 (401 분기) 보존
- round 명시 시점 is_case_active RPC 호출 paradigm 보존 (work-005 정정 4 영구 보존 / Step1 paradigm 정합)
- cache + closedFresh + not_found 분기 paradigm 보존
- isActive=true 시점 회신 paradigm 보존 ("이미 다른 고객의 접수가 진행 중입니다. 같은 회차는 중복 접수할 수 없습니다.")

---

## 자가 검증 8건 결과

### 1. detail.ts 신규 module 생성 + 함수 signature 정합

✓ PASS — `src/lib/courtAuction/detail.ts` 신규 525 lines 생성.

**function signature 정확값**:

```typescript
export async function callDetail(
 session: Session,
 params: { caseNumber: string; courtCode: string; itemSequence: number },
): Promise<DetailResponse>;

export function mapDetailToRow(
 result: DmaResult,
 mokmulIndex: number,
 courtNameFallback?: string,
): Record<string, unknown>;

export async function fetchCaseDetail(params: {
 courtCode: string;
 caseNumber: string;
 courtNameFallback?: string;
}): Promise<Array<Record<string, unknown>>>;
```

**type export 1건**: `DmaResult` (dma_result 12 keys 전반 schema / 호출부 안 사용처 영역 0 / 향후 photos.ts 통합 검토 시점 활용 paradigm).

### 2. fetchCaseDetail 함수 호출 결과 검수 (532249 + 559336 + 540431)

✓ PASS — `scripts/diagnostics/probe-fetchCaseDetail.ts` 전반 dev IP 직접 호출 + 3 사건 전반 records.length=1 정합.

**매핑 후 row 정합 (532249 )**:

| field | 값 |
|---|---|
| docid | `B0002402024013053224911` (23자 ASCII / search docid 형식 정합) |
| court_code | `B000240` |
| court_name | `인천지방법원` |
| case_number | `2024타경532249` |
| internal_case_no | `20240130532249` |
| item_sequence | 1 |
| mokmul_sequence | 1 |
| group_id | `B000240202401305322491` (22자 ASCII) |
| sido / sigungu / dong | 인천광역시 / 미추홀구 / 주안동 |
| building_name | `주안네오빌주상복합` |
| address_display | `인천광역시 미추홀구 주안서로 40, 11층아파트1103호 (주안동,주안네오빌주상복합)` |
| area_display | `철근콘크리트구조 17.51㎡` |
| **area_m2** | **17.51** (정규식 파싱 정합) |
| usage_name | `아파트` (bldDtlDts "11층아파트1103호" 매칭) |
| **appraisal_amount** | **70,000,000** |
| **min_bid_amount** | **24,010,000** |
| **failed_count** | **4** |
| **bid_date** | **`2026-06-29`** (윈도우 밖 / 47일 후) ✓ |
| bid_time | `1000` |
| status_code | `07` |
| dept_name | `경매8계` |
| dept_tel | `032-860-1608` |
| is_progressing | true |
| wgs84_lon / wgs84_lat | null / null (좌표 NULL 보존) |
| case_title | `부동산강제경매` |

**559336 + 540431 전반 동일 매핑 정합 검증 사실**:
- 559336: 부평구 / 대준블루온 / 매각기일 2026-05-15 / 감정가 1.02억 / 최저가 1,200만 / failed_count 6
- 540431: 연수구 송도동 / 송도더샵마스터뷰22블럭 / 매각기일 2026-05-27 / 감정가 4.34억 / 최저가 3.038억 / failed_count 1

### 3. lookup route 함수 교체 + work-005 흐름 보존

✓ PASS — `git diff src/app/api/auction/lookup/route.ts` 검수:
- import 2건 → 1건 교체 (search + mapper → detail)
- 호출 1건 교체 (fetchSingleCase + map → fetchCaseDetail)
- 주석 보강 1건 (work-007 사실 명시)
- **다른 흐름 변경 0 사실** (cache + rate limit + closedFresh + not_found + is_case_active + already_taken + groupByItem 전반 변경 0)

### 4. orders/check route 함수 교체 + Step1 paradigm 보존

✓ PASS — `git diff src/app/api/orders/check/route.ts` 검수:
- 정정 2 동등 paradigm
- round 명시 시점 is_case_active RPC 호출 paradigm 영구 보존 (work-005 정정 4)
- `courtNameFallback: courtName` 의도 정합
- **다른 흐름 변경 0 사실**

### 5. mapper 매핑 정합 검수

✓ PASS — detail 응답 12 keys → court_listings 39 column 매핑 정합.

| 변환 영역 | paradigm | 결과 |
|---|---|---|
| 변환 1: docid 생성 | `${cortOfcCd}${csNo}${dspslGdsSeq}${dspslObjctSeq}` concat | 23자 ASCII (search docid 형식 정합) |
| 변환 2: area_m2 정규식 | `/(\d+(?:\.\d+)?)\s*㎡/` | 17.51 / 22.4 / 84.92 정합 |
| 변환 3: next_min_bid_amount + rate | gdsDspslDxdyLst auctnDxdyKndCd "01" filter + 현재 dspslDxdyYmd 일치 항목 + 직후 항목 추출 | null (3 사건 전반 현재 회차 = 마지막 매각기일 / 정합 사실) |
| 변환 4: usage_name 키워드 매칭 | bldDtlDts → bldNm 전반 USAGE_KEYWORDS 매칭 (rletDvsDts 전반 제외) | 532249 = "아파트" / 559336 + 540431 = null (안전한 false data 회피) |

### 6. 좌표계 처리 결과 (Code 자율)

✓ PASS — **NULL 보존 paradigm 채택**.

**근거**:
- detail 응답 `stXcrd: 283258 / stYcrd: 540838` = UTM-K 또는 EPSG:5179 추정 (변환 layer 부재)
- search 응답 `wgs84Xcordi: 126 / wgs84Ycordi: 37` = 정수 truncate 사실 (소수점 영역 0 / 신뢰도 0)
- 양 source 전반 정확한 좌표 회수 NG → NULL 보존이 안전한 paradigm
- 분석 페이지 안 지도 표시 영향 검수는 후속 work 영역 (CLAUDE.md 신규 라이브러리 추가 금지 정합 + proj4 등 변환 라이브러리 도입 영역 외)

### 7. TypeScript build + ESLint

✓ PASS — `pnpm exec tsc --noEmit` exit 0 + `pnpm lint` 본 work 4 파일 exit 0 + warning 0.

**사전 결함 영역 (본 work 외 / 영구 보존)**:
- `src/components/home/ReviewsMarquee.tsx:66` — react-hooks/set-state-in-effect warning (본 work 변경 영역 외 / 영구 보존)

### 8. work-001 ~ work-006 정정 영구 보존

✓ PASS — `git status --short` 검수:

**modified 파일 (본 work 정정 영역 단독)**:
- src/app/api/auction/lookup/route.ts (정정 2)
- src/app/api/orders/check/route.ts (정정 3)

**neonew 파일 (본 work 신규 산출)**:
- src/lib/courtAuction/detail.ts (정정 1)
- scripts/diagnostics/probe-detail-endpoint.mjs (사전 조사 산출)
- scripts/diagnostics/probe-detail-fields.mjs (사전 조사 산출)
- scripts/diagnostics/probe-search-record.mjs (사전 조사 산출)
- scripts/diagnostics/probe-fetchCaseDetail.ts (본 work 검증 산출)
- docs/work-007-detail-endpoint-research.md (사전 조사 회신)
- docs/work-007-result.md (본 결과 markdown)

**영구 보존 검증 (변경 0 정합 사실)**:
- src/lib/courtAuction/search.ts ✓ (변경 0)
- src/lib/courtAuction/mapper.ts ✓ (변경 0 / work-002 정정 6 영구 보존)
- src/lib/courtAuction/photos.ts ✓ (변경 0 / 별개 work 분리 paradigm)
- src/lib/courtAuction/codes.ts ✓ (변경 0)
- src/lib/courtAuction/session.ts ✓ (변경 0)
- scripts/seed-photos.mjs ✓ (변경 0 / work-001 정합)
- src/types/apply.ts ✓ (변경 0 / Photo type 영구 보존)
- src/components/home/HomeHero.tsx + LookupStatus + Hero 디자인 전반 ✓ (변경 0)
- src/components/apply/Step1Property + Step5Payment 전반 ✓ (변경 0)
- src/components/home/Pricing + Compare + Reviews + Insight + HomeCTA ✓ (변경 0)
- 분석 페이지 전반 ✓ (변경 0)
- /apply page 전반 ✓ (변경 0)
- supabase/migrations + court-photos Storage ✓ (변경 0)
- LoginButton ✓ (변경 0 / work-008 사후 단독)

---

## 영역 전반 사실

### work-005 흐름 영구 보존 검증 (런타임 fetch 결함 검수 의무 영역)

본 work 전반 함수 교체 paradigm 단독이므로 work-005 흐름 단계 (cache → fetch → records 분기 → is_case_active → already_taken / closed / active / not_found) 전반 코드 변경 0. 형준님 production 검수 의뢰 단계 (532249 전반 active 분기 + 사건 detail 표시 + 9 status 분기 전반 정상 동작) 전반 정합 사실 검증 의무.

### 사전 결함 1건 정정 사실 (본 work 안 자율 결정)

**결함**: usage_name 추출 결과 559336 + 540431 전반 "전" 오매칭 (rletDvsDts "전유" 안 "전" substring 충돌).

**정정**: USAGE_KEYWORDS 전반 "전" / "답" 단일 글자 keyword 영구 폐기 + rletDvsDts source 영구 제외 → 안전한 false data 회피 paradigm. 532249 = "아파트" 정합 보존.

**영향**: lookup route + orders/check route 안 groupByItem `usage_name && !r.usage_name.includes("대지") && !r.usage_name.includes("토지")` 조건 = null short-circuit fallback → group[0] 대표 선정 paradigm 정합 (영향 0).

### memory 룰 준수 사실

- ["" 단어 엄격 금지 / 회신문/commit/comment 사용 0 의무] 정수 의식 적용:
 - detail.ts 안 전반 사용 0건 ✓
 - orders/check route 주석 전반 정리 사실 (cycle 1-D-A-3-2 전반 사용 → "광역" 어휘 정리 + 의미 보존)
 - 본 결과 markdown 안 전반 사용 최소화 paradigm

---

## 다음 단계

1. **형준님 commit + push 의뢰** (Code 자율 commit 진입 영역 0 / 형준님 의사결정 단계):
 ```
 work-007: fetchSingleCase → fetchCaseDetail 함수 교체 (대법원 매각일 2주 윈도우 우회)
 ```
2. **Vercel deploy + production 검수 4건** (형준님 직접 검수 의무):
 - 532249 (매각일 47일 후) Hero 입력 → active 분기 + 사건 detail 표시 (감정가 7천만 / 최저가 24,010,000 / 매각일 2026.06.29)
 - 559336 + 540431 (매각일 윈도우 안) 회복 검수 + work-005 already-taken 분기 검수 가능
 - 전반 매각일 윈도우 밖 사건 추가 회수 검증
 - work-005 흐름 영구 보존 검수 (9 status 분기 정상 동작)
3. **work-007 종료 사후 work-008 진입** (카카오톡 인앱 브라우저 안 Google OAuth 차단 해결).

**산출 artifact **:
- `src/lib/courtAuction/detail.ts` (525 lines / Code 자율 설계)
- `src/app/api/auction/lookup/route.ts` (12 lines diff)
- `src/app/api/orders/check/route.ts` (15 lines diff)
- `scripts/diagnostics/probe-fetchCaseDetail.ts` (검증 script / 재현 가능)
- `docs/work-007-detail-endpoint-research.md` (사전 조사 회신)
- `docs/work-007-result.md` (본 결과 markdown)
