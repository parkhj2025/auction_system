# 경매퀵 웹사이트 핸드오프 문서

> **용도**: 다음 세션 진입 시 본 문서 단일 진입점 paradigm. 본 문서 안 사실 + CLAUDE.md 영구 룰 양측 합쳐서 단일 컨텍스트 영역.
> **최종 업데이트**: 2026-05-16 (work-012 진행 중 / 정정 1~6 통합 + Live Data Hero 산출 + 형준님 검수 NG + paradigm 리셋 + 콘텐츠 우선 paradigm 전환 + Code 자율 조사 종료 / 결정 의뢰 8건 형준님 회신 대기)
> **현재 빌드 상태**: HEAD = `059b93a` (work-012 정정 6: Live Data Hero — 단 paradigm 리셋 결정 사실 / mock 단독 / 단계 3 진입 시점 사전 산출물 정리 의무)
> **production URL**: https://auctionsystem-green.vercel.app
> **다음 세션 진입 트리거**: **형준님 결정 의뢰 8건 회신 사후 Opus 단계 2 진입** — Cowork 콘텐츠 우선 paradigm (mock 폐기 + 실 콘텐츠 1개씩 publishing + 디자인 사후 자연 도출) + Code 단계 3 (사전 산출물 일괄 정리 + 신규 디자인 정정)
> **함께 읽을 문서**: `CLAUDE.md` (사업 본질 + 영구 룰) + 본 HANDOFF.md (work history + 진입 트리거)

---

## 🔥 핫 스냅샷 — 다음 세션 시작 시 여기부터

### 다음 세션 진입 단단 paradigm

**1순위 = 형준님 결정 의뢰 8건 회신 회수**:
- 본 세션 마지막 산출 = Code 자율 조사 + 결정 의뢰 8건 (raw-content 사실 + publish 파이프라인 사실 + 의뢰서 v1.1 충돌 사실 + 가이드 publishing paradigm 미정)
- 회신 사후 진입 = Opus 단계 2 (Cowork 의뢰 v1.1 정정 + 디자인 사전 논의 5_1 산출)
- 그 사후 진입 = Code 단계 3 (사전 산출물 일괄 정리 + 신규 디자인 정정 + /insight reader 연결)

**2순위 = work-012 paradigm 리셋 사실 회수**:
- 본 세션 전반 = work-012 정정 1~6 (Live Data Hero 종료 / commit `059b93a`)
- 본 세션 후반 = 형준님 검수 "전체적 별로 + 허브 샘플 디자인 paradigm 회피 + mock 폐기 + 실 콘텐츠 단독" → 사전 논의 5 = paradigm 전체 리셋 채택
- 신규 paradigm = 콘텐츠 우선 (Cowork 산출) + 디자인 사후 자연 도출 + 1개씩 publishing 사이클
- 사전 산출물 (`src/lib/insightMock.ts` + `public/illustrations/insight/*.png` 13건 + Live Data Hero + Thumbnail + gen-script + 2026타경500459 published mdx) = 단계 3 일괄 정리 paradigm

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

### 본 세션 진행 history (work-001 ~ work-012)

| work | 의도 | commit | 상태 |
|---|---|---|---|
| work-001 | seed-photos 22 row cleanup + script INSERT 단계 폐기 | `fcb6f71` + `7108681` | ✅ |
| work-002 | Hero NG 3건 (button + input + photos) | `d5a38f6` | ✅ |
| work-003 | Hero 정정 통합 (Card image 폐기) | `8331877` | ✅ |
| work-004 | Hero 시각 정정 (모바일 SVG + Liquid Glass + chip) | `44441fb` | ✅ |
| work-005 | 사건 조회 NG + 회차 분기 (1물건 1고객 race 회피 4단계) | `cfdfaf0` | ✅ |
| work-006 | 카카오톡 전체 폐기 + /contact 목업 연락처 | `6676de5` | ✅ |
| work-007 | fetchSingleCase → fetchCaseDetail 함수 교체 (detail endpoint) | `8a04de3` | ✅ |
| work-008 | 사진 비동기 fetch + UX 개선 3건 (ctaLabel + focus outline + already-taken) | `3d03668` | ✅ |
| work-008 hotfix | 데스크탑 input focus 검은 outline 제거 (정정 6) | `c3c91ce` | ✅ |
| work-009 | HomeHero input wrapper 검은 외곽 제거 (shadow-md 폐기) | `ecb1d09` | ✅ |
| work-010 | 데스크탑 검은 테두리 정정 + 사진 영역 폐기 | `1062497` | ✅ |
| work-011 | /insight 카드 후보 5 Premium Editorial++ + chip 폐기 통합 | `dce068e` | ✅ |
| work-012 정정 1 | /insight 풀 신규 재제작 (Hero 자동 슬라이드 + 6 카테고리 + 1-col list + mock 24건) | `b2ef69f` | ✅ commit (paradigm 리셋 사실) |
| work-012 정정 2 | Hero 박스화(Liquid Glass) + 4독립+1그룹+8하위 + Gemini PNG 13건 | `f3e5298` | ✅ commit (paradigm 리셋 사실) |
| work-012 정정 3 | Hero 고정 paradigm + 아이콘 풀컬러 재산출 + 페이지네이션 10건/페이지 | `6502a30` | ✅ commit (paradigm 리셋 사실) |
| work-012 정정 4 | Hero 박스 폐기 + green primary bg + 좌우 분기 | `59c8c2d` | ✅ commit (paradigm 리셋 사실) |
| work-012 정정 5 | Hero 높이 축소 + 칩 2건(Editor's Pick + 매주 업데이트) + 마침표 yellow | `eb7998d` | ✅ commit (paradigm 리셋 사실) |
| **work-012 정정 6** | **Live Data Hero (썸네일 PNG → NumberFlow 49% + SVG line draw 단계 trend)** | **`059b93a`** | 🔄 commit + 형준님 검수 NG → 사전 논의 5 paradigm 리셋 |
| **work-012 단계 2·3 대기** | **Cowork 콘텐츠 산출 + Opus 사전 논의 5_1 + Code 단계 3 일괄 정리** | — | ⏳ 결정 의뢰 8건 회신 대기 |

---

## 📂 work-012 사실 정합 (최신 / 2026-05-15 ~ 2026-05-16 / 진행 중)

### 진입 의도 사실

- 사전 work-011 = /insight 카드 hover 단독 정정 → 형준님 검수 "쓰레기 결과물. 완전 리셋." → 풀 신규 재제작 의무
- 본 work = /insight 페이지 단독 정정 (메인 + 분석 + /apply + /faq + /about 영구 변경 0)

### 진행 단계 (정정 1~6 + 리셋)

| 정정 | 의도 정수 | 핵심 변경 | commit |
|---|---|---|---|
| 1 | mock 데이터 + Hero 자동 슬라이드 + 6 카테고리 nav + 1-col list 신규 재제작 | InsightHero(motion+setInterval 5초+3 슬라이드+dot indicator) + InsightCategoryNav(6 카테고리+전체보기) + InsightHubLayout(orchestrator+toast) + insightMock.ts(mock 24건) + 구 home/InsightHubLayout 폐기 | `b2ef69f` |
| 2 | Hero 박스화(Liquid Glass) + 카테고리 구조 4독립+1그룹+8하위 + Gemini PNG 13건 | Hero Liquid Glass 박스(blur 40px+inset shadow+rounded-[28px]) + 카테고리 구조 정정(아파트·오피스텔·빌라·단독주택·다가구·다세대·상가·기타 8 하위) + Gemini PNG 13건 1차 산출(브랜드 팔레트 단독 / 초록 모노톤) + sub nav 펼침 paradigm | `f3e5298` |
| 3 | Hero 고정 paradigm + 아이콘 풀컬러 재산출 + 페이지네이션 10건/페이지 | Hero 슬라이드 폐기 → 간단 헤더 + Editor's Pick 카드 + PNG 13건 2차 산출(브랜드 팔레트 폐기 → 풀컬러 free) + 페이지네이션 신규(`?page=N` URL + 이전·다음 + 1·2·3) + 카테고리 nav 가운데 정렬 | `6502a30` |
| 4 | Hero 박스 폐기 + green primary bg + 좌우 분기 | Liquid Glass 폐기 + bg `var(--brand-green)` 단독 + `grid lg:grid-cols-2`(좌 문구 / 우 카드) + soft shadow 카드 paradigm | `59c8c2d` |
| 5 | Hero 높이 축소 + 칩 2건 + 마침표 yellow | 높이 `py-10 lg:py-14` → `py-6 lg:py-8` + 좌측 영역 확장(칩 2건 "Editor's Pick" + "매주 업데이트" + 메인 + 서브) + 마침표 + "무료로 드립니다" yellow `#FFD43B` + §A-24 권한 Hero eyebrow 칩 단독 예외 | `eb7998d` |
| **6** | **Live Data Hero (Code 추천 1 채택 / "와" 정수 paradigm)** | **우측 카드 = 썸네일 PNG 폐기 → 데이터 시각 패널 (NumberFlow 49% count-up + SVG `motion.path pathLength` 단계 trend line + 동작 sequence 200/400/600/800ms) + Hero 높이 `py-8 lg:py-12` 환원 + 우상단 미세 도형 alpha 0.08 원 + villa-01 mock stats 확장 (감정가 2.8억 / 최저가 1.37억 / 5단 stagePrices)** | **`059b93a`** |

### 본 세션 paradigm 리셋 사실 (2026-05-16)

**형준님 production 검수 회신 (정정 6 사후)**:
- "전체적 별로 + 허브 샘플 디자인 paradigm 회피"
- "정제 기사 허브 paradigm + 모노톤 + 포인트 색 단독"
- "mock → 실 콘텐츠 paradigm"
- "기존 방식 얽매일 필요 0"
- "Code와 함께 논의 + 창의적 + 업계 표준 맥락"

**사전 논의 4 (Code 자율 paradigm 추천)**:
- Opus 후보 3건 (a 매거진 / b 데이터 시각 / c 카드 모자이크)
- Code 추천 3건 (1 Live Data Hero / 2 Editorial Statement / 3 Stat-tile)
- 형준님 채택 = Code 추천 1 (Live Data Hero) → 정정 6 산출

**사전 논의 5 (paradigm 전체 리셋)**:
- 정정 1~6 산출 일괄 폐기 (Opus 단독 추천 + mock 단독 paradigm 영구 폐기)
- 신규 paradigm = 콘텐츠 우선 + Cowork 실 콘텐츠 산출 단독 + 디자인 사후 자연 도출
- 외관 정수 = 정제 기사 허브 + 모노톤 + green 포인트 단독 (yellow 폐기 / chip 영구 폐기 / Gemini PNG 13건 영구 폐기 / 정적 paradigm 단독)
- 단계 분리 paradigm: 단계 1 Cowork 콘텐츠 산출 / 단계 2 Opus + Code 사전 논의 5_1 / 단계 3 Code 일괄 정정

### Cowork 의뢰서 history

- v1 (Opus 산출) → Code 사전 점검 6건 + 결정 의뢰 2건 회신 → v1 폐기
- v1.1 (통합본 / 형준님 채택) = 카테고리 4 분기 + 디렉토리 분포 + frontmatter 사양 + Cowork 자율 영역 + 사전 디자인 paradigm 참고
- **단 v1.1 자체 충돌 사실** (결정 의뢰 4 영역) = frontmatter `category: 'analysis' | ...' ↔ 현 publish CLI `meta.category` forbidden + 기존 convention `type: ...` 단독

### Code 자율 조사 결과 (2026-05-16 / 본 세션 마지막 산출)

**raw-content 폴더 사실**:
- 가이드 = `raw-content/guide/guide_01 ~ guide_06` (6편 / 형준님 명시 7편 ↔ 실제 6편 불일치)
- 아카이브 = `raw-content/archive/2024타경540431 + 527667 + 580569` (3건 / publish 완료 사실)
- 루트 = `raw-content/2026타경500459` (publish 대기 analysis 1건 / post.md + meta.json + data/{crawler_summary, parsed, photos_meta}.json)
- glossary 디렉토리 부재 (Cowork 산출 0)
- guide post.md 안 frontmatter 부재 + `[시각화 A/B/C]` placeholder + ` ` 백틱 마킹 11건(툴팁 후보)
- guide_01 단독 = code_brief.md + figures/(SVG 3종) (1편만 빌드 사양 완비)

**publish CLI 사실** (`scripts/content-publish/index.mjs` 55KB):
- **analysis 전용 단독** (OUT_DIR = `content/analysis` 하드코딩 / guide·glossary·data 분기 0)
- 1차 원소스 meta.json + 2차 post.md frontmatter overlay
- 필수 입력: meta.json + post.md + data/crawler_summary.json + data/photos_meta.json
- 단건 paradigm 직접 지원 + `--all` + `--force` + `--dry-run` + `--verbose`
- Gemini 3.1 Pro 자체 감수 (5 책임: 정합성 / 누락 / 어휘 / 일관성 / 금지어휘)
- `pnpm publish` ↔ pnpm 자체 npm publish 명령 충돌 (`ERR_PNPM_GIT_UNCLEAN`) → `pnpm content:publish` 또는 node 직접 호출 의무
- 본 세션 직접 dry-run 검증 PASS (2026타경500459 / Gemini 3건 자동 보강 suggest)
- `meta.category` 필드 forbidden (line 404) ↔ Cowork v1.1 frontmatter `category` 명시 충돌

**현 라이브 콘텐츠 사실**:
- `content/analysis/2026타경500459.mdx` + `.meta.json` + `.audit.json` (publish 완료 / 단계 3 일괄 정리 list 포함)
- `content/analysis/archive/` 2024 3건
- `content/guide/` = `what-is-auction.mdx` + `how-to-bid-price.mdx` (이전 짧은 placeholder / raw-content/guide와 매칭 0)
- `content/data/` = `.gitkeep` 단독 (콘텐츠 0)
- `content/news/2026-04-w3-incheon.mdx` + `content/notice/service-launch.mdx`
- `content/glossary/` 부재

**/insight 현 상태 사실**:
- HEAD `059b93a` Live Data Hero 작동
- InsightHubLayout = `INSIGHT_MOCK_POSTS` 단독 사용 / 실 content/ reader 호출 0
- raw-content publish 사후 → 자동 /insight 노출 0 (단계 3 안 reader 연결 의무)
- featured = villa-01 (mock hardcoded)

**sitemap 사실**:
- `src/app/sitemap.ts` = `/analysis/{slug}` + `/guide/{slug}` + `/news/{slug}` + `/notice/{slug}` 동적 sitemap 포함
- `2026타경500459.mdx` 삭제 시 sitemap 결손 + 외부 인덱싱 404

### 형준님 결정 의뢰 8건 (다음 세션 진입 trigger)

| # | 결정 영역 | 의뢰 정수 |
|---|---|---|
| 1 | 가이드 publishing 파이프라인 | (a) Code 수동 빌드 / (b) 가이드용 별개 CLI / (c) 기존 CLI 확장 |
| 2 | 가이드 6편 ↔ 7편 사실 확인 | 형준님 명시 7편 ↔ 실제 6편 / 누락 1편 사실 |
| 3 | 기존 `content/guide/` 2건 처리 | 덮어쓰기 / 신규 slug / 사전 삭제 |
| 4 | 의뢰서 v1.1 `category` 필드 ↔ 현 CLI 충돌 | 의뢰서 정정(기존 convention) 또는 CLI 확장(category 허용) |
| 5 | 1개씩 검수 paradigm 정수 | (a) dev 서버 / (b) preview deploy / (c) dry-run + git diff |
| 6 | /insight reader 연결 시점 | 단계 3 또는 단계 2.5(사전 reader + 검수 분리) |
| 7 | 2026타경500459 처리 사실 (의뢰서 v1.1 재확인) | 사전 삭제 명시 ↔ Cowork 재산출 보존 paradigm 잠재 |
| 8 | 가이드 상세 페이지 디자인 시스템 적용 | code_brief.md 안 Phase 8 Aurora Calm + 툴팁 11건 + SVG 매핑 적용 의무 |

### 영구 보존 (work-012 종료 사후 단계 3 정리 대상 제외)

- 308 redirect 5건 (analysis + guide + glossary + news + data → /insight 308)
- 메인 페이지 HomeInsight.tsx INSIGHT_TILES 4 slug (analysis + guide + glossary + data) 호환
- 분석 페이지 + /apply + Hero + Compare + Pricing + Reviews + HomeCTA + TopNav + /about + /faq 변경 0
- 페르소나 어휘 ("헷갈리는" + "정확하게" + "정리" / "초보자" 0)
- Insight h2 SoT v42.4 "분석 자료까지, 무료로 드립니다." (단 yellow paradigm = 사전 논의 5 안 정정 잠재 / Cowork 산출 사후 결정)
- 인천지방법원 본원 단독 (Phase 1)

### 단계 3 사전 산출물 일괄 정리 list (다음 세션 진입 시점)

| 폐기 영역 | 사유 |
|---|---|
| `src/lib/insightMock.ts` (mock 29건 + INSIGHT_PAGE_SIZE) | mock paradigm 폐기 / 실 콘텐츠 단독 |
| `public/illustrations/insight/*.png` 13건 | Gemini PNG 폐기 / 모노톤 paradigm |
| `src/components/insight/InsightHero.tsx` (Live Data Hero) | NumberFlow + SVG line draw 폐기 / 정적 paradigm |
| `src/components/insight/Thumbnail.tsx` | PNG 썸네일 폐기 |
| `src/components/insight/InsightCategoryNav.tsx` | 4독립+1그룹+8하위 nav 폐기 잠재 (정수 보존 또는 단순화 결정) |
| `scripts/gen-insight-category-icons.mjs` | Gemini 산출 스크립트 폐기 |
| `content/analysis/2026타경500459.mdx + .meta.json + .audit.json` | Cowork 재산출 paradigm 일관 (의뢰서 v1.1) |

### 단계 3 신규 산출 의무 list

- `src/types/content.ts` 안 `GlossaryFrontmatter` + `GlossaryPost` 타입 추가
- `src/lib/content.ts` 안 `getAllGlossaryPosts()` reader 추가
- `content/glossary/` 디렉토리 + `.gitkeep` 신규
- `scripts/content-publish/index.mjs` glossary 분기 추가 (또는 별개 CLI / 결정 의뢰 1 사실 정합)
- InsightHubLayout reader 연결 (mock 폐기 + `getAllAnalysisPosts` + `getAllGuidePosts` + `getAllGlossaryPosts` + `getAllDataPosts` 통합)
- 신규 디자인 paradigm 정정 (정제 기사 허브 + 모노톤 + green 포인트)

---

## 📂 work-011 사실 정합 (2026-05-14)

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

### 1순위: 형준님 결정 의뢰 8건 회신 회수 (work-012 단계 2·3 진입 trigger)

- 본 세션 마지막 산출 = Code 자율 조사 + 결정 의뢰 8건 (위 work-012 섹션 안 표 참조)
- 회신 사후 = Opus 단계 2 진입 (Cowork 의뢰서 v1.1 정정 + 디자인 사전 논의 5_1 산출)
- 그 사후 = Code 단계 3 진입 (사전 산출물 일괄 정리 + 신규 디자인 정정 + reader 연결)
- 결정 의뢰 8건 정수 (중복 회피 / 위 work-012 섹션 안 표 단독 참조):
  1. 가이드 publishing 파이프라인 (수동 빌드 / 별개 CLI / 기존 CLI 확장)
  2. 가이드 6편 ↔ 7편 사실 확인
  3. 기존 content/guide/ 2건 처리
  4. v1.1 category 필드 ↔ 현 CLI 충돌 해결 방향
  5. 1개씩 검수 paradigm (dev / preview / dry-run)
  6. /insight reader 연결 시점 (단계 3 / 단계 2.5)
  7. 2026타경500459 처리 재확인
  8. 가이드 상세 페이지 디자인 시스템 적용 사실

### 2순위: 단계 3 진입 시점 사전 준비 (결정 8건 회신 사후 자동 진입)

- 사전 산출물 일괄 정리 (위 work-012 섹션 안 list 정합)
- `src/app/sitemap.ts` 안 `2026타경500459` 삭제 사실 정합 (외부 인덱싱 404 영향 사전 점검)
- 신규 reader + 타입 + content-publish glossary 분기 추가
- 신규 디자인 paradigm 정정 (정제 기사 허브 + 모노톤 + green 포인트)
- 신규 commit + push + 회신 + 형준님 production 검수

### 3순위 (잠재 / work-013 + work-014): /faq + /about 페이지 정정

- 사전 본 핸드오프 안 work-012 = /faq 정정 잠재 paradigm 명시 사실 → work-012 안 /insight 정정 진입으로 우선순위 회수
- 잠재 paradigm 영구 보존:
  - /faq 페이지 정정 (5 카테고리 × 19 항목 + PageHero + JSON-LD + Bottom CTA 사전 구현 사실 / 카피 sentiment + 항목 누락 + 검색 기능 + 외관 톤 검수)
  - /about 페이지 정정 (5 섹션 + AboutPageClient + 자체 SVG 사전 구현 사실 / 외관 + 카피 + 사업 사실 정합 검수)

### 4순위: Cowork chat 분리 (work-012 단계 1 진입 / 형준님 직접 영역)

- 형준님 직접 의뢰 사실 = Cowork chat 분리 진입 + 콘텐츠 1개씩 publishing
- 진입 trigger = Opus 단계 2 안 Cowork 의뢰서 v1.1 정정 사후 형준님 → Cowork chat 송부
- Cowork = 콘텐츠 1개씩 산출 + 형준님 검수 + 다음 1개 paradigm
- 콘텐츠 완성 시점 = analysis + guide + glossary + data 단계 3 reader 자연 흡수

### 5순위 (기술부채): 별개 work paradigm

- mapper.ts is_active hardcoded → 동적 매핑 검수 (`r.mulJinYn === "Y"` paradigm)
- ReviewsMarquee.tsx L66 사전 main lint error 1건 정리
- Lighthouse 측정 재개 (Phase 9 의도)
- 카카오톡 인앱 브라우저 Google OAuth 차단 해결 (LoginButton DISABLED 사실 회수 검토)
- `pnpm publish` ↔ npm publish 명령 충돌 영구 해결 (package.json scripts.publish 이름 재고)

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
| (사전 cycle 없음) | work-012 | /insight 풀 신규 재제작 (정정 1~6) + 사전 논의 5 리셋 + 단계 2·3 대기 |

사후 paradigm = **work-NNN sequential 단독**.

### work-012 안 정정 → 단계 paradigm 추가 사실

work-012 안 = 정정 1~6 (외관 sequential 정정) + 사전 논의 4 (Code 추천) + 사전 논의 5 (paradigm 리셋) + Cowork 의뢰서 v1 → v1.1 (통합본) + Code 자율 조사 + 결정 의뢰 8건 → 사후 = 단계 2 (Opus 사전 논의 5_1) + 단계 3 (Code 일괄 정정).

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

## 🔗 commit history (본 세션 전체 / work-001 ~ work-012)

```
059b93a work-012 정정 6: /insight Live Data Hero (썸네일 PNG → 데이터 시각 패널)
eb7998d work-012 정정 5: /insight Hero 높이 축소 + 칩 2건 + 서브타이틀 + 마침표 yellow
59c8c2d work-012 정정 4: /insight Hero 박스 폐기 + green bg + 좌우 분기
6502a30 work-012 정정 3: /insight Hero 고정 paradigm + 아이콘 풀컬러 + 페이지네이션
f3e5298 work-012 정정 2: /insight Hero 박스화 + 카테고리 4독립+1그룹 구조 + Gemini PNG 13건
b2ef69f work-012: /insight 풀 신규 재제작 — Hero 자동 슬라이드 + 6 카테고리 nav + 1-col list
f9678fa HANDOFF.md 갱신: work-008 ~ work-011 통합 + 다음 세션 진입 트리거 = 클로드 채팅 요구서
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

1. **형준님 결정 의뢰 8건 회신 우선 paradigm** = 다음 세션 진입 단단 trigger (위 work-012 섹션 안 표 단독 참조)
2. **work-012 진행 중 사실** = HEAD `059b93a` Live Data Hero / 단 사전 논의 5 paradigm 리셋 채택 / 단계 2·3 진입 대기
3. **work-012 사전 산출물 일괄 정리 list 영구 보존** (단계 3 진입 시점 폐기 의무 / 위 work-012 섹션 안 표 참조)
4. **콘텐츠 우선 paradigm 영구 채택** (mock 폐기 + 실 콘텐츠 1개씩 publishing + 디자인 사후 자연 도출)
5. **/faq + /about 잠재 paradigm 영구 보존** (work-013 + work-014 잠재 / 본 세션 진입 0)
6. **분석 페이지 + /apply + Hero + Pricing + Compare + Reviews + HomeCTA + TopNav 영구 변경 0** (§A-24 예외 단독)
7. **detail endpoint paradigm** = 대법원 official 단독 source (우리 DB = 24h 캐시 / not_found 회신 시점 = DB only NG / detail endpoint fetch 의무)
8. **photos.ts + /api/court-listings/[docid]/photos route 영구 보존** = 분석 페이지 PhotoGallery 사용 / Hero 영역 0
9. **신규 npm 영구 0** (motion + lucide-react + NumberFlow + sharp + @google/genai + playwright 단독)
10. **회신문 "광역" 어휘 0 의무** (자가 검증 `grep "광역"` 0건 정합)
11. **`pnpm publish` 명령 충돌 사실** = pnpm 자체 npm publish 명령 우선 → `pnpm content:publish` 또는 node 직접 호출 의무
12. **`scripts/content-publish/index.mjs` = analysis 전용 사실** (guide·glossary·data 분기 0 / 단계 3 진입 시점 결정 의뢰 1 정합 의무)
