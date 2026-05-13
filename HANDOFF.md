# 경매퀵 웹사이트 핸드오프 문서

> **용도**: 다음 세션 진입 시 본 문서 단일 진입점 paradigm. 본 문서 안 사실 + CLAUDE.md 영구 룰 양측 합쳐서 단일 컨텍스트 영역.
> **최종 업데이트**: 2026-05-13 (work-007 사전 조사 종료 / 532249 사실 회수 완료 / 형준님 결정 의무 단계)
> **현재 빌드 상태**: HEAD = `6676de5` (work-006: 카카오톡 전체 폐기 + /contact 목업 연락처 대체)
> **production URL**: https://auctionsystem-green.vercel.app
> **다음 세션 진입 트리거**: **work-007 형준님 결정 회수** (532249 = 대법원 official 부재 사실 / 옵션 A 채택 추천 / 또는 추가 사실 검수 paradigm)
> **함께 읽을 문서**: `CLAUDE.md` (사업 본질 + 영구 룰) + 본 HANDOFF.md (work history + 진입 트리거)

---

## 🔥 핫 스냅샷 — 다음 세션 시작 시 여기부터

### 본 세션 핵심 paradigm 변경 사실

**1. cycle/그리스 문자/sub-cycle 명명 paradigm 영구 폐기 + `work-NNN` sequential paradigm 영구 채택** (2026-05-13 형준님 직접 명시):
- 파일명 = `work_NNN_정정.md` + `work_NNN_사전조사.md`
- handoff + commit message + comment 안 paradigm 정합 의무
- 사전 cycle history 보존 (history 추적 paradigm)

**2. "광역" 단어 회신문/commit/comment 안 엄격 금지** (2026-05-13 형준님 직접 명시):
- 무의미 chain 누적 오류 사실 식별 → 영구 룰 채택
- 대체 어휘 = "전체" / "전반" / "양측" / "각" / "사이트 전체" / "통합" / "단계" 등 의미 정확 단어
- 형준님 정정 송부 안 "광역" 사용 시점 = 인용 paradigm 정합 (Code 산출 회신 사용 금지)
- 자가 검증 의무 = 회신 산출 사전 `grep "광역"` 0건 정합

### 본 세션 진행 history (work-001 ~ work-007)

| work | 의도 | commit | 상태 |
|---|---|---|---|
| work-001 | seed-photos 22 row cleanup + script INSERT 단계 폐기 + lookup/orders-check safety check | `fcb6f71` + `7108681` | ✅ |
| work-002 | Hero NG 3건 (button click feedback + input spellCheck/focus + photos paradigm) | `d5a38f6` | ✅ |
| work-003 | Hero 정정 통합 (Card image render 폐기 + chip + 일러스트 + h1 강조 단계 통일) | `8331877` | ✅ |
| work-004 | Hero 시각 정정 (모바일 SVG 분리 + Liquid Glass 약화 + chip 데스크탑 회복) | `44441fb` | ✅ |
| work-005 | 사건 조회 NG + 회차 분기 (1물건 1고객 race 회피 4단계 paradigm 완성) | `cfdfaf0` | ✅ |
| work-006 | 카카오톡 전체 폐기 + /contact 목업 연락처 대체 | `6676de5` | ✅ |
| **work-007** | **사건 조회 NG 532249 사전 조사 (정정 진입 영역 0 / 형준님 결정 의무)** | — | ⏳ 결정 대기 |

---

## ⚠ 다음 세션 진입 우선 단계 — work-007 형준님 결정

### 사건 2024타경532249 사실 정합

| 항목 | 사실 |
|---|---|
| **dev IP fetchSingleCase 결과** | records=0 / status=200 / ipcheck=true / duration=140ms / errors=null |
| **production endpoint 결과** | `{"status":"not_found","listings":[]}` / duration=7.9초 |
| **Supabase DB 안 row** | 0건 (cache 영역 부재 = 대법원 fetch 단계 진입 paradigm 정합) |
| **분기 판정** | (c) 대법원 DB 자체 사건 부재 확정 |
| **lookup route 흐름 정합성** | cache miss → 대법원 fetch → records=0 → closedFresh 0 → not_found 회신 paradigm 정상 동작 ✓ |
| **production NG 판정** | **NG 아님** = directive 핵심 원칙 "대법원 = 진실의 원천 / 우리 DB = 24h 캐시 단독" 정수 정합 |

### 비교 검증 사건 (work-005 사실 정합)

- 559336: records=1 / yuchalCnt=6 / mulStatcd=01 / jpDeptNm="경매11계" / maeGiil=20260515 (active 정상)
- 540431: records=1 / yuchalCnt=1 / jpDeptNm 사실 확인 의무 (active 정상)

### 의심 source 전체 (532249 = 외부 자료에는 존재하지만 대법원 official 부재 사실)

1. 사건 자체 매각취하 / 매각연기 / 별개 사유 → 대법원 official search 결과 records 0건 paradigm
2. 두인옥션 등 외부 자료 = 대법원 가공 사후 별개 데이터베이스 paradigm (대법원 vs 외부 차이 사실)
3. search API parameter (`cortAuctnSrchCondCd: "0004601"`) 필터링 조건 차이 가능 paradigm
4. 대법원 API 외 별개 endpoint 검수 (`selectAuctnCsSrchRslt.on` 등)

### 결정 옵션 (Code 추천 = 옵션 A)

| 옵션 | 내용 | 정수 |
|---|---|---|
| **A (Code 추천)** | 현재 paradigm 유지 (정정 영역 0) | directive 핵심 원칙 정수 정합 / 532249 = 대법원 부재 사실 = not_found 정상 회신 |
| B | search API parameter 확장 검수 (cortAuctnSrchCondCd / bidBgngYmd 범위 확장) | 추가 사실 회수 의무 / fetch duration 영향 검수 |
| C | 사용자 직접 입력 paradigm 신규 (manualEntry 회복) | **NG paradigm** = cycle 1-D-A-4-2 paradigm 영구 폐기 사실 충돌 |

### 형준님 단독 가능 사실 검수 의무

1. 532249 = 대법원 공식 사이트 (https://www.courtauction.go.kr) 직접 검색 → 실제 records 사실 확인 (사건 자체 부재 사실 잠재 검수)
2. 이미지 3 source = 두인옥션 또는 별개 외부 자료 paradigm 확인 (대법원 official vs 외부 가공 차이 사실)
3. Vercel logs 직접 회수 (https://vercel.com/auctionq/auction_system/?selectedTab=logs / `[auction/lookup]` console.error grep / duration 확인 / 추가 NG paradigm 진단)

---

## 📂 work-005 사실 정합 — 1물건 1고객 race 회피 4단계 paradigm 완성

| 단계 | 위치 | 분기 | 영향 파일 |
|---|---|---|---|
| **1차** | Hero (비로그인 시점) | already-taken amber alert + "다른 사건 검색" 버튼 | `src/components/home/HomeHero.tsx` + `src/app/api/auction/lookup/route.ts` |
| **2차** | Step1 (로그인 사후 입력 단계) | caseTaken red alert + 차단 | `src/components/apply/steps/Step1Property.tsx` (POST body round 명시) |
| **3차** | Step5 (결제 submit 직전) | raceBlocked alert + 차단 | `src/components/apply/steps/Step5Payment.tsx` (handlePreSubmitCheck) |
| **4차** | DB INSERT | orders_unique_active_case_round constraint (최종 안전망) | `supabase/schema.sql` (영구 보존) |

### closedStale 분기 영구 폐기 paradigm (work-005 정정 1)

- 사전 cycle 1-G-γ-α-ε paradigm: closedStale + records 0 → fetch_failed 회신 (사건 사라짐 case에서 NG)
- 사후 work-005 paradigm: closedFresh (within 24h closed) → closed / 그 외 → not_found 단독 회신
- 영향 양측: `src/app/api/auction/lookup/route.ts` + `src/app/api/orders/check/route.ts`

### LookupStatus 10 status paradigm

```
idle | loading | active-single | active-multi | closed | not-found
| invalid | error | fetch-failed | already-taken
```

- `already-taken` = work-005 정정 3 신규 추가 (amber alert / red NG = "행동 차단" paradigm 단단 NG)
- 사후 work-006 정정 = 카카오톡 link carrier 영구 폐기 + "다른 사건 검색" 버튼 단독 보존

---

## 📂 work-006 사실 정합 — 카카오톡 전체 폐기

### 폐기 사실 (Code link 4건 + 텍스트 6개소 + 컴포넌트 1건 + config 2건)

| 분류 | 항목 | 사실 |
|---|---|---|
| Link 폐기 | HomeHero already-taken 카카오톡 link | "다른 사건 검색" 버튼 단독 보존 |
| Link 폐기 | /contact 페이지 카카오톡 채널 버튼 | 전화 상담 카드 대체 |
| Link 폐기 | ApplyCTA 카카오톡 상담 button | "문의하기" 카피 대체 |
| Link 폐기 | DetailSidebar 카카오톡 상담 link | "문의하기" 카피 대체 |
| Text 대체 | PrivacyContent 3개소 | "전화·이메일" 대체 |
| Text 대체 | LegalLayout L96 | "전화·이메일" 대체 |
| Text 대체 | refund/page.tsx L189 | "전화·이메일" 대체 |
| Text 대체 | faq-data.ts L36 | "문의하기 페이지의 전화·이메일" 대체 |
| Comment 정리 | Step5Payment + Step5Complete + constants comment | 알림 채널 명시 영역 0 paradigm |
| 컴포넌트 삭제 | `src/components/admin/KakaoNotifyButton.tsx` | 파일 자체 삭제 (159 line) + admin orders/[id] page import + render 정리 |
| Config 폐기 | `COMPANY.kakaoChannelUrl` 필드 | constants.ts |
| CSS 폐기 | `--color-kakao: #fee500` | globals.css |
| 신규 추가 | `MOCKUP_SUPPORT_PHONE` + `SUPPORT_PHONE` 환경변수 패턴 | constants.ts (MOCKUP_SUPPORT_EMAIL 패턴 정합) |

### 보존 사실

- **LoginButton Kakao OAuth provider 정의** = `DISABLED` 상태 영구 보존 (work-008 진입 시점 검토 paradigm)
- text mention comment paradigm = work-006 폐기 명시 history 추적 (사용자 노출 0)

### /contact 페이지 신규 paradigm

- Phone 카드 (Phone icon + SUPPORT_PHONE "1588-0000" + `tel:` link + "지금 전화하기" CTA)
- Mail 카드 (Mail icon + SUPPORT_EMAIL "support@auctionquick.kr" + `mailto:` link + "메일 보내기")
- 하단 안내 = "추후 다양한 소통 채널을 추가할 예정입니다"
- metadata description = "고객센터 안내. 접수는 웹 신청 페이지에서, 상담은 전화·이메일로 진행됩니다"

---

## 📂 work-002 ~ work-004 사실 정합 (Hero + photos paradigm)

### work-002 (Hero NG 3건)

- input `spellCheck={false}` + `autoCorrect="off"` + `autoCapitalize="off"` (빨간 dotted underline 영구 차단)
- input `focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)]` (Liquid Glass + WCAG focus-visible)
- input `disabled={isLoading}` (loading 시점 typing 차단)
- button `active:scale-[0.98] active:bg-[var(--brand-green-deep)] disabled:active:scale-100` (click 즉시 visual feedback)
- mapper.ts L136-138 photos 3 column 영구 제외 (upsert payload 안 NULL overwrite 차단)
- LISTING_SELECT 양측 (lookup + orders/check) photos + photos_count 추가
- CourtListingSummary 안 `photos: Photo[] | null` + `photos_count: number` + 신규 Photo type (seq + url + caption + categoryCode? + thumbnailUrl?)

### work-003 (Hero 정정 통합)

- η 정정 9 (Card image render) 폐기 → ImageOff placeholder 단독 단계 영구 보존
- chip 2건 (Building2 + FileText) 양측 통일 + 보증금 전용계좌 chip 폐기
- 일러스트 가시성 강화 (opacity 전체 + fade overlay 약화 + radial glow 강화 + strokeWidth 강화 + dot 크기 강화)
- 모바일 SVG `scale-[1.4] lg:scale-100` (사후 work-004 paradigm 영구 폐기)
- h1 강조 단계 yellow 1-span → green 본문 "경매를 시작하세요" + yellow 마침표 단독 (h2 강조 단계 통일)
- textShadow 옵션 D = 마침표 단독 yellow glow + green 본문 flat (그림자 단독)

### work-004 (Hero 시각 정정)

- HeroFlowBackground 단일 컴포넌트 → **HeroFlowBackgroundDesktop** (hidden lg:block / 사전 1600x900 viewBox 영구 보존) + **HeroFlowBackgroundMobile** (lg:hidden / 신규 800x1200 viewBox + element 전체 재배치)
- Liquid Glass 박스 불투명 약화 양측 통일 (HomeHero + HomeCTA):
  - bg 0.35/0.20 → 0.15/0.08
  - blur 40px → 20px
  - border 0.3 → 0.20
  - shadow inset 0.5 → 0.30 + 32px/80px/0.35 → 24px/60px/0.25
- chip `{lookupStatus === "idle" && (...)}` 분기 영구 폐기 → 사이트 전체 상태 (idle + loading + active + error 전체) chip 표시 paradigm

---

## 📂 work-001 사실 정합 (seed-photos cleanup)

### DB cleanup (Supabase MCP 직접 실행 사실)

- seed-photos 22 row 영구 삭제 (B000212 2 + B000240 12 + B000241 8)
- 540431 정상 row 영구 보존 (docid=B0002402024013054043111 / is_active=true)
- 559336 + 그 외 11 사건 = 사후 lookup endpoint 호출 시점 자연 fetch + mapper UPSERT 진입 paradigm

### Code 정정

- `scripts/seed-photos.mjs` INSERT 단계 (L387-416 else block + makeDocid 함수) 영구 폐기 → `--docid` 옵션 단독 paradigm (기존 row 사후 적재 시점 photos 단독 갱신 paradigm)
- lookup endpoint L229-247 + orders/check route L264-279 양측 closed 검수 단계 safety check 추가: `.not("court_name", "ilike", "%(seed-photos)%")`

---

## 🔧 영구 룰 + 보존 paradigm

### 사업 핵심 가치 (CLAUDE.md 영구 정합)

- **투자자의 시간적·물리적 병목 해소** 단독
- 차별화 축 = 신속 + 신뢰 + 경제적 (가격 메인 강조 NG)
- 폐기 어휘 영구 = "카톡" 메인 노출 + "5만원" 큰 숫자 강조 + "박형준" 개인 색 + 사진·자격증·등록증 메인 노출

### 신규 영구 룰 (본 세션 채택)

1. **work-NNN sequential paradigm 영구 채택** (cycle/그리스 문자/sub-cycle 영구 폐기 / 2026-05-13)
2. **"광역" 단어 회신문/commit/comment 엄격 금지** (2026-05-13)
3. **카카오톡 채널 운영 방식 영구 폐기** (work-006 / 향후 유선·이메일·신규 채널 paradigm)
4. **directive 핵심 원칙**: 대법원 = 진실의 원천 / 우리 DB = 24h 캐시 단독 / 우리 DB만 보고 not_found 회신 paradigm 절대 금지 (work-007 명시)

### CLAUDE.md 영구 룰 §1 ~ §A-26 정합 보존

- §1: 신규 npm 0 (motion + lucide-react + NumberFlow 단독)
- §8: yellow 색감 = 마침표 + 강조 단어 단독 (Hero h1 yellow 마침표 단독 paradigm 정합)
- §9: red 색감 = 가격 한정 + required + error (정보 영역 NG / Step5Payment 입금 금액 = ink-900 정합)
- §13 룰 33 #1: focus-visible 의무 (input focus:ring 정합)
- §13 룰 33 #6: Next/Image 사용 의무 (work-003 사후 Hero Card = placeholder 단독 paradigm = Image 사용 영역 0)
- §29: 토큰 단독 사용 (Hero source-of-truth #FFD43B + #00C853 + #111418 + 사용자 안내 amber 단독)
- §31: 모달 분류 (강제 vs 정보)
- §32: 합니다체 단독 (요체 ~예요/~돼요/~해요 영역 0 / quote paradigm 예외)

### 영구 보존 paradigm

- cycle 1-D-A-3-2 paradigm = on-demand fetch + cron 폐기 영구
- court_listings DB + TTL 24h + cache paradigm 영구
- /apply Step1 caseConfirmedByUser 사용자 직접 확인 단계 영구
- /api/orders/check + login 의무 + 중복 체크 + form prefill 영구
- mapper.ts is_active hardcoded true (별개 work 검수 영역 / 본 세션 영역 0)
- console.error 보존 (Vercel logs 회수 단독)
- closedFresh (within 24h closed) → closed 회신 paradigm 영구 (정상 종결 사건 단일 source)
- is_case_active 사전 함수 + DB unique constraint 영구 보존 (anyround 신규 함수 NG)
- Hero h1 카피 SoT "법원에 가지 않고, / 경매를 시작하세요." + 강조 (green 본문 + yellow 마침표) 영구
- Hero subtitle "사건번호만 주시면, 법원은 저희가 갑니다." 영구
- HeroFlowBackgroundDesktop + HeroFlowBackgroundMobile 분리 paradigm 영구
- Liquid Glass 약화 단계 양측 통일 (HomeHero + HomeCTA) 영구
- chip 2건 양측 통일 (Building2 + FileText) + idle 분기 폐기 영구
- LookupStatus 10 status paradigm 영구
- Step1Property auctionRound POST body 명시 paradigm 영구
- Step5Payment handlePreSubmitCheck race 회피 paradigm 영구

---

## 📁 핵심 파일 + 컴포넌트 영역

### Hero + 메인 8 섹션 (`src/components/home/`)

- `HomeHero.tsx` (input + button + already-taken + HeroFlowBackgroundDesktop + HeroFlowBackgroundMobile + SingleListingCard + ListingPickerCard inline)
- `HomeProcess.tsx`
- `HomeCompare.tsx`
- `HomePricing.tsx`
- `HomeScope.tsx`
- `HomeReviews.tsx` + `ReviewsMarquee.tsx` (사전 main lint error 1건 잔존 / 본 세션 외)
- `HomeInsight.tsx`
- `HomeCTA.tsx` (TrustCTA / Liquid Glass 약화 정합)

### 사건 조회 API (`src/app/api/`)

- `auction/lookup/route.ts` = GET / 비로그인 / Hero 단독 / **closedStale 분기 영구 폐기** + already_taken RPC 호출
- `orders/check/route.ts` = POST / 로그인 의무 / Step1 + 중복 체크 / **closedStale 분기 영구 폐기**

### 대법원 fetch (`src/lib/courtAuction/`)

- `search.ts` = `fetchSingleCase` (bidBgngYmd 20200101 / bidEndYmd 20301231)
- `session.ts` = STEP1 GET / + STEP2 GET /pgj/index.on (WMONID + JSESSIONID 발급)
- `mapper.ts` = `mapRecordToRow` / **photos 3 column 영구 제외** / is_active hardcoded true (별개 work 검수 영역)
- `codes.ts` = endpoint 상수 + SEARCH_PGM_ID + USER_AGENT

### /apply Step (`src/components/apply/steps/`)

- `Step1Property.tsx` = caseTaken state + matchedListing prefill + **auctionRound POST body 명시**
- `Step2BidInfo.tsx`
- `Step3Documents.tsx`
- `Step4Confirm.tsx` (서명 + 위임 계약)
- `Step5Payment.tsx` = **handlePreSubmitCheck** (race 회피 3차 단계 / raceChecking + raceBlocked state)
- `Step5Complete.tsx`

### Type 정의

- `src/types/apply.ts` = `Photo` (신규) + `CourtListingSummary.photos` + `photos_count`

### Config + DB

- `src/lib/constants.ts` = FEES + BRAND_NAME + AGENT_INFO + PRIVACY_CONTACT + MOCKUP_SUPPORT_EMAIL + **MOCKUP_SUPPORT_PHONE** (신규) + COMPANY (kakaoChannelUrl 영구 폐기)
- `supabase/schema.sql` = is_case_active(case_no, round_no) + orders_unique_active_case_round + court_listings (photos JSONB column)

### /contact + 분석 page

- `src/app/contact/page.tsx` = 전화 + 이메일 2 카드 paradigm (work-006 재산출)
- `src/components/analysis/ApplyCTA.tsx` = "문의하기" 단독 (카카오톡 폐기)
- `src/components/analysis/DetailSidebar.tsx` = "문의하기" 단독 (카카오톡 폐기)

### 영역 외 보존

- `src/components/admin/` (KakaoNotifyButton 파일 삭제 / 그 외 영구 보존)
- `src/components/auth/LoginButton.tsx` (Kakao OAuth DISABLED 보존 / work-008 진입 시점 검토)

---

## 🚀 다음 세션 진입 순서 추천

### 1순위: work-007 형준님 결정 회수

- 532249 = 대법원 official 부재 사실 확정 (Code 사전 조사 완료)
- 옵션 A 채택 = 정정 영역 0 / directive 핵심 원칙 정수 정합 (Code 추천)
- 옵션 B 채택 = search API parameter 확장 검수 단계 (추가 사실 회수)
- 형준님 사전 검수 의무:
  - 대법원 공식 사이트 (https://www.courtauction.go.kr) 직접 검색 → 532249 사실 확인
  - Vercel logs 회수 (https://vercel.com/auctionq/auction_system/?selectedTab=logs)

### 2순위: work-008 진입 — 카카오톡 인앱 브라우저 Google OAuth 차단 해결

- 사전 형준님 의뢰 사실 (handoff 사전 cycle ζ-3 의도 회복)
- KakaoTalk WebView 안 Google OAuth = 403 disallowed_useragent 차단 paradigm 잠재
- 가능 옵션:
  - (a) userAgent 검수 + 외부 브라우저 진입 안내 모달 paradigm (`kakaotalk://web/openExternal?url=`)
  - (b) Kakao OAuth 직접 활성화 (LoginButton DISABLED 사실 회수 paradigm 검토)
  - (c) Magic Link 또는 Email OTP 신규 paradigm 도입

### 3순위: 기술부채 항목 (별개 work paradigm)

- mapper.ts is_active hardcoded → 동적 매핑 검수 (`r.mulJinYn === "Y"` paradigm)
- ReviewsMarquee.tsx L66 사전 main lint error 1건 정리
- Lighthouse 측정 재개 (Phase 9 의도)

---

## 🗂 사전 cycle → work 명명 mapping history

본 세션 사전 cycle paradigm history (참고용 / 영구 폐기 사실 정합):

| 사전 cycle 명명 | 신규 work 매핑 | 의도 |
|---|---|---|
| cycle 1-G-γ-α-ζ-1 | work-001 | seed-photos cleanup |
| cycle 1-G-γ-α-η | work-002 | Hero NG 3건 |
| cycle 1-G-γ-α-θ | work-003 | Hero 통합 정정 |
| cycle 1-G-γ-α-ι-1 | work-004 | Hero 시각 정정 |
| cycle 1-G-γ-α-ι-2 | work-005 | 사건 조회 NG + 회차 분기 |
| (사전 cycle 명명 없음) | work-006 | 카카오톡 전체 폐기 + /contact |
| (사전 cycle 명명 없음) | work-007 | 532249 사전 조사 |

사후 paradigm = **work-NNN sequential 단독** (cycle/그리스 문자/sub-cycle 영역 0).

---

## 📝 자가 검증 paradigm (다음 세션 진입 사전 의무)

| # | 검증 | 도구 |
|---|---|---|
| 1 | TypeScript 0 error | `pnpm exec tsc --noEmit` |
| 2 | lint 신규 0 (ReviewsMarquee 사전 1 error 영구 보존) | `pnpm lint` |
| 3 | production endpoint 직접 호출 | `curl https://auctionsystem-green.vercel.app/api/auction/lookup?caseNumber=...` |
| 4 | 회신문 "광역" 어휘 0건 | `grep "광역" <회신 markdown>` |
| 5 | 영구 룰 §32 합니다체 grep | `grep "예요\|돼요\|해요" src/components/` |
| 6 | 카카오톡 link/button 0건 검수 | `git grep "kakao\|카카오톡\|MessageCircle"` (LoginButton DISABLED + comment 단독 잔존 허용) |

---

## 📝 명문화 source 영역

- `CLAUDE.md` = 사업 본질 + 영구 룰 + Phase 설계 + cycle/work 단계 명문화
- `HANDOFF.md` = 본 문서 (다음 세션 진입 컨텍스트 단독)
- `docs/roadmap.md` = Phase 7~10 + v2 패키지
- `docs/content-source-v2.md` = Cowork 원천 자료 규격
- `~/.claude/projects/-Users-parkhj-Projects-website/memory/MEMORY.md` = 형준님 영구 feedback (존댓말 + "광역" 단어 금지)

---

## 🔗 commit history (본 세션 전체)

```
6676de5 work-006: 카카오톡 전체 폐기 + /contact 목업 연락처 대체
cfdfaf0 work-005: 사건 조회 NG + 회차 분기 paradigm (1물건 1고객 race 회피 4단계)
44441fb cycle 1-G-γ-α-ι-1: Hero 시각 정정 3건 (모바일 SVG + Liquid Glass + chip)  ← work-004 매핑
8331877 cycle 1-G-γ-α-θ: Hero 정정 통합 (η 정정 9 폐기 + 추가 정정 5건)  ← work-003 매핑
d5a38f6 cycle 1-G-γ-α-η: Hero NG 3건 통합 정정 (button + input + photos)  ← work-002 매핑
7108681 cycle 1-G-γ-α-ζ-1 정정 6+7: lookup + orders/check safety check 추가  ← work-001 매핑
fcb6f71 cycle 1-G-γ-α-ζ-1 정정 5: scripts/seed-photos.mjs INSERT 단계 영구 폐기  ← work-001 매핑
8679af2 HANDOFF.md 갱신: cycle 1-G-γ-α-ε 종료 paradigm + 다음 세션 진입 트리거
```

---

**End of HANDOFF.md (work-007 사전 조사 종료 / work-NNN paradigm 영구 채택 / 2026-05-13)**
