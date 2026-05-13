# work-008 사전 조사 회신 — 사진 회수 NG 사실 회수

> **결론 요약**: 분기 **(c) 양측 동시 정정** 사실 확정 — (a) detail.ts mapDetailToRow 안 photos 매핑 부재 사실 + (b) SingleListingCard + ListingPickerCard 안 image render 분기 부재 사실 (work-002 정정 9 폐기 paradigm).
> **재진입 위험**: 사전 work-002 정정 9 폐기 사유 = "fetch duration NG + 사용자 체감 NG". 정정 paradigm fetch duration 의식 의무.
> **추천 paradigm**: **Option 1 (Hero Card client side async fetch / PhotoGallery paradigm 정합)** — lookup endpoint 응답 시점 영향 0 + photos.ts 단일 source paradigm 영구 보존 + Lessons [A] 이중 엔진 회피.

---

## 사실 회수 7건

### Q1. detail.ts mapDetailToRow 안 photos 매핑 단계 사실

**파일**: [src/lib/courtAuction/detail.ts:459-465](src/lib/courtAuction/detail.ts#L459-L465)

```typescript
/**
 * photos + photos_count + photos_fetched_at column 영구 제외 paradigm
 * (work-002 정정 6 + cycle 1-G-γ-α-η 정정 6 영구 보존).
 *
 * 사유: upsert(onConflict='docid', ignoreDuplicates=false) paradigm 안 column 부재 시점
 * 기존 photos NULL overwrite 회피 = seed-photos.mjs 수동 호출 결과 보존 paradigm.
 */
```

**사실**:
- mapDetailToRow return row 안 **photos / photos_count / photos_fetched_at field 자체 부재 paradigm**
- mapper.ts (search.ts paradigm) 동등 paradigm 정합 (work-002 정정 6 영구 보존)
- 의도 = "upsert 시점 기존 photos column NULL overwrite 회피"
- 결과 = 신규 사건 첫 진입 시점 (seed-photos.mjs 수동 시드 부재 시점) **photos column NULL 잔존 사실**

→ **분기 (a) source 사실 확정**.

### Q2. detail endpoint response photos field schema

dev IP 직접 dump 결과 (`scripts/diagnostics/probe-csPicLst-element.mjs` 산출):

```
csPicLst.length: 13

=== csPicLst[0] keys ===
 picFileUrl: "/nas_e_image_pgj/kj/2024/0704/" ← 내부 NAS 경로 / 외부 활용 NG
 picTitlNm: "B000240202401305322498.jpg"
 cortAuctnPicDvsCd: "000241" ← 카테고리 코드 (전경사진)
 cortAuctnPicSeq: "8"
 pageSeq: "1"
 cortOfcCd: "B000240"
 csNo: "20240130532249"
 picFile: <base64 221564 chars> ← base64 JPEG inline (221KB / 장)
```

**카테고리 1건 sample**:
- 000241 (전경사진) / 000244 (매각물건사진) / 000245 (내부사진) / 000247 (기타사진)

**핵심 사실**:
- response 안 사진 = **base64 JPEG inline 단독** (picFileUrl = 내부 NAS 경로 / 외부 URL 영역 0)
- 13장 size = ~2.8MB (221KB × 13)
- **client 직접 활용 NG** → sharp 압축 + Supabase Storage 업로드 paradigm 필수 ([photos.ts:135 fetchAndCachePhotos](src/lib/courtAuction/photos.ts#L135) 정합)
- CORS / 인증 / referrer 영역 = base64 inline paradigm 영역 0 (Storage 업로드 사후 public URL 회신)

### Q3. lookup endpoint LISTING_SELECT photos 회신 사실

**파일**: [src/app/api/auction/lookup/route.ts:55-56](src/app/api/auction/lookup/route.ts#L55-L56)

```typescript
const LISTING_SELECT =
 "docid, court_name, case_number, address_display, appraisal_amount, min_bid_amount, bid_date, bid_time, usage_name, area_display, failed_count, item_sequence, mokmul_sequence, photos_fetched_at, photos, photos_count, sido, sigungu, dong, case_title";
```

**사실**:
- LISTING_SELECT 안 `photos_fetched_at, photos, photos_count` 영구 보존 정합 (work-002 정정 7)
- RawListing interface 안 `photos: Photo[] | null` + `photos_count: number` 정합
- DB photos NULL 시점 = listings[0].photos = null 정상 회신 paradigm

→ lookup endpoint 회신 paradigm 정상. photos 채워지는 paradigm 영역 부재 사실 단단.

### Q4. SingleListingCard + ListingPickerCard image render 단계 사실

**파일**: [src/components/home/HomeHero.tsx:466-524](src/components/home/HomeHero.tsx#L466-L524)

```typescript
function SingleListingCard({ listing }: { listing: CourtListingSummary }) {
 // cycle 1-G-γ-α-θ 정정 1 = η 정정 9 (Card image render) 폐기.
 // Hero 안 사진 표기 = fetch duration NG + 사용자 체감 NG 직접 source = placeholder 단독 단계 영구 보존.
 // DB photos column paradigm (η 정정 6+7+8) = 사후 별개 page (분석 + 카드 상세) 사용 paradigm 영구 보존.
 return (
 <article ...>
 ...
 <div aria-hidden="true" className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white/5">
 <ImageOff size={32} className="text-white/40" strokeWidth={1.5} aria-hidden="true" />
 </div>
 ...
 </article>
 );
}
```

**사실**:
- SingleListingCard (L466-524) + ListingPickerCard (L526-572) 양 component `listing.photos` field 참조 영역 0 (placeholder 단독 paradigm 영구 보존)
- 폐기 사유 정합 사실 = "fetch duration NG + 사용자 체감 NG"
- cycle 1-G-γ-α-θ 정정 1 사실 = work-002 정정 9 폐기 + work-003 안 추가 변경 영역 0

→ **분기 (b) source 사실 확정**.

### Q5. court_listings DB 안 photos JSONB schema + 532249 row photos 값

**schema** ([supabase/schema.sql:524-526](supabase/schema.sql#L524-L526)):

```sql
photos JSONB, -- [{seq,category,caption,url,thumbnailUrl}]
photos_fetched_at TIMESTAMPTZ, -- 사진 수집 시점 (null = 미수집)
photos_count INT DEFAULT 0, -- 업로드된 사진 개수
```

**532249 row 직접 query 결과** (Supabase MCP ):

| field | 값 |
|---|---|
| docid | `B0002402024013053224911` (work-007 정정 1 신규 docid 형식 정합) |
| **photos_state** | **NULL** ← 잔존 사실 |
| photos_array_length | -1 (NULL 표기) |
| photos_count | 0 |
| photos_fetched_at | null |
| last_seen_at | 2026-05-13 05:43 (work-007 deploy 사후 첫 진입 사실) |
| is_active | true |

**사실**:
- work-007 fetchCaseDetail detail endpoint fetch 정합 사실 + DB UPSERT 정합 사실 (last_seen_at 갱신)
- photos column **NULL 잔존 사실 단단** ← mapDetailToRow 안 photos field 부재 paradigm 영향 정합
- photos JSONB schema 영구 보존 정합 (work-002 정정 영구 보존)

→ **분기 (a) 사실 단단 확정**.

### Q6. production lookup endpoint 직접 호출 + listings[0].photos 회수 결과

**URL**: `https://auctionsystem-green.vercel.app/api/auction/lookup?caseNumber=2024타경532249&courtCode=B000240`

**회신 사실**:

```json
{
 "status": "active",
 "listings": [{
 "docid": "B0002402024013053224911",
 "court_name": "인천지방법원",
 "case_number": "2024타경532249",
 "address_display": "인천광역시 미추홀구 주안서로 40, 11층아파트1103호 (주안동,주안네오빌주상복합)",
 "appraisal_amount": 70000000,
 "min_bid_amount": 24010000,
 "bid_date": "2026-06-29",
 "bid_time": "1000",
 "usage_name": "아파트",
 "area_display": "철근콘크리트구조 17.51㎡",
 "failed_count": 4,
 "item_sequence": 1,
 "mokmul_sequence": 1,
 "photos_fetched_at": null,
 "photos": null,
 "photos_count": 0,
 "auction_round": 5
 }]
}
```

**사실**:
- status="active" + auction_round=5 (failed_count 4 + 1) 정합
- usage_name="아파트" + 매핑 정합 사실 (work-007 정정 1 정합)
- **photos: null / photos_count: 0 / photos_fetched_at: null 단단 사실** ← DB NULL 회신 정합

→ **분기 (a) + (b) 동시 사실 확정 / 분기 (c) 양측 정정 의무**.

### Q7. 정정 paradigm 자율 추천

#### 분기 (c) 양측 동시 정정 paradigm — **Option 1 추천 (Hero Card client side async fetch)**

**정정 A — detail.ts photos 매핑 paradigm 결정**:

3가지 option 검토:

| Option | paradigm | fetch duration 영향 | 위험 | 검토 |
|---|---|---|---|---|
| **A-1** | mapDetailToRow 안 csPicLst → photos 매핑 추가 + lookup endpoint 안 sharp + Storage 업로드 동기 호출 | **+3~5초** (사용자 대기 / 사진 13장 × ~300ms) | **사전 폐기 사유 부활** | ✗ 폐기 |
| **A-2** | mapDetailToRow 영역 0 + lookup endpoint 안 fetchCaseDetail 사후 fetchAndCachePhotos `await` 없이 fire-and-forget | 0 (즉시 회신) | Vercel serverless background process 종료 위험 (waitUntil paradigm 사실 검수 의무) / 신뢰도 ↓ | △ 보류 |
| **A-3 (추천)** | **mapDetailToRow 영역 0 영구 보존 (work-002 정정 6 영구 보존)** + **Hero Card client side async fetch (PhotoGallery paradigm 정합)** | 0 (lookup endpoint 영향 0 / client 비동기 진입) | client 추가 1 round-trip / 사진 로딩 사후 placeholder → image 시각 변화 | ✓ **채택 추천** |

**A-3 정정 paradigm 세부**:
- detail.ts 영역 변경 0 (work-002 정정 6 + Lessons [A] 단일 source paradigm 영구 보존)
- SingleListingCard 안 useEffect + fetch `/api/court-listings/${listing.docid}/photos` 진입 paradigm
- loading state placeholder (ImageOff) 보존
- 사진 회수 사실 시점 = image render 진입 paradigm
- 기존 `/api/court-listings/[docid]/photos` route fetchAndCachePhotos 재활용 paradigm (PhotoGallery 동등 paradigm 정합)

**정정 B — SingleListingCard image render 분기 부활 paradigm**:

work-002 정정 9 폐기 사유 (fetch duration NG) 의식 paradigm:
- 동기 fetch paradigm 부활 NG (사전 폐기 사유 정합)
- 비동기 client side fetch paradigm 부활 정합 (A-3 paradigm)

**render 단계 옵션**:

| option | layout | Hero 적합 |
|---|---|---|
| B-1 | 88px single representative (대표 1장 / 전경 카테고리 ) | ✓ Hero 안 좁은 thumbnail 영역 적합 |
| B-2 | 88px × 4 grid (PhotoGallery 동등 paradigm) | △ Hero 안 layout 영역 |
| B-3 | 1+3 hero+strip paradigm | △ PhotoGallery 폐기 paradigm (cycle 1-D-A-4-2) 부활 NG |

→ **B-1 채택 추천** (Hero 안 single representative 단독 paradigm / 분석 페이지 안 PhotoGallery grid 별개 보존).

**ListingPickerCard 영역**:
- 사진 추가 영역 0 영구 보존 (text 단독 paradigm)
- paradigm polluted 영역 0 paradigm

#### 영향 파일 + 우선순위

| 파일 | 변경 paradigm | 우선순위 |
|---|---|---|
| `src/components/home/HomeHero.tsx` | SingleListingCard 안 useEffect + fetch 진입 + image render 분기 부활 (88px single representative + ImageOff fallback) | P1 |
| `src/lib/courtAuction/detail.ts` | 변경 0 (work-002 정정 6 영구 보존) | — |
| `src/lib/courtAuction/photos.ts` | 변경 0 (fetchAndCachePhotos 재활용 paradigm) | — |
| `src/app/api/court-listings/[docid]/photos/route.ts` | 변경 0 (기존 endpoint 재활용 paradigm) | — |
| `src/components/apply/PhotoGallery.tsx` | 변경 0 (paradigm 정합 source) | — |
| `src/app/api/auction/lookup/route.ts` | 변경 0 (work-005 + work-007 흐름 영구 보존) | — |
| `src/app/api/orders/check/route.ts` | 변경 0 (work-005 + work-007 흐름 영구 보존) | — |

→ **정정 영역 = HomeHero.tsx 단단 paradigm**.

---

## 자가 검증 6건 결과

| # | 검증 | 결과 |
|---|---|---|
| 1 | detail.ts mapDetailToRow photos 매핑 단계 사실 | ✓ photos field 부재 paradigm 영구 보존 (work-002 정정 6 정합) / **신규 사건 진입 시점 photos column NULL 잔존 source 사실 확정** |
| 2 | detail endpoint response photos field schema | ✓ csPicLst array (13 element) / element schema = {picFile: base64 JPEG / picFileUrl: 내부 NAS / picTitlNm / cortAuctnPicDvsCd / } / **client 직접 활용 NG 사실 (Storage 업로드 paradigm 필수)** |
| 3 | LISTING_SELECT photos 회신 사실 | ✓ photos + photos_count + photos_fetched_at 영구 보존 (work-002 정정 7) / listings[0].photos = null 정상 회신 paradigm 사실 |
| 4 | SingleListingCard image render 단계 사실 | ✓ placeholder (ImageOff) 단독 paradigm 영구 보존 (cycle 1-G-γ-α-θ 정정 1 = work-002 정정 9 폐기) / **listing.photos 참조 영역 0 사실** |
| 5 | 532249 row photos 값 + photos JSONB schema | ✓ Supabase MCP query = photos NULL / photos_count 0 / photos_fetched_at null / last_seen_at 2026-05-13 05:43 (work-007 deploy 사후 진입 사실) |
| 6 | 정정 paradigm 분기 (a/b/c) 확정 | ✓ **분기 (c) 양측 동시 정정** + Option 1 (A-3 + B-1 paradigm / Hero Card client side async fetch + 88px single representative) |

---

## 핵심 요약 (Opus 검수 입력)

### source 사실

1. work-007 fetchCaseDetail = 텍스트 단독 매핑 paradigm (csPicLst 활용 영역 0) — work-002 정정 6 영구 보존 paradigm 정합. 이는 의도된 사실 정합.
2. work-002 정정 9 폐기 사실 = SingleListingCard image render 분기 부재 — work-007 정정 사후 + work-002 정정 9 폐기 paradigm = **photos 채워졌다 해도 render NG**.
3. seed-photos.mjs 수동 시드 paradigm 영구 보존 (기존 seed 사건 photos 채워짐) but 신규 사건 진입 시점 자동 시드 paradigm 영역 0.

### 정정 paradigm 결정 사항 (Opus 의사결정 의뢰)

- **분기 (c) 양측 정정 paradigm 채택 사실 **: ✓ 양측 source 사실 단단 정합 사실. 단측 정정 시점 = 단측 source 잔존 paradigm.
- **fetch duration 폐기 사유 회피 paradigm 결정 사실 **: Option A-3 (client side async fetch) 단단 paradigm 안전한 선택 (lookup endpoint 영향 0). Option A-1 (서버 동기) 폐기 / Option A-2 (background fire-and-forget) Vercel serverless 신뢰도 ↓.
- **Hero Card layout 결정 사실 **: B-1 (88px single representative) 단단 paradigm 추천 (Hero 좁은 thumbnail 영역 적합).
- **work-002 정정 9 paradigm 부분 부활 사실 **: cycle 1-G-γ-α-θ 정정 1 (image render 폐기) paradigm 결정 사실 = "동기 fetch duration NG" 사유 정합. 비동기 client side fetch 부활 paradigm 신규 paradigm 정합 사실 (사전 정정 9 paradigm 부분 부활 / paradigm 폐기 영구 보존).

### 추가 검증 의무 (정정 사후 production 검수 단계)

1. 532249 Hero Card 진입 시점 = 사진 1장 회수 + render 사실 검수
2. fetch duration lookup endpoint 영향 0 사실 검수 (lookup endpoint 응답 ~1초 이내 보존 사실)
3. 사진 fetch 시점 placeholder → image 시각 전환 paradigm 사용자 체감 검수
4. seed-photos.mjs 수동 시드 paradigm 영구 보존 사실 + 분석 페이지 PhotoGallery paradigm 영구 보존 사실
5. work-001 ~ work-007 정정 영구 보존 검수

---

## 다음 단계

1. **Opus 검수 + 정정 결정 의뢰** (분기별 + Option A/B 형준님 의사결정 의뢰):
 - Option A-3 (client side async fetch) 채택 사실
 - Option B-1 (88px single representative) 채택 사실
 - work-002 정정 9 paradigm 부분 부활 paradigm 명시 의무
2. **형준님 결정 회수**
3. **Opus = work-008 정정 송부 markdown 산출** (사진 NG 정정 + UX 개선 3건 통합)
4. **Code = 정정 자율 실행** (HomeHero.tsx SingleListingCard 단단 + UX 3건 추가 정정)
5. **형준님 production 직접 검수**: 사진 표시 + 버튼 카피 + input focus + already-taken alert
