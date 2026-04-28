# DESIGN READING GUIDE — 클로드 디자인용 코드베이스 진입 가이드

> **본 가이드의 본질**: 클로드 디자인이 Phase 8 시안 탐색 시 본 코드베이스를 효율적으로 읽도록 안내.
> **현재 상태**: Phase 7 (룰 1~33) 마무리 + sub-phase 8.1 (commit 75b1c84) 토큰 정리 완료.
> **검증 케이스**: 사건 `2026타경500459` (https://auctionsystem-green.vercel.app/analysis/2026타경500459)
> **시안 작업 본질**: 시안 탐색 only — 코드 / 토큰 / 컴포넌트 변경 0. 시안 확정은 형준님 권한.

---

## 1. 진입 영역 (가장 먼저 읽어야 할 파일 5건)

| # | 파일 | 역할 |
|---|---|---|
| 1 | [src/app/layout.tsx](src/app/layout.tsx) | 루트 레이아웃 — Pretendard Variable 영역 (룰 32) + TopNav / Footer / MobileSticky 영역 |
| 2 | [src/app/globals.css](src/app/globals.css) | 디자인 토큰 단일 source of truth (Tailwind v4 `@theme` 영역) — 컬러 / 타이포 / 간격 / 모션 / radius / shadow / breakpoint |
| 3 | [src/app/analysis/[slug]/page.tsx](src/app/analysis/%5Bslug%5D/page.tsx) | 검증 케이스 영역 — DetailHero + MDX 본문 (mdx-components dispatcher) + Sidebar + TrustBlock + ApplyCTA + RelatedCards |
| 4 | [src/components/analysis/DetailHero.tsx](src/components/analysis/DetailHero.tsx) | Hero 영역 (단계 5-4-3 옵션 C Asymmetric 영역) — 좌우 grid (정보 + 사진) + lead + stat-grid 4-col |
| 5 | [src/components/analysis/mdx-components.tsx](src/components/analysis/mdx-components.tsx) | MDX 본문 dispatcher — H2 헤딩 인지 시 Section01~07 + 다이어그램 컴포넌트 자동 삽입 |

**보조**: [CLAUDE.md](CLAUDE.md) (사업·디자인·룰 본질 영역) + [BUILD_GUIDE.md](BUILD_GUIDE.md) (기술 스택·컴포넌트·데이터 구조 영역) + [README.md](README.md) (프로젝트 개요 영역)

---

## 2. 분석 페이지 컴포넌트 트리 (사건 2026타경500459 영역)

```
src/app/analysis/[slug]/page.tsx
├── <DetailHero fm={fm} />                          ← src/components/analysis/DetailHero.tsx
│   ├── Breadcrumb (Hero 카드 외)
│   ├── Tags chips (Hero 카드 외)
│   └── motion.article (단일 흰 카드, 좌우 grid)
│       ├── 좌측 정보 (lg:1.4fr)
│       │   ├── h1 사건 제목 (clamp(2rem,5vw,3.5rem) / 700 / [text-wrap:balance])
│       │   ├── 서브타이틀 (court · 사건번호 · address)
│       │   └── 가격 영역
│       │       ├── caption "{round}차 최저가"
│       │       ├── 수치 (text-[28px] sm:text-[32px] / 600 / tabular-nums)
│       │       ├── Action Blue 칩 (bg-action + text-white)
│       │       └── <HoverableDropRateBar />        ← src/components/analysis/HoverableDropRateBar.tsx
│       ├── 우측 사진 (lg:1fr)
│       │   └── <PhotoCluster /> (큰 1장 + thumbs row + +N 오버레이)
│       │       └── <Lightbox />                    ← src/components/analysis/Lightbox.tsx
│       ├── lead summary (border-t)
│       └── stat-grid 4-col (감정가 / 입찰보증금 / 입찰기일 / 전용면적)
│
├── <MDXRemote source={post.content} components={buildAnalysisMdxComponents(meta, fm)} />
│   ├── ## 01 물건 개요 → <Section01Overview />     ← src/components/analysis/sections/Section01Overview.tsx
│   │   └── (mdx 본문 첫 table) → <PropertyOverviewCard /> (remark plugin wrap)
│   │       ← src/components/analysis/PropertyOverviewCard.tsx
│   │
│   ├── ## 02 입찰 경과 → <Section02BidHistory /> + <TimelineSection />
│   │   ← src/components/analysis/TimelineSection.tsx (룰 24-D ink tier 다이어그램)
│   │
│   ├── ## 03 권리분석 → <Section03Rights /> + <RightsAnalysisSection />
│   │   ← src/components/analysis/RightsAnalysisSection.tsx
│   │   (sub-phase 8.1 결정 10: tabIndex / cursor-pointer / whileFocus / outline-none / focus-visible 제거됨)
│   │
│   ├── ## 04 시세비교 → <Section04Market /> + <MarketCompareCard /> + <PriceScatter />
│   │   ← src/components/analysis/MarketCompareCard.tsx
│   │   ← src/components/analysis/PriceScatter.tsx
│   │
│   ├── ## 05 투자 수익 시뮬레이션 → <Section05Investment /> + <InvestmentInteractive>
│   │   ← src/components/analysis/InvestmentInteractive.tsx (state wrapper)
│   │       └── <ScenarioComparisonBox />           ← src/components/analysis/ScenarioComparisonBox.tsx
│   │   (mdx body) ### 시나리오 비교 요약 → <ScenarioComparisonHighlight wrap>
│   │   ← src/components/analysis/ScenarioComparisonHighlight.tsx (단계 5-4-2-fix-9 정리 카드)
│   │
│   ├── ## 06 매각사례 참고 → <Section06SaleHistory /> + <SaleAreaSummary />
│   │   ← src/components/analysis/SaleAreaSummary.tsx (gradient bar 다이어그램)
│   │
│   ├── ## 07 종합 의견 → <Section07Opinion />
│   │   └── (mdx 첫 paragraph) → <ConclusionCallout /> (remark plugin wrap)
│   │   └── ### 체크포인트 + ol → <CheckpointList /> (remark plugin wrap)
│   │       ← src/components/analysis/CheckpointList.tsx
│   │
│   └── (자동) <ContentComplianceNotice /> (07 직후 면책)
│       ← src/components/analysis/ContentComplianceNotice.tsx
│
├── <TrustBlock />                                  ← src/components/analysis/TrustBlock.tsx (CTA 영역, 변조 가능 [룰 38])
├── <ApplyCTA fm={fm} />                            ← src/components/analysis/ApplyCTA.tsx (CTA 영역, ink-950 다크 카드)
├── <RelatedCards posts={related} />                ← src/components/analysis/RelatedCards.tsx
└── <DetailSidebar fm={fm} />                       ← src/components/analysis/DetailSidebar.tsx (sidebar TOC + 신청 CTA)
```

**MDX 헤딩 dispatcher** (mdx-components.tsx):
- `<H1>` → `null` (DetailHero h1 단일성 보존, a11y 본질)
- `<H2>` → "01"~"07" 매칭 시 SectionXX + 자동 다이어그램 삽입 (`buildH2(meta, fm)`)
- `<H3>` → 텍스트 매칭 시 강조 wrap (체크포인트 영역)
- 표 (`<MdxTable>`), 본문 (`<MdxP>`, `<MdxUl>`, `<MdxOl>`) = `src/components/analysis/MdxTableElements.tsx` + `MdxBodyElements.tsx`

**remark plugin** (`src/lib/remark/analysis-blocks.ts`):
- `## 01 물건 개요` 첫 table → `PropertyOverviewCard` wrap
- `### 시나리오 X — ...` h3 + 다음 자식 → `ScenarioCard` wrap
- `### 시나리오 비교 요약` h3 + 자식 → `ScenarioComparisonHighlight` wrap
- `## 07 종합` 첫 paragraph → `ConclusionCallout` wrap
- `### 체크포인트` 직후 ol → `CheckpointList` wrap

---

## 3. 디자인 토큰 영역 (sub-phase 8.1 commit 75b1c84 결과 반영)

**단일 source of truth**: [src/app/globals.css](src/app/globals.css) 안 `@theme` 영역 (Tailwind v4 CSS-first 패턴, `tailwind.config.ts` 영역 0)

### 컬러 토큰

```css
/* Action Blue 단일 토큰 (룰 24-D 1 accent only 본질) */
--color-action: #0066cc;      /* sub-phase 8.1 신규 — DetailHero·HoverableDropRateBar 칩 */

/* 카카오 토큰 (외부 브랜드) */
--color-kakao: #fee500;       /* sub-phase 8.1 신규 — contact 카카오톡 채널 한정 */

/* ink 9단계 (무채색) */
--color-ink-950: #020617;     /* 다크 섹션 / 카드 (ApplyCTA) */
--color-ink-900: #0f172a;     /* 제목 */
--color-ink-700: #334155;     /* 본문 */
--color-ink-500: #64748b;     /* 보조 */
--color-ink-300: #cbd5e1;     /* 비활성·보더·decoration·다이어그램 (텍스트 사용 금지 — AA 미달) */
--color-ink-200: #e2e8f0;     /* 약화 보더·구분선 */
--color-ink-100: #f1f5f9;     /* 배경 */
--color-ink-50:  #f8fafc;     /* 약화 배경 */
--color-surface: #ffffff;
--color-surface-muted: #f8fafc;

/* 시맨틱 4종 (기능 전용, AA 통과) */
--color-success: #15803d;     /* + soft variant */
--color-warning: #854d0e;     /* + soft variant */
--color-danger:  #b91c1c;     /* + soft variant */
--color-info:    #1d4ed8;     /* + soft variant */

/* accent 2종 (apply 폼 영역 — 단계적 시맨틱 마이그레이션 후보) */
--color-accent-red: #dc2626;     /* + soft */
--color-accent-green: #16a34a;   /* + soft */
/* sub-phase 8.1: accent-yellow 폐기 (사용 영역 = 카카오 토큰 + ink 톤 전환) */
```

### 타이포 토큰

```css
/* Pretendard Variable (룰 32) — Apple SF Pro Korean equivalent */
--font-sans: "Pretendard Variable", Pretendard, var(--font-noto-kr),
             "Apple SD Gothic Neo", "Noto Sans KR", -apple-system,
             BlinkMacSystemFont, ui-sans-serif, system-ui, ...;

/* 사이즈 (혼합 비율, 모바일 자동 override) */
--text-display: 4rem;         /* 64px (모바일 44px) — Hero 가격 dominant */
--text-h1: 2.5rem;            /* 40px (모바일 28px) — 사건 타이틀 */
--text-h2: 2rem;              /* 32px (모바일 24px) — 섹션 제목 */
--text-h3: 1.5rem;            /* 24px (모바일 20px) — 카드 제목 */
--text-h4: 1.25rem;           /* 20px (모바일 18px) — STEP 헤딩 */
--text-body-lg: 1.125rem;     /* 18px (모바일 16px) — 본문 강조 */
--text-body: 1.0625rem;       /* 17px — sub-phase 8.1 갱신 (Apple body 본질 흡수) */
--text-body-sm: 0.875rem;     /* 14px — 보조 본문 + 표 td */
--text-caption: 0.75rem;      /* 12px — 라벨·태그 */

/* font-weight 5단계 ladder (sub-phase 8.1 신규, Apple HIG 본질) */
--font-weight-light: 300;     /* lead-airy 영역 한정 */
--font-weight-regular: 400;
--font-weight-medium: 500;    /* 보존 (HIG Medium = action / 버튼 / 네비 본질) */
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* line-height 4단계 */
--lh-tight: 1.05;
--lh-snug: 1.15;
--lh-normal: 1.3;
--lh-relaxed: 1.6;
```

### 글로벌 타이포 spec (룰 32)
```css
html, body {
  font-feature-settings: "ss01", "ss02", ..., "ss11", "kern" 1;  /* Pretendard stylistic sets + 커닝 */
  letter-spacing: -0.02em;     /* 한국어 영역 시각 정합 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

### 간격·radius·shadow·모션 토큰

```css
/* 4pt grid 본질 */
--gap-section: 8rem;          /* 128px — 섹션 간 (모바일 80px) */
--gap-card: 2rem;             /* 32px — 카드 간 */
--pad-card: 2rem;             /* 32px — 카드 padding */
--gap-paragraph: 1.5rem;      /* 24px */

/* 보더 반경 (radius-md = 본문 카드 통일) */
--radius-xs: 4px;
--radius-sm: 6px;
--radius-md: 10px;            /* 본문 카드 통일 (룰 27) */
--radius-lg: 14px;
--radius-xl: 20px;
--radius-2xl: 28px;

/* 그림자 4단계 (sub-phase 8.2 영역에서 단순화 검토 영역) */
--shadow-subtle, --shadow-card, --shadow-elevated, --shadow-lift;

/* 모션 토큰 (룰 14-E 통합) */
--duration-sm: 200ms;         /* hover·focus */
--duration-md: 400ms;         /* fade-in·slide */
--duration-lg: 600ms;         /* count-up·bar fill */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);  /* 단일 표준 */

/* prefers-reduced-motion 글로벌 룰 */
@media (prefers-reduced-motion: reduce) { /* 모든 motion 0.01ms */ }
```

### 모바일 토큰 자동 override
```css
@media (max-width: 639px) {
  :root {
    --text-display: var(--text-display-mobile);  /* 자동 모바일 영역 토큰 */
    /* ... */
  }
}
```

### 별도 docs
- [docs/design-tokens.md](docs/design-tokens.md) — 기존 토큰 영역 가이드
- [docs/phase-7-design-spec-500459.md](docs/phase-7-design-spec-500459.md) — Phase 7 사건 영역 시각 spec
- [docs/phase-7-hero-design-plan.md](docs/phase-7-hero-design-plan.md) — Hero 영역 디자인 plan

---

## 4. 스타일링 패턴 영역

**기술 스택**: Next.js 16 App Router + React 19 + Tailwind CSS v4 + motion (구 framer-motion) + shadcn/ui (radix-ui 영역)

**Tailwind v4 CSS-first**:
- `globals.css` 안 `@theme` 영역 = 단일 source of truth
- `tailwind.config.ts` 영역 0 (Tailwind v3 영역 패턴 0)
- `@theme inline` 영역 = shadcn ui 영역 oklch 토큰 매핑 (본 사이트 영역 외)

**className 영역 패턴**:
```tsx
// arbitrary value 영역 (var 토큰 직접 참조)
className="text-[length:var(--text-body)] font-semibold text-[var(--color-ink-900)]"

// Tailwind 표준 클래스 영역
className="rounded-[var(--radius-md)] border border-[var(--color-ink-200)] bg-white p-6 sm:p-8"

// motion 영역
import { motion, useInView } from "motion/react";
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  viewport={{ once: true, margin: "-10%" }}
/>
```

**시안 표현 영역 (클로드 디자인 영역)**:
- 시안 = HTML/CSS/JSX 영역 자유 (Figma 영역 / Sketch 영역 / 코드 prototype 영역 모두 가능)
- 시안 영역 = `globals.css` 토큰 영역 참조 본질 (예: `var(--color-action)`, `var(--text-body)`)
- 신규 영역 = 토큰 신규 영역 + 컴포넌트 신규 영역 = 시안 영역 명시 (실제 코드 commit 0)
- shadcn ui 영역 = 본 사이트 본질 외 (fork maintenance 비용 ↑) — 시안 영역 = 본 사이트 토큰 영역 한정

---

## 5. 콘텐츠 데이터 영역 (Cowork raw-content 영역)

```
raw-content/2026타경500459/                  ← Cowork 영역 (변경 0, 룰 31)
├── post.md                                   ← mdx body + frontmatter (사건 콘텐츠 7섹션)
├── meta.json                                 ← 구조화 데이터 (highlights / bidding / rights / market / investment / photos)
├── data/                                     ← 보조 데이터 (csv / json)
└── images/                                   ← 사진 영역 (court-photos URL 영역)

content/analysis/2026타경500459.mdx           ← publish CLI 산출물 (자동 생성, 변경 0)
content/analysis/2026타경500459.meta.json    ← 동일
content/analysis/2026타경500459.audit.json   ← Gemini 2차 감시 audit 영역
```

**데이터 흐름**:
```
raw-content/{caseNumber}/  →  publish CLI (scripts/content-publish/index.mjs)  →  content/analysis/{slug}.mdx
                                                                                      ↓
                                                              src/lib/content.ts  ←──┘
                                                                      ↓
                                                  src/app/analysis/[slug]/page.tsx
                                                                      ↓
                                                  buildAnalysisMdxComponents(meta, fm)
                                                                      ↓
                                                  DetailHero (fm) + MDXRemote (post.content) + sidebar
```

**Frontmatter 영역** (`src/types/content.ts` AnalysisFrontmatter):
- `title / subtitle / summary / caseNumber / appraisal / minPrice / round / percent / bidDate / address / propertyType / areaM2 / areaPyeong / coverImage / tags / publishedAt / updatedAt / status` 등

**Photos 영역**:
- DetailHero 영역 = `coverImage` URL 패턴 매칭 → `deriveThumbs(coverImage, 4)` 4장 자동 생성
- 시안 영역 = photos 가변 영역 본질 합치 (1 / 2 / 3 / 4 / 5+ 단계 spec, sub-phase 8.1 결정 8 영역)

**⚠️ 변경 0 영역**:
- `raw-content/` 전체 = Cowork 영역 (룰 31 본질)
- `content/analysis/` 전체 = publish CLI 산출물 영역 (변경 시 다음 publish 호출 시 복원)
- `scripts/content-publish/` = publish CLI 영역 (변경 0)

---

## 6. 현재 룰 영역 (Phase 7 룰 1~33 + sub-phase 8.1 결과 — 1페이지 본질)

**전체 룰 본질 영역 = [CLAUDE.md](CLAUDE.md) § 13 코드 컨벤션 영역**

### 디자인 결정 영역 본질 (시안 영역 영향 본질만)

**룰 7** — fill bar 1.6초 + count-up 1600ms + once: true (HoverableDropRateBar 영역 본질)

**룰 13** — `viewport={{ once: true }}` 영역 시 사유 주석 의무

**룰 14** — 타이포 4pt grid + 모바일 토큰 자동 override + line-height tier (1.05 / 1.15 / 1.3 / 1.6)

**룰 18** — Hero 카드 안 사진 통합 (단계 5-4-3 옵션 C, HeroGallery 폐기 영역, DetailHero 흡수)

**룰 22** — Hero 카드 fade-in 600ms cubic + once: true (Hero 1회 진입 본질, 재진입 stagger 회피)

**룰 24-D** — 1 accent only (Action Blue 단일 토큰, sub-phase 8.1 영역). 시각 변조 영역 = Hero + CTA 한정 (룰 38)

**룰 26** — 통합 정보 꾸러미 (좌우 비대칭 lg:grid-cols-[1.4fr_1fr] / 모바일 single column)

**룰 27** — Hero 라이트 통일 (단일 흰 카드, 본문 카드 영역 변조 0)

**룰 28** — Visual Weight Triangle (h1 시각 우위 / 가격 시각 무게 ↓ / 칩 brand-300 → action 1 accent)

**룰 30** — HoverableDropRateBar ink tier 보존 (props 영역 변경 0)

**룰 31** — Cowork raw-content / data / meta 변경 0 (변조 영역 0)

**룰 32** — Pretendard Variable + font-feature-settings ss01~ss11 + kern + letter-spacing -0.02em + smoothing

**룰 33** — Web Interface Guidelines Group 2 의무 (focus-visible / aria-label / semantic HTML / 시각 신호 ↔ 액션 정합 / heading hierarchy / img / transition-all 0)

**룰 38** (PHASE-8 v1.1 신설 영역) — 변조 영역 = Hero + CTA 한정
- **변조 가능 영역 6**: Hero (DetailHero / 홈 Hero / 페이지 Hero) + CTA (ApplyCTA / TrustCTA / MobileSticky / CTA 카드) + Liquid Glass 영역 (sub-phase 8.7~8.8: TopNav / Sub-nav / Modal / Tooltip / Sticky CTA / Hero chip)
- **변조 0 영역**: 본문 카드 + 다이어그램 7 컴포넌트 + 본문 텍스트 / 표 / 리스트
- **본질 합치**: "너무 다 오픈하면 규칙이 의미 없는 수준" (형준님 본질) — 시그니처 영역 한정 + 본문 영역 룰 본질 보존

### sub-phase 8.1 결과 영역 (commit 75b1c84)
- brand-* 11단계 폐기 → Action Blue 단일 토큰 (`--color-action: #0066cc`)
- accent-yellow 폐기 → 카카오 토큰 신규 + about / RegionStrip / HeroSearch ink 톤 전환
- ApplyCTA brand-950 → ink-950 (무채색 본질)
- ink-300 정의 보존 (40+ 사용 영역 영향) + 텍스트 영역 0 정합
- font-weight 5단계 ladder 신규 + 78건 영역별 (보존 6 + 600 전환 72)
- body 16 → 17px + text-base 67건 → `text-[length:var(--text-body)]` 전환

---

## 7. 변경 0 영역 (시안 영역 절대 변경 0)

| 영역 | 사유 |
|---|---|
| `raw-content/` 전체 | Cowork 영역 (룰 31) |
| `content/analysis/` 전체 | publish CLI 산출물 영역 (변경 시 복원) |
| `scripts/content-publish/` | publish CLI 영역 |
| 사건 데이터 (2026타경500459 콘텐츠) | 단일 검증 케이스 영역 |
| `src/types/content.ts` | frontmatter / meta 스키마 영역 (Cowork 영역 호환) |
| `src/lib/datetime.ts` | 서버 사이드 날짜 영역 (Asia/Seoul 본질) |
| `src/lib/pdf/delegation.ts` | 서버 PDFKit 영역 (PDF 생성 본질) |
| `src/components/analysis/RightsNodeDiagram.tsx` 등 다이어그램 7 컴포넌트 | 룰 24-D + 룰 38 변조 0 영역 |

---

## 8. 시안 작업 영역 (클로드 디자인 영역)

**시안 탐색 본질**:
- 시안 영역 = Hero (DetailHero) + 본문 7 섹션 시각 영역 + CTA (ApplyCTA / TrustCTA) 본질
- 표현 영역 = HTML/CSS/JSX prototype + Figma + Sketch + 이미지 mockup + 모두 가능
- 토큰 영역 = `globals.css` 영역 토큰 참조 본질 (`var(--color-action)` / `var(--text-body)` 등)
- 신규 토큰 영역 / 신규 컴포넌트 영역 = 시안 영역 명시 (실제 코드 commit 0)

**시안 변조 영역 (룰 38 본질)**:
- ✅ 변조 가능: Hero + CTA + Liquid Glass 6 영역 = 비비드 일러스트 / abstract gradient / Liquid Glass / 장식적 motion / 색 영역
- ❌ 변조 0: 본문 카드 + 다이어그램 7 컴포넌트 + 본문 텍스트 / 표 / 리스트 = 룰 14 / 24-D / 27 / 32 본질 보존

**시안 → 적용 본질**:
1. 클로드 디자인 → 시안 생성 (Hero + 본문 7섹션 + CTA 전체 영역)
2. 형준님 → 시안 검토 + 정정 cycle 또는 시안 확정
3. 시안 확정 후 → Opus → 별도 Code 지시문 (실제 코드 적용 영역)
4. **본 가이드 단계 영역 = 시안 탐색 only**. 코드 commit 영역 0.

**참조 영역 (시안 영역 영향)**:
- [DESIGN-apple.md](DESIGN-apple.md) — Apple Design System 본질 (Action Blue / 17px body / font-weight 5단계 / 단일 drop-shadow / tile alternation)
- [DESIGN-cohere.md](DESIGN-cohere.md) — Cohere 본질 (형준님 영역 영역)
- 4 패턴 캡쳐 (형준님 영역 영역)
- [docs/phase-7-hero-design-plan.md](docs/phase-7-hero-design-plan.md) — Hero plan v2 + 시각 mockup 3종
- [docs/phase-7-design-spec-500459.md](docs/phase-7-design-spec-500459.md) — 사건 영역 시각 spec
- [docs/roadmap.md](docs/roadmap.md) — Phase 7~10 + v2 패키지 영역

---

## 보강 영역 (자가 검증)

- ✅ 모든 파일 경로 = 실제 코드베이스 경로 (확인됨)
- ✅ sub-phase 8.1 commit 75b1c84 결과 정확히 반영 (Action Blue + 카카오 + ink-950 + font-weight 5단계 + body 17px)
- ✅ 영구 금기 영역 명시 (Cowork raw-content / publish CLI / 사건 데이터 / 다이어그램 7 컴포넌트)
- ✅ 클로드 디자인 가이드 한 번 읽고 코드베이스 진입 본질 영역 합치
- ✅ tsc / lint / build 영역 영향 0 (가이드 문서 단일 추가 영역)
- ✅ 기존 영역 영향 0 (가이드 문서 외 모든 파일 변경 0)

**현재 진행 상태**:
- Phase 7 (룰 1~33) 마무리 완료
- sub-phase 8.1 (commit 75b1c84) 토큰 정리 완료 — Vercel auto-deploy 후 형준님 시연 영역 대기
- 다음 sub-phase 영역: 8.3 (아이콘) → 8.5 (모션) → 8.4 (a11y) → 8.2 (4pt grid) → 8.7 (Liquid Glass 토대) → 8.8 (Liquid Glass 적용) → 8.6 (다크모드) → 8.9 (검증)
