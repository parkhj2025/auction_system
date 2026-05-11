# 경매퀵 웹사이트 핸드오프 문서

> **용도**: 다음 세션 진입 시 본 문서 단일 영역 광역 컨텍스트 영역.
> **최종 업데이트**: 2026-05-11 (cycle 1-E-B 종료 / 관리자 영역 4건 단독 갱신 push 정합)
> **현재 빌드 상태**: HEAD = `1df21f9` (cycle 1-E-B: 관리자 영역 4건 단독 갱신 / TopNav link + KakaoNotifyButton + 시각 토큰)
> **production URL**: https://auctionsystem-green.vercel.app
> **다음 세션 진입 트리거**: **형준님 = cycle 1-E-B production 시각 검증 광역 NG 회신 → cycle 1-E-A 사용자 마이페이지 갱신 진입**
> **함께 읽을 문서**: `CLAUDE.md` section 27~30 (Step2~6 + 관리자 paradigm 광역 명문화)

---

## 🔥 핫 스냅샷 — 다음 세션 시작 시 여기부터

### 지금 어디인가

**Stage 2 cycle 1-E-B 종료** = 관리자 영역 4건 단독 갱신 paradigm 정합. **cycle 1-E-A 사용자 마이페이지 갱신 진입 paradigm 대기**.

광역 진행 history (현재 세션):
- cycle 1-D-A-4-3 보강 1 정정 3 (BidConfirmModal 확인 click 사후 Step2 머무름) ✅ `5bb41ae`
- cycle 1-D-A-4-3 보강 1 정정 4 (입찰가 확정 CTA 분리 + Step3 진입 paradigm 회복) ✅ `71e0c9a`
- cycle 1-D-A-4-4 (Step4 광역 재구성 + ContractAgreement formal 5조 + SignatureModal 강제 모달) ✅ `df9e009`
- cycle 1-D-A-4-5 (Step4 paradigm 회수 + Step5Payment 신규 + conditional render) ✅ `70f0915`
- cycle 1-D-A-4-6 (Step4·5·6 광역 검수 + mockup default + 카피 + 카카오톡 단독) ✅ `5da323e`
- cycle 1-D-A-4-7 (NG 4건 정정 / 카피 + red 색감 + bidConfirmed drilling) ✅ `2bbe667`
- cycle 1-D-A-4-8 (NG 3건 정정 + Step3·4·5·6 시각 토큰 + Step1·2 sentinel 보존) ✅ `5430617`
- cycle 1-E-D (mockup 4건 cancelled / 형준님 수동 SQL) ✅ Supabase Dashboard
- cycle 1-E-C (OrderRow interface 정정 + PaymentStatus type) ✅ `48c27e7`
- **cycle 1-E-B (관리자 영역 4건 단독 갱신)** ✅ `1df21f9` 🔥
- 다음 = **cycle 1-E-B production 시각 검증 사후 NG 영역 → cycle 1-E-A 사용자 마이페이지 진입**

### 본 세션 광역 push history (10 commit / 2026-05-10 ~ 2026-05-11)

| commit | cycle | 영역 |
|---|---|---|
| `5bb41ae` | 1-D-A-4-3 보강 1 정정 3 | BidConfirmModal 확인 click 사후 Step2 머무름 paradigm |
| `71e0c9a` | 1-D-A-4-3 보강 1 정정 4 | 입찰가 확정 CTA 분리 + Step3 진입 paradigm 회복 |
| `df9e009` | 1-D-A-4-4 | Step4 광역 재구성 + ContractAgreement formal 5조 + SignatureModal 강제 모달 |
| `70f0915` | 1-D-A-4-5 | Step4 paradigm 회수 + Step5Payment 신규 + conditional render |
| `5da323e` | 1-D-A-4-6 | mockup default + 카피 + 카카오톡 단독 + 입금 마감 자동 표기 + 마이페이지 link 폐기 |
| `2bbe667` | 1-D-A-4-7 | 카피 정정 (입금 사후 + 카카오톡으로) + red 색감 정정 (입금 금액) + bidConfirmed ApplyClient drilling |
| `5430617` | 1-D-A-4-8 | NG 3건 (담백 카피 + 단일 paragraph 통합 + Step3·4·5·6 시각 토큰) + Step1·2 sentinel 보존 |
| `48c27e7` | 1-E-C | OrderRow interface 정정 (auction_round + payment_status + depositor_name + PaymentStatus type) |
| `1df21f9` | 1-E-B | 관리자 영역 4건 단독 갱신 (TopNav link + KakaoNotifyButton + 시각 토큰 + /api/admin 영역 0) |

### 핵심 paradigm 정수 광역 (cycle 1-D-A-4 + 1-E 광역)

1. **Step1·2 sentinel paradigm**: cycle 1-D-A-4-8 = Step1·2 시각 토큰 sentinel 보존 (회귀 NG 영역 0). 광역 정정 시점 = Step1·2 영역 0 보존 의무.
2. **bidConfirmed ApplyClient drilling**: cycle 1-D-A-4-7 = Step2BidInfo internal useState 회수 → `data.bidConfirmed` field 광역 (Step navigation 회귀 시점 보존 paradigm 정수).
3. **단일 source paradigm (Lessons [A]·[D])**: order_status_log = 단일 source / orders 테이블 column 광역 추가 영역 0. legal/contract.ts = 카피 단일 source (HTML preview 단독 / PDF generation 분리).
4. **mockup default paradigm**: cycle 1-D-A-4-6 = `DISPLAY_BANK = isConfigured ? env source : MOCKUP_BANK` 단일 paradigm. 사업자등록 사후 env 갱신 단독 (코드 영역 0).
5. **광역 산출 정합 + 신규 영역 단독 paradigm**: cycle 1-E-B = 직전 산출 광역 정합 식별 → 신규 영역 4건 단독 추가 (재 분리 영역 0).
6. **카피 단일 paragraph 통합 paradigm**: cycle 1-D-A-4-8 = "입금이 확인되면 알림과 함께 접수가 완료됩니다" 단일 paragraph (직역 "사후" + channel "카카오톡으로" 광역 폐기).
7. **시각 토큰 광역 paradigm (Step1·2 정합)**: 카드 = rounded-2xl + border-gray-200 + bg-white + p-5 / 카드 헤더 h3 = text-lg + tracking-tight + font-black + ink-900 / dt = text-sm + font-medium + ink-500 / dd = text-base + font-bold + ink-900.

### 다음 세션 진입 paradigm (즉시 진입 영역)

**옵션 A**: 형준님 production 시각 검증 (cycle 1-E-B 광역) NG 영역 회신 사후 정정 paradigm
- TopNav 진입 (admin user) = "관리자" link 표기 정합 검수
- TopNav 진입 (customer user) = "관리자" link 영역 0 검수
- /admin/orders/[id] = KakaoNotifyButton + 시각 토큰 정합 검수
- /admin/page.tsx + /admin/orders/page.tsx 추가 갱신 영역 단독 식별 의뢰

**옵션 B**: cycle 1-E-A 사용자 마이페이지 갱신 진입 paradigm (단계 분리 정수)
- /my/page.tsx + /my/orders/page.tsx + /my/orders/[id]/page.tsx 시각 토큰 정합 갱신 (Step1·2 sentinel 정합)
- OrderCard.tsx + StatusTimeline.tsx + DepositStatus.tsx 광역 검수
- 카피 정합 검수 (cycle 1-D-A-4-8 paradigm 정합 / "입금이 확인되면 알림과 함께 접수가 완료됩니다" 통합)

**옵션 C**: 형준님 수동 SQL 실행 (보존 의무)
- cycle 1-E-C SQL = pending 2건 status 정정 + cancelled log INSERT 보강 (Supabase Dashboard 직접 실행)

---

## 📊 cycle 1-D-A-4 광역 산출 정수 (Step1~6 + 모달)

### Step1·2·3 광역 (sentinel paradigm)

- Step1 = 사건 정보 확인 + ConfirmCaseModal (강제 모달 §31)
- Step2 = 입찰 정보 + BidConfirmModal (강제 모달 §31) + bidConfirmed ApplyClient drilling
- Step3 = 서류 업로드 + IssueGuideModal (정보 모달)
- **시각 토큰 = sentinel paradigm 정수** (cycle 1-D-A-4-8 = 광역 정정 영역 0 보존 의무)

### Step4 (위임 계약 + 서명)

- ContractAgreement.tsx = DelegationPreviewModal body component (serif + bordered + max-w-720)
- DelegationPreviewModal = 정보 모달 paradigm (backdrop·ESC 닫기 OK)
- "위임장 내용 보기" button = 미리보기 trigger
- 동의 체크박스 3건 (위임 계약 + 개인정보 + 약관)
- "✍ 서명하기" button = 위임 계약 동의 enable gate + SignatureModal trigger
- SignatureModal = 강제 모달 paradigm + body+html scroll lock + canvas touchAction:none + h-48
- 서명 사후 preview 카드 (h-20 image + "다시 서명" button)
- 수수료 inline (Step2 차용)
- "다음: 결제 →" CTA

### Step5 (결제·접수 / 신규)

- h2 = "신청 정보를 확인해주세요"
- 신청 정보 요약 + 입금자명 input (default = applicantName / 사용자 수정 가능)
- **mockup default 입금 안내 카드** = `DISPLAY_BANK = isConfigured ? env source : MOCKUP_BANK`
- 입금 마감 자동 표기 = `formatPaymentDeadline()` (매각기일 -1 영업일 + 오후 8시 + 요일)
- 안내 paragraph = "입금이 확인되면 알림과 함께 접수가 완료됩니다" 단일 통합
- "신청 접수 →" CTA → /api/apply submit

### Step6 (접수 완료)

- h2 leading-[1.2] = "신청이 접수되었습니다"
- 접수번호 (applicationId = GQ-YYYYMMDD-NNNN 친화 형식)
- mockup 입금 안내 재 표기 + 입금자명
- 안내 paragraph 분리 ("입금 마감까지 위 계좌로 입금해주세요" + "입금이 확인되면 알림과 함께 접수가 완료됩니다")
- "홈으로" link 단독 (마이페이지 link 폐기 / cycle 1-D-A-4-6 paradigm)

### 모달 광역 (영구 룰 §31 분류)

| 모달 | 분류 | 진입 |
|---|---|---|
| ConfirmCaseModal (Step1) | 강제 / 동의 paradigm | 체크박스 click |
| BidConfirmModal (Step2) | 강제 / 검증 paradigm | "입찰가 확정" CTA |
| IssueGuideModal (Step3) | 정보 (backdrop OK) | "전자본인서명확인서 발급 방법" link |
| DelegationPreviewModal (Step4) | 정보 (backdrop OK / max-w-720) | "위임장 내용 보기" button |
| SignatureModal (Step4) | 강제 / 서명 paradigm + scroll lock | "서명하기" button |
| PrivacyPreviewModal + TermsPreviewModal (Step4) | 정보 | "내용 보기" link |
| KakaoNotifyButton modal (admin) | 정보 (backdrop OK / max-w-[480px]) | "알림 보내기" button |

---

## 🛠 cycle 1-E 광역 산출 정수 (관리자 + DB schema)

### cycle 1-E-D (mockup 4건 cancelled) — 형준님 수동 SQL ✅

- Supabase Dashboard SQL Editor 직접 실행 paradigm
- mockup 케이스 광역 = UPDATE status='cancelled' + deleted_at=NOW() (soft delete + RLS 정합)

### cycle 1-E-C (OrderRow interface 정정) — Code 산출 ✅

- src/types/order.ts OrderRow interface 잔존 field 3건 추가
  - `auction_round: number` (Phase 6.7.6 column)
  - `payment_status: PaymentStatus` (cycle 1-D-A-4-5)
  - `depositor_name: string | null` (cycle 1-D-A-4-5)
- **PaymentStatus type 신규 export** (`"deposit_waiting" | "deposit_confirmed" | "refunded"`)
- orders 테이블 column 광역 추가 영역 0 (Lessons [A] 정합 / order_status_log 단일 source paradigm)

### cycle 1-E-B (관리자 영역 4건 단독 갱신) — Code 산출 ✅

| 영역 | 정수 |
|---|---|
| 영역 1 | UserMenu 관리자 link 신규 (profiles.role 정합 시점 단독 / border-t + font-bold 강조) |
| 영역 2 | KakaoNotifyButton 신규 component (modal pop + 전화번호·카피 copy button 광역) |
| 영역 3 | admin 광역 시각 토큰 정합 갱신 (Step1·2 paradigm + Field component dt/dd 광역) |
| 영역 4 | /api/admin/* route 영역 0 보존 (직전 /api/orders/[id]/status route 재사용) |

### 광역 산출 보존 (재 분리 영역 0)

- StatusChanger = 단일 source paradigm (dropdown + note + transition map)
- StatusLogHistory = timeline view 광역 정합
- middleware.ts admin 권한 검수 (profiles.role + is_admin() + ADMIN_PREFIXES)
- order-transitions.ts ALLOWED_TRANSITIONS map (단일 source paradigm)
- /api/orders/[id]/status route (isAdmin RPC + status 갱신 + log INSERT)

### cycle 1-E-A (사용자 마이페이지 갱신) — 미진입 대기 ⏳

**예상 영역**:
- /my/page.tsx + /my/orders/page.tsx + /my/orders/[id]/page.tsx 시각 토큰 정합 갱신 (Step1·2 sentinel paradigm)
- OrderCard.tsx + StatusTimeline.tsx + DepositStatus.tsx 광역 검수
- 카피 정합 검수 (cycle 1-D-A-4-8 paradigm 정합)
- 사용자 영역 취소 신청 paradigm 검수 (Phase 2 영역 추정 / Phase 1 영역 0 추천)

---

## 📁 영향 파일 광역 (cycle 1-D-A-4 + 1-E 광역)

### Apply flow 광역

- `src/components/apply/ApplyClient.tsx` (state shape + step 갱신 + bidConfirmed drilling)
- `src/components/apply/steps/Step1Property.tsx` (sentinel 보존)
- `src/components/apply/steps/Step2BidInfo.tsx` (sentinel 보존 + bidConfirmed drilling)
- `src/components/apply/steps/Step3Documents.tsx` (sentinel 보존)
- `src/components/apply/steps/Step4Confirm.tsx` (광역 재구성 / cycle 1-D-A-4-4/5/6/7/8)
- `src/components/apply/steps/Step5Payment.tsx` (신규 / cycle 1-D-A-4-5)
- `src/components/apply/steps/Step5Complete.tsx` (광역 재구성 / 마이페이지 link 폐기)
- `src/components/apply/ContractAgreement.tsx` (serif + bordered modal body)
- `src/components/apply/DelegationPreviewModal.tsx` (정보 모달 + max-w-720)
- `src/components/apply/SignatureModal.tsx` (강제 모달 + body+html scroll lock)
- `src/components/apply/BidConfirmModal.tsx` (강제 모달 / cycle 1-D-A-4-3 보강 1 정정 2~4)

### 단일 source + utility 광역

- `src/lib/legal/contract.ts` (계약서 카피 단일 source)
- `src/lib/calendar.ts` (영업일 계산 utility / Phase 1 = 주말 skip 단독)
- `src/lib/constants.ts` (MOCKUP_BANK + BANK_ACCOUNT + DISPLAY_BANK + APPLY_STEPS)
- `src/lib/order-status.ts` (status label 광역)
- `src/lib/order-transitions.ts` (ALLOWED_TRANSITIONS map / 단일 source)
- `src/lib/apply.ts` (computeFee + formatPhone + generateApplicationId)
- `src/types/apply.ts` (ApplyFormData.bidConfirmed + depositorName 신규)
- `src/types/order.ts` (OrderRow + PaymentStatus 신규 / cycle 1-E-C)

### Admin 영역 광역

- `src/app/admin/layout.tsx` + `/admin/page.tsx` + `/admin/orders/page.tsx` + `/admin/orders/[id]/page.tsx`
- `src/components/admin/AdminOrdersTable.tsx` + StatusChanger.tsx + StatusLogHistory.tsx + SsnDeleteButton.tsx + StatsCards.tsx
- **`src/components/admin/KakaoNotifyButton.tsx` (cycle 1-E-B 신규)**
- `src/lib/supabase/middleware.ts` (admin 권한 검수)
- `src/components/auth/UserMenu.tsx` (cycle 1-E-B isAdmin link)
- `src/app/layout.tsx` (getUserForNav profiles.role fetch)

### My 영역 (cycle 1-E-A 진입 대기)

- `src/app/my/layout.tsx` + `/my/page.tsx` + `/my/profile/page.tsx` + `/my/orders/page.tsx` + `/my/orders/[id]/page.tsx`
- `src/components/my/OrderCard.tsx` + StatusTimeline.tsx + DepositStatus.tsx + DocumentList.tsx + ProfileForm.tsx

### API 광역

- `src/app/api/apply/route.ts` (depositor_name + payment_status default)
- `src/app/api/orders/[id]/status/route.ts` (admin status 갱신 + log INSERT)
- `src/app/api/orders/[id]/generate-delegation/route.ts` (위임장 PDF 생성)
- `src/app/api/admin/*` 영역 0 (재사용 paradigm)

### DB 광역

- `supabase/schema.sql` (orders + order_status_log + profiles + documents 광역)
- `supabase/migrations/20260510_orders_payment_columns.sql` (cycle 1-D-A-4-5 신규)
- order_status_log 단일 source paradigm (cycle 1-E-C 정수)

### CLAUDE.md 광역 명문화

- section 20~27 = Step1~3 paradigm 광역
- section 28 = Step4 paradigm (cycle 1-D-A-4-8 시각 토큰 정정 + sentinel paradigm)
- section 29 = Step5Payment + Step5Complete paradigm (cycle 1-D-A-4-8 카피 통합 + 시각 토큰)
- section 30 = 관리자 paradigm (cycle 1-E-B / TopNav link + KakaoNotifyButton + 시각 토큰)

---

## 🔒 보존 의무 (영구 룰 + sentinel paradigm)

### Step1·2 시각 토큰 sentinel (cycle 1-D-A-4-8)

| 영역 | 토큰 | 회귀 NG 영역 |
|---|---|---|
| 카드 헤더 h3 | text-lg + font-black + tracking-tight + ink-900 | Step1:454 단일 baseline |
| dt label | text-sm + font-medium + ink-500 | Step1·2 광역 정합 |
| dd value | text-base + font-bold + ink-900 | Step1·2 광역 정합 |
| sub paragraph (h2 직후) | text-sm leading-6 ink-500 | Step1·2·3·4·5 광역 단일 |
| helper text (input sub) | text-xs ink-500 | Step1·2 광역 paradigm |

### 영구 룰 §1~§33 광역 정합

- §8: yellow 색감 영역 0 (cycle 1-D-A-4-4 정합)
- §9: red 색감 paradigm (가격 한정 + required marker + error / 정보 영역 NG)
- §10: PG 도입 영역 0 (Phase 10 사후 paradigm)
- §22: sidebar 영역 0 (모바일·데스크탑 동일 paradigm)
- §31: 모달 분류 (강제 vs 정보 / backdrop·ESC 닫기 분기)
- §32: 합니다체 단독 (요체 ~예요/~돼요/~해요 영역 0 의무)
- §A-2: production hex 추정 NG (var 단독 paradigm)
- §A-11: /apply = 매수신청 대리 단독 paradigm (분석·자문·투자 어휘 영역 0)
- §A-12: 데스크탑 = 모바일 동일 paradigm

### Lessons Learned [A]·[D] 정합

- [A] 이중 source paradigm 회피 (legal/contract.ts + order_status_log 단일 source)
- [D] DB 변경 워크플로우 (supabase/migrations/...sql + schema.sql 동시 commit)

---

## 📋 결정 사안 광역 history (push GO 분기)

### cycle 1-D-A-4-7 결정 사안 (NG 정정)

- bidConfirmed = ApplyClient drilling paradigm (Step2BidInfo internal 회수)
- red 색감 = 입금 금액 단독 정정 (입찰 희망 금액 보존)
- 시각 토큰 광역 정정 = 영역 단독 검수 paradigm (광역 정정 영역 0 보존)

### cycle 1-D-A-4-8 결정 사안 (sentinel)

- sub paragraph + helper + info 박스 = Step1·2 sentinel 보존 (영역 0 보존 GO)
- h3 + dt + dd = Step3·4·5·6 단독 정정 (Step1·2 paradigm 정합)
- Step3Documents = h3/dt/dd 영역 0 (정정 영역 0)

### cycle 1-E-C 결정 사안 (column 광역)

- orders 테이블 column 광역 추가 = 영역 0 (Lessons [A] 정합 / order_status_log 단독)
- OrderRow interface 정정 단독 + PaymentStatus type 신규
- 형준님 수동 SQL = pending 2건 + cancelled 4건 광역 log INSERT 보강 (Supabase Dashboard)

### cycle 1-E-B 결정 사안 (4건 단독)

- 영역 광역 = TopNav link + KakaoNotifyButton + 시각 토큰 갱신 + /api/admin 영역 0
- StatusChanger 정합 보존 (재 분리 영역 0)
- 모바일 반응형 = 관리자 = 데스크탑 단독 (광역 view 정수)
- 카카오톡 카피 = Code 자율 + 형준님 사후 검수

---

## 🚧 형준님 수동 실행 의뢰 (보존)

### 즉시 실행 의뢰

| # | 영역 | 시점 |
|---|---|---|
| 1 | cycle 1-E-C SQL (pending 2건 + cancelled 4건 광역 log INSERT 보강) | 미실행 시점 Supabase Dashboard 직접 실행 |

**SQL paradigm**:
```sql
DO $$
DECLARE rec RECORD;
BEGIN
  FOR rec IN SELECT id, status FROM orders WHERE status = 'pending' AND deleted_at IS NOT NULL LOOP
    UPDATE orders SET status = 'cancelled' WHERE id = rec.id;
    INSERT INTO order_status_log (order_id, from_status, to_status, changed_by, note)
    VALUES (rec.id, rec.status, 'cancelled', NULL, 'mockup test 회수 (cycle 1-E-C 정합 정정)');
  END LOOP;
  FOR rec IN SELECT id FROM orders WHERE status = 'cancelled' AND deleted_at IS NOT NULL
    AND id NOT IN (SELECT order_id FROM order_status_log WHERE to_status = 'cancelled') LOOP
    INSERT INTO order_status_log (order_id, from_status, to_status, changed_by, note)
    VALUES (rec.id, NULL, 'cancelled', NULL, 'mockup test 회수 (cycle 1-E-D 광역 회수)');
  END LOOP;
END $$;
```

### 사업자등록 사후 실행 의뢰 (보존)

| # | 영역 | 시점 |
|---|---|---|
| 1 | .env.local 갱신 (NEXT_PUBLIC_BANK_NAME / NEXT_PUBLIC_BANK_ACCOUNT_NUMBER / NEXT_PUBLIC_BANK_ACCOUNT_HOLDER) | 사업자등록 사후 단독 |
| 2 | Vercel env 갱신 (동일 3건) | 사업자등록 사후 + rebuild 트리거 |
| 3 | Supabase Dashboard SQL 실행 = mockup → 실제 운영 케이스 paradigm 분기 | 실 운영 시점 단독 |

---

## 🎯 다음 세션 진입 권고 흐름

### 사용자 직관 우선 paradigm (즉시 진입)

1. **형준님 production 시각 검증 회신 수신** (cycle 1-E-B 광역)
   - TopNav 관리자 link 정합 검수
   - /admin/orders/[id] KakaoNotifyButton + 시각 토큰 검수
   - NG 영역 단독 식별 사후 정정 paradigm 진입

2. **/admin/page.tsx + /admin/orders/page.tsx 시각 토큰 추가 갱신 영역 식별 의뢰**
   - 본 cycle 1-E-B = /admin/orders/[id] 단독 갱신
   - 추가 갱신 영역 = 형준님 식별 사후 진입 paradigm

3. **cycle 1-E-A 사용자 마이페이지 갱신 진입** (단계 분리 paradigm 정수)
   - 사전 검수 의뢰 → push GO → Code 산출 paradigm 흐름

### Code 사전 회신 영역 (다음 세션 즉시)

- 사용자 production 시각 검증 결과 회신 의뢰 (cycle 1-E-B 6단계)
- NG 영역 식별 → 정정 paradigm 추천 → push GO 사전 검수
- 광역 paradigm = "사용자 직관 우선 + Code 광역 grep 검수 + 단계 분리" 정수

---

## 🔧 자가 검증 의무 (push 사후 광역 paradigm)

### 표준 자가 검증 광역

- `pnpm tsc --noEmit` = 0 error
- `pnpm lint` = 0 신규 error (ReviewsMarquee:66 pre-existing 단독 보존)
- §32 합니다체 grep = 0건 (요체 어미 ~예요/~돼요/~해요)
- §A-2 production hex 추정 grep = 0건 (var 단독)
- "카카오톡 또는 SMS" + "카카오톡으로" 사용자 노출 grep = 0건 (jsdoc 잔존 영역 0)
- "입금 사후" 사용자 노출 grep = 0건
- "Phase 10" 사용자 노출 grep = 0건
- "/my/orders" + "/my" link 영역 = cycle 1-E-A 사후 단독 진입 영역
- **Step1·2 시각 토큰 sentinel 변동 0 grep** (회귀 NG 의무 검수)

### Lessons [D] DB 변동 광역

- supabase/migrations/...sql + schema.sql 동시 commit
- 형준님 Supabase Dashboard 직접 실행 paradigm
- order_status_log 단일 source 보존

---

## 📞 형준님 production URL + 검증 영역

- 메인: https://auctionsystem-green.vercel.app
- /apply: https://auctionsystem-green.vercel.app/apply
- /admin: https://auctionsystem-green.vercel.app/admin
- /admin/orders: https://auctionsystem-green.vercel.app/admin/orders
- /my: https://auctionsystem-green.vercel.app/my
- /my/orders: https://auctionsystem-green.vercel.app/my/orders

### 시각 검증 광역 paradigm (cycle 1-E-B)

| # | 단계 | 정합 기준 |
|---|---|---|
| 1 | TopNav admin user 진입 | UserMenu 안 "관리자" link 표기 (border-t + font-bold) |
| 2 | TopNav customer user 진입 | UserMenu 안 "관리자" link 영역 0 (사용자 영역 노출 영역 0) |
| 3 | /admin 진입 | dashboard 시각 토큰 (추가 갱신 영역 식별 의뢰) |
| 4 | /admin/orders 진입 | filter + table (추가 갱신 영역 식별 의뢰) |
| 5 | /admin/orders/[id] 진입 | 카드 광역 rounded-2xl + h2 text-lg + KakaoNotifyButton + Field component dt/dd 정합 |
| 6 | StatusChanger "cancelled" 전이 click | order_status 갱신 + log INSERT 정합 |
| 7 | KakaoNotifyButton click | modal pop (max-w-[480px] + 전화번호·카피 copy button 광역) |

---

## 🏁 종료 paradigm

cycle 1-E-B 광역 종료. 다음 세션 = 형준님 production 시각 검증 회신 + cycle 1-E-A 사용자 마이페이지 갱신 진입 단계 분리 paradigm 정수.
