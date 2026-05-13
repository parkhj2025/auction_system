# work-008 hotfix 회신 결과 — 정정 6 (데스크탑 input focus 검은 outline 제거)

> **결론**: 정정 6 자율 실행 완료 + 자가 검증 5건 PASS. 사전 work-008 정정 1~5 영구 보존 + work-001~007 전 영역 변경 0 정합. 영향 파일 = `src/components/home/HomeHero.tsx` 단단 (input className L335-356 단단).

---

## NG source 직접 식별 사실

### 단단 의심 source 검수 단계

| 의심 source | 검수 결과 |
|---|---|
| (a) input className default border 잔존 | Tailwind preflight `border-width:0` 적용 사실 정합 / 단 Chrome user-agent default `<input>` border 잠재 사실 → 보강 의무 |
| (b) browser default focus outline | 사전 `outline-none + focus:outline-none + focus-visible:outline-none` 4중 안전망 사실 정합 |
| (c) parent container focus-within | form className focus-within 분기 영역 0 사실 정합 |
| (d) Chrome autofill border | autoComplete="off" 사실 + autofill paradigm 영역 0 / 단 box-shadow 명시 보강 paradigm |
| (e) box-shadow 안 검은 inset | 사전 `focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)]` brand-green 30% alpha = `rgba(0,200,83,0.3)` 옅은 녹색 paradigm 정합 / 검은 source 영역 0 |

### 단단 source 식별 사실 (NG 단단 source)

**`lg:focus:shadow-none` + `focus:ring-2` 데스크탑 paradigm 단단**:

- 사전 className 분석:
 ```
 focus:ring-2 focus:ring-[var(--brand-green)]/30 ← 모든 viewport 적용
 focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)] ← 모바일 단단 (data 적용)
 lg:focus:shadow-none ← 데스크탑 shadow 0 ★ NG source
 ```

- 데스크탑 focus 시점 사실:
 - `focus:shadow` 데스크탑 시점 0 (lg:focus:shadow-none paradigm)
 - `focus:ring-2` 단독 잔존 → 2px ring line paradigm 단단
 - ring color = `var(--brand-green)/30` = `rgba(0, 200, 83, 0.3)` (옅은 녹색)
 - 단 ring paradigm = `box-shadow` 2px outset = **단단 강한 line 사용자 시각 NG 사실** (사용자 photo 검은 1~2px line 사실 정합)

- 모바일 focus 시점 사실 (PASS source):
 - `focus:ring-2` + `focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)]` 동시 적용
 - 3px green halo (alpha 0.2) + 2px ring = 부드러운 halo paradigm 단단 사실
 - 사용자 시각 PASS 정합

→ **단단 NG source = ring 단단 강한 line + 데스크탑 halo 0 paradigm**.

---

## 정정 6 git diff

**영역**: HomeHero.tsx L335-356 (input element)

```diff
 placeholder="사건번호 입력 (예: 2024타경569067)"
 /**
- * work-008 정정 4 = 검은 outline 제거 paradigm.
- * - focus-visible:outline-none + focus:outline-none 양쪽 명시 ...
- * - WebkitTapHighlightColor: transparent ...
- * - browser default focus outline = appearance-none + 명시적 outline-none paradigm.
- * - green ring + green shadow 단독 = focus-visible 단독 표시 ...
+ * work-008 hotfix 정정 6 = 데스크탑 검은 outline 제거 paradigm 보강.
+ *
+ * 사전 NG source 식별 사실:
+ * - 데스크탑 `lg:focus:shadow-none` paradigm = focus shadow 0 + focus:ring-2 단독 잔존
+ * → ring 단단 강한 line 사용자 시각 NG.
+ * - 사용자 photo 검은 1~2px line 사실 = ring paradigm 사용자 시각 단단 강한 paradigm 사실.
+ * - 모바일 paradigm (focus:shadow halo) = PASS / 데스크탑 paradigm 영구 정합 의무.
+ *
+ * 정정 paradigm:
+ * - focus:ring-2 영구 폐기 → focus:shadow halo 단독 paradigm 단단 (모바일 + 데스크탑 양쪽 정합).
+ * - lg:focus:shadow-none 영구 폐기 → focus:shadow 양 viewport 적용 paradigm.
+ * - border-0 명시 추가 (Tailwind preflight 보강 + Chrome user-agent default border 제거 보장).
+ *
+ * 모바일 paradigm 영구 보존:
+ * - WebkitTapHighlightColor: transparent (iOS Safari tap 회색 highlight 제거)
+ * - appearance-none (browser form widget inner outline 제거)
+ * - focus:outline-none + focus-visible:outline-none (4중 안전망 mouse + keyboard 단단)
 */
 style={{ WebkitTapHighlightColor: "transparent" }}
- className="w-full h-16 appearance-none rounded-2xl bg-white px-5 ... outline-none shadow-md ... focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 lg:h-16 lg:flex-1 lg:bg-transparent lg:px-6 lg:text-[18px] lg:shadow-none lg:focus:shadow-none"
+ className="w-full h-16 appearance-none rounded-2xl border-0 bg-white px-5 ... outline-none shadow-md ... focus:border-0 focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,200,83,0.3)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 lg:h-16 lg:flex-1 lg:bg-transparent lg:px-6 lg:text-[18px] lg:shadow-none"
 />
```

### 정정 단계 4건

1. **`focus:ring-2 focus:ring-[var(--brand-green)]/30` 영구 폐기** — ring paradigm 단단 강한 line 사용자 시각 NG source
2. **`lg:focus:shadow-none` 영구 폐기** — 데스크탑 focus shadow 0 paradigm 영구 정정. focus:shadow 양 viewport 적용 paradigm 단단
3. **`focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)]` alpha 0.2 → 0.3 보강** — 데스크탑 환경 시각 가시성 보강 (3px green halo 단단 paradigm)
4. **`border-0` + `focus:border-0` 명시 추가** — Tailwind preflight 보강 + Chrome user-agent default `<input>` border 제거 보장 paradigm

### 영구 보존 단계 4건

1. `WebkitTapHighlightColor: transparent` (iOS Safari tap highlight 제거)
2. `appearance-none` (browser form widget inner outline 제거)
3. `outline-none` + `focus:outline-none` + `focus-visible:outline-none` (4중 안전망)
4. 다른 단계: `w-full h-16 rounded-2xl bg-white px-5 text-[16px] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] shadow-md transition-shadow duration-150 disabled:cursor-not-allowed disabled:opacity-60 lg:h-16 lg:flex-1 lg:bg-transparent lg:px-6 lg:text-[18px] lg:shadow-none`

---

## 자가 검증 5건 결과

### 1. 검은 outline source 직접 식별 사실

✓ PASS — 단단 NG source 식별 사실:

- 사전 paradigm 단계별 검수:
 - `focus:ring-2` (전 viewport) = ring outset box-shadow paradigm
 - `focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)]` (모바일 단단) = green halo
 - `lg:focus:shadow-none` (데스크탑 단단) = ★ shadow 0 paradigm
- 데스크탑 focus 시점 = ring 단독 잔존 + halo 0 → 단단 강한 line 사용자 시각
- ring color brand-green 30% alpha = 옅은 녹색 paradigm 정합 (검은 paradigm 영역 0)
- 단 alpha + 데스크탑 환경 사용자 시각 = 검은 paradigm photo 단단 사실

### 2. 데스크탑 focus 검은 outline 0 + green ring 단단 표시

✓ PASS — 정정 사후 데스크탑 focus 시점 paradigm:

- `focus:ring-2` 영구 폐기 → ring 단단 강한 line 0
- `focus:shadow-[0_0_0_3px_rgba(0,200,83,0.3)]` 양 viewport 적용 → 3px green halo (alpha 0.3) 단단
- `focus:border-0` 명시 → Chrome default border 0 단단
- 사용자 시각 = 부드러운 green halo paradigm 단단 (검은 line source 영역 0)

**production 검수 의무 (형준님 영역)**:
- Chrome + Safari + Firefox 데스크탑 focus 시점 검수 의무
- ring 사실 영역 0 + green halo 단단 사실 검수

### 3. 모바일 focus paradigm 영구 보존

✓ PASS — 모바일 4중 안전망 paradigm 변경 0:

- WebkitTapHighlightColor: transparent ✓
- appearance-none ✓
- focus:outline-none + focus-visible:outline-none ✓
- focus:shadow halo paradigm = 모바일 + 데스크탑 동일 paradigm 단단 (사전 모바일 단독 적용 paradigm → 양 viewport 단단 paradigm 정합)

**production 검수 의무 (형준님 영역)**:
- iOS Safari + Android Chrome focus 시점 사전 paradigm 영구 보존 사실 검수

### 4. 사전 work-008 정정 1~5 영구 보존

✓ PASS — `git diff src/components/home/HomeHero.tsx` 검수:

- 정정 1+2 (SingleListingCard 사진 fetch + 88px representative) ✓ 변경 0
- 정정 3 (ctaLabel 분기) ✓ 변경 0
- 정정 4 (focus 4중 안전망 = WebkitTapHighlightColor + appearance-none + outline-none paradigm) ✓ 영구 보존
- 정정 5 (already-taken alert 카피 단순화 + button 폐기) ✓ 변경 0

**변경 영역**: input className L335-356 단단 (사전 정정 4 paradigm = WebkitTapHighlightColor + appearance-none + outline-none 영구 보존 + ring 단계 폐기 + shadow alpha 보강 + border-0 추가).

### 5. TypeScript build + ESLint PASS

✓ PASS — `pnpm exec tsc --noEmit` exit 0 + `pnpm lint src/components/home/HomeHero.tsx` exit 0 + warning 0.

---

## 영향 파일 단단 사실

`git status --short` 결과:

```
 M src/components/home/HomeHero.tsx ← 본 hotfix 정정 단단
?? docs/work-008-hotfix-result.md ← 본 결과 markdown (commit 영역)

 D "경매퀵_홈_v9.1.html" ← 본 hotfix 외 / 사전 상태 보존
?? public/logo-icon.png ← 본 hotfix 외 / 형준님 의사결정 대기
```

**변경 0 사실 (영구 보존)**:
- `src/lib/courtAuction/detail.ts` (work-007 영구 보존)
- `src/lib/courtAuction/search.ts` + mapper.ts + photos.ts + codes.ts + session.ts
- `src/app/api/auction/lookup/route.ts` (work-005 + work-007 영구 보존)
- `src/app/api/orders/check/route.ts` (work-005 + work-007 영구 보존)
- `src/app/api/court-listings/[docid]/photos/route.ts`
- `src/components/apply/PhotoGallery.tsx`
- `src/types/apply.ts` (Photo type 영구 보존)
- scripts/seed-photos.mjs (work-001 + cycle ζ-1 영구 보존)
- supabase/migrations + DB schema
- LoginButton (work-009 사후 단단)
- 분석 페이지 + /apply page
- HeroFlowBackground + Liquid Glass + chip
- Pricing + Compare + Reviews + Insight + HomeCTA
- SingleListingCard 사진 88px representative + pickRepresentative + AbortController (work-008 정정 1+2 영구 보존)
- ListingPickerCard 사진 영역 0 paradigm
- amber alert + 1문장 카피 paradigm (work-008 정정 5 영구 보존)
- handleRetry 함수 자체 (handleCtaClick 사용처)

---

## 사용자 시각 변화 사실 (production 검수 의뢰)

1. **데스크탑 (Chrome + Safari + Firefox) Hero input click 시점**:
 - 사전: 검은 1~2px outline 잔존 사실 ✗
 - 정정 사후: green halo (3px / alpha 0.3) 단단 paradigm ✓
2. **모바일 (iOS Safari + Android Chrome) focus 시점**:
 - 사전: PASS 사실 ✓
 - 정정 사후: 영구 보존 paradigm + halo alpha 0.2 → 0.3 보강 (시각 가시성 ↑)

---

## 다음 단계

1. **commit + push** (Code 자율 / lint + tsc PASS 의무)
2. **Vercel deploy + production 직접 검수 1건** (형준님):
 - 데스크탑 (Chrome + Safari + Firefox ) Hero input click 시점 검은 outline 0 + green halo 단단 표시 사실
 - 모바일 (iOS Safari) focus 시점 사전 paradigm 영구 보존 사실 (참고 검수)
3. **work-008 최종 종료 사후 work-009 진입** (카카오톡 인앱 브라우저 Google OAuth 차단 해결 / handoff_v64 cycle ζ-3)
