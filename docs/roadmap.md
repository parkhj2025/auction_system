# 경매퀵 로드맵 (Phase 7 이후)

> **역할**: Phase별 상세 범위·진입 조건·완료 기준의 단일 소스. CLAUDE.md 섹션 17은 요약, 본 문서는 상세.
> **최종 업데이트**: 2026-04-21
> **근거 문서**: `CLAUDE.md` (원칙·본질), `경매_입찰대리_사업계획서_v1_3.md` (사업 전체 구조 + Phase 전환 기준)

---

## 우선순위 철학 (2026-04-21 형준님 확정)

- **원칙 1**: 디자인은 장식. 기능 완결 전에는 장식 최종 확정도, 장식 품질 측정도 무의미.
- **원칙 2**: Claude 디자인 + 피그마 문서 양식 활용한 시스템 적용은 마무리 작업.
- **원칙 3**: Lighthouse 같은 기술적 측정은 모든 것이 완성된 최종 관문.
- **원칙 4**: Claude Code와 Claude Cowork의 작업 경계 분리. 콘텐츠 생성 세부(두인옥션 파싱/크롤러/콘텐츠 생성 로직)는 Cowork. Claude Code는 Cowork 결과물을 웹페이지로 변환하는 역할만.
- **원칙 5**: 콘텐츠 내부 분류 라벨(섹션 구분/카테고리 분류 등)은 기술 스택. 고객 화면에 노출 금지. 제작 프로세스를 사업 자랑거리로 사용하지 않음.

---

## Phase 현황 (2026-04-21 기준)

| Phase | 상태 | 비고 |
|---|---|---|
| Phase 6.7.6 | 완료 | auction_round 스키마 + 본인인증 prefill + placeholder 경량화 |
| Phase 6.8 (1단계) | 완료 | Lighthouse 측정 스크립트 + 초기값 수집 |
| Phase 6.8 (2단계) | **Pause → Phase 9로 이월** | 임계값 확정. 축 2·3 미완 상태에서 박으면 재조정 반복 |
| Phase 7 | 진입 대기 | 축 2 콘텐츠 웹 반영 파이프라인 |
| Phase 8 | 대기 | 디자인 시스템 최종 확정 |
| Phase 9 | 대기 | 기술 관문 (Lighthouse 재개 포함) |
| Phase 10 | 대기 | Phase 1 론칭 준비 |

---

## Phase 7 — 축 2 콘텐츠 웹 반영 파이프라인

### 목적

Claude Cowork가 생성한 콘텐츠 결과물(HTML / 이미지 / 메타데이터 패키지)을 자사 웹사이트의 콘텐츠 페이지로 변환·발행하는 파이프라인 구축. 축 2(콘텐츠 허브)를 Phase 1 런칭 수준까지 완성.

### 범위 (Claude Code 작업)

- **콘텐츠 페이지 라우트 설계**: `/analysis/[slug]`, `/guide/[slug]`, `/news/[slug]`, `/notice/[slug]` 4종. 기존 frontmatter 기반 라우트 구조와 호환.
- **렌더링 컴포넌트**: Cowork 산출물(섹션별 구조·이미지·표·메타데이터)을 웹에 자연스럽게 노출. 섹션 내부 분류 라벨은 UI에 노출하지 않고 자연스러운 제목·태그로 번역.
- **콘텐츠 관리 워크플로우**: Cowork 결과물 수신 → 검수 → 발행 흐름. `content/` 디렉터리 구조 + `status: draft/published/archived` 전환.
- **메타데이터 처리**: 타이틀·디스크립션·Open Graph·canonical URL. SEO 최적화 세부는 Phase 9에서 수행(여기서는 필수 항목만).
- **홈·목록 페이지 통합**: 신규 콘텐츠가 자동으로 홈 캐러셀·`/analysis` 목록·사이드바 최신 글 위젯에 노출되도록 파이프라인 연결.

### 범위 밖 (Claude Cowork 영역)

- 두인옥션 PDF 파싱 / 정규화 로직
- 대법원·네이버 부동산·국토부 실거래가 크롤러 구현·운영
- 콘텐츠 생성 로직 (7섹션 원고·시세 비교·수익 시뮬 산출)
- 콘텐츠 편집·교정 워크플로우
- **UI에 콘텐츠 내부 분류 라벨 노출** (기술 스택이므로 고객에게 보이지 않음)

### 진입 조건

- Cowork 측에서 콘텐츠 결과물 패키지 스펙(파일 구조·frontmatter 스키마·이미지 경로 규약)을 확정·전달.
- 최소 1건의 샘플 콘텐츠 결과물이 수신되어 파이프라인 설계의 입력 기준이 마련됨.

### 완료 기준

1. Cowork 결과물을 `content/analysis/*.md`·`content/guide/*.md` 등에 배치하면 빌드 시 자동으로 `/analysis/[slug]` 등이 생성.
2. 샘플 콘텐츠 3건이 실제로 렌더링되고, 홈·목록·상세·사이드바에 자연스럽게 노출.
3. 내부 분류 라벨이 UI에 노출되지 않는지 `grep`로 확인.
4. `pnpm build` 0 에러 + dev 서버 시각 확인 + DevTools Console 0 에러.

---

## Phase 8 — 디자인 시스템 최종 확정

### 목적

기능이 완결된 상태에서 디자인 시스템을 일괄 적용. 서비스명 확정 후 컬러·폰트·UI 톤·컴포넌트를 Claude 디자인 + 피그마 양식 기반으로 확정하고, 기존 페이지와 Phase 7 콘텐츠 페이지에 일괄 반영.

### 범위

- **서비스명 공식 확정** (현재 "경매퀵" 가칭 상태).
- **디자인 문서 양식 선정**: Claude 디자인 + 피그마 중 플랫폼 결정. `memory/feedback_moving_target_docs.md` 정신대로, 문서와 실제 UI 괴리가 큰 플랫폼은 피함.
- **디자인 시스템 파생**: 컬러 토큰·폰트 페어링·UI 톤·컴포넌트 라이브러리. `BUILD_GUIDE.md` 토큰 업데이트.
- **일괄 적용**: 홈·`/apply`·`/analysis`·`/guide`·`/news`·`/notice`·마이페이지·FAQ 등 전 페이지. Phase 7에서 추가된 콘텐츠 페이지 포함.

### 진입 조건

- Phase 7 완료.
- 서비스명 후보 확정.
- 디자인 문서 양식 선정.

### 완료 기준

- 전 페이지에 디자인 시스템이 일괄 적용됨.
- 컬러 3색 동시 강조 금지·오렌지 금지 등 CLAUDE.md 절대 규칙 준수.
- dev 서버에서 주요 페이지 시각 확인.

---

## Phase 9 — 기술 관문 (최적화)

### 목적

Phase 6.8 2단계 재개. Lighthouse 임계값 확정 + Mobile 양극화 규명 + 기술 체크리스트 일괄 해결. 빌드 게이트로 이후 회귀 차단.

### 범위

- **Phase 6.8 2단계 재개**: `pnpm lighthouse` 재측정 → median 판정 → `.lighthouserc.json` 임계값 확정 → `scripts/lighthouse-audit.mjs`에 `--check-thresholds` exit code 추가.
- **Mobile 양극화 원인 규명** (기술부채 #13): Phase 6.8 1단계 Step 1에서 확인된 Mobile perf Run 2/3(96) vs Run 4/5(84~85) 이봉형 분포 원인 진단. Vercel edge/CDN 변동인지, 특정 리소스 지연인지 확정.
- **iOS Safari BrowserStack** (Phase 6.7.5 이월): 웹 접수 폼·PDF 미리보기 iOS Safari 검증.
- **빌드 게이트 차단 체계 가동**: `pnpm lighthouse --check-thresholds`를 빌드·배포 흐름에 연결 (수동 실행 또는 GitHub Actions 통합).
- **런칭 블로커 누적 해결** (`memory/project_launch_blockers.md`): Google OAuth 동의 화면 도메인 등.

### 진입 조건

- Phase 7·8 완료 (콘텐츠·디자인 변동 없는 안정 상태).

### 완료 기준

- Lighthouse 임계값 통과 (4 category × Desktop/Mobile + Core Web Vitals).
- Mobile 양극화 원인 확정 + 해결 또는 허용 범위 명시.
- iOS Safari 주요 경로 PASS.
- `pnpm lighthouse --check-thresholds` exit 0.

---

## Phase 10 — Phase 1 론칭 준비

### 목적

법률·행정 절차 완료 + 사업자 등록 + 보증보험 + 계좌이체 기반 실 운영 시작.

### 범위

- **법률 문서 최종 확정**: 이용약관·개인정보처리방침·전자금융거래약관 등.
- **사업자등록 완료**.
- **매수신청대리인 등록** (공인중개사법).
- **보증보험 가입** (서울보증보험).
- **국민신문고 회신** 처리.
- **계좌이체 운영 시작**: 전용계좌 개설 + 관제 체계.
- **Phase 1 런칭 공지** + 운영 개시.

### 진입 조건

- Phase 9 완료 (기술 안정성 확인).

### 완료 기준

- 첫 실 고객 접수 수임 완료 + 입찰 대리 실행 + 결과 통보 + 정산.

---

## Phase 2 전환 → v2 패키지

### 전환 조건

사업계획서 Phase 전환 기준: **인당 월 1,000만원 (수요 공급 초과 입증)**. 실무 의미: 월 약 140건 이상. 이 시점에 수동 운영이 고통스러워지고 시스템화가 필요해짐.

### v2 패키지 범위

Phase 1 MVP 대비 일괄 업그레이드:

| 영역 | Phase 1 (현재) | v2 업그레이드 |
|---|---|---|
| 결제 | 계좌이체 (전용계좌 안내) | PG사 연동 (카드·간편결제) |
| 본인인증 | Mock SDK | 실 SDK (NICE/KCB/다날 중 선정) |
| 알림 | 수동 카카오톡 1:1 | 카카오톡 알림톡 (접수/입찰/결과 자동화) |

상세 스펙·예상 비용·선정 기준은 [`docs/v2-package-spec.md`](v2-package-spec.md) 참조.

### v2 진입 조건

- Phase 1 수익 입증 (월 1,000만원/인).
- 월 비용이 정당화되는 실 운영 시스템 확인.
- 형준님 판단 (Claude Code는 진입 결정을 하지 않음).

---

## Phase 6.8 Pause 이력

### 완료된 산출물 (유지)

- `scripts/lighthouse-audit.mjs` (Desktop+Mobile, 4 category + Core Web Vitals)
- `pnpm lighthouse` 스크립트 등록
- `.lighthouse/` gitignore
- lighthouse 13.1.0 + chrome-launcher 1.2.1 devDep

### 이월된 작업 (Phase 9에서 재개)

- `.lighthouserc.json` 표준 포맷 임계값 확정
- `--check-thresholds` exit code 로직
- Mobile 양극화 원인 규명 (기술부채 #13)
- 개선 커밋(LCP/SEO/번들) 판정

### Pause 사유

- 축 2(콘텐츠) + 축 3(디자인) 미완 상태에서 임계값 박으면 Phase 7·8에서 발생하는 리소스·번들 변동 때문에 재조정 불가피.
- 측정은 변화가 끝난 시점에 수행하는 것이 효율적.
- Lighthouse 초기 측정값(Run 2/3/4/5 median: Desktop perf 80.5 / Mobile perf 90.5, LCP 양극화)은 `.lighthouse/summary-run{2..5}.json`에 보존 (gitignore로 repo에 커밋되지 않음, 본 기록으로만 남김).
