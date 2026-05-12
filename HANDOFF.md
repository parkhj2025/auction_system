# 경매퀵 웹사이트 핸드오프 문서

> **용도**: 다음 세션 진입 시 본 문서 단일 영역 광역 컨텍스트 영역.
> **최종 업데이트**: 2026-05-12 (cycle 1-G-γ-α-ε 종료 / fetch_failed 신규 status + closed 판정 단계 정정 push 정합)
> **현재 빌드 상태**: HEAD = `9802285` (cycle 1-G-γ-α-ε / fetch_failed 신규 status + closed 판정 단계 정정)
> **production URL**: https://auctionsystem-auctionq.vercel.app (alias: auctionsystem-green.vercel.app)
> **production 광역 deployment**: `dpl_BjX2D7DxKouVAhxEPyG7dwqoC3de` (READY 정합 / 1778563815772)
> **다음 세션 진입 트리거**: **2024타경569067 closed 잘못 판정 잔존 NG → seed-photos 12 row 광역 정리 paradigm 결정 의뢰**
> **함께 읽을 문서**: `CLAUDE.md` section 27~30 (Step2~6 + 관리자 paradigm 광역 명문화)

---

## 🔥 핫 스냅샷 — 다음 세션 시작 시 여기부터

### 지금 어디인가

**cycle 1-G-γ-α-ε 종료** = fetch_failed 신규 status 광역 정정 paradigm 정합. **2024타경582718 fetch_failed 회복** ✓ / **2024타경569067 closed 잔존 NG** (seed-photos row 광역 단독).

광역 진행 history (현재 세션 / cycle 1-G 광역):
- cycle 1-G-α (TopNav 신청하기 메뉴 안 재추가) ✅ `dd47ec8`
- cycle 1-G-α-α (TopNav 시각 위계 정리) ✅ `5619cc7`
- cycle 1-G-β (/about What 섹션 + 일러스트 2건 / 사후 광역 회수) ✅ `af247c8`
- cycle 1-G-β-α (/about 일러스트 2건 재산출) ✅ `4546f09`
- cycle 1-G-β 재시작 (/about 광역 재산출) ✅ `9905bd9`
- cycle 1-G-β-β (/about 광역 재산출 / Bottom CTA 폐기 + pastel 폐기) ✅ `88473a5`
- cycle 1-G-β-γ (/about 제로베이스 / Apple-style Bento Grid) ✅ `4e2e6bc`
- cycle 1-G-β-γ-β (/about 광역 재설계 / 자체 SVG 5건 + asymmetric) ✅ `936b163`
- cycle 1-G-β-γ-γ (/about 5 섹션 정정 / Problems + Trust System + Office·Regions·Credentials 폐기) ✅ `911147e`
- cycle 1-G-γ (/service 광역 재설계) ✅ `2d2601e`
- cycle 1-G-γ-α (메인 광역 재구성 + /service 페이지 영구 폐기) ✅ `f553608`
- cycle 1-G-γ-α-α (메인 광역 정정 / 섹션 순서 + Hero SoT + Compare 신규 + Process 압축 + Pricing 회복 + Scope 위치 + Insight aspect) ✅ `c0f8a10`
- cycle 1-G-γ-α-β (Hero + Pricing 사전 paradigm 회복 + Hero bg SVG) ✅ `784c8ee`
- cycle 1-G-γ-α-γ (HomeCTA → TrustCTA 회복 + Pricing eyebrow + Process h2 + Hero glow/bg) ✅ `111adfb`
- cycle 1-G-γ-α-δ (Hero 사건 조회 + 물건 선택 + sessionStorage + Step1 prefill) ✅ `fd3dad6`
- **cycle 1-G-γ-α-ε (fetch_failed 신규 status + closed 판정 단계 정정)** ✅ `9802285` 🔥
- 다음 = **seed-photos 12 row 정리 paradigm 결정 → cycle 1-G-δ (/faq) 또는 별개 sub-cycle 진입**

---

## ⚠ 잔존 NG 사실 (다음 세션 진입 우선)

### NG #1: 2024타경569067 closed 잘못 판정 잔존 (cycle 1-G-γ-α-ε 사후 검수)

**production 직접 호출 결과** (commit `9802285` 사후):
| 사건번호 | 회신 status | 결과 |
|---|---|---|
| 2024타경582718 | `fetch_failed` ✓ | 정정 정상 회복 (사전 closed 잘못 판정 회피) |
| 2024타경569067 | **`closed`** ⚠ | 잔존 NG (실제 = 진행 중 사건) |

**NG 원인 식별**:
- DB 안 2024타경569067 = 2 row 광역
  - `"인천지방법원"` court_name / `is_active=false` / `last_seen_at 2026-04-15` (stale)
  - **`"B000240 (seed-photos)"` court_name / `is_active=false` / `last_seen_at 2026-05-11` (within 24h)** ← NG 식별 source
- 정정 후 closed 판정 흐름 = `closedFresh` query → seed-photos row within 24h is_active=false 검수 → closed 회신 paradigm
- seed-photos row 광역 = cycle 안 photo seed 작업 paradigm (사전 cycle 광역 산출)

**seed-photos 광역 사실**:
- 12 row 광역 (`court_name = "B000240 (seed-photos)"`)
- last_seen_at 2026-04-24 ~ 2026-05-11 (within 24h = 일부 / stale = 일부)
- 광역 잠재 NG = 12 사건 광역 closed 잘못 판정 잠재 paradigm

### NG #2: 대법원 fetch 자체 광역 NG 잠재

- 2024타경582718 = fetch_failed 회신 = records.length 0 (대법원 fetch 실패 또는 응답 0건)
- production runtime logs 직접 회수 NG (`get_runtime_logs` "No logs found" 회신 / Vercel dashboard 직접 조회 의무)
- console.error 광역 보존 paradigm (정정 사후 영구)

### NG #3: mapper.ts `is_active` hardcoded (별개 cycle 영역)

- 현재 = `is_active: true` hardcoded (mapper.ts line 145)
- 검수 = `is_active: r.mulJinYn === "Y"` 동적 매핑 paradigm 검수 의무
- 사전 검수 = 광역 records 광역 mulJinYn 광역 값 회수 (dev 환경 fetch 단독)
- cycle 1-G-γ-α-ε 의도 안 별개 cycle 진입 영역 명시

---

## 📋 결정 의뢰 영역 (다음 세션 진입 사전)

### 결정 #1: seed-photos 12 row 광역 정리 paradigm

| 옵션 | 내용 | 정수 |
|---|---|---|
| (a) cache lookup query 정정 = `court_name ILIKE '%seed%'` 광역 제외 | 임시 paradigm + 코드 단독 | △ 임시 |
| (b) seed-photos row 광역 DB 수동 정정 | Code 자율 진입 NG / 형준님 수동 SQL 의무 | 형준님 결정 의뢰 |
| (c) court_name 광역 cleanup = "B000240 (seed-photos)" → "인천지방법원" 광역 정정 | 정합 + 일회성 SQL | ✓ |
| (d) closedFresh + not_found 검수 단계 = court_name 광역 분기 추가 | 광역 코드 정정 + 정합 | ✓ |

### 결정 #2: 대법원 fetch 검수 paradigm

- production 단계 fetchSingleCase 직접 호출 검수 의뢰
- mulJinYn + status_code 광역 records 광역 값 회수 의뢰
- mapper is_active 동적 매핑 결정 의뢰

### 결정 #3: cycle 1-G-δ /faq 광역 정정 진입 timing

- (a) NG #1 정정 사후 진입 (안정 paradigm)
- (b) NG #1 + 1-G-δ 광역 분기 진입

---

## 📂 영역 광역 paradigm

### 메인 페이지 (cycle 1-G-γ-α-ε 정합)

**8 섹션 광역 순서**:
1. Hero (charcoal 풀스크린 / 사건번호 폼 + Liquid Glass 박스 + 자체 SVG 일러스트 / 카피 SoT 영구 회복)
2. Process (brand-green 풀스크린 / 5-col horizontal + horizontal step flow SVG)
3. Compare (surface-muted / 2-col 비교 카드 / 5시간·5단계 vs 10분·2단계)
4. Pricing (surface-muted 풀스크린 / 3-tier green·orange·red + timeline + NumberFlow + button selected)
5. Scope (surface-muted / DO + DON'T 2-col)
6. Reviews (charcoal / ReviewsMarquee)
7. Insight (white / 4 magazine card aspect-[4/1])
8. CTA (TrustCTA 회복 / trust-bg.jpg + Liquid Glass + 3 trust 카드 + CTA + 캡션)

**Hero 사건 조회 paradigm (cycle 1-G-γ-α-δ)**:
- input 형식 검증 `/^\d{4}타경\d+$/`
- CTA → `/api/auction/lookup` GET fetch
- listings 1건 = SingleListingCard inline / 다건 = ListingPickerCard radio
- 신청하기 click = sessionStorage 보존 + `/apply?case=XXX&prefill=1` 진입
- ApplyClient sessionStorage 회수 + matchedListing 자동 prefill

### /about (cycle 1-G-β-γ-γ 정합 / `911147e`)

**5 섹션 광역** (영구 보존):
1. Hero (charcoal / 시계·번개·궤도 SVG continuous loop)
2. Problems (white / 4 카드 / 고객 problem 직접 표현)
3. Values (brand-green 풀스크린 / 시간·이동·집중 SVG + "법원은 저희가" + "시간은 그대로" + "처음이어도")
4. Trust System (surface-muted / lucide 96px Users·Award·ShieldCheck 3 카드)
5. Company (charcoal / phone mockup floating SVG)

**폐기 영구**: Office (인천 사무실) + Regions (한국 지도) + Credentials 별개 섹션 + "당일·직접·거품 0" 카피

### 사건 조회 API paradigm (cycle 1-G-γ-α-ε 정합)

**/api/auction/lookup** (GET / 비로그인 / Hero 단독):
- rate limit IP 단위 1분당 10건
- caseNumber `/^\d{4}타경\d+$/` 검증
- courtCode 검증 (Phase 1 = B000240 단독)
- cache lookup (`is_active=true + TTL 24h`)
- cache MISS = fetchSingleCase + upsert + 재조회
- status 분기 = active / closed / not_found / **fetch_failed** (신규) / invalid_input / invalid_court / rate_limited / server_error

**/api/orders/check** (POST / login 의무 / Step1 단독):
- 동일 paradigm + 중복 체크 (1물건 1고객) + form prefill
- 동일 fetch_failed 신규 status 광역

**closed 판정 단계 정정 (cycle 1-G-γ-α-ε)**:
- TTL within 24h + is_active=false → closed 회신
- TTL 만료 + fetch records 0 + is_active=false → **fetch_failed** 회신 (stale closed NG 회피)
- 종결 record 부재 → not_found

### TopNav 메뉴 (cycle 1-G-α + α-α 정합)

- 사전 4 메뉴 = 서비스 소개 / 이용 절차 / 자주 묻는 질문 / 경매 인사이트
- 정정 3 메뉴 = **서비스 소개 / 자주 묻는 질문 / 경매 인사이트** (이용 절차 영구 폐기 / 메인 통합)
- 데스크탑 = "신청하기" primary brand-green solid + "로그인" 회색 텍스트 링크
- 모바일 = Logo + hamburger 2 column (신청하기 모바일 상단 영역 0)

---

## 🔧 영구 룰 + 보존 paradigm

### 사업 핵심 가치 v62

- **투자자의 시간적·물리적 병목 해소** 단독
- 차별화 축 = 신속 + 신뢰 + 경제적 (가격 메인 강조 NG)
- 폐기 어휘 영구 = "카톡" 메인 노출 + "5만원" 큰 숫자 강조 + "박형준" 개인 색 + 사진·자격증·등록증 메인 노출

### 영구 룰 §1~§33 광역 정합

- §1: 신규 npm 광역 0 (motion v12.38.0 + lucide-react + NumberFlow 사전 사용 광역)
- §8: yellow 색감 영역 0 (마침표 + 강조 단어 단독 paradigm)
- §9: red 색감 paradigm (가격 한정 + required + error / 정보 영역 NG)
- §10: PG 도입 영역 0 (Phase 10 사후 paradigm)
- §13 (CLAUDE.md): 오렌지 사용 금지 + 컬러 3색 이상 NG (단 Pricing 3-tier green·orange·red = 영구 회복 paradigm 임시 예외)
- §22: sidebar 영역 0 (/apply 단독 paradigm)
- §29: 토큰 단독 사용 (literal hex = Hero source-of-truth #FFD43B + #00C853 + #111418 단독 / 그 외 var 광역)
- §31: 모달 분류 (강제 vs 정보)
- §32: 합니다체 단독 (요체 ~예요/~돼요/~해요 영역 0 / quote paradigm 예외)
- §36: 광역 시각 토큰 보존 (메인 = cycle 1-G-γ-α 광역 재구성 영역 / /apply + 마이페이지 영구 보존)
- §A-2: production hex 추정 NG (var 단독)
- §A-11: /apply = 매수신청 대리 단독 (분석·자문·투자 어휘 영역 0)
- §A-12: 데스크탑 = 모바일 동일 paradigm

### 영구 보존 paradigm 광역

- cycle 1-D-A-3-2 paradigm = on-demand fetch + 광역 cron 폐기 영구
- court_listings DB + TTL 24h + cache paradigm 영구
- /apply Step1 caseConfirmedByUser 사용자 직접 확인 단계 영구
- /api/orders/check + login 의무 + 중복 체크 + form prefill 영구
- mapper.ts is_active hardcoded true (별개 cycle 검수 영역 / 본 cycle 영역 0)
- console.error 광역 보존 (Vercel logs 회수 단독)

### 자가 검증 paradigm

- tsc = 0 error
- lint = 신규 0 (ReviewsMarquee 사전 1 error 영구 보존)
- §32 합니다체 grep = 0건 (요체 어미 ~예요/~돼요/~해요)
- §A-2 production hex 추정 grep = 0건 (var 단독 / Hero source-of-truth + Pricing 3-tier 예외)

---

## 📁 핵심 파일 + 컴포넌트 영역

### 메인 8 섹션 (src/components/home/)
- HomePageClient.tsx (광역 client wrapper)
- HomeHero.tsx (Hero + 사건 조회 + sessionStorage / cycle 1-G-γ-α-δ + ε)
- HomeProcess.tsx (5 step + horizontal step flow SVG)
- HomeCompare.tsx (2-col 비교 카드 / 5시간 vs 10분)
- HomePricing.tsx (3-tier + NumberFlow + timeline / cycle 1-G-γ-α-β 회복)
- HomeScope.tsx (DO + DON'T 2-col / surface-muted)
- HomeReviews.tsx + ReviewsMarquee.tsx (charcoal)
- HomeInsight.tsx (4 magazine card / aspect-[4/1])
- HomeCTA.tsx (TrustCTA 회복 / cycle 1-G-γ-α-γ)

### /about 5 섹션 (src/components/about/)
- AboutPageClient.tsx
- AboutHero.tsx (시계·번개·궤도 SVG)
- AboutProblems.tsx (4 카드 / problem 직접 표현)
- AboutValues.tsx (brand-green 풀스크린 / 시간·이동·집중 SVG)
- AboutTrust.tsx (lucide 96px / Users·Award·ShieldCheck)
- AboutCompany.tsx (phone mockup floating)

### 사건 조회 API
- src/app/api/auction/lookup/route.ts (GET / 비로그인 / Hero 단독)
- src/app/api/orders/check/route.ts (POST / login / Step1 + 중복 체크)
- src/lib/courtAuction/search.ts (`fetchSingleCase` 대법원 fetch)
- src/lib/courtAuction/mapper.ts (`mapRecordToRow` / is_active hardcoded true)

### 영역 외 보존
- src/components/apply/ (Step1 + Step2 + ... / 영구 보존)
- src/app/apply/ (영구 보존)
- src/app/my/ + src/components/my/ (영구 보존)

---

## 🚀 다음 세션 진입 순서 추천

1. **잔존 NG #1 결정 의뢰 회수** = seed-photos 12 row 광역 정리 paradigm
   - 옵션 (a/b/c/d) 결정 사후 진입
   - 채택 = (c) court_name cleanup 또는 (d) lookup 분기 추가 단단함
2. **production 검수 자동화 paradigm**
   - Vercel dashboard logs 직접 회수 paradigm (Code 자율 진입 NG)
   - 또는 endpoint 직접 호출 paradigm 정합 (cycle 1-G-γ-α-ε 검수 paradigm 일치)
3. **mapper.ts is_active 동적 매핑 검수** (별개 cycle 영역)
4. **cycle 1-G-δ (/faq) 광역 정정 진입**
   - persona-aware + two-column + search bar + 아코디언 paradigm
5. **cycle 1-G-ε (/insight) 광역 정정 진입**
   - v53 보존 + shadow token 정정 + subtitle 정정
6. **cycle 1-G 종료 사후** = 도메인 결정 (auctionquick.kr / 가비아 1.5만원/년)

---

## 🗂 cycle history 요약 (현재 세션 광역)

### 시각 + UX paradigm 정정 (cycle 1-G-α ~ 1-G-γ-α-γ)
- TopNav 메뉴 정리 + 시각 위계 분리 (cycle 1-G-α + α-α)
- /about 광역 재설계 광역 (cycle 1-G-β 광역 → γ-γ 최종 / 5 섹션 영구 보존)
- /service 영구 폐기 + 메인 통합 (cycle 1-G-γ-α 광역)
- 메인 8 섹션 광역 정리 (Hero SoT + Process + Compare + Pricing + Scope + Reviews + Insight + CTA)
- Pricing + Hero 사전 paradigm 회복 + bg SVG (cycle 1-G-γ-α-β)
- HomeCTA → TrustCTA 회복 + Pricing eyebrow + Process h2 + Hero glow 약화 (cycle 1-G-γ-α-γ)

### 사건 조회 paradigm 정정 (cycle 1-G-γ-α-δ + ε)
- Hero 사건 조회 + 물건 선택 + sessionStorage + /apply prefill (cycle 1-G-γ-α-δ)
- fetch_failed 신규 status + closed 판정 단계 정정 (cycle 1-G-γ-α-ε)

---

## 📝 명문화 source 영역

- `CLAUDE.md` = 사업 본질 + 영구 룰 + Phase 설계 + cycle 광역 명문화
- `HANDOFF.md` = 본 문서 (다음 세션 진입 컨텍스트 단독)
- `docs/roadmap.md` = Phase 7~10 + v2 패키지
- `docs/content-source-v2.md` = Cowork 원천 자료 규격

---

## 자가 검증 paradigm (다음 세션 진입 사전 의무)

| # | 검증 |
|---|---|
| 1 | tsc 0 error (`pnpm tsc --noEmit`) |
| 2 | lint 0 신규 (`pnpm lint` / ReviewsMarquee 사전 1 error 보존) |
| 3 | production endpoint 직접 호출 (`/api/auction/lookup?caseNumber=2024타경569067&courtCode=B000240`) |
| 4 | DB seed-photos row 광역 count (`SELECT court_name, COUNT(*) FROM court_listings WHERE court_name LIKE '%seed%'`) |
| 5 | 영구 룰 §32 합니다체 + §A-2 hex + §29 토큰 광역 grep |

---

**End of HANDOFF.md (cycle 1-G-γ-α-ε 종료 paradigm 정합)**
