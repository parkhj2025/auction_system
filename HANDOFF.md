# 경매퀵 웹사이트 핸드오프 문서

> **용도**: 다음 세션 진입 시 본 문서 단일 영역 광역 컨텍스트 영역.
> **최종 업데이트**: 2026-05-09 (Stage 2 cycle 1-A 보강 5 dump 회신 / Opus 검수 대기)
> **현재 빌드 상태**: HEAD = `ab4b66b` (Stage 2 cycle 1-A 보강 4 - CaseConfirmModal 메인 paradigm 정합 + 행안부 검색 API 통합 / production 시각 검증 OK)
> **production URL**: https://auctionsystem-green.vercel.app/
> **다음 세션 진입 트리거**: **형준님 = 보강 5 dump 5건 Opus 검수 회신 송부 + 정정 markdown 산출 + push GO**
> **함께 읽을 문서**: `CLAUDE.md`, `BUILD_GUIDE.md`, `docs/roadmap.md`

---

## 🔥 2026-05-09 핫 스냅샷 — 다음 세션 시작 시 여기부터

### 지금 어디인가

**Phase 1.2 (A-1-2)** / **Stage 2 cycle 1-A 보강 5** 진행 중.

Stage 1 (메인 페이지) 광역 종료 (cycle 1~10-3 / production OK / 카피 v4 SoT v42.4 확정).

Stage 2 cycle 1 = `/apply` 페이지 톤앤매너 적용 cycle 진행 중. 보강 1~4 광역 push 완료 / 보강 5 = dump 회신 단독 (정정 0) / Opus 검수 대기.

### 다음 세션 진입 단계

1. **보강 5 dump 5건 회신 = Code 송부 완료** (정정 0 / push 0):
   - dump 1: canConfirm 광역 정수 (5 필드 검증 paradigm + handleConfirm silent return ⚠️)
   - dump 2: `--color-accent-red` 토큰 (#dc2626) + 광역 사용처 16건+ + **영구 룰 §9 광역 mismatch 검출**
   - dump 3: AddressSearch onSelect callback (보강 4 결과 / `addr.full` 단독 set)
   - dump 4: ApplyFormData propertyAddress = 단일 string + DB orders schema = `property_snapshot JSONB` 단독 / **propertyAddressDetail 컬럼 0**
   - dump 5: 매각기일 input type=date / min·max 광역 0 / placeholder native paradigm

2. **다음 세션 시작 = Opus 검수 회신 정리본 송부 받기**:
   - Code 추천 영역 검수 결과 (옵션 i 단일 string 통합 / 영구 룰 §9 갱신 안 / error state paradigm)
   - 형준님 결정 (propertyAddress paradigm + 영구 룰 §9 갱신 텍스트 + 추가 정정 영역)
   - Opus 산출 정정 markdown (push GO 통합)

3. **Code = 정정 + commit + push + 회신** (Opus 정정 markdown 송부 후 진입).

---

## Stage 2 cycle 1-A 보강 5 (현재 / dump 회신 단독)

### 의뢰 정수
1. **상세주소 (동·호·층) 입력 + 확정 단계 신규 도입** (현재 광역 0 검출)
2. **필수 항목 시각 안내 (* 별표) + 미입력 시 error state paradigm 신규**
3. **영구 룰 §9 갱신**: "red = Pricing rush+endpoint + form error state 한정 추가"

### Code dump 회신 핵심 진단 (회신 완료 / push 0)

#### dump 1 — canConfirm 분해 5 필드
```ts
canConfirm =
  !!data.bidDate &&
  !!data.propertyType && selectValue !== "" && otherTextOk &&
  !!data.propertyAddress.trim() &&
  roundOk &&
  agreed
```
- handleConfirm 광역 = **invalid 시 silent return** ⚠️ → error state paradigm 신규 도입 영역

#### dump 2 — 영구 룰 §9 광역 mismatch 검출
- 룰 §9 명시 = "red Pricing rush+endpoint 한정"
- 광역 코드 검출 = Step2BidInfo / FileUpload / PhoneVerifyModal / Step1 caseTaken / AddressSearch / login error 등 **이미 광역 사용**
- **갱신 추천 텍스트**:
  ```
  pink·red·coral 0 (red 한정 예외:
    - Pricing rush+endpoint
    - form error state (필수 *별표 + invalid border + 안내 메시지)
    - 사용자 행동 차단 알림 (이미 접수 진행 중 / 본인인증 실패 등)
  )
  ```

#### dump 3 — AddressSearch.onSelect callback type
```ts
type AddressSearchResult = {
  full: string;          // 도로명주소 (set 대상)
  jibun: string;         // 지번 (참고)
  zipCode: string;       // 우편번호
  sido / sigungu / eupmyeondong: string;
  buildingName: string;  // 옵션
};
```
- 현 paradigm = `addr.full` 단독 set / 다른 필드 미사용

#### dump 4 — propertyAddress 광역 paradigm
- ApplyFormData = `propertyAddress: string` **단일 string 광역**
- DB orders schema = `property_snapshot JSONB` 단독 / **propertyAddressDetail 별개 컬럼 0**
- API route = form fetch → property_snapshot.address set
- **Code 추천 = 옵션 (i) 단일 string 통합** (DB·API·type 변동 0 / modal local state addressDetail 신규 / "확인" 클릭 시 통합)
- 옵션 (ii) 분리 = DB 마이그레이션 의무 (광역 변동 ↑ / 보존 의무 충돌)

#### dump 5 — 매각기일 input
- type=date / placeholder native / **min·max 광역 0** (auction 검증 0 / 후속 cycle 영역)
- 빈 값 = `data.bidDate === ""` / canConfirm `!!data.bidDate` false

### 정정 정수 사전 명시 (Opus 결정 후 진입)
- **A. 상세주소 단계 신규**: modal local useState addressDetail / 도로명 set 후 input 노출 / 광역 (β) 선택 paradigm 추천 (단독주택 등 case 정합)
- **B. 필수 표시**: 5 필드 + checkbox 광역 `*` 별표 (text-red-500 또는 var(--color-accent-red))
- **C. error state**: useState showErrors + errors object + invalid border red + 안내 메시지 + 자동 reset onChange
- **D. scroll to first invalid**: `document.getElementById("modal-${field}")?.scrollIntoView({ behavior: "smooth", block: "center" })`
- **E. 영구 룰 §9 갱신**: 위 추천 텍스트

---

## Stage 2 cycle 1-A 광역 흐름 (전체 사이클 history)

### Stage 1 → Stage 2 전환 (2026-05-08)

Stage 1 cycle 1~10-3 광역 종료 (메인 페이지 광역 paradigm 확정 / production OK).

Stage 2 진입 = sub-page 광역 톤앤매너 적용. 시작 = `/apply` (사업 핵심 conversion 페이지).

### cycle 1-A 보강 history (총 5 cycle / 4 push 완료 / 1 dump 대기)

| Cycle | commit | 정정 영역 |
|---|---|---|
| **cycle 1-A 1차** | `4093b62` | /apply 헤더 PageHero 차용 + ApplyHeroMotion + 카피 정정 + 토큰 매핑 + PageHero size 80→88 |
| **cycle 1-A 보강** | `3985fe4` | ApplyChecklist 광역 dom 폐기 (안심 5건 광역 0 / 형준님 진의 정합) |
| **cycle 1-A 보강 1+** | `4e3ed95` | TopNav "신청하기" CTA 신규 + /apply 본론 직진 (PageHero 광역 폐기 + ApplyHeroMotion 폐기 + 데스크탑 layout container-app 정합) |
| **cycle 1-A 보강 2** | `73fb86c` | ApplyStepIndicator 재구성 (2-row + 도움말 버튼) + ApplyGuideModal 신규 + Step1 사건번호 버튼 모바일 overflow 정정 + 카톡 어휘 정정 (/apply 영역 한정) |
| **cycle 1-A 보강 3** | `456f104` | ApplyStepIndicator 원·선 직접 연결 + 라벨 줄바꿈 통일 (`\n` 광역) + Step1 CTA state 분기 (green primary 활성/gray 비활성) + 박스 메인 정합 (rounded-2xl + flat) + CaseConfirmModal X 버튼 (onReturn callback) |
| **cycle 1-A 보강 4** | `ab4b66b` | CaseConfirmModal 메인 paradigm 정합 + 행안부 검색 API 통합 (/api/address proxy + AddressSearch) + 카피 마케터 검수 (4건) + 버튼 광역 정합 (좌측 outline + 우측 green primary / 룰 33 transition·focus-visible 정합) + .env.example JUSO_API_KEY 추가 |
| **cycle 1-A 보강 5** | (dump 회신 단독 / push 0) | 상세주소 단계 신규 + 필수 표시 + error state + 영구 룰 §9 갱신 (Opus 검수 대기) |

---

## Stage 2 cycle 1-A 광역 결과 (production 광역 적용)

### 영향 파일 광역 inventory

**신규 생성:**
- `src/components/apply/ApplyGuideModal.tsx` (보강 2)
- `src/components/apply/AddressSearch.tsx` (보강 4)
- `src/app/api/address/route.ts` (보강 4 / 행안부 proxy)

**광역 정정:**
- `src/app/apply/page.tsx` (헤더 광역 폐기 / ApplyClient 직진)
- `src/components/apply/ApplyClient.tsx` (max-w container-app + lg:py-16)
- `src/components/apply/ApplyStepIndicator.tsx` (2-row + 라벨 광역 + line 직접 연결)
- `src/components/apply/ApplyChecklist.tsx` (5건 카피 + 토큰 매핑 / /apply 광역 mount 0 / /service 광역 보존)
- `src/components/apply/CaseConfirmModal.tsx` (광역 메인 정합 + AddressSearch 통합)
- `src/components/apply/steps/Step1Property.tsx` (사건번호 버튼 모바일 overflow + CTA state 분기 + 박스 디자인 + 카톡 카피 정정)
- `src/components/apply/steps/Step5Complete.tsx` (카톡 카피 정정 2건)
- `src/components/layout/TopNav.tsx` (CTA "신청하기" 신규 mount 모바일+데스크탑)
- `src/components/common/PageHero.tsx` (h1 size 80→88)
- `src/lib/constants.ts` (APPLY_STEPS label `\n` 광역 강제 줄바꿈)
- `.env.example` (JUSO_API_KEY 영역 추가)

**광역 폐기 (파일 삭제):**
- `src/components/apply/ApplyHeroMotion.tsx` (보강 1+ / 신규 후 폐기)

### 광역 paradigm 정수 (production 광역 적용)

#### TopNav 광역
- "신청하기" CTA 신규 (모바일 hamburger 좌측 + 데스크탑 user/login 좌측 / 별개 2 Link mount / className 분기)
- bg `var(--brand-green)` + rounded-full + transition-colors duration-150 + focus-visible:ring

#### /apply page.tsx 광역 (본론 직진)
- TopNav 직접 → ApplyClient 직진 paradigm
- 헤더 영역 광역 폐기 (PageHero · ApplyHeroMotion · breadcrumb · 미니 헤더 · 신청 가이드 link 광역)
- ApplyClient section = `container-app py-10 lg:py-16` 메인 정합

#### ApplyStepIndicator 광역 (2-row + 도움말)
- 상단 row: "STEP {n} / 5 · {label}" (green + charcoal) + "도움말" 버튼 (HelpCircle icon)
- 중간 row: 5 step 원 (h-9/h-10 + ring-4 ring-#00C853/20 활성) + 라벨 광역 노출 (`\n` 강제 줄바꿈) + progress line (h-[2px] flex-1 / 원 직접 연결 / bg-gray-200)
- 토큰 매핑: `--color-ink-*` → `#111418` + `#00C853` + gray-* (메인 정합)
- ApplyGuideModal mount + state 광역 (client component 변환)

#### ApplyGuideModal 광역 신규
- PhoneVerifyModal paradigm 정합 (fixed inset-0 + bg-black/50 + p-4)
- backdrop dismiss + ESC + X + 닫기 버튼 4-way dismiss
- 5단계 광역 안내 (물건 확인 / 입찰 정보 / 서류 업로드 / 확인·제출 / 접수 완료)

#### CaseConfirmModal 광역 (보강 3·4 결과)
- 디자인 메인 정합: rounded-2xl + border-gray-200 + body px-6 py-6 + footer bg-gray-50 + py-5
- inputClass 메인 정합: h-12 + rounded-xl + border-gray-200 + text-base (모바일 zoom 방지) + transition-colors + focus:ring-#00C853/20
- 라벨·안내 메인 정합: gray-* 토큰 + text-sm/text-base 광역
- header 광역: ShieldCheck + 제목 + X 버튼 (onReturn callback / 강제 paradigm 보존)
- footer 버튼 광역:
  - 좌측 ("사건번호 다시 입력"): outline white + rounded-full + border-gray-300 + transition + focus-visible
  - 우측 ("확인"): green primary `var(--brand-green)` + rounded-full + flat + transition + focus-visible + disabled gray-200
  - layout: flex flex-col gap-3 sm:flex-row
- 카피 마케터 검수: 본문 안내 단순화 + 좌측 버튼 통일 + 하단 안내 강조 inline
- 강제 paradigm 보존 (backdrop dismiss 차단 + ESC 차단)

#### 행안부 검색 API 통합 (보강 4)
- `/api/address` server-side proxy (process.env.JUSO_API_KEY 단독 / 클라이언트 노출 0)
- AddressSearch.tsx client (검색 input + list + 선택 paradigm)
- CaseConfirmModal 안 주소 input paradigm:
  - 사건 매칭 OK = readonly + bg-gray-50 + "변경" 버튼
  - 사건 매칭 0 = "주소 검색" 버튼 (AddressSearch 직접)
  - addressChanged 검출 시 "원래 주소로 복구" link

#### Step1Property 광역 (보강 2·3)
- 사건번호 input + 버튼 모바일 vertical stack (sm:flex-row)
- 사건조회 CTA state 분기: green primary 활성 / gray-100 비활성 (caseConfirmedByUser 시 "확인 완료")
- 다음 버튼: green primary 활성 / gray-200 비활성 (canProceed 분기 / shadow 폐기)
- 박스 디자인: rounded-2xl + border-gray-200 + bg-white + p-5 lg:p-8 + flat
- caseConfirmedByUser 자동 reset paradigm (input onChange 광역에서 caseConfirmedByUser=false + caseConfirmedAt=null 동시 set)
- 카톡 어휘 광역 폐기 ("직접 안내" / "도움말 확인")

#### Step5Complete 카톡 어휘 광역 폐기

#### ApplyChecklist 광역 (보강 1·1+)
- /apply page.tsx 광역 mount 0 (보강 1 결과)
- /service 광역 사용 보존 (다른 sub-page 변동 0 정합)
- CHECKLIST_ITEMS 5건 카피 마케터 검수 + 토큰 메인 정합 (광역 영향 = /service 광역 자동 적용 / 사업 정수 정합 ✓)

#### PageHero size 88 광역 (보강 1+)
- h1 lg:text-[80px] → lg:text-[88px] (메인 v53 §5 정수 정합)
- 광역 sub-page 영향: /about · /partners · /insight 자동 일관성 (의도된 광역 변동)

---

## ⚠️ 형준님 영역 의뢰 (production 광역 동작 정합 의무)

### JUSO_API_KEY 발급 + 설정 (보강 4 / 미완)
- data.go.kr 행안부 도로명주소 검색 API 승인키 발급 (즉시 + 무료)
- `.env.local` JUSO_API_KEY 추가 (로컬 dev)
- Vercel Dashboard → Settings → Environment Variables → JUSO_API_KEY 추가 (production)
- **광역 미설정 시 `/api/address` → 500 에러** (CaseConfirmModal AddressSearch 광역 동작 NG)

---

## 광역 보존 의무 (Stage 2 cycle 1-A 광역)

### 변동 0 영역 (회귀 검증 의무)
- **메인 페이지 광역** (Hero / Compare / Pricing / Reviews / Insight / TrustCTA / Footer): Stage 1 결과 광역 보존 ✓
- **다른 sub-page**: /about, /partners, /service, /faq, /notice, /insight, /apply/guide, /contact, /my, /refund, /admin, legal 광역 변동 0 (단 PageHero 차용 sub-page = h1 size 88 자동 일관성 / ApplyChecklist /service = 카피·토큰 자동 적용 / 의도된 광역 변동)
- **ApplyClient stepView · StickyPropertyBar · showStickyBar 분기 광역 보존**
- **Step2~5 dom 광역 변동 0** (cycle 1-B 영역 / Step1Property는 보강 2·3에서 정정 / Step5Complete는 카톡 카피만 정정)
- **/api/apply · Supabase orders·storage·documents 광역 변동 0**
- **TopNav 기존 메뉴 4건 + sticky + hamburger + drawer 광역 보존** (CTA 신규 추가 단독)
- **다른 modal (PhoneVerifyModal · ApplyGuideModal) 광역 변동 0** (charcoal primary paradigm 보존 / CaseConfirmModal green primary와 정수 분리)
- **ApplyChecklist props (values·displayOnly) 광역 보존**
- **APPLY_STEPS hint 필드 광역 보존** (다른 sub-page /apply/guide:126 광역 step.hint 사용 / 폐기 시 tsc error 검출 / 광역 보존 결정)
- **CaseConfirmModal 강제 paradigm 보존**: backdrop dismiss 차단 (e.stopPropagation) + ESC 차단 (e.preventDefault) + X 버튼 = onReturn callback 단독
- **사건 매칭 paradigm 정수 보존** (matchedListing/matchedPost fetch + propertyAddress 자동 set + manualEntry fallback)
- **Cowork v2.7.1 (raw-content) 광역 변동 0**

### 카톡 어휘 광역 정정 영역 (cycle 1-A 보강 2 / 한정)
- /apply 광역 4건 정정 (Step1Property × 2 / Step5Complete × 2)
- 다른 sub-page 광역 12+건 보존 (/service, /apply/guide, /my, /contact, /refund, /faq, legal, analysis 광역 / 후속 cycle 영역)

---

## Stage 2 cycle 1 후속 영역 예상 진행 순서

| Cycle | 영역 | 정정 정수 |
|---|---|---|
| **1-A 보강 5** | CaseConfirmModal | 상세주소 단계 + 필수 표시 + error state + 영구 룰 §9 갱신 (현재 / dump 회신 / Opus 검수 대기) |
| **1-A 보강 6+** | (Opus 후속 결정) | 시각 검증 NG 시 추가 정정 |
| **1-B** | Step body 광역 | Step2 BidInfo / Step3 Documents / Step4 Confirm / Step5 Complete 광역 톤앤매너 정합 |
| **1-C** | CTA · error · 약관 광역 | 광역 form error state 일괄 + 약관 미리보기 modal 정합 |
| **2** | /about | sub-page 톤앤매너 |
| **3** | /service | sub-page 톤앤매너 + ApplyChecklist /service 영역 |
| **4** | /faq | sub-page 톤앤매너 |
| **5** | /notice | sub-page 톤앤매너 |
| **6** | /pricing 검토 | (홈 #pricing anchor 광역) |
| **7** | /partners | sub-page 톤앤매너 |
| **8** | /terms + /privacy | legal 광역 |

---

## 메모리 영구 룰 갱신 의무 (다음 세션 / Opus 영역)

### v42.4 → v42.5 후속 (보강 5 종료 시)
- Hero h1 강조 paradigm 광역 보존 (yellow `#FFD43B` 광역 / cycle 10-2 결과)
- /apply h1 광역 paradigm: PageHero 차용 + h1 88 + yellow 마침표 (cycle 1-A 1차)
- /apply 본론 직진 paradigm (보강 1+ 결과)
- 영구 룰 §9 갱신: red form error state 한정 추가 (보강 5 결정 후)

---

## 직전 세션 흐름 (2026-05-08 ~ 2026-05-09)

### Stage 1 광역 종료 (cycle 7~10-3)
- cycle 7-2/7-3/7-4: Compare 박스 안 vertical balance 정정 (mb·gap·layout 광역)
- cycle 8/8-2/8-3: Insight Magazine Editorial Card paradigm + glossary.jpg 재생성 + 텍스트 size ↑
- cycle 9/9-2: TrustCTA Hero paradigm 광역 차용 (Liquid Glass 박스 + h2 1줄 통일 + motion + 카피·배경·줄바꿈)
- cycle 10/10-2/10-3: Hero h1 size 88 + 강조 yellow 회수 + TrustCTA 박스 진입 강화 + Footer 광역 재구성 + /partners 신규

### Stage 2 진입 (cycle 1-A 광역)
- 1차 + 보강 1~4 광역 push 완료 (위 history table 정합)
- 보강 5 = dump 회신 단독 / Opus 검수 대기 / **다음 세션 진입 영역**

---

## 다음 세션 시작 첫 단계 정리

1. **형준님 = 보강 5 dump 5건 Opus 검수 회신 (Code 답변 정리본) 송부**
2. **Code = 회신 검수 + propertyAddress paradigm 결정 (옵션 i 단일 string 통합 추천) + 영구 룰 §9 갱신 텍스트 결정 + 정정 markdown 산출 의뢰 (push 0 / 정정 사전 명시 단계)**
3. Opus 정정 markdown 산출 → 형준님 송부 → Code 정정 + commit + push + 회신
4. 형준님 production 시각 검증 (모바일 + 데스크탑 + CaseConfirmModal 광역)
5. OK 시 = 보강 5 종료 / cycle 1-A 광역 종료 / cycle 1-B (Step body 광역) 진입
