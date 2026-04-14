# 경매퀵 프론트엔드 빌드 가이드

> **용도**: Claude Code가 이 문서를 읽고 경매퀵 웹사이트를 빌드할 때 사용하는 지침서.
> **상위 문서**: `CLAUDE.md` — 왜 이렇게 만드는지의 원칙. 판단이 필요할 때 CLAUDE.md를 먼저 참조.
> **레퍼런스 HTML**: `경매퀵_홈_v9.html` — 홈 페이지 디자인 확정본. 이 파일의 CSS/구조를 기준으로 확장.
> **v2** | 2026-04-14

---

## 1. 프로젝트 개요

경매퀵은 경매 입찰대리 서비스의 **접수 시스템(제1축) + 콘텐츠 허브(제2축)** 웹사이트이다. 접수가 정확하게 작동하는 것이 메인이고, 콘텐츠가 신뢰와 체류를 만드는 보조 레이어다.

Phase 1에서는 정적 사이트(SSG)로 시작하며, 콘텐츠는 마크다운 파일 기반 CMS 구조로 관리한다. 접수는 카카오톡 연동으로 시작하되, Phase 2 전환 시 웹 폼+API로 교체 가능한 구조로 설계한다.

### 1-1. 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | **Next.js 14+ (App Router)** | SSG + SSR 혼합, 콘텐츠 컬렉션, 메타데이터 API, Phase 2 API Routes 대비 |
| 콘텐츠 관리 | **Contentlayer** 또는 `next-mdx-remote` + `gray-matter` | 마크다운 frontmatter → 타입 안전 데이터 |
| 스타일 | **TailwindCSS 3.4+** + CSS Variables | 유틸리티 + 토큰 체계 병행 |
| UI 컴포넌트 | **shadcn/ui** (필요한 것만 선택 설치) | Radix 기반, 접근성 내장, Tailwind 호환 |
| 배포 | **Vercel** | Next.js 네이티브, 무료 tier, ISR 지원 |
| 폰트 | **Noto Sans KR** (`next/font/google`) | 로컬 서빙으로 FOUT 방지, CLS 최소화 |
| 아이콘 | **Lucide React** | Heroicons 호환, Tree-shaking 지원 |
| 패키지 매니저 | **pnpm** | 빠른 설치, 디스크 효율 |
| 린트/포맷 | **ESLint + Prettier** | 코드 일관성 |
| 타입 | **TypeScript (strict)** | 런타임 에러 방지, frontmatter 스키마 검증 |

### 1-2. 디렉토리 구조

```
/
├── public/
│   ├── images/
│   ├── og-image.png
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml          → 빌드 시 자동 생성
├── content/                   → 마크다운 CMS (제2축)
│   ├── analysis/              → 물건분석
│   │   ├── 2026-04-18-deoksan-302.mdx
│   │   └── 2026-04-25-haim-201.mdx
│   ├── guide/                 → 경매가이드
│   │   └── what-is-auction.mdx
│   ├── news/                  → 시황·뉴스
│   │   └── 2026-04-w3-incheon.mdx
│   └── notice/                → 공지
│       └── service-launch.mdx
├── src/
│   ├── app/                   → Next.js App Router
│   │   ├── layout.tsx         → 루트 레이아웃 (TopNav, Footer, MobileSticky)
│   │   ├── page.tsx           → / (홈)
│   │   ├── analysis/
│   │   │   ├── page.tsx       → /analysis (목록)
│   │   │   └── [slug]/
│   │   │       └── page.tsx   → /analysis/{slug} (상세)
│   │   ├── guide/
│   │   │   ├── page.tsx       → /guide (목록)
│   │   │   └── [slug]/
│   │   │       └── page.tsx   → /guide/{slug}
│   │   ├── news/
│   │   │   ├── page.tsx       → /news (목록)
│   │   │   └── [slug]/
│   │   │       └── page.tsx   → /news/{slug}
│   │   ├── apply/
│   │   │   ├── page.tsx       → /apply (신청)
│   │   │   └── guide/
│   │   │       └── page.tsx   → /apply/guide (신청 가이드)
│   │   ├── service/
│   │   │   └── page.tsx       → /service
│   │   ├── about/
│   │   │   └── page.tsx       → /about
│   │   ├── faq/
│   │   │   └── page.tsx       → /faq
│   │   ├── contact/
│   │   │   └── page.tsx       → /contact
│   │   ├── notice/
│   │   │   ├── page.tsx       → /notice (목록)
│   │   │   └── [slug]/
│   │   │       └── page.tsx   → /notice/{slug}
│   │   ├── terms/
│   │   │   └── page.tsx       → /terms
│   │   ├── privacy/
│   │   │   └── page.tsx       → /privacy
│   │   ├── refund/
│   │   │   └── page.tsx       → /refund
│   │   └── my/                → Phase 2 마이페이지 (예약 경로)
│   │       ├── page.tsx       → /my (대시보드)
│   │       ├── orders/
│   │       │   └── page.tsx   → /my/orders (접수 내역)
│   │       ├── history/
│   │       │   └── page.tsx   → /my/history (과거 기록)
│   │       └── settings/
│   │           └── page.tsx   → /my/settings (내 정보)
│   ├── components/
│   │   ├── layout/            → 전역 레이아웃
│   │   │   ├── TopNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileSticky.tsx
│   │   │   └── RegionStrip.tsx
│   │   ├── home/              → 홈 전용
│   │   │   ├── HeroSearch.tsx     → 서비스 인터페이스 (검색/필터)
│   │   │   ├── DashCard.tsx
│   │   │   ├── CardCarousel.tsx
│   │   │   ├── WhySection.tsx
│   │   │   ├── FlowSteps.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Reviews.tsx
│   │   │   ├── TrustCTA.tsx
│   │   │   └── ContentShowcase.tsx → 최신 가이드/시황 미리보기
│   │   ├── analysis/          → 물건분석
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyListFilter.tsx
│   │   │   ├── PropertyDetail/
│   │   │   │   ├── SectionOverview.tsx
│   │   │   │   ├── BidTimeline.tsx
│   │   │   │   ├── RiskAnalysis.tsx
│   │   │   │   ├── PriceComparison.tsx
│   │   │   │   ├── InvestSimulation.tsx
│   │   │   │   ├── SalesHistory.tsx
│   │   │   │   ├── Summary.tsx
│   │   │   │   ├── DetailSidebar.tsx  → 플로팅 요약 (가격, 입찰일, CTA)
│   │   │   │   └── RelatedCards.tsx   → 관련 물건 추천
│   │   │   ├── RiskCard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── ApplyCTA.tsx       → "이 물건 입찰 대리 신청" 카드
│   │   ├── apply/             → 신청 관련
│   │   │   ├── ApplyForm.tsx      → 스텝 폼 (물건확인→입찰정보→서류→확인제출)
│   │   │   ├── ApplyConfirmation.tsx → 접수 완료 화면
│   │   │   ├── ApplyChecklist.tsx → 안심 체크리스트
│   │   │   ├── FileUpload.tsx     → PDF/이미지 업로드
│   │   │   └── FeeCalculator.tsx  → 수수료 자동 계산
│   │   └── common/            → 공통
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── SearchBox.tsx
│   │       ├── SectionHead.tsx
│   │       ├── EmptyState.tsx     → 검색 결과 없음 등
│   │       ├── ContentCard.tsx    → 가이드/뉴스 카드 (범용)
│   │       └── Sidebar.tsx        → 사이드바 위젯 (최신 글, 인기 분석)
│   ├── lib/
│   │   ├── content.ts         → 마크다운 파싱, 정렬, 필터링 유틸
│   │   ├── types.ts           → TypeScript 인터페이스
│   │   └── constants.ts       → 상수 (법원 목록, 물건유형 등)
│   ├── data/
│   │   ├── reviews.json       → 고객 후기 풀
│   │   └── dashboard.json     → 대시보드 숫자 (수동 업데이트)
│   └── styles/
│       └── globals.css        → CSS Variables + Tailwind 베이스
├── contentlayer.config.ts     → 마크다운 스키마 정의
├── tailwind.config.ts         → Tailwind 커스텀 테마
├── next.config.mjs
├── tsconfig.json
├── CLAUDE.md
├── BUILD_GUIDE.md             → 이 문서
└── package.json
```

---

## 2. 디자인 방향

### 2-1. 원칙

v9.1 HTML은 디자인의 **참조점**이지 **정답**이 아니다. Claude Code가 설치된 스킬(`ui-ux-pro-max`, `frontend-design`, `polish`, `tailwind-design-system`, `web-design-guidelines`)을 활용하면 v9.1보다 더 나은 결과물이 나올 수 있다. 디자인 수치를 미리 고정하여 그 가능성을 차단하지 않는다.

**확정된 것 (변하지 않는 뿌리):**
- 브랜드 키워드: 실용 · 합리 · 확실
- 물건분석 3종 분류: danger(위험/빨강계) · edu(정석/블루계) · safe(투자매력/그린계)
- 오렌지 컬러 사용 금지 (v5~v8 반복 실패에서 확인된 교훈)
- 흰 배경 기조
- 이모지 사용 금지
- 서체: Noto Sans KR (Google Fonts 로드 편의성 우선, `next/font/google`로 로컬 서빙)

**참조점으로 활용하되 고정하지 않는 것:**
- 컬러 hex 값, 그라데이션 방향/각도
- 스페이싱 수치, border-radius
- 서체 사이즈/웨이트 매핑
- 인터랙션 상태의 구체적 CSS
- 레이아웃 비율, 카드 크기

**빌드 시 스킬 활용 방법:**
1. 홈 페이지 빌드 시 → v9.1 HTML을 참조점으로 제공하되, `frontend-design` + `ui-ux-pro-max`를 활용하여 더 나은 시각적 결과를 추구
2. 컴포넌트 디자인 시 → `polish`로 디테일 마감 (픽셀 정렬, 간격 일관성, 상태 누락 체크)
3. Tailwind 설정 시 → `tailwind-design-system`으로 토큰 체계 구축
4. 최종 검수 시 → `web-design-guidelines`로 접근성·성능 감사

### 2-2. v9.1에서 가져올 것과 넘어설 것

**가져올 것 (검증된 의사결정):**
- 블루 메인 + 노랑·빨강 키컬러 조합 (v3~v9.1 반복에서 확정)
- 가로 캐러셀로 물건분석 카드 표시
- 대화형 메시지 후기 (말풍선 + 아바타)
- 플로우차트 형태 이용 절차
- 반투명 sticky 네비게이션

**넘어설 것 (v9.1의 한계):**
- "깨끗한 AI 슬롭" 느낌 → 경매퀵만의 시각적 아이덴티티 필요
- 타이포그래피 위계 부족 → 디스플레이/본문 구분 강화
- 섹션 간 호흡 부족 → 여백과 리듬감
- 모바일 인터랙션 미완 → 햄버거 메뉴, 스크롤 애니메이션, 캐러셀 인디케이터
- 히어로가 텍스트 헤드라인에 그침 → 서비스 인터페이스로 전환 (CLAUDE.md 섹션 1)

### 2-3. 접근성 (변하지 않는 기준)

디자인이 자유롭게 변하더라도, 아래 접근성 기준은 반드시 지킨다:

- **색상 대비**: 텍스트와 배경의 명도 대비 WCAG AA (4.5:1) 이상
- **터치 타겟**: 모바일에서 탭 가능한 모든 요소 최소 44×44px
- **Focus ring**: 키보드 네비게이션 시 현재 위치가 시각적으로 명확
- **이미지 alt**: 의미 있는 이미지 모두 alt 제공
- **폼 라벨**: 모든 input에 label 또는 aria-label 연결
- **시맨틱 HTML**: 페이지당 h1 1개, heading 위계 건너뛰기 금지
- **인터랙티브 요소 5가지 상태**: default / hover / active / focus / disabled — 구체적 스타일은 빌드 시 결정하되, 5가지 상태가 모두 존재해야 한다

### 2-4. 성능 (변하지 않는 목표)

- LCP 2.5초 이내
- CLS 0.1 이하
- 이미지: `next/image` 사용, WebP, lazy loading
- 폰트: `next/font/google`로 로컬 서빙, FOUT 방지
- 번들: 초기 JS 최소화, 동적 import 활용

---

## 4. 사이트맵

### 4-1. Phase 1 구현 페이지 (17개)

| 경로 | 페이지명 | GNB | Phase |
|------|---------|-----|-------|
| `/` | 홈 | 로고 | P1 |
| `/analysis` | 물건분석 목록 | NAV | P1 |
| `/analysis/{slug}` | 물건분석 상세 | - | P1 |
| `/guide` | 경매가이드 목록 | NAV | P1 |
| `/guide/{slug}` | 경매가이드 상세 | - | P1 |
| `/news` | 시황·뉴스 목록 | NAV | P1 |
| `/news/{slug}` | 시황·뉴스 상세 | - | P1 |
| `/service` | 서비스 안내 | NAV | P1 |
| `/apply` | 입찰 대리 신청 | CTA | P1 (카카오톡) |
| `/apply/guide` | 신청 가이드 | - | P1 |
| `/about` | 대표 소개 | - | P1 |
| `/faq` | 자주 묻는 질문 | - | P1 |
| `/contact` | 문의하기 | - | P1 |
| `/notice` | 공지사항 목록 | - | P1 |
| `/terms` | 이용약관 | 풋터 | P1 |
| `/privacy` | 개인정보처리방침 | 풋터 | P1 |
| `/refund` | 환불 규정 | 풋터 | P1 |

### 4-2. Phase 2 예약 경로 (빌드하지 않되 라우팅 예약)

| 경로 | 페이지명 | 설명 |
|------|---------|------|
| `/my` | 마이페이지 대시보드 | 현재 접수 현황 요약 |
| `/my/orders` | 접수 내역 | 진행 중인 접수 상세 |
| `/my/history` | 과거 이용 기록 | 모든 완료 건 이력 |
| `/my/settings` | 내 정보 관리 | 연락처, 알림 설정 |
| `/login` | 로그인 | 카카오/네이버 소셜 로그인 |
| `/signup` | 회원가입 | |

---

## 5. 콘텐츠 관리 시스템 (CMS)

### 5-1. 마크다운 + Frontmatter 구조

파일 1개 = 페이지 1개. 코드 수정 없이 콘텐츠를 추가/수정/삭제한다.

**물건분석 frontmatter 스키마:**

```yaml
---
type: analysis
slug: deoksan-302                    # URL slug (SEO 친화적 한글+영문)
title: 덕산하이츠 302호
subtitle: 최저가 9,947만원, 함정은 어디에?
category: danger                      # danger | safe | edu
region: incheon
court: 인천지방법원
caseNumber: 2021타경521675
appraisal: 203000000                  # 숫자 (원 단위)
minPrice: 99470000
round: 4
percent: 49
bidDate: 2026-04-18
address: 인천광역시 미추홀구 주안동 123-45
dong: 주안동
propertyType: 다세대주택               # 아파트 | 다세대주택 | 빌라 | 오피스텔
areaM2: 49.17
areaPyeong: 14.9
auctionType: 강제경매                  # 강제경매 | 임의경매
tags:
  - text: 임차보증금 인수
    type: danger
  - text: 강제경매
    type: neutral
riskLevel: high                        # high | mid | low
publishedAt: 2026-04-15
updatedAt: 2026-04-15
status: published                      # draft | published | archived
# 시세 데이터 (크롤러 결과)
marketData:
  avgSalePrice: 180000000
  avgLeasePrice: 120000000
  saleCount: 5
  leaseCount: 8
  dataDate: 2026-04-14
  source: naver_land
---
```

**경매가이드 frontmatter:**

```yaml
---
type: guide
slug: what-is-auction
title: 경매란 무엇인가
subtitle: 법원 부동산 경매의 기초부터
difficulty: beginner                   # beginner | intermediate | advanced
tags: [경매 기초, 입문]
publishedAt: 2026-04-10
updatedAt: 2026-04-10
status: published
---
```

**시황·뉴스 frontmatter:**

```yaml
---
type: news
slug: 2026-04-w3-incheon
title: 인천 경매 시황 — 2026년 4월 3주차
subtitle: 낙찰가율 소폭 상승, 1억 이하 물건 증가
region: incheon
publishedAt: 2026-04-18
status: published
---
```

### 5-2. TypeScript 인터페이스

```ts
// src/lib/types.ts

interface PropertyFrontmatter {
  type: 'analysis';
  slug: string;
  title: string;
  subtitle: string;
  category: 'danger' | 'safe' | 'edu';
  region: string;
  court: string;
  caseNumber: string;
  appraisal: number;
  minPrice: number;
  round: number;
  percent: number;
  bidDate: string;           // YYYY-MM-DD
  address: string;
  dong: string;
  propertyType: string;
  areaM2: number;
  areaPyeong: number;
  auctionType: string;
  tags: { text: string; type: 'danger' | 'safe' | 'info' | 'neutral' }[];
  riskLevel: 'high' | 'mid' | 'low';
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  marketData?: MarketData;
}

interface MarketData {
  avgSalePrice: number;
  avgLeasePrice: number;
  saleCount: number;
  leaseCount: number;
  dataDate: string;
  source: string;
}

interface GuideFrontmatter {
  type: 'guide';
  slug: string;
  title: string;
  subtitle: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
}

interface NewsFrontmatter {
  type: 'news';
  slug: string;
  title: string;
  subtitle: string;
  region: string;
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
}

// 접수 데이터 (Phase 2용, 구조 미리 설계)
interface OrderData {
  id: string;
  caseNumber: string;
  round: number;
  court: string;
  customerId: string;
  bidPrice: number;
  depositAmount: number;
  fee: number;
  status: 'pending' | 'confirmed' | 'bidding' | 'completed' | 'cancelled';
  timestamps: {
    createdAt: string;
    confirmedAt?: string;
    bidAt?: string;
    resultAt?: string;
    settledAt?: string;
  };
  result?: 'won' | 'lost';
}

interface Review {
  text: string;
  name: string;
  role: string;
}
```

---

## 6. 핵심 페이지 설계

### 6-1. 홈 (`/`)

레퍼런스: `경매퀵_홈_v9.html`. 이 파일의 시각적 결정을 따르되, 구조를 개선한다.

**섹션 순서:**

| # | 섹션 | 컴포넌트 | 핵심 |
|---|------|---------|------|
| A | 상단 네비 | `TopNav` | GNB + CTA + 모바일 햄버거 |
| B | 히어로 | `HeroSearch` | 서비스 인터페이스 + 수수료 즉시 표시 |
| C | 지역 스트립 | `RegionStrip` | 인천(활성) + 오픈예정 지역들 |
| D | 물건분석 캐러셀 | `CardCarousel` | 최신 물건분석 카드 3~5개 + 전체보기 |
| E | 콘텐츠 쇼케이스 | `ContentShowcase` | **[신규]** 최신 가이드 2개 + 시황 1개 |
| F | 왜 경매퀵인가 | `WhySection` | 비교표 + 가치 카드 3개 + 후기 |
| G | 이용 절차 | `FlowSteps` | 3단계 플로우차트 |
| H | 수수료 | `Pricing` | 3열 카드 + **"패찰 시 보증금 전액 반환"** |
| I | 신뢰 + CTA | `TrustCTA` | 자격증명 3종 + 다크 CTA |
| J | 풋터 | `Footer` | 3컬럼 + 컴플라이언스 4항목 |
| K | 모바일 스티키 | `MobileSticky` | 물건분석 + 입찰 대리 신청 |

**E. ContentShowcase (신규):** 물건분석 캐러셀 아래에 위치. "경매 가이드"와 "시황·뉴스"에서 최신 글을 미리 보여줘서 "이 사이트에 읽을거리가 있다"는 인상을 준다. 2컬럼 그리드 (가이드 카드 2 + 시황 카드 1).

### 6-2. 물건분석 상세 (`/analysis/{slug}`) — **사업의 가장 중요한 페이지**

Segment B가 네이버 검색에서 바로 착지하는 곳. SEO와 전환의 핵심.

**레이아웃:** 2컬럼 (데스크탑). 좌: 본문 7섹션. 우: 사이드바(플로팅 요약). 모바일: 1컬럼 + 하단 스티키 CTA.

**본문 7섹션 (마크다운 본문에서 렌더링):**

| # | 섹션 | 컴포넌트 | 내용 |
|---|------|---------|------|
| 01 | 물건 개요 | `SectionOverview` | 정보 그리드(소재지, 면적, 감정가, 최저가) + 설명 |
| 02 | 입찰 경과 | `BidTimeline` | 회차별 타임라인 (1차→2차→...→현재) |
| 03 | 권리분석 | `RiskAnalysis` | RiskCard + 등기부 요약 테이블 + 임차인 현황 |
| 04 | 시세 비교 | `PriceComparison` | 경매 최저가 vs 매물가 비교 카드 + 매물 목록 + 실거래가 |
| 05 | 투자 수익 시뮬레이션 | `InvestSimulation` | 비용 테이블 + 시나리오 3종(매도/전세/월세) 카드 |
| 06 | 매각사례 참고 | `SalesHistory` | 4칸 그리드 (1/3/6/12개월 통계) |
| 07 | 종합 의견 | `Summary` | 결론 + "배울 수 있는 것" 박스 |

**사이드바 (`DetailSidebar`):**
- 플로팅 (스크롤 시 따라옴)
- 물건명, 최저가(큰 글씨), 입찰일, 위험도 뱃지
- **"이 물건 입찰 대리 신청" CTA 버튼**
- 수수료 요약 ("5만원부터")

**하단 요소:**
- `ApplyCTA` — "이 물건 입찰 대리 신청" 전폭 카드
- `RelatedCards` — 같은 동네/비슷한 유형 물건 3개
- 컴플라이언스 4항목

### 6-3. 입찰 대리 신청 (`/apply`) — 전환의 최종 목적지

웹 접수 폼. 고객이 사이트 안에서 접수를 완결하는 구조.

**Phase 1 구현 범위:**
- 프론트엔드: 접수 폼 UI 완전 구현 (입력 → 검증 → 서류 업로드 → 제출 → 확인 화면)
- 백엔드: 폼 제출 데이터를 이메일 알림 또는 Webhook으로 전달. DB 저장은 Phase 2.
- 결제: 계좌이체 안내. PG 연동은 Phase 2.

**접수 플로우 (스텝 폼):**

```
Step 1: 물건 확인
  - 사건번호 입력 (또는 /analysis/{slug}에서 "이 물건 입찰 대리 신청" 클릭 시 자동 채움)
  - 법원 선택
  - 물건 정보 매칭 표시 (Phase 1: 정적 데이터, Phase 2: 대법원 API)
  - "접수 가능" / "이미 예약된 물건" 상태 표시 (1물건 1고객 원칙)

Step 2: 입찰 정보 입력
  - 입찰 희망 금액
  - 입찰자 정보 (이름, 연락처, 주민등록번호 앞자리)
  - 공동입찰 여부 (해당 시 공동입찰인 정보)

Step 3: 서류 업로드
  - 전자본인서명확인서 PDF 업로드
  - 신분증 사본 업로드
  - 업로드 가이드 (발급 방법 링크, 파일 형식 안내)

Step 4: 수수료 확인 · 제출
  - 수수료 자동 계산 (신청 시점 기준 얼리버드/일반/급건)
  - 보증금 금액 안내 (감정가의 10%)
  - 안심 체크리스트 5항목 확인
  - [신청 제출] 버튼

Step 5: 접수 완료
  - 접수번호 발급
  - 수수료 결제 안내 (전용계좌 + 금액)
  - 보증금 송금 안내 (전용계좌 + 금액 + 마감 시한)
  - "접수 확인 연락을 카카오톡으로 드립니다" 안내
  - 접수 내역 확인 링크
```

**구성 컴포넌트:**
1. **ApplyForm** — 스텝 폼 (Step 1~4). 각 스텝을 독립 컴포넌트로 분리.
2. **ApplyConfirmation** — 접수 완료 화면 (Step 5). 접수번호 + 결제/보증금 안내.
3. **ApplyChecklist** — 안심 체크리스트 5항목 (Step 4에서 사용, /apply 상단에도 배치)
   - 공인중개사 자격 보유
   - 보증보험 가입 (서울보증보험)
   - 보증금 전용계좌 운영
   - 패찰 시 보증금 전액 반환
   - 1물건 1고객 원칙
4. **FileUpload** — PDF/이미지 업로드 (Phase 1: 클라이언트 검증 + FormData 전송, Phase 2: S3/R2 직접 업로드)
5. **FeeCalculator** — 신청 시점 기준 수수료 자동 계산

**Phase 2 교체 지점:**
- Step 1 물건 매칭: 정적 데이터 → 대법원 API 실시간 조회
- Step 4 제출: 이메일/Webhook → API Route + DB 저장
- Step 5 결제: 계좌이체 안내 → PG 결제 위젯
- 서류 업로드: FormData → S3/R2 직접 업로드

**`/apply/guide`**: 초보자 단계별 안내. 각 스텝 스크린샷 + 설명. FAQ 3개 발췌.

### 6-4. 물건분석 목록 (`/analysis`)

**레이아웃:**
- 상단: 필터 바 (지역, 카테고리, 정렬)
- 본문: 카드 그리드 (데스크탑 3열, 태블릿 2열, 모바일 1열)
- 카드: `PropertyCard` (홈 캐러셀과 동일)
- 빈 상태: `EmptyState` ("조건에 맞는 물건분석이 없습니다. 필터를 변경해보세요.")

### 6-5. FAQ (`/faq`)

카테고리별 아코디언.

**카테고리:**
- 서비스 일반 (경매퀵이란?, 서비스 지역, 자격)
- 수수료·결제 (가격 체계, 결제 시점, 환불)
- 보증금 (패찰 시 반환, 전용계좌, 안전장치)
- 서류 (전자본인서명확인서, 위임장)
- 입찰 과정 (접수 후 절차, 결과 통보, 소요 시간)

---

## 7. SEO 인프라

### 7-1. 메타 태그 템플릿

**홈:**
```
title: 경매퀵 — 경매 입찰대리 5만원 | 인천지방법원 전문
description: 사건번호만 알려주세요. 서류 비대면, 결과 당일 통보. 인천지방법원 전문 매수신청 대리 서비스.
```

**물건분석 상세 (동적):**
```
title: {title} 경매 분석 — 감정가 {appraisal}, {round}차 최저가 {minPrice} | 경매퀵
description: {address} {propertyType} 경매. 감정가 {appraisal}에서 {round}차 최저가 {minPrice}({percent}%). 시세 비교, 수익 시뮬레이션, 권리분석.
```

**물건분석 목록:**
```
title: 오늘의 무료 물건분석 — 인천 경매 물건 시세 비교 | 경매퀵
description: 인천지방법원 경매 물건을 무료로 분석합니다. 시세 비교, 수익 시뮬레이션, 권리 구조 해설.
```

### 7-2. JSON-LD 구조화 데이터

**홈:** `Organization` + `WebSite` (sitelinks 검색)
**물건분석 상세:** `Article` (headline, datePublished, author)
**FAQ:** `FAQPage`

### 7-3. URL Slug 규격

물건분석: `{단지명}-{호수}` (한글+숫자, 하이픈 구분)
예: `deoksan-302`, `haim-201`, `sewon-501`

경매가이드: `{주제}` (영문 또는 한글 slug)
예: `what-is-auction`, `rights-analysis-101`

### 7-4. sitemap · robots · canonical

- `sitemap.xml`: Next.js `app/sitemap.ts`로 자동 생성. 모든 published 콘텐츠 포함.
- `robots.txt`: 기본 허용. `/my/*`, `/api/*` 차단.
- `canonical`: 모든 물건분석 상세에 자기 URL을 canonical로 지정. 네이버 블로그에는 웹사이트 URL을 canonical로.

---

## 8. 핵심 컴포넌트 명세

### 8-1. HeroSearch (히어로 서비스 인터페이스)

v9.1의 히어로를 서비스 탐색 도구로 업그레이드. 좌: 검색/필터 인터페이스. 우: 대시보드 카드.

```
┌─────────────────────────────────────────────────────────┐
│ 경매 입찰, 5만원이면 됩니다.                             │
│ (서브카피)                                               │
│ ┌──────────────────────────────────────────────────┐     │
│ │ [인천지방법원 ▼] [사건번호 입력 ___________] [검색] │     │
│ └──────────────────────────────────────────────────┘     │
│ 또는:  [전체 ▼] [예산 ▼] [유형 ▼]  물건 탐색하기       │
│                                                          │
│ [입찰 대리 신청]  [수수료 안내]                          │
│                                          ┌─────────────┐│
│                                          │ 이번 주 경매 ││
│                                          │ 42건 / 18건  ││
│                                          └─────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Props:** `onCaseSearch(court, caseNumber)`, `onFilterSearch(filters)` — Phase 1에서는 라우터 이동, Phase 2에서 API 호출로 교체.

### 8-2. PropertyCard

v9.1 그대로. Props는 `PropertyFrontmatter`에서 파생.

### 8-3. ApplyCTA (물건분석 상세 하단)

```
┌──────────────────────────────────────────────────────┐
│ 이 물건 입찰 대리 신청                                │
│ 덕산하이츠 302호 · 2021타경521675                    │
│ 수수료 5만원~ · 패찰 시 보증금 전액 반환              │
│                                                       │
│ [입찰 대리 신청하기]  [신청 방법 안내]                │
└──────────────────────────────────────────────────────┘
```

### 8-4. EmptyState

```
┌──────────────────────────────────┐
│       (일러스트 또는 아이콘)      │
│                                   │
│   조건에 맞는 물건이 없습니다.    │
│   필터를 변경해보세요.            │
│                                   │
│   [필터 초기화]                   │
└──────────────────────────────────┘
```

### 8-5. Badge · Button · RiskCard

v1과 동일. 인터랙션 상태(섹션 3-3) 추가 적용.

---

## 9. 반응형

모바일 퍼스트로 빌드한다. 구체적 브레이크포인트와 레이아웃 변경은 빌드 시 `tailwind-design-system` + `web-design-guidelines` 스킬을 활용하여 결정한다.

**변하지 않는 원칙:**
- 모바일에서 하단 스티키 CTA (물건분석 + 입찰 대리 신청) 항상 표시
- 모바일 safe area (`env(safe-area-inset-bottom)`) 처리
- 히어로: 모바일 1컬럼 / 데스크탑 2컬럼 (검색 인터페이스 + 대시보드 카드)
- 물건분석 상세: 모바일 1컬럼 + 하단 스티키 CTA / 데스크탑 2컬럼 + 사이드바
- 카드 그리드: 모바일 1열 또는 캐러셀 / 데스크탑 2~3열

---

## 10. 빌드 우선순위

| 순서 | 대상 | 이유 |
|------|------|------|
| 0 | 프로젝트 셋업 (Next.js + Tailwind + Contentlayer + TS) | 기반 |
| 1 | 레이아웃 (TopNav, Footer, MobileSticky) + 홈 | v9.1 기반. 전체 껍데기. |
| 2 | 콘텐츠 CMS (Contentlayer + 샘플 마크다운 3개) | 물건분석 데이터 흐름 검증 |
| 3 | `/analysis` + `/analysis/{slug}` | **킬링 콘텐츠. 사업 핵심.** |
| 4 | `/apply` (웹 접수 폼) + `/apply/guide` | 전환 목적지. 스텝 폼 + 서류 업로드 + 확인 화면 |
| 5 | `/guide` + `/news` + `/notice` | 콘텐츠 허브 완성 |
| 6 | `/service` + `/about` + `/faq` | 신뢰 구축 |
| 7 | `/terms` + `/privacy` + `/refund` + `/contact` | 법적 필수 |

---

## 11. 멀티채널 콘텐츠 — 원소스 멀티유즈

### 11-1. 줄기

경매 업계에서 세련된 카드뉴스 형식의 시각 콘텐츠를 제대로 하는 곳이 없다. 텍스트+스크린샷 나열이 전부인 시장에서, 규격화된 디자인 양식으로 물건분석을 시각화하면 그 자체가 전문성의 증거가 된다.

**원칙 하나: 원소스 멀티유즈.**

물건분석 마크다운(frontmatter + 본문)이 원소스다. 이 하나의 소스에서 채널별로 최적화된 콘텐츠를 파생한다. 채널은 늘어날 수도 있고, 줄어들 수도 있고, 아직 시도하지 않은 채널이 추가될 수도 있다.

```
[원소스]
content/analysis/{slug}.mdx
    │
    ├──→ 웹 페이지        ← 자동 빌드 (확정)
    ├──→ 카드뉴스 이미지   ← 실행 시 규격 결정
    ├──→ 세로 영상         ← 실행 시 규격 결정
    ├──→ 블로그 원고       ← 실행 시 규격 결정
    ├──→ OG 이미지         ← 자동 생성 (확정)
    └──→ (향후 추가 채널)  ← 열림
```

### 11-2. 현재 확정된 것과 열려 있는 것

| 항목 | 상태 | 설명 |
|------|------|------|
| 웹사이트 렌더링 | **확정** | `/analysis/{slug}` — 7섹션 풀 레이아웃. BUILD_GUIDE 섹션 6에서 정의. |
| OG 이미지 자동 생성 | **확정** | `next/og` 또는 별도 스크립트. 물건명+최저가+한 줄 요약. |
| 물건분석 3종 분류 (A/B/C) | **확정** | danger(빨강계) / edu(블루계) / safe(그린계). 분류 기준은 CLAUDE.md에 정의. |
| 콘텐츠 톤 규칙 | **확정** | 존댓말, 숫자 우선, 이모지 금지, AI 슬롭 금지. CLAUDE.md 섹션 9. |
| 카드뉴스 디자인 양식 | **열림** | 첫 카드뉴스를 실제로 제작하면서 규격 확정. 아래 스킬 가이드 참조. |
| 영상(릴스/틱톡/쇼츠) | **열림** | 카드뉴스 완성 후 영상화 검토. |
| 네이버 블로그 포맷 | **열림** | 스마트에디터 제약을 실제 발행하면서 확인 후 규격화. |
| 인스타그램/쓰레드/X | **열림** | 각 채널 개설 후 첫 게시물을 실행하면서 결정. |
| 유튜브 쇼츠 | **열림** | 영상 제작 역량 확보 후 결정. |

### 11-3. 채널 실행 시 스킬 활용 가이드

각 채널을 처음 실행할 때, 아래 스킬의 가이드라인을 참조하여 해당 채널에 맞는 규격을 그때 결정한다. 미리 규정하지 않는다.

**카드뉴스 첫 제작 시:**
- `ui-ux-pro-max` → 접근성, 가독성, 터치 타겟 기준
- `frontend-design` → 시각적 차별화, 레이아웃 구성
- `copywriting` → 훅 문구, CTA 문구, 카피 패턴
- `content-strategy` → 장수, 정보 밀도, 스토리 구조

**블로그 첫 발행 시:**
- `seo-audit` → 네이버 블로그 SEO 최적화
- `content-strategy` → 요약 범위, 사이트 유도 방식
- `copywriting` → 제목 패턴, 본문 훅

**영상 첫 제작 시:**
- `content-strategy` → 영상 길이, 전환 리듬, 정보 밀도
- `ui-ux-pro-max` → 안전 영역, 텍스트 가독성

**새 채널 추가 시:**
- 해당 채널의 공식 가이드 + 위 스킬 조합으로 규격 결정
- 결정된 규격을 이 섹션에 추가하여 문서 업데이트

### 11-4. 변하지 않는 것 (전 채널 공통)

채널별 규격은 유동적이지만, 아래는 모든 채널에서 변하지 않는다:

- **이모지 금지.**
- **숫자가 시각적 중심.** 가격, %, 면적이 텍스트보다 크게.
- **마지막은 CTA.** 웹사이트 링크 또는 서비스 안내로 마무리.
- **로고 + 서비스명** 포함.
- **물건 카테고리(A/B/C) 컬러 톤** 일관 적용.
- **데이터 출처 표기.** "대법원 경매정보 기초 작성."
- **콘텐츠 톤 규칙** 동일 적용 (CLAUDE.md 섹션 9).

### 11-5. 카드뉴스 생성 기반 (기술 방향만)

frontmatter 데이터를 주입하면 시각 콘텐츠가 나오는 구조를 목표로 한다. 구체적 구현은 첫 카드뉴스 제작 시점에 결정.

```
src/
├── templates/           → 카드뉴스/OG 템플릿 (향후 추가)
│   ├── card-news/       → 채널별 템플릿 컴포넌트
│   └── og/
│       └── OGImage.tsx  → OG 이미지 (확정, 빌드 시 구현)
```

**생성 방식 후보** (실행 시점에 선택):
- HTML/CSS 템플릿 + Puppeteer PNG 캡처
- `@vercel/og` (Next.js 내장 OG 생성)
- Figma API 연동
- Claude + 이미지 생성 파이프라인

---

## 12. 컴플라이언스 · 콘텐츠 톤

CLAUDE.md 섹션 7(법적 경계), 섹션 9(콘텐츠 톤)를 참조. 여기서는 구현에 필요한 것만 요약.

**풋터 4항목 필수.** 모든 페이지.
**톤:** 존댓말, 숫자 우선, 짧은 문장, 이모지 금지, AI 슬롭 금지.
**표기:** 가격 한글 단위 병기, 면적 ㎡+평 병기, 상표 마스킹.

---

## 13. 레퍼런스 파일

| 파일 | 설명 |
|------|------|
| `CLAUDE.md` | **최상위 문서.** 왜 이렇게 만드는지. 판단 기준. |
| `경매퀵_홈_v9.html` | 홈 디자인 확정본. CSS/구조의 소스 오브 트루스. |
| `블로그_콘텐츠_템플릿.md` | 물건분석 7섹션 규격. 내부 생산 규격. |
| `경매_입찰대리_사업계획서_v1_3.md` | 사업 전체 구조. **내부 전용.** |

---

## Changelog

| 버전 | 날짜 | 변경 |
|------|------|------|
| 1.0 | 2026-04-13 | 초안. 홈 중심 명세. |
| 2.0 | 2026-04-14 | 전면 재구성. 아래 상세. |
| 2.1 | 2026-04-14 | "카톡 접수" → "웹 접수 시스템" 전환. §6-3 전면 교체(스텝 폼 5단계), apply/ 컴포넌트 재구성, 빌드 우선순위 업데이트. |

### v2.0 변경 상세

- **"두 축" 프레임 반영**: 접수 시스템(제1축) + 콘텐츠 허브(제2축) 우선순위 구조.
- **기술 스택 확정**: Next.js App Router + Contentlayer + TailwindCSS + shadcn/ui + TypeScript strict + Lucide + pnpm.
- **CMS 구조 신설**: content/ 디렉토리 + frontmatter 스키마 4종(analysis, guide, news, notice) + TypeScript 인터페이스.
- **물건분석 상세 설계 신설**: 7섹션 컴포넌트 명세 + 사이드바 + ApplyCTA + RelatedCards.
- **신청 페이지 설계 신설**: 안심 체크리스트 + 필요 서류 + 카카오톡 연결.
- **접근성 가이드 신설**: 색상 대비 4.5:1, 터치 44px, focus ring, 시맨틱 HTML.
- **성능 가이드 신설**: LCP 2.5초, CLS 0.1, next/image, next/font.
- **인터랙션 상태 신설**: Button/Card/Link의 5가지 상태 정의.
- **스페이싱 시스템 신설**: 4px 기반 9단계 스케일.
- **SEO 인프라 신설**: 동적 메타 템플릿, JSON-LD, URL slug 규격, sitemap/robots/canonical.
- **사이트맵 확장**: 17개(P1) + 6개(P2 예약). news, notice, my/* 경로 추가.
- **Tailwind config 매핑 추가**: CSS Variables → Tailwind theme extend.
- **Phase 2 데이터 구조 선설계**: OrderData 인터페이스 (접수 상태 추적).
- **HeroSearch 컴포넌트**: 서비스 인터페이스(사건번호 입력 + 필터 탐색) 와이어프레임.
- **ContentShowcase 컴포넌트**: 홈에 최신 가이드/시황 표시.
- **EmptyState 컴포넌트**: 검색 결과 없음 등 빈 상태 UI.
- **멀티채널 콘텐츠 구조 신설 (섹션 11)**: 원소스 멀티유즈 원칙 + 파이프라인 줄기. 채널별 디테일은 미규정 — 실행 시점에 스킬 가이드를 활용하여 결정하는 열린 구조. 변하지 않는 공통 규칙(이모지 금지, 숫자 중심, CTA 마무리)만 확정.
- **v1에서 삭제된 것**: 로고 SVG 코드 (별도 파일로 관리), DESIGN.md 참조 (통합됨).
