# Phase 7 단계 3-2 — Cowork 원천 자료 → /analysis 페이지 시각 강화 Plan

작성일: 2026-04-26
이전 단계: 3-1 G1 보강 (commit `2615e7d`) + preview/ 폐기 + Hero·Sidebar·CTA·Trust·Compliance baseline 통합
대상 라우트: `/analysis/[slug]`
참조 사건: `2024타경567436` (Cowork v2.6.2 신규 산출, schema `auction-content/v1`)

본 문서는 Plan 산출(코드 변경 0). Build 단계 형준님 승인 후 실제 구현 진행.

---

## §0. 현 상태 점검

### git 이력 (최근 10 commit)

```
2615e7d refactor(analysis/compliance): unified ComplianceNotice + footnote compression
d92a361 feat(analysis/mdx-blocks): scenario cards + conclusion callout + checkpoint num-circle
90409b2 refactor(analysis/sections): remove sub-label chips
04ca1d6 refactor(analysis/hero): drop main image + h1 hierarchy + meta inline + bottom thumb strip
5fc6b0d refactor(analysis): promote preview/ wireframe to /analysis/[slug] route
918fe97 feat(analysis/cta): 3-column fee/success/fail grid
c06f1be feat(analysis): trust 4-grid block before ApplyCTA
9284d0a feat(analysis/sidebar): 4 block sticky (mini-stats + CTA + TOC + sources)
65c11fc feat(analysis/hero): 4-cell stat grid + thumbnail strip gallery (A')
d293617 fix(analysis/mdx): block inline images + unified table + row tone marks
```

### 단계 3-1 G1 보강 확정 (불변)

- mdx Img → null (본문 인라인 사진 차단)
- mdx del/s → passthrough (취소선 차단)
- remark-gfm `singleTilde:false`
- SectionHeader badge 폐기 (sub-label chip 0건)
- Hero h1 위계: text-4xl→text-6xl + font-extrabold
- Hero gallery main 폐기, thumbnail strip 4장 가로
- Sidebar 4 block sticky (핵심 수치 + CTA + TOC + 근거자료)

### page.tsx 현 구조 (commit 2615e7d)

```
<DetailHero fm={fm} />
<article>
  <GatingWrapper>
    <MDXRemote source={post.content}
      remarkPlugins={[[remarkGfm, {singleTilde:false}], remarkAnalysisBlocks]}
      components={buildAnalysisMdxComponents()} />
  </GatingWrapper>
  <TrustBlock />
  <ApplyCTA fm={fm} />
  <RelatedCards posts={related} />
  <ComplianceNotice />
</article>
<DetailSidebar fm={fm} />
```

### 567436 raw-content 구조

```
raw-content/2024타경567436/
├── README.md
├── post.md             (### sections 9개 + ## h2 7개 + 본문 ![] 9장)
├── meta.json           (schema "auction-content/v1", 156줄)
└── data/
    ├── crawler_summary.json
    ├── parsed.json
    └── photos_meta.json
```

### meta.json 주요 키 (schema "auction-content/v1")

| 최상위 키 | 내용 | 본 단계 활용 |
|---|---|---|
| `case_number / court / court_division / bid_date / bid_time` | 기본 메타 | DetailHero 보조 |
| `property` | 주소·단지명·면적 | DetailHero 보조 |
| `price` | appraisal / min_price / rate / round | DetailHero stat-grid |
| `hero` | image / headline / sub_headline / price_badge | DetailHero (frontmatter 보강) |
| **`highlights[]`** | 5개 label/value | DetailSidebar MiniStat 보강 |
| `card` | 제목·요약·태그 (frontmatter 와 중복) | 사용 0 (frontmatter 우선) |
| **`sections.bidding.history[]`** | 회차 timeline | TimelineSection (신규 02) |
| **`sections.rights`** | basis_date / tenants[] | RightsCallout (신규 03) |
| **`sections.market`** | 매매 평균·중위·건수 | MarketCompareCard (신규 04) |
| **`sections.investment`** | scenario_a/b/c1/c2 | ScenarioCards 색 분기 (신규 05) |
| `photos.used[]` | 9장 URL | PhotoGalleryStrip (신규 dedicated) |
| `crawler_summary` | tier_final / sale_count | 사용 0 (시스템 어휘 차단) |

### frontmatter schema 차이 발견 (Build 단계 검토 필요)

567436 frontmatter 는 `saleDate / saleTime / bidRound / minRate` 사용. 기존 `AnalysisFrontmatter` 타입(`bidDate / bidTime / round / percent`)과 키 이름 차이. **publish CLI 가 변환을 담당**하는 것이 본 Plan 전제 (Code 가 frontmatter 스키마 임의 변경 0). Build 단계 진입 시 이 변환 동작 확인 필요.

---

## §1. 데이터 어댑터 매핑

### 1-1. 어댑터 함수 설계 (구현 0, 시그니처만)

```ts
// src/lib/content/analysis-meta.ts (신규 파일 후보, Build 단계 작성)

export interface AnalysisMeta {
  hero?: HeroMeta;
  highlights?: Array<{ label: string; value: string }>;
  bidding?: { history: BiddingEntry[] };
  rights?: RightsMeta;
  market?: MarketMeta;
  investment?: InvestmentMeta;
  photos?: { total: number; used: string[]; cover?: string };
}

export function getAnalysisMeta(caseId: string): AnalysisMeta | null {
  // 1. raw-content/{caseId}/meta.json 존재 확인
  // 2. JSON 파싱 + schema "auction-content/v1" 검증
  // 3. 누락 시 null 반환 (페이지는 fallback 동작)
}
```

### 1-2. meta.json → 컴포넌트 props 매핑 표

| 컴포넌트 | meta.json 필드 | fallback (meta 없을 때) |
|---|---|---|
| **DetailHero** (보강) | `hero.image` (cover), `hero.price_badge` (chip 추가), `highlights[0..4]` (4-stat grid sub) | frontmatter.coverImage / 현 stat-grid 그대로 |
| **DetailSidebar** (보강) | `highlights[]` 5개 → MiniStat 5칸 정밀 라벨 | 현재 5 MiniStat (감정가/최저가/보증금/기일/면적) 그대로 |
| **TimelineSection** (신규) | `sections.bidding.history[]` `{round, date, minimum, rate, result}` | 02 mdx 표 그대로 (현 baseline) |
| **RightsCallout** (신규) | `sections.rights.basis_date / basis_type / basis_holder / tenants[]` | 03 mdx 표 + 행 색 분기 (현 baseline) |
| **MarketCompareCard** (신규) | `sections.market.매매_평균 / 중위 / 건수` + frontmatter.appraisal | 04 mdx 표 그대로 |
| **ScenarioCards** (신규) | `sections.investment.scenario_a/b/c1/c2` + 색 분기 (§2-4 참조) | 05 mdx 표 + 시나리오 카드 wrap (현 baseline) |
| **AuctionStatsGrid** (신규) | (meta 미지원) | 06 mdx 표 그대로 — **Cowork 측 schema 확장 후 활성** |
| **PhotoGalleryStrip** (신규) | `photos.used[]` 0~8 | frontmatter.coverImage URL 패턴 도출 (현 HeroGallery 와 동일) |
| **ComplianceFooter** (개선) | (사용 0 — `lib/constants.COMPLIANCE_ITEMS` 단일 SSOT 유지) | n/a |

### 1-3. fallback 정책

**원칙**: meta.json 누락 시 페이지가 깨지지 않아야 함. 모든 신규 컴포넌트는 `meta` prop optional + null 처리.

| 시나리오 | 정책 |
|---|---|
| meta.json 자체 없음 | 신규 컴포넌트 0건 렌더 (단계 3-1 baseline 그대로 — mdx 표만) |
| meta.sections.bidding 없음 | TimelineSection 0건 렌더 (mdx 표 fallback) |
| meta.sections.investment.scenario_X 없음 | 해당 시나리오 카드 0건 (다른 시나리오만 표시) |
| meta.photos.used 없음 | PhotoGalleryStrip 은 frontmatter.coverImage URL 패턴(현 HeroGallery 도출 로직) fallback |

### 1-4. raw-content/ 접근 시점

빌드 시 SSG (`dynamicParams: false` + `generateStaticParams`). 빌드 시점에 `fs.readFileSync` 로 `raw-content/{caseId}/meta.json` 읽기. 런타임 의존 0.

**전제**: 배포 환경(Vercel)에 raw-content/ 가 포함됨. 또는 publish CLI 가 mdx 옆에 `content/analysis/{slug}.meta.json` 동행 산출. Build 단계 진입 시 형준님 결정 필요.

권고: **publish CLI 확장 — content/analysis/{slug}.mdx 와 함께 `{slug}.meta.json` 산출**. Code 측 page.tsx 는 `getAnalysisMeta(slug)` 가 `content/analysis/` 에서 직접 읽음. raw-content/ 의존성 0 — 배포 환경 영향 0.

---

## §2. 시각 컴포넌트 wireframe 7건

각 컴포넌트는 **신규 파일 1개씩** (`src/components/analysis/`). 색 분기는 단계 2 시맨틱 토큰만 사용 (success / warning / info / brand). voice_guide §5-4 사실 신호 어휘 준수: "추천·위험·매력·교훈·함정" 어휘 0.

### 2-1. TimelineSection (02 입찰 경과)

**입력**: `meta.sections.bidding.history[]`

**ASCII wireframe**:

```
[ Section 02 헤더: 02 · 입찰 경과 ]

  ●─────────────────────────────────────────────
  │  1차 · 2026-03-24 · 9억 1,800만원 (100%)   ◯ 유찰
  │
  ●─────────────────────────────────────────────
  │  2차 · 2026-04-23 · 6억 4,260만원 (70%)    ◯ 유찰
  │
  ●─────────────────────────────────────────────
     3차 · 2026-05-28 · 4억 4,982만원 (49%)    ▶ 진행 (현재)
```

**색 분기** (사실 신호):
- `유찰` → marker dot `--color-ink-300` (neutral)
- `매각` → marker dot `--color-success`
- `미납` → marker dot `--color-warning`
- `진행` (현재 회차) → marker dot `--color-brand-600` + `▶ 진행` chip

**구조**: vertical timeline. 각 entry = `<li>` flex (dot + 본문). 하단 진행 entry 는 강조.

**fallback**: `meta.sections.bidding.history` 없을 때 → mdx 표 그대로 (현 baseline + Tr 행 색 분기).

---

### 2-2. RightsCallout (03 권리 분석)

**입력**: `meta.sections.rights.{basis_date, basis_type, basis_holder, total_claims, tenants[]}`

**ASCII wireframe**:

```
[ Section 03 헤더 ]

┌──────────────────────────────────────────────────┐
│ ▌ 말소기준등기                                    │
│   2022-02-25 · 근저당권 · 에스비아이저축은행      │
│   채권 합계 9억 5,934만 3,290원                   │
└──────────────────────────────────────────────────┘
   (border-l-4 brand-600 + bg-brand-50)

┌──────────────────────────────────────────────────┐
│ ▌ 임차인 (1명)                                    │
│   박영민 · 전입 2022-03-03 · 대항력 없음          │
│   분석: 채무자 이상헌의 동거인으로 추정            │
└──────────────────────────────────────────────────┘
   (border-l-4 ink-500 + bg-surface-muted)

[ 03 본문 등기부 표 (mdx 그대로 — 행 색 분기 보존) ]
```

**색 분기**:
- 말소기준등기 callout → `--color-brand-600` border + `--color-brand-50` bg
- 임차인 callout (대항력 없음) → `--color-ink-500` border + `--color-surface-muted` bg
- 임차인 callout (대항력 있음 + 인수) → `--color-danger` border + `--color-danger-soft` bg

**voice_guide 준수**: "위험" / "주의" 어휘 0. callout 내 텍스트는 사실 어휘만 (말소기준등기 / 대항력 없음 / 동거인 추정 — 모두 사실 표기).

**fallback**: meta.sections.rights 없을 때 → 03 mdx 표 + Tr 행 색 분기 (현 baseline).

---

### 2-3. MarketCompareCard (04 시세 비교)

**입력**: `meta.sections.market.{매매_평균, 매매_중위, 매매_건수}` + `frontmatter.appraisal` + `frontmatter.minPrice`

**ASCII wireframe**:

```
[ Section 04 헤더 ]

> 본 단지 동일 평형 호가 8.5억~10.5억대. 3차 최저가 4.49억은
> 호가 하단 대비 약 53% 수준입니다.    ← 한 줄 결론 (callout)

┌──────────────┬──────────────┬──────────────┐
│ 감정가        │ 시세 평균     │ 3차 최저가    │
│ 9억 1,800만   │ 9억 5,846만   │ 4억 4,982만  │
│ ────         │ +445만 (+0.5%)│ -469백만 (-49%)│
│              │  vs 감정가     │  vs 감정가    │
└──────────────┴──────────────┴──────────────┘
   3 카드 grid · 시세 평균 카드 = brand-50 강조

[ 04 본문 표 (mdx 그대로) ]
```

**색 분기**:
- 감정가 카드 → 흰 배경 + ink-700
- 시세 평균 카드 → `--color-brand-50` bg + `--color-brand-700` 텍스트 (정보 정점)
- 최저가 카드 → 흰 배경 + `--color-success` accent (할인 폭 표시)

**voice_guide 준수**: 비교 결론 텍스트는 voice_guide §5-2 패턴 ("호가 하단 대비 약 N% 수준") 준수. 판정 어휘 ("저평가·고평가") 0.

**fallback**: meta.sections.market 없을 때 → 04 mdx 표 + 결론 callout 0건 (현 baseline).

---

### 2-4. ScenarioCards (05 투자 시뮬) — 색 분기 신규

**입력**: `meta.sections.investment.{scenario_a, scenario_b, scenario_c1, scenario_c2}`

**ASCII wireframe**:

```
[ Section 05 헤더 + intro ]

┌─ 시나리오 A — 실거주 매입 ─────────────────────┐ ← border-l-4 success
│ 감정가 대비 약 4억 6,818만원 할인 입주.        │
│ 자기자본 (대출 시) 약 2억 1,538만원              │
│ ┌──────────┬──────────┐                       │
│ │ 실질 취득비│ 4억 8,527만원│                  │
│ │ 할인     │ 4억 6,818만원│                  │
│ │ 호가 비율 │ 약 57%      │                  │
│ └──────────┴──────────┘                       │
└──────────────────────────────────────────────┘

┌─ 시나리오 B — 1년 미만 매도 ───────────────────┐ ← border-l-4 success
│ 세후 순수익 약 9,456만원 ...                  │
└──────────────────────────────────────────────┘

┌─ 시나리오 C-1 — 전세 갭투자 ──────────────────┐ ← border-l-4 ink-500 (neutral)
│ 갭(실투자금) 약 3,527만원 ...                  │
└──────────────────────────────────────────────┘

┌─ 시나리오 C-2 — 월세 운용 ────────────────────┐ ← border-l-4 warning
│ 연 수익률 약 4.6%, 회수 약 21년 ...           │
└──────────────────────────────────────────────┘
```

**색 분기 매핑** (voice_guide §5-4 사실 신호 어휘만):

| 카드 | 분류 baseline | 토큰 | 판단 키 (meta.investment 필드) |
|---|---|---|---|
| 시나리오 A (실거주) | 양 (positive) | `border-l-success` `bg-success-soft/30` | `discount_from_appraisal > 0` → 양 |
| 시나리오 B (단기 매도) | 양 (positive) | `border-l-success` `bg-success-soft/30` | `after_tax_profit > 0` → 양 |
| 시나리오 C-1 (전세 갭) | 중립 (neutral) | `border-l-ink-500` `bg-surface-muted` | `gap` 양/음 따라 — 567436 = 약 3,527만원(중립) |
| 시나리오 C-2 (월세) | 손실 (subtle warn) | `border-l-warning` `bg-warning-soft/30` | `annual_yield < 5` → subtle warn |

**색 분기 어휘 보존 원칙**: 카드 헤더 = H3 텍스트 그대로 ("시나리오 A — 실거주 매입"). 카드 안 텍스트 = mdx 본문 그대로. **색만 추가**, 어휘 변경 0. "추천 시나리오" 마크 / "위험 시나리오" 라벨 0건.

**한계 — 단계 3-2 baseline 만**: 색 분기 판정 키는 위 매핑 표 기준의 **간단 휴리스틱**. 정밀 분류 (예: 시나리오 B 양도세율 변화 시 손실 가능성) 는 단계 3-3 또는 voice_guide 후속 보강 시 검토.

**fallback**: meta.sections.investment 없을 때 → 단계 3-1 의 ScenarioCard wrap (모두 brand-600 border, 색 분기 0).

---

### 2-5. AuctionStatsGrid (06 매각사례) — schema 확장 대기

**입력**: (meta.json 에 sale_history 키 없음)

**현재 567436 의 06 데이터**:
- post.md 표 4행 (1개월·3개월·6개월·12개월) — Cowork 측 데이터 보유
- meta.json `crawler_summary.sale_count` 만 (총 13건) — 정보 부족

**ASCII wireframe** (목표 형태):

```
[ Section 06 헤더 ]

┌──────────┬──────────┬──────────┬──────────┐
│ 1개월     │ 3개월     │ 6개월     │ 12개월    │
│ 4건       │ 12건      │ 26건      │ 53건      │
│ 매각가율   │ 매각가율   │ 매각가율   │ 매각가율   │
│ 68.21%   │ 80.94%   │ 83.23%   │ 83.97%   │ ← 큰 숫자 강조
│ 예상      │ 예상      │ 예상      │ 예상      │
│ 6억 2,617 │ 7억 4,303 │ 7억 6,405 │ 7억 7,084 │
└──────────┴──────────┴──────────┴──────────┘

[ 06 본문 결론 텍스트 (mdx 그대로) ]
```

**한계 — Cowork schema 확장 대기**: 본 단계 baseline 에서는 06 mdx 표 그대로 노출 (현 단계 3-1 + 표 정렬 보강 + tabular-nums). AuctionStatsGrid 컴포넌트는 **준비만 하고 활성화는 Cowork 측 meta.json 에 `sections.sale_history[]` 추가된 이후**.

**fallback**: 06 mdx 표 그대로 (현 baseline).

---

### 2-6. PhotoGalleryStrip (사진 dedicated 갤러리)

**입력**: `meta.photos.used[]` (9장) 또는 frontmatter.coverImage URL 패턴 fallback

**전제 — 결정 #8 vs 작업 금지 §3 충돌 해석**:

본 작업의 결정 #8 ("Hero thumbnail strip + 본문 9장 인라인 보존")과 작업 금지의 "mdx pipeline 변경 금지 (mdx Img 차단 보존)" 사이 충돌이 있습니다. 두 옵션을 명시하고 형준님 검토 단계에서 결정 받습니다.

**옵션 A — mdx Img 차단 보존 (권고)**

- 단계 3-1 G1 보강 확정사항 ("mdx Img → null") 보존
- 본문 mdx 인라인 사진 노출 0 (현재와 동일)
- **PhotoGalleryStrip 만 dedicated 추가** — 6~8장 작게 grid
- 위치: 본문 끝 RelatedCards 직전 또는 03/04 사이
- 장점: 단계 3-1 G1 시각 baseline 유지 + 갤러리 별도 추가 = 본문 산만함 0

**옵션 B — mdx Img 부활 (3-1 baseline 변경)**

- mdx Img → AnalysisMdxImage 부활
- 본문 흐름에 9장 인라인 표시 (post.md 의 ![] 위치 그대로)
- dedicated 갤러리 미추가
- 단점: 단계 3-1 G1 보강 ("본문 사진 흩뿌림 차단") 회귀

**Code 권고**: **옵션 A**. 단계 3-1 G1 보강 commit `d293617`/`2615e7d` 의 "본문 사진 0건" 게이트가 형준님 G1 시연에서 통과된 자산. 이를 회귀시키지 않고 dedicated 갤러리로 6~8장 표시.

**ASCII wireframe (옵션 A)**:

```
[ 본문 끝 — RelatedCards 직전 ]

┌──────────────────────────────────────────────────┐
│  현장 사진                          전체 9장      │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┐                     │
│  │  │  │  │  │  │  │  │  │  (8장 thumb grid)    │
│  └──┴──┴──┴──┴──┴──┴──┴──┘                     │
│  9번째 (필요 시 row 2)                            │
└──────────────────────────────────────────────────┘
   각 thumb ~120px sm:100px aspect-square rounded-md
```

**색 분기**: 0 (사실 그대로 표시).

**fallback**: meta.photos.used 없을 때 → frontmatter.coverImage URL 의 `/{idx}.webp` 패턴 도출 (현 HeroGallery 의 deriveThumbs 로직 재사용 또는 export).

---

### 2-7. ComplianceFooter (펼친 형태)

**현재 (단계 3-1 G1 보강)**: `<details>` 접이식 — 기본 1줄 chip · 클릭 시 4 항목 grid 펼침.

**G2 결정 #6**: "ComplianceFooter (4문단 압축): **펼친 형태 (접이식 X)**, 본문 끝 위치, 1~2문장 압축"

**ASCII wireframe (변경안)**:

```
[ 본문 끝 — ApplyCTA·RelatedCards 다음 ]

┌──────────────────────────────────────────────────┐
│ 고지사항                                          │
│  · 면책고지 — 본 콘텐츠는 참고 자료입니다.        │
│  · 업무범위 — 매수신청 대리 업무만 수행합니다.    │
│  · 시세정보 — 외부 데이터 참조, 실시간 차이 가능. │
│  · 전문가 권고 — 법무사·변호사 자문 권장.         │
└──────────────────────────────────────────────────┘
   bg-surface-muted · text-xs ink-500 · 4 항목 1줄씩 압축
```

**변경 사항**:
- `<details>` → `<section>` (펼친 형태 고정)
- 4 항목 본문 = 각 1~2문장 압축 (현재 CLAUDE.md `COMPLIANCE_ITEMS` 의 긴 문장 단축)
- 위치: 본문 끝 (ApplyCTA 다음 또는 RelatedCards 다음 — 형준님 검토)

**한계**: `COMPLIANCE_ITEMS` 의 단축 텍스트는 법적 의미 손실 0 가정. Build 단계 진입 시 텍스트 단축안 형준님 승인 필수.

**fallback**: 0 (정적 컴포넌트).

---

## §3. 디자인 토큰 변경 명세

### 신규 토큰 추가 — **0건**

본 단계 3-2 의 모든 시각 강화는 **단계 2 기존 토큰만 사용**:

| 용도 | 사용 토큰 |
|---|---|
| 시나리오 양 (positive) | `--color-success` / `--color-success-soft` |
| 시나리오 손실 (subtle warn) | `--color-warning` / `--color-warning-soft` |
| 시나리오 중립 | `--color-ink-500` / `--color-surface-muted` |
| Timeline 진행 마커 | `--color-brand-600` |
| Timeline 매각 마커 | `--color-success` |
| Timeline 미납 마커 | `--color-warning` |
| Timeline 유찰 마커 | `--color-ink-300` |
| 권리 callout 말소기준 | `--color-brand-600` border + `--color-brand-50` bg |
| 권리 callout 인수 | `--color-danger` border + `--color-danger-soft` bg |
| 시세 비교 강조 카드 | `--color-brand-50` bg + `--color-brand-700` text |

### typography scale 변경 — **0건**

시나리오 카드 헤더 = 기존 `text-base sm:text-lg font-black` (단계 3-1 ScenarioCard 동일). 위계 충분.

### spacing scale 변경 — **0건**

ComplianceFooter 압축은 새 spacing 토큰 없이 `p-4` `gap-2` 등 Tailwind 기본 스케일로 처리.

### CSS 추가 후보 — **0~1건**

- 단계 3-1 의 `.checkpoint-list` num-circle CSS 그대로 (변경 0)
- TimelineSection 의 vertical line 은 Tailwind `border-l-2` + `pl-N` 으로 처리 (CSS 추가 0)

### `@theme` 블록 — **변경 0건** (단계 2 동결 보존)

---

## §4. Cowork 영역 보존 체크리스트

본 단계 3-2 Build 단계 진입 시 **모두 OK 확인 필수**.

| # | 항목 | 보존 정책 |
|---|---|---|
| 1 | post.md body 텍스트 | 변경 0. mdx pipeline 그대로 (현 단계 3-1 + remark plugin) |
| 2 | post.md frontmatter 8필드+ | Code 가 새 필드 추가 0. 변환은 publish CLI 영역 |
| 3 | meta.json schema "auction-content/v1" | Code 가 새 키 추가 0. schema 확장은 Cowork 영역 |
| 4 | post.md 본문 ![] 9장 markdown | Code 가 markdown 텍스트 수정 0. 렌더 동작은 mdx Img null 보존 (옵션 A) |
| 5 | voice_guide 본문 (시나리오 한 줄 요약·면책 4문단) 콘텐츠 | Code 가 텍스트 변경 0. ComplianceFooter 의 단축안은 `lib/constants.COMPLIANCE_ITEMS` 영역 (Cowork 콘텐츠 0) |
| 6 | 시스템 어휘 차단 (tier·크롤러·스프레드·역마진) | Code 가 새 어휘 도입 0. UI 텍스트는 사실 어휘만 ("매각·유찰·미납·인수·소멸") |
| 7 | mdx pipeline 단계 3-1 G1 보강 확정 | mdx Img null / del·s passthrough / remark-gfm singleTilde:false / SectionHeader badge 폐기 / Hero h1 위계 / Sidebar 4 block — 모두 보존 |

---

## §5. Build 단계 진입 조건

본 Plan 형준님 승인 후 Build 단계 진입. Build 단계에서 처리할 항목:

1. **데이터 어댑터 결정** — `getAnalysisMeta` 가 `raw-content/{caseId}/meta.json` 직접 vs `content/analysis/{slug}.meta.json` 동행 — **형준님 결정 필요** (publish CLI 변경 영향)
2. **결정 #8 PhotoGalleryStrip 옵션 A vs B** — Code 권고 옵션 A (mdx Img 차단 보존). **형준님 결정 필요**
3. **frontmatter schema 정합성** — 567436 의 `saleDate / bidRound / minRate` vs `AnalysisFrontmatter` 의 `bidDate / round / percent` 차이는 publish CLI 변환 의존. **publish CLI 동작 검증 필요**
4. **ComplianceFooter 단축 텍스트안** — 4 항목 각 1~2문장 단축안 형준님 승인 필요
5. **AuctionStatsGrid Cowork schema 확장** — `sections.sale_history[]` 추가는 Cowork 영역. 본 단계는 **컴포넌트 준비만**, 활성화 보류
6. **컴포넌트 7건 구현 순서** — 권고 우선순위:
   1. PhotoGalleryStrip (모든 케이스 공통 적용)
   2. TimelineSection (567436·505827 데이터 동작)
   3. ScenarioCards 색 분기 (567436·507598 시뮬 데이터)
   4. RightsCallout (567436·505827 권리 데이터)
   5. MarketCompareCard (567436·507598 시세 데이터)
   6. ComplianceFooter 펼친 형태 (텍스트 단축안 승인 후)
   7. AuctionStatsGrid (Cowork schema 확장 대기)

### Build 단계 자가 검증 게이트 (예고)

- 베타 4건 (567436·505827·527667·507598) HTTP 200
- 컴포넌트 7건 모두 meta.json 누락 시 fallback 정상 (404 0건)
- 단계 3-1 G1 보강 항목 모두 보존 (mdx Img null·del 차단·sub-label chip 0·Hero h1 위계 등)
- voice_guide 어휘 검증 — UI 노출 텍스트 grep "추천·위험·매력·교훈·함정" 0건
- 시스템 어휘 grep "tier·크롤러·스프레드·역마진" UI 노출 0건

---

## 참고 — 본 Plan 의 한계

1. **데이터 어댑터 위치 결정 보류**: `raw-content/` 직접 vs `content/` 동행 — Build 단계 진입 시 결정. 본 Plan 은 권고만.
2. **frontmatter schema 차이**: 567436 와 기존 베타들의 키 이름 차이는 publish CLI 영역. 본 Plan 검증 0.
3. **AuctionStatsGrid 활성 시점 미정**: Cowork 측 schema 확장 의존.
4. **PhotoGalleryStrip 옵션 결정 보류**: 결정 #8 vs 작업 금지 충돌. 형준님 검토 필요.
5. **ComplianceFooter 단축 텍스트**: 법적 의미 검토 필수. Code 영역 외.
