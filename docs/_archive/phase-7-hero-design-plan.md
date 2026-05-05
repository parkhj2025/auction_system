# Hero 영역 디자인 플랜 v2 (단계 5-4-2-fix-8 사전)

> **작성 영역**: docs only · 코드 변경 0
> **본질**: 본문 (02~07 섹션) 톤앤매너 계승 — Hero ↔ 본문 단절 해소
> **산출**: 옵션 3건 detail 동등 + 시각 mockup 3종 + Code 추천 + 정교 튠 dimension
> **검토 대상**: 형준님 (Q24~Q29 결정 + 정교 튠 피드백)

## v2 변경 이력

| 항목 | v1 | v2 영역 |
|---|---|---|
| 옵션 (b)·(c) detail | 압축 ("옵션 (a) 와 동등하되...") | 9 항목 detail 동등 작성 |
| 시각 mockup | 부재 | option-a/b/c.html 3종 |
| 본문 분석 보강 | 6 항목 | 6 항목 + 보완 3-A·3-B·3-C |
| 컴포넌트 트리 도식 | 부재 | 옵션별 4 컴포넌트 영향 명시 |
| 룰 정합 검증 | 7 룰 | 7 룰 + 룰 18·25·26 추가 |
| 정교 튠 dimension | 부재 | 7 dimension 가이드 |
| 회귀 detail | 압축 | h1 위치 + HoverableDropRateBar 색 전환 detail |
| 본질 4축 우선순위 | 평탄 | 우선순위 표 추가 |
| Phase 분할 | 부재 | 5 Phase 명시 |

## §1. 본질 4축 (우선순위)

| 우선순위 | 본질 축 | 충돌 시 우선 |
|---|---|---|
| 1 | 본문 톤앤매너 계승 | 절대 우선 (형준님 본질 명시) |
| 2 | 위계 회복 | 본문 일관성과 충돌 시 본문 우선 |
| 3 | 하나의 정보 꾸러미 | 위계와 충돌 시 위계 우선 |
| 4 | 다크 톤 정돈 또는 폐기 | 우선순위 1 의 결과로 자동 결정 |

## §2. 본문 디자인 패턴 자가 분석 (Phase 1)

### 2-1. 영역별 토큰 추출표 (8 컴포넌트)

| 컴포넌트 | bg | border | radius | padding | typography 핵심 | accent | motion |
|---|---|---|---|---|---|---|---|
| TimelineSection | bg-white (활성) / opacity-70 (과거) | border-ink-900 (활성) / border-border (과거) | rounded-md | p-6 sm:p-8 | h4 black + h3 black 가격 + body 1.6 + caption | bg-ink-900 "현재" 칩 + scale-1.02 + shadow-card | dur 0.4~0.6s · cubic(0.16,1,0.3,1) · once: false · stagger idx*0.1s |
| MdxTableElements | bg-surface-muted (thead) / row tone ink-50/100 | border-b border-border | — | mobile px-2 py-2 / md:px-4 md:py-3 | thead caption 600 + td body-sm | row tone (말소기준 ink-50 / 인수 ink-100 / 과거 opacity 60) | nth-child stagger 50→750ms cubic |
| PriceScatter | bg-white | border border-ink-200 | rounded-md | p-6 sm:p-8 | caption 600 + h2 black 가격 + body-sm 보조 | bg-ink-900 현재 칩 (단색) | dur 0.4~0.6s · stagger 0.2→1.6s · once: false |
| ScenarioCarousel | bg-white | border border-ink-200 | rounded-md | p-6 sm:p-8 | h4/h3 black 시나리오 + body summary + caption footer | 모노톤 ink-900 단일 (brand 0) | AnimatePresence wait · 0.35s slide x:24→0 |
| ScenarioComparisonBox | bg-white | border border-ink-200 | rounded-md | p-6 sm:p-8 | caption thead + body-sm td + tabular-nums | 활성 컬럼 bg-ink-100 + TrendingUp/Down icon + dot | once: false · 셀 stagger |
| SaleAreaSummary | bg-surface-muted | 없음 | rounded-md | p-6 sm:p-8 | caption + h4 black 카드 수치 + body-sm | bg-ink-900 ▼ marker (단색) + border-ink-900 본물건 | spring stiff:220 damp:22 · stagger 0.4/1.0/1.6 |
| CheckpointList | (부모) | 없음 | — | li padding-left 3rem | caption 600 marker (ink-900 원형) + body li | ink-900 원형 번호 marker | CSS nth-child stagger 50→800ms · 600ms cubic |
| MdxBodyElements (P/Ul/Ol) | 없음 | 없음 | — | pl-6 (list) | body + marker ink-900 | 없음 | dur 0.4s · cubic · once: false · y:8→0 |
| RightsAnalysisSection | bg-white | border border-ink-200 | rounded-xl | p-5 | caption 600 Step + h3 black 제목 + body-sm 본문 | 모노톤 | dur 0.5s · stagger idx*0.08 · whileHover y:-2 |

### 2-2. 본문 디자인 토큰 매트릭스 (종합 표준)

| 축 | 본문 가장 빈번 | 빈도 | Hero 현재 (fix-7) | 정합 |
|---|---|---|---|---|
| Background | bg-white | 5/8 | bg-ink-900 다크박스 | ✗ 색 반전 |
| Border | border border-ink-200 | 5/8 | 없음 | ✗ |
| Radius | rounded-md (10px) | 6/8 | rounded-xl (20px) | ✗ 큼 |
| Padding | p-6 sm:p-8 | 5/8 | p-6 sm:p-8 | ✓ |
| Typography 제목 | h4/h3 black ink-900 | 6/8 | h3 semibold white/90 | ✗ weight·color |
| Typography 가격 | h2 black ink-900 | 1/1 | h2 bold white | ✗ weight |
| Text color 본문 | text-ink-700 | 8/8 | text-white/60 | ✗ 색반전 |
| Text color 강조 | text-ink-900 | 8/8 | text-white | ✗ 색반전 |
| Accent | ink-900 단색 (brand 0) | 8/8 | 다크박스 자체가 accent | ✗ |
| Motion | dur 0.4s · cubic · once: false · stagger | 8/8 | 정적 (DarkInfoCluster) | ✗ motion 부재 |
| Divider | border-t border-border | 5/8 | border-t border-ink-200 | ✓ |
| Vertical spacing | mt-6 / mt-8 | 8/8 | mt-8 | ✓ |

### 2-3. Hero가 계승할 6 항목 + 본문 분석 보강 3건

**기존 6 항목**:
- (a) Background `bg-white` (다크박스 폐기)
- (b) Border `border border-ink-200`
- (c) Radius `rounded-md` (xl→md)
- (d) Typography 본문 토큰 매핑
- (e) Motion 룰 22 일관성
- (f) Accent brand-300/70 단색

**보완 3-A — MdxTableElements row tone 흡수 결정**:
- 본문 패턴: 말소기준 `bg-ink-50` / 인수 `bg-ink-100` / 과거 `opacity 60`
- Hero 적용 옵션:
  - (가) stat-grid 활성 항목 (입찰기일 임박)에 `bg-ink-50` 적용 — 본문 패턴 흡수
  - (나) Hero stat-grid는 평탄 (row tone 미적용) — Code 권고
- Q26-1 (신규) 결정 영역

**보완 3-B — 룰 13 P/Ul/Ol stagger reveal Hero 적용 결정**:
- 본문 사용: mdx body 모든 P/Ul/Ol fade-in stagger (룰 13)
- Hero 적용 옵션:
  - (가) lead summary 산문 fade-in stagger 적용 (룰 22 일관성)
  - (나) Hero 진입 1회 본질 (룰 7 fill bar once: true) 와 동기화 → stagger 미적용 — Code 권고
- 룰 7 fill bar (1.6초 once: true) 와 stagger reveal 동시 영역 충돌 점검

**보완 3-C — breadcrumbs + 카테고리 chip 위치 결정**:
- 현재: 페이지 상단 (Hero 바깥)
- 옵션별 결정:
  - (a)·(b) Hero 카드 안 헤더로 통합 (단일 정보 꾸러미)
  - (c) 페이지 상단 보존 (다크 박스 외부 분리)

## §3. 외부 영감 + 디자인 스킬 (Phase 2)

### 3-1. 외부 영감 3 사례

| 사례 | 핵심 패턴 | 본 프로젝트 정합 |
|---|---|---|
| Linear (typography-first) | size·weight·opacity tier / 라이트 통일 / monochrome | 본문 표준 8/8 정합 |
| Stripe Press (editorial paper) | 부드러운 베이지 / serif accent / quiet luxury | 미세 차이 / 한글 serif 부적합 |
| Vercel (pure black + flat) | 강한 대비 + monochrome + 0px radius | 의도적 단절 |

### 3-2. 적용 디자인 원칙
- **Linear opacity tier** (4단계): primary 100% / secondary 75% / tertiary 50% / quaternary 35%
- **Stripe monochrome + 1 accent**: brand-300 1색 (룰 24-D 보존)
- **Modular Scale 1.25** (Major Third) — 룰 14
- **4pt grid vertical rhythm** — 룰 14-D
- **Visual Weight Triangle** (TYPZA): focal > supporting > body > label

## §4. 디자인 옵션 3건 (Phase 3 — detail 동등화)

### 옵션 (a) — Linear monochrome 라이트 통일 (Code 추천)

**영감**: Linear typography-first hierarchy + 본문 디자인 시스템 직접 흡수.

**컴포넌트 트리 재구성 도식**:
```
DetailHero
├── breadcrumbs · 카테고리 chip (카드 안 헤더로 이동 — 보완 3-C)
├── 흰 카드 (단일 정보 꾸러미)
│   ├── [원형 56] [h2 700 사건 제목 + body-sm 사건번호]
│   ├── caption "2차 최저가" 라벨
│   ├── h2 900 가격 + body-lg %·brand-300/70 칩
│   ├── HoverableDropRateBar (라이트 토큰)
│   ├── ── border-t ink-200 ──
│   ├── lead summary (body / body-lg lg+)
│   ├── ── border-t ink-200 ──
│   └── stat-grid (감정가 / 입찰보증금 / 입찰기일)
└── HeroGallery (carousel · 룰 18 hotfix 보존)
```

**컴포넌트 props·state 영향**:
- DetailHero: layout 재구성 (DarkInfoCluster import 제거)
- DarkInfoCluster: **폐기** (단계 5-4-2-fix-7 phase 2 산출 폐기)
- HoverableDropRateBar: 색 토큰 변경 (white → ink) — 룰 7 motion 본질 보존
- HeroGallery: 변경 0 (룰 18 hotfix 보존)

**Layout desktop (1280px)**:
```
[breadcrumbs]
[카테고리 chip · chip · chip]

┌─ 흰 카드 ─ border ink-200 · rounded-md · p-8 ──────────┐
│  ┌─[56]─┐  사건 제목 (h2 700 ink-900)                    │
│  └──────┘  사건번호·소재지 (body-sm 400 ink-500)         │
│                                                          │
│            "2차 최저가" (caption 500 letter-0.18 ink-500)│
│            1억 2,460만원 (h2 900 ink-900 tabular-nums)   │
│            감정가 70% · −30%(brand-300/70) (body-lg)     │
│            ────── progress bar ──────                    │
│                                                          │
│  ── border-t ink-200 ──                                  │
│  Lead summary (body / body-lg lg+ ink-700)               │
│  ── border-t ink-200 ──                                  │
│  [감정가] [입찰보증금] [입찰기일]                          │
└──────────────────────────────────────────────────────────┘

[HeroGallery 한 줄 carousel]
```

**Layout mobile (375px)**:
```
[breadcrumbs]
[chip · chip]

┌─ 흰 카드 ──────────────┐
│ [원형 48]               │
│ 사건 제목 (h3 → 24)     │
│ 사건번호 (body-sm)       │
│                         │
│ "2차 최저가" (caption)   │
│ 1.246억 (h3 → 24)        │
│ 70% · −30% (body-lg → 16)│
│ progress bar            │
│ ── border-t ──           │
│ Lead summary             │
│ ── border-t ──           │
│ [감정가] [보증금] [기일]  │
│  (3-col 또는 stack · Q27)│
└─────────────────────────┘
```

**Typography 매핑 (9 row)**:
| 영역 | 토큰 | weight | color | line-height |
|---|---|---|---|---|
| 사건 제목 | text-h2 (32) | 700 | ink-900 | snug |
| 서브타이틀 | text-body-sm (14) | 400 | ink-500 | normal |
| "2차 최저가" 라벨 | text-caption (12) | 500 letter-0.18em | ink-500 uppercase | normal |
| 가격 수치 | text-h2 (32) | 900 (black) | ink-900 tabular-nums | tight |
| % 라벨 | text-body-lg (18) | 500 | ink-700 | normal |
| "−30%" 칩 | text-body-sm (14) | 600 | ink-900 / bg-brand-300/70 | normal |
| Lead summary | text-body / body-lg lg+ | 400 | ink-700 | relaxed |
| stat-grid 라벨 | text-caption (12) | 500 letter-0.05em | ink-500 uppercase | normal |
| stat-grid 수치 | text-body-lg (18) | 600 | ink-900 tabular-nums | tight |

**Color·Tone**:
- Background: `bg-white`
- Border 외각: `border border-ink-200`
- Border divider: `border-t border-ink-200`
- Text 4 tier: ink-900 / ink-700 / ink-500 / ink-300
- Accent: `bg-brand-300/70` (−X% 칩)

**Spacing**:
- 카드 padding: `p-6 sm:p-8`
- 카드 내 vertical: `space-y-6`
- breadcrumbs ↔ 카드: `mt-8`
- carousel ↔ 카드: `mt-7`

**Motion**:
- 카드 첫 진입 fade-in: opacity 0→1 + y:8→0 / 600ms cubic / once: true (Hero 1회 본질)
- HoverableDropRateBar fill bar 1.6초 (룰 7 보존)
- progress bar 색 (다크 white → 라이트 ink)

**본문 일관성 테스트** (10 룰):
| 룰 | 본문 사용 | 옵션 (a) | 정합 |
|---|---|---|---|
| 룰 14 typography | h2/h3/body/caption | 동일 | ✓ |
| 룰 14-D padding | p-6 sm:p-8 | 동일 | ✓ |
| 룰 17/19 표 | bg-white border-ink-200 | 동일 | ✓ |
| 룰 18 (HeroGallery) | hotfix e099ce6 | 보존 | ✓ |
| 룰 22 motion | dur 400ms once:false | 600ms once:true | △ Hero 본질 |
| 룰 23 Safari font | Pretendard fallback | 동일 | ✓ |
| 룰 24-C opacity tier | white tier (다크) | ink tier (라이트) | ✓ 패턴 동일 |
| 룰 24-D brand-300 | − 칩 | 보존 | ✓ |
| 룰 25 Pretendard CDN | layout.tsx 적용 | 보존 | ✓ |
| 룰 26 Hero 통합 | 다크 박스 안 h1 | 흰 카드 안 h1 | △ 의도 |

**장점 3건**:
1. 본문 톤앤매너 직접 정합 (8/8 컴포넌트 패턴)
2. 시각 위계 회복 (Linear typography-first)
3. 단절 0 (본문→Hero 흐름 자연)

**단점 2건**:
1. Hero 강조 약화 (사건 제목·가격 weight·size 차등으로 보강)
2. 모노톤 강 (brand-300/70 1색만)

**구현 영향**:
- 변경: DetailHero (대규모) · HoverableDropRateBar (다크 → 라이트 토큰)
- 회귀 위험: HoverableDropRateBar fill bar 색 전환 (룰 7 motion 본질 보존, 색만 정정)
- DarkInfoCluster: **폐기** (fix-7 phase 2 산출 → fix-8 변경)

---

### 옵션 (b) — Stripe Press editorial

**영감**: Stripe Press 편집 톤 — 부드러운 베이지·아이보리, quiet luxury.

**컴포넌트 트리 재구성 도식**:
```
DetailHero
├── breadcrumbs · 카테고리 chip (카드 안 헤더 통합)
├── 페이퍼 카드 (bg-paper #FAF7F0)
│   ├── [원형 56] [h2 700 사건 제목 + body-sm 사건번호]
│   ├── caption "2차 최저가" 라벨
│   ├── h2 900 가격 + body-lg %·brand-300/70 칩
│   ├── HoverableDropRateBar (라이트 토큰)
│   ├── ── border-t ink-300 ──
│   ├── lead summary
│   ├── ── border-t ink-300 ──
│   └── stat-grid
└── HeroGallery (carousel)
```

**컴포넌트 props·state 영향**:
- DetailHero: layout 재구성 + bg-paper 신규 토큰 적용
- DarkInfoCluster: **폐기** (옵션 (a)와 동등)
- HoverableDropRateBar: 색 토큰 변경 (white → ink)
- HeroGallery: 변경 0
- globals.css: `--color-paper: #FAF7F0` 신규 토큰 추가 (Phase 8 일부 선행)

**Layout desktop (1280px)**: 옵션 (a)와 layout 동등. 외각 `bg-paper #FAF7F0` + `border border-ink-300`.

**Layout mobile (375px)**: 옵션 (a)와 동등.

**Typography 매핑 (9 row)** — 옵션 (a)와 동일:
| 영역 | 토큰 | weight | color | line-height |
|---|---|---|---|---|
| 사건 제목 | text-h2 | 700 | ink-900 | snug |
| 서브타이틀 | text-body-sm | 400 | ink-500 | normal |
| "2차 최저가" 라벨 | text-caption | 500 letter-0.18em | ink-500 uppercase | normal |
| 가격 수치 | text-h2 | 900 | ink-900 tabular-nums | tight |
| % 라벨 | text-body-lg | 500 | ink-700 | normal |
| "−30%" 칩 | text-body-sm | 600 | ink-900 / bg-brand-300/70 | normal |
| Lead summary | text-body / body-lg lg+ | 400 | ink-700 | relaxed |
| stat-grid 라벨 | text-caption | 500 letter-0.05em | ink-500 uppercase | normal |
| stat-grid 수치 | text-body-lg | 600 | ink-900 tabular-nums | tight |

**Color·Tone**:
- Background: `bg-paper` (#FAF7F0 베이지·아이보리, 신규 token)
- Border 외각: `border border-ink-300` (페이퍼 톤 정합)
- Border divider: `border-t border-ink-300`
- Text 4 tier: ink-900 / ink-700 / ink-500 / ink-300
- Accent: `bg-brand-300/70`

**Spacing** — 옵션 (a)와 동일: padding p-6 sm:p-8 / vertical space-y-6 / breadcrumbs↔카드 mt-8 / carousel↔카드 mt-7

**Motion** — 옵션 (a)와 동일:
- 카드 fade-in 600ms cubic once: true
- HoverableDropRateBar 1.6초

**본문 일관성 테스트** (10 룰):
| 룰 | 본문 사용 | 옵션 (b) | 정합 |
|---|---|---|---|
| 룰 14 typography | h2/h3/body/caption | 동일 | ✓ |
| 룰 14-D padding | p-6 sm:p-8 | 동일 | ✓ |
| 룰 17/19 표 | bg-white | bg-paper (베이지) | ✗ 색 차별화 (의도) |
| 룰 18 (HeroGallery) | hotfix 보존 | 보존 | ✓ |
| 룰 22 motion | once:false | once:true | △ Hero 본질 |
| 룰 23 Safari font | Pretendard | 보존 | ✓ |
| 룰 24-C opacity tier | white tier (다크) | ink tier (페이퍼) | ✓ 패턴 동일 |
| 룰 24-D brand-300 | − 칩 | 보존 | ✓ |
| 룰 25 Pretendard CDN | 적용 | 보존 | ✓ |
| 룰 26 Hero 통합 | 다크 박스 안 h1 | 페이퍼 카드 안 h1 | △ 의도 |

**장점 3건**:
1. 본문과 미세 차이 (Hero 영역 식별 신호)
2. quiet luxury 톤 (실용·합리·확실 키워드 정합)
3. 한국 부동산 도메인 신뢰감 (편집 톤)

**단점 2건**:
1. 신규 색 토큰 도입 (`--color-paper`) — 디자인 시스템 확장
2. 본문 흰과 미세 차이 — 모니터·환경별 표시 차이 영향

**구현 영향**:
- 변경: DetailHero · HoverableDropRateBar · `globals.css` (`--color-paper` 추가)
- 회귀 위험: 신규 토큰 도입은 Phase 8 일부 선행, Phase 7 한정 영향 미미
- DarkInfoCluster: 폐기

---

### 옵션 (c) — Vercel pure black + 흰 명확 대비

**영감**: Vercel pure black + monochrome + flat 0px radius (의도적 단절).

**컴포넌트 트리 재구성 도식**:
```
DetailHero
├── breadcrumbs · 카테고리 chip (페이지 상단 보존, 카드 외부)
├── DarkInfoCluster (다크 박스 보존 — radius·border 정정)
│   ├── [원형 56 white/30 border]
│   ├── 사건 제목 (h2 600 white/90 — weight 강화)
│   ├── 서브타이틀 (body-sm white/60)
│   ├── caption "2차 최저가" 라벨
│   ├── 가격 (h2 900 white)
│   ├── %·−30% 칩 (white/70 + brand-300/70)
│   └── HoverableDropRateBar (다크 토큰 보존)
├── 흰 카드 (lead + stat-grid 통합)
│   ├── lead summary (body ink-700)
│   ├── ── border-t ink-200 ──
│   └── stat-grid
└── HeroGallery (carousel)
```

**컴포넌트 props·state 영향**:
- DetailHero: 다크 박스 + 흰 영역 분리 보존 (룰 26 본질 보존)
- DarkInfoCluster: **보존** + radius xl→md + border 추가 (white/15)
- HoverableDropRateBar: 변경 0 (다크 토큰 보존)
- HeroGallery: 변경 0
- globals.css: `--color-ink-950` 활용 (이미 추가됨)

**Layout desktop (1280px)**:
```
[breadcrumbs]
[카테고리 chip · chip · chip]

┌─ 다크 박스 (bg-black 또는 ink-950) · border white/15 · rounded-md · p-8 ─┐
│  ┌─[56]─┐  사건 제목 (h2 600 white/90)                                    │
│  └──────┘  사건번호·소재지 (body-sm white/60)                             │
│                                                                          │
│            "2차 최저가" (caption 500 letter-0.18 white/60)                │
│            1억 2,460만원 (h2 900 white tabular-nums)                      │
│            감정가 70% · −30%(brand-300/70) (body-lg white/70)             │
│            ────── progress bar (white tier 보존) ──────                   │
└──────────────────────────────────────────────────────────────────────────┘

┌─ 흰 카드 · border ink-200 · rounded-md · p-8 ──┐
│  Lead summary (body / body-lg lg+ ink-700)     │
│  ── border-t ink-200 ──                        │
│  [감정가] [입찰보증금] [입찰기일]                 │
└────────────────────────────────────────────────┘

[HeroGallery]
```

**Layout mobile (375px)**:
```
[breadcrumbs · chip]

┌─ 다크 박스 ──────────┐
│ [원형 48 white/30]    │
│ 사건 제목 (h3)         │
│ 사건번호               │
│ "2차 최저가"            │
│ 가격 (h3)               │
│ % · −30%               │
│ progress bar           │
└─────────────────────┘

┌─ 흰 카드 ──────────────┐
│ Lead summary           │
│ ── border-t ──          │
│ stat-grid              │
└────────────────────────┘
```

**Typography 매핑 (9 row)** — 색만 white tier 차이:
| 영역 | 토큰 | weight | color | line-height |
|---|---|---|---|---|
| 사건 제목 | text-h2 | 600 | white/90 | snug |
| 서브타이틀 | text-body-sm | 400 | white/60 | normal |
| "2차 최저가" 라벨 | text-caption | 500 letter-0.18em | white/60 uppercase | normal |
| 가격 수치 | text-h2 | 900 | white tabular-nums | tight |
| % 라벨 | text-body-lg | 500 | white/70 | normal |
| "−30%" 칩 | text-body-sm | 600 | ink-900 / bg-brand-300/70 | normal |
| Lead summary | text-body / body-lg lg+ | 400 | ink-700 (흰 카드) | relaxed |
| stat-grid 라벨 | text-caption | 500 letter-0.05em | ink-500 uppercase | normal |
| stat-grid 수치 | text-body-lg | 600 | ink-900 tabular-nums | tight |

**Color·Tone**:
- Background 다크: `bg-black` (#000) 또는 `bg-ink-950` (#020617) — Q29 결정
- Background 흰: `bg-white`
- Border 다크: `border border-white/15`
- Border 흰: `border border-ink-200`
- Text 다크 4 tier: white / white/90 / white/70 / white/60
- Text 흰 4 tier: ink-900 / ink-700 / ink-500 / ink-300
- Accent: `bg-brand-300/70`

**Spacing** — 옵션 (a) 동일: padding p-6 sm:p-8 / vertical space-y-6 / 카드 간 mt-6

**Motion**:
- 다크 박스 fade-in 600ms cubic once: true
- HoverableDropRateBar 1.6초 (룰 7 보존, 색 보존)

**본문 일관성 테스트** (10 룰):
| 룰 | 본문 사용 | 옵션 (c) | 정합 |
|---|---|---|---|
| 룰 14 typography | h2/h3/body/caption | 동일 | ✓ |
| 룰 14-D padding | p-6 sm:p-8 | 동일 | ✓ |
| 룰 17/19 표 | bg-white border-ink-200 | 다크 + 흰 분리 | ✗ 의도적 단절 |
| 룰 18 (HeroGallery) | hotfix 보존 | 보존 | ✓ |
| 룰 22 motion | once:false | once:true | △ Hero 본질 |
| 룰 23 Safari font | Pretendard | 보존 | ✓ |
| 룰 24-C opacity tier | white tier (다크) | white tier 보존 | ✓ |
| 룰 24-D brand-300 | − 칩 | 보존 | ✓ |
| 룰 25 Pretendard CDN | 적용 | 보존 | ✓ |
| 룰 26 Hero 통합 | 다크 박스 안 h1 | 보존 (다크 위치) | ✓ |

**장점 3건**:
1. Hero 위계 강화 (다크 = "여기는 메인 페이지" 신호 강함)
2. 단계 5-4-2-fix-7 룰 26 진전 영역 보존 (회귀 위험 최소)
3. weight·color·radius·border 정정만으로 "촌스러움" 영역 부분 정정

**단점 2건**:
1. 본문 톤앤매너 단절 (본질 4축 ① 위반)
2. ink-900 → black 정정해도 형준님 평가 충족 불확실

**구현 영향**:
- 변경: DetailHero (radius·border만) · DarkInfoCluster (radius xl→md + border white/15)
- 회귀 위험: 룰 26 진전 영역 보존, 단 본질 미달 가능성
- HoverableDropRateBar: 변경 0

## §5. Code 추천 + 정교 튠 dimension (Phase 4)

### Code 추천: 옵션 (a) Linear monochrome 라이트 통일

**추천 사유 5건**:
1. **본문 톤앤매너 직접 정합** — Phase 1 분석 8/8 컴포넌트 패턴 흡수
2. **위계 회복 자연** — Linear typography-first + Visual Weight Triangle
3. **하나의 정보 꾸러미 가능** — 단일 흰 카드 안 통합 (다크·흰 분리 폐기)
4. **다크 톤 폐기** → 형준님 "촌스러움" 평가 직접 정정
5. **룰 1~26 정합 ✓** — 룰 22 motion 일부 부분 정합 (Hero 진입 1회 본질)

**우려 영역 2건**:
1. **Hero 강조 약화** — 사건 제목 + 가격 weight·size 차등 + brand-300/70 칩 보강 본질 검증 필요
2. **HoverableDropRateBar 색 전환 회귀** — 다크 → 라이트 토큰. 룰 7 motion 본질 보존 + 색만 정정

### 회귀 detail (옵션 a·b 적용 시)

**페이지 h1 위치 변경 영향**:
- 현재: 다크 박스 안 페이지 h1
- 변경: 흰/페이퍼 카드 안 페이지 h1
- a11y: `aria-labelledby="detail-title"` id 참조 영역 검증 (변경 없음)
- SEO: meta title 영향 0

**HoverableDropRateBar 색 전환 영향**:
- fill bar: `bg-white` → `bg-ink-700`
- 70% mark: `bg-white/80` → `bg-ink-900`
- "−X%" 칩: `bg-brand-300/70` 보존
- 룰 7 motion 본질 (1.6초 cubic + count-up + once: true) 100% 보존

### 정교 튠 dimension (Q24~Q29 결정 후 적용)

| dimension | 옵션 (a) 채택 시 튠 영역 |
|---|---|
| Typography weight 사건 제목 | 600 (Linear softer) / **700 (Code 추천)** / 800 (가격 평탄) |
| Color shade accent | brand-300/70 (Code 추천) / brand-400/50 / brand-500/40 |
| Spacing 카드 padding | p-6 sm:p-8 (Code 추천) / p-7 sm:p-9 / p-8 sm:p-10 |
| Motion 카드 fade-in | 400ms / **600ms (Code 추천)** / 800ms / 1000ms |
| Border weight | **1px (Code 추천)** / 0.5px |
| Divider 위치 | **lead → border-t → stat-grid (Code 추천)** / divider 0 |
| 가격 size | **h2 32 (Code 추천)** / h1 40 / display 64 |

## §6. 형준님 결정 항목 (Q24~Q29)

**Q24** — 옵션 선택:
- (a) Linear monochrome (Code 추천)
- (b) Stripe Press editorial
- (c) Vercel pure black
- (d) 추가 발굴 옵션

**Q25** — 사건 제목 weight (옵션 (a)·(b) 채택 시):
- 700 (Code 추천)
- 600 (semibold softer)
- 800 (extrabold focal)

**Q26** — Lead summary 위치:
- 카드 안 lead → border-t → stat-grid (Code 추천)
- 카드 외 별도 영역

**Q26-1** (보완 3-A) — stat-grid row tone 흡수 결정:
- (가) 활성 항목 (입찰기일 임박)에 `bg-ink-50` 적용
- (나) 평탄 (Code 권고)

**Q26-2** (보완 3-B) — Lead summary stagger reveal 적용:
- (가) fade-in stagger 적용 (룰 22 일관성)
- (나) Hero 진입 1회 본질 (룰 7 once: true) 동기화 (Code 권고)

**Q27** — 모바일 stat-grid:
- 3-col 유지
- 단일 column stack

**Q28** — 옵션 (b) 채택 시 신규 토큰 `--color-paper`:
- 추가 (Phase 8 일부 선행)
- 추가 보류

**Q29** — 옵션 (c) 채택 시 색 정정:
- ink-900 → black (#000000)
- ink-900 → ink-950 (#020617)

## §7. 시각 mockup 3종 (Phase 4)

브라우저 직접 열기:
```
open docs/phase-7-hero-mockups/option-a.html
open docs/phase-7-hero-mockups/option-b.html
open docs/phase-7-hero-mockups/option-c.html
```

각 mockup:
- 정적 HTML 단일 파일 (Pretendard CDN 외 의존성 0)
- globals.css 토큰 inline 추출
- 본 사건 500459 실데이터
- desktop 1280px + mobile 375px 좌우 분할 표시
- 본문 영역 (ScenarioComparisonBox 모방) 첨부 → Hero ↔ 본문 시각 비교

## §8. 구현 Phase 분할 (단계 5-4-2-fix-8)

형준님 결정 후 patch 시 Phase 분할:

- **Phase 1**: 선행 토큰 (필요 시 globals.css `--color-paper` 또는 `--color-ink-950` 활용)
- **Phase 2**: 구조 변경 (DetailHero·DarkInfoCluster 컴포넌트 트리 재구성)
- **Phase 3**: 색·typography 적용 (Phase 1 토큰 사용)
- **Phase 4**: 모션 추가 (룰 22 일관성)
- **Phase 5**: 검증 (브라우저 시연·룰 grep·회귀)

각 Phase 마다 Cowork·publish CLI·meta 동결 재명시.

## §9. 다음 단계

1. **Code (현재)** → docs v2 + mockup 3종 작성 + commit + push
2. **Code** → 형준님에게 mockup 경로 보고
3. **Opus** → plan v2 + mockup 검수
4. **형준님** → 브라우저 mockup 시각 비교 + Q24~Q29 결정 + 정교 튠 피드백
5. **Opus** → 단계 5-4-2-fix-8 patch 지시문 작성
6. **Code** → 단계 5-4-2-fix-8 구현 + commit + push
7. **형준님** → production 시연 평가 → "이거 진짜 다르네" PASS / FAIL
8. (PASS) → 잔여 약점 별도 patch
9. (FAIL) → 단계 5-4-2-fix-9 보강
