# 경매퀵 웹사이트 핸드오프 문서

> **용도**: 다음 세션 진입 시 본 문서 단일 영역 광역 컨텍스트 영역.
> **최종 업데이트**: 2026-05-10 (cycle 1-D-A-4-3 보강 1 정정 2 종료 / 형준님 production 시각 검증 광역 수정사항 대기)
> **현재 빌드 상태**: HEAD = `3a87632` (cycle 1-D-A-4-3 보강 1 정정 2: BidConfirmModal 신규 + Step2 강제 모달 paradigm / push 완료)
> **production URL**: https://auctionsystem-green.vercel.app/apply
> **다음 세션 진입 트리거**: **형준님 = production 시각 검증 광역 수정사항 회신 → 추가 정정 paradigm 진입**
> **함께 읽을 문서**: `CLAUDE.md` (section 18~27 광역 / §31·§32 영구 룰 광역), 모달 3개 (`ConfirmCaseModal.tsx` + `BidConfirmModal.tsx` + `IssueGuideModal.tsx`)

---

## 🔥 핫 스냅샷 — 다음 세션 시작 시 여기부터

### 지금 어디인가

**Stage 2 cycle 1-D-A-4-3 보강 1 정정 2 종료** = `/apply` Step1·2·3 광역 paradigm 광역 정수 정합 cycle.

광역 진행 history:
- cycle 1-D-A-4-2 (사이드바 폐기 + 단일 카드 + 톤앤매너 일관성 + 4 step 일괄 정정) ✅ push
- cycle 1-D-A-4-3 (Step3 paradigm 정정 + 발급증 폐기 + IssueGuideModal 신규) ✅ push
- cycle 1-D-A-4-3 정정 (첨부 서류 회수 + IssueGuideModal 갱신 + §32 신규) ✅ push
- cycle 1-D-A-4-3 보강 1 (전자본인서명확인서 단독 + 합니다체 + Step3 톤앤매너 일관성) ✅ push
- cycle 1-D-A-4-3 보강 1 정정 (검증 시점 paradigm + 입찰가 onChange raw 단독) ✅ push
- **cycle 1-D-A-4-3 보강 1 정정 2 (BidConfirmModal 신규 + Step2 강제 모달 paradigm)** ✅ push (commit `3a87632`)
- 다음 = **production 시각 검증 광역 수정사항 정정 paradigm** 🔥

### 본 세션 광역 push history (18 commit)

| commit | 영역 |
|---|---|
| `10ce64e` | cycle 1-D-A-4: /api/orders/check icn1 region 추가 (한국 IP source 정합) |
| `0f3d1ba` | cycle 1-D-A-4 진단: triggerLookup + ApplyClient console.log 추가 |
| `ecf3b82` | cycle 1-D-A-4 정정: ApplyClient JSX 구조 안정화 + Step1Property first-mount 가드 |
| `802b1d4` | cycle 1-D-A-4-2: 모바일 앱 form 정합 + 카피 정제 + 인증/manualEntry 광역 폐기 |
| `7093ad7` | cycle 1-D-A-4-2 paradigm 회수: 사이드바 폐기 + 단일 카드 + 4 step 일괄 정정 |
| `55a2372` | cycle 1-D-A-4-2: 톤앤매너 일관성 + 사진 4-col + amber 통합 + CTA rounded-xl |
| `658d468` | cycle 1-D-A-4-2: 텍스트 hierarchy + amber 박스 폐기 + word-break + single column |
| `b456262` | cycle 1-D-A-4-2 보강 1: ConfirmCaseModal + 확인 시각 UI 폐기 + Step1 CTA 폐기 |
| `78ebcf6` | cycle 1-D-A-4-2 보강 1: Step1 h2 + 카드 헤더 폐기 + 본문 CTA 폐기 |
| `2bb4029` | Step2 박스 paradigm 단순화 + 카피 차별화 |
| `a8d330d` | Step2 보강 2: 재경매 ? tooltip + 가격 inline 명료화 |
| `53b58e5` | cycle 1-D-A-4-2 final: modal 흐름 정정 + 가격 inline 정식 어휘 |
| `3fe7620` | cycle 1-D-A-4-3: Step3 paradigm 정정 + 발급증 폐기 + IssueGuideModal + Step2 h2 동시 정정 |
| `c23a05b` | cycle 1-D-A-4-3 정정: 첨부 서류 paradigm 회수 + IssueGuideModal 갱신 + §32 신규 |
| `8afeff2` | cycle 1-D-A-4-3 보강 1: 전자본인서명확인서 단독 + 합니다체 + Step3 톤앤매너 일관성 |
| `56de90d` | cycle 1-D-A-4-3 보강 1 정정: 입찰가 onBlur truncate + section 23/24 신규 |
| `5f0d2a5` | cycle 1-D-A-4-3 보강 1 정정: 검증 시점 paradigm 회수 + 입찰가 onChange raw 단독 |
| **`3a87632`** | **cycle 1-D-A-4-3 보강 1 정정 2: BidConfirmModal 신규 + Step2 강제 모달 paradigm** |

---

## 광역 paradigm 변동 정수 (본 세션 광역 정합 영구 명문화)

### 1. /apply 광역 구조 paradigm (cycle 1-D-A-4-2 paradigm 회수)

- **사이드바 영구 폐기** (ApplyPropertySidebar.tsx 광역 영구 삭제)
- **단일 카드 paradigm** = max-w-[640px] mx-auto + rounded-2xl + border-gray-200 + bg-white + p-5
- **모바일 + 데스크탑 동일 paradigm** (§A-12 정합)
- **4 step 일괄 정합** (Step1·Step2·Step3·Step4 광역 톤앤매너 일관성)

### 2. Step1 동의 step paradigm (cycle 1-D-A-4-2 보강 1)

- h2 페이지 헤더 = "사건 정보 확인" + sub "의뢰하실 사건 정보가 맞는지 확인해주세요"
- 단일 매칭 카드 = 카드 헤더 dom 영구 폐기 (sub로 흡수)
- 체크박스 = ConfirmCaseModal trigger 단독 paradigm
- modal "확인" → Step1 머무름 (setStep(2) 영구 폐기) / 사용자 직접 본문 CTA click → setStep(2)
- modal "취소" → checked 회복 + Step1 머무름
- backdrop·ESC 닫기 = 영구 폐기 (강제 모달 paradigm 정수)
- form.confirmedAt 백엔드 timestamp 보존 / "확인 시각 기록됨" UI 영구 폐기

### 3. Step2 입찰가 paradigm (cycle 1-D-A-4-3 보강 1 정정 + 정정 2)

- **검증 시점 paradigm** = 다음 CTA click 시점 단독 (mount + onChange + onBlur 자동 검증 영구 폐기)
- **attemptedNext state** = Step2BidInfo internal (다음 CTA click 시점 setAttemptedNext(true))
- **error 광역 표시** = `showErrors && errors[key]` 분기 (mount 시점 error 표시 0)
- **입찰가 input** = onChange raw 보관 단독 (truncate 영역 0) + onBlur handler 영구 폐기
- **truncateBidAmount utility** = `Math.floor(value / 10000) * 10000` (천원 이하 0 자동 절삭)
- **다음 CTA click 시점** = truncate + 검증 + (정합 시) BidConfirmModal pop paradigm
- **BidConfirmModal** = 입찰 금액 24px 강조 + 한글 표기 sub + "확인" → setStep(3) / "수정" → modal 닫힘 + bidAmount 보존

### 4. Step3 첨부 서류 paradigm (cycle 1-D-A-4-3 보강 1)

- **전자본인서명확인서 단독 paradigm** (인감증명서 + 본인서명사실확인서 양 서류 paradigm 영구 폐기)
- FileUpload 1개 (label "전자본인서명확인서" + description "정부24에서 발급한 PDF") + 신분증 사본 보존
- info 박스 = 첫 진입 사전 인지 paradigm (1줄 + button "발급 방법" → IssueGuideModal trigger)
- IssueGuideModal = 4단계 ol (주민센터 등록 + 정부24 PC 접속 + 발급 + 업로드) + PC 웹 안내 paragraph
- 어미 = 합니다체 단독 paradigm (~합니다 / ~돼요 → 영구 폐기)
- form field name `eSignFile` 변동 0 (백엔드 단독 paradigm)

### 5. 모달 3개 paradigm 분류 (§31 영구 룰 / cycle 1-D-A-4-3 보강 1 정정 2)

| 모달 | 영역 | paradigm |
|---|---|---|
| **ConfirmCaseModal** (Step1 / 동의) | 강제 paradigm | backdrop·ESC 닫기 영구 폐기 / "확인" + "취소" CTA |
| **BidConfirmModal** (Step2 / 검증) | 강제 paradigm | backdrop·ESC 닫기 영구 폐기 / "확인" + "수정" CTA |
| **IssueGuideModal** (Step3 / 정보) | 정보 paradigm | backdrop·ESC 닫기 보존 / "확인" 단독 CTA |

**Modal 토큰 광역 정합 (양 paradigm 공통)**:
- max-w-[480px] + rounded-2xl + p-6 + bg-white
- backdrop bg-black/50 + backdrop-blur-sm + px-5
- 헤더 18 black ink-900
- CTA 56 rounded-xl + brand-green text-white

### 6. 톤앤매너 일관성 paradigm (CLAUDE.md section 22)

- h2 광역 통일 = `text-2xl font-black tracking-[-0.015em] leading-[1.2] ink-900`
- 카드 paradigm 광역 통일 = rounded-2xl + border-gray-200 + bg-white + p-5
- 시각 위계 SCALE = 카드 16 ⊃ alert/info 12 ⊃ input/dropzone 10
- form 라벨 = `--label-fs-app` (16px) font-bold ink-900
- description = text-xs (12px) leading-5 ink-500
- 라벨 ↔ input gap = mb-2.5 (10px)

### 7. §32 백엔드 표현 프론트엔드 노출 0 paradigm (영구 룰)

- 내부 백엔드 표현 (timestamp / column name / status code / API code / 분류 코드 / field name) UI 노출 NG
- 어미 = 합니다체 단독 paradigm (요체 ~예요 / ~돼요 영구 폐기)
- 사용자 노출 어휘 = 마케터 paradigm 단독 + 평이한 한국어
- 자가 검증 = grep paradigm 의무

---

## CLAUDE.md 광역 명문화 영역 (section 18~27)

| section | 영역 |
|---|---|
| 18 | cycle 1-D-A-2 — /apply 모바일 앱 form paradigm 광역 전환 |
| 19 | cycle 1-D-A-3-2 — 크롤링 paradigm 광역 전환 |
| 20 | Step1 동의 step paradigm |
| 21 | Step3 첨부 서류 paradigm + 모달 분리 paradigm |
| 22 | Step1·Step2·Step3 광역 톤앤매너 일관성 paradigm |
| 23 | §32 백엔드 표현 프론트엔드 노출 0 paradigm (영구 룰) |
| 24 | Step2 입찰가 input paradigm |
| 25 | Step 광역 검증 시점 paradigm |
| 26 | §31 모달 paradigm 분류 광역 (영구 룰) |
| 27 | Step2 BidConfirmModal paradigm |

---

## 다음 세션 진입 paradigm 광역

### 진입 트리거

**형준님 = production 시각 검증 광역 수정사항 회신** → Code 광역 추가 정정 paradigm 진입.

### production 시각 검증 5단계 (직전 push `3a87632` 광역)

1. **Step2 진입 시점 = placeholder 노출 정합** ("최저가 39,200,000원 이상" 회색 paradigm)
2. **Step2 입찰가 사용자 입력 시점 = placeholder 영역 0 + 시각 보존** ("249990000" → "249,990,000" display)
3. **Step2 다음 CTA click 시점 = BidConfirmModal pop** ("249,990,000원" + "한글 표기: 2억 4,999만원" + "위 금액으로 입찰합니다." paragraph)
4. **BidConfirmModal "확인" → setStep(3) / "수정" → modal 닫힘 + bidAmount 보존 / backdrop·ESC 닫기 영구 폐기** 정합
5. **BidConfirmModal 토큰 광역 = ConfirmCaseModal paradigm 정합** (max-w + rounded + p-6 + bg + 헤더 18 black + CTA 56 rounded-xl + "수정" ghost paradigm)

### 다음 세션 paradigm 광역

1. 형준님 광역 production 시각 검증 광역 회수 + 수정사항 회신
2. Code 광역 분기 paradigm 식별 + 추가 정정 markdown 산출
3. push GO + production 시각 검증 재진입
4. 정합 시 = cycle 1-D-A-4-3 종료 + cycle 1-D-A-4-4 진입 paradigm

### cycle 1-D-A-4-4 영역 (후속 cycle 광역 / 작업 금지 영역 보존)

- Step4 §A-9 정합 4건 (체크박스 accent ink-900 → brand-green / dl grid-cols-2 → flex flex-col / dt 12 → 14 / dd 14 → 16)
- ApplyGuideModal:21 + Step4Confirm:233 광역 "전자본인서명확인서" 어휘 정합 (인감증명서 + 본인서명사실확인서 광역 폐기 사후 정합)
- 다른 sub-page 광역 요체 어미 → 합니다체 회수 paradigm
- Step1 sub / Step2 sub / Step2 tooltip / Step2 helper 광역 어미 paradigm 정합

---

## 작업 금지 영역 (영구 보존)

- 영구 룰 §9 / §29 / §31 / §32 / §A-9 / §A-12 위반
- court_listings schema 변동
- form field name eSignFile / bidAmount 광역 변동 (백엔드 단독 paradigm 보존)
- ConfirmCaseModal + BidConfirmModal + IssueGuideModal 광역 토큰 paradigm 변동
- backdrop·ESC 닫기 paradigm 변동 (모달 분류 paradigm 정수)
- truncateBidAmount utility 변동 (`Math.floor(value / 10000) * 10000` paradigm)
- formatKoreanWon utility 변동
- COURTS_ALL + isServiced 플래그 변동
- 사진 fetch paradigm 변동
- ApplyStepIndicator 하단 fixed bar paradigm 변동
- 신규 npm
- 매수신청 대리 규칙 §18 위반
- force push paradigm
- git revert paradigm

---

## 보존 영역 (paradigm 정수)

- 단일 카드 paradigm + max-w-[640px] mx-auto
- 시각 위계 SCALE (카드 16 ⊃ alert/info 12 ⊃ input/dropzone 10)
- 모바일 앱 form 토큰 5건 (--label-fs-app + --field-gap-app + --input-h-app + --cta-h-app + ink scale)
- ApplyClient JSX 구조 안정화 (cycle 1-D-A-4)
- Step1Property isFirstMountRef 가드 (cycle 1-D-A-4)
- attemptedNext state paradigm (검증 시점 paradigm)
- 다음 CTA click 시점 단독 검증 paradigm
- onChange raw 보관 + 다음 CTA click 시점 truncate paradigm
- BidConfirmModal pop paradigm (Step2 강제 모달 paradigm 정수)
- form.caseConfirmedAt 백엔드 timestamp 보존 (UI 노출 영구 폐기)
- manualEntry + PhoneVerifyModal 영구 폐기 paradigm
- 인감증명서 + 본인서명사실확인서 양 서류 paradigm 영구 폐기 (전자본인서명확인서 단독)
- 합니다체 단독 paradigm (요체 영구 폐기)
- formatKoreanWon + daysUntilBid + tierLabel 동적 logic
- 카드 wrapper paradigm (rounded-2xl + border-gray-200 + bg-white + p-5)

---

## 파일 변동 회수 (본 세션 광역)

### 신규 파일 (6 신규)

- `src/components/apply/ConfirmCaseModal.tsx` (Step1 강제 모달)
- `src/components/apply/IssueGuideModal.tsx` (Step3 정보 모달)
- `src/components/apply/BidConfirmModal.tsx` (Step2 강제 모달 / 본 push 신규)
- `src/lib/utils.ts` 광역 `truncateBidAmount` utility 신규

### 영구 삭제 파일 (5 삭제)

- `src/components/apply/ApplyPropertySidebar.tsx`
- `src/components/apply/PhoneVerifyModal.tsx`
- `src/components/apply/VerifiedBadge.tsx`
- `src/components/apply/CaseConfirmModal.tsx`
- `src/components/apply/CaseConfirmCard.tsx`
- `src/lib/auth/phoneVerify.ts` (+ src/lib/auth/ 디렉토리)

### 광역 정정 파일 (광역 변동)

- `src/components/apply/ApplyClient.tsx` (사이드바 폐기 + handleVerified 폐기 + max-w-[640px] wrapper)
- `src/components/apply/steps/Step1Property.tsx` (단일 카드 + 모달 trigger + 본문 CTA paradigm)
- `src/components/apply/steps/Step2BidInfo.tsx` (입찰가 paradigm + 검증 paradigm + BidConfirmModal mount)
- `src/components/apply/steps/Step3Documents.tsx` (전자본인서명확인서 단독 + info 박스 layered + 합니다체)
- `src/components/apply/steps/Step4Confirm.tsx` (h2 + dl paradigm + 카드 paradigm 정합 영역)
- `src/components/apply/steps/Step5Complete.tsx` (comment 정합)
- `src/components/apply/PhotoGallery.tsx` (4-col grid paradigm + variant props 폐기)
- `src/components/apply/FileUpload.tsx` (mb-2.5 + text-base + text-xs 정합)
- `src/components/apply/ApplyGuideModal.tsx` (comment 정합)
- `src/types/apply.ts` (manualEntry + verified 3종 + eSignCertFile 폐기)
- `src/app/api/orders/check/route.ts` (icn1 region + comment)
- `src/app/globals.css` (word-break: keep-all body level)
- `vercel.json` (icn1 region)
- `CLAUDE.md` (section 18~27 광역 명문화 + §31 + §32 영구 룰)

---

## 참조 문서

- `CLAUDE.md` (section 18~27 광역) — 본 세션 paradigm 광역 영구 명문화
- `src/components/apply/ConfirmCaseModal.tsx` — Step1 강제 모달
- `src/components/apply/BidConfirmModal.tsx` — Step2 강제 모달 (본 push 신규)
- `src/components/apply/IssueGuideModal.tsx` — Step3 정보 모달
- `src/components/apply/steps/Step1Property.tsx` — Step1 단일 카드 + 동의 step paradigm
- `src/components/apply/steps/Step2BidInfo.tsx` — Step2 입찰가 + 검증 시점 paradigm
- `src/components/apply/steps/Step3Documents.tsx` — Step3 전자본인서명확인서 단독 + layered paradigm

---

## 다음 세션 시작 paradigm

1. 형준님 광역 production 시각 검증 광역 수정사항 회신 회수
2. Code 광역 = 분기 paradigm 식별 + 검토 + 추천 paradigm 단독 (즉시 정정 NG)
3. Opus + 형준님 결정 lock 사후 = 정정 markdown 산출 + push GO paradigm
4. push 사후 production 시각 검증 재진입
5. 정합 시 = cycle 1-D-A-4-3 종료 + cycle 1-D-A-4-4 진입 paradigm
