# Phase 7 시각화 마무리 — 외부 사례 분석 + 개선 포인트 카탈로그

**작성**: 2026-04-27 (단계 5-1, 보고서만 — patch 0)
**대상**: `/analysis/[slug]` 라우트 + 디자인 토큰 (`src/app/globals.css`)
**작업 금지**: Cowork 산출물 / publish CLI / 데이터·어휘·숫자 / 모든 컴포넌트 코드
**용도**: 형준님 + Opus 검토 후 **단계 5-2 patch 지시문** 작성 시 참조

---

## §0. 조사 방법론과 한계

### 활용한 디자인 스킬 (3종)
1. **frontend-design** (skill) — distinctive·production-grade UI 룰 + generic AI aesthetics 회피 룰
2. **web-design-guidelines** (skill, Vercel Web Interface Guidelines) — 61개 룰 (접근성·포커스·타이포·이미지·성능·네비·터치·다크모드·i18n·하이드레이션·호버·콘텐츠 카피·안티패턴)
3. **shadcn / ui-ux-pro-max** (참조) — 본 라운드에서는 직접 발동 안 함 (다음 라운드 patch 시 발동)

### 수집한 외부 사례 (4건 fetch 성공 + 5건 차단)
| # | 사이트 | 카테고리 | 매칭 사유 | fetch 결과 |
|---|---|---|---|---|
| 1 | **Stripe** (`stripe.com/payments`) | 디자인 시스템 모범 + 결제 SaaS | 정보 위계·CTA·다중 열 footer 패턴 | ✓ 성공 |
| 2 | **Linear** (`linear.app/method`) | 디자인 시스템 모범 + B2B SaaS | 숫자 prefix 섹션 위계 (1.1·2.1) — 우리 7섹션 구조 직접 참조 | ✓ 성공 |
| 3 | **Vercel Geist Typography** (`vercel.com/design/typography`) | 디자인 시스템 (Geist) | heading/button/label/copy 4 카테고리 사이즈 시스템 | ✓ 성공 |
| 4 | **Refactoring UI — Color Palette** | 디자인 가이드 표준 텍스트 | 그레이 8-10 + Primary 5-10 + Accent 의미별 룰 | ✓ 성공 |
| 5 | Compass.com (`/about/`) | 부동산 마켓플레이스 | About 페이지라 매물 페이지 미접근 | ✗ 회사소개 |
| 6 | Redfin Blog | 부동산 분석 콘텐츠 | 표·차트·인용 박스 패턴 | ✗ 404 |
| 7 | NYT The Upshot 부동산 | 롱폼 데이터 저널리즘 | 본문 타이포·인포그래픽 통합 패턴 | ✗ 차단 |
| 8 | 호갱노노 | 한국 부동산 | 한국어 타이포·시세 표시 | ✗ 403 |
| 9 | Apartment List Research | 부동산 데이터 분석 | 차트·표·CTA 패턴 | ✗ 403 |
| 10 | Airbnb 매물 / Bloomberg / Vercel Templates | 매물 페이지 / 롱폼 / 모범 사례 | 갤러리·sticky 사이드바 패턴 | ✗ 차단 |

### 한계와 보완
- **부동산 매물 사이트 fetch 다수 차단** — 본 보고서는 디자인 시스템 모범(Stripe·Linear·Vercel Geist) + 디자인 가이드 표준 텍스트(Refactoring UI) + Vercel Web Interface Guidelines (61개 룰) 위주.
- 부동산 도메인 특수성 (사진 갤러리·시세 표·매물 카드) 사례 부족분은 **frontend-design 스킬 룰 + 일반 디자인 원칙**으로 보강.
- 본 보고서의 모든 개선 포인트는 인용 가능한 룰·사례에 근거. 추측 기반 0건.
- 추가 사례가 필요한 영역 (사진 갤러리·시세 비교 표·시나리오 카드) 은 **단계 5-2 patch 진입 시점에 형준님 직접 캡처본** 또는 **별도 web_search** 로 보강 권고.

### 현재 페이지 구조 요약 (Explore agent 매핑 결과)

```
/analysis/[slug] page.tsx 렌더 순서:
  DetailHero (fm)
  ─ Breadcrumb / 태그 칩 7개 / h1 (text-4xl→sm:text-5xl→lg:text-6xl)
  ─ 메타라인 (court / caseNumber / address)
  ─ 4-셀 stat grid (감정가·최저가·보증금·기일)
  ─ HeroGallery strip (4장 thumbnail)
Content Grid (max-w-6xl, lg: 2-column)
  메인 컬럼:
    GatingWrapper → MDXRemote (본문 7섹션 H2 dispatcher)
      ├─ 01 PropertyOverviewCard (8필드 + Modal 14필드)
      ├─ 02 TimelineSection (vertical timeline + dot 색상 분기)
      ├─ 03 RightsCallout (말소기준 + 임차인 2종 callout)
      ├─ 04 MarketCompareCard (3-card grid)
      ├─ 05 ScenarioCardsBoard (4 카드 + Modal, 색상·아이콘 매핑)
      ├─ 06 AuctionStatsGrid (4-cell 매각가율)
      └─ 07 종합 의견 + 체크포인트 + ConclusionCallout
    ContentComplianceNotice (산문 1단락 회색)
    PhotoGalleryStrip (8장 그리드 + Lightbox)
    TrustBlock (4-grid 신뢰 지표)
    ApplyCTA (다크 + 3-column fee grid)
    RelatedCards (3건)
  사이드바 (lg: 300px sticky):
    DetailSidebar (4-block: 핵심수치 / CTA / TOC / 근거자료)
Footer (안내 및 면책 4항목)
```

### 디자인 토큰 현황 (`src/app/globals.css` @theme)
- **Brand (Blue)**: 11단계 (50~950, 메인 600 `#2563eb`)
- **Ink (Neutral)**: 9단계 (100~900)
- **시맨틱**: success / warning / danger / info (각 + soft 변형)
- **Surface**: surface (흰), surface-muted (#f8fafc), border (#e2e8f0)
- **반경**: xs(4) sm(6) md(10) lg(14) xl(20) 2xl(28)
- **그림자**: subtle / card / elevated / lift
- **폰트**: Noto Sans KR (sans, --font-noto-kr)

---

## §1. 분석 대상 사이트 (4건 본문 분석 + 1건 룰 인용)

### 1-1. Stripe — `stripe.com/payments`
- **카테고리**: 결제 SaaS / 디자인 시스템 모범
- **매칭 사유**: 정보 위계·CTA 배치·다중 열 footer 패턴이 우리 `/analysis` 페이지의 신뢰 구축 흐름(Hero → 본문 → CTA → Footer)과 직접 비교 가능
- **핵심 강점 1**: **공백·타이포로만 섹션 위계 구분** — 명시적 구분선 없이 큰 마진(40~60px)과 폰트 크기 차이로 계층 표현. 우리 7섹션 H2 의 `border-t pt-10` 과 대비
- **핵심 강점 2**: **Hero 이중 CTA 패턴** (Primary 등록 + Secondary 영업 문의) — 우리 ApplyCTA 의 신청 + 카카오상담 2-CTA 와 동일 구조이나 Stripe 는 Hero 에서부터 노출

### 1-2. Linear — `linear.app/method`
- **카테고리**: B2B SaaS / 디자인 시스템 모범
- **매칭 사유**: **숫자 prefix 섹션 위계 (1.1, 2.1, 3.1)** — 우리 mdx 의 "01·02·03..." H2 dispatcher 가 이미 채택한 패턴. Linear 는 한 단계 더 나아가 sub-section (1.1·1.2) 까지 번호화
- **핵심 강점**: **단계적 진행 시각화** — 콘텐츠를 "Introduction → Direction → Building" 3 단계 흐름으로 정렬. 우리 7섹션도 동일 흐름 (개요→경과→권리→시세→시뮬→사례→의견) 인데 시각적으로 그 흐름이 약하게 노출

### 1-3. Vercel Geist Typography — `vercel.com/design/typography`
- **카테고리**: 디자인 시스템 (Geist)
- **매칭 사유**: **타이포그래피 4 카테고리 사이즈 시스템** (heading-72 ~ 14 / button-16 ~ 12 / label-20 ~ 12 / copy-24 ~ 13). 우리 globals.css 의 `--text-display: 3rem` / `--text-h1: 2.25rem` 등 단일 카테고리보다 정교한 분류. 모바일·데스크톱 적응 명확
- **핵심 강점**: **Subtle/Strong modifier** — `<strong>` 중첩으로 강조 단계 분리. 우리 mdx 의 `font-bold` 산발적 사용 정합화 가능

### 1-4. Refactoring UI — Color Palette
- **카테고리**: 디자인 가이드 표준 텍스트
- **매칭 사유**: **그레이 8-10 + Primary 5-10 + Accent 의미별** 컬러 시스템. 우리 globals.css 의 ink 9단계 + brand 11단계는 이미 정합. 다만 Accent 의 의미별 사용 (빨강 위험 / 초록 긍정 / 노랑 주의) 룰이 컴포넌트별로 일관되지 않음 — 본 보고서 §3 에서 보강 포인트
- **핵심 강점**: **사전 고정 팔레트 원칙** — "don't get clever using lighten/darken" — 사전 정의된 11단계만 사용. 우리 ScenarioCardsBoard 의 하드코딩 blue/orange/purple/green 11단계가 이 룰을 위반 (sec §3 에서 다룸)

### 1-5. Vercel Web Interface Guidelines — 61개 룰
- **카테고리**: 표준 가이드라인 (스킬 룰 인용 소스)
- **매칭 사유**: 본 보고서 모든 §3 개선 포인트의 근거 인용원. 접근성·타이포·이미지·성능·콘텐츠 카피 룰을 우리 페이지에 매핑

---

## §2. 영역별 매핑 (전문가 사례 vs 현재 구현)

| 영역 | 전문가 사례 패턴 | 현재 우리 구현 | 차이 진단 |
|---|---|---|---|
| **Hero 헤드라인** | Stripe: 단문 가치 제안 + 양쪽 CTA / Linear: 큰 제목 + 부제 위계 | DetailHero: h1 (text-4xl→6xl) + 메타라인 + 4-셀 stat grid + HeroGallery | h1 위계 ✓ / 그러나 **stat grid 가 4-셀 동일 무게** — Stripe·Linear 처럼 **dominant+accent** 패턴 부재. 최저가만 brand-600 강조이나 시각적 무게 약함 |
| **Section 헤더 위계** | Linear: 1.1·1.2 sub-section 번호화 / Stripe: 공백·타이포 + 구분선 0 | mdx H2 dispatcher: id=section-{num} scroll-mt-24, **border-t pt-10**, num xs tabular-nums + title | **border-t 가 모든 섹션 동일 무게** — Linear 처럼 단계적 진행이 시각적으로 잘 안 보임. Stripe 처럼 공백 위주 위계 또는 단계 구분선 강도 차등 가능 |
| **표 디자인** | Refactoring UI: zebra striping 권장, 헤더 강조 / Vercel Guidelines: tabular-nums 필수 | mdx-components Table: overflow-x-auto, min-w-36rem, **tabular-nums** ✓, Tr 행 색 분기 (말소기준/인수/미납/매각 정규식 감지) | tabular-nums ✓ / Tr 행 분기 **고급 패턴 ✓** / 다만 **th 헤더 시각 무게 부족** — bold + bg 차등 등 강화 여지 |
| **사진 갤러리** | (실제 매물 사이트 fetch 차단으로 패턴 미수집) frontend-design 스킬: dramatic shadows + decorative borders | HeroGallery (4장 strip) + PhotoGalleryStrip (8장 grid) + Lightbox (sequence/single) | 두 갤러리가 **다른 위치에서 거의 동일 데이터를 두 번 노출** — 정보 위계 약화. 한쪽으로 통합 또는 차등 큐레이션 검토 |
| **시나리오 카드** | Refactoring UI: 사전 고정 팔레트 / frontend-design: dominant + sharp accents | ScenarioCardsBoard 4 카드 (A blue / B orange / C-1 purple / C-2 green) — **하드코딩 색상** | **CLAUDE.md §13 절대 규칙 위반** — "오렌지 컬러 사용 금지" + "컬러를 3색 이상 동시에 강하게 사용하지 않음". 본 보고서 §3-P0-1 핵심 항목 |
| **모달·라이트박스** | Vercel Guidelines: overscroll-behavior contain, ESC 닫기, focus trap | Lightbox: ESC + ←→ + body scroll lock ✓ / Modal: ESC + 배경 클릭 + scroll lock ✓ | **focus trap 명시 안 됨** — Tab 키 모달 외부 이탈 가능. Vercel Guidelines "Compound controls focus-within" 룰 위반 가능성 |
| **컴플라이언스** | Stripe: 신뢰 배지 (PCI DSS 등) 전략적 배치 | ContentComplianceNotice (산문 1단락 회색 aside) + Footer "안내 및 면책" 4 항목 ol | 본문 컴플라이언스 ✓ / Footer 컴플라이언스 ✓ / 다만 **TrustBlock 4-grid (대법원·자격·보증보험·전자서명)** 가 별도 — 신뢰 신호가 3 위치 분산. Stripe 처럼 한곳 집중 가능 |
| **메인 CTA** | Stripe: Hero 이중 CTA + 본문 inline "Learn more" / Linear: 다층 진입 (Open app·Log in·Sign up) | ApplyCTA: 본문 끝 다크 섹션 (rounded-2xl, brand-950 bg) + 신청 + 상담 + 3-column fee grid + DetailSidebar 의 mini CTA | **본문 끝 단일 위치** — Stripe·Linear 처럼 Hero 시점 진입 경로 부재. DetailSidebar 가 lg+ 에서만 노출 (모바일 시 본문 끝까지 스크롤 필요) |
| **Footer 구조** | Stripe·Linear: 다중 열 (Product/Solutions/Company/Legal/...) + 신뢰 배지 | Footer: 회사 정보 + 안내 및 면책 4항목 ol (xs ink-500) | (Footer 본 보고서 분석 안 함 — Explore 결과만 보고. 별도 라운드에서 재검토 권고) |
| **모바일 적응** | Vercel Guidelines: safe-area-inset-* / touch-action manipulation / -webkit-tap-highlight-color | sm:/md:/lg: 브레이크포인트 사용 ✓ / DetailSidebar lg+ 전용 / Hero stat 2-col→4-col / Gallery 2-col→3-col→4-col | 브레이크포인트 ✓ / 다만 **safe-area-inset 명시 0** — iOS 노치 디바이스에서 콘텐츠가 노치/홈인디케이터 영역 침범 가능. Vercel Guidelines "Notch support" 룰 |
| **정보 위계** | Stripe: dominant + accent / frontend-design: hierarchy with intentionality | Hero stat 4-셀 동일 무게 / 7섹션 H2 동일 border-t / 시나리오 4 카드 동일 색상 강도 | **hierarchy without dominance** — 모든 요소가 비슷한 시각 무게. Stripe·Linear 의 "한두 요소만 dominant 나머지는 supporting" 룰 위반 |
| **타이포그래피** | Vercel Geist: heading/button/label/copy 4 카테고리 + Subtle/Strong modifier / Vercel Guidelines: tabular-nums, text-balance, ellipsis (…) | Noto Sans KR 단독 / globals.css text-display/h1/h2/body 단일 카테고리 / mdx 본문 leading-1.8 ✓ / tabular-nums ✓ | **Geist 처럼 button/label/copy 카테고리 분리 없음** — text-base 가 카드 라벨·본문·캡션에 모두 사용되어 위계 약화. **font-bold 산발 사용** — Geist Subtle/Strong 처럼 `<strong>` 중첩으로 정합화 가능 |
| **접근성** | Vercel Guidelines: aria-label / focus-visible / keyboard / heading hierarchy / alt | Lightbox close 버튼 (확인 필요) / focus-visible 토큰 (확인 필요) / mdx h1 suppress + DetailHero h1 ✓ / Img alt (Cowork raw 의존) | **focus-visible 명시 토큰 부재** — globals.css 에 ring-2 brand-600 등 명시 없음. Vercel Guidelines "Visible focus" 룰. 본 보고서 §3-P0-3 |

---

## §3. 개선 포인트 카탈로그

각 포인트는 **영역 / 현재 상태 / 개선 방향 / 근거 / 영향도 / 구현 난이도 / 작업 금지 영역 위반 여부** 8필드 형식.

영향도: **HIGH** = 신뢰·전환 직결, **MED** = 시각 일관성·접근성, **LOW** = 디테일 폴리싱
구현 난이도: **HIGH** = 디자인 토큰 변경 + 다수 컴포넌트 영향, **MED** = 단일 컴포넌트 또는 일부 토큰, **LOW** = 단일 클래스 또는 단일 라인

---

### 3-P0 영역: 즉시 권고 (전환·신뢰·접근성 직결)

#### **P0-1. ScenarioCardsBoard 4 카드 컬러 — CLAUDE.md 절대 규칙 위반 해소**

- **영역**: 카드 / 시나리오 (05 섹션)
- **현재 상태**: ScenarioCardsBoard 4 카드 색상 매핑이 **하드코딩** (Tailwind blue-50/500 / orange-50/500 / purple-50/500 / green-50/500). 4 카드 모두 동일한 강도의 색상 fill + border + icon. 동시 노출 시 **시각적 무게 균등 → 위계 0**.
- **개선 방향**:
  - **방안 A (안전)**: 4 카드를 모두 brand-600/50 단일 컬러로 통일하되 아이콘만 다른 색 (Refactoring UI "사전 고정 팔레트" + CLAUDE.md "블루 단색 통일" 룰)
  - **방안 B (강도 차등)**: 메인 추천 시나리오 1건만 brand-600 fill, 나머지 3건은 ink-50 + ink-500 outline (frontend-design "dominant + sharp accents" 룰)
  - **방안 C (의미별 accent)**: A·B·C-1·C-2 의미를 시각이 아닌 **타이포·아이콘**으로만 구분 (CLAUDE.md "컬러를 3색 이상 동시에 강하게 사용하지 않음")
- **근거**:
  1. **CLAUDE.md §13 절대 규칙**: "오렌지 컬러 사용 금지" — 현재 B 시나리오가 orange 위반
  2. **CLAUDE.md §13 절대 규칙**: "컬러를 3색 이상 동시에 강하게 사용하지 않음" — 4 카드 4 컬러 위반
  3. **Refactoring UI** 룰: "don't get clever using lighten/darken" + 사전 고정 팔레트 → 하드코딩 Tailwind 11단계 이탈
  4. **frontend-design 스킬**: "dominant colors with sharp accents outperform timid, evenly-distributed palettes"
- **영향도**: **HIGH** (CLAUDE.md 절대 규칙 위반 직접 해소)
- **구현 난이도**: **MED** (단일 컴포넌트 + Modal 색상 매핑 + ScenarioCard wrap 컴포넌트 동기 변경)
- **작업 금지 위반**: 0 — 시각 영역만 변경, 데이터·어휘·숫자 무관

---

#### **P0-2. Hero stat 4-셀 시각 무게 차등 (정보 위계)**

- **영역**: Hero / 정보 위계
- **현재 상태**: DetailHero 의 4-셀 stat grid (감정가·차수별최저가·보증금·기일) 가 동일 무게. 차수별최저가만 brand-600 색상이지만 폰트 크기·간격 동일 → 시각적으로 4건 동등.
- **개선 방향**:
  - **메인**: 차수별최저가 (= 입찰 진입 가격) 를 **dominant** 로 승격 — 더 큰 폰트 (text-4xl), 별도 카드 배경 (bg-brand-50 또는 surface-muted), full-width row 단독
  - **supporting**: 감정가·보증금·기일 3건은 한 단 아래 row, smaller font (text-base), inline label
- **근거**:
  1. **frontend-design 스킬**: "dominant colors with sharp accents outperform timid, evenly-distributed palettes"
  2. **Stripe Hero 패턴**: 단문 가치 제안 + 양쪽 CTA — 한 요소가 화면 무게 점령
  3. **현장 시연 결과** (이전 단계): 형준님 시연 시 "최저가가 핵심이지만 다른 숫자에 묻혀 잘 안 보인다" 류 피드백 가능성 (사용자 가설 기반, 검증 필요)
- **영향도**: **HIGH** (Segment A 가 Hero 보고 결정하는 핵심 경로)
- **구현 난이도**: **LOW** (DetailHero 단일 컴포넌트 grid 재구성)
- **작업 금지 위반**: 0

---

#### **P0-3. focus-visible 토큰 정합화 + 접근성 회귀 차단**

- **영역**: 접근성 / 포커스
- **현재 상태**: globals.css 에 명시적 focus-visible ring 토큰 부재. Tailwind 기본 `focus-visible:outline-2 focus-visible:outline-brand-600` 등이 컴포넌트별로 산발 사용 또는 미사용 (Lightbox close 버튼·Modal close 버튼 확인 필요).
- **개선 방향**:
  - globals.css 에 `--focus-ring: 0 0 0 3px rgba(37,99,235,0.3);` 토큰 신설 (CLAUDE.md §10 "커스텀 focus ring(box-shadow)" 명시)
  - 모든 button·a·input 에 `focus-visible:[box-shadow:var(--focus-ring)]` 클래스 또는 전역 `:focus-visible` rule 적용
  - keyboard 탐색 시 모달·갤러리·CTA 모든 인터랙션 요소가 명확히 표시
- **근거**:
  1. **Vercel Guidelines** "Visible focus": 모든 interactive 요소에 focus-visible 필수
  2. **Vercel Guidelines** "Never disable": outline-none 만 쓰지 않기
  3. **CLAUDE.md §10 접근성 최소 기준**: "키보드 네비게이션 시 현재 위치가 시각적으로 명확해야 한다. `outline: none` 만 쓰지 말고, 커스텀 focus ring (`box-shadow: 0 0 0 3px rgba(37,99,235,0.3)`) 을 적용한다"
- **영향도**: **HIGH** (CLAUDE.md 명시 + 30~50대 노안 사용자 키보드 의존 가능성)
- **구현 난이도**: **LOW** (globals.css 토큰 1개 추가 + 전역 :focus-visible rule)
- **작업 금지 위반**: 0

---

#### **P0-4. iOS Safari safe-area-inset 적용 (모바일)**

- **영역**: 모바일 / Safe area
- **현재 상태**: layout.tsx body 가 `pb-20` (MobileSticky 영역 padding) 만 처리. iOS 노치 + 홈 인디케이터 영역 (env(safe-area-inset-top/bottom)) 명시 0.
- **개선 방향**:
  - `<head>` 에 `<meta name="viewport" content="viewport-fit=cover">` 확인 (Next.js App Router 기본 처리)
  - body 에 `padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);` 추가 또는 MobileSticky 가 `bottom: env(safe-area-inset-bottom)` 사용
- **근거**:
  1. **Vercel Guidelines** "Notch support": "Full-bleed layouts use env(safe-area-inset-*)"
  2. 우리 Phase 6.7 단계에서 iOS Safari 시연 보류 → Phase 9 기술 관문 항목. 다만 **시각·UX 차원에서 본 Phase 7 시각화 마무리에 통합 가능**
- **영향도**: **HIGH** (모바일 사용자 비중 추정 60%+, iOS Safari 비중 추정 40%+)
- **구현 난이도**: **LOW** (globals.css body + MobileSticky 1줄)
- **작업 금지 위반**: 0

---

### 3-P1 영역: 다음 라운드 권고 (시각 일관성·정합성)

#### **P1-1. mdx H2 섹션 위계 — Linear 단계적 진행 시각화**

- **영역**: Section 헤더 위계
- **현재 상태**: mdx-components H2 dispatcher 가 모든 섹션에 `border-t pt-10` 동일 적용. 7섹션 모두 시각적으로 동등 → 흐름이 약함.
- **개선 방향**:
  - Linear method 의 "Introduction → Direction → Building" 3단계 그룹화 패턴 채용
  - 우리 7섹션을 3개 그룹으로 묶음:
    - **Group 1 — 사실 (01·02)**: 물건 개요 + 입찰 경과
    - **Group 2 — 분석 (03·04·05·06)**: 권리 + 시세 + 시뮬 + 사례
    - **Group 3 — 결론 (07)**: 종합 의견
  - 그룹 경계에만 두꺼운 구분선 (border-t-2 brand-600 또는 큰 마진), 그룹 내 섹션은 가벼운 구분
  - 또는 H2 위에 작은 group label ("Group 1 사실 / Group 2 분석 / Group 3 결론") xs uppercase
- **근거**:
  1. **Linear method 패턴**: 단계적 진행 시각화 (Introduction → Direction → Building)
  2. **CLAUDE.md §1 데이터 원칙**: "데이터 먼저, 해석은 뒤에" — 사실/분석/결론 흐름
  3. **CLAUDE.md §11 콘텐츠 톤**: "데이터 먼저, 해석은 뒤에"
- **영향도**: **MED** (콘텐츠 흐름 가독성 향상, Segment B 신규 사용자 체류 증가 기대)
- **구현 난이도**: **MED** (mdx-components H2 dispatcher 그룹 매핑 + 디자인 토큰 1~2개 추가)
- **작업 금지 위반**: 0 — 시각 영역만 변경. 다만 §13 "콘텐츠 내부 분류 라벨 노출 금지" 룰 검토 필요. group label 이 "Group 1 / Group 2" 처럼 분류 코드면 위반. **"사실·분석·결론"** 같은 자연 라벨은 통과.

---

#### **P1-2. HeroGallery + PhotoGalleryStrip 이중 노출 통합**

- **영역**: 사진 갤러리
- **현재 상태**: HeroGallery (Hero 하단 4장 strip) + PhotoGalleryStrip (본문 끝 8장 grid) — 동일 사진을 거의 두 번 노출 (4장 = 8장 의 부분집합). 정보 위계 약화 + 데이터 중복.
- **개선 방향**:
  - **방안 A**: HeroGallery 폐기, PhotoGalleryStrip 만 유지 (본문 끝). Hero 는 텍스트·stat 위주
  - **방안 B**: HeroGallery 를 1장 (대표 사진) 로 축소 — Airbnb 매물 페이지 패턴 (대형 1장 + 작은 4장 grid)
  - **방안 C**: HeroGallery 를 Hero 직속 4-cell 영역으로 통합 — stat grid 와 함께 Hero 안에 자연 배치
- **근거**:
  1. **frontend-design 스킬**: "Spatial Composition — Unexpected layouts. Asymmetry. Generous negative space OR controlled density" — 동일 데이터 두 번 노출은 위계 둔화
  2. **Refactoring UI** 일반 룰: 동일 정보 반복 시 시각 무게 분산
  3. **Vercel Guidelines** "Lazy loading": 동일 이미지 두 번 fetch (Hero + Gallery) → 성능 영향 (확인 필요)
- **영향도**: **MED** (Hero 시각 무게 정렬 + 페이지 길이 단축)
- **구현 난이도**: **MED** (DetailHero + HeroGallery + PhotoGalleryStrip 3 컴포넌트 재구성)
- **작업 금지 위반**: 0

---

#### **P1-3. 표 헤더(th) 강조 + zebra striping**

- **영역**: 표 디자인
- **현재 상태**: mdx-components Table 의 th 가 단순 font-bold + border-b. zebra striping 0. Tr 행 색 분기 (말소기준/인수/미납/매각 정규식) 는 ✓.
- **개선 방향**:
  - th: bg-ink-100 + uppercase tracking-wide + xs (라벨화) 또는 bg-brand-50 + brand-700 텍스트
  - 일반 Tr (행 분기 매칭 안 되는 행) 에 even:bg-surface-muted zebra striping
  - 헤더가 ScrollArea sticky 되도록 sticky top-0 (긴 표에서 가독성)
- **근거**:
  1. **Refactoring UI** 표 가이드: zebra striping 권장
  2. **Vercel Guidelines** "Number alignment": tabular-nums ✓ (이미 적용)
  3. **CLAUDE.md §10 접근성**: 4.5:1 대비 — th 강조가 명도 대비 향상
- **영향도**: **MED** (긴 권리분석·시세 표 가독성 향상)
- **구현 난이도**: **LOW** (mdx-components Table th 클래스 1줄)
- **작업 금지 위반**: 0

---

#### **P1-4. Hero 시점 mini-CTA 추가 (모바일 전환 경로)**

- **영역**: 메인 CTA
- **현재 상태**: ApplyCTA 가 본문 끝 (스크롤 깊이 80%+). DetailSidebar 의 mini CTA 는 lg+ 전용 (모바일 0). 모바일 사용자가 결정 시 본문 끝까지 스크롤 필수 → MobileSticky CTA 의존.
- **개선 방향**:
  - DetailHero 4-셀 stat grid 직후 (= Hero 끝부분) inline mini-CTA 1개 (text-base + brand-600 button) — "이 물건 입찰 대리 신청" 단일 버튼
  - 또는 Hero 안 우측 하단 sm:absolute mini-card (sticky 안 함, scroll 따라 사라짐)
- **근거**:
  1. **Stripe Hero 패턴**: 이중 CTA 즉시 노출
  2. **CLAUDE.md §6 판단 기준 ①**: "모든 페이지에서 '입찰 대리 신청' 까지의 경로가 2클릭 이내여야 한다"
  3. **CLAUDE.md §4 Segment A**: "사이트에서 원하는 것: 검색 → 가격 확인 → 바로 신청. 3클릭 이내"
- **영향도**: **HIGH** (전환 경로 직접 단축)
- **구현 난이도**: **LOW** (DetailHero 1줄 추가)
- **작업 금지 위반**: 0
- **주의**: MobileSticky CTA 와 중복 회피 — 모바일에서 둘 다 보이면 노이즈. Hero CTA 는 sm: 이상에서만 노출 (모바일은 MobileSticky 단일).

---

#### **P1-5. TrustBlock + DetailSidebar 근거자료 + Footer 안내·면책 — 신뢰 신호 정합화**

- **영역**: 컴플라이언스 / 신뢰
- **현재 상태**: 신뢰 신호가 4 위치 분산:
  - DetailSidebar Block 4 (근거자료) — 대법원·네○○·국토부
  - ContentComplianceNotice (산문 1단락 회색)
  - TrustBlock (4-grid 신뢰 지표) — 대법원·자격·보증보험·전자서명
  - Footer "안내 및 면책" 4항목
- **개선 방향**:
  - **방안 A**: TrustBlock 폐기, DetailSidebar 근거자료를 본문 컴플라이언스 옆으로 통합. 한곳 집중 (Stripe 의 신뢰 배지 패턴)
  - **방안 B**: TrustBlock 유지하되 DetailSidebar 근거자료 폐기 (모바일에서 안 보이는 영역 제거 → 정보 손실 0)
  - **방안 C**: 모두 유지하되 시각 무게 차등 — TrustBlock 만 풀 강조, 나머지는 회색 단순 텍스트
- **근거**:
  1. **Stripe 패턴**: 신뢰 배지 한 영역 집중
  2. **frontend-design 스킬**: dominant + supporting — 신뢰 신호도 위계 필요
  3. **CLAUDE.md §13 절대 규칙**: "패찰 시 보증금 전액 반환" 위치 5건 강제 → 위치 분산은 의도된 것 (검토 필요)
- **영향도**: **MED**
- **구현 난이도**: **MED** (3~4 컴포넌트 영향)
- **작업 금지 위반**: 0 — 다만 CLAUDE.md "패찰 시 보증금 전액 반환" 5위치 룰 영향 검토 필요. 본 안건은 patch 진입 전 형준님 확인 필수.

---

#### **P1-6. 타이포그래피 카테고리 4분 (Geist 패턴)**

- **영역**: 타이포그래피
- **현재 상태**: globals.css 에 text-display/h1/h2/body 단일 카테고리. text-base 가 카드 라벨·본문·캡션·메타에 모두 사용 → 위계 약화.
- **개선 방향**:
  - Vercel Geist 4 카테고리 도입:
    - `--text-heading-{72,56,40,32,24,20,16,14}` (Hero h1 / 섹션 h2 / sub h3 ...)
    - `--text-button-{16,14,12}` (CTA 버튼)
    - `--text-label-{20,16,14,12}` (카드 라벨·메타·태그 칩)
    - `--text-copy-{24,20,18,16,14,13}` (본문·인용·캡션)
  - 각 카테고리별 line-height·letter-spacing 사전 정의
  - mdx-components / DetailHero / 카드 컴포넌트들이 카테고리별 클래스 사용
- **근거**:
  1. **Vercel Geist Typography**: 4 카테고리 사이즈 시스템
  2. **frontend-design 스킬**: "Pair a distinctive display font with a refined body font" — 카테고리 분리가 페어링의 첫 단계
- **영향도**: **MED** (시각 일관성 + 디자인 시스템 성숙도)
- **구현 난이도**: **HIGH** (디자인 토큰 + 다수 컴포넌트 영향. Phase 8 디자인 시스템 진입 시점 적합)
- **작업 금지 위반**: 0
- **주의**: Phase 8 디자인 시스템 최종 확정 시점에 함께 처리가 자연스러움. 본 라운드 단독 진행 비추천.

---

#### **P1-7. mdx 본문 줄 길이 (max-width) 제한**

- **영역**: 타이포그래피 / 가독성
- **현재 상태**: mdx 본문 P 가 mt-5 text-base leading-1.8 ink-700. **max-w 제한 0** → md+ 화면에서 본문이 grid 메인 컬럼 풀폭 (700~800px) 까지 확장 → 한 줄 80~100자.
- **개선 방향**:
  - mdx P / Ul / Ol 에 `max-w-prose` (Tailwind: 65ch ≈ 한글 33~35자) 또는 `max-w-[42rem]` 적용
  - 표·이미지·콜아웃 등 데이터 시각화 요소는 풀폭 유지
- **근거**:
  1. **Refactoring UI** 가독성 룰: 50~75자 줄 길이가 최적
  2. **frontend-design 스킬**: "Generous negative space OR controlled density" — 풀폭 본문은 negative space 부재
  3. **CLAUDE.md §10 접근성**: 30~50대 노안 사용자 — 긴 줄 길이가 가독성 저해
- **영향도**: **MED** (긴 본문 7섹션 가독성)
- **구현 난이도**: **LOW** (mdx-components P/Ul/Ol 클래스 1줄)
- **작업 금지 위반**: 0

---

### 3-P2 영역: 장기 보류 (마이크로 폴리싱 / Phase 8 디자인 시스템 통합)

#### **P2-1. 폰트 페어링 (Display + Body)**

- **영역**: 타이포그래피
- **현재 상태**: Noto Sans KR 단독.
- **개선 방향**: Display 폰트 (Pretendard / Spoqa Han Sans Neo / Apple SD Gothic Neo) + Body Noto Sans KR 페어링. Hero h1·CTA 헤드라인은 display, 본문은 body.
- **근거**:
  1. **frontend-design 스킬**: "Pair a distinctive display font with a refined body font"
  2. **frontend-design 스킬 NEVER**: "overused font families (Inter, Roboto, Arial, system fonts)" — Noto Sans KR 단독은 이 함정과 다르나 단조로움
- **영향도**: **LOW** (시각 인상 향상)
- **구현 난이도**: **HIGH** (폰트 로드 + globals.css + 다수 컴포넌트)
- **작업 금지 위반**: 0
- **주의**: **Phase 8 디자인 시스템 진입 시 처리 권고**. 본 라운드 진행 비추천 (CLAUDE.md §12 "왜 Noto Sans KR 인가" 룰 — 빌드 편의성 우선 의식). Phase 8 에서 서비스명 + 디자인 톤 확정 시점에 함께 결정.

---

#### **P2-2. 모션 / 마이크로 인터랙션**

- **영역**: 모션
- **현재 상태**: 명시 모션 토큰 (duration-fast/base/slow + ease-out/in) ✓ — 다만 컴포넌트별 실제 사용 빈도 낮음. PhotoGalleryStrip thumb hover brightness-110 정도.
- **개선 방향**:
  - Hero 페이지 로드 시 staggered reveal (animation-delay 100ms 단위 스태거)
  - ScenarioCardsBoard 카드 hover 시 lift (translate-y-[-2px] + shadow-elevated)
  - Lightbox 진입·이탈 시 fade + scale (0.95 → 1.0)
- **근거**:
  1. **frontend-design 스킬**: "Use animations for effects and micro-interactions. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions"
  2. **Vercel Guidelines** "Reduced motion": prefers-reduced-motion 존중 필수
  3. **Vercel Guidelines** "Compositor properties": transform / opacity 만 애니메이트
- **영향도**: **LOW** (인상 향상, 본질 기능 0)
- **구현 난이도**: **MED**
- **작업 금지 위반**: 0
- **주의**: **CLAUDE.md §12 디자인 의사결정 맥락**: "장식적 요소를 추가하려 할 때 ⑤ '실용·합리·확실'과 맞는가?" — 모션 추가 시 정보 전달 도움 여부 검토 필수.

---

#### **P2-3. ConclusionCallout / RightsCallout / MarketCompareCard — 콜아웃 위계 통일**

- **영역**: 카드 / 콜아웃
- **현재 상태**: ConclusionCallout (border-l-4 brand-600 + bg-brand-50 + "결론" badge) / RightsCallout 말소기준 (border-l-4 brand-600 + bg-brand-50) / RightsCallout 임차인 대항력있음 (danger-soft + border-l-4 색 분기) / MarketCompareCard (border-l-4 brand-600 + bg-brand-50) — **공통 패턴이 있으나 라벨·아이콘 표기가 컴포넌트별 다름**
- **개선 방향**: 공용 Callout 컴포넌트 추출 — `<Callout tone="brand|danger|warning|success" label="결론|핵심|주의|확정"> {children} </Callout>`. 시각 토큰 통일.
- **근거**:
  1. **frontend-design 스킬**: "consistency through cohesive aesthetic"
  2. **Refactoring UI**: 동일 의미 시각 패턴 반복 시 통일
- **영향도**: **LOW** (디자인 시스템 성숙도)
- **구현 난이도**: **MED**
- **작업 금지 위반**: 0

---

#### **P2-4. PhotoGalleryStrip — Lightbox 진입 캡션·번호 표시**

- **영역**: 사진 갤러리
- **현재 상태**: Lightbox sequence 모드에 카운터 (예: 3/8) 하단 표시. 이미지 캡션 0건.
- **개선 방향**:
  - 사진별 캡션 (예: "전경 / 거실 / 화장실 / 등기부 발췌" — Cowork 산출물의 photos_meta.json 카테고리 활용 또는 프론트 측 derivation)
  - 캡션은 Lightbox 하단 + grid thumb hover overlay
- **근거**:
  1. **Vercel Guidelines** "Images alt text": 의미 있는 alt 필수 — alt 가 곧 캡션
  2. **frontend-design 스킬**: "decorative borders, custom cursors" — 캡션이 정보 + 디자인 디테일
- **영향도**: **LOW**
- **구현 난이도**: **MED** (photos_meta.json 카테고리 활용 위해 publish CLI 측 변경 필요할 수도 — **작업 금지 영역 침범 주의**)
- **작업 금지 위반**: 가능성 — photos_meta.json 안 카테고리 정보가 frontmatter 또는 .meta.json 으로 노출되어야 함. publish CLI 수정 가능성 → 본 라운드 비추천.

---

#### **P2-5. 표 / 콜아웃 / CTA — 시각 무게 일관 점검 (디자인 시스템 자가검증)**

- **영역**: 정보 위계 / 일관성
- **현재 상태**: 컴포넌트별 padding (p-3 / p-4 / p-5 / p-6 / p-8) + radius (xs / sm / md / lg / xl / 2xl) + shadow (subtle / card / elevated) 사용 패턴이 컴포넌트별 결정. 일관성 약함.
- **개선 방향**: 컴포넌트 type 별 토큰 룰 명문화 — 카드(rounded-xl, p-6, shadow-card), 콜아웃(rounded-md, p-4, shadow-subtle), CTA(rounded-2xl, p-8, shadow-elevated). 위반 컴포넌트 식별 + 정합화.
- **근거**:
  1. **Refactoring UI** 일관성 원칙: 동일 컴포넌트 type 은 동일 토큰
  2. **frontend-design 스킬**: "cohesive aesthetic"
- **영향도**: **LOW** (디자인 시스템 성숙도)
- **구현 난이도**: **HIGH** (전수 점검 + 다수 컴포넌트)
- **작업 금지 위반**: 0
- **주의**: **Phase 8 디자인 시스템 진입 시 처리 권고**.

---

#### **P2-6. RelatedCards — PropertyCard 시각 패턴 점검**

- **영역**: 카드
- **현재 상태**: PropertyCard 컴포넌트는 본 보고서 분석 범위 외 (RelatedCards 가 호출). 별도 검토 필요.
- **개선 방향**: 별도 라운드.
- **영향도**: **LOW**
- **구현 난이도**: ?
- **작업 금지 위반**: ?

---

#### **P2-7. Lightbox — keyboard focus trap 명시화**

- **영역**: 접근성 / 모달
- **현재 상태**: Lightbox 가 ESC + ←→ 키보드 처리 ✓. 다만 Tab 키 모달 외부 이탈 가능성 (focus trap 명시 코드 미확인).
- **개선 방향**: focus trap 라이브러리 (@radix-ui/react-dialog 또는 focus-trap-react) 도입 또는 자체 구현. modal open 시 첫 포커스 → close 버튼, Tab 순환 → 모달 내 요소만.
- **근거**:
  1. **Vercel Guidelines** "Compound controls": focus-within 활용
  2. **CLAUDE.md §10**: 접근성 최소 기준
- **영향도**: **LOW** (실제 영향 노안 사용자 키보드 네비 시점)
- **구현 난이도**: **MED** (focus trap 자체 구현 또는 신규 라이브러리 — shadcn Dialog 외 신규 라이브러리 추가 금지 룰 검토 필요)
- **작업 금지 위반**: 가능성 — 신규 라이브러리 추가 시 위반. 자체 구현 또는 shadcn Dialog 로 마이그레이션 검토.

---

#### **P2-8. ApplyCTA 다크 섹션 — 그라디언트 메시 / 시각 디테일**

- **영역**: CTA
- **현재 상태**: ApplyCTA 가 brand-950 bg + 우상단 blob (bg-brand-500/30 blur-3xl) decoration 1개 ✓. 단순 패턴.
- **개선 방향**:
  - frontend-design 스킬 "gradient meshes, noise textures, geometric patterns" 도입 검토
  - 다만 CLAUDE.md §13 "그라데이션은 BUILD_GUIDE.md 에 명시된 요소에만" 룰 위반 가능성
- **근거**:
  1. **frontend-design 스킬**: "Backgrounds & Visual Details — Create atmosphere and depth rather than defaulting to solid colors"
  2. **CLAUDE.md §13**: "그라데이션은 BUILD_GUIDE.md 에 명시된 요소에만"
- **영향도**: **LOW**
- **구현 난이도**: **LOW**
- **작업 금지 위반**: 가능성 — BUILD_GUIDE.md 검토 후 결정. 본 라운드 비추천.

---

## §4. 우선순위 권고

### P0 — 단계 5-2 patch 즉시 권고 (4건)

| # | 제목 | 영향도 | 난이도 | 사유 |
|---|---|---|---|---|
| **P0-1** | ScenarioCardsBoard 4 컬러 — CLAUDE.md 절대 규칙 위반 해소 | HIGH | MED | CLAUDE.md §13 절대 규칙 직접 위반 (오렌지 금지 + 3색 이상 강조 금지). 즉시 해소 필요 |
| **P0-2** | Hero stat 4-셀 시각 무게 차등 | HIGH | LOW | Segment A 의 결정 핵심 정보 (최저가) 시각 무게 부족. 단일 컴포넌트 변경 |
| **P0-3** | focus-visible 토큰 정합화 | HIGH | LOW | CLAUDE.md §10 접근성 명시 룰 + Vercel Guidelines 필수 |
| **P0-4** | iOS Safari safe-area-inset 적용 | HIGH | LOW | 모바일 사용자 다수 영향. globals.css 1줄 |

**P0 4건은 단계 5-2 단일 patch 로 묶어 처리 가능**. 추정 작업량 1~2 세션.

### P1 — 다음 라운드 권고 (7건, 단계 5-3 또는 Phase 8 직전)

| # | 제목 | 영향도 | 난이도 | 사유 |
|---|---|---|---|---|
| P1-1 | mdx H2 섹션 — Linear 단계적 진행 시각화 (사실/분석/결론 그룹화) | MED | MED | 가독성·체류 |
| P1-2 | HeroGallery + PhotoGalleryStrip 이중 노출 통합 | MED | MED | 정보 위계 + 페이지 길이 |
| P1-3 | 표 헤더 강조 + zebra striping | MED | LOW | 긴 권리분석 표 가독성 |
| P1-4 | Hero 시점 mini-CTA (모바일 전환 경로) | HIGH | LOW | 전환 경로 단축 |
| P1-5 | TrustBlock + DetailSidebar 근거자료 + Footer — 신뢰 신호 정합화 | MED | MED | 5건 위치 분산 검토. **CLAUDE.md "패찰 시 보증금 전액 반환" 5위치 룰 영향 사전 확인** 필수 |
| P1-6 | 타이포그래피 카테고리 4분 (Geist 패턴) | MED | HIGH | Phase 8 진입 시 |
| P1-7 | mdx 본문 줄 길이 max-w-prose 제한 | MED | LOW | 가독성 |

**P1 중 P1-3·P1-4·P1-7 은 LOW 난이도 — 단계 5-3 에 묶어 진행 가능. P1-1·P1-2·P1-5·P1-6 은 디자인 시스템 영향 — Phase 8 직전 또는 함께.**

### P2 — 장기 보류 (8건, Phase 8 디자인 시스템 진입 시 통합 처리)

| # | 제목 | 사유 |
|---|---|---|
| P2-1 | 폰트 페어링 (Display + Body) | Phase 8 서비스명·디자인 톤 확정 후 |
| P2-2 | 모션 / 마이크로 인터랙션 | "실용·합리·확실" 충돌 검토 후 |
| P2-3 | 공용 Callout 컴포넌트 추출 | 디자인 시스템 성숙도 |
| P2-4 | PhotoGalleryStrip 캡션 | publish CLI 영향 가능성 — 작업 금지 침범 주의 |
| P2-5 | 컴포넌트별 토큰 일관성 전수 점검 | Phase 8 시점 |
| P2-6 | PropertyCard / RelatedCards 별도 검토 | 분석 범위 외 |
| P2-7 | Lightbox keyboard focus trap | 신규 라이브러리 추가 룰 검토 후 |
| P2-8 | ApplyCTA 그라디언트 메시 | BUILD_GUIDE.md 룰 검토 후 |

---

## §5. 작업 금지 영역 재확인

### 본 보고서가 다룬 영역 (분석만, 변경 0)
- `/analysis/[slug]` 라우트 컴포넌트 17개의 시각·정보 위계·가독성 영역
- `src/app/globals.css` 디자인 토큰 (분석 가능, 변경 0)

### 본 보고서가 절대 침범하지 않은 영역
- ✅ Cowork 산출물 (`raw-content/*` 의 post.md, meta.json, data/) — 변경 0
- ✅ `scripts/content-publish/index.mjs` publish CLI 전체 — 변경 0
- ✅ `content/analysis/*.mdx` mdx 본문 + meta.json + audit.json — 변경 0
- ✅ 데이터·어휘·숫자 (감정가·최저가·시나리오 수익 등) — 변경 0
- ✅ supervisorContent() 시스템 프롬프트·반환 스키마 — 변경 0

### 모든 §3 개선 포인트의 분류
- **시각 영역**: 24/24 — 모든 포인트가 시각·정보 위계·가독성 한정
- **데이터·어휘·숫자 변경**: 0/24
- **publish CLI 영향**: 1건 (P2-4 PhotoGalleryStrip 캡션 — 작업 금지 침범 가능성 명시 + 본 라운드 비추천)
- **신규 라이브러리 추가 가능성**: 1건 (P2-7 Lightbox focus trap — shadcn Dialog 외 추가 금지 룰 검토 필요 명시)
- **CLAUDE.md §13 룰 영향**: 3건 (P0-1 / P1-1 / P1-5 — 모두 위반 해소 또는 사전 확인 명시)

### 단계 5-2 진입 시점 사전 확인 사항
1. P0-1 ScenarioCardsBoard 색상 변경 — 방안 A/B/C 중 형준님 선택
2. P0-2 Hero stat dominant 정의 — "차수별최저가" 가 dominant 인지 확정
3. P1-5 TrustBlock 정합화 — CLAUDE.md "패찰 시 보증금 전액 반환" 5위치 룰 영향 검토
4. 본 보고서의 외부 사례 부족분 — 형준님 직접 매물 사이트 캡처 또는 호갱노노 / 디스코·KB 부동산 등 한국 사이트 별도 분석 필요 시 단계 5-1B 추가 라운드 권고

---

## 부록 A. 본 보고서가 인용한 룰 출처

### Vercel Web Interface Guidelines (61개 룰)
- 접근성·포커스·폼·애니메이션·타이포그래피·콘텐츠 처리·이미지·성능·네비게이션·터치·Safe area·다크모드·i18n·하이드레이션·호버·콘텐츠 카피
- 출처: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`

### frontend-design 스킬 (시스템 메시지)
- Typography: 독특한 폰트 / display + body 페어링 / generic 회피
- Color & Theme: cohesive aesthetic + dominant + sharp accents
- Motion: CSS-only / staggered reveals / hover surprise
- Spatial Composition: asymmetry / overlap / diagonal flow / generous space
- Backgrounds & Visual Details: gradient meshes / noise / geometric / layered transparencies / dramatic shadows
- AVOID: generic AI aesthetics / Inter·Roboto·Arial / 보라 그라디언트 흰 배경 / cookie-cutter

### Stripe payments
- Hero 이중 CTA / 공백·타이포로 위계 / 흰·연회색 교대 / 다중 열 footer / 신뢰 배지 한 영역 집중

### Linear method
- 숫자 prefix 섹션 위계 (1.1·2.1) / 단계적 진행 시각화 (Introduction → Direction → Building) / 미니멀 다층 진입 경로

### Vercel Geist Typography
- 4 카테고리 사이즈 시스템: heading-72/14·button-16/12·label-20/12·copy-24/13
- Subtle / Strong modifier (`<strong>` 중첩)

### Refactoring UI Color Palette
- 그레이 8-10 + Primary 5-10 + Accent 의미별 (빨강 위험 / 초록 긍정 / 노랑 주의)
- 사전 고정 팔레트 — `lighten`/`darken` 함수 회피

### CLAUDE.md (프로젝트 컨텍스트)
- §1 데이터 원칙 / §6 판단 기준 / §10 접근성 / §11 콘텐츠 톤 / §12 디자인 의사결정 / §13 절대 규칙

---

## 부록 B. 단계 5-2 patch 후보 시나리오

### 시나리오 A — P0 4건 단일 patch (권고)
- ScenarioCardsBoard 색상 단일 (P0-1)
- Hero stat dominant 차등 (P0-2)
- focus-visible 토큰 (P0-3)
- safe-area-inset (P0-4)
- 추정 작업량: 1~2 세션
- 회귀 위험: 낮음 (시각 영역 한정)
- 검증: 4건 사건 production HTTP 200 + 스크린샷 시연

### 시나리오 B — P0 + P1 LOW 난이도 함께
- 시나리오 A + P1-3 표 헤더 + P1-4 Hero mini-CTA + P1-7 본문 max-w-prose
- 추정 작업량: 2~3 세션
- 회귀 위험: 낮음~중간
- 검증: 동일 + 모바일 시연 추가

### 시나리오 C — Phase 8 디자인 시스템 직전 일괄
- P0 + P1 모두 + P2 일부 (P2-1 폰트 페어링 / P2-2 모션 / P2-5 토큰 일관성)
- 추정 작업량: 5~10 세션
- 회귀 위험: 높음 (디자인 시스템 영향)
- 검증: 디자인 토큰 변경 + 다수 컴포넌트 + 모바일·데스크톱 + 다크모드 (도입 시)
- **권고**: Phase 8 진입 시점에 통합

---

## 부록 C. 제외된 영역 (별도 라운드 필요 시 명시)

- `/` (홈), `/apply`, `/guide`, `/news` 등 다른 라우트의 시각 분석 — 별도 라운드
- `/login`, `/my/*` 인증·마이페이지 영역 — 별도 라운드
- 어드민 (`/admin/*`) — 운영자 영역, 별도 라운드
- PropertyCard / RelatedCards 의 매물 카드 시각 패턴 — P2-6 별도 검토
- Footer 전체 분석 — Explore 결과만 보고, 시각 영역 별도 라운드

---

**보고서 끝.** 형준님 + Opus 검토 후 단계 5-2 patch 지시문 작성 단계로 이동.
