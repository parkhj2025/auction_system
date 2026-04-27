# Phase 7 풀스펙 디자인 — 단일 케이스 2026타경500459 (단계 5-3 v3, Phase 3)

**작성**: 2026-04-27
**대상**: `/analysis/2026타경500459` 단일 케이스 9 영역 본질 시각화 풀스펙
**input**: [`docs/phase-7-case-study-500459.md`](docs/phase-7-case-study-500459.md) — 매 design 마다 인용 의무
**작업 금지**: 컬러 추가 0 / 자체 점수 0 / "PASS" 선언 0 / 표면적 인용 0
**용도**: 단계 5-4-2 본질 patch 의 직접 input. Opus 가 본 design 을 그대로 patch 지시문으로 변환.

---

## §0. 풀스펙 design 의 4단 구조 + 인용 의무

각 영역 design 은 다음 4단 명시:

1. **시각 구조** — 정적 레이아웃 (DOM 구조 + CSS layout)
2. **스크롤 모션** — 진입 시 동작 (어떤 element 가 어떤 timing 으로 변화)
3. **인터랙션** — 사용자 능동 액션 (hover · click · drag · keyboard)
4. **데이터 매핑** — 어떤 frontmatter / meta.json 필드가 어떤 시각 요소가 되는지

각 design 마다 **case study 인용 의무** — "어떤 사이트의 어떤 패턴 → 우리 어떻게 적용" 명시.

### 모노톤 룰 재확인 (모든 design 에 적용)
- **허용 컬러**: `--color-ink-100/300/500/700/900` (5단계) + `--color-surface-muted` + `--color-surface` (white) + black + `--color-brand-600` (단일 액센트) + `--color-brand-50/700/950` (단계 4-1·5-2 산출 보존)
- **금지**: red·green·yellow·orange·purple·pink·cyan·blue 색명 0건. 신규 컬러 토큰 0
- **위계 표현 수단**: 굵기 (font-weight) · 간격 (spacing) · 테두리 (border) · shadow · indent · 크기 (font-size·dot-size·width) · 인터랙션 (hover state) · 모션 (scroll-triggered) · 레이아웃 (Side-by-Side Sticky 등) · 타이포 (uppercase·tracking·tabular-nums) — 색상 외 10 차원

---

## §1. Hero — DropRateBar + 호버 인터랙티브

### 시각 구조

```
┌─ DetailHero (bg-surface-muted) ────────────────────┐
│ Breadcrumb · 태그 칩 · h1 (text-4xl→6xl)            │
│ 메타라인 (court · case# · address)                   │
│ Lead summary (text-base lg:text-lg, line-clamp-3)   │
│                                                      │
│ ┌─ DominantStat (bg-brand-600 fill, white text) ─┐ │
│ │ 2차 최저가 (caption uppercase white/80)           │ │
│ │ 1억 2,460만원 (text-[2.25rem] sm:[3rem] black)   │ │
│ │ 감정가의 70% (text-sm white/85)                   │ │
│ │                                                    │ │
│ │ ┌─ HoverableDropRateBar ─────────────────────┐  │ │
│ │ │ 0% ─────── 70% ─────── 100% (vertical mark)│  │ │
│ │ │ ████████████ fill ████████ │              │  │ │
│ │ │            ▲ hover marker (drag-able)      │  │ │
│ │ │ 감정가 1.78억            ─30% chip          │  │ │
│ │ └────────────────────────────────────────────┘  │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ supporting 3-cell (감정가·보증금·기일, white bg)      │
└─────────────────────────────────────────────────────┘
```

### 스크롤 모션 (`useInView` threshold 0.4)

- **0~30% 진입**: base bar 좌→우 width animate (scaleX 0→1, origin-left, duration 600ms ease-out)
- **30~60%**: fill bar 좌→우 width animate (transform translateX 의 좌측에서 0% 너비 → 70% 너비)
- **60~100%**: −30% chip fade-in + count-up `0 → 30%` (duration 600ms, ease-out cubic, RAF tick)
- **70% 진입선 vertical mark**: fill bar 끝과 동시에 fade-in (white, dashed, 점선)

### 인터랙션 (Show-and-Play 본질 — case study 인용)

**사용자 hover 인터랙션 (desktop)**:
- 막대 위 hover 시 hover marker (vertical line + 가격 tooltip) 표시
- tooltip: "X억 = 감정가의 Y%" — 사용자가 임의 % 위치를 가리키면 그 가격 환산
- mouseleave 시 marker 사라짐

**사용자 drag 인터랙션 (모바일)**:
- 막대 위 touchmove 시 동일 marker 표시 — 손가락 위치를 가격으로 환산
- touch end 시 marker 보존 (사용자가 의도한 가격 표시 유지)

**키보드 인터랙션**:
- 막대 wrapper `tabIndex={0}` + `role="slider"` + `aria-valuenow / aria-valuemin / aria-valuemax`
- 좌·우 화살표 키 → marker 5% 단위 이동
- `aria-label`: "감정가 대비 가격 비교 슬라이더 — 좌우 키로 % 조정"

### 데이터 매핑

| frontmatter 필드 | 시각 요소 |
|---|---|
| `appraisal` (178000000) | base bar 100% width 의 환산 기준 + 좌측 라벨 "감정가 1.78억" |
| `minPrice` (124600000) | fill bar width = `(minPrice / appraisal) * 100` = 70% |
| `percent` (70) | "감정가의 70%" 텍스트 + 70% vertical mark 위치 |
| `appraisal - minPrice` (53400000) | −30% chip count-up target + 우측 nub 영역 width |
| 사용자 hover 위치 % | marker tooltip 가격 = `(percent / 100) * appraisal` |

### case study 인용 (4단)

- **차용 사이트 패턴**: Apple iPhone "Stat-to-diagram flows" + scrollytelling 스킬 "Show-and-Play" + Distill.pub "본문 + 다이어그램 통합"
- **우리 적용**: DominantStat 안에 DropRateBar 통합 (단계 5-4-1 부분 구현 + hover 인터랙션 추가)
- **모노톤 보장**: brand-600 fill bg + white·white/30·white/15 만. 신규 컬러 0
- **인터랙션 작동**: scroll 진입 시 막대 grow → 사용자 hover 또는 키보드로 임의 % 탐색 가능 — 단계 5-4-1 의 단순 1회 fade 와 차별화

---

## §2. 01 물건 개요 — 정적 + 면적 mini bar (Restraint)

### 시각 구조

```
┌─ Section H2 (## 01 물건 개요) ──────────────────────┐
│                                                      │
│ ┌─ PropertyOverviewCard (rounded-xl, p-6) ───────┐  │
│ │ dl grid 2-col (sm:grid-cols-2)                 │  │
│ │ ─ 사건번호 / 2026타경500459                       │  │
│ │ ─ 소재지 / 인천 중구 신흥동 17-15 하모니 1동 402호    │  │
│ │ ─ 물건종류 / 오피스텔                              │  │
│ │ ─ 감정가 / 1.78억                                 │  │
│ │ ─ 최저가 / 1.246억                                │  │
│ │ ─ 회차 / 2차                                      │  │
│ │ ─ 비율 / 70%                                      │  │
│ │ ─ 입찰일 / 2026-05-29 (목) 10:00                  │  │
│ │                                                  │  │
│ │ ┌─ AreaMiniBar (전용면적 시각 매핑) ─────────┐   │  │
│ │ │ "전용면적 40.55㎡ (12.27평)"               │   │  │
│ │ │ ┌─────────────────────────────┐           │   │  │
│ │ │ │ 1평 │ 2평 │ 3평 │ ... │ 12평 │           │   │  │
│ │ │ └─────────────────────────────┘ (12 칸)   │   │  │
│ │ └────────────────────────────────────────────┘   │  │
│ │                                                  │  │
│ │ [전체 정보 보기 →] (border-t, 우측정렬)            │  │
│ └─────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### 스크롤 모션

- **모션 0** (Restraint Over Spectacle — scrollytelling 스킬 5 원칙 #5)
- 정적 dl grid + 정적 mini bar
- **사유**: 8 필드 표가 즉시 비교 가능. 모션 추가 시 인지 부담 가중 — Distill.pub 60/40 정적/동적 비율의 정적 영역으로 분류

### 인터랙션

- "전체 정보 보기" 버튼 → Modal (단계 5-2 PropertyOverviewCard 보존, 14 필드 표 표시)
- AreaMiniBar 칸 hover (desktop): 칸 하나당 "1평" tooltip (참고용)
- 모바일: 비활성

### 데이터 매핑

| 필드 | 시각 요소 |
|---|---|
| `caseNumber·address·propertyType·appraisal·minPrice·round·percent·bidDate` | dl grid 8 필드 (텍스트) |
| `areaPyeong` (12.27) | AreaMiniBar 칸 수 = `Math.round(areaPyeong)` = 12 칸. 마지막 칸 0.27 만큼 fill (부분 채움) |
| `areaM2` (40.55) | 라벨에만 표기 |

### case study 인용

- **차용 패턴**: scrollytelling 스킬 "Restraint Over Spectacle" + Apple "단일 column 20% 비중" + Distill.pub "60% 정적 imagery"
- **우리 적용**: 단계 5-2 PropertyOverviewCard 보존 + AreaMiniBar 추가만 (정적). 모션 0
- **모노톤**: ink-100 (칸 빈 영역) + ink-900 (칸 fill) + ink-500 (라벨)
- **미적용 비교**: 만약 8 필드를 다이어그램화하면 → 인지 부담 폭발 (Apple 6 하이라이트 탭 패턴 참조 시 적합 안 함). 정적 보존이 정답

---

## §3. 02 입찰 경과 — Side-by-Side Sticky + Graphic Sequence

### 시각 구조

```
┌─ Section H2 (## 02 입찰 경과) ───────────────────────────┐
│                                                          │
│ ┌─ md+ Side-by-Side Sticky layout ────────────────────┐  │
│ │ ┌────────────────┐ ┌──────────────────────────────┐│  │
│ │ │ 좌측 narrative │ │  우측 sticky 다이어그램         ││  │
│ │ │ (40% width)    │ │  (60% width, sticky top-24)   ││  │
│ │ │                │ │                                ││  │
│ │ │ ▼ Step 1       │ │  Vertical timeline + line graph│  │
│ │ │  1차 매각      │ │                                ││  │
│ │ │  2026-04-23    │ │   1차 ●━━━━━━ 100% (1.78억) ││  │
│ │ │  1.78억 (100%) │ │       ║                       ││  │
│ │ │  → 유찰        │ │       ║ −30% line             ││  │
│ │ │                │ │       ║                       ││  │
│ │ │ ▼ Step 2       │ │   2차 ● 70% (1.246억) ◄ active│  │
│ │ │  2차 매각      │ │                                ││  │
│ │ │  2026-05-29    │ │   결과: 진행 예정              ││  │
│ │ │  1.246억 (70%) │ │                                ││  │
│ │ │  → 진행 예정   │ │                                ││  │
│ │ └────────────────┘ └──────────────────────────────┘│  │
│ └─────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌─ mobile (< md): stack ─────────────────────────────┐   │
│ │ 1차 ●━━ 100% / 2026-04-23 / 유찰                    │   │
│ │ 2차 ●━ 70% / 2026-05-29 / 진행 예정                 │   │
│ └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### 스크롤 모션 (Graphic Sequence 패턴)

좌측 narrative step 의 scroll position 에 따라 우측 다이어그램의 active dot 변화:

- **Step 1 가시 (좌측 narrative scroll 0~50%)**:
  - 우측 다이어그램: 1차 dot ink-900 fill + 1차 line draw 100% 위치
  - 2차 dot ink-300 outline (비활성)
- **Step 2 가시 (좌측 50~100%)**:
  - 우측 다이어그램: 1차 dot fade to ink-500 (이전) + 2차 dot brand-600 fill (active) + 2차 line graph reveal
  - 가격 인하 line (1차 → 2차) draw (scaleY 0→1, origin-top)
- **scroll 끝**: 다이어그램 unsticks (좌측 narrative 끝나면 sticky 해제, 자연 흐름 복귀)

### 인터랙션

- 좌측 narrative step click: 우측 다이어그램 즉시 그 step active (smooth scroll-snap)
- 우측 dot hover: tooltip 으로 회차·날짜·가격·결과 상세
- 키보드: Tab 으로 step 간 이동, Enter 시 highlight

### 데이터 매핑

| meta.json 필드 | 시각 요소 |
|---|---|
| `meta.bidding.history[i].round` (1, 2, ...) | dot vertical 위치 (좌상→우하 또는 시간 흐름) |
| `meta.bidding.history[i].minimum` | dot horizontal 위치 또는 line graph y축 (가격) |
| `meta.bidding.history[i].rate` (100, 70, 49) | dot 크기 매핑 (`size = rate * 0.08 + 8`) — 단계 5-4-1 동일 |
| `meta.bidding.history[i].result` (유찰/매각/진행) | dot fill 패턴 (solid / outline / dashed) — **무채색 정합** |
| `meta.bidding.history[i].date` | 좌측 narrative step text |

### case study 인용

- **차용 패턴**: scrollytelling 스킬 "Side-by-Side Sticky" Layout Pattern 1 (Most Common) + "Graphic Sequence" + chart-visualization "line 또는 funnel"
- **우리 적용**: 좌측 step 별 narrative + 우측 sticky timeline + line graph. 회차별 dot reveal 은 단계 5-4-1 단순 stagger 와 차별화 — Graphic Sequence (좌측 step 변화 시 우측 graphic 완전히 변경)
- **모노톤**: 매각 ink-900 / 진행 brand-600 / 미납 ink-700 outline / 유찰 ink-300 (단계 5-4-1 무채색 정합 보존)
- **미적용 비교**: 단계 5-4-1 의 "stagger fade-in li" 만으로는 단순 reveal — Graphic Sequence 의 좌측 step 연동 사용자 컨트롤 (User Agency) 부재. Side-by-Side Sticky 가 본질 추가

---

## §4. 03 권리분석 — Side-by-Side Sticky + node-link 다이어그램 (본 케이스 핵심 영역)

### 시각 구조

```
┌─ Section H2 (## 03 권리분석) ────────────────────────────┐
│                                                          │
│ ┌─ md+ Side-by-Side Sticky layout ────────────────────┐  │
│ │ ┌────────────────────┐ ┌────────────────────────┐  │  │
│ │ │ 좌측 narrative     │ │ 우측 sticky 노드-link    │  │  │
│ │ │ (45% width)        │ │ (55% width, sticky)    │  │  │
│ │ │                    │ │                        │  │  │
│ │ │ ▼ Step 1           │ │       (인수 분기)       │  │  │
│ │ │ 말소기준등기 식별   │ │                        │  │  │
│ │ │ 2017-03 근저당      │ │  ┌──────────────┐      │  │  │
│ │ │ 모든 후순위 등기    │ │  │ 임차보증금     │      │  │  │
│ │ │ 영향                │ │  │ 1.88억        │      │  │  │
│ │ │                    │ │  │ HUG 보증      │      │  │  │
│ │ │ ▼ Step 2           │ │  └──────────────┘      │  │  │
│ │ │ 인수 등기           │ │       │ HUG 말소동의   │  │  │
│ │ │ 임차보증금 1.88억   │ │       ▼               │  │  │
│ │ │ HUG 임차권 등기     │ │  ┌──────────────┐      │  │  │
│ │ │                    │ │  │ 말소기준      │ ◄  │  │  │
│ │ │ ▼ Step 3           │ │  │ 2017 근저당   │      │  │  │
│ │ │ HUG 말소동의 효과   │ │  └──────────────┘      │  │  │
│ │ │ 인수 → 소멸 morph   │ │       │               │  │  │
│ │ │                    │ │       ▼ (소멸 분기)    │  │  │
│ │ │ ▼ Step 4           │ │  ┌──────────────┐      │  │  │
│ │ │ 외국인 임차인 변수  │ │  │ 후순위 등기   │      │  │  │
│ │ │                    │ │  │ 압류·근저당   │      │  │  │
│ │ │                    │ │  └──────────────┘      │  │  │
│ │ │                    │ │                        │  │  │
│ │ │                    │ │       (외국인 임차인)   │  │  │
│ │ │                    │ │       ┌─────┐         │  │  │
│ │ │                    │ │       │ 점유 │         │  │  │
│ │ │                    │ │       └─────┘         │  │  │
│ │ └────────────────────┘ └────────────────────────┘  │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌─ mobile (< md): stack + 작은 inline 다이어그램 ────┐    │
│ │ 좌측 narrative 텍스트만 + 핵심 노드 작은 SVG (300x200)│    │
│ └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### 스크롤 모션 (Side-by-Side Sticky + Animated Transition)

좌측 narrative 4 step 별 우측 다이어그램 변화:

- **Step 1 (말소기준 식별)**: 우측 다이어그램에서 말소기준 노드만 highlighted (brand-600 fill, scale 1.1). 다른 노드 ink-300 outline (저강도)
- **Step 2 (인수 등기)**: 인수 분기 노드들 (위쪽) fade-in + line draw 말소기준→인수
- **Step 3 (HUG 말소동의)**: **Animated Transition 핵심** — 임차보증금 노드가 인수 분기에서 소멸 분기로 morph (translate 위→아래, fill solid → outline). HUG 말소동의 라벨 화살표 fade-in
- **Step 4 (외국인 임차인)**: 우측 callout 노드 fade-in + 점유 chip highlight

### 인터랙션

- 좌측 step click: 우측 다이어그램 그 state 로 즉시 transition
- 우측 노드 hover: tooltip 으로 등기 상세 (접수일·채권자·정확 금액·법적 의미)
- 우측 노드 click: inline expand drawer (모바일) 또는 modal (desktop, 상세 표 표시)
- 키보드: Tab 으로 노드 간 이동 + Enter 시 highlight + 상세 패널 열기

### 데이터 매핑

| meta.json 필드 | 시각 요소 |
|---|---|
| `meta.rights.tenants[i].deposit` (1.88억) | 임차보증금 노드 직경 = `Math.log10(deposit + 1) * scaleFactor` |
| `meta.rights.tenants[i].opposing_power` (boolean) | 인수/소멸 분기 위치 (대항력 있음 = 인수 위쪽 / 없음 = 소멸 아래쪽) |
| `meta.rights.basis_type` (말소기준) | 중앙 큰 노드 라벨 |
| `meta.rights.basis_date` (2017) | 노드 메타 |
| 본문 narrative (post.md → mdx) | 좌측 step 텍스트 (여러 단락) |

⚠️ **현재 500459 의 meta.json 에 rights 영역 부재** (단계 4-2-fix-3 publish 시점 — Cowork raw meta.json 의 sections.rights 가 v2.7.1 schema 에서 미발행 가능성). 단계 5-4-2 patch 진입 전 Cowork 측 데이터 보강 의무 (사용자 결정 #4: "500459 sections.bidding.history + market.sale_avg + sections.rights 보강 1 사건 한정").

### case study 인용

- **차용 패턴**: scrollytelling 스킬 "Side-by-Side Sticky" + "Animated Transition" (HUG 말소동의 morph) + Distill.pub "interactive 3D phase space" (drag-able weight) + chart-visualization "network-graph 또는 sankey"
- **우리 적용**: HUG 말소동의 효과를 텍스트로만 설명하던 단계 4-1 RightsCallout → 노드-link 다이어그램의 morph 애니메이션으로 시각화. 인수 → 소멸 변화가 narrative 와 동기 작동 (User Agency)
- **모노톤**: 모든 노드 ink-50/100/300/500/700/900 + 말소기준만 brand-600 액센트. 인수/소멸 = fill 패턴 (solid / outline / dashed) — 색상 0
- **미적용 비교**: 단계 4-1 RightsCallout (border-l-4 + bg-brand-50 + chip) 만으로는 인수/소멸 관계가 텍스트에 묻힘. node-link 다이어그램 + Animated Transition 이 본질 시각화

---

## §5. 04 시세 비교 — Side-by-Side + 1D scatter + 사용자 가격 입력

### 시각 구조

```
┌─ Section H2 (## 04 시세 비교) ─────────────────────────┐
│                                                        │
│ ┌─ md+ split layout (50/50) ───────────────────────┐   │
│ │ ┌──────────────────┐ ┌──────────────────────┐    │   │
│ │ │ 좌측 callout     │ │ 우측 1D scatter       │    │   │
│ │ │                  │ │                      │    │   │
│ │ │ "시세 평균 대비   │ │ ●─────●─────●        │    │   │
│ │ │ 2차 최저가는       │ │ 1.246억 1.61억 1.78억 │    │   │
│ │ │ 77% 수준"         │ │ (최저가)(시세)(감정가) │    │   │
│ │ │                  │ │                      │    │   │
│ │ │ "거래 51건 기준"  │ │ + 사용자 입력 점       │    │   │
│ │ │                  │ │  ▼                   │    │   │
│ │ │                  │ │ [사용자 가격 입력 →]   │    │   │
│ │ │                  │ │ ┌─────────────┐      │    │   │
│ │ │                  │ │ │ 1.5억 입력   │      │    │   │
│ │ │                  │ │ └─────────────┘      │    │   │
│ │ │                  │ │ → 시세 평균 대비 −7%  │    │   │
│ │ └──────────────────┘ └──────────────────────┘    │   │
│ └────────────────────────────────────────────────────┘   │
│                                                        │
│ ┌─ 3 카드 grid (sm:grid-cols-3) ──────────────────┐    │
│ │ 감정가 │ 시세 평균 (강조) │ 2차 최저가              │    │
│ └─────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────┘
```

### 스크롤 모션 (`useInView` threshold 0.4)

- **0~25%**: 축선 line draw 좌→우 (scaleX 0→1, origin-left)
- **25~50%**: 점 3개 stagger fade-in (감정가 → 시세평균 → 최저가, 100ms 간격)
- **50~75%**: 차이 화살표 line draw + count-up (감정가 vs 시세 % / 시세 vs 최저가 %)
- **75~100%**: 사용자 가격 입력 박스 fade-in (input field + 즉시 비교 결과)

### 인터랙션 (Show-and-Play 본질 — case study 인용)

- **사용자 가격 입력**: input field 에 임의 가격 입력 시 그 점이 scatter 에 추가 (4번째 점, brand-600 dashed outline)
- 즉시 계산: "시세 평균 대비 X% / 감정가 대비 Y%" 표시
- 점 hover: 정확 가격 tooltip
- 키보드: Tab → input → arrow 키로 ±100만원 단위 조정

### 데이터 매핑

| frontmatter / meta.json 필드 | 시각 요소 |
|---|---|
| `appraisal` | 감정가 점 위치 (1.78억) |
| `meta.market.sale_avg` (161000000) | 시세 평균 점 위치 (큰 dominant 점) |
| `minPrice` | 2차 최저가 점 (brand-600 outline 큰 원) |
| `meta.market.sale_count` (51) | callout "거래 N건 기준" + 점 위 작은 vertical bar (분포) |
| 사용자 입력 가격 | 4번째 점 (brand-600 dashed) + 차이 % 즉시 계산 |

### case study 인용

- **차용 패턴**: scrollytelling "Show-and-Play" (사용자 입력 → 즉시 시각 반응) + chart-visualization "scatter" + Distill.pub "Parameter sliders dynamically update convergence plots in real-time"
- **우리 적용**: 단계 5-4-1 의 정적 1D scatter + 사용자 가격 입력 인터랙션 추가
- **모노톤**: 감정가 ink-500 / 시세 평균 ink-900 / 최저가 brand-600 outline / 사용자 점 brand-600 dashed
- **미적용 비교**: 단계 5-4-1 1D scatter 는 정적 표시만. 사용자가 임의 가격 비교 못함. Show-and-Play 인터랙션 추가가 본질

---

## §6. 05 시나리오 비교 — 단일 박스 인터랙티브 toggle (본질 핵심 영역)

### 시각 구조

```
┌─ Section H2 (## 05 시나리오 비교) ──────────────────────┐
│                                                         │
│ ┌─ ScenarioComparisonBox (rounded-xl, p-6, shadow-card)│
│ │ ┌─ Tab nav (단계 5-2 무채색 + 번호 보존) ───────────┐│
│ │ │ [A 실거주] [B 1년매도] [C-1 갭투자] [C-2 월세]   ││
│ │ │  active   inactive    inactive    inactive     ││
│ │ │  brand-600 underline                            ││
│ │ └─────────────────────────────────────────────────┘│
│ │                                                    │
│ │ ┌─ Active Scenario Detail ────────────────────────┐│
│ │ │ 시나리오 A — 실거주 매입                          ││
│ │ │                                                 ││
│ │ │ 4 차원 stat:                                    ││
│ │ │ ─ 자기자본 / 1.246억                             ││
│ │ │ ─ 예상 수익 / +0 (실거주)                        ││
│ │ │ ─ 보유 기간 / 5년 이상                           ││
│ │ │ ─ 리스크 / 낮음                                  ││
│ │ │                                                 ││
│ │ │ 산문 설명: "낙찰가 1.246억 기준 ..."              ││
│ │ └─────────────────────────────────────────────────┘│
│ │                                                    │
│ │ ┌─ Bottom Mini Comparison Chart ──────────────────┐│
│ │ │ 4 시나리오 자기자본 막대 (가로) + 수익 점 (세로) ││
│ │ │                                                 ││
│ │ │ A ████████████████ active fill                  ││
│ │ │ B ██████ outline                                ││
│ │ │ C-1 ████████ outline                            ││
│ │ │ C-2 █████████████ outline                       ││
│ │ │                                                 ││
│ │ │ 수익 점:                                         ││
│ │ │ A ●  B ●  C-1 ●  C-2 ●  (위치 = 수익)            ││
│ │ └─────────────────────────────────────────────────┘│
│ │                                                    │
│ │ ┌─ 낙찰가 슬라이더 (Show-and-Play 핵심) ──────────┐│
│ │ │ 낙찰가: 1.246억 ─────[●]─────── 1.78억          ││
│ │ │             (1.246억 ~ 1.78억)                  ││
│ │ │ 슬라이더 drag 시 4 시나리오 모두 실시간 재계산    ││
│ │ └─────────────────────────────────────────────────┘│
│ └────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 스크롤 모션

- **0~25%**: tab nav fade-in
- **25~50%**: active scenario detail fade-in (default tab A)
- **50~75%**: mini comparison chart 막대 stagger grow + 수익 점 fade-in
- **75~100%**: 낙찰가 슬라이더 fade-in + hint label "슬라이더 drag 시 실시간 재계산"

### 인터랙션 (Animated Transition + Show-and-Play 본질 — case study 인용)

**Tab 전환** (Animated Transition):
- A → B 등 tab click 시 active scenario detail crossfade (duration 250ms)
- mini chart 의 active 막대 fill ↔ outline morph

**낙찰가 슬라이더** (Show-and-Play 핵심):
- 사용자가 슬라이더 drag 시 4 시나리오 모두 실시간 재계산
  - 자기자본 = 낙찰가 × N% (시나리오별)
  - 예상 수익 = 시세 평균 - 낙찰가 - 비용 (시나리오 A 실거주는 0)
  - 보유 기간·리스크 = 시나리오별 고정
- mini chart 막대 width animate (transform scaleX, duration 100ms 빠른 반응)
- 수익 점 위치 update

**키보드**:
- Tab nav 좌·우 arrow 키 이동
- 슬라이더 좌·우 arrow 키 이동 (1% 단위)
- `aria-valuenow / aria-valuemin / aria-valuemax`

### 데이터 매핑

| meta.json 필드 | 시각 요소 |
|---|---|
| `meta.investment.scenario_a.self_capital_with_loan` | A tab detail + mini chart 막대 길이 |
| `meta.investment.scenario_a.after_tax_profit` | A tab detail + mini chart 점 위치 |
| `meta.investment.scenario_b.*` | B tab |
| `meta.investment.scenario_c1.*` | C-1 tab |
| `meta.investment.scenario_c2.*` | C-2 tab |
| `minPrice` ~ `appraisal` | 슬라이더 min~max range |
| 사용자 슬라이더 값 | 4 시나리오 self_capital·after_tax_profit 재계산 input |

### case study 인용

- **차용 패턴**: scrollytelling "Animated Transition" (tab 전환 morph) + "Show-and-Play" (슬라이더 drag) + chart-visualization "radar 또는 bar 조합" + Distill.pub "Parameter sliders update plots in real-time"
- **우리 적용**: 단계 5-2 의 4 카드 grid (개별 클릭 → modal) → **단일 박스 안에서 tab + 슬라이더 + mini chart 조합 인터랙티브** 로 변환. 4 시나리오 비교가 한 화면에서 가능
- **모노톤**: 단계 5-2 무채색 + 번호 보존. active = brand-600 underline / fill solid / 비활성 = ink-300 outline. 신규 컬러 0
- **미적용 비교**: 단계 5-2 카드 4개는 클릭해도 modal 단일 시나리오 만 — 비교 본질 부재. 본 design 의 박스 안 tab + 슬라이더 + mini chart 가 "비교 인터랙티브" 본질 (form 내 단계 5-2 의 5점 → "와 이건 진짜 다르네" 도달 후보)

⚠️ **데이터 의존**: `meta.investment.scenario_a/b/c1/c2` 영역. 500459 의 현재 meta.json 에 investment 영역 부재 가능성. Cowork raw meta.json 보강 1 사건 한정 (사용자 결정 #4) — 단계 5-4-2 진입 시점 의무.

---

## §7. 06 매각사례 — 인터랙티브 필터 + mini histogram

### 시각 구조

```
┌─ Section H2 (## 06 매각사례) ─────────────────────────┐
│                                                       │
│ ┌─ Filter chips (Stripe 패턴 차용) ──────────────────┐│
│ │ [전체] [3개월] [6개월] [12개월]                      ││
│ │  active                                            ││
│ └────────────────────────────────────────────────────┘│
│                                                       │
│ ┌─ mini histogram (4 막대) ──────────────────────────┐│
│ │                                                    ││
│ │ 100% ┤                                             ││
│ │  90% ┤    ▆                                        ││
│ │  80% ┤    ▆                                        ││
│ │  70% ┤    ▆       ▆       ▆                       ││
│ │  60% ┤    ▆       ▆       ▆       ▆                ││
│ │  50% ┤    ▆       ▆       ▆       ▆                ││
│ │  40% ┤    ▆       ▆       ▆       ▆                ││
│ │   0% └─── 3M  ─── 6M  ─── 12M ─── 전체  ───        ││
│ │                                                    ││
│ │ 평균선 brand-600 dashed                            ││
│ └────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────┘
```

### 스크롤 모션

- **0~20%**: 가로축 + 세로축 line draw
- **20~40%**: 막대 1 (3M) grow (scaleY 0→1, origin-bottom)
- **40~60%**: 막대 2 (6M)
- **60~80%**: 막대 3 (12M)
- **80~100%**: 막대 4 (전체) + 평균선 horizontal draw + count-up % 라벨

### 인터랙션

- 필터 chip click: 그 기간 막대 highlighted (brand-600 fill) + 다른 막대 ink-300 fade
- 막대 hover: 표본 수 tooltip
- 키보드: Tab 으로 chip 이동 + arrow 키 + 막대 focus

### 데이터 매핑

| meta.json 필드 | 시각 요소 |
|---|---|
| `meta.market.sale_avg.byPeriod[3M].rate` | 막대 1 높이 |
| `meta.market.sale_avg.byPeriod[6M].rate` | 막대 2 |
| `meta.market.sale_avg.byPeriod[12M].rate` | 막대 3 |
| `meta.market.sale_avg.byPeriod[total].rate` | 막대 4 |
| `byPeriod.count` | 막대 width 또는 라벨 |
| 평균 매각가율 | horizontal 평균선 위치 |

⚠️ **데이터 의존**: `meta.market.byPeriod` 가 현재 schema 에 부재 (현재 sale_avg / sale_count 만). Cowork 측 schema 보강 필요 — 단계 5-4-2 진입 전 결정 사항. 또는 단순화: 전체 평균만 표시 (count-up).

### case study 인용

- **차용 패턴**: chart-visualization "histogram + bar" + Stripe Sessions "필터 메커니즘" + Apple "count-up"
- **우리 적용**: 단계 5-3 v2 보고서의 §3-7 mini histogram 그대로 + 필터 chip 추가
- **모노톤**: ink-900 (active 막대) / ink-300 (비활성) / brand-600 dashed (평균선)
- **미적용 비교**: 단계 5-2 의 4-cell grid 는 정적 표시. histogram + 필터 + count-up 이 인터랙티브 본질 추가

---

## §8. 07 종합 의견 — 정적 (Restraint, 모션 0)

### 시각 구조

```
┌─ Section H2 (## 07 종합 의견) ────────────────────────┐
│                                                       │
│ ┌─ ConclusionCallout (단계 4-1 보존) ───────────────┐ │
│ │ border-l-4 brand-600 + bg-brand-50               │ │
│ │ "결론" badge brand-600                             │ │
│ │                                                  │ │
│ │ 결론 텍스트 (mdx 본문)                              │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ ┌─ Checkpoint List (num-circle CSS) ───────────────┐ │
│ │ 1. 체크포인트 텍스트                                │ │
│ │ 2. 체크포인트 텍스트                                │ │
│ │ 3. 체크포인트 텍스트                                │ │
│ └──────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

### 스크롤 모션

- **모션 0** (Restraint Over Spectacle — scrollytelling 5 원칙 #5)
- **사유**: 결론은 정적이 무게. 모션 추가 시 의미 약화. Distill.pub 60/40 비율의 정적 영역

### 인터랙션
- 정적 텍스트 + num-circle. 모션·사용자 인터랙션 0

### 데이터 매핑
- mdx 본문 그대로 (단계 4-1 ConclusionCallout 보존)

### case study 인용
- **차용 패턴**: scrollytelling "Restraint Over Spectacle"
- **우리 적용**: 단계 4-1 ConclusionCallout + Checkpoint List 그대로 보존. 변경 0
- **모노톤**: 단계 4-1 brand-600 액센트 보존
- **미적용 비교**: 모션 추가하면 결론 무게 약화 — 불필요

---

## §9. CTA + Trust — fade-in 한정

### 시각 구조

```
┌─ TrustBlock (4-grid, surface-muted bg) ──────────────┐
│ [대법원] [공인중개사] [보증보험] [전자서명]              │
└─────────────────────────────────────────────────────┘

┌─ ApplyCTA (다크 섹션, brand-950 bg) ─────────────────┐
│ Next step / "분석은 끝났습니다. 법원은 저희가 갑니다."   │
│                                                      │
│ [입찰 대리 신청 →] [카카오톡 상담]                      │
│                                                      │
│ 3-column fee grid (수수료·성공보수·패찰)                │
└──────────────────────────────────────────────────────┘
```

### 스크롤 모션

- **TrustBlock**:
  - 0~50%: 4-grid stagger fade-in (50ms 간격)
- **ApplyCTA**:
  - 50~100%: 다크 섹션 fade-in + 미세 scale (0.97 → 1.0, duration 400ms)

### 인터랙션
- 신청 버튼 click: `/apply?case=2026타경500459`
- 카카오톡 click: kakaoChannelUrl
- 키보드: Tab → focus-visible (단계 5-2 토큰)

### 데이터 매핑
- frontmatter `caseNumber` → query param

### case study 인용
- **차용 패턴**: Apple "반복 CTA 5회+" + scrollytelling "Restraint" + 단계 4-1 다크 섹션 보존
- **우리 적용**: 단계 4-1 ApplyCTA + TrustBlock + DetailSidebar mini CTA (lg+) 보존. fade-in 만 추가
- **모노톤**: brand-600 / brand-950 액센트 보존 (단계 4-1 산출). 신규 컬러 0
- **미적용 비교**: 모션 과다 회피 — 결론·CTA 영역은 명료성 우선

---

## §10. design spec 결론 — 단계 5-4-2 patch 진입 의무

### Phase 3 산출물 요약 (9 영역 design)

| 영역 | 핵심 design | 우선순위 |
|---|---|---|
| Hero | DropRateBar + 호버 인터랙티브 (Show-and-Play) | P0 |
| 01 물건 개요 | 정적 + AreaMiniBar (Restraint) | P2 |
| 02 입찰 경과 | Side-by-Side Sticky + Graphic Sequence | P0 |
| 03 권리분석 | Side-by-Side Sticky + node-link + Animated Transition (HUG morph) | P0 |
| 04 시세 비교 | 1D scatter + 사용자 가격 입력 (Show-and-Play) | P0 |
| 05 시나리오 비교 | 단일 박스 tab + 슬라이더 + mini chart (Animated Transition + Show-and-Play, **본질 핵심**) | P0 |
| 06 매각사례 | mini histogram + 필터 chip | P1 |
| 07 종합 의견 | 정적 (Restraint, 모션 0) | P2 |
| CTA + Trust | fade-in 한정 | P2 |

### 단계 5-4-2 patch 진입 전제 조건

1. **Cowork 데이터 보강** (1 사건 한정, 사용자 결정 #4):
   - `meta.bidding.history` (1차/2차 회차별 정보)
   - `meta.market.sale_avg` 보강 + `byPeriod` 추가 (3M/6M/12M/전체)
   - `meta.rights.tenants` (HUG 임차보증금 1.88억 + 외국인 임차인)
   - `meta.investment.scenario_a/b/c1/c2` (4 시나리오 4 차원)
   - publish CLI 변경 0 (raw meta.json 만 보강)
2. **Motion 라이브러리 도입 결정** — 03 권리분석 node-link Animated Transition + 05 시나리오 슬라이더 = useScroll·useTransform·useSpring 활용 시 정교
   - CLAUDE.md "shadcn Dialog 외 신규 라이브러리 추가 금지" 룰 명시 변경 필요
   - Code 자율 권고: **5-4-2 단계 진입 시점에 도입** (네이티브 IntersectionObserver + RAF 만으로는 슬라이더 실시간 재계산·morph 어려움)

### 모노톤 grep 자가검증 (본 design spec 본문)

```
$ grep -E "(red|green|yellow|orange|purple|pink|cyan|blue|amber)-(50|100|500|600|700)" docs/phase-7-design-spec-500459.md
```
→ 0건 기대 (Phase 3 commit 시점 검증).

### Phase 4 (형준님 보고)

본 docs 2건 (`case-study-500459.md` + `design-spec-500459.md`) Phase 4 입력. 자체 점수·등급·"PASS" 선언 0.

형준님 검토 결과:
- PASS — Opus → 단계 5-4-2 본질 patch 지시문 (본 design spec 직접 구현 + Cowork 데이터 보강 + Motion 라이브러리 도입 결정)
- FAIL — 본질 미달 영역 식별 → 본 design spec 재작성

---

**design spec 끝.** Phase 4 (형준님 보고) 진입.
