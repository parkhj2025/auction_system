# work-008 정정 회신 결과 — 사진 NG + UX 개선 3건 통합 정정

> **결론**: 정정 5건 자율 실행 완료 + 자가 검증 7건 PASS. 영향 파일 = `src/components/home/HomeHero.tsx` 단단 (106 insertions / 54 deletions). work-001~007 정정 영역 + work-005 흐름 + detail.ts + lookup + check route + photos.ts + PhotoGallery + scripts 변경 0 정합.

---

## 정정 5건 git diff

### 정정 1+2 — SingleListingCard 안 photos 비동기 fetch + 88px representative render

**영역**: HomeHero.tsx L1-14 (import) + L463-485 (pickRepresentative helper 신규) + L487-557 (SingleListingCard 정정)

**import 변경**:
```diff
-import { useState } from "react";
+import { useEffect, useState } from "react";
-import type { CourtListingSummary } from "@/types/apply";
+import type { CourtListingSummary, Photo } from "@/types/apply";
```

**pickRepresentative helper 신규**:
```typescript
/**
 * 사진 1장 representative 선택 paradigm (work-008 정정 2).
 * 우선순위: 전경사진 (000241) → 외부 (000242 감정평가/000243 현황조사) → 첫 항목 fallback.
 */
function pickRepresentative(photos: Photo[]): Photo | null {
 if (photos.length === 0) return null;
 const byCategory = (code: string) =>
 photos.find((p) => p.categoryCode === code);
 return (
 byCategory("000241") ??
 byCategory("000242") ??
 byCategory("000243") ??
 photos[0] ??
 null
 );
}
```

**SingleListingCard 정정**:
- 신규 state: `const [photo, setPhoto] = useState<Photo | null>(pickRepresentative(seeded))` (사전 seeded 즉시 진입 paradigm)
- 신규 useEffect: seeded.length=0 시점 = `/api/court-listings/${docid}/photos` fetch + cancel/abort cleanup paradigm
- 신규 render: `photo` 있을 시 `<img>` 88×88 object-cover / 없을 시 ImageOff placeholder (fallback 영구 보존)
- error = silent fallback (placeholder 단독 유지 paradigm)

**paradigm 정합 사실**:
- PhotoGallery (분석 페이지) [src/components/apply/PhotoGallery.tsx:26-42](src/components/apply/PhotoGallery.tsx#L26-L42) 동등 paradigm (client side async fetch / loading state / silent fallback)
- 사전 seed-photos.mjs 시드 사건 시점 = cache hit + fetch skip + 즉시 render paradigm
- lookup endpoint duration 영향 0 사실 (fetchCaseDetail + photos fetch 분리 paradigm)
- AbortController + cancelled flag 양쪽 cleanup paradigm (component unmount race 회피)

### 정정 3 — ctaLabel 분기 (검증 단단 / 변경 영역 0)

**영역**: HomeHero.tsx L188-194

**사전 carrier 사실 (이미 의도 paradigm 단단 정합)**:
```typescript
const ctaLabel = isLoading
 ? "조회 중..."
 : hasResult
 ? "신청하기"
 : hasError
 ? "다시 조회하기"
 : "조회하기";
```

- `idle` = "조회하기" ✓
- `loading` = "조회 중..." ✓
- `active-single` + `active-multi` (= hasResult) = "신청하기" ✓
- `closed` + `not-found` + `invalid` + `error` + `fetch-failed` + `already-taken` (= hasError) = "다시 조회하기" ✓

→ **정정 송부 의도 paradigm 사전 단단 정합 사실 = 변경 영역 0**.

### 정정 4 — input focus 검은 outline 제거 + green ring 단단

**영역**: HomeHero.tsx L317-348 (input element)

**정정 변경**:
```diff
+ /**
+ * work-008 정정 4 = 검은 outline 제거 paradigm.
+ * - focus-visible:outline-none + focus:outline-none 양쪽 명시 (mouse + keyboard 동일 paradigm 보장).
+ * - WebkitTapHighlightColor: transparent (iOS Safari tap 시점 회색 highlight 제거).
+ * - appearance-none + 명시적 outline-none paradigm.
+ */
+ style={{ WebkitTapHighlightColor: "transparent" }}
- className="w-full h-16 rounded-2xl bg-white px-5 ... outline-none shadow-md ... focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)] ..."
+ className="w-full h-16 appearance-none rounded-2xl bg-white px-5 ... outline-none shadow-md ... focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)] focus-visible:outline-none ..."
```

**검은 outline source 식별 paradigm**:
- (a) browser default `:focus` outline = `focus:outline-none` 명시적 보강 paradigm
- (b) keyboard navigation `:focus-visible` outline = `focus-visible:outline-none` 명시적 보강
- (c) iOS Safari tap highlight = `WebkitTapHighlightColor: transparent` inline style
- (d) browser form widget inner outline = `appearance-none` paradigm

→ 4중 안전망 paradigm 단단. 사전 `outline-none` + `focus:ring` + `focus:shadow` 영구 보존 + 신규 4건 추가 paradigm.

**보존**:
- 사전 `outline-none` ✓
- 사전 `focus:ring-2 focus:ring-[var(--brand-green)]/30` ✓
- 사전 `focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)]` ✓
- 사전 `lg:focus:shadow-none` (데스크탑 paradigm) ✓
- 사전 `disabled:cursor-not-allowed disabled:opacity-60` ✓

### 정정 5 — already-taken alert 카피 단순화 + "다른 사건 검색" 버튼 폐기

**영역**: HomeHero.tsx L115-122 (error message) + L383-414 (alert render)

**카피 변경**:
```diff
- "이 사건은 이미 다른 고객의 신청이 진행 중입니다. 같은 회차는 중복 접수가 불가합니다. 다음 회차 진행 시점 재 진입 가능합니다.",
+ "이미 다른 고객이 신청 중인 사건입니다.",
```

**버튼 폐기**:
- 사전 carrier (L417-427 ) = "다른 사건 검색" button + handleRetry onClick paradigm 영구 폐기
- alert layout = `flex-col gap-3` → `items-start gap-3` paradigm (button 폐기 사후 단일 row layout 단순화)
- 사용자 input 재 진입 paradigm 단단 (사건번호 input onChange onChange handler lookupStatus="idle" 자동 회신 paradigm 영구 보존 사실 = L327-335)

**보존**:
- already-taken 분기 자체 영구 보존 (work-005 정정 3)
- LookupStatus 10 status 영구 보존
- amber alert 색상 (border-amber-500/30 + bg-amber-500/10) 영구 보존
- AlertTriangle icon 영구 보존
- handleRetry 함수 자체 영구 보존 (handleCtaClick 안 hasError 분기 사용처 정합 / L196-203)

---

## 자가 검증 7건 결과

### 1. SingleListingCard useEffect + photos fetch 진입 사실

✓ PASS — useEffect hook 신규 추가 + listing.docid 의존성 + AbortController + cancelled flag cleanup paradigm.

- endpoint URL 정확값: `/api/court-listings/${encodeURIComponent(listing.docid)}/photos` (PhotoGallery 동등 paradigm)
- response schema: `{ photos: Photo[] }` (PhotoMeta = { seq, url, caption, categoryCode })
- cache hit paradigm: listing.photos 사전 시드 사실 시점 = useEffect 진입 즉시 return + fetch skip
- error = silent fallback (placeholder 유지)
- cleanup paradigm: cancelled = true + controller.abort() 양쪽 (race 회피 + memory leak 회피)

### 2. 사진 88px representative render 동작 사실

✓ PASS — pickRepresentative + img element render paradigm:

- 88px × 88px (`grid-cols-[88px_1fr]` 사전 grid + `h-full w-full object-cover` paradigm)
- lg:120px × 120px (`lg:grid-cols-[120px_1fr]` 사전 desktop paradigm 영구 보존)
- 사진 회수 NG 시점 = ImageOff placeholder fallback paradigm 영구 보존
- alt 텍스트: `photo.caption || listing.address_display || "사건 사진"` 3단 fallback
- loading="lazy" paradigm (사용자 viewport 진입 시점 lazy load perf 정합)

**production 검수 의무 (형준님 영역)**:
- 532249: seed-photos.mjs 시드 영역 0 사실 → `/api/court-listings/[docid]/photos` 첫 fetch → Vercel WAF photos 회수 NG 사실 가능성 placeholder fallback paradigm 보존 사실
- 559336 + 540431: 동일 paradigm 검수 의무

### 3. ctaLabel 분기 동작 사실 (조회하기 → 신청하기)

✓ PASS — 사전 carrier 영구 보존 사실 (변경 영역 0).

| lookupStatus | ctaLabel |
|---|---|
| idle | "조회하기" |
| loading | "조회 중..." |
| active-single + active-multi | "신청하기" |
| closed + not-found + invalid + error + fetch-failed + already-taken | "다시 조회하기" |

→ 사용자 시각 사실 사실: 진입 = "조회하기" → submit = "조회 중..." → 결과 사후 = "신청하기" / "다시 조회하기" 분기 단단 paradigm.

### 4. input focus 검은 outline 제거 + green ring 단단 사실

✓ PASS — 4중 안전망 paradigm 단단 (focus:outline-none + focus-visible:outline-none + WebkitTapHighlightColor + appearance-none).

- mouse click 진입 시점 = green ring (focus:ring-2 focus:ring-[var(--brand-green)]/30) + green shadow (focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)]) 단독
- keyboard tab 진입 시점 = 동일 paradigm (focus + focus-visible 양쪽 동일 className 정합)
- iOS Safari tap = WebkitTapHighlightColor 회색 highlight 제거
- browser form widget inner outline = appearance-none 제거

**production 검수 의무 (형준님 영역)**:
- 모바일 + 데스크탑 + Safari + Chrome + Firefox 검은 outline 0 사실 직접 검수

### 5. already-taken alert 카피 단순화 + 버튼 제거 사실

✓ PASS — 1문장 단단 paradigm + button 폐기.

- 신규 카피: "이미 다른 고객이 신청 중인 사건입니다." (1문장 / 19자)
- 폐기 button: "다른 사건 검색" + handleRetry onClick + flex-wrap layout 폐기
- alert layout 단순화: flex-col gap-3 → items-start gap-3 (button 폐기 정합)
- 사용자 재 진입 paradigm: input onChange handler lookupStatus="idle" 자동 회신 paradigm 영구 보존 (L327-335)

**보존**:
- already-taken 분기 (work-005 정정 3) ✓
- LookupStatus 10 status ✓
- amber alert 색상 + AlertTriangle icon ✓
- handleRetry 함수 자체 (handleCtaClick hasError 사용처 정합) ✓

### 6. work-001 ~ work-007 정정 영구 보존 사실

✓ PASS — `git status --short` 검수 사실:

**modified 파일 (본 work 정정 영역 단단)**:
- `src/components/home/HomeHero.tsx` (정정 1+2+4+5 / +106 / -54)

**변경 0 사실 (영구 보존)**:
- `src/lib/courtAuction/detail.ts` ✓ (work-007 정정 영구 보존)
- `src/lib/courtAuction/search.ts` ✓
- `src/lib/courtAuction/mapper.ts` ✓ (work-002 정정 6 영구 보존)
- `src/lib/courtAuction/photos.ts` ✓ (fetchAndCachePhotos 재활용 paradigm)
- `src/lib/courtAuction/codes.ts` ✓
- `src/lib/courtAuction/session.ts` ✓
- `src/app/api/auction/lookup/route.ts` ✓ (work-005 + work-007 정정 영구 보존)
- `src/app/api/orders/check/route.ts` ✓ (work-005 + work-007 정정 영구 보존)
- `src/app/api/court-listings/[docid]/photos/route.ts` ✓ (정정 1 안 호출 단단 / 변경 영역 0)
- `src/components/apply/PhotoGallery.tsx` ✓ (paradigm 정합 source / 변경 영역 0)
- `src/types/apply.ts` ✓ (Photo type 영구 보존)
- `scripts/seed-photos.mjs` ✓ (work-001 정합 / cycle ζ-1 정정 5 영구 보존)
- supabase/migrations + court_listings DB schema ✓
- LoginButton ✓ (work-009 사후 단단)
- 분석 페이지 + /apply page ✓ (변경 영역 0)
- HeroFlowBackground (Desktop + Mobile) + Liquid Glass + chip ✓
- Pricing + Compare + Reviews + Insight + HomeCTA ✓
- ListingPickerCard 안 사진 영역 0 paradigm ✓ (active-multi 텍스트 단단 영구 보존)
- amber alert 색상 + red 사용 금지 paradigm ✓

### 7. TypeScript build + ESLint PASS

✓ PASS — `pnpm exec tsc --noEmit` exit 0 + `pnpm lint src/components/home/HomeHero.tsx` exit 0 + warning 0.

---

## 영향 파일 단단 사실

`git status --short` 결과:

```
 M src/components/home/HomeHero.tsx ← 본 work 정정 영역 단단
?? docs/work-008-photos-research.md ← 사전 조사 회신 (commit 영역)
?? docs/work-008-result.md ← 본 결과 markdown (commit 영역)
?? scripts/diagnostics/probe-csPicLst-element.mjs ← 사전 조사 산출 (commit 영역)

 D "경매퀵_홈_v9.1.html" ← 본 work 외 / 사전 상태 보존
?? public/logo-icon.png ← 본 work 외 / 형준님 의사결정 대기
```

**정정 영역**: HomeHero.tsx 단단 + 산출 docs/scripts.

---

## 사용자 시각 변화 사실 (production 검수 의뢰 5건)

1. **사진 표시 사실**: 532249 + 559336 + 540431 Hero 입력 → 사진 1장 88px representative 표시 (또는 fallback ImageOff)
2. **버튼 카피 분기**: 진입 = "조회하기" → submit = "조회 중..." → 결과 사후 = "신청하기" / "다시 조회하기"
3. **input focus 시각**: 검은 outline 0 + green ring + green shadow 단단 표시
4. **already-taken alert**: 1문장 카피 + "다른 사건 검색" 버튼 0 (사용자 input 재 진입 단단)
5. **work-001~007 + work-005 흐름 영구 보존**: cache → fetch → records 분기 → already_taken / closed / active / not_found / fetch_failed 정상 동작 사실

---

## 다음 단계

1. **commit + push** (Code 자율 / lint + tsc PASS 의무)
2. **Vercel deploy + production 직접 검수 5건** (형준님)
3. **work-008 종료 사후 work-009 진입** (카카오톡 인앱 브라우저 Google OAuth 차단 해결 / handoff_v64 cycle ζ-3)
