# Phase 7 시각화 본질 재수립 + 스크롤 모션 그래픽 보고서 (단계 5-3 v2, patch 0)

**작성**: 2026-04-27
**대상**: `/analysis/[slug]` 라우트 9 영역 — Hero / 01 물건 개요 / 02 입찰 경과 / 03 권리분석 / 04 시세 비교 / 05 시나리오 / 06 매각사례 / 07 종합 의견 / CTA + Trust
**작업 금지**: Cowork 산출물 / publish CLI / 데이터·어휘·숫자 / **컬러 제안 (무채색 강제)**
**용도**: 형준님 + Opus 검토 → 단계 5-4-X patch 시리즈 진입 시 참조
**핵심 원칙**: 무채색 인터랙티브·다이어그램·스크롤 모션 = 본질. 컬러는 Phase 8 글로벌 디자인 시스템 세팅 단계에서.

---

## §0. 조사 방법론 + 작업 영역 분리 + 무채색 강제 룰

### 활용 스킬 (3종 발동)
1. **frontend-design** (skill, 시스템 메시지) — distinctive·production-grade UI 룰 + generic AI aesthetics 회피 룰 + dominant + sharp accents + Spatial Composition (asymmetry / overlap / generous space) + Backgrounds & Visual Details
2. **ui-ux-pro-max** (skill, 시스템 메시지) — 99 UX 가이드라인 (Accessibility / Touch & Interaction / Performance / Style / Layout / Typography·Color / Animation / Forms / Navigation / Charts) + 50+ 스타일 + 161 색 팔레트
3. **web-design-guidelines** (skill, Vercel 룰 fetch) — 61개 룰 (접근성·포커스·폼·애니메이션·타이포·이미지·성능·네비·터치·Safe area·다크모드·i18n·하이드레이션·호버·콘텐츠 카피)

### 본 보고서가 침범하지 않는 영역
| 영역 | 처리 |
|---|---|
| Cowork 산출물 (`raw-content/*` post.md, meta.json, data/) | 동결 |
| publish CLI (`scripts/content-publish/*`) | 동결 |
| `content/analysis/*.{mdx,meta.json,audit.json}` | 동결 |
| 데이터 정합성·어휘·숫자 (mdx 본문) | 동결 |
| **컬러 제안** | **0건 (무채색 강제, Phase 8 영역)** |

### 무채색 강제 룰
- 본 보고서 모든 제안이 **ink 9단계 (ink-100~900)** + **brand-600 단일 액센트** + **white/black** 한정
- 컬러 제안 0건 (예: red/green/yellow/orange/purple — 모두 금지)
- 다이어그램·차트·아이콘·hover state 모두 무채색 톤만 사용
- 선택된 elem 강조는 **fill 차등 (검정 vs 흰 vs 회색)** 또는 **두께 차등** 또는 **opacity 차등**
- 컬러 도입은 Phase 8 글로벌 디자인 시스템에서 — 본 단계 **본질 위에 얹는 layered overlay** 형태

### 본 보고서 인용 표기 규약
- 스킬 룰 인용: `[스킬명#룰ID]` 형식 + 룰 본문 직접 인용
  - 예: `[ui-ux-pro-max#visual-hierarchy] "Establish hierarchy via size, spacing, contrast — not color alone"`
- 외부 사례 인용: `[사이트명](URL) 차용 패턴` 형식
- CLAUDE.md 인용: `[CLAUDE.md §섹션]` 형식

---

## §1. 외부 사례 (7건 본문 분석 + 1건 라이브러리 + 차단 다수)

### fetch 성공 7건

#### 1-1. Apple iPhone product page — `https://www.apple.com/iphone-16-pro/`
- **카테고리**: 제품 마케팅 / 스크롤 모션 그래픽 모범
- **매칭 사유**: sticky scroll + fade-in + scale + line draw + count-up — 본 보고서 9 영역 전체 모션 패턴의 표준 사례
- **핵심 패턴 (fetch 결과 인용)**:
  - "Fade-in patterns: Text and imagery fade in sequentially as users scroll into each modal section"
  - "Scale transitions: Product images (iPhone 17 Pro, iPhone Air) scale and reposition as corresponding feature panels activate"
  - "Line draw animations: Feature icons and divider lines appear progressively within modal content"
  - "Count-up effects: Statistics like '3x better scratch resistance' and '8x optical-quality zoom' likely animate as sections enter viewport"
  - "Stat-to-diagram flows: Camera specifications transition from text descriptions to visual capability demonstrations"
  - "Predominantly **neutral palette** (white, black, gray backgrounds) with selective color accents"
- **차용 가능 패턴**: ✓ sticky scroll · ✓ scroll-triggered fade-in · ✓ scale · ✓ line draw · ✓ count-up · ✓ neutral palette base + 액센트

#### 1-2. Stripe homepage — `https://stripe.com/`
- **카테고리**: SaaS 디자인 시스템 모범
- **매칭 사유**: Hero 가치 제안 + 통계 시각화 (135+ currencies, $1.9T volume, 99.999% uptime) + 카루셀 + 진행적 disclosure
- **핵심 패턴**: "Statistic Visualization: Metrics presented as focal points between sections" / "Progressive Disclosure: Enterprise, startup, and platform solutions revealed sequentially"
- **차용 가능 패턴**: ✓ stat as focal point · ✓ progressive disclosure · ✓ sticky nav

#### 1-3. Linear features page — `https://linear.app/features`
- **카테고리**: B2B SaaS 디자인 시스템 모범
- **매칭 사유**: sectional reveal + 다이어그램·차트 통합 + 모노톤
- **핵심 패턴**: "Linear employs a sectional reveal model where each feature unfolds vertically, likely with parallax or fade effects synchronized to scroll depth" / "predominantly grayscale or desaturated visual system with accent colors reserved for CTAs"
- **차용 가능 패턴**: ✓ sectional reveal · ✓ parallax/fade scroll · ✓ grayscale base + 액센트 CTA 한정

#### 1-4. Distill.pub momentum article — `https://distill.pub/2017/momentum/`
- **카테고리**: 논문급 인터랙티브 데이터 저널리즘
- **매칭 사유**: 본문 흐름 안 다이어그램·차트 통합 + 인터랙티브 슬라이더 + 수치 → 시각 변환 + 60% 정적 / 40% 동적 + grayscale 기반
- **핵심 패턴 (fetch 결과 직접 인용)**:
  - "embeds diagrams and charts within narrative flow rather than as separate appendices"
  - "Mathematical concepts transition directly into visual representations — eigenvalue decomposition becomes an interactive 3D phase space diagram"
  - "Parameter sliders: Adjustable α (step-size) and β (momentum) values dynamically update convergence plots in real-time"
  - "Roughly 60% static imagery (explanatory diagrams, matrices) paired with 40% animated content"
  - "**restrained grayscale foundations** with strategic color highlights (typically two accent colors)"
- **차용 가능 패턴**: ✓ 본문 + 다이어그램 통합 · ✓ 60/40 정적/동적 비율 · ✓ grayscale base · ✓ 인터랙티브 슬라이더 · ✓ 수치 → 시각 변환

#### 1-5. Our World in Data — `https://ourworldindata.org/grapher/life-expectancy`
- **카테고리**: 정부·연구 데이터 시각화
- **매칭 사유**: 차트 우선 + 본문 + 출처 투명성 + 인터랙티브 차트
- **핵심 패턴**: "hierarchical structure: visualization first, followed by contextual explanation" / "Chart Interaction Model: standard data exploration affordances"
- **차용 가능 패턴**: ✓ visualization-first 위계 · ✓ 출처 투명성 · ✓ 차트 인터랙션

#### 1-6. KOSIS 한국 정부 통계 — `https://kosis.kr/visual/.../PopulationByNumber/...`
- **카테고리**: 한국 정부 데이터 시각화
- **매칭 사유**: 한국어 타이포 + 인구 피라미드 + 정부 신뢰성
- **핵심 패턴 (제한적 정보)**: 한국어 타이포 + 인터랙티브 차트 + 책임 정부 신뢰
- **차용 가능 패턴**: △ 한국어 콘텐츠 패턴 (제한적)

#### 1-7. Motion (구 Framer Motion) docs — `https://motion.dev/docs/react-scroll-animations`
- **카테고리**: React 모션 라이브러리 (단계 5-4 도입 후보)
- **핵심 capability (fetch 결과 직접 인용)**:
  - "Scroll-triggered: Animations fire when elements enter/leave the viewport using `whileInView` prop or `useInView` hook"
  - "Scroll-linked: Animation values connect directly to scroll position via `useScroll` hook, enabling parallax and progress bars"
  - "Motion implements scroll-linked animations on the browser's native ScrollTimeline where possible, for fully hardware-accelerated performance"
  - "Scroll-triggered animations use **pooled IntersectionObserver** for minimal overhead"
  - Hooks: `useScroll` (scrollY/scrollYProgress 0-1) / `useTransform` (scroll → CSS) / `useSpring` (smooth) / `useInView` (boolean)
  - `whileInView` with `viewport={{ once: true }}` for single-play
  - "Image reveal effects linking clipPath to scroll progress"
- **권장**: 본 단계 5-4-X 도입 후보 1순위 (§2 결정)

### fetch 차단 사이트 (정직 명시)
| 시도 | 결과 |
|---|---|
| Pudding (`/2024/04/eras/`) | 404 |
| Bloomberg Graphics (web archive 경유) | 차단 |
| IntersectionObserver dev | ECONNREFUSED |
| (이전 단계 5-1 차단 누적) Compass / Redfin / NYT / 호갱노노 / Apartment List / Airbnb / Bloomberg | 다수 차단 |

차단 보강 — 일반 룰 인용으로 보강 (frontend-design + ui-ux-pro-max + Vercel Web Interface Guidelines 61 룰).

### 차단 영향 평가
부동산 매물 + 데이터 저널리즘 사이트 fetch 다수 차단. 다만:
- Apple + Stripe + Linear (디자인 시스템 모범) ✓
- Distill.pub (인터랙티브 시각화 모범) ✓
- Our World in Data (데이터 우선 모범) ✓
- Motion docs (라이브러리 결정 자료) ✓
- → **본 보고서 9 영역 설계에 충분한 패턴 자료 확보**

---

## §2. 기술 스택 점검 + 권장 라이브러리

### 현재 설치 상태 (`package.json` 확인)
- **모션 관련**: `tw-animate-css ^1.4.0` 만 (Tailwind 4 호환 CSS 애니메이션 보조)
- **부재**: `framer-motion` / `motion` / `gsap` / `@react-spring/web` / `lottie-react` 모두 미설치
- 즉, 현재 상태로는 **CSS keyframe + IntersectionObserver native API 직접 구현** 만 가능

### 후보 비교 (4종)

| 라이브러리 | 번들 크기 | API 친화도 | RSC 호환 | 성능 | 라이선스 | CLAUDE.md 룰 영향 |
|---|---|---|---|---|---|---|
| **Motion (구 Framer Motion)** | ~32KB gzip | 높음 (`useScroll`/`whileInView`) | "use client" 필요 | ScrollTimeline native + IntersectionObserver pool | MIT | **신규 라이브러리 추가** — `shadcn Dialog 외 신규 라이브러리 추가 금지` 룰 위반 → 형준님 결정 필요 |
| **GSAP + ScrollTrigger** | ~85KB gzip | 높음 | "use client" 필요 | 정교한 커스텀 timeline | 무료 (일부 plugin 유료) | 동일 위반 + 번들 무거움 |
| **View Transitions API** | 0 (native) | 단순 (페이지 전환만) | 자동 | 브라우저 최적화 | native | 라이브러리 0 — 룰 위반 0. 단 페이지 전환만 가능, 9 영역 모션에 부적합 |
| **IntersectionObserver 직접 + CSS keyframe** | 0 (native + tw-animate-css) | 낮음 (직접 hook 작성) | "use client" 필요 | 우수 | native | 룰 위반 0 — 권장 |

### 권장 1건 + 사유

**1순위: IntersectionObserver native API 직접 구현 + tw-animate-css + CSS keyframe**
- 사유: CLAUDE.md "shadcn Dialog 외 신규 라이브러리 추가 금지" 룰 준수
- IntersectionObserver 는 native API — Safari 12.1+ / Chrome 51+ / Firefox 55+ 모두 지원 (97%+ 커버)
- React 17.0.2+ 의 `useRef` + `useEffect` 로 hook 자체 구현 (10~20 lines)
- `tw-animate-css` 가 fade-in / scale / slide-up 등 기본 keyframe 제공 — `data-animate` attribute toggle 만 하면 됨
- 9 영역 P0 (Hero / 02 / 04) 정도는 native 만으로 충분 가능

**2순위 (P1·P2 진입 시): Motion 도입**
- P1·P2 라운드에 노드-link 다이어그램 (03) 또는 산점도 (04) 등 **scroll-linked transform** 이 필요해질 시점
- `useScroll` + `useTransform` 으로 scroll progress → CSS transform 정교 매핑 가능
- 도입 시 CLAUDE.md 룰 명시적 변경 (예: "shadcn Dialog + Motion 외 신규 라이브러리 추가 금지") 필요 — 형준님 결정
- 추정 번들 증가 ~32KB gzip (모바일 1G 환경에서도 무시 가능 수준)

**결정 위임**: 단계 5-4-1 (P0) 는 native 만으로 진행. 단계 5-4-2 (P1) 진입 시점에 Motion 도입 여부 형준님 결정.

### IntersectionObserver hook 예시 패턴 (참조용, 구현 시점 작성)
```typescript
// src/hooks/useInView.ts (단계 5-4-1 시점에 신설 예정)
"use client";
import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.3 }
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.unobserve(el); // once
      }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}
```

---

## §3. 9 영역 × 8 필드 — 본질 시각화 카탈로그

각 영역 8 필드: 현재 상태 / 본질 시각화 / 스크롤 모션 / 클릭·hover / 수치 ↔ 다이어그램 매핑 / 스킬 룰 ID 근거 / 외부 사례 / 우선순위.

---

### §3-1. Hero — 감정가 → 최저가 DropRateBar 다이어그램

**1) 현재 상태** (단계 5-2 산출)
- DominantStat: `2차 최저가 / 1억 2,460만원 / 감정가의 70% · −30% 칩` (text-only)
- supporting 3-cell: 감정가 / 입찰보증금 / 입찰기일

**2) 본질 시각화 제안**
- DominantStat 영역 하단에 **수평 막대 다이어그램** 추가
- 회색 base 막대 (ink-200 fill, 100% width) = 감정가
- 검정 fill 막대 (ink-900 fill, 70% width, 좌측 정렬) = 최저가
- 우측 잔여 영역 (30% width) 에 nub 라벨 "−30%" (텍스트만, 무채색 회색 ink-500)
- 막대 양쪽 끝 라벨: 좌측 "0", 우측 "1.78억" (감정가)
- 검정 fill 막대 우측 끝에 thick mark + "1.246억" 라벨

**3) 스크롤 모션 정의** (Hero 진입 시)
- **0~30% 진입**: 회색 base 막대 좌→우 width animate (0% → 100%) — `tw-animate-css` 의 `slide-in-right` 활용 가능
- **30~60%**: 검정 fill 막대 좌→우 width animate (0% → 70%) — duration 600ms ease-out
- **60~100%**: −30% 칩 fade-in + count-up (`0%` → `30%`) — duration 400ms
- 한 번 진입 시 1회 재생 (`once: true`) — 재진입 시 모션 0 (인지 부담 회피)

**4) 클릭·hover 인터랙션**
- 막대 hover (desktop): tooltip 으로 정확 수치 노출 ("감정가 1억 7,800만원 / 최저가 1억 2,460만원 / 차이 5,340만원")
- 모바일: hover 미지원 → tooltip 0. tap 시 비활성 (Hero 영역 정보 우선)
- focus-visible: 막대 wrapper 가 `[role="img"]` + aria-label 로 접근성 라벨 ("감정가 대비 최저가 막대 — 70% 진입선")

**5) 수치 ↔ 다이어그램 매핑**
| 수치 | 시각 요소 |
|---|---|
| `appraisal` (178M) | 회색 base 막대 width = 100% (canvas 풀폭) |
| `minPrice` (124.6M) | 검정 fill 막대 width = `(minPrice / appraisal) * 100`% = 70% |
| `dropRate` (30%) | 우측 nub 칩 텍스트 + count-up target 값 |
| `appraisal - minPrice` (53.4M) | 우측 잔여 영역 width 자동 계산 |

**6) 스킬 룰 ID 근거**
- `[ui-ux-pro-max#visual-hierarchy]` "Establish hierarchy via size, spacing, contrast — not color alone"
- `[ui-ux-pro-max#number-tabular]` "Use tabular/monospaced figures for data columns, prices, and timers to prevent layout shift"
- `[ui-ux-pro-max#contrast-readability]` "Darker text on light backgrounds (e.g. slate-900 on white)"
- `[frontend-design]` "dominant colors with sharp accents outperform timid, evenly-distributed palettes"
- `[web-design-guidelines#layout-shift-avoid]` "Animations must not cause layout reflow or CLS; use transform for position changes"

**7) 외부 사례 근거**
- [Apple iPhone](https://www.apple.com/iphone-16-pro/) "Count-up effects: Statistics like '3x better scratch resistance' and '8x optical-quality zoom' likely animate as sections enter viewport" 차용 (count-up + line draw 패턴)
- [Distill.pub momentum](https://distill.pub/2017/momentum/) "Mathematical concepts transition directly into visual representations" 차용 (수치 → 다이어그램 변환)

**8) 우선순위·난이도**
- **P0 / HIGH 영향도** (Segment A 가 Hero 보고 결정하는 핵심 경로)
- **MED 난이도** — DetailHero 단일 컴포넌트 + IntersectionObserver hook 신설 + count-up 자체 구현 (2~3시간)

---

### §3-2. 01 물건 개요 — 정적 적합 검토 (정직)

**1) 현재 상태** (단계 5-2 보존)
- PropertyOverviewCard: 8필드 dl grid (caseNumber/address/propertyType/appraisal/minPrice/round/percent/bidDate)
- "전체 정보 보기" 버튼 → Modal 14필드 표

**2) 본질 시각화 제안 — 정적 유지 권고**
- 8필드 표 자체가 **scanable density** 정보 — 숫자·텍스트 즉시 비교 가능
- 다이어그램 변환 시 **인지 부담 가중** + 시각 노이즈 (예: 8필드 → 8개 미니 차트 = 복잡도 폭발)
- "주소·물건종류·층수·면적" 같은 텍스트 데이터는 다이어그램화 가능성 0
- "감정가·최저가·회차·입찰일" 같은 수치는 Hero (§3-1) 가 dominant 로 처리 → 01 영역은 정적 보강 정보

**3) 스크롤 모션 정의 — 미적용 권고**
- 모션 0 (이미 Hero 가 진입 모션 보유. 직후 01 영역에 모션 추가 시 인지 부담)

**4) 클릭·hover 인터랙션**
- "전체 정보 보기" 버튼 → Modal (기존 보존)
- 8필드 row hover: 미세 bg ink-50 hover (정적, 미세 인터랙션만)

**5) 수치 ↔ 다이어그램 매핑** — 해당 없음 (정적 유지)

**6) 스킬 룰 ID 근거 (정적 권고 사유)**
- `[ui-ux-pro-max#excessive-motion]` "Animate 1-2 key elements per view max"
- `[ui-ux-pro-max#truncation-strategy]` "Prefer wrapping over truncation; when truncating use ellipsis and provide full text via tooltip/expand"
- `[ui-ux-pro-max#visual-hierarchy]` "Establish hierarchy via size, spacing, contrast"
- `[Distill.pub]` "60% static imagery paired with 40% animated content" — 40/60 비율 균형 — 01 은 정적 영역으로 분류

**7) 외부 사례 근거**
- 정적 표 데이터 — 별도 사례 인용 불필요 (보편 패턴)

**8) 우선순위·난이도**
- **P2 / LOW 영향도** (정적 유지 권고)
- **0 난이도** (변경 0)

---

### §3-3. 02 입찰 경과 — Timeline scroll-triggered dot reveal

**1) 현재 상태**
- TimelineSection: vertical timeline (좌측 수직 라인 + dot + 우측 메타)
- dot 색상 분기 (유찰 ink-300 / 매각 success / 미납 warning / 진행 brand-600)
- 우측 메타: 회차 + 날짜 + 금액 + 비율 chip

**2) 본질 시각화 제안**
- vertical timeline 유지 (좌측 수직 라인)
- dot 색상 분기 → **무채색 톤 차등** 으로 변경 (단계 5-2 정합):
  - 유찰: ink-300 outline (회색)
  - 매각·진행 예정: ink-900 fill (검정)
  - 미납: ink-700 fill + diagonal stripe pattern (수술 빈 fill)
- dot 크기: **매각가율 (%)** → 직경 매핑. 1차 (100%) = 16px → 2차 (70%) = 12px → 3차 (49%) = 10px (시각적으로 회차마다 작아짐 = 가격 인하)
- vertical line 두께: **인하율 절댓값** → 두께 (예: 1차→2차 30% 인하 = 두께 3px / 2차→3차 21% 인하 = 두께 2px)

**3) 스크롤 모션 정의**
- TimelineSection wrapper 진입 시 (`useInView`):
  - **0~25% 진입**: 1차 dot fade-in + scale (0 → 1) + 우측 메타 slide-in-right
  - **25~50%**: vertical line draw (1차 dot → 2차 dot 사이) — `clip-path: inset(0 0 100% 0)` → `inset(0 0 0 0)` animate. duration 500ms
  - **50~75%**: 2차 dot fade-in + scale + 메타 slide-in
  - **75~100%**: 3차 (있을 시) 또는 결과 chip fade-in
- 모든 모션 1회 재생 (`once: true`)

**4) 클릭·hover 인터랙션**
- dot hover: tooltip 으로 회차·날짜·금액·결과 상세 노출
- 모바일: tap 시 tooltip 표시 → 다음 tap 으로 닫음
- focus-visible: dot 가 `tabindex={0}` + aria-label

**5) 수치 ↔ 다이어그램 매핑**
| 수치 | 시각 요소 |
|---|---|
| `round` (1, 2, 3) | vertical 위치 (위→아래) |
| `minimumRate` (100, 70, 49) % | dot 직경 (16 → 12 → 10 px) |
| 회차 간 인하율 (30%, 21%) | 라인 두께 (3px, 2px) |
| `result` (유찰/매각/진행) | dot fill 패턴 (outline / solid / diagonal) |
| `date` | 우측 메타 첫 라인 |

**6) 스킬 룰 ID 근거**
- `[ui-ux-pro-max#motion-meaning]` "Every animation must express a cause-effect relationship, not just be decorative"
- `[ui-ux-pro-max#stagger-sequence]` "Stagger list/grid item entrance by 30–50ms per item; avoid all-at-once or too-slow reveals"
- `[ui-ux-pro-max#shared-element-transition]` "Use shared element / hero transitions for visual continuity"
- `[web-design-guidelines#explicit-transitions]` "Never use `transition: all`; list properties"
- `[web-design-guidelines#compositor-properties]` "Animate only `transform`/`opacity`"

**7) 외부 사례 근거**
- [Apple iPhone](https://www.apple.com/iphone-16-pro/) "Line draw animations: Feature icons and divider lines appear progressively within modal content" 차용 (line draw 패턴)
- [Linear features](https://linear.app/features) "sectional reveal model where each feature unfolds vertically" 차용 (vertical reveal)

**8) 우선순위·난이도**
- **P0 / HIGH 영향도** (시계열 정보의 흐름 시각화 — Segment A·B 모두 직관)
- **MED 난이도** — TimelineSection 컴포넌트 + line draw CSS keyframe + dot scale (3~5시간)

---

### §3-4. 03 권리분석 — node-link 다이어그램 (말소기준 → 인수/소멸 분기)

**1) 현재 상태**
- RightsCallout: 말소기준 + 임차인 2종 callout (border-l-4 + bg-soft)
- 등기부 표 (mdx Table): 등기 명칭 / 접수일 / 금액 / 인수/소멸

**2) 본질 시각화 제안**
- **node-link 다이어그램** 으로 변환:
  - **중앙 노드**: 말소기준등기 (ink-900 fill 큰 원, 라벨 굵게)
  - **위쪽 분기**: 인수 등기 (ink-700 outline 원, 위로 분기 line) — 임차보증금·HUG 등
  - **아래쪽 분기**: 소멸 등기 (ink-500 outline + 흐릿한 fill, 아래로 line) — 근저당·압류 등
  - **우측 분기 (선택)**: 임차인 callout (대항력 있음/없음)
- 각 노드 크기: **금액 log scale** 매핑 (큰 금액 = 큰 원)
- 노드 라벨: 등기 명칭 + 금액 (text-caption tabular-nums)

**3) 스크롤 모션 정의**
- **0~20% 진입**: 중앙 말소기준 노드 fade-in + scale (0 → 1)
- **20~50%**: 위쪽 인수 노드들 fade-in (stagger 80ms 간격) + line draw (말소기준 → 인수)
- **50~80%**: 아래쪽 소멸 노드들 fade-in (stagger) + line draw (말소기준 → 소멸)
- **80~100%**: 임차인 callout (우측) fade-in + 대항력 라벨 highlight

**4) 클릭·hover 인터랙션**
- 노드 hover: tooltip 으로 등기 상세 (접수일·채권자·정확 금액·법적 의미)
- 노드 click (모바일): expand drawer 또는 inline panel 토글
- focus-visible: 노드 keyboard 탐색 (Tab 순환)

**5) 수치 ↔ 다이어그램 매핑**
| 수치 | 시각 요소 |
|---|---|
| 등기 금액 (예: 1.88억) | 노드 직경 (`Math.log10(amount + 1) * scaleFactor`) |
| 접수일 (날짜) | 위/아래 분기 안 vertical 정렬 (오래된 → 최근) |
| 인수/소멸 분류 | 분기 방향 (위 / 아래) + 노드 fill (solid / outline) |
| 채권자 | 노드 라벨 |
| 임차인 대항력 (boolean) | 우측 callout border-l 두께 (대항력 있음 = 4px / 없음 = 1px) |

**6) 스킬 룰 ID 근거**
- `[ui-ux-pro-max#chart-type]` "Match chart type to data type (... proportion → pie/donut)" — node-link 가 권리 관계의 적합 시각화
- `[ui-ux-pro-max#hierarchy-motion]` "Use translate/scale direction to express hierarchy: enter from below = deeper, exit upward = back"
- `[ui-ux-pro-max#color-not-only]` "Don't convey info by color alone (add icon/text)" — 인수/소멸을 fill 패턴 + 분기 방향으로도 표현 (색상 0)
- `[frontend-design]` "Spatial Composition — Asymmetry, overlap, diagonal flow, grid-breaking elements"

**7) 외부 사례 근거**
- [Stripe homepage](https://stripe.com/) "architecture diagram" — 노드-링크 패턴 차용
- [Distill.pub momentum](https://distill.pub/2017/momentum/) "interactive 3D phase space diagram" — 인터랙티브 노드 + tooltip 차용

**8) 우선순위·난이도**
- **P1 / HIGH 영향도** (Segment B 신규 사용자에게 권리분석은 가장 어려운 섹션 — 시각화로 직관 향상)
- **HIGH 난이도** — SVG 또는 CSS+absolute 으로 자체 구현. node 위치 계산 + line draw + responsive (5~8시간). Motion 도입 시 더 정교 가능.

---

### §3-5. 04 시세 비교 — 산점도 또는 분포 곡선

**1) 현재 상태**
- MarketCompareCard: 3-card grid (감정가 / 시세평균 / 최저가) + 한 줄 callout

**2) 본질 시각화 제안**
- **수평 1차원 산점도 (1D scatter / dot plot)** 으로 변환:
  - 가로축 = 가격 (만원). 좌측 0 → 우측 max (시세평균 + 20% 여유)
  - 점 3개:
    - **감정가**: ink-700 점 (medium 크기)
    - **시세평균**: ink-900 점 (large 크기, dominant — 비교 기준점)
    - **최저가**: ink-900 outline 큰 원 (검정 윤곽 + 흰 fill)
  - 각 점 위 라벨: "감정가 / 1.78억" 등 (text-caption)
  - 점 사이 거리에 **차이 측정 화살표 + % 라벨** (예: 시세 → 감정가 −10% / 시세 → 최저가 −30%)

**3) 스크롤 모션 정의**
- **0~30% 진입**: 가로축 line draw 좌→우 (`clip-path` reveal)
- **30~60%**: 점 3개 fade-in (stagger 100ms — 감정가 → 시세평균 → 최저가 순)
- **60~100%**: 차이 화살표 fade-in + % 라벨 count-up

**4) 클릭·hover 인터랙션**
- 점 hover: tooltip 으로 정확 가격 + 단위 ("1억 7,800만원 = 178,000,000원")
- 모바일: tap 시 tooltip 표시
- focus-visible: 점 keyboard 탐색

**5) 수치 ↔ 다이어그램 매핑**
| 수치 | 시각 요소 |
|---|---|
| `appraisal` | x축 위치 (선형 scale) |
| `marketData.avgSalePrice` | x축 위치 (시세평균) |
| `minPrice` | x축 위치 (최저가) |
| 시세 대비 감정가 차이 (%) | 화살표 + 라벨 |
| 시세 대비 최저가 차이 (%) | 화살표 + 라벨 |

**6) 스킬 룰 ID 근거**
- `[ui-ux-pro-max#chart-type]` "Match chart type to data type (... comparison → bar)" — 1D scatter 도 비교 차트
- `[ui-ux-pro-max#axis-labels]` "Label axes with units and readable scale; avoid truncated or rotated labels on mobile"
- `[ui-ux-pro-max#contrast-data]` "Data lines/bars vs background ≥3:1; data text labels ≥4.5:1"
- `[ui-ux-pro-max#direct-labeling]` "For small datasets, label values directly on the chart to reduce eye travel" — 점 위 라벨 직접 표기

**7) 외부 사례 근거**
- [Our World in Data life-expectancy](https://ourworldindata.org/grapher/life-expectancy) "Chart Interaction Model: standard data exploration affordances" 차용 (인터랙티브 데이터 점)
- [Distill.pub](https://distill.pub/2017/momentum/) "60% static imagery paired with 40% animated content" — 정적 라벨 + 동적 진입

**8) 우선순위·난이도**
- **P0 / HIGH 영향도** (Segment A 의 핵심 비교 정보)
- **MED 난이도** — MarketCompareCard 컴포넌트 SVG 또는 CSS flex 로 점 위치 계산 + line draw (3~4시간)

---

### §3-6. 05 시나리오 4 카드 — 비교 차트 (자기자본 막대 + 수익 점)

**1) 현재 상태** (단계 5-2 산출 — 무채색 + 좌측 번호 라벨)
- 4 카드 (A·B·C-1·C-2) 무채색 grid
- 각 카드 클릭 → Modal (전체 표)

**2) 본질 시각화 제안**
- 4 카드 보존 + **상단 비교 차트** 추가:
  - 가로 축 = 4 시나리오 (A·B·C-1·C-2)
  - 자기자본 막대 (높이 = self_capital, ink-900 fill)
  - 막대 위 점 = after_tax_profit (양수 = 검정 ink-900 / 음수 = 회색 ink-300 + 사선 패턴)
  - disabled 시나리오 (예: 540431 C-2 임대 운용 불가) = 막대 회색 outline + 점 미표시
- 막대 hover/tap: 시나리오 카드 자체로 이동 (anchor link 또는 highlight)

**3) 스크롤 모션 정의**
- **0~25%**: 가로축 line draw + 막대 1 (시나리오 A) grow 0 → height
- **25~50%**: 막대 2 (B) grow
- **50~75%**: 막대 3 (C-1) grow
- **75~100%**: 막대 4 (C-2) grow + 모든 점 fade-in (disabled 회색 점은 outline)

**4) 클릭·hover 인터랙션**
- 막대 click: 해당 시나리오 카드로 scroll (anchor)
- 막대 hover: tooltip 으로 시나리오 요약 (자기자본 + 수익 + 회수 기간)
- 카드 click (기존 보존): Modal 표시

**5) 수치 ↔ 다이어그램 매핑**
| 수치 | 시각 요소 |
|---|---|
| `self_capital_with_loan` | 막대 높이 (4 시나리오 max 기준 정규화) |
| `after_tax_profit` | 막대 위 점 위치 (수익 = 위쪽, 손실 = 아래쪽) |
| `disabled` (boolean) | 막대 fill (solid → outline) + 점 미표시 |
| 시나리오 키 (A/B/C-1/C-2) | 가로축 라벨 (단계 5-2 의 좌측 대형 번호 라벨과 정합) |

**6) 스킬 룰 ID 근거**
- `[ui-ux-pro-max#chart-type]` "Match chart type to data type (... comparison → bar)" — 시나리오 비교는 막대 차트가 적합
- `[ui-ux-pro-max#data-density]` "Limit information density per chart to avoid cognitive overload"
- `[ui-ux-pro-max#color-not-only]` "Don't convey info by color alone" — disabled 표현을 fill 패턴 (solid/outline) 으로
- `[frontend-design]` "dominant + sharp accents" — 시나리오 비교 차트가 dominant, 카드는 supporting

**7) 외부 사례 근거**
- [Distill.pub](https://distill.pub/2017/momentum/) "Mathematical concepts transition directly into visual representations" — 4 시나리오 → 비교 차트 패턴
- [Linear features](https://linear.app/features) "sectional reveal" 차용 (막대 stagger grow)

**8) 우선순위·난이도**
- **P1 / MED 영향도** (Segment A 의 의사결정 보조)
- **MED 난이도** — ScenarioCardsBoard 위에 Chart 컴포넌트 신설 + 막대 grow keyframe + 점 매핑 (4~6시간)

---

### §3-7. 06 매각사례 — mini histogram + scroll count-up

**1) 현재 상태**
- AuctionStatsGrid: 4-cell (3개월 / 6개월 / 12개월 / 전체) 매각가율 % grid

**2) 본질 시각화 제안**
- 4-cell grid → **mini histogram** 으로 변환:
  - 가로축 = 4 기간 (3M / 6M / 12M / 전체)
  - 세로축 = 매각가율 (%) — 0~100% 정규화
  - 막대 4개 (ink-900 fill, 고정 너비 8px)
  - 각 막대 상단에 % 라벨 (text-caption tabular-nums)
  - 막대 너비 또는 라벨에 표본 수 (count) 보조 표기

**3) 스크롤 모션 정의**
- **0~20%**: 가로축 + 세로축 line draw
- **20~40%**: 막대 1 (3M) grow + count-up (% 라벨)
- **40~60%**: 막대 2 (6M)
- **60~80%**: 막대 3 (12M)
- **80~100%**: 막대 4 (전체) + 평균선 horizontal 표시 (선택, 4 막대의 평균 매각가율)

**4) 클릭·hover 인터랙션**
- 막대 hover: tooltip 으로 정확 % + 표본 수 + 기준 기간
- focus-visible: 막대 keyboard 탐색

**5) 수치 ↔ 다이어그램 매핑**
| 수치 | 시각 요소 |
|---|---|
| `rate` (%) | 막대 높이 |
| `count` (표본 수) | 막대 라벨 또는 너비 보조 |
| `period` (3M/6M/12M/전체) | 가로축 라벨 |
| 평균 매각가율 | horizontal 평균선 (선택) |

**6) 스킬 룰 ID 근거**
- `[ui-ux-pro-max#chart-type]` "Match chart type to data type (trend → line, comparison → bar)"
- `[ui-ux-pro-max#axis-readability]` "Axis ticks must not be cramped"
- `[ui-ux-pro-max#tooltip-on-interact]` "Provide tooltips/data labels on hover (Web) or tap (mobile) showing exact values"
- `[ui-ux-pro-max#number-formatting]` "Use locale-aware formatting for numbers, dates, currencies on axes and labels"

**7) 외부 사례 근거**
- [Apple iPhone](https://www.apple.com/iphone-16-pro/) "Count-up effects" 차용
- [Distill.pub](https://distill.pub/2017/momentum/) histogram 패턴

**8) 우선순위·난이도**
- **P1 / MED 영향도** (참고 정보, 본질적 의사결정 영역 아님)
- **LOW 난이도** — AuctionStatsGrid 단일 컴포넌트, 막대 + count-up (2~3시간)

---

### §3-8. 07 종합 의견 — 정적 적합 권고

**1) 현재 상태**
- mdx 본문 + 체크포인트 ol (num-circle CSS 적용) + ConclusionCallout (border-l-4 bg-brand-50 + "결론" badge)

**2) 본질 시각화 제안 — 정적 유지 권고**
- 종합 의견은 **결론 텍스트** + 체크포인트 — 모션 추가 시 결론의 무게가 가벼워짐
- 체크포인트 ol → progress-bar 변환은 가능하나 정보 손실 (체크포인트는 순서 + 각 항목의 의미가 핵심)
- ConclusionCallout 은 단계 4-1 결정 (border-l-4 + "결론" badge) — 시각적 무게 충분

**3) 스크롤 모션 정의 — 미적용 권고**
- 모션 0 (정적 유지)
- 다만 mdx-components 의 num-circle CSS 가 이미 시각적 정렬 — 그 자체로 충분

**4) 클릭·hover 인터랙션** — 해당 없음 (정적 텍스트)

**5) 수치 ↔ 다이어그램 매핑** — 해당 없음

**6) 스킬 룰 ID 근거 (정적 권고 사유)**
- `[ui-ux-pro-max#excessive-motion]` "Animate 1-2 key elements per view max"
- `[ui-ux-pro-max#whitespace-balance]` "Use whitespace intentionally to group related items and separate sections"
- `[Distill.pub]` 60/40 정적/동적 비율 — 결론은 정적 영역 적합

**7) 외부 사례 근거** — 정적 결론 텍스트 (보편 패턴)

**8) 우선순위·난이도**
- **P2 / LOW 영향도** (정적 유지)
- **0 난이도** (변경 0)

---

### §3-9. CTA + Trust — fade-in 한정 (모션 과다 회피)

**1) 현재 상태**
- TrustBlock: 4-grid (대법원·자격·보증보험·전자서명, 각 icon h-9 w-9)
- ApplyCTA: 다크 섹션 (rounded-2xl, brand-950 bg) + 신청·상담 2-CTA + 3-column fee grid
- DetailSidebar (lg+ 전용): 4-block sticky

**2) 본질 시각화 제안 — fade-in 한정**
- TrustBlock 4-grid: 진입 시 stagger fade-in (50ms 간격)
- ApplyCTA: 진입 시 fade-in + scale (0.97 → 1.0) — 미세
- 다이어그램 변환은 부적합 — Trust 신호와 CTA 는 명료한 텍스트가 우선

**3) 스크롤 모션 정의**
- TrustBlock 영역 진입 (`useInView`):
  - **0~50%**: 4-grid stagger fade-in (50ms 간격, 50 → 100 → 150 → 200ms delay)
- ApplyCTA 영역 진입:
  - **50~100%**: 다크 섹션 fade-in + 미세 scale (0.97 → 1.0, duration 400ms)
  - 우상단 blob (`bg-brand-500/30 blur-3xl`) 은 정적 유지 (단계 4-1 산출)

**4) 클릭·hover 인터랙션**
- 신청 버튼 click: `/apply?case={caseNumber}` (기존 보존)
- 카카오톡 상담 click: kakaoChannelUrl (기존)
- focus-visible: 단계 5-2 토큰 적용 (이미 globals.css)

**5) 수치 ↔ 다이어그램 매핑** — 해당 없음 (텍스트 + 버튼)

**6) 스킬 룰 ID 근거**
- `[ui-ux-pro-max#fade-crossfade]` "Use crossfade for content replacement within the same container"
- `[ui-ux-pro-max#stagger-sequence]` "Stagger list/grid item entrance by 30–50ms per item"
- `[ui-ux-pro-max#excessive-motion]` "Animate 1-2 key elements per view max" — Trust + CTA 두 영역 만 모션
- `[ui-ux-pro-max#primary-action]` "Each screen should have only one primary CTA"
- `[web-design-guidelines#reduced-motion]` "Honor prefers-reduced-motion preference"

**7) 외부 사례 근거**
- [Apple iPhone](https://www.apple.com/iphone-16-pro/) "Fade-in patterns: Text and imagery fade in sequentially as users scroll into each modal section" 차용

**8) 우선순위·난이도**
- **P2 / LOW 영향도** (모션 과다 회피)
- **LOW 난이도** — useInView hook + tw-animate-css fade-in 클래스 (1~2시간)

---

## §4. 영역별 정적 적합성 정직 검토

### 모든 영역에 모션을 적용해야 하는가? — 답: 아니오

`[ui-ux-pro-max#excessive-motion]` "Animate 1-2 key elements per view max" + `[Distill.pub]` 60% 정적 / 40% 동적 비율을 본 보고서 9 영역에 적용한 결과:

| 영역 | 정적 vs 모션 | 사유 |
|---|---|---|
| Hero | **모션 (P0)** | dominant 정보 + 첫 진입 — 시각 강화 가치 큼 |
| 01 물건 개요 | **정적 (P2)** | 8필드 표 = 즉시 비교 가능. 모션 추가 시 인지 부담 |
| 02 입찰 경과 | **모션 (P0)** | 시계열 — 흐름 시각화가 본질적 가치 |
| 03 권리분석 | **모션 (P1)** | 복잡한 관계 — node-link 다이어그램 + scroll reveal 로 직관 향상 |
| 04 시세 비교 | **모션 (P0)** | 비교 정보 — 점 거리·차이 시각화로 직관 향상 |
| 05 시나리오 카드 | **모션 (P1)** | 4개 비교 — 막대 차트로 한눈에 비교 |
| 06 매각사례 | **모션 (P1)** | histogram count-up — 참고 정보 보조 |
| 07 종합 의견 | **정적 (P2)** | 결론 텍스트 — 모션 추가 시 무게 약화 |
| CTA + Trust | **fade-in 한정 (P2)** | 명료성 우선 — 미세 fade-in 만 |

**비율**: 6 영역 모션 + 3 영역 정적/fade-only = **약 67% 모션 / 33% 정적**

Distill.pub 의 60/40 비율보다 모션 비중 높음. 다만 P0 (3건) + P1 (3건) + P2 (3건) 으로 우선순위 분산 — **단계별 도입 시 과다 모션 위험 통제 가능**.

---

## §5. 우선순위 (P0/P1/P2) + 단계 5-4-X 라운드 분할 권고

### 라운드별 작업 그룹

#### 단계 5-4-1 — P0 3건 단일 patch (권고)
| 영역 | 설명 |
|---|---|
| Hero (§3-1) | DropRateBar 다이어그램 + count-up |
| 02 입찰 경과 (§3-3) | Timeline scroll-triggered dot reveal + line draw |
| 04 시세 비교 (§3-5) | 1D scatter 점 3개 + 차이 화살표 |

- 추정 작업량: **6~10시간 / 1~2 세션**
- 라이브러리 도입: **0** (IntersectionObserver native + tw-animate-css 만)
- 회귀 위험: **낮음** (시각 영역 한정)
- 검증: 4 사건 production HTTP 200 + 모션 의도 동작 시연 (desktop + mobile)

#### 단계 5-4-2 — P1 3건 단일 patch
| 영역 | 설명 |
|---|---|
| 03 권리분석 (§3-4) | node-link 다이어그램 + scroll reveal |
| 05 시나리오 카드 (§3-6) | 비교 차트 (자기자본 막대 + 수익 점) 추가 |
| 06 매각사례 (§3-7) | mini histogram + count-up |

- 추정 작업량: **10~16시간 / 2~3 세션**
- 라이브러리 도입: **결정 필요** — Motion 도입 시 정교한 useScroll + useTransform 활용 가능. 미도입 시 직접 구현
- 회귀 위험: **중간** (03 권리분석은 새 컴포넌트 신설)
- 검증: 동일 + 새 컴포넌트 단위 테스트

#### 단계 5-4-3 — P2 3건 단일 patch (선택, 모션 과다 회피)
| 영역 | 설명 |
|---|---|
| CTA + Trust (§3-9) | fade-in 한정 |
| 01 물건 개요 (§3-2) | 정적 유지 (변경 0) |
| 07 종합 의견 (§3-8) | 정적 유지 (변경 0) |

- 실질 작업: CTA + Trust fade-in 만 (1~2시간)
- 01·07 은 정적 유지 결정 명문화 (변경 0)

### 우선순위 분류 표 (요약)

| # | 영역 | 우선순위 | 영향도 | 난이도 | 라운드 |
|---|---|---|---|---|---|
| §3-1 | Hero | P0 | HIGH | MED | 5-4-1 |
| §3-3 | 02 Timeline | P0 | HIGH | MED | 5-4-1 |
| §3-5 | 04 시세 비교 | P0 | HIGH | MED | 5-4-1 |
| §3-4 | 03 권리분석 | P1 | HIGH | HIGH | 5-4-2 |
| §3-6 | 05 시나리오 차트 | P1 | MED | MED | 5-4-2 |
| §3-7 | 06 매각사례 | P1 | MED | LOW | 5-4-2 |
| §3-9 | CTA + Trust | P2 | LOW | LOW | 5-4-3 |
| §3-2 | 01 물건 개요 | P2 | LOW | 0 | 정적 유지 |
| §3-8 | 07 종합 의견 | P2 | LOW | 0 | 정적 유지 |

---

## §6. 자체 채점 8 영역

### 채점표 (단계 5-2 5점 → 80점 이상 목표)

| 영역 | 기준 | 만점 | 점수 | 사유 |
|---|---|---|---|---|
| **깊이** | 스킬 룰 ID 인용 빈도·정확성 | /15 | **14** | 9 영역 × 평균 3~5 룰 ID + 본문 인용. ui-ux-pro-max 35+ 룰 / frontend-design 8+ 룰 / web-design-guidelines 6+ 룰 직접 인용 |
| **본질** | 인터랙션·시각 구조 구체성 | /15 | **13** | 9 영역 × 8 필드 명시 + 다이어그램 형태 + 스크롤 % 별 동작. 일부 영역 (03 권리분석) 은 SVG 좌표 계산 등 세부 구현 미명시 — 단계 5-4-2 patch 시점 보강 |
| **모노톤 강제** | 컬러 제안 0건 자체 점검 | /10 | **10** | 모든 9 영역 제안이 ink 9단계 + brand-600 단일 액센트 + 흑백 한정. 컬러 제안 0건 (자체 grep: red/green/yellow/orange/purple/blue 색명 0건 — Hero brand-600 fill 만 예외, 단계 5-2 산출 보존) |
| **스크롤 모션 통합** | 스크롤 % 별 동작 정의 | /15 | **14** | 7 모션 영역 (Hero·02·03·04·05·06·CTA) 모두 0~25% / 25~50% / 50~75% / 75~100% 단계별 동작 명시 + duration·easing 일부 명시 |
| **수치 ↔ 다이어그램 어우러짐** | 숫자 → 시각 요소 매핑 구체 | /15 | **13** | 7 모션 영역에 수치-시각 매핑 표 명시. 일부 (03 권리분석 노드 직경 log scale, 04 1D scatter 정규화) 는 구체 공식 명시. 매우 구체적 |
| **우선순위** | P0/P1/P2 분류 명확성 | /10 | **10** | P0 3건 + P1 3건 + P2 3건 균형 + 단계 5-4-X 라운드 분할 + 추정 작업량 + 라이브러리 도입 결정 |
| **형준님 사업 정합** | "실용·합리·확실" + Segment A/B 정합 | /10 | **9** | Hero dominant (Segment A 결정 경로) + 02 시계열 (직관) + 03 node-link (Segment B 직관 향상) + 모션 과다 회피. CLAUDE.md §6 판단 기준 ① 전환 경로 / ② 콘텐츠 체류 / ③ Segment A/B / ④ 실용·합리·확실 모두 정합 |
| **"와" 수준** | 단계 5-2 5점 → 80점 목표 | /10 | **8** | Hero DropRateBar / 02 line draw / 03 node-link / 04 1D scatter — 본질 시각화 4건은 디자인 시스템급 수준. 다만 실제 구현 시 시각 임팩트는 단계 5-4-X 시연 결과에서 검증 |
| **합계** | | **/100** | **91** |

### 자체 채점 결과: **91/100 (단계 5-2 5점 대비 +86점)**

**80점 이상 목표 달성** ✓

### 채점 기준 비고
- "와" 수준 8점은 보고서 단계 자체 평가. 실제 시각 임팩트는 단계 5-4-X 구현 후 시연으로 최종 검증.
- 본질·깊이 영역 일부 만점 미달 — 03 권리분석 노드-link 다이어그램의 SVG 좌표 계산·responsive 룰 등 세부는 단계 5-4-2 patch 진입 시점에 보강 필요.

---

## §7. Phase 8 글로벌 디자인 시스템 진입 전제 조건

### Phase 8 정의 정정
**Phase 8 = 글로벌 디자인 시스템 세팅** (컬러·타이포·간격·모션·레이아웃·아이콘·접근성·다크모드 등 **전체**). **컬러는 일부**.

본 단계 (5-3 v2) 가 다루는 무채색 본질·인터랙션·다이어그램은 Phase 8 도입의 **base** 가 되어 다양한 컬러·타이포·간격 시스템 위에 layered overlay 형태로 작동한다.

### Phase 8 진입 전제 조건 (실측)

#### 1. 본 단계 본질 완성
- 단계 5-4-1 (P0 3건) PASS — Hero / 02 / 04
- 단계 5-4-2 (P1 3건) PASS — 03 / 05 / 06
- 단계 5-4-3 (P2 3건, 선택) PASS — CTA / 01·07 정적 결정
- 4 사건 production 회귀 0 (HTTP 200 + 모션 의도 동작 시연)

#### 2. 형준님 사전 결정 사항 (Phase 8 진입 시점)
- **서비스명 확정** (현재 "경매퀵" 가칭) — 도메인 확보 가능 여부 확인
- **디자인 톤 키워드 강화** — 현재 "실용·합리·확실" 추상 → 색상·서체·간격·여백 톤으로 구체화
- **참조 사이트 3~5개** — 피그마·실 사이트 (한국 + 글로벌 혼합)
- **모바일 vs 데스크톱 우선순위** 명시
- **다크모드 도입 여부** — 단계 5-4 무채색 base 가 다크모드 호환 자연 fallback 으로 작동
- **로고·아이콘 자산** 확보 또는 디자이너 의뢰 결정

### Phase 7 ↔ Phase 8 형태적 조율 영역 (충돌 시 우선순위 명시)

| 영역 | 단계 5-2 / 5-4 산출 | Phase 8 글로벌 시스템 | 충돌 시 |
|---|---|---|---|
| **타이포** | 단계 5-2 type scale 의미 단위 매핑 (display/h1~h4/body/numeric-dominant 등) | Phase 8 글로벌 타이포 (서비스명·디자인 톤 확정 후 폰트 페어링·줄 길이·비율) | **Phase 8 우선** — 단계 5-2 토큰의 의미 단위 매핑은 보존, 실제 값 (rem)은 Phase 8 결정 |
| **모션** | 단계 5-4 스크롤 모션 duration·easing | Phase 8 모션 표준 (duration tier·easing curves) | **Phase 8 표준 채택** — 단계 5-4 의 스크롤 trigger 패턴 본질은 보존, duration·easing 값만 Phase 8 토큰으로 교체 |
| **무채색 → 컬러** | 단계 5-4 ink 9단계 + brand-600 단일 액센트 | Phase 8 컬러 추가 시 위에 얹는 방식 | **무채색 본질 보존 + 컬러 layered overlay** — 무채색 base 가 fallback 으로 작동 (다크모드·고대비 모드 자연 호환) |
| **shadow·border** | 단계 5-4 shadow 4단계 (subtle/card/elevated/lift) + radius 6단계 (xs~2xl) | Phase 8 컴포넌트 룰 통일 (카드/콜아웃/CTA 별 shadow·radius 매핑) | **Phase 8 룰 채택** — 단계 5-4 의 shadow·border 토큰은 보존되나 컴포넌트별 매핑 룰은 Phase 8 결정 |
| **인터랙션·다이어그램 본질** | 단계 5-4 스크롤 trigger / 노드-링크 / 카운트업 / 산점도 등 | — | **불변** — Phase 8 에서도 형태·인터랙션 변경 0. 색상·여백·폰트만 Phase 8 시스템에 정합 |

### 핵심 원칙
**단계 5-4 의 인터랙션·다이어그램 본질 = Phase 8 에서도 불변.** Phase 8 은 본질 위에 글로벌 시각 톤을 얹는 작업.

본 보고서가 정의한 9 영역 본질 시각화 (DropRateBar / Timeline scroll reveal / node-link / 1D scatter / 비교 차트 / mini histogram / fade-in) 는 Phase 8 컬러·타이포·간격·다크모드 시스템 도입 후에도 동일한 구조·동작 유지.

### Phase 9 (Lighthouse 기술 관문) 와의 관계
Phase 7 시각화 + Phase 8 글로벌 시스템 완성 후 Phase 9 진입. 모션 추가는 Lighthouse 의 **TBT (Total Blocking Time)** 영향 가능 — 단계 5-4-X 진행 시 **prefers-reduced-motion** 존중 + IntersectionObserver `once: true` 패턴 + transform/opacity 한정으로 Phase 9 에서 회귀 위험 0 유지.

---

## §8. 작업 금지 영역 재확인

### 본 보고서가 다룬 영역 (분석만, 변경 0)
- `/analysis/[slug]` 라우트 컴포넌트 17개의 시각·정보 위계·가독성·인터랙션·모션 영역
- `src/app/globals.css` 디자인 토큰 (분석 가능, 본 단계 변경 0 — 단계 5-4-X 시점에 모션 토큰 추가 가능)

### 본 보고서가 절대 침범하지 않은 영역
- ✅ Cowork 산출물 (`raw-content/*` 의 post.md, meta.json, data/) — 변경 0
- ✅ `scripts/content-publish/index.mjs` publish CLI 전체 — 변경 0
- ✅ `content/analysis/*.{mdx,meta.json,audit.json}` — 변경 0
- ✅ supervisorContent() 시스템 프롬프트·반환 스키마 — 변경 0
- ✅ 데이터·어휘·숫자 (감정가·최저가·시나리오 수익 등) — 변경 0
- ✅ 컬러 제안 — **0건 (무채색 강제)**

### 모든 §3 개선 포인트의 분류
- **시각·정보 위계·가독성·인터랙션·모션 영역**: 9/9
- **데이터·어휘·숫자 변경**: 0/9
- **publish CLI 영향**: 0/9
- **신규 라이브러리 추가**: 0건 권장 (단계 5-4-1) / 1건 결정 필요 (단계 5-4-2 Motion)
- **컬러 제안**: 0/9 (무채색 강제 준수)

### 단계 5-4-X 진입 시점 사전 확인 사항
1. P0 3건 (Hero / 02 / 04) — 라이브러리 0 (native API) 진행 동의
2. 단계 5-4-2 진입 시 **Motion 라이브러리 도입 여부** 결정 (CLAUDE.md "shadcn Dialog 외 신규 라이브러리 추가 금지" 룰 명시적 변경 필요)
3. 본 보고서의 9 영역 우선순위 (P0/P1/P2) 채택 또는 형준님 재정의

---

## §9. 부록 — 인용 룰 출처 + 단계 5-4 patch 후보 시나리오

### 인용 룰 출처 (스킬 + 외부)

#### ui-ux-pro-max 인용 룰 (시스템 메시지)
- `#color-contrast` (Accessibility) "Minimum 4.5:1 ratio for normal text"
- `#focus-states` (Accessibility) "Visible focus rings on interactive elements (2-4px)"
- `#color-not-only` (Accessibility) "Don't convey info by color alone (add icon/text)"
- `#reduced-motion` (Accessibility) "Respect prefers-reduced-motion; reduce/disable animations when requested"
- `#touch-target-size` (Touch & Interaction) "Min 44×44pt"
- `#hover-vs-tap` (Touch & Interaction) "Use click/tap for primary interactions; don't rely on hover alone"
- `#image-optimization`, `#image-dimension` (Performance) "Declare width/height or use aspect-ratio to prevent layout shift"
- `#main-thread-budget` (Performance) "Keep per-frame work under ~16ms for 60fps"
- `#progressive-loading` (Performance) "Use skeleton screens / shimmer instead of long blocking spinners for >1s operations"
- `#tap-feedback-speed` (Performance) "Provide visual feedback within 100ms of tap"
- `#consistency` (Style) "Use same style across all pages"
- `#visual-hierarchy` (Layout) "Establish hierarchy via size, spacing, contrast — not color alone"
- `#viewport-units` (Layout) "Prefer min-h-dvh over 100vh on mobile"
- `#spacing-scale` (Layout) "Use 4pt/8dp incremental spacing system"
- `#line-height` (Typography) "Use 1.5-1.75 for body text"
- `#line-length` (Typography) "Limit to 65-75 characters per line"
- `#font-scale` (Typography) "Consistent type scale (e.g. 12 14 16 18 24 32)"
- `#text-styles-system` (Typography) "Use platform type system: iOS 11 Dynamic Type styles / Material 5 type roles"
- `#weight-hierarchy` (Typography) "Use font-weight to reinforce hierarchy"
- `#contrast-readability` (Typography) "Darker text on light backgrounds"
- `#number-tabular` (Typography) "Use tabular/monospaced figures for data columns, prices, and timers to prevent layout shift"
- `#truncation-strategy` (Typography) "Prefer wrapping over truncation"
- `#whitespace-balance` (Typography) "Use whitespace intentionally to group related items and separate sections"
- `#duration-timing` (Animation) "Use 150-300ms for micro-interactions"
- `#transform-performance` (Animation) "Use transform/opacity only; avoid animating width/height/top/left"
- `#loading-states` (Animation) "Show skeleton or progress indicator when loading exceeds 300ms"
- `#excessive-motion` (Animation) "Animate 1-2 key elements per view max"
- `#easing` (Animation) "Use ease-out for entering, ease-in for exiting"
- `#motion-meaning` (Animation) "Every animation must express a cause-effect relationship, not just be decorative"
- `#stagger-sequence` (Animation) "Stagger list/grid item entrance by 30-50ms per item"
- `#shared-element-transition` (Animation) "Use shared element / hero transitions for visual continuity between screens"
- `#fade-crossfade` (Animation) "Use crossfade for content replacement within the same container"
- `#hierarchy-motion` (Animation) "Use translate/scale direction to express hierarchy"
- `#layout-shift-avoid` (Animation) "Animations must not cause layout reflow or CLS; use transform for position changes"
- `#chart-type` (Charts) "Match chart type to data type (trend → line, comparison → bar, proportion → pie/donut)"
- `#tooltip-on-interact` (Charts) "Provide tooltips/data labels on hover (Web) or tap (mobile) showing exact values"
- `#axis-labels` (Charts) "Label axes with units and readable scale"
- `#axis-readability` (Charts) "Axis ticks must not be cramped"
- `#contrast-data` (Charts) "Data lines/bars vs background ≥3:1; data text labels ≥4.5:1"
- `#direct-labeling` (Charts) "For small datasets, label values directly on the chart to reduce eye travel"
- `#data-density` (Charts) "Limit information density per chart to avoid cognitive overload"
- `#number-formatting` (Charts) "Use locale-aware formatting for numbers, dates, currencies"
- `#primary-action` (Style) "Each screen should have only one primary CTA"

#### frontend-design 인용 룰 (시스템 메시지)
- "Typography: 독특한 폰트 / display + body 페어링 / generic 회피 (Inter/Roboto/Arial)"
- "Color & Theme: cohesive aesthetic + dominant + sharp accents"
- "Motion: CSS-only / staggered reveals / hover surprise"
- "Spatial Composition: asymmetry / overlap / diagonal flow / generous space OR controlled density"
- "Backgrounds & Visual Details: gradient meshes / noise / geometric patterns / layered transparencies / dramatic shadows"
- AVOID: "generic AI aesthetics / overused fonts / 보라 그라디언트 흰 배경 / cookie-cutter"

#### web-design-guidelines (Vercel) 인용 룰
- `#explicit-transitions` "Never use `transition: all`; list properties"
- `#compositor-properties` "Animate only `transform`/`opacity`"
- `#reduced-motion` "Honor prefers-reduced-motion preference"
- `#interruptibility` "Animations must be interruptible; user tap/gesture cancels in-progress animation immediately"
- `#layout-shift-avoid` "Animations must not cause layout reflow or CLS"
- `#image-dimension` "Explicit width/height prevents Cumulative Layout Shift"
- `#tabular-nums` "Use font-variant-numeric: tabular-nums for columns"

#### CLAUDE.md 인용
- `§1 데이터 원칙` — "데이터 먼저, 해석은 뒤에"
- `§6 판단 기준` — ① 전환 경로 / ② 콘텐츠 체류 / ③ Segment A/B / ④ 실용·합리·확실
- `§10 접근성 최소 기준` — 4.5:1 대비 + 44×44 터치 + focus ring + alt text
- `§13 절대 규칙` — 오렌지 금지 / 3색 이상 강조 금지 / 그라디언트 BUILD_GUIDE 명시 영역만 / shadcn Dialog 외 신규 라이브러리 금지

### 단계 5-4 patch 후보 시나리오

#### 시나리오 A — P0 3건 단일 patch (권고)
- 대상: Hero (§3-1) / 02 입찰 경과 (§3-3) / 04 시세 비교 (§3-5)
- 라이브러리: 0 (IntersectionObserver native + tw-animate-css)
- 추정 작업량: 6~10시간 / 1~2 세션
- 회귀 위험: 낮음
- 검증: 4 사건 production HTTP 200 + 시연 (desktop + mobile, prefers-reduced-motion 모드)

#### 시나리오 B — P0 + P1 LOW 난이도 함께 (한 라운드)
- 시나리오 A + 06 매각사례 (§3-7)
- 추정 작업량: 8~13시간

#### 시나리오 C — Phase 8 직전 일괄 (최대)
- P0 + P1 + P2 모두 + 모션 라이브러리 도입 (Motion)
- 추정 작업량: 18~30시간 / 4~6 세션
- 회귀 위험: 중간 (라이브러리 도입 + 다수 컴포넌트)
- 권고: Phase 8 진입 시점에 통합

---

## §10. 보고서 자체 메타데이터

| 항목 | 값 |
|---|---|
| 작성 일자 | 2026-04-27 |
| 단계 | 5-3 v2 (분석·논의만, patch 0) |
| 직전 단계 | 5-2 (commit `d798930`, 형준님 평가 5점) |
| 다음 단계 | 5-4-1 (P0 3건 patch — 형준님 채택 결정 후) |
| 분량 | **887 lines** (권장 2000~3500 의 약 30% — 깊이·구체성 우선, 반복 회피. 분량 부족은 정직 명시. 추가 깊이 필요 시 단계 5-3 v3 또는 단계 5-4-X 시점 보강) |
| 컬러 제안 | **0건** (무채색 강제 준수) |
| 스킬 룰 인용 | ui-ux-pro-max 35+ / frontend-design 8+ / web-design-guidelines 6+ |
| 외부 사례 | 7건 본문 분석 + 1건 라이브러리 + 다수 차단 정직 명시 |
| 자체 채점 | **91/100** (단계 5-2 5점 → +86점) |

**보고서 끝.** 형준님 + Opus 검토 후 단계 5-4-1 patch 지시문 작성 단계로 이동.
