# Phase 6.7 Browser E2E Guide

> 경매퀵 /apply 플로우 데스크톱 + 모바일 브라우저 E2E 검증 실행 가이드. Phase 6.6 Supabase 검증 전면 PASS 이후 진입.
> **v1.0** | 2026-04-20

---

## 1. 배경

### Phase 6.6 PASS 요약
- SQL 4종 검증 완료: orders 최신 레코드 / `ssn_back` 컬럼 부재 / `delegation_pdf_path` 존재 / `property_snapshot` Phase 4-CONFIRM 4종
- Storage `delegations` 버킷 PDF 시각 검증 4종 PASS (한글·서명·인감·책임·retention)

### Phase 6.7 재정의
- 범위: **브라우저 E2E만** — 데스크톱 Chrome + 모바일 Chrome + 모바일 Safari
- 제외: 네이티브 앱 빌드 (Phase 1 론칭 후 별도 로드맵, PWA/WebView 래핑 방식 추후 판정)
- 제외: 카카오 인앱 WebView (Phase 8 별도 기술부채로 이월)

### 결제 플로우 고지
본 E2E는 **접수 데이터 저장까지만** 검증. Step5 제출 시 PG 결제 호출부 없음 (`/api/apply/route.ts`는 단순 orders insert + Storage 업로드). 결제 PG 연동은 Stage 2C 진입 후 추가 예정.

### Lessons Learned [C] 준수
본 가이드는 작성 전 전제 실재 검증 8건(+ 2차 2건)을 선행하여 Google OAuth / Mock 인증 / BrowserStack 30분 / 결제 없음 / Storage 2버킷 구조를 확정한 후 작성됨.

---

## 2. 모바일 접속 셋업 (로컬 IP + HTTP)

현재 /apply 플로우는 `getUserMedia` 카메라 API 등 **HTTPS 필수 브라우저 API를 사용하지 않으므로 ngrok 터널링 불필요**. 로컬 IP에 HTTP 평문으로 직접 접속.

### 사전 조건
- 휴대폰과 PC가 **같은 Wi-Fi**에 연결
- PC 방화벽 포트 3000 인바운드 허용 (Windows Defender Firewall: Node.js 허용)

### PC 로컬 IP 확인
- **Windows**: PowerShell 또는 cmd에서 `ipconfig` → 무선 LAN 어댑터 섹션 `IPv4 주소`
- **macOS**: 터미널에서 `ipconfig getifaddr en0` (Wi-Fi 어댑터)

### dev 서버 기동 (2가지 명령 병기)
- 권장: `pnpm dev -H 0.0.0.0` (pnpm이 추가 인자를 `next dev`로 pass-through)
- 대체: `pnpm exec next dev -H 0.0.0.0` (script 우회, 가장 확실)

### 폰 접속
- 주소창에 `http://<PC-IP>:3000` 입력 (예: `http://192.168.0.12:3000`)
- PWA 아님: 홈 화면 추가 시 일반 웹 북마크로 동작

### 참고
- ngrok 불필요 (카메라/HTTPS API 없음)
- IP가 변경되면 Supabase Auth Additional Redirect URLs도 갱신 필요 (섹션 3.1)

---

## 3. 사전 준비

### 3.1 Supabase Auth URL 설정
- Supabase Dashboard → **Authentication → URL Configuration**
- **Site URL**: `http://localhost:3000` (기존)
- **Additional Redirect URLs**에 다음 3개 등록:
  - `http://localhost:3000/auth/callback`
  - `http://<PC-IP>:3000/auth/callback` ← 모바일 IP 접속용 (동적 IP이므로 세션마다 갱신 주의)
  - `https://<your-domain>/auth/callback` (프로덕션)
- Save 후 반영 5초 대기

### 3.2 Google Cloud Console OAuth 설정 확인
- Google Cloud Console → **APIs & Services → Credentials → OAuth 2.0 Client IDs**
- **Authorized redirect URIs**에 Supabase 고정 콜백 URL이 등록되어 있는지 확인:
  - `https://<supabase-project-ref>.supabase.co/auth/v1/callback`
- **중요**: Supabase가 OAuth를 프록시하므로 **모바일 IP를 Google 콘솔에 추가할 필요 없음**. 모바일 IP는 Supabase Auth Additional Redirect URLs에만 추가.

### 3.3 테스트 계정
- 형준님 Google 계정 (dev 환경 `auth.users` 등록 계정)

### 3.4 테스트 데이터
- **인천지방법원 + 실존 사건번호 1건**: `court_listings` 테이블에 `is_active=true` + 미래 `bid_date` 조건 충족. 매칭 경로 검증용.
- **가상 사건번호 1건**: API 매칭 0건 반환. manualEntry 경로 검증용.
- **Step3 업로드 파일**:
  - eSignFile (전자본인서명확인서 PDF, ≤10MB) ← 서버 필수
  - idFile (신분증 PDF/이미지, ≤10MB) ← 서버 필수
  - eSignCertFile (발급증, 선택) ← 서버 선택 (UI는 3종 칸 표시, 서버는 2종만 필수)

---

## 4. E2E 7단계 체크리스트

### 단계 1 — 홈 → Google 로그인
- [ ] 홈 (`/`) GNB CTA "입찰 대리 신청" 클릭
- [ ] `/login` 이동 → "Google로 계속하기" 버튼 표시
- [ ] 클릭 → Google OAuth 팝업/리다이렉트
- [ ] Supabase `/auth/v1/callback` 경유 → `/auth/callback?redirect=<url>` → `/apply` 이동
- [ ] redirect 파라미터 정상 동작 (`startsWith("/")` 검증 — [src/app/login/page.tsx:31](../src/app/login/page.tsx#L31))

**진단 실패 시**:
- Supabase Additional Redirect URLs에 현재 PC-IP 등록되어 있는지 (3.1)
- Google Cloud Console에 Supabase 고정 콜백 URL 등록되어 있는지 (3.2)
- 네트워크 탭에서 `/auth/v1/callback` 응답 상태 확인

---

### 단계 2 — Step1 매칭 경로
- [ ] 법원 "인천지방법원" 디폴트 선택 확인
- [ ] 실존 사건번호 입력 → [/api/orders/check](../src/app/api/orders/check/route.ts) 호출
- [ ] 매칭 결과 listings 1건 이상 표시 (property_snapshot 자동 채움)
- [ ] CaseConfirmModal **미노출** (매칭 시 `caseConfirmedByUser` 즉시 true)
- [ ] UX 무언화 어휘 검증 ([CaseConfirmModal.tsx](../src/components/apply/CaseConfirmModal.tsx) 자체는 네거티브 어휘 0건 PASS 확인 완료)

**진단 실패 시**: Network 탭에서 `/api/orders/check` 응답 확인 (`{ available: true, listings: [...] }`)

---

### 단계 3 — Step1 manualEntry 경로
- [ ] 가상 사건번호 입력 (API 매칭 0건)
- [ ] `manualEntry: true` 자동 전환 ([Step1Property.tsx:161](../src/components/apply/steps/Step1Property.tsx#L161))
- [ ] CaseConfirmModal **강제 노출**:
  - [ ] X 버튼 없음
  - [ ] 배경 클릭 무동작 ([CaseConfirmModal.tsx:123](../src/components/apply/CaseConfirmModal.tsx#L123) `stopPropagation`)
  - [ ] Esc 키 차단 ([CaseConfirmModal.tsx:75-78](../src/components/apply/CaseConfirmModal.tsx#L75-L78) `preventDefault`)
- [ ] 입력 필드 3종: bidDate / propertyType (9종 select) / propertyAddress
- [ ] 책임 체크박스 ON 상태에서만 "확인" 활성화
- [ ] "확인" 버튼으로만 모달 해제 — `caseConfirmedAt` 기록 시점
- [ ] "사건번호 수정" 버튼으로 Step1 입력 화면 복귀 가능 (Phase 6.3 회귀 수정)

**진단 실패 시**: CaseConfirmModal.tsx Esc/배경 이벤트 차단부 확인, Step1Property.tsx manualEntry 분기

---

### 단계 4 — Step2 입찰 정보 입력 (Mock 인증)
- [ ] bidAmount 입력 (콤마 포맷)
- [ ] applicantName / phone / ssnFront(6자리) / ssnBack(7자리 password) 입력
- [ ] [PhoneVerifyModal](../src/components/apply/PhoneVerifyModal.tsx) 노출 — **Mock 단계**
  - [ ] 성명 입력 (initialName 기본 채움)
  - [ ] 휴대폰번호 입력 (010-0000-0000 형식 자동 포맷)
  - [ ] "인증 완료" 버튼 클릭 1회 → 500ms delay 후 무조건 성공 ([phoneVerify.ts:58-69](../src/lib/auth/phoneVerify.ts#L58-L69))
  - [ ] SMS 수신 절차 없음 (실 통신사 인증은 Stage 2C 사업자등록 후 활성)
- [ ] Mock 단계 표시 하단 문구 확인: "현재 mock 단계 — 실제 통신사 인증은 사업자등록 후 활성화됩니다."

**진단 실패 시**: [phoneVerify.ts](../src/lib/auth/phoneVerify.ts) Mock 본문 확인, PhoneVerifyModal 모바일 layout

---

### 단계 5 — Step3 서류 업로드 (order-documents 버킷)
- [ ] eSignFile (전자본인서명확인서 PDF) 업로드 — **서버 필수**
- [ ] idFile (신분증 PDF/이미지) 업로드 — **서버 필수**
- [ ] eSignCertFile (발급증) 업로드 — **서버 선택**
- [ ] 10MB 초과 파일 테스트 → 클라이언트 에러 메시지 표시
- [ ] 잘못된 확장자 테스트 → 클라이언트 에러 메시지 표시
- [ ] 모바일에서 파일 선택기 동작 (카메라/갤러리/파일 선택 OS 다이얼로그)
- [ ] 제출 후 Storage 버킷 경로 확인:
  - `order-documents/<user_id>/<order_id>/esign_<ts>.<ext>`
  - `order-documents/<user_id>/<order_id>/id_<ts>.<ext>`

**진단 실패 시**: [FileUpload.tsx](../src/components/apply/FileUpload.tsx) accept 속성 + size 검증, Supabase Storage RLS 정책 (user.id 경로 프리픽스 필수)

---

### 단계 6 — Step4 터치 서명 + PDF 미리보기
- [ ] [SignatureCanvas](../src/components/apply/SignatureCanvas.tsx) 터치 서명 (모바일 손가락 / 데스크톱 마우스)
- [ ] 빈 서명 시 제출 버튼 disabled
- [ ] Clear 버튼 동작 확인
- [ ] "위임장 미리보기" 클릭 → [PDFPreviewModal](../src/components/apply/PDFPreviewModal.tsx) 노출
- [ ] [/api/preview-delegation](../src/app/api/preview-delegation/route.ts) POST 호출 (ssnBack + signatureDataUrl 전송)
- [ ] iframe + blob URL에 PDF 렌더 확인 (한글 폰트 + 서명 이미지 임베드)
- [ ] 모바일 iOS Safari: iframe PDF 네이티브 뷰어 렌더 확인
- [ ] 모바일 Android Chrome: iframe PDF 뷰어 또는 다운로드 프롬프트 확인
- [ ] 모달 배경 클릭/Esc 취소 동작

**진단 실패 시**:
- 서버: `/api/preview-delegation` 응답 status, Content-Type `application/pdf`
- 클라: Uint8Array → Blob 변환 ([PDFPreviewModal.tsx:37-41](../src/components/apply/PDFPreviewModal.tsx#L37-L41))
- 모바일 Safari: WebKit canvas devicePixelRatio 이슈 → SignatureCanvas 픽셀 비율 확인

---

### 단계 7 — Step5 제출 → orders 저장 (delegations 버킷 자동 생성)
- [ ] 최종 동의 체크박스 확인
- [ ] 제출 버튼 클릭 → [/api/apply](../src/app/api/apply/route.ts) POST (FormData)
- [ ] 서버 검증 9종: caseNumber / applicantName / phone / ssnFront / bidAmount / eSignFile / idFile / bidDate / caseConfirmedAt
- [ ] RPC `is_case_active()` 중복 확인 (`23505` UNIQUE INDEX 2차 방어)
- [ ] `orders` INSERT + Storage **order-documents** 버킷에 esign/id 2종 업로드
- [ ] `documents` 메타 INSERT 2종 (esign, id_card)
- [ ] `order_status_log` 초기 row = DB 트리거 자동 생성
- [ ] 서버 자동 트리거: [/api/orders/[id]/generate-delegation](../src/app/api/orders/[id]/generate-delegation/route.ts)로 위임장 PDF 생성 → Storage **delegations** 버킷에 `<user_id>/<order_id>/delegation-*.pdf` 저장 → `orders.delegation_pdf_path` 업데이트
- [ ] 응답: `{ ok: true, applicationId, orderId }`
- [ ] 완료 화면 표시 (applicationId 노출)
- [ ] Supabase Dashboard에서 orders 최신 레코드 확인 (Phase 6.6 SQL 1번 재실행)
- [ ] Storage 양쪽 버킷 확인:
  - `order-documents` (Step3 파일 2종)
  - `delegations` (위임장 PDF 1건)
- [ ] 결제 플로우는 **없음** — Stage 2C 진입 후 PG 연동 추가 예정

**진단 실패 시**:
- [/api/apply/route.ts](../src/app/api/apply/route.ts) 서버 로그 (`console.error`)
- Storage RLS 정책 (user.id 경로 프리픽스 필수)
- `order_status_log` 트리거 동작
- `23505` 에러 시 이미 해당 `case_number` + 활성 status 있음 (SQL로 확인)

---

## 5. Console 에러 0건 검증 (필수)

CLAUDE.md Lessons Learned [C] 3번 자가 검증 의무 사항.

### 환경별 확인 방법
- **데스크톱 Chrome**: F12 → Console 탭 → 7단계 끝까지 에러 0건
- **모바일 Android Chrome**: PC Chrome에서 `chrome://inspect` → "inspect" → DevTools Console (USB 디버깅 필요)
- **모바일 iOS Safari (BrowserStack)**: 원격 DevTools Console
- **대안**: eruda 주입 — HTML에 `<script src="//cdn.jsdelivr.net/npm/eruda"></script>` 임시 추가 후 `eruda.init()` 호출
  - **주의: eruda 주입은 로컬 dev 전용. 커밋 금지.**

### 허용 예외 (non-critical)
- React DevTools 감지 경고 (dev 환경 기본)
- Supabase Auth 정상 상태 info log
- Google OAuth redirect 중간 log

### 위반 시
0건 아니면 Phase 6.7 실패 → 회귀 fix 별도 커밋 (Phase 6.5-POST-FIX 수준)

---

## 6. 모바일 플랫폼별 알려진 이슈 진단 포인트

### iOS Safari
- **WebKit canvas devicePixelRatio**: SignatureCanvas 픽셀 비율 (1 vs 2 vs 3) 서명 좌표 이슈
- **PDF iframe**: 일부 Safari는 iframe에 PDF 직접 표시 불가 → 다운로드 프롬프트 케이스
- **100vh 이슈**: Safari 주소창 때문에 풋터 잘림 → `dvh`/`svh` 대응 확인

### Android Chrome
- **파일 선택기**: "카메라/갤러리/파일 선택" OS 다이얼로그 (Step3 업로드)
- **PDF iframe**: 다운로드/별도 뷰어 앱 호출 케이스

---

## 7. iOS Safari BrowserStack 절차 (무료 Live 30분)

### 가입
- https://www.browserstack.com/users/sign_up → 무료 체험
- 공식 무료 Live **30분 총합** (BrowserStack 공식 FAQ 확인)
- 신용카드 필요 여부: 가입 시점 공식 페이지 확인 (공식 문서상 명시 불명)

### 소요 시간 추정
7단계 E2E **12-16분** (30분 내 완주 가능):
- 로그인: 1분
- Step1~3 입력: 4분
- Step4 서명/PDF: 3분
- Step5 제출: 2분
- 디버깅 여유: 2-3분

### 디바이스 선택
- Live → iOS → **iPhone 1대 고정** (권장: iPhone 15 / Safari)
- **디바이스 전환 시 30분 빠르게 소진** → 절대 전환 금지

### Idle Session Timeout
- BrowserStack Live 기본 idle timeout 있음 (30초-1분 이상 무활동 시 세션 종료 가능)
- 입력 중 주의, 세션 설정에서 타임아웃 조정 가능

### BrowserStack Local 터널 (로컬 접속용)
- Windows: `BrowserStackLocal.exe --key <ACCESS_KEY>`
- macOS: `./BrowserStackLocal --key <ACCESS_KEY>`
- 터널 연결 후 BrowserStack Live 브라우저에서 `http://<PC-IP>:3000` 진입

### Round 분할 (예비 전략)
30분 이내 완주 권장. 예상 외 디버깅으로 시간 초과 시 분할:
- **Round 1 (Step 1~3)**: 로그인 + Step1 매칭/manual + Step2 Mock 인증
- **Round 2 (Step 4~7)**: 서명 + PDF 미리보기 + 제출

### 기록
세션 종료 전 스크린샷/비디오 기록 (Phase 6.7 보고용)

---

## 8. 자가 검증 4종 (CLAUDE.md Lessons Learned [C])

| # | 항목 | 통과 조건 |
|---|------|----------|
| [1] | dev 서버 기동 | `pnpm dev -H 0.0.0.0` 또는 `pnpm exec next dev -H 0.0.0.0` 터미널 에러 0 |
| [2] | 핵심 UI 경로 렌더 | 7단계 체크리스트 전 통과 |
| [3] | DevTools Console 에러 0건 | 데스크톱 + 모바일 Android + 모바일 iOS 3개 환경 |
| [4] | 시각적 산출물 확인 | PDFPreviewModal iframe + 제출 후 orders 레코드 Dashboard |

**4종 중 1개라도 미통과 시 "Phase 6.7 완료" 보고 금지.**

---

## 9. Phase 6.7 결과 보고 템플릿

### 환경별 PASS/FAIL 표

| 환경 | Step 1 | Step 2 | Step 3 | Step 4 | Step 5 | Step 6 | Step 7 |
|------|--------|--------|--------|--------|--------|--------|--------|
| 데스크톱 Chrome | | | | | | | |
| 모바일 Android Chrome | | | | | | | |
| 모바일 iOS Safari (BrowserStack) | | | | | | | |

(분할 시 Round 1/2 별도 표기)

### Console 에러 목록
- 데스크톱: (목록 또는 "0건")
- Android: (목록 또는 "0건")
- iOS: (목록 또는 "0건")

### 스크린샷 (3장 이상)
- Step4 PDF 미리보기 iframe — 모바일 Android
- Step4 PDF 미리보기 iframe — 모바일 iOS
- 제출 완료 화면 — applicationId 노출

### 잔여 회귀 이슈
(있다면 → Phase 6.7.5 fix 커밋 계획)

---

## 10. 작업 금지 (Phase 6.7 한정)

- HANDOFF.md / staged-jumping-star.md 손대지 말 것 (Phase 6.8 일괄 리프레시)
- `/terms` "변호사 검토 전 초안" 표기 변경 금지
- [src/lib/legal.ts](../src/lib/legal.ts) 본문 변경 금지
- 본 가이드 문서 외 코드/스키마 변경 금지 (회귀 발견 시 별도 fix 커밋)

---

## 다음 단계

E2E 결과 보고 수신 후 Phase 6.8 (Lighthouse + 빌드 게이트 + Stage 2B 종료 보고) 진입 판정.
