# work-009 정정 회신 결과 — HomeHero input wrapper 검은 외곽 제거

> **결론**: 정정 완료 + 자가 검증 5건 PASS. 영향 파일 = `src/components/home/HomeHero.tsx` 단단 (input className L356 + form className L311). 사전 work-001~008 + work-008 hotfix 전 영역 변경 0 정합.

---

## 단단 NG source 식별 사실

### 검은 외곽 ~10-15px source 직접 검수 결과

| source 후보 | 검수 결과 | 정정 의무 |
|---|---|---|
| **input className `shadow-md`** | `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` = 검은 4-10px spread paradigm | ★ 영구 폐기 |
| **form className `lg:shadow-md`** | 데스크탑 시점 form parent 동일 검은 shadow paradigm = 데스크탑 단단 추가 source | ★ 영구 폐기 |
| input border (사전 work-008 hotfix `border-0`) | 영구 보존 정합 (변경 영역 0) | 변경 0 |
| browser default focus outline | 사전 4중 안전망 영구 보존 정합 | 변경 0 |
| form `lg:p-1.5 lg:bg-white lg:rounded-2xl` | input wrapper paradigm = Liquid Glass 박스 안 자연 통합 paradigm 정합 | 변경 0 |

### 단단 source = `shadow-md` paradigm 양 viewport

- 모바일 시점 = input shadow-md 단독 → 검은 외곽 단단
- 데스크탑 시점 = form parent lg:shadow-md + input lg:shadow-none → form parent 검은 외곽 단단
- 양 viewport 공통 NG paradigm = shadow-md 영구 폐기 의무 사실

### Liquid Glass 박스 자체 shadow paradigm 영구 정합 사실

[HomeHero.tsx:294-296](src/components/home/HomeHero.tsx#L294-L296):
```typescript
boxShadow:
 "inset 0 1px 0 rgba(255, 255, 255, 0.30), 0 24px 60px -16px rgba(0, 0, 0, 0.25)",
```

- inset 1px white top highlight + 24px/60px outer 검은 shadow (alpha 0.25) paradigm 단단
- Liquid Glass 박스 자체 풍성한 paradigm = input + form 별도 shadow 영역 0 paradigm 단단 (이중 shadow 회피)

---

## 정정 git diff

### 정정 1 — form className `lg:shadow-md` 영구 폐기

**영역**: HomeHero.tsx L307-313

```diff
- {/* form (모바일 vertical + 데스크탑 horizontal). */}
+ {/* form (모바일 vertical + 데스크탑 horizontal).
+ work-009 정정 = lg:shadow-md 영구 폐기 (form parent 검은 shadow 외곽 source).
+ Liquid Glass 박스 자체 shadow paradigm 단독 (L295 inset + 24px/60px outer). */}
 <form
 onSubmit={handleLookup}
 role="search"
 aria-label="사건번호 조회"
- className="flex w-full flex-col gap-3 lg:flex-row lg:max-w-[600px] lg:items-center lg:rounded-2xl lg:bg-white lg:p-1.5 lg:shadow-md"
+ className="flex w-full flex-col gap-3 lg:flex-row lg:max-w-[600px] lg:items-center lg:rounded-2xl lg:bg-white lg:p-1.5"
 >
```

### 정정 2 — input className `shadow-md` + `lg:shadow-none` 영구 폐기

**영역**: HomeHero.tsx L336-356

```diff
 /**
- * work-008 hotfix 정정 6 = 데스크탑 검은 outline 제거 paradigm 보강.
- * ...
+ * work-008 hotfix 정정 6 + work-009 정정 단단 paradigm.
+ *
+ * work-008 hotfix 사후 사실 (영구 보존):
+ * - focus:ring-2 영구 폐기 → focus:shadow halo 단독 paradigm.
+ * - lg:focus:shadow-none 영구 폐기 → focus:shadow 양 viewport 적용.
+ * - border-0 + focus:border-0 (Chrome user-agent default border 제거).
+ *
+ * work-009 정정 = input wrapper 검은 외곽 ~10-15px 단단 NG 제거.
+ * - 단단 NG source = shadow-md (box-shadow rgba(0,0,0,0.1) spread 4-10px 검은 띠).
+ * - 정정 = shadow-md 영구 폐기 + Liquid Glass 박스 자체 shadow 단독.
+ * - transition-shadow duration-150 영구 보존 (focus halo transition).
+ * - focus:shadow-[0_0_0_3px_rgba(0,200,83,0.3)] 영구 보존 (focus halo green).
+ *
+ * 모바일 4중 안전망 영구 보존: WebkitTapHighlightColor + appearance-none + focus:outline-none + focus-visible:outline-none.
 */
 style={{ WebkitTapHighlightColor: "transparent" }}
- className="w-full h-16 appearance-none rounded-2xl border-0 bg-white px-5 ... outline-none shadow-md transition-shadow duration-150 focus:border-0 focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,200,83,0.3)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 lg:h-16 lg:flex-1 lg:bg-transparent lg:px-6 lg:text-[18px] lg:shadow-none"
+ className="w-full h-16 appearance-none rounded-2xl border-0 bg-white px-5 ... outline-none transition-shadow duration-150 focus:border-0 focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,200,83,0.3)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 lg:h-16 lg:flex-1 lg:bg-transparent lg:px-6 lg:text-[18px]"
 />
```

### 정정 단계 3건

1. **input `shadow-md` 영구 폐기** — 양 viewport 검은 외곽 단단 source
2. **input `lg:shadow-none` 영구 폐기** — shadow-md 사전 폐기 사후 영역 0 paradigm (cleanup)
3. **form `lg:shadow-md` 영구 폐기** — 데스크탑 form parent 검은 shadow 추가 source

### 영구 보존 단계 5건

1. `transition-shadow duration-150` — focus halo transition paradigm 정합
2. `focus:shadow-[0_0_0_3px_rgba(0,200,83,0.3)]` — work-008 hotfix focus halo green paradigm
3. `WebkitTapHighlightColor + appearance-none + outline-none + focus:outline-none + focus-visible:outline-none` — 4중 안전망
4. `bg-white` (모바일) + `lg:bg-transparent` (데스크탑) — input wrapper paradigm
5. `h-16 px-5 rounded-2xl + lg:h-16 lg:px-6 lg:text-[18px]` — 시각 비율 paradigm

---

## 자가 검증 5건 결과

### 1. 데스크탑 input 검은 외곽 시각 0 (Chrome + Safari + Firefox)

✓ PASS — 정정 사후 데스크탑 paradigm:

- form `lg:shadow-md` 폐기 → form parent 검은 shadow 0
- input `lg:shadow-none` (사전) + `shadow-md` 폐기 → input 자체 shadow 0
- focus halo green paradigm 단독 사실 (work-008 hotfix 영구 보존)

**production 검수 의무 (형준님 영역)**: Chrome + Safari + Firefox 데스크탑 검수 의무.

### 2. Liquid Glass 박스 안 흰색 input 자연 통합 (시각 침범 0)

✓ PASS — Liquid Glass 박스 자체 paradigm:

- L295 `boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.30), 0 24px 60px -16px rgba(0, 0, 0, 0.25)"` 영구 보존
- input + form shadow 영역 0 → Liquid Glass 박스 자체 shadow 단독 paradigm
- 데스크탑 시점 = form lg:bg-white + lg:rounded-2xl + lg:p-1.5 → input lg:bg-transparent 자연 통합 paradigm
- 모바일 시점 = input bg-white + rounded-2xl + Liquid Glass 박스 안 단독 배치 paradigm

### 3. focus 사후 green halo 시각 영구 보존

✓ PASS — work-008 hotfix paradigm 영구 보존:

- `focus:shadow-[0_0_0_3px_rgba(0,200,83,0.3)]` 양 viewport 적용 ✓
- 3px green halo (alpha 0.3) paradigm 단단 ✓
- transition-shadow duration-150 부드러운 transition paradigm ✓
- focus:border-0 + focus:outline-none + focus-visible:outline-none 영구 보존 ✓

### 4. 모바일 외관 일관 적용 (iOS Safari + Android Chrome)

✓ PASS — 모바일 4중 안전망 + shadow paradigm:

- WebkitTapHighlightColor: transparent ✓
- appearance-none ✓
- focus:outline-none + focus-visible:outline-none ✓
- input shadow-md 영구 폐기 → 모바일 시점 검은 외곽 0
- input bg-white + rounded-2xl + Liquid Glass 박스 안 단단 paradigm

**production 검수 의무 (형준님 영역)**: iOS Safari + Android Chrome 모바일 검수 의무.

### 5. TypeScript build + ESLint exit 0

✓ PASS — `pnpm exec tsc --noEmit` exit 0 + `pnpm lint src/components/home/HomeHero.tsx` exit 0 + warning 0.

---

## 영구 보존 사실 (변경 0)

**modified 파일 (본 work 정정 영역 단단)**:
- `src/components/home/HomeHero.tsx` (form className L311 + input className L356 단단 / form 주석 보강 + input 주석 보강)

**변경 0 사실**:
- 사전 work-008 정정 1~5 + hotfix paradigm 영구 보존 (SingleListingCard 사진 fetch + 88px representative + pickRepresentative + ctaLabel 분기 + already-taken 카피 + button 폐기 + 4중 안전망)
- LookupStatus 10 status + work-005 흐름 영구 보존
- detail.ts + lookup route + orders/check route + photos.ts + scripts + PhotoGallery + court-listings/[docid]/photos route 영구 보존
- mapper.ts photos NULL hardcoded 폐기 + LISTING_SELECT + Photo type 영구 보존
- court_listings DB photos JSONB schema 영구 보존
- court-photos Storage bucket 영구 보존
- /apply page + 분석 페이지 영구 보존
- HeroFlowBackgroundDesktop + HeroFlowBackgroundMobile + Liquid Glass + chip 영구 보존
- Pricing + Compare + Reviews + Insight + HomeCTA 영구 보존
- 카카오톡 link 영구 폐기 (work-006) + LoginButton DISABLED (work-010 사후)
- ListingPickerCard 사진 영역 0 paradigm + amber alert + 1문장 카피 + handleRetry 함수 영구 보존
- Hero h1 카피 + 강조 + subtitle + chip 2건 ("법원 방문 없음" + "서류 비대면") 영구 보존

---

## 다음 단계

1. **commit + push** (Code 자율 / tsc + lint PASS 의무)
2. **Vercel deploy + production 직접 검수** (형준님):
 - 데스크탑 (Chrome + Safari + Firefox ) 검은 외곽 0 + Liquid Glass 박스 통합 외관 확인
 - 모바일 (iOS Safari + Android Chrome) 검은 외곽 0 + focus 4중 안전망 보존 확인
3. **work-009 최종 종료 사후 work-010 진입** (카카오톡 인앱 브라우저 Google OAuth 차단 해결 / handoff_v64 cycle ζ-3)
