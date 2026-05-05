# Phase 7 케이스 스터디 — 단일 케이스 2026타경500459 (단계 5-3 v3, Phase 2)

**작성**: 2026-04-27
**대상**: `/analysis/2026타경500459` 단일 케이스 9 영역 본질 시각화 설계의 input 자료
**작업 금지**: 자체 점수·등급·"PASS" 선언 0 / 표면적 인용 0 / 컬러 추가 0
**용도**: Phase 3 (`docs/phase-7-design-spec-500459.md`) 풀스펙 디자인의 base. 모든 design 은 본 case study 인용 의무.

---

## §0. 단일 케이스 선정 사유

### 왜 2026타경500459 인가

500459 는 9 영역 본질 시각화의 **모든 패턴**을 한 사건으로 검증할 수 있는 유일한 사건이다.

- **권리분석 03 영역**: HUG 말소동의 확약서 + 임차보증금 1.88억 인수 — 노드-link 다이어그램의 가장 복잡한 검증 케이스 (말소기준 → 인수/소멸 분기 + 외국인 임차인 변수)
- **시세 비교 04 영역**: market.sale_avg 1.61억 + sale_count 51건 — 충분한 데이터로 1D scatter 또는 분포 곡선 검증
- **Hero**: 감정가 1.78억 → 최저가 1.246억 (−30%) — DropRateBar 검증
- **시나리오 비교 05 영역**: 4 시나리오 (A 실거주 / B 1년 매도 / C-1 갭투자 / C-2 월세) — 박스·카드 비교 인터랙티브 본질
- **물건 종류**: 오피스텔 + 외국인 임차인 점유 — 실제 분쟁 가능성이 큰 케이스라 시각화 가치 큼

527667·540431·580569 는 archive 이동 (Phase 1 완료, commit `86e16b6`). 본 단계 본질 검증 후 4 사건 확장 결정.

---

## §1. 외부 사례 5단 분석 (4 사이트 본문 fetch + NN/g UX 표준 + scrollytelling 스킬 본문 + 단계 5-3 v2 누적 자료)

### 사례 1 — Apple AirPods Pro 3 (`https://www.apple.com/airpods-pro/`)

**(1) 섹션 위치**:
- 상단 Hero Zone — 메인 헤더 + 제품 이미지·영상
- 중상부 Feature Showcase — 6개 하이라이트 (공간음향·심박·음성·번역·청력·배터리)
- 중부 상세 정보 — "Take a closer look" 6 스펙 + "Intelligent noise control" 심화
- 하단 구매 유도 + 환경 가치

**(2) 스크롤 패턴**:
- **Fade & Reveal 기반** — 표준 선형 스크롤. sticky 요소 거의 없음
- 이미지 파일명 `startframe`/`endframe` → **scroll-triggered reveal 시퀀스**
- 모달/갤러리 시스템 — `highlights-gallery-item-1~6` 앵커 링크 탭
- **scroll-jacking 부재** — 사용자 스크롤 컨트롤 보존

**(3) 인터랙션**:
- 비디오 재생 (m3u8 스트리밍) — 짧은 영상 클립
- 탭 네비게이션 (6 하이라이트, 모프/페이드 효과 추정)
- AR 뷰어 (USDZ 3D 모델, WebAR)
- 다중 이미지 시퀀스 — 각 섹션 3장+ 이미지 (초기/진행/종료 프레임)
- 반복 CTA — "Buy" 5회+

**(4) 시각 구조**:
- **Split-Column 80% 비중** — 좌측 텍스트 / 우측 이미지·아이콘
- 단일 Column 20% — 헤더·배터리·환경 가치
- 환경 섹션 3×1 그리드 — 아이콘 + 제목 + 설명문 반복

**(5) 부동산 콘텐츠 차용 포인트**:
- **Split-Column 패턴** → 우리 권리분석 03 영역에 직접 적용 가능 (좌측 narrative 텍스트 + 우측 노드-link 다이어그램)
- **Parallax Reveal startframe-endframe** → 우리 02 입찰 경과 영역의 회차별 dot reveal 시퀀스
- **반복 CTA 5회+** → Hero / 시나리오 카드 / 03 권리분석 결론 / 04 시세 비교 결론 / 본문 끝 다크 CTA — 4~5 위치 전환 경로
- **모바일 Stack 전환** → Split-Column 이 모바일에서 단일 column 으로 자연 fallback (CSS grid → flex column)

### 사례 2 — Stripe Sessions 2024 (`https://stripe.com/sessions/2024`)

**(1) 섹션 위치**: 네비게이션 → Hero (Sessions 2026 등록 prompt) → 카테고리별 talk 카드 → 다중 열 footer

**(2) 스크롤 패턴**:
- **표준 vertical scroll** — sticky 요소 없음
- **필터 메커니즘** — Breakout talks 카테고리 필터 ("Payments"/"Platforms"/"Developers") 가 페이지 reload 없이 보이는 콘텐츠 변경
- parallax 없음 — 정적 배경

**(3) 인터랙션**:
- 카테고리 필터 버튼 토글
- "View talk" 링크 → 개별 세션 페이지
- 등록 CTA 반복 노출

**(4) 시각 구조**:
- **Column-based layout** — 단일 column 콘텐츠 흐름
- **카드 그리드 시스템** — talk 썸네일 stack 카드 (이미지 + 텍스트)

**(5) 부동산 차용 포인트**:
- **필터 가능 콘텐츠 섹션** → 우리 매각사례 06 영역에 카테고리 필터 (3개월 / 6개월 / 12개월 / 전체) 적용 가능
- **카드 기반 표시** → 시나리오 비교 05 영역의 4 카드 구조 (단계 5-2 무채색 + 번호 보존)
- **반복 CTA 전략적 배치** → Apple 사례와 동일 결론

### 사례 3 — Linear "Now" (`https://linear.app/now`)

**(1) 섹션 위치**: 네비 + 필터 탭 (All/Changelog/Community/News/Craft/AI/Practices/Press) → 아티클 카드 그리드 (3열) → Changelog/Press → Archive

**(2) 스크롤 패턴**:
- 점진적 콘텐츠 노출 — 최근순 우선 + "Load more" 단계 로딩
- 필터 선택 시 관련 콘텐츠 재배열
- **sticky 필터 탭** — 상단 고정

**(3) 인터랙션**:
- sticky 필터 탭 (상단 고정)
- 카드 hover 시 제목/저자 강조 (fade)
- count-up 없음 / morph 없음

**(4) 시각 구조**:
- 3열 카드 그리드 (Side-by-Side 변형)
- 카드 요소: 썸네일 (16:9) → 제목 → 설명 → 저자 + 날짜
- 타이포 — 제목 고대비 / 메타정보 약화

**(5) 부동산 차용 포인트**:
- **sticky 필터 탭** → 우리 메인 페이지 (`/analysis`) 에 사건 카테고리 필터 (지역/타입/금액 범위) 적용 가능. 본 단계 5-3 v3 영역 외 (Phase 8 영역)
- **카드 썸네일 16:9** → 시나리오 비교 05 영역 카드 비율 통일
- **단계 로딩** → 06 매각사례 histogram 카운트업 패턴

### 사례 4 — NN/g 스크롤 UX 표준 (`https://www.nngroup.com/articles/scrolling-and-scrollbars/`)

NN/g 의 스크롤 UX 표준 룰 — 안티패턴 회피 가이드.

**5 핵심 가이드라인**:
1. 항상 스크롤바 제공
2. 불필요할 때 숨김 (콘텐츠 부재 암시 회피)
3. 플랫폼 표준 (네이티브 OS) 따름
4. **수평 스크롤 제거** — "users hate horizontal scrolling and always comment negatively"
5. **fold 위 핵심 정보** — "users allocate only 20% of their attention below the fold"

**핵심 사용자 행동**:
- 사용자는 수평 스크롤 강하게 거부
- 2D 스크롤은 인지 부담 가중
- 단순 vertical 이 우선

**접근성 고려**:
- 모터 손상·저문해·노인 사용자에게 스크롤 부담
- 어린이는 스크롤 콘텐츠 거부, 즉시 가시 콘텐츠 선호

**부동산 차용 포인트**:
- **fold 위 dominant 정보** → Hero 영역 (DropRateBar + 핵심 결정 정보) 가 fold 안 위치 의무
- **수평 스크롤 절대 금지** → 모든 다이어그램은 vertical 스크롤 흐름 안에서 작동
- **모바일 단순 vertical** → Apple Split-Column 의 모바일 stack 전환 룰과 정합

### 사례 5 — scrollytelling 스킬 본문 (설치한 신규 스킬)

`doodledood/claude-code-plugins@scrollytelling` (111 installs) — 설치 후 SKILL.md 인용:

**정의**: "A storytelling format in which visual and textual elements appear or change as the reader scrolls through an online article. When readers scroll, something other than conventional document movement happens."

**원조**: NYT "Snow Fall: The Avalanche at Tunnel Creek" (2012, 2013 Pulitzer Prize Feature Writing).

**측정된 영향**:
- 400% 더 긴 time-on-page vs 정적 콘텐츠
- 67% 정보 회상 향상
- 5배 높은 social sharing 률
- 25-40% 전환 완료 향상

**5 핵심 원칙**:
1. **Story First, Technology Second** — 가장 큰 실수가 narrative 가 아닌 technology 로 시작. "Scrollytelling should enhance the story, not showcase effects."
2. **User Agency & Progressive Disclosure** — 사용자가 페이스 컨트롤. 정보가 점진 reveal 되어 호기심 유지.
3. **Sequential Structure** — hierarchical 콘텐츠와 달리 linear progression + 명확한 narrative beats.
4. **Meaningful Change** — 모든 scroll-triggered 효과가 narrative 에 봉사. 무의미한 애니메이션은 distraction.
5. **Restraint Over Spectacle** — "Not every section needs animation. Subtle transitions often work better than constant effects."

**5 Standard Techniques**:
| Technique | Description | Best For |
|---|---|---|
| **Graphic Sequence** | Discrete visuals that change completely at scroll thresholds | **데이터 시각화, step-by-step 설명** |
| **Animated Transition** | Smooth morphing between states | 상태 변화, 시간 흐름 |
| **Pan and Zoom** | Scroll controls which portion of a visual is visible | 지도, 큰 이미지, 공간 narrative |
| **Moviescroller** | Frame-by-frame progression creating video-like effects | 제품 showcase, 3D 객체 reveal |
| **Show-and-Play** | Interactive elements activate at scroll waypoints | 멀티미디어, 오디오/비디오 통합 |

**Layout Patterns — Pattern 1: Side-by-Side Sticky (Most Common)**:
```
┌─────────────────────────────────────┐
│  ┌──────────┐  ┌─────────────────┐  │
│  │  Text    │  │                 │  │
│  │  Step 1  │  │    STICKY       │  │
│  ├──────────┤  │    GRAPHIC      │  │
│  │  Text    │  │                 │  │
│  │  Step 2  │  │  (updates with  │  │
│  ├──────────┤  │   active step)  │  │
│  │  Text    │  │                 │  │
│  │  Step 3  │  │                 │  │
│  └──────────┘  └─────────────────┘  │
└─────────────────────────────────────┘
```

"When to use: 데이터 시각화 스토리, step-by-step 설명, 교육 콘텐츠 requiring persistent visual context"

**부동산 차용 포인트**:
- **Side-by-Side Sticky** — 권리분석 03 영역에 직접 적용 가능. 좌측 narrative ("말소기준등기는 ... 입니다 / 임차보증금 1.88억 인수 ... / HUG 말소동의 확약서 ...") + 우측 sticky 노드-link 다이어그램 (텍스트 step 별 노드 highlight 변경)
- **Graphic Sequence** — 02 입찰 경과 영역에 직접 적용. 1차 → 2차 → 3차 회차별 다른 다이어그램 frame
- **Animated Transition** — 시나리오 비교 05 영역 박스·카드 morph
- **Show-and-Play** — Hero DropRateBar 같은 인터랙티브 컨트롤 (사용자가 직접 슬라이더로 가격 조정 시 다이어그램 변화)

### 사례 6 — chart-visualization 스킬 본문 (설치한 신규 스킬)

`antvis/chart-visualization-skills@chart-visualization` (1.8K installs) — 차트 타입 선택 가이드.

**차트 타입 선택 룰**:
- 시간 시리즈 → `line` / `area` / `dual-axes`
- 비교 → `bar` / `column` / `histogram`
- 占比 → `pie` / `treemap`
- 관계·흐름 → `scatter` / `sankey` / `venn`
- 층급·트리 → `organization-chart` / `mind-map`
- 전용 — `radar` (다차원) / `funnel` (단계 전환) / `liquid` (비율) / `boxplot` / `network-graph` / `flow-diagram`

**부동산 차용 포인트**:
- **02 입찰 경과** → `line` 또는 `funnel` (회차별 가격 인하 흐름)
- **04 시세 비교** → `scatter` (1D scatter 점 3개)
- **06 매각사례** → `bar` 또는 `histogram` (4 기간 매각가율)
- **05 시나리오 비교** → `radar` 4 차원 (자기자본·수익·기간·리스크) + `bar` (자기자본 막대) 조합
- **03 권리분석** → `network-graph` 또는 `sankey` (말소기준 → 인수/소멸 분기 흐름)

### 단계 5-3 v2 누적 자료 활용 (이전 세션)

이전 단계 5-3 v2 보고서 작성 시 fetch 한 자료 — 본 case study 에 다시 인용:

- **Apple iPhone product page** — sticky scroll + count-up + line draw + neutral palette 다수 검증
- **Stripe homepage** — stat as focal point + progressive disclosure
- **Linear features** — sectional reveal + grayscale base + accent CTA reserved
- **Distill.pub momentum** — 본문 + 다이어그램 통합 + interactive sliders + 60/40 정적/동적 비율 + grayscale base
- **Our World in Data** — visualization-first + 출처 투명성 + chart 인터랙션
- **Vercel Geist Typography** — 4 카테고리 사이즈 시스템 (heading/button/label/copy)
- **Refactoring UI Color Palette** — 그레이 8-10 + Primary 5-10 + Accent 의미별 + 사전 고정 팔레트
- **Motion (Framer Motion) docs** — `useScroll` / `useTransform` / `whileInView` / ScrollTimeline native + IntersectionObserver pool

### 차단 사이트 정직 명시

다음 사이트는 fetch 차단 또는 404 — 본 case study 에 본문 인용 불가:
- Pudding (`/2017/04/birthdays/`, `/2024/05/missed-deportations/`) — 모두 404
- Distill.pub circuits article — content size 초과
- Vercel blog architecting-the-modern-web — 404
- Toss 시리즈 — 404
- (단계 5-3 v2 누적 차단) Compass / Redfin / NYT The Upshot / 호갱노노 / Apartment List / Airbnb / Bloomberg Graphics

**보강 전략**: scrollytelling 스킬 본문이 NYT Snow Fall 등 원조 사례를 직접 인용 + Layout Patterns + 5 standard techniques 명시 → 부동산 도메인 사례 부족분을 일반 패턴 룰 + Apple/Stripe/Linear 본문 + scrollytelling 스킬 본문으로 충당.

---

## §2. 9 영역 매핑 (case study → design 이정표)

각 영역 4단 매핑: (a) 어떤 사이트의 어떤 패턴 차용 / (b) 우리 어떻게 적용 / (c) 모노톤 어떻게 보장 / (d) 인터랙션 어떻게 작동.

### Hero — DropRateBar + 70% 진입선 + 호버 인터랙션

- **(a) 차용 패턴**: Apple iPhone "Stat-to-diagram flows" + scrollytelling 스킬 "Show-and-Play" + Distill.pub "본문 + 다이어그램 통합"
- **(b) 우리 적용**: DominantStat 영역 안에 (1) 큰 숫자 텍스트 (1.246억) + (2) 수평 막대 다이어그램 (감정가 100% base + 최저가 70% fill + 70% 진입선 vertical mark) + (3) hover 인터랙션 (사용자가 막대 위 임의 % 호버 시 그 가격 표시)
- **(c) 모노톤 보장**: brand-600 fill bg 유지 (단계 5-2 산출). 막대는 white/30 base + white fill. 호버 hint = white/15 칩. 신규 컬러 0
- **(d) 인터랙션**: scroll 진입 시 base 막대 fade-in + fill 막대 width animate. **사용자 호버 시 그 % 가 막대 위 vertical line 으로 표시 + 가격 tooltip ("X억 = 감정가의 Y%")**. mobile 에서는 horizontal drag 로 동일 동작

### 01 물건 개요 — 면적·층수·연식 시각 매핑 검토

- **(a) 차용 패턴**: scrollytelling 스킬 "Restraint Over Spectacle" — "Not every section needs animation. Subtle transitions often work better than constant effects." + Apple "단일 column" 20% 비중 영역
- **(b) 우리 적용**: 정적 dl grid 보존 (단계 5-2 PropertyOverviewCard) — 8 필드 카드 + 14 필드 모달. 다만 면적 (40.55㎡ = 12.27평) 을 시각적으로 비교 가능한 작은 다이어그램으로 보강 검토. 예: 평수를 가로 막대 (1평 = 1 unit, 12 unit 가로 표시)
- **(c) 모노톤 보장**: ink-50/100/300/500/700/900 만. brand-600 액센트 0
- **(d) 인터랙션**: 정적 + 모달 클릭. scroll 모션 0. **이 영역은 정적 적합 — 모션 추가 시 인지 부담**

### 02 입찰 경과 — Side-by-Side Sticky + Graphic Sequence

- **(a) 차용 패턴**: scrollytelling "Side-by-Side Sticky" + "Graphic Sequence" + Apple "startframe-endframe 시퀀스" + chart-visualization "line 또는 funnel"
- **(b) 우리 적용**: 좌측 narrative 텍스트 ("1차 매각: 2026-04-23 / 1.78억 / 유찰 / 응찰자 0명" → "2차 매각: 2026-05-29 / 1.246억 (−30%) / 진행 예정") + 우측 sticky 다이어그램 (vertical timeline + dot reveal + 회차별 가격 line graph)
  - 모바일: stack (text-only) + 작은 inline 다이어그램 fallback
- **(c) 모노톤 보장**: 매각 ink-900 / 진행 brand-600 / 미납 ink-700 outline / 유찰 ink-300. dot 크기 매각가율 매핑 (100→16px / 70→14px). line graph 도 ink-900 단색
- **(d) 인터랙션**: 좌측 텍스트 step scroll 시 우측 다이어그램 active dot highlight (Graphic Sequence). 호버 시 정확 수치 tooltip

### 03 권리분석 — Side-by-Side Sticky + node-link 다이어그램 (본 케이스 핵심)

- **(a) 차용 패턴**: scrollytelling "Side-by-Side Sticky" 가장 직접 적용 + Distill.pub "interactive 3D phase space diagram" + chart-visualization "network-graph 또는 sankey"
- **(b) 우리 적용**: 좌측 narrative 텍스트 (말소기준등기 식별 → 인수 등기 (HUG 임차보증금 1.88억) → 소멸 등기 (근저당 등) → HUG 말소동의 확약서 효과 → 외국인 임차인 변수) + 우측 sticky 노드-link 다이어그램
  - 노드: 말소기준 (중앙 큰 원) / 인수 노드 (위쪽 분기, 임차보증금 1.88억) / 소멸 노드 (아래쪽 분기) / HUG 말소동의 (인수 → 소멸 morph 화살표) / 외국인 임차인 (우측 callout)
  - 노드 크기 = 금액 log scale (1.88억 = 큰 원)
- **(c) 모노톤 보장**: 모든 노드 ink-50/100/700/900 + brand-600 단일 액센트 (말소기준만). 인수/소멸 분기 = fill 패턴 (solid / outline / diagonal stripe) — 색상 0
- **(d) 인터랙션**: 좌측 텍스트 step 별 우측 노드 highlight + line draw. HUG 말소동의 step 시 인수 → 소멸 morph 애니메이션 (Animated Transition). 노드 호버 시 등기 상세 tooltip. 클릭 시 inline expand

### 04 시세 비교 — 1D scatter + 분포 곡선

- **(a) 차용 패턴**: chart-visualization "scatter 또는 bar" + Distill.pub "60/40 정적/동적 비율" + Apple "Split-Column"
- **(b) 우리 적용**: 좌측 callout 텍스트 (시세 평균 대비 N% 수준 + 거래 51건 기준) + 우측 1D scatter (점 3개 = 감정가·시세평균·최저가) + sale_count 분포 표시 (점 위에 작은 vertical bar = 51건 평균)
- **(c) 모노톤 보장**: 점 = 감정가 ink-500 / 시세평균 ink-900 / 최저가 brand-600 outline. 축선 = ink-300. 차이 화살표 = ink-500
- **(d) 인터랙션**: scroll 진입 시 축선 line draw + 점 stagger fade-in + 차이 % count-up. 점 호버 시 정확 가격 tooltip. **사용자가 임의 가격 입력 시 그 점이 추가되어 비교 가능** (Show-and-Play 인터랙션)

### 05 시나리오 비교 — 박스·카드 비교 인터랙티브 (본질 핵심)

- **(a) 차용 패턴**: scrollytelling "Animated Transition" + chart-visualization "radar 또는 bar 조합" + 단계 5-2 무채색 + 번호 카드 보존
- **(b) 우리 적용**: 4 시나리오 (A 실거주 / B 1년 매도 / C-1 갭투자 / C-2 월세) 비교를 **단일 박스 안에서 인터랙티브 toggle** 로 표현
  - 박스 상단: tab nav (A·B·C-1·C-2 — 단계 5-2 의 무채색 + 번호 보존 + 액티브 tab brand-600 underline)
  - 박스 본체: 활성 탭의 시나리오 detail (자기자본·예상 수익·기간·리스크 4 차원)
  - 박스 하단: **mini comparison chart** — 4 시나리오 자기자본 막대 (가로) + 수익 점 (세로 위치). 활성 시나리오는 강조 (검정 fill)
  - 추가 기능: **사용자가 낙찰가 슬라이더 (1.246억 ~ 1.78억) 조정 시 4 시나리오 모두 재계산** (Show-and-Play 본질)
- **(c) 모노톤 보장**: 모든 시나리오 ink + brand-600 액센트만. 활성 / 비활성 차이는 fill (solid / outline) + opacity (1.0 / 0.5)
- **(d) 인터랙션**: tab click → fade transition 박스 안 detail / 낙찰가 슬라이더 drag → mini chart 실시간 업데이트 / 하단 chart hover 시 시나리오 tooltip

### 06 매각사례 — mini histogram + 인터랙티브 필터

- **(a) 차용 패턴**: chart-visualization "histogram + bar" + Stripe Sessions "필터 메커니즘" + Apple "count-up"
- **(b) 우리 적용**: 가로 축 (3개월·6개월·12개월·전체) + 세로축 매각가율 % + 4 막대. 필터 클릭 시 그 기간 강조 (다른 막대 ink-300 fade)
- **(c) 모노톤 보장**: 막대 ink-900 / 평균선 brand-600 dashed / 라벨 ink-500
- **(d) 인터랙션**: scroll 진입 시 막대 stagger grow + count-up. 필터 click 시 그 기간 막대만 ink-900 보존 / 나머지 ink-300 fade. 호버 시 표본 수 tooltip

### 07 종합 의견 — 정적 적합 (모션 0)

- **(a) 차용 패턴**: scrollytelling "Restraint Over Spectacle" — 결론 텍스트는 정적이 무게
- **(b) 우리 적용**: 단계 4-1 ConclusionCallout (border-l-4 brand-600 + bg-brand-50 + "결론" badge) + 체크포인트 ol num-circle 보존
- **(c) 모노톤 보장**: 기존 brand-600 액센트 보존. 신규 컬러 0
- **(d) 인터랙션**: 정적. 모션 0. **모션 추가 시 결론의 무게 약화 — Distill.pub 60/40 정적/동적 비율의 정적 영역**

### CTA + Trust — fade-in 한정

- **(a) 차용 패턴**: Apple "반복 CTA 5회+" + scrollytelling "Restraint" + 단계 4-1 다크 섹션 보존
- **(b) 우리 적용**: TrustBlock 4-grid + ApplyCTA 다크 섹션 보존. scroll 진입 시 stagger fade-in (50ms 간격)
- **(c) 모노톤 보장**: brand-600 / brand-950 액센트 보존 (단계 4-1 산출). 신규 컬러 0
- **(d) 인터랙션**: scroll fade-in 만 + 신청 버튼 click

---

## §3. case study 결론 — Phase 3 design spec 으로 인계할 핵심 설계 원칙

1. **Side-by-Side Sticky 패턴이 03 권리분석 + 02 입찰 경과의 본질** — scrollytelling 스킬의 Layout Pattern 1 (Most Common) 직접 적용
2. **단일 박스 인터랙티브 toggle 이 05 시나리오 비교의 본질** — tab + slider + mini chart 결합 (Show-and-Play 핵심)
3. **Hero DropRateBar 는 호버 인터랙션 추가** — 사용자가 임의 가격 호버 시 그 % 표시 (단계 5-4-1 의 단순 fade 와 차별화)
4. **04 1D scatter + 사용자 가격 입력** — Show-and-Play 인터랙션
5. **모든 영역 모노톤 강제** — ink 9단계 + brand-600 단일 액센트 + brand-50/700 callout 보존만 (단계 4-1·5-2 산출 보존, 신규 컬러 0)
6. **정적 영역 정직 명시** — 01 물건 개요 + 07 종합 의견은 모션 0 (Distill.pub 60/40 비율)
7. **scrollytelling 5 원칙 의무 준수**:
   - Story First, Technology Second
   - User Agency & Progressive Disclosure (사용자가 페이스 컨트롤)
   - Sequential Structure (linear progression)
   - Meaningful Change (모든 효과가 narrative 봉사)
   - Restraint Over Spectacle (모션 과다 회피)
8. **NN/g UX 표준 준수** — 수평 스크롤 0 / fold 위 dominant 정보 / 모바일 단순 vertical
9. **반복 CTA 4~5 위치 분산** (Apple 패턴) — Hero / 시나리오 결론 / 03 권리분석 결론 / 04 시세 결론 / 본문 끝
10. **chart-visualization 스킬 차트 타입 매핑** — 02 line/funnel / 03 network-graph / 04 scatter / 05 radar+bar / 06 histogram

Phase 3 (`docs/phase-7-design-spec-500459.md`) 풀스펙 디자인의 모든 design 은 본 case study 의 외부 사례 + 신규 스킬 인용 의무 (인용 = 적용 design + 사유 + 미적용 시 차이 비교 3단).

---

**케이스 스터디 끝.** Phase 3 풀스펙 디자인 진입.
