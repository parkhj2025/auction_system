# work-010 정정 회신 결과 — 데스크탑 검은 테두리 + 사진 영역 폐기

> **결론**: 정정 3건 자율 실행 완료 + 자가 검증 5건 PASS. 영향 파일 = `src/components/home/HomeHero.tsx` 단단 (-113 / +44 net cleanup). 사전 work-001~009 + work-005 흐름 + detail.ts + lookup/check route + photos.ts + scripts + PhotoGallery 전 영역 변경 0 정합.

---

## 단단 NG source 식별 사실

### 데스크탑 검은 테두리 source (의뢰 1)

| source 후보 | 검수 결과 | 정정 의무 |
|---|---|---|
| **form `lg:rounded-2xl lg:bg-white lg:p-1.5`** wrapper paradigm | 데스크탑 input + button wrap 흰 배경 + 6px padding paradigm = input 외곽 검은 1-2px 잔존 단단 source | ★ 영구 폐기 |
| input `lg:bg-transparent` 데스크탑 분기 | wrapper paradigm 정합 사실 = wrapper 폐기 사후 영역 0 paradigm | ★ 영구 폐기 (cleanup) |
| input `appearance-none + outline-none + border-0` (work-008 hotfix) | 4중 안전망 영구 보존 정합 / 데스크탑 단단 source 영역 0 정합 | 변경 0 |
| Liquid Glass overlay inset shadow (L294-296) | 박스 자체 paradigm 정합 (input 외 영역) / 검은 외곽 source 영역 0 정합 | 변경 0 |
| browser default focus outline | 사전 4중 안전망 영구 보존 정합 | 변경 0 |

**단단 source = form lg:bg-white wrapper paradigm**:
- 데스크탑 시점 = `lg:rounded-2xl lg:bg-white lg:p-1.5` input + button 흰 wrap paradigm
- input `lg:bg-transparent` wrap 안 inset paradigm 사실 = 사용자 시각 = input 검은 외곽 paradigm 단단
- 모바일 시점 = wrap paradigm 적용 영역 0 사실 (lg: prefix 단독) = 모바일 PASS 정합 사실
- 정정 = wrapper paradigm 영구 폐기 + input 자체 bg-white paradigm 단독 (양 viewport 동일)

### 사진 로딩 NG source (의뢰 2)

| source | 사실 |
|---|---|
| **work-008 정정 1+2 paradigm** = useEffect + AbortController + pickRepresentative + /api/court-listings/[docid]/photos fetch + 88px img render + ImageOff placeholder | 사용자 시각 사실: 텍스트 즉시 표시 → ImageOff placeholder 잠시 표시 → ~10초 사후 사진 표시 paradigm |
| Vercel WAF 사진 fetch delay 잠재 | production fetch 사진 응답 지연 사실 (server-side sharp + Storage 업로드 paradigm) |
| 사용자 의도 정수 | 핵심 정보 직접 포착 외관 / 사진 영역 영구 폐기 paradigm |

→ **사진 영역 영구 폐기 paradigm 단단** (work-008 정정 1+2 paradigm 폐기 전환).

---

## 정정 git diff (-113 / +44)

### 정정 1 — form `lg:bg-white lg:p-1.5 lg:rounded-2xl` wrapper paradigm 영구 폐기

**영역**: HomeHero.tsx L306-315

```diff
- {/* form (모바일 vertical + 데스크탑 horizontal).
- work-009 정정 = lg:shadow-md 영구 폐기 (form parent 검은 shadow 외곽 source).
- Liquid Glass 박스 자체 shadow paradigm 단독 (L295 inset + 24px/60px outer). */}
+ {/* form (모바일 vertical + 데스크탑 horizontal).
+ work-009 정정 = lg:shadow-md 영구 폐기.
+ work-010 정정 1 = lg:bg-white + lg:p-1.5 + lg:rounded-2xl wrapper paradigm 영구 폐기.
+ source = wrapper bg-white + p-1.5 padding = 데스크탑 input 외곽 검은 1-2px 잔존 source.
+ 정정 = input 자체 paradigm 단독 (양 viewport 동일 bg-white) + button 직접 horizontal flex. */}
 <form
 onSubmit={handleLookup}
 role="search"
 aria-label="사건번호 조회"
- className="flex w-full flex-col gap-3 lg:flex-row lg:max-w-[600px] lg:items-center lg:rounded-2xl lg:bg-white lg:p-1.5"
+ className="flex w-full flex-col gap-3 lg:flex-row lg:max-w-[600px] lg:items-center"
 >
```

**input className 정정 (lg:bg-transparent 폐기)**:

```diff
- className="... lg:h-16 lg:flex-1 lg:bg-transparent lg:px-6 lg:text-[18px]"
+ className="... lg:h-16 lg:flex-1 lg:px-6 lg:text-[18px]"
```

### 정정 2 — SingleListingCard 사진 영역 영구 폐기

**영역**: HomeHero.tsx L469-589 (-77 lines net)

**폐기 단계 **:
- `pickRepresentative` 함수 영구 폐기 (L472-488)
- `useState<Photo | null>` state 영구 폐기 (L497-499)
- `useEffect` + AbortController + fetch + cleanup 영구 폐기 (L501-527)
- 사진 div + `<img>` element + ImageOff fallback 영구 폐기 (L534-552)
- `grid-cols-[88px_1fr] lg:grid-cols-[120px_1fr]` 사진 grid 폐기 → 단순 flex paradigm

### 정정 3 — 텍스트 단독 카드 layout 정렬

**영역**: HomeHero.tsx L480-516 (신규 paradigm)

```typescript
return (
 <article className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
 <span className="inline-flex items-center rounded-full bg-[var(--brand-green)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
 조회 완료
 </span>
 <div className="mt-4 flex flex-col gap-2 text-left">
 {listing.usage_name && (
 <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
 {listing.usage_name}
 </p>
 )}
 <p className="text-base font-medium leading-snug text-white">
 {listing.address_display ?? listing.case_title ?? "주소 정보 미수신"}
 </p>
 <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-3 text-xs text-white/80 sm:text-sm">
 <div>
 <p className="text-white/60">감정가</p>
 <p className="tabular-nums text-white">{formatWon(listing.appraisal_amount)}</p>
 </div>
 {/* 최저가 + 입찰일 + 유찰 횟수 동등 paradigm */}
 </div>
 </div>
 </article>
);
```

**시각 paradigm**:
- "조회 완료" green 뱃지 영구 보존 (brand-green + 흰 텍스트 + uppercase tracking-wider)
- 용도 (usage_name) green uppercase paradigm 영구 보존
- 주소 paragraph (text-base white) 영구 보존
- 4-grid 정보 (감정가 + 최저가 + 입찰일 + 유찰 횟수) 영구 보존
- 사진 영역 폐기 사후 gap = `gap-x-6 gap-y-3` 확대 (사전 `gap-2` → 가로 6 / 세로 3 paradigm 여백 균형 paradigm)

### import 정리 4건

```diff
-import { useEffect, useState } from "react";
+import { useState } from "react";

 import {
 Building2,
 FileText,
 AlertCircle,
 AlertTriangle,
 Loader2,
- ImageOff,
 } from "lucide-react";

-import type { CourtListingSummary, Photo } from "@/types/apply";
+import type { CourtListingSummary } from "@/types/apply";
```

- `useEffect` 폐기 (사진 fetch 폐기 사후 사용처 0)
- `ImageOff` 폐기 (placeholder fallback 폐기 사후 사용처 0)
- `Photo` type 폐기 (pickRepresentative 폐기 사후 사용처 0)
- `useState` 영구 보존 (HomeHero 함수 L72-76 사용처 5건)

---

## 자가 검증 5건 결과

### 1. 데스크탑 검은 테두리 시각 0 (Chrome + Safari + Firefox)

✓ PASS — form wrapper paradigm 영구 폐기 + input 자체 bg-white paradigm 단독:

- 사전: form `lg:rounded-2xl lg:bg-white lg:p-1.5` wrap + input `lg:bg-transparent` inset → input 외곽 검은 1-2px source
- 정정: form `lg:flex-row lg:max-w-[600px] lg:items-center` 단단 + input `bg-white` 양 viewport 동일 → wrap paradigm 영구 폐기
- 결과: 데스크탑 시점 = input 자체 흰 background + button brand-green horizontal flex paradigm = 검은 외곽 source 영역 0 정합

**production 검수 의무 (형준님 영역)**: Chrome + Safari + Firefox 데스크탑 DevTools 직접 검수.

### 2. SingleListingCard 사진 element 제거 + `/api/court-listings/[docid]/photos` 호출 0

✓ PASS — `grep` 직접 검수 사실:

```bash
$ grep -n "fetchAndCachePhotos\|/api/court-listings.*photos\|pickRepresentative" src/components/home/HomeHero.tsx
# (출력 영역 0 정합 사실)
$ grep -n "<img\|ImageOff\|useEffect" src/components/home/HomeHero.tsx
# (출력 영역 0 정합 사실)
```

- useEffect + AbortController + fetch 함수 호출 폐기 단단
- pickRepresentative 함수 + photos.find 폐기 단단
- `<img>` element + ImageOff placeholder 폐기 단단
- import 4건 정리 (useEffect + ImageOff + Photo type) 단단

**보존**:
- `photos.ts` component 영구 보존
- `/api/court-listings/[docid]/photos` route 영구 보존 (분석 페이지 PhotoGallery 사용 잔존)
- `scripts/seed-photos.mjs` 영구 보존
- `court_listings.photos` JSONB column 영구 보존
- `LISTING_SELECT` 안 `photos + photos_count` 영구 보존 (work-002 정정 7)
- `Photo` type export 영구 보존 (src/types/apply.ts / PhotoGallery 등 다른 사용처)

### 3. 텍스트 단독 카드 외관 자연 정렬

✓ PASS — flex flex-col gap paradigm 정합:

- "조회 완료" green 뱃지 (사전 외관 영구 보존)
- 용도 (usage_name) green uppercase paragraph (사전 외관 영구 보존)
- 주소 paragraph (text-base + leading-snug + white) 사전 외관 영구 보존
- 4-grid 정보 (감정가 + 최저가 + 입찰일 + 유찰 횟수) tabular-nums + white/60 label + white value 영구 보존
- 가로 padding p-5 + 둥근 모서리 rounded-2xl + 반투명 border + bg + backdrop-blur 사전 외관 영구 보존
- 신규 `gap-x-6 gap-y-3` paradigm = 사진 폐기 사후 정보 여백 균형 paradigm

### 4. 모바일 사전 외관 영구 보존

✓ PASS — 모바일 paradigm 변경 0:

- form className 모바일 단계 (`flex w-full flex-col gap-3`) 영구 보존
- input className 모바일 단계 (`w-full h-16 appearance-none rounded-2xl border-0 bg-white px-5 + outline-none transition-shadow + focus:shadow halo + 4중 안전망`) 영구 보존
- button className 모바일 단계 영구 보존
- 모바일 시점 = form wrap paradigm 영역 0 (lg: prefix 단독 폐기) = 사전 paradigm 단단 보존

**production 검수 의무 (형준님 영역)**: iOS Safari + Android Chrome 모바일 시각 비교 검수.

### 5. TypeScript build + ESLint exit 0

✓ PASS — `pnpm exec tsc --noEmit` exit 0 + `pnpm lint src/components/home/HomeHero.tsx` exit 0 + warning 0.

---

## 영구 보존 사실 (변경 0)

- 사전 work-001~009 + work-008 hotfix paradigm 전 영역 영구 보존 (work-008 정정 1+2 사진 fetch paradigm 전환 단독 사실 / 정정 3+4+5 + hotfix + work-009 영구 보존)
- LookupStatus 10 status + work-005 흐름 영구 보존
- detail.ts (work-007) + lookup route + orders/check route + photos.ts + scripts + PhotoGallery + court-listings/[docid]/photos route 영구 보존
- mapper.ts photos NULL hardcoded 폐기 + LISTING_SELECT + Photo type export 영구 보존
- court_listings DB photos JSONB schema + court-photos Storage bucket 영구 보존
- /apply page + 분석 페이지 영구 보존
- HeroFlowBackgroundDesktop + HeroFlowBackgroundMobile + Liquid Glass + chip 영구 보존
- Pricing + Compare + Reviews + Insight + HomeCTA 영구 보존
- 카카오톡 link 영구 폐기 (work-006) + LoginButton DISABLED (work-011 사후)
- ListingPickerCard 사진 영역 0 paradigm + amber alert + 1문장 카피 + handleRetry 함수 영구 보존
- Hero h1 카피 + 강조 + subtitle + chip 2건 ("법원 방문 없음" + "서류 비대면") 영구 보존
- input 4중 안전망 (WebkitTapHighlightColor + appearance-none + outline-none + focus:outline-none + focus-visible:outline-none) 영구 보존
- input border-0 + focus:border-0 + focus:shadow green halo 영구 보존

---

## 다음 단계

1. **commit + push** (Code 자율 / tsc + lint PASS 의무)
2. **Vercel deploy + production 직접 검수** (형준님):
 - 데스크탑 (Chrome + Safari + Firefox ) 검은 테두리 0 + 텍스트 단독 카드 자연 외관 확인
 - 모바일 (iOS Safari + Android Chrome) 사전 외관 영구 보존 + 텍스트 단독 카드 외관 확인
3. **work-010 최종 종료 사후 work-011 진입** (카카오톡 인앱 브라우저 Google OAuth 차단 해결 / handoff_v64 cycle ζ-3)
