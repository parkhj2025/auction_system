# Phase 7 단계 3-1 ~ 4-2 핸드오프 문서

작성일: 2026-04-26
최종 commit: `13ee69d`
origin/main 동기화: ✓
다음 진입점: **형준님 G6 시각 시연 결과 보고**

---

## 0. 현 상태 한눈

| 항목 | 상태 |
|---|---|
| 최종 commit | `13ee69d [step 4-2] Gemini 역할 확장: 시나리오 정합성 → 콘텐츠 2차 감시자` |
| origin/main | 동기화 ✓ |
| 라우트 동작 | `/analysis/2024타경540431` HTTP 200 / `/analysis/2024타경580569` HTTP 200 |
| /analysis 인덱스 | 2건 표시 |
| 정합성 검증 백엔드 | Gemini 3.1 Pro Preview + thinking_level "high" |
| 정합성 검증 호출 | 본문+frontmatter 1회 통합 (5 책임 통합) |
| 다음 시연 게이트 | **G6** (desktop + mobile, 2 사건) |

---

## 1. 단계 진행 이력 (이번 세션)

### 단계 3-1 G1 보강 (`2615e7d`)
- preview prototype → /analysis/[slug] 라우트 통합
- Hero 4-stat grid + Hero gallery thumbnail strip
- Sidebar 4 block sticky (핵심 수치 / CTA / TOC / 근거자료)
- Trust 4-grid + ApplyCTA 3-column fee/success/fail
- mdx Img → null (본문 인라인 사진 차단)
- del/s passthrough (취소선 차단)
- remark-gfm `singleTilde:false`
- SectionHeader badge 폐기 (sub-label chip 0)
- Hero h1 `text-6xl font-extrabold`
- 표 horizontal lines + tabular-nums + Tr 행 색 분기
- ScenarioCard / ConclusionCallout / CheckpointList (remark plugin)

### 단계 3-2 Plan (`docs/phase7/step3-2-plan.md`, 502줄)
- Plan 산출 1건. 코드 변경 0.

### 단계 3-3 Build (`51a0314`)
- publish CLI v3.6 — Cowork v2.6.2 schema 흡수 + content/{slug}.meta.json 동행 출력
- 신규 컴포넌트 7건:
  - TimelineSection, RightsCallout, MarketCompareCard, ScenarioCardsBoard, AuctionStatsGrid, PhotoGalleryStrip, ComplianceFooter
- AnalysisMeta 타입 + getAnalysisMeta 어댑터
- mdx-components H2 dispatcher 가 meta·fm 인자 수신 → SectionXX 직후 신규 컴포넌트 자연스러운 흐름 삽입

### 단계 3-4 정리 (`01c557f`)
- 베타 4건 + 567436 v2.6.2 폐기 (PDF 첨부 어휘 잔존 사유)
- v2.7 산출 단독 검증 환경 준비
- 신규 컴포넌트 7건 + publish CLI 보존

### 단계 3-5 Build (`547e188`)
- Lightbox + Modal 자체 구현 (의존성 0, ESC + ←→ 키보드)
- PhotoGalleryStrip + HeroGallery 라이트박스 통합
- PropertyOverviewCard 신설 (8필드 카드 + 모달 14필드)
- ScenarioCardsBoard 4 카드 압축 + 모달
- mdx-components ScenarioCard wrap (단계 3-1) 보존
- publish CLI 정합성 검증 5% 임계 매칭 알고리즘 추가

### 단계 3-5-fix (`ded40a7`)
- slug = raw-content 디렉토리명 그대로 (분류 부호 정규식 매칭 0)
- publish CLI `--all` 모드 + scanCaseDirs() + 일괄 publish dispatcher
- 한글 slug 라우트 호환 (3중 fix):
  - `dynamicParams = true`
  - `safeDecode(rawSlug)` (Next.js 16 percent-encoded 명시 디코딩)
  - `generateStaticParams` + `getAnalysisBySlug` 양측 `.normalize("NFC")` (NFD/NFC 차이 해결)

### 단계 3-5-fix-3 (`98c206f`)
- 정합성 검증 5% 임계 매칭 폐기 → Claude Opus 자체 판단 (Anthropic API)
- ANTHROPIC_API_KEY 환경변수 필수
- `--force` 플래그의 정합성 우회 폐기

### 단계 3-5-fix-4 (`985a921`)
- LLM 백엔드: Anthropic → **Gemini 3.1 Pro Preview**
- thinking_level "high" + responseSchema 강제 JSON 출력
- 환경변수: ANTHROPIC_API_KEY → **GEMINI_API_KEY** (`.env.local` 자동 로드)
- 580569 시나리오 C-2 ADJUSTED 1건 ("13년" → "13.1년" 표 진실값 정합)

### 단계 4-1 (`e0b8779`)
- 05 시나리오 카드 색상·아이콘 매핑:
  - A=실거주(Home·blue) / B=단기매도(TrendingUp·orange) / C-1=전세갭투자(Users·purple) / C-2=월세운용(RefreshCw·green)
- 540431 disabled 케이스 (Ban 아이콘 + "본 사건 적용 불가" chip)
- 시나리오 라벨 정규화 (transformBody in-memory)
- splitScenarioTitle 정규식 fix (em-dash 만 separator, ASCII hyphen 매칭 폐기)
- ComplianceFooter 폐기 → ContentComplianceNotice 신설 (산문 1단락, text-xs 회색)
- 위치: 07 종합 의견 직후, "함께 보면 좋은" 직전

### 단계 4-2 (`13ee69d`)
- Gemini 책임 확장: 시나리오 정합성 → **콘텐츠 2차 감시자 (5 책임 통합)**
- LLM 호출 4회 → **1회** (본문 전체 + frontmatter 통합 입력)
- CONTENT_SUPERVISOR_SYSTEM_PROMPT — 5 책임:
  1. 정합성 (한 줄 요약 ↔ 표 ↔ 산문)
  2. 데이터 누락 보강 (frontmatter 빈 필드 본문 추출)
  3. 어휘 순화 (비표준 전문용어 → 일반어)
  4. 표·산문·frontmatter 일관성
  5. 금지 어휘 검증 (분류·판정·데이터 처리 어휘)
- meta 필드: `consistencyAdjustments` → `supervisorAdjustments` (category 기반)
- supervisorContent({ body, frontmatter, slug, caseNumber }) 1회 호출

---

## 2. 핵심 파일·아키텍처

### 라우트
- `src/app/analysis/[slug]/page.tsx` — Next.js dynamic route + Korean slug 호환
- `src/app/analysis/page.tsx` — 인덱스
- 라우트 옵션: `dynamicParams = true` + `safeDecode` + NFC normalize

### 컴포넌트 (단계 3-1 ~ 4-1 산출)
- `src/components/analysis/DetailHero.tsx` — h1 위계 + 4-stat + Hero gallery
- `src/components/analysis/HeroGallery.tsx` — Hero 본문 하부 thumbnail strip + Lightbox
- `src/components/analysis/DetailSidebar.tsx` — sticky 4 block
- `src/components/analysis/PropertyOverviewCard.tsx` — 01 압축 카드 + Modal
- `src/components/analysis/TimelineSection.tsx` — 02 입찰 경과 timeline
- `src/components/analysis/RightsCallout.tsx` — 03 권리분석 callout 2종
- `src/components/analysis/MarketCompareCard.tsx` — 04 3-card grid
- `src/components/analysis/ScenarioCardsBoard.tsx` — 05 4-card 압축 + Modal + 색상·아이콘
- `src/components/analysis/AuctionStatsGrid.tsx` — 06 skeleton (Cowork v2.7 schema 대기)
- `src/components/analysis/PhotoGalleryStrip.tsx` — dedicated 갤러리 + Lightbox
- `src/components/analysis/TrustBlock.tsx` — 4-grid 보장 (마케팅 영역)
- `src/components/analysis/ApplyCTA.tsx` — 다크 + 3-column fee grid
- `src/components/analysis/ContentComplianceNotice.tsx` — 산문 1단락 (단계 4-1)
- `src/components/analysis/Lightbox.tsx` — sequence/single 모드 + ESC + ←→
- `src/components/analysis/Modal.tsx` — 일반 모달 (Property/Scenario 공유)

### mdx 처리
- `src/components/analysis/mdx-components.tsx`
  - `buildAnalysisMdxComponents(meta, fm)` — H2 dispatcher closure
  - ScenarioCard 색상·아이콘·disabled 키워드 감지
  - splitScenarioTitle (em-dash 만 separator)
- `src/lib/remark/analysis-blocks.ts`
  - 01 첫 table → `<PropertyOverviewCard>` wrap
  - 시나리오 H3 → `<ScenarioCard>` wrap
  - 07 첫 paragraph → `<ConclusionCallout>` wrap
  - "체크포인트" ol → `<CheckpointList>` wrap
  - "## 면책 고지" 폐기 (ContentComplianceNotice 단일 노출)

### publish CLI
- `scripts/content-publish/index.mjs` (v4.0)
  - `--all` 모드 + scanCaseDirs() + publishOne() 분리
  - `transformBody()` 안 시나리오 라벨 정규화 (in-memory)
  - **supervisorContent()** — Gemini 1회 호출 (5 책임 통합)
  - `buildPublishedMeta()` — supervisorAdjustments 필드 (category 분류)
  - 한글 slug 그대로 (deriveSlug = identity)

### 어댑터·타입
- `src/lib/content.ts` — `getAnalysisMeta(slug)` + NFC normalize 매칭
- `src/types/content.ts` — AnalysisMeta / BiddingHistoryEntry / RightsMeta / MarketMeta / InvestmentMeta / ScenarioFields

### 환경변수
- `.env.local` — `GEMINI_API_KEY=***[MASKED]***` (gitignore 자동 제외)
- `package.json` `publish` script: `node --env-file=.env.local scripts/content-publish/index.mjs`

---

## 3. G1 baseline 보존 항목 (회귀 0 유지)

- mdx Img → null (본문 인라인 사진 차단)
- del/s passthrough (취소선 차단)
- remark-gfm `singleTilde: false`
- Hero h1 `text-4xl→text-6xl font-extrabold`
- SectionHeader badge 폐기 (sub-label chip 0)
- 표 horizontal lines + tabular-nums + Tr 행 색 분기
- 단계 3-3 컴포넌트 7건
- 단계 3-5 라이트박스·모달 패턴

---

## 4. 단계 4-2 시연 결과 (commit `13ee69d`)

```
=== --all 결과 요약: PASS 2건 (ADJUSTED 2건) / FAIL 0건 ===
  ✓ ADJUSTED 2024타경540431 (5건 조정)
  ✓ ADJUSTED 2024타경580569 (2건 조정)
```

**540431** (5건):
- consistency × 4 — 실질 취득비용 중간값 (3억 1,564만 → 3억 2,214만), 매도 차익 재계산, 시나리오 비교 요약 표 정합화
- forbidden_term × 1 — "적합 자금 성격" → "요구 자금 성격" ('적합' 파생어)

**580569** (2건):
- consistency × 1 — "보증금 약 5,800만원" → "5,888만원"
- vocabulary × 1 — **"양 스프레드" → "월 순현금흐름"** (G5 거슬리는 어휘 해결)

---

## 5. 미해결·확인 필요 항목

### G6 시연에서 확인 필요
1. **580569 입찰일 표시** — supervisor 가 missing_data 식별 못 함. 원인 후보:
   - frontmatter `saleDate` 필드 존재하나 컴포넌트 측 `bidDate` 키 매핑 (schema 키 차이)
   - 필요 시 후속 patch — Code 단 컴포넌트 매핑 교정 영역
2. 580569 "양 스프레드" 사라짐 + 콘텐츠 자연스러움
3. 540431 "적합" 어휘 순화 결과 + 정합성 4건 조정 후 자연스러움
4. desktop + mobile 양쪽 시연

### Gemini supervisor 한계
- 본문에 정보 부재 시 frontmatter 빈 필드 허위 채움 0 (정상 동작 — 정보 부재면 보강 안 함)
- 입찰일 같은 경우 frontmatter 키 schema 와 컴포넌트 매핑 별개 issue

---

## 6. 환경 메모

### 의존성
- Next.js 16.2.3 + Turbopack
- Tailwind v4 CSS-first (@theme 블록 동결)
- shadcn/ui Tailwind v4 모드 (Button·Card·Badge·Table·Tabs·Tooltip)
- lucide-react (단계 3-3+ 의존성)
- Node 22 fetch (외부 라이브러리 추가 0)
- gray-matter / remark-gfm / next-mdx-remote/rsc

### 환경변수 (`.env.local`)
- `GEMINI_API_KEY` — Gemini 3.1 Pro Preview 호출용
- 기타 22개 (Supabase·기타) — 단계 4-2 변경 0

### npm scripts
- `pnpm run publish [caseNumber]` — 단건 publish
- `pnpm run publish --all` — raw-content/ 전체 일괄
- `pnpm run publish --all --force` — 정합성 무관 mdx 덮어쓰기
- `pnpm run publish --dry-run` — 검증·매핑만

### Cowork 영역 (Code 관여 0)
- raw-content/post.md 본문
- meta.json schema (auction-content/v1)
- voice_guide / SKILL.md / plugin.json

---

## 7. 다음 세션 진입 절차

1. 본 핸드오프 문서 + `CLAUDE.md` § 0~17 + `docs/phase7/step3-2-plan.md` 참조
2. `git log --oneline -10` 으로 commit `13ee69d` 확인
3. 형준님 G6 시연 결과 보고 대기:
   - 580569 입찰일 표시 / "양 스프레드" 사라짐 / 콘텐츠 자연스러움
   - 540431 "적합" 어휘 순화 / 정합성 4건 조정 자연스러움
4. (G6 PASS) → 다음 사건 분석 진입
   - Cowork 신규 산출 → import → `pnpm run publish` (Gemini supervisor 자동 처리)
5. (G6 미통과) → 거슬리는 항목 N건 patch
   - 580569 입찰일 누락 시 frontmatter schema 점검 후속 patch
   - 기타 어휘·시각·정합성 추가 보정

---

## 8. 작업 금지 룰 (모든 후속 patch 적용)

- raw-content/ 안 post.md 본문 수정 0 (in-memory 치환만)
- voice_guide / archive PDF / SKILL.md / plugin.json 변경 0 (Cowork 영역)
- LLM 모델 `gemini-3.1-pro-preview` 외 0
- thinking_level "high" 외 0
- 허용 어휘 (LTV·DSR·갭투자·매각가율·근저당권·말소기준등기·임의경매·강제경매·공유자 우선매수권·가처분·임차인 대항력·권리분석) 변경 0
- 분류·판정 어휘·데이터 처리 어휘 신규 도입 0
- 본문 정보 부재 시 frontmatter 허위 채움 0
- 단계 2 디자인 토큰 (@theme 블록) 변경 0
- shadcn Dialog 외 신규 라이브러리 0 (lucide-react 기존)
- 페이지 최하단 "안내 및 면책" 4 항목 (법적 표준) 제거 0
- TrustBlock "경매퀵이 보장하는 것" (마케팅 영역) 제거 0
- 시나리오 색상·아이콘 매핑 (A 파랑·B 주황·C-1 보라·C-2 초록) 변경 0
- 단계 3-1 G1 baseline 7건 회귀 0
- LLM 호출 캐시·재시도 룰 0 (단순 흐름)
- API 키 원본 값 자가 보고·콘솔·commit 메시지 노출 0 (마스킹)
- `.env.local` git add·commit·push 0

---

## 9. 산출물 위치

### 콘텐츠
- `content/analysis/2024타경540431.mdx` + `.meta.json`
- `content/analysis/2024타경580569.mdx` + `.meta.json`

### raw-content (untracked)
- `raw-content/2024타경540431/`
- `raw-content/2024타경580569/`

### docs
- `docs/phase7/step3-2-plan.md` (Plan 산출)
- `docs/phase7/handoff-step4-2.md` (본 문서)
