# 경매퀵 웹사이트 핸드오프 문서

> **용도**: 다음 세션 진입 시 본 문서 단일 영역 광역 컨텍스트 영역.
> **최종 업데이트**: 2026-05-05 (Phase 1.2 (A-1-2) v40 / 리팩토링 cycle / Stage 1 진입 직전)
> **현재 빌드 상태**: HEAD = `v40` (리팩토링 / 9 컴포넌트 + 5 PNG + lenis npm + phase-7 archive 광역 정리)
> **production URL**: https://auctionsystem-green.vercel.app/
> **다음 세션 진입 트리거**: **Stage 1 cycle 1 (Compare detail)** — NumberFlow + motion v12 stagger / CompareBlock 광역 detail 진입
> **함께 읽을 문서**: `CLAUDE.md` (원칙·컴플라이언스 + §13 룰 1~33), `BUILD_GUIDE.md`, `docs/roadmap.md`

---

## 🔥 2026-05-05 핫 스냅샷 — 다음 세션 시작 시 여기부터

### 지금 어디인가

**Phase 1.2 (A-1-2)** 광역 = v8 → v40 (33 cycle 누적 / 22 cycle 광역 광역 v18-v39 + 리팩토링 v40).

- v8-v17: Hero 광역 detail 광역 (10 cycle / 동영상 + Liquid Glass + 칩)
- v18-v28: Hero 광역 광역 (subtext + 강점 + CTA + 글래스 0.35 + 카피 정중체)
- v29-v30: Lenis + scroll-snap 폐기 광역 (native 빠릿빠릿)
- v31-v37: Insight paradigm 광역 변화 (Editorial → 다큐 → 벤토 → 매거진 → 매거진+Featured → Topic Gateway hub)
- v38: /insight Hybrid hub (Editor's Pick + 콘텐츠 list / URL 쿼리 ?cat={slug} / 308 redirect)
- v39: PageHero 컴포넌트 + 4 sub-page 카피 정정 (사업 정수 paradigm)
- **v40 (현재): 리팩토링 (9 컴포넌트 + 5 PNG + lenis npm + phase-7 archive 광역 정리)**

마지막 광역 = Phase 1 + 2 광역 자율 진입 광역 / Phase 3 사전 회신 광역 (sample-delegation pdf + AGENTS.md).

### 다음 세션 진입 단계

1. v40 OK → **Stage 1 cycle 1 (Compare detail)** 진입
   - NumberFlow 광역 광역 (3시간 ↔ 시간 비교)
   - motion v12 stagger (5 막대 광역 광역)
   - ArrowRight 광역 광역
2. Stage 1 cycle 광역 = Compare → Pricing → Trust → Insight 칩 → OG/favicon → 미세 정정

---

## 광역 paradigm 정수 (v8 → v40)

### Hero paradigm (v9 → v28)

- 동영상 배경 + Liquid Glass 박스 (rgba 0.35/0.20 + saturate(180%) + inset highlight) — v28 광역 정수
- h1 모바일 44px / 데스크탑 80px (v28)
- yellow span "경매" #FFD43B + halo (v19+)
- 강점 모바일 세로 / 데스크탑 가로 (v22)
- subtext 박스 안 / 강점 박스 밖 / 보증금 캡션 박스 안 (v23)
- CTA 모바일 풀폭 / 데스크탑 통합 / "조회하기" (v23)
- min-h dvh (안드로이드 toolbar 광역 / v24)

### Insight paradigm (v16 → v39 / 11 phase)

| Phase | paradigm |
|---|---|
| v16 | Editorial Card (60-40 split + 카테고리 색) |
| v31 | 다큐 + glass morphic |
| v32 | 벤토 + 모노톤 + 모던 비즈니스 실사 |
| v33 | 카드 플랫 + 부동산 실사 |
| v34 | 카테고리 카피 + 미세 그림자 |
| v35 | 매거진 카드 + 3D 일러스트 + Featured 자동 |
| v36 | 벤토 컬러 + 일러스트 ↑ + Featured UI 폐기 |
| v37 | 실사 jpg 회복 + 벤토 컬러 폐기 + Topic Gateway hub |
| v38 | Hybrid (Editor's Pick + 콘텐츠 list) + 카드 link `/insight?cat=` |
| v39 | PageHero 컴포넌트 + 사업 정수 카피 |

### URL paradigm (v33 → v38 / depth 1 보존 + 308 redirect)

| 광역 | 현 (v38+) |
|---|---|
| `/analysis` 직접 | → 308 → `/insight?cat=analysis` |
| `/guide` 직접 | → 308 → `/insight?cat=guide` |
| `/news` 직접 | → 308 → `/insight?cat=news` |
| `/notice` | 보존 (§28 / 단독 paradigm) |
| `/{cat}/[slug]` | 보존 (Phase B 이동 광역) |
| `/insight` | Hub (Hybrid Topic Gateway) |
| `/insight/[category]/[slug]` | Phase B (광역 cycle 광역 광역) |

### sub-page Hero 카피 (v39 / PageHero 광역 정수)

| 페이지 | h1 | accent |
|---|---|---|
| 메인 (/) | "법원에 가지 않고, 경매를 시작하세요." | "경매" yellow halo |
| /insight | "숫자로 판단하는 경매." | "숫자" green / "." yellow |
| /about | "공인중개사가 직접 갑니다." | "공인중개사" green / "." yellow |
| /service | "사건번호 입력부터, 낙찰까지." | "낙찰" green / "." yellow |
| /faq | "궁금한 건, 여기서 먼저." | "여기서" green / "." yellow |

### 라이브러리 변화

| 라이브러리 | 광역 |
|---|---|
| Lenis | v10 진입 → v30 폐기 (native scroll) → **v40 npm 광역 폐기** |
| scroll-snap CSS | v29 진입 → v30 폐기 |
| motion v12 | 진입 정합 (광역 사용) |
| @number-flow/react ^0.6 | 진입 정합 (Stage 1 광역 광역) |
| shadcn ^4.5 | 진입 정합 (ui 광역) |

### 카피 v4 SoT (v33 광역 갱신)

- v22 메인 + 4 sub-page Hero 카피 광역 정합
- 모호 어휘 광역 0 (§10 영구 금지)
- 사업 정수 어휘 광역 진입 (법원 / 숫자 / 공인중개사 / 사건번호 / 낙찰 / 여기서)

---

## v40 리팩토링 광역 광역

### Phase 1 (광역 자율)

- 9 컴포넌트 영구 삭제: ContentShowcase / CardCarousel / RegionStrip / WhySection / FlowSteps / Pricing / Brand / Spotlight / StickyScrollReveal
- 5 PNG 영구 삭제: public/illustrations/{compare-flow / feature-1 / feature-2 / feature-3 / hero-infographic}.png (~2.8MB)
- lenis npm 폐기 (`pnpm uninstall lenis`)
- HANDOFF.md v39 → v40 갱신 (본 문서)

### Phase 2 (형준님 채택)

- content/analysis/archive/ 보존 (3건 / Cowork 영역)
- docs/content-source-v1.md 영구 삭제 (v2-v3 광역 진입 광역)
- docs/phase-7-*.md (5건 / 2825줄) → docs/_archive/ 광역

### Phase 3 (사전 회신 의무)

- scripts/sample-delegation-*.pdf (7건) — 사용처 검증 + 추천 광역 회신 광역
- AGENTS.md (5줄) — 정체 + 추천 광역 회신 광역

---

## Stage 광역 로드맵 (형준님 결정)

### Stage 1 — 메인 페이지 detail (현 진입)

**cycle 순서** (Plan 광역 정합):
1. Compare detail (NumberFlow + 막대 stagger + ArrowRight)
2. Pricing detail (NumberFlow + timeline + hover)
3. Trust detail ("0" entrance + 3 카드 stagger + CTA pulse)
4. Insight 칩 인터랙션 (5 칩 + 4 카드 dim/강조)
5. OG + favicon 멀티사이즈 (1200×630 + 16/32/180/192/512)
6. 미세 정정

### Stage 2 — sub-page 디자인 체계 + 신규 의도 (광역 분리)

- 2-A (Code 영역): apply form 디자인 체계 정합 (PageHero 광역 + 메인 디자인 체계 광역)
- 2-B (Code 영역): 주소 검색 (Daum 우편번호 / next/script CDN / 신규 npm 0)
- 2-C (Cowork 영역): 사건번호 60일 크롤링 paradigm (광역 cycle 광역 분리)

### Stage 3 — 콘텐츠 시스템 + Phase B (광역 분리)

- 3-A (Cowork): mdx publish CLI / admin paradigm
- 3-B (Code): Phase B detail page 광역 이동 (/{cat}/[slug] → /insight/{cat}/[slug] / 290줄 광역) + redirect 광역

### Stage 4 — 담금질

- 광역 완성도 ↑ (모션 / 접근성 / 다크모드 / 미세 정정)

---

## v8-v40 cycle 흐름 (33 cycle 누적)

| Plan | 핵심 |
|---|---|
| v8-v17 | Hero detail (동영상 + Liquid Glass + 칩) |
| v18 | Hero 광역 재구성 (h1+subtext + 박스 = 입력+강점) |
| v19 | h1 yellow + Apple Liquid Glass + subtext 박스 안 |
| v20 | 모바일 비율 정합 + 글래스 약화 + carousel 폐기 |
| v22 | CTA 모바일 단축 + 강점 세로 + 라벨 변경 |
| v23 | 모바일 layout 광역 재배치 (Hero/본문 분리) |
| v24 | vh → dvh + 모바일 넛지 |
| v25-v28 | Hero 미세 광역 정정 (size 광역 / 카피 광역 / 글래스 광역) |
| v29-v30 | Lenis + scroll-snap 광역 폐기 (native 빠릿빠릿) + favicon |
| v31-v37 | Insight paradigm 11 phase 변화 |
| v38 | /insight Hybrid hub + 카드 link 광역 + 308 redirect |
| v39 | PageHero 컴포넌트 + 4 sub-page 카피 정정 |
| v40 | 리팩토링 (9 컴포넌트 + 5 PNG + lenis npm + archive 광역) |

---

## 영구 금지 24건 광역 보존

(CLAUDE.md §13 + §22 카피 v4 SoT 광역 정합)

---

## Vercel auto-deploy webhook 광역

- v35 / v39 광역 webhook trigger 누락 광역 광역 발생
- 빈 commit + push (Tier 1-A) 광역 광역 광역 trigger 광역 정합
- 광역 cycle 광역 발생 광역 광역 광역 광역 검증 광역 의무 (Vercel ↔ GitHub App 광역 광역 / 광역 cycle 광역 NG 시 = Tier 2/3 광역 / 형준님 결정 광역)

---

## AI 협업 구조 (CLAUDE.md §13 정합)

- **Claude Code**: 전체 코드 + 시스템 뼈대 (촘촘한 구성)
- **Cowork**: 콘텐츠 생산 단독 (publish CLI + 크롤러 + mdx 산출 / Stage 동기화 0)
- **Opus (채팅)**: 바이브 코딩 디렉터 / Orchestrator / 조율
