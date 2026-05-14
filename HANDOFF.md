# 경매퀵 웹사이트 핸드오프 문서

> **용도**: 다음 세션 진입 시 본 문서 단일 진입점 paradigm. 본 문서 안 사실 + CLAUDE.md 영구 룰 양측 합쳐서 단일 컨텍스트 영역.
> **최종 업데이트**: 2026-05-14 (work-008 ~ work-011 통합 종료 / Hero 사진 폐기 + 검은 테두리 정정 + /insight 카드 후보 5 + chip 폐기 완료)
> **현재 빌드 상태**: HEAD = `dce068e` (work-011: /insight 카드 후보 5 Premium Editorial++ + chip 폐기 통합)
> **production URL**: https://auctionsystem-green.vercel.app
> **다음 세션 진입 트리거**: **클로드 채팅 요구서 전달 사전 paradigm 단단** — 사용자 직접 의뢰 우선 진입 + work-012 (/faq 정정) + work-013 (/about 정정) 잠재 paradigm 영구 보존
> **함께 읽을 문서**: `CLAUDE.md` (사업 본질 + 영구 룰) + 본 HANDOFF.md (work history + 진입 트리거)

---

## 🔥 핫 스냅샷 — 다음 세션 시작 시 여기부터

### 다음 세션 진입 단단 paradigm

**1순위 = 클로드 채팅 요구서 전달 사전 paradigm**:
- 사용자 직접 명시 = "다음 세션에서는 클로드 채팅에서 요구서를 전달해줄거야. 그것부터 시작하자."
- 진입 단단 = 요구서 회수 사후 본 핸드오프 컨텍스트 단단 활용 paradigm
- 잠재 영역 = work-012 (/faq) 또는 work-013 (/about) 또는 신규 paradigm (요구서 의도 사실 단단)

**2순위 = work-012 + work-013 잠재 paradigm 영구 보존**:
- work-012 = /faq 페이지 정정 (sentiment + 항목 검수 + 검색 기능 검토 사전 의뢰 사실)
- work-013 = /about 페이지 정정 (5 섹션 외관 + 카피 sentiment + 사업 사실 정합)
- Cowork chat 분리 paradigm = 콘텐츠 풍성 + /data + /glossary chip 회복 검토 (별개 진입)

### 본 세션 핵심 paradigm 변경 사실 (work-001 ~ work-011 통합)

**1. `work-NNN` sequential paradigm 영구 채택** (2026-05-13 형준님 명시):
- 파일명 = `work_NNN_정정.md` + `work_NNN_사전조사.md` + `work-NNN-result.md`
- handoff + commit message + comment 안 paradigm 정합 의무

**2. "광역" 단어 회신문/commit/comment 안 엄격 금지** (2026-05-13 형준님 명시):
- 무의미 chain 누적 오류 사실 식별 → 영구 룰 채택
- 대체 어휘 = "전체" / "전반" / "양측" / "각" / "사이트 전체" / "통합" / "단계" 등 의미 정확 단어
- 자가 검증 의무 = 회신 산출 사전 `grep "광역"` 0건 정합

**3. directive 핵심 원칙** (work-007 명시):
- 대법원 = 진실의 원천 / 우리 DB = 24h 캐시 단독
- 우리 DB만 보고 not_found 회신 paradigm 절대 금지
- work-007 detail.ts paradigm 단단 = SEARCH_ENDPOINT (2주 윈도우 제약) → DETAIL_ENDPOINT 함수 교체

**4. §A-1 production 무비판 수용 NG** (work-009/010 학습):
- Code 자가 검증 단독 의존 NG / production 직접 시각 확인 의무

**5. §A-15 신규 production 시각 검증 사전 채택 NG** (work-009/010 학습):
- 시각 변경 paradigm = production deploy 사후 검수 의무
- screenshot 정적 image 한계 사실 단단 (cubic-bezier + brightness filter + dynamic motion 약함)

**6. §A-23 Opus 추측 NG / Code 사실 파악 사후 진입** (work-007 ~ work-011 일관)

### 본 세션 진행 history (work-001 ~ work-011)

| work | 의도 | commit | 상태 |
|---|---|---|---|
| work-001 | seed-photos 22 row cleanup + script INSERT 단계 폐기 | `fcb6f71` + `7108681` | ✅ |
| work-002 | Hero NG 3건 (button + input + photos) | `d5a38f6` | ✅ |
| work-003 | Hero 정정 통합 (Card image 폐기) | `8331877` | ✅ |
| work-004 | Hero 시각 정정 (모바일 SVG + Liquid Glass + chip) | `44441fb` | ✅ |
| work-005 | 사건 조회 NG + 회차 분기 (1물건 1고객 race 회피 4단계) | `cfdfaf0` | ✅ |
| work-006 | 카카오톡 전체 폐기 + /contact 목업 연락처 | `6676de5` | ✅ |
| **work-007** | **fetchSingleCase → fetchCaseDetail 함수 교체 (detail endpoint)** | `8a04de3` | ✅ |
| **work-008** | **사진 비동기 fetch + UX 개선 3건 (ctaLabel + focus outline + already-taken)** | `3d03668` | ✅ |
| **work-008 hotfix** | **데스크탑 input focus 검은 outline 제거 (정정 6)** | `c3c91ce` | ✅ |
| **work-009** | **HomeHero input wrapper 검은 외곽 제거 (shadow-md 폐기)** | `ecb1d09` | ✅ |
| **work-010** | **데스크탑 검은 테두리 정정 + 사진 영역 폐기** | `1062497` | ✅ |
| **work-011** | **/insight 카드 후보 5 Premium Editorial++ + chip 폐기 통합** | `dce068e` | ✅ |

---

## 📂 work-011 사실 정합 (최신 / 2026-05-14)

### 정정 7건

| # | 영역 | paradigm |
|---|---|---|
| 1+2+3 | 카드 hover (Editor's Pick + rest 동일) | framer motion 4 variants (cardVariants + imageVariants + titleVariants + arrowVariants) |
| 1+2+3 | Premium Editorial++ 외관 | lift -4 + 2-layer shadow (brand-green 8% + dark 8%) + 사진 scale 1.05 + brightness 1.05 + title underline brand-green 60% + ArrowRight CTA translateX(4) + opacity 0.45 → 1 |
| 1+2+3 | transition | cubic-bezier(0.16, 1, 0.3, 1) Vercel ease-out-expo + duration 400ms |
| 4 | 모바일 sticky :hover 회피 | framer motion variants 단독 paradigm + whileTap scale 0.98 |
| 5+6 | chip 폐기 | CHIPS 5건 → 3건 (전체 + 무료 물건분석 + 경매 가이드) / filterPosts glossary 흡수 분기 영구 폐기 |
| 7 | map 보존 | CATEGORY_BG_MAP + CATEGORY_LABEL_MAP 4 카테고리 영구 보존 (post.chip 매칭 fallback paradigm) |

### 사전 조사 3회 paradigm

- `docs/work-011-research.md` = 페이지 사실 + 추천 옵션
- `docs/work-011-research-2.md` = 메모리 ↔ 사실 식별 + screenshot 6 image
- `docs/work-011-research-3.md` = 창의 후보 5건 + screenshot 8 image (후보 1+3+4+5 / 후보 2 = static NG)

### 영향 파일

- 수정: `src/components/home/InsightHubLayout.tsx` (+132 / -35 net)
- 신규: `docs/work-011-result.md` + 사전 조사 3건 + `scripts/diagnostics/screenshot-insight-{hover,side-by-side,candidates}.mjs`

### 영구 보존

- /api/court-listings/[docid]/photos endpoint
- photos.ts component
- next.config.ts redirect 5건 (/news + /glossary + /data + /analysis + /guide → /insight 308)
- /faq + /about 페이지 (work-012 + work-013 분리 사실)

---

## 📂 work-010 사실 정합

### 정정 3건

| # | 영역 | paradigm |
|---|---|---|
| 1 | 데스크탑 검은 테두리 source | form `lg:rounded-2xl lg:bg-white lg:p-1.5` wrapper paradigm 영구 폐기 + input `lg:bg-transparent` 폐기 → input bg-white 양 viewport 동일 |
| 2 | SingleListingCard 사진 영역 영구 폐기 | useEffect + AbortController + fetch + pickRepresentative + img + ImageOff fallback 영구 폐기 (work-008 정정 1+2 paradigm 폐기 전환) |
| 3 | 텍스트 단독 카드 layout | grid-cols-[88px_1fr] 폐기 → flex flex-col gap-2 + 4-grid gap-x-6/gap-y-3 |

### import 정리

- useEffect + ImageOff + Photo type 폐기 (사용처 0)

### 영구 보존

- photos.ts + /api/court-listings/[docid]/photos route + scripts/seed-photos.mjs + PhotoGallery (분석 페이지) + court_listings.photos JSONB + LISTING_SELECT photos + Photo type export

---

## 📂 work-009 사실 정합

### 정정 3건 (HomeHero input wrapper 검은 외곽 제거)

- input `shadow-md` 영구 폐기 (양 viewport 검은 외곽 단단 source)
- input `lg:shadow-none` 영구 폐기 (cleanup)
- form `lg:shadow-md` 영구 폐기 (데스크탑 form parent 검은 shadow source)

### NG source 단단 식별

- `shadow-md` Tailwind paradigm = `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` = 검은 4-10px spread paradigm
- 사용자 photo 검은 외곽 ~10-15px source 단단

### 영구 보존

- transition-shadow duration-150 + focus:shadow halo green paradigm (work-008 hotfix) + 4중 안전망 + Liquid Glass 박스 자체 shadow paradigm (L295 inset + 24px/60px outer)

---

## 📂 work-008 + hotfix 사실 정합

### 정정 5건 (work-008 / commit `3d03668`)

| # | 영역 | paradigm |
|---|---|---|
| 1+2 | SingleListingCard 사진 비동기 fetch + 88px representative | useEffect + AbortController + pickRepresentative + img 88px object-cover + ImageOff fallback (PhotoGallery 동등 paradigm) — **work-010 영구 폐기 사실** |
| 3 | ctaLabel 분기 | 사전 carrier 영구 보존 (변경 0) — idle "조회하기" / loading "조회 중..." / active "신청하기" / error "다시 조회하기" |
| 4 | input focus 검은 outline 제거 | WebkitTapHighlightColor + appearance-none + focus:outline-none + focus-visible:outline-none 4중 안전망 |
| 5 | already-taken alert | 카피 1문장 단독 "이미 다른 고객이 신청 중인 사건입니다." + "다른 사건 검색" button 폐기 + amber + AlertTriangle + work-005 정정 3 분기 영구 보존 |

### 정정 6 (hotfix / commit `c3c91ce`)

- focus:ring-2 영구 폐기 → focus:shadow halo 단독 paradigm (양 viewport 정합)
- lg:focus:shadow-none 영구 폐기 → focus:shadow 양 viewport 적용
- focus:shadow alpha 0.2 → 0.3 보강 (데스크탑 가시성 ↑)
- border-0 + focus:border-0 명시 추가 (Tailwind preflight 보강 + Chrome user-agent default border 제거)

### 영구 보존

- 모바일 4중 안전망 (WebkitTapHighlightColor + appearance-none + outline-none + focus:outline-none + focus-visible:outline-none)

---

## 📂 work-007 사실 정합 (fetchSingleCase → fetchCaseDetail 함수 교체)

### 정정 3건 (commit `8a04de3` / +2003 / -20 net)

| # | 영역 | paradigm |
|---|---|---|
| 1 | `src/lib/courtAuction/detail.ts` 신규 module 신설 (525 lines) | callDetail + mapDetailToRow + fetchCaseDetail / 변환 4건 (docid 생성 + area_m2 정규식 + next_min_bid 파생 + usage_name 키워드 매칭) |
| 2 | `src/app/api/auction/lookup/route.ts` 함수 교체 | import + 호출 1건 / 다른 흐름 변경 0 |
| 3 | `src/app/api/orders/check/route.ts` 함수 교체 | 정정 2 동등 paradigm |

### 핵심 paradigm

- DETAIL_ENDPOINT (`/pgj/pgj15B/selectAuctnCsSrchRslt.on`) = 매각일 2주 윈도우 제약 무관 사건 detail 회수
- session.ts paradigm 100% 재사용 정합 (search API + detail API 동일 session)
- 좌표 NULL 보존 (stXcrd 좌표계 미확정 + search 응답 wgs84 정수 truncate 신뢰도 0)
- photos 3 column 영구 제외 paradigm 보존 (work-002 정정 6 영구 보존)

### dev IP 검증 사실

- 532249 (윈도우 밖 / 매각일 2026-06-29 / 47일 후) + 559336 + 540431 records=1 정합

---

## 📂 work-005 사실 정합 — 1물건 1고객 race 회피 4단계 paradigm 완성

### 4단계 paradigm

1. Hero 사건 조회 시점 (1차 단계) = `/api/auction/lookup` 안 `is_case_active` RPC already_taken 회신
2. Step1Property 진입 시점 (2차 단계) = `/api/orders/check` 안 round 명시 + `is_case_active` RPC 호출
3. Step5Payment 진입 시점 (3차 단계) = `handlePreSubmitCheck` race 회피 (raceChecking + raceBlocked state)
4. DB 단계 (4차 단계) = `orders_unique_active_case_round` unique constraint

### closedStale 분기 영구 폐기 paradigm (work-005 정정 1)

- 사전 paradigm = stale closed row (24h ) + records 0 → closedStale 분기 (잘못된 사실)
- 신규 paradigm = stale closed row + records 0 → not_found 단독 회신
- 정상 종결 사건 단일 source = closedFresh (within 24h closed) → closed 단독

### LookupStatus 10 status paradigm

`idle` + `loading` + `active-single` + `active-multi` + `closed` + `not-found` + `invalid` + `error` + `fetch-failed` + `already-taken` 분기 (Hero 단독)

---

## 📂 work-006 사실 정합 — 카카오톡 전체 폐기

### 폐기 사실

- Code link 4건 + 텍스트 6개소 + 컴포넌트 1건 (KakaoNotifyButton) + config 2건
- /contact 페이지 신규 paradigm = 전화 + 이메일 2 카드 (목업 연락처)

### 보존 사실

- LoginButton Kakao OAuth DISABLED 보존 (사후 작업 검토 영역)
- 카카오톡 채널 운영 방식 영구 폐기 (향후 유선·이메일·신규 채널 paradigm)

---

## 📂 work-001 ~ work-004 사실 정합 (Hero + photos paradigm)

### work-001 (seed-photos cleanup)

- DB 22 row cleanup (Supabase MCP 직접 실행)
- scripts/seed-photos.mjs INSERT 단계 영구 폐기 (--docid 단독 paradigm)
- lookup + orders/check safety check (court_name '(seed-photos)' 차단)

### work-002 (Hero NG 3건)

- button click feedback + input spellCheck/focus + photos paradigm
- mapper.ts photos NULL hardcoded 폐기 paradigm (정정 6)
- LISTING_SELECT photos + photos_count 추가 (정정 7)
- Photo type + CourtListingSummary.photos 추가 (정정 8)

### work-003 (Hero 정정 통합)

- Card image render 분기 폐기 (정정 9 / work-008 영구 부활 사후 work-010 단단 영구 폐기)

### work-004 (Hero 시각 정정)

- HeroFlowBackgroundDesktop + HeroFlowBackgroundMobile 분리
- Liquid Glass 약화 (alpha + blur + border + shadow 약화)
- chip 데스크탑 회복 + Hero h1 강조 paradigm

---

## 🔧 영구 룰 + 보존 paradigm

### 사업 핵심 가치 (CLAUDE.md 영구 정합)

- **투자자의 시간적·물리적 병목 해소** 단독
- 차별화 축 = 신속 + 신뢰 + 경제적 (가격 메인 강조 NG)
- 폐기 어휘 영구 = "카톡" 메인 노출 + "5만원" 큰 숫자 강조 + "박형준" 개인 색 + 사진·자격증·등록증 메인 노출

### 신규 영구 룰 (본 세션 채택 통합)

1. **work-NNN sequential paradigm** (cycle/그리스 문자/sub-cycle 영구 폐기 / 2026-05-13)
2. **"광역" 단어 회신문/commit/comment 엄격 금지** (2026-05-13)
3. **카카오톡 채널 운영 방식 영구 폐기** (work-006)
4. **directive 핵심 원칙** = 대법원 official 단독 (work-007)
5. **detail endpoint 단단** = SEARCH_ENDPOINT 2주 윈도우 제약 회피 paradigm (work-007)
6. **Hero 사진 영역 영구 폐기** (work-010 / fetch duration NG + 시각 NG)
7. **§A-1 production 무비판 수용 NG** (work-009/010 학습)
8. **§A-15 신규 production 시각 검증 사전 채택 NG** (work-009/010)
9. **§A-23 Opus 추측 NG / Code 사실 파악 사후 진입** (work-007 ~ work-011 일관)
10. **신규 npm 영구 0** (motion + lucide-react + NumberFlow + sharp + @google/genai + playwright 단독)

### CLAUDE.md 영구 룰 §1 ~ §A-26 정합 보존

- §1: 신규 npm 0
- §8: yellow 색감 = 마침표 + 강조 단어 단독 (Hero h1 yellow 마침표)
- §9: red 색감 = 가격 한정 + required + error (정보 영역 NG)
- §13 룰 33 #1: focus-visible 의무 (input focus halo green paradigm 정합)
- §13 룰 33 #6: Next/Image 사용 의무 (Hero Card = 사진 영역 폐기 / Editor's Pick + rest 카드 = inline-style backgroundImage paradigm 보존)
- §29: 토큰 단독 사용
- §31: 모달 분류 (강제 vs 정보)
- §32: 합니다체 단독

### 영구 보존 paradigm (work-001 ~ work-011 통합)

#### Hero 영역 (HomeHero.tsx)
- h1 카피 SoT "법원에 가지 않고, / 경매를 시작하세요." + 강조 (green 본문 + yellow 마침표)
- subtitle "사건번호만 주시면, 법원은 저희가 갑니다."
- HeroFlowBackgroundDesktop + HeroFlowBackgroundMobile 분리
- Liquid Glass 약화 (L294-296 inset + 24px/60px outer)
- chip 2건 (Building2 + FileText / 법원 방문 없음 + 서류 비대면)
- input 4중 안전망 (WebkitTapHighlightColor + appearance-none + outline-none + focus:outline-none + focus-visible:outline-none) + focus halo green paradigm + border-0
- form wrapper paradigm 영구 폐기 (work-010)
- SingleListingCard 사진 영역 영구 폐기 (work-010) + 텍스트 단독 4-grid paradigm
- already-taken alert 1문장 카피 + button 폐기 (work-008 정정 5)
- LookupStatus 10 status paradigm
- ctaLabel 4 분기 (idle/loading/hasResult/hasError)

#### /insight Hub (InsightHubLayout.tsx / work-011)
- Premium Editorial++ paradigm (4 framer motion variants)
- Editor's Pick + rest 카드 동일 paradigm
- ArrowRight CTA (Editor's Pick "자세히 보기 →" + rest size 14 icon)
- chip 3건 (전체 + 무료 물건분석 + 경매 가이드)
- 모바일 sticky :hover 회피 + whileTap

#### 사건 조회 API
- /api/auction/lookup = GET / 비로그인 / detail endpoint fetch (work-007)
- /api/orders/check = POST / 로그인 의무 / detail endpoint fetch (work-007)
- closedStale 분기 영구 폐기 (work-005)
- already_taken RPC 호출 paradigm

#### /apply Step
- Step1Property auctionRound POST body 명시 (work-005 정정 4)
- Step5Payment handlePreSubmitCheck race 회피 (work-005 정정 5)

#### 대법원 fetch
- detail.ts = callDetail + mapDetailToRow + fetchCaseDetail (work-007)
- session.ts = STEP1 GET / + STEP2 GET /pgj/index.on
- search.ts = fetchSingleCase 영구 보존 (photos.ts + scripts/seed-photos.mjs 사용처)
- photos.ts = fetchAndCachePhotos (분석 페이지 PhotoGallery 사용)
- mapper.ts photos 3 column 영구 제외
- court_listings DB photos JSONB + court-photos Storage bucket
- next.config.ts redirect 5건 (/news + /glossary + /data + /analysis + /guide → /insight 308)

---

## 📁 핵심 파일 + 컴포넌트 영역

### Hero + 메인 8 섹션 (`src/components/home/`)

- `HomeHero.tsx` (work-010 최종 paradigm = 사진 영역 폐기 + 텍스트 단독 카드 + form wrapper 폐기)
- `HomeProcess.tsx`
- `HomeCompare.tsx`
- `HomePricing.tsx`
- `HomeScope.tsx`
- `HomeReviews.tsx` + `ReviewsMarquee.tsx` (사전 main lint error 1건 잔존 / 본 세션 외)
- `HomeInsight.tsx` (홈 페이지 /insight 섹션 / grayscale paradigm 영구 보존 / aspect-[4/1] split)
- `HomeCTA.tsx` (TrustCTA / Liquid Glass 약화 정합)
- `InsightHubLayout.tsx` (/insight Hub / work-011 최종 paradigm)

### 사건 조회 API (`src/app/api/`)

- `auction/lookup/route.ts` = GET / 비로그인 / detail endpoint fetch (work-007)
- `orders/check/route.ts` = POST / 로그인 의무 / detail endpoint fetch (work-007)
- `court-listings/[docid]/photos/route.ts` = 사진 fetch (분석 페이지 PhotoGallery 사용 / Hero 영역 0)

### 대법원 fetch (`src/lib/courtAuction/`)

- `detail.ts` = `callDetail` + `mapDetailToRow` + `fetchCaseDetail` (work-007 신규)
- `search.ts` = `fetchSingleCase` (photos.ts + scripts/seed-photos.mjs 사용 보존)
- `session.ts` = WMONID + JSESSIONID 발급
- `mapper.ts` = `mapRecordToRow` / photos 3 column 영구 제외 / is_active hardcoded true
- `codes.ts` = endpoint 상수 + SEARCH/DETAIL PGM_ID + USER_AGENT
- `photos.ts` = `fetchAndCachePhotos` (분석 페이지 PhotoGallery 사용)

### /apply Step (`src/components/apply/steps/`)

- `Step1Property.tsx` = caseTaken state + matchedListing prefill + auctionRound POST body 명시
- `Step2BidInfo.tsx`
- `Step3Documents.tsx`
- `Step4Confirm.tsx` (서명 + 위임 계약)
- `Step5Payment.tsx` = handlePreSubmitCheck (race 회피 3차 단계)
- `Step5Complete.tsx`

### Type 정의

- `src/types/apply.ts` = `Photo` type + `CourtListingSummary.photos` + `photos_count` 영구 보존

### Config + DB

- `src/lib/constants.ts` = FEES + BRAND_NAME + AGENT_INFO + PRIVACY_CONTACT + MOCKUP_SUPPORT_EMAIL + MOCKUP_SUPPORT_PHONE (COMPANY.kakaoChannelUrl 영구 폐기)
- `supabase/schema.sql` = is_case_active(case_no, round_no) + orders_unique_active_case_round + court_listings (photos JSONB)
- `next.config.ts` = redirect 5건 (/news + /glossary + /data + /analysis + /guide → /insight 308)

### /contact + 분석 page

- `src/app/contact/page.tsx` = 전화 + 이메일 2 카드 paradigm
- `src/components/analysis/ApplyCTA.tsx` = "문의하기" 단독
- `src/components/analysis/DetailSidebar.tsx` = "문의하기" 단독
- `src/components/apply/PhotoGallery.tsx` = 사진 fetch (분석 페이지 단독 / async client paradigm)

### 영역 외 보존

- `src/components/admin/` (KakaoNotifyButton 파일 삭제 사실 / 그 외 영구 보존)
- `src/components/auth/LoginButton.tsx` (Kakao OAuth DISABLED 보존)

### 진단 script (scripts/diagnostics/)

- `probe-detail-endpoint.mjs` (work-007 사전 조사)
- `probe-detail-fields.mjs` (work-007 사전 조사)
- `probe-search-record.mjs` (work-007 사전 조사)
- `probe-fetchCaseDetail.ts` (work-007 검증)
- `probe-csPicLst-element.mjs` (work-008 사전 조사)
- `screenshot-insight-hover.mjs` (work-011 1차 산출)
- `screenshot-insight-side-by-side.mjs` (work-011 2차 산출)
- `screenshot-insight-candidates.mjs` (work-011 3차 산출 / Playwright)

---

## 🚀 다음 세션 진입 순서 추천

### 1순위: 클로드 채팅 요구서 회수 + 진입

- 사용자 직접 명시 = "다음 세션에서는 클로드 채팅에서 요구서를 전달해줄거야. 그것부터 시작하자."
- 요구서 의도 사실 단단 회수 사후 진입 paradigm 결정
- 본 핸드오프 컨텍스트 단단 활용

### 2순위 (잠재): work-012 — /faq 페이지 정정

- 사전 풀 구현 사실 (5 카테고리 × 19 항목 + PageHero + JSON-LD + Bottom CTA)
- 잠재 정정 영역:
 - 카피 sentiment 검수 (담백 + 사실 + 숫자 / AI 슬롭 NG)
 - 항목 누락 검수 (사용자 의도 추가 사실)
 - 검색 기능 추가 검토 (19 항목 단단)
 - 외관 톤 정합 (앱스타일 + 프로 디자이너 차용)

### 3순위 (잠재): work-013 — /about 페이지 정정

- 사전 풀 구현 사실 (5 섹션 + AboutPageClient + 자체 SVG)
- 잠재 정정 영역:
 - 5 섹션 외관 정합 검수 (현 코드 직접 검수 의무)
 - 카피 sentiment 검수
 - 사업 사실 정합 검수 (수수료 5/7/10만 + 낙찰 성공보수 5만 + 패찰 시 보증금 전액 반환)
 - 사진 / SVG 외관 정합

### 4순위: Cowork chat 분리 (별개 진입)

- 콘텐츠 풍성 paradigm (analysis + guide + data + glossary mdx 추가)
- /data + /glossary chip 회복 검토 (콘텐츠 추가 사후 별개 work)

### 5순위 (기술부채): 별개 work paradigm

- mapper.ts is_active hardcoded → 동적 매핑 검수 (`r.mulJinYn === "Y"` paradigm)
- ReviewsMarquee.tsx L66 사전 main lint error 1건 정리
- Lighthouse 측정 재개 (Phase 9 의도)
- 카카오톡 인앱 브라우저 Google OAuth 차단 해결 (LoginButton DISABLED 사실 회수 검토)

---

## 🗂 사전 cycle → work 명명 mapping history

| 사전 cycle 명명 | 신규 work 매핑 | 의도 |
|---|---|---|
| cycle 1-G-γ-α-ζ-1 | work-001 | seed-photos cleanup |
| cycle 1-G-γ-α-η | work-002 | Hero NG 3건 |
| cycle 1-G-γ-α-θ | work-003 | Hero 통합 정정 |
| cycle 1-G-γ-α-ι-1 | work-004 | Hero 시각 정정 |
| cycle 1-G-γ-α-ι-2 | work-005 | 사건 조회 NG + 회차 분기 |
| (사전 cycle 없음) | work-006 | 카카오톡 폐기 + /contact |
| (사전 cycle 없음) | work-007 | detail endpoint 함수 교체 |
| (사전 cycle 없음) | work-008 | 사진 fetch + UX 3건 + hotfix |
| (사전 cycle 없음) | work-009 | HomeHero shadow-md 폐기 |
| (사전 cycle 없음) | work-010 | Hero 사진 영역 폐기 + 검은 테두리 정정 |
| (사전 cycle 없음) | work-011 | /insight 후보 5 + chip 폐기 |

사후 paradigm = **work-NNN sequential 단독**.

---

## 📝 자가 검증 paradigm (다음 세션 진입 사전 의무)

| # | 검증 | 도구 |
|---|---|---|
| 1 | TypeScript 0 error | `pnpm exec tsc --noEmit` |
| 2 | lint 신규 0 (ReviewsMarquee 사전 1 error 영구 보존) | `pnpm lint` |
| 3 | production endpoint 직접 호출 | `curl https://auctionsystem-green.vercel.app/api/auction/lookup?caseNumber=...` |
| 4 | 회신문 "광역" 어휘 0건 | `grep "광역" <회신 markdown>` |
| 5 | §32 합니다체 grep | `grep "예요\|돼요\|해요" src/components/` |
| 6 | 카카오톡 link/button 0건 검수 | `git grep "kakao\|카카오톡\|MessageCircle"` (LoginButton DISABLED + comment 단독 잔존 허용) |
| 7 | photos endpoint Hero 사용 0 검수 (work-010 사후) | `grep "court-listings.*photos" src/components/home/` |

---

## 📝 명문화 source 영역

- `CLAUDE.md` = 사업 본질 + 영구 룰 + Phase 설계 + cycle/work 단계 명문화
- `HANDOFF.md` = 본 문서 (다음 세션 진입 컨텍스트 단독)
- `docs/roadmap.md` = Phase 7~10 + v2 패키지
- `docs/content-source-v2.md` = Cowork 원천 자료 규격
- `docs/work-NNN-*.md` = work 단위 사전 조사 + 결과 markdown 영구 보존
- `~/.claude/projects/-Users-parkhj-Projects-website/memory/MEMORY.md` = 형준님 영구 feedback (존댓말 + "광역" 단어 금지)

---

## 🔗 commit history (본 세션 전체 / work-001 ~ work-011)

```
dce068e work-011: /insight 카드 후보 5 Premium Editorial++ + chip 폐기 통합
1062497 work-010: 데스크탑 검은 테두리 정정 + 사진 영역 폐기
ecb1d09 work-009: HomeHero input wrapper 검은 외곽 제거
c3c91ce work-008 hotfix: 데스크탑 input focus 검은 outline 제거 (정정 6)
3d03668 work-008: SingleListingCard 사진 비동기 fetch + UX 개선 3건
8a04de3 work-007: fetchSingleCase → fetchCaseDetail 함수 교체 (대법원 detail endpoint 활용)
becb790 HANDOFF.md 갱신: work-001 ~ 007 통합 + work paradigm 영구 채택
6676de5 work-006: 카카오톡 전체 폐기 + /contact 목업 연락처 대체
cfdfaf0 work-005: 사건 조회 NG + 회차 분기 paradigm (1물건 1고객 race 회피 4단계)
44441fb cycle 1-G-γ-α-ι-1: Hero 시각 정정 3건 (모바일 SVG + Liquid Glass + chip) ← work-004
8331877 cycle 1-G-γ-α-θ: Hero 정정 통합 (η 정정 9 폐기 + 추가 정정 5건) ← work-003
d5a38f6 cycle 1-G-γ-α-η: Hero NG 3건 통합 정정 (button + input + photos) ← work-002
7108681 cycle 1-G-γ-α-ζ-1 정정 6+7: lookup + orders/check safety check 추가 ← work-001
fcb6f71 cycle 1-G-γ-α-ζ-1 정정 5: scripts/seed-photos.mjs INSERT 단계 영구 폐기 ← work-001
```

---

## 🔥 핵심 영구 단단 사실 (다음 세션 진입 시 의식 의무)

1. **클로드 채팅 요구서 우선 paradigm** = 다음 세션 진입 단단 trigger
2. **work-011 종료 사실** = HEAD `dce068e` / production deploy 사후 형준님 검수 의무 (정적 image NG / 사용자 직접 hover 확인)
3. **work-012 + work-013 잠재 paradigm 영구 보존** (/faq + /about 정정 사전 의뢰 사실)
4. **분석 페이지 + /apply + Hero + Pricing + Compare + Reviews + HomeCTA + TopNav 영구 변경 0** (§A-24 예외 단독)
5. **detail endpoint paradigm** = 대법원 official 단독 source (우리 DB = 24h 캐시 / not_found 회신 시점 = DB only NG / detail endpoint fetch 의무)
6. **photos.ts + /api/court-listings/[docid]/photos route 영구 보존** = 분석 페이지 PhotoGallery 사용 / Hero 영역 0
7. **신규 npm 영구 0** (motion + lucide-react + NumberFlow + sharp + @google/genai + playwright 단독)
8. **회신문 "광역" 어휘 0 의무** (자가 검증 `grep "광역"` 0건 정합)
