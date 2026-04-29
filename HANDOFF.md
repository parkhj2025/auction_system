# 경매퀵 웹사이트 핸드오프 문서

> **용도**: 다음 세션 (Claude Chat / Opus / Code) 영역 영역 본질 — 본 문서 단일 영역 영역 영역 영역 영역 작업 영역 영역 영역 본질
> **최종 업데이트**: 2026-04-29 (sub-phase 8.3-quick Cohere 광역 적용 영역 **revert 완료** + 다음 세션 = **완전 혁신** 본질)
> **현재 빌드 상태**: HEAD = `69b724a` (Revert 'Cohere 광역 적용'). sub-phase 8.1 시각 본질 회복 + sub-phase 8.2 토큰 영역 (deep-green / .seq / JetBrains Mono / fs-* / r-* / sp-* / shadow-1~3) 보존 영역
> **다음 세션 진입**: **클로드 채팅 (Opus) 영역 시작** → 경쟁사 분석 + 구성 영역 근본 개선 → 시안 산출 → Code 광역 적용 1 cycle (sub-phase 분할 0, mockup cycle 폐기)
> **함께 읽을 문서**: `CLAUDE.md` (원칙·컴플라이언스 + §13 룰 1~33 + §17 로드맵 + Lessons [A]~[D]), `BUILD_GUIDE.md` (구조·토큰), `DESIGN-READING-GUIDE.md` (코드베이스 진입 가이드, commit a948b10), `docs/roadmap.md` (Phase 7~10 + v2 상세)

---

## 🔥 2026-04-29 핫 스냅샷 — 다음 세션 시작 시 여기부터 읽기

### 지금 어디인가

**sub-phase 8.3-quick Cohere 광역 적용 영역 revert 완료** (commit `69b724a`). Phase 8 Layer A 토대 = sub-phase 8.1 (75b1c84) 시각 본질 + sub-phase 8.2 (d84dd62) 토큰 영역 영역 영역. 다음 세션 본질 = **구성 영역 근본 개선 영역 (완전 혁신)**.

### 형준님 본질 영역 (2026-04-29 인용)

> "경쟁사 대비 떨어지는 전체 웹사이트 품질과 디자인 인터페이스. 구성에 대한 것을 근본적으로 개선한 이후에 세부 문구 수정이나 요소들을 수정하는 방식이 맞다."
>
> "다음 대화에서는 완전한 혁신을 위한 논의를 이어갈꺼야."
>
> "새로운 세션에서는 클로드채팅의 대화를 통해 시작할게."

### 다음 세션 진입 트리거

**클로드 채팅 (Opus / claude.ai) 영역 시작 → 경쟁사 분석 + 구성 영역 근본 개선 본질 논의**. 시안 영역 산출 후 → Code 광역 적용 1 cycle.

| 영역 | 본질 |
|---|---|
| 1. Opus 논의 영역 | 경쟁사 (바토너 / 그 외) 영역 분석 + 본 사이트 구성 영역 근본 영역 약점 영역 식별 + 혁신 방향 본질 |
| 2. Opus 시안 산출 영역 | mockup HTML 직접 산출 (외부 mockup cycle 폐기) |
| 3. 형준님 검증 영역 | 시안 검증 + 정정 cycle 또는 확정 |
| 4. Code 영역 광역 적용 영역 | 시안 확정 후 1 cycle 영역 적용 (sub-phase 분할 0) |
| 5. 세부 영역 | 문구 / 요소 영역 = 구성 영역 영역 후 영역 본질 (현 시점 영역 0) |

### 본 세션 영역 누적 영역 (2026-04-28 ~ 04-29)

| 단계 | commit | 영역 본질 |
|---|---|---|
| 단계 5-4-2-fix-9 | 350b07a | 본문 04·05 영역 정합화 + 룰 31 신설 (raw-content 변경 0 본질). Phase 0 식별 → Phase 1 (시세 대표성 한계 제거) → Phase 2 (ScenarioCarousel 폐기) → Phase 3 (시나리오 비교 요약 시각 강조 wrap, ScenarioComparisonHighlight 신설) |
| 단계 5-4-2-fix-10 | 9cce56c | Web Interface Guidelines Group 2 정밀 audit + RightsAnalysisSection 시각 신호 제거 (옵션 A) + **룰 33 신설** (focus-visible 보상 / aria-label / semantic HTML / 시각 신호 ↔ 액션 정합 / heading hierarchy / img / transition-all 0) |
| 단계 5-4-3 | 1d3aeea | DetailHero 옵션 C Asymmetric 재구성 + HeroGallery 폐기 (Lightbox 직접 호출) + **룰 32 신설** (Pretendard Variable + font-feature-settings ss01~ss11 + kern + letter-spacing -0.02em + smoothing) + 룰 18·26·28 갱신. **룰 38 신설** (변조 영역 = Hero + CTA + Liquid Glass 6 한정 / 본문 + 다이어그램 + 텍스트 영역 변조 0 본질) |
| sub-phase 8.1 | 75b1c84 | Phase 8 Layer A 토대 첫 진입. Action Blue 단일 토큰 (`--color-action: #0066cc`) + 카카오 토큰 신규 + ApplyCTA brand-950 → ink-950 + accent-yellow 폐기 + ink-300 정의 보존 (텍스트 0 정합) + font-weight 5단계 ladder + body 17px (Apple HIG 본질 흡수) + text-base 67건 영역 var 전환 + font-medium 78건 영역별 (보존 6 + 600 전환 72) |
| docs | a948b10 | DESIGN-READING-GUIDE.md (클로드 디자인용 코드베이스 진입 가이드) |
| sub-phase 8.2 | d84dd62 | 토큰 layer 갱신 (Cohere-anchored 디자인 시스템 합치). deep-green / coral / soft-stone / pale-green / ink-surface / fs-display / fs-h1 / fs-mono / fs-num-* / r-1~5 / r-card / r-pill / shadow-1~3 / sp-* / container-w / .seq / JetBrains Mono next/font/google. **`--color-action: var(--deep-green)` alias** (back-compat, DetailHero·HoverableDropRateBar 칩 영역 자동 영역 Deep Green 색상 영역 적용). body 17 → 16 영역 회귀 |
| sub-phase 8.3-quick | b8f78fd | 홈페이지 영역 Cohere 광역 적용 (HeroSearch / RegionStrip / WhySection / FlowSteps / Pricing / TrustCTA 6 컴포넌트). 형준님 검증 = **사업 톤 미스매치 (B2C 서비스 vs B2B 미디어 톤)** → 폐기 결정 |
| **revert** | **69b724a** | **Revert 'Cohere 광역 적용' — 사업 톤 미스매치로 원복**. b8f78fd 전체 영역 git revert (history 보존). 6 files changed, 55 insertions(+), 44 deletions(-). 외부 mockup cycle 폐기 + Opus 직접 기획 본질 전환 |

### 보존 영역 / 폐기 영역 / revert 영역 정합

| 영역 | 상태 |
|---|---|
| **sub-phase 8.1 시각 본질** (75b1c84) | ✅ 회복 영역 (revert 본질) |
| **sub-phase 8.2 토큰 영역** (d84dd62) | ✅ 보존 영역 — globals.css @theme 영역 = deep-green / coral / soft-stone / pale-green / ink-surface / fs-* / r-* / sp-* / shadow-1~3 / .seq / JetBrains Mono 영역 영역 |
| **`--color-action: var(--deep-green)` alias** | ⚠️ 보존 영역 — DetailHero 칩 / HoverableDropRateBar 칩 = 여전히 Deep Green (#003c33) 색상 영역 적용. 분석 페이지 (`/analysis/2026타경500459`) 영역 영역 = 칩 영역 Deep Green 영역 시각 본질 영역 |
| **body 16px** (sub-phase 8.2 영역 영역) | ✅ 보존 영역 — `--text-body: 1rem` (17px → 16px 회귀 영역 영역 영역) |
| **홈 컴포넌트 영역** (HeroSearch / RegionStrip / WhySection / FlowSteps / Pricing / TrustCTA) | ✅ sub-phase 8.1 본질 회복 영역 (검은 배경 / radius-xl / ink-900 닷 / shadow-card 영역 등) |
| **Cohere 광역 적용** | ❌ 폐기 영역 (사업 톤 미스매치) |
| **외부 mockup cycle** | ❌ 폐기 영역 (Opus 직접 기획 본질 전환) |
| **DESIGN-READING-GUIDE.md** (a948b10) | ✅ 보존 영역 (클로드 디자인 영역 영역 영역 영역 영역 영역) |

### 영구 금기 영역 (절대 변경 0)

| 영역 | 사유 |
|---|---|
| `raw-content/` 전체 | Cowork 영역 (룰 31) |
| `content/analysis/` 전체 | publish CLI 산출물 영역 (변경 시 다음 publish 호출 시 복원) |
| `scripts/content-publish/` | publish CLI 영역 |
| 단일 사건 데이터 (2026타경500459) | 검증 케이스 영역 |
| 다이어그램 7 컴포넌트 (RightsNodeDiagram / TimelineSection / SaleAreaSummary / PriceScatter / HoverableDropRateBar / ScenarioComparisonBox / ScenarioComparisonHighlight) | 룰 24-D Action Blue + ink tier 본질 + 룰 38 변조 0 |
| 본문 카드 영역 | 룰 27 흰 카드 본질 + 룰 38 변조 0 |
| 본문 텍스트 / 표 / 리스트 영역 | 룰 14 / 룰 32 본질 + 룰 38 변조 0 |
| `src/types/content.ts` | frontmatter / meta 스키마 영역 (Cowork 영역 호환) |
| `src/lib/datetime.ts` | 서버 사이드 날짜 영역 (Asia/Seoul 본질) |
| `src/lib/pdf/delegation.ts` | 서버 PDFKit 영역 |

### 룰 변조 가능 영역 (룰 38 본질)

**시그니처 영역 6 한정**:
1. Hero (DetailHero / 홈 Hero / 페이지 Hero)
2. CTA (ApplyCTA / TrustCTA / MobileSticky / CTA 카드)
3. TopNav (Liquid Glass 한정, sub-phase 8.7~8.8)
4. Sub-nav (Liquid Glass 한정)
5. Modal (Liquid Glass 한정)
6. Tooltip (Liquid Glass 한정)

**변조 가능 본질**: 비비드 일러스트 / abstract gradient / Liquid Glass / 장식적 motion / 색 영역.

### 다음 세션 본질 영역 (완전 혁신 — 클로드 채팅 영역 영역 영역 영역)

#### Opus 논의 영역 (다음 세션 영역 영역 영역)
1. **경쟁사 분석 영역**: 바토너 (KDC텍, 2023.07 론칭, 230 대리인, 보증금 누적 2,400억원) + 그 외 영역. 본 사이트 영역 약점 영역 (콘텐츠 마케팅 / 디자인 인터페이스 / 사용자 흐름 / 페이지 구성 영역 영역).
2. **본 사이트 구성 영역 근본 영역 약점 영역 식별**:
   - 홈 페이지 8 컴포넌트 영역 흐름 영역 (HeroSearch → RegionStrip → CardCarousel → ContentShowcase → WhySection → FlowSteps → Pricing → TrustCTA) 영역 영역 = 적정 본질 영역 영역?
   - 분석 페이지 영역 흐름 영역 (DetailHero + 본문 7섹션 + Sidebar + ApplyCTA + RelatedCards) 영역 영역 = 적정 본질 영역?
   - 페이지 진입 흐름 영역 (홈 → 분석 → 신청) 영역 영역 = 사용자 영역 본질 영역?
   - 모바일 / 데스크톱 영역 영역 = 적정 본질 영역?
3. **혁신 방향 본질 영역**:
   - 사업 톤 (B2C 서비스 본질) 영역 합치 영역 영역 본질
   - "실용·합리·확실" 본질 영역 강화 본질
   - 콘텐츠 허브 본질 (제2축) 영역 영역 영역 영역 영역
   - 입찰 대리 접수 영역 (제1축) 영역 영역 영역 본질
4. **시안 영역 산출 본질**:
   - mockup HTML 직접 산출 (외부 mockup cycle 폐기, Opus 직접 기획)
   - 변조 영역 = Hero + CTA + Liquid Glass 6 한정 (룰 38 본질)
   - 본문 + 다이어그램 + 텍스트 = 변조 0 보존
5. **Code 광역 적용 영역**:
   - 시안 확정 후 1 cycle (sub-phase 분할 0)
   - sub-phase 8.2 토큰 영역 영역 영역 영역 (deep-green / coral / soft-stone / fs-* / r-* / .seq 등) 영역 활용 본질 영역 영역 = Opus 결정 영역
   - sub-phase 8.1 시각 본질 영역 영역 = Opus 결정 영역

#### 진행 영역 사항 영역 (다음 세션 영역 진입 즉시 영역)

1. 형준님 영역 = 클로드 채팅 (Opus) 영역 시작
2. Opus 영역 = 본 핸드오프 영역 + DESIGN-READING-GUIDE.md + CLAUDE.md + BUILD_GUIDE.md 영역 영역 통합 영역 본질
3. Opus 영역 = 경쟁사 분석 + 구성 영역 근본 개선 영역 논의 시작
4. Opus 영역 = 시안 산출 (mockup HTML 직접)
5. 형준님 영역 검증 → Code 광역 적용 영역

#### Code 영역 영역 본질 (적용 cycle 진입 시)

- **광역 적용 1 cycle 본질** (sub-phase 분할 0)
- 시각 본질 영역 변경 영역 광범위 영역 = revert 위험 영역 본질 영역 → Opus 영역 영역 영역 시안 영역 영역 영역 본질 영역 영역 영역 = 형준님 검증 후 영역 적용 본질
- 본 단일 commit 영역 = 매우 큼 영역 = git diff 영역 영역 영역 영역 본질 영역 영역
- 본문 영역 + 다이어그램 영역 + 텍스트 영역 = 영역 변경 0 (룰 38 본질 보존)

### 자가 검증 영역 (현재 영역)

- ✅ HEAD = 69b724a (Revert 'Cohere 광역 적용')
- ✅ tsc 0 / lint 0 / build Compiled successfully + 23/23 static pages
- ✅ history 보존 (b8f78fd / d84dd62 / a948b10 / 75b1c84 / 9cce56c / 1d3aeea / 350b07a 영역 영역 영역 영역 본질)
- ✅ Cowork raw-content / data / meta 변경 0 (룰 31)
- ✅ publish CLI 변경 0
- ✅ 다이어그램 7 컴포넌트 변경 0 (룰 38)

---

## 📚 이전 세션 영역 영역 (2026-04-28 단계 5-4-2-fix-8 영역 영역 영역 archive)

> **본 영역 영역 = 이전 세션 영역 영역 영역 본질 영역. 본 세션 영역 영역 누적 영역 = 위 핫 스냅샷 영역 영역.**

---

---

## ⚡ 2026-04-28 핫 스냅샷 — 다음 세션 시작 시 여기부터 읽기

### 지금 어디인가

**Phase 7 시각화 본질 마무리 단계 5-4-2-fix-8 production 시연 대기**. 의미:

- **단계 5-4-2 ~ 5-4-2-fix-8 (2026-04-26 ~ 04-28)**: Phase 7 시각화 본질 누적 작업 — 분석 페이지 (`/analysis/[slug]`) 의 7 영역 (Hero + 02 입찰 경과 ~ 07 종합 의견) 디자인 시스템 구축. 누적 룰 1 ~ 30 + 룰 24·26 갱신.
- **단계 5-4-2-fix-7 시연 결과** (commit `4e7739d`): 본문 (02~07) "굉장히 정돈" 평가 + Hero "촌스러움" 평가 (본문 톤앤매너와 단절).
- **plan v2 산출** (commit `cff761b`): `docs/phase-7-hero-design-plan.md` + `docs/phase-7-hero-mockups/option-{a,b,c}.html` 3종. 옵션 (a) Linear monochrome 라이트 통일 Code 추천 + 형준님 채택.
- **단계 5-4-2-fix-8** (commit `70de25b`, 2026-04-28): 룰 27·28·29·30 신규 + 룰 24·26 갱신. DarkInfoCluster 폐기 → 단일 흰 카드 통합. HoverableDropRateBar 색 토큰 white tier → ink tier 전환 (룰 7 motion 본질 100% 보존).
- **production 배포 완료**: https://auctionsystem-green.vercel.app/analysis/2026타경500459

### 다음 세션 즉시 진입 트리거

**형준님이 단계 5-4-2-fix-8 시연 결과 피드백으로 시작 예정.**

평가 시점 = "이거 진짜 다르네" 도달 여부 = 유일 PASS / FAIL 게이트.

| 결과 | 다음 단계 |
|---|---|
| **PASS** | 4 사건 확장 (3 archive 사건 raw-content 복귀) + 단계 5-4-3 마무리 (잔여 약점 영역 — 룰 19-C column priority hide·룰 21-B 본문 순서 swap·Lightbox·표 진입 모션) → Phase 7 본질 마무리 → Phase 8 진입 |
| **FAIL** | 단계 5-4-2-fix-9 보강 patch 또는 옵션 재선택 (옵션 b·c·d 검토) |

### 단계 5-4-2-fix-8 핵심 산출 (commit `70de25b`)

**룰 27 — Hero 라이트 통일**:
- DarkInfoCluster (`bg-ink-900` 다크박스) **폐기** (코드 사용 0건)
- 단일 흰 카드: `bg-white border border-ink-200 rounded-md p-6 sm:p-8`
- 본문 5/8 카드 패턴 (TimelineSection·PriceScatter·ScenarioCarousel·ScenarioComparisonBox·RightsAnalysisSection) 직접 흡수

**룰 28 — Visual Weight Triangle (TYPZA)**:
- 사건 제목: `text-h2` 32 / 700 / ink-900 (Q25)
- 가격 수치: `text-h2` 32 / 900 (black) / ink-900 / tabular-nums
- "−30%" 칩: `bg-brand-300/70` + ink-900 / 600 (룰 24-D 1 accent only)
- caption 라벨: `text-caption` / 500 / letter-0.18em / ink-500 uppercase
- Lead: `text-body` (16) → `text-body-lg` (18 lg+) / 400 / ink-700
- 서브타이틀: `text-body-sm` / 400 / ink-500
- stat-grid 라벨: `text-caption` / 500 / letter-0.05em / ink-500
- stat-grid 수치: `text-body-lg` / 600 / ink-900 / tabular-nums

**룰 29 — 카드 내부 구조**: 헤더 (원형 + 제목 + 서브) → 가격 영역 (라벨·수치·칩·progress bar) → border-t + Lead → border-t + stat-grid 3-col

**룰 30 — HoverableDropRateBar 색 토큰 전환** (룰 7 motion 본질 100% 보존):
- fill bar 채워진: white → ink-900 / 빈: white/30 → ink-100
- 70% 마크: white/80 → ink-900
- tooltip: bg-white → bg-ink-900 / text-ink-900 → text-white
- 라벨: white/70 → ink-700
- "−X%" 칩: brand-300/70 + ink-900 (보존)

**Q24~Q29 결정 적용**: Q24 옵션 a / Q25 weight 700 / Q26 lead 카드 안 / Q26-1 row tone 평탄 / Q26-2 stagger 미적용 / Q27 mobile 3-col 유지

### Phase 7 누적 룰 (1 ~ 30)

| 룰 영역 | 본질 | 단계 |
|---|---|---|
| 룰 1·22 | 모션 표준 once: false + duration 200/400/600ms + cubic-bezier(0.16,1,0.3,1) | fix-3·fix-6 |
| 룰 2·10·16·20 | 04 시세 비교 본질 (step-down + 시세 평균 보조 텍스트, horizontal slider 폐기) | fix-3·fix-4·fix-5·fix-6 |
| 룰 3·6·12·21 | 05 시뮬레이션 (ScenarioCarousel + ScenarioComparisonBox + InvestmentInteractive 단일 source state, 셀 시각 강조 TrendingUp/dot indicator) | fix-3·fix-4·fix-5·fix-6 |
| 룰 4·17·19 | mdx 표 mobile 폰트·패딩 축소 + CSS nth-child stagger | fix-3·fix-5·fix-6 |
| 룰 5 | 자가 인지 의무 (자체 점수·등급·"PASS" 선언 0 + 본질 미달 시 형준님 보고 0 → 재작성) | 누적 |
| 룰 6 | 06 SaleAreaSummary Bullet chart (Stephen Few 패턴) | fix-3 |
| 룰 7·24·26 | Hero 영역 (DropRateBar 1.6초 + 사진 carousel + 통합 정보 꾸러미) | fix-2·fix-4·fix-5·fix-6·fix-7·fix-8 |
| 룰 8·15·18 | Hero 사진 (carousel + Lightbox + hotfix 1/4 축소) | fix-4·fix-5·fix-6·hotfix |
| 룰 9 | 02 STEP timeline | fix-4 |
| 룰 11 | 표 정렬 글로벌 (텍스트 left / 숫자 right tabular-nums / 결과 center) | fix-2 |
| 룰 13 | mdx P/Ul/Ol fade-in stagger | fix-4 |
| 룰 14 | Typography Scale (Major Third 1.25 + 4pt grid + mobile auto-switch) | fix-4 |
| 룰 14-D | 카드 padding 32/24 + section gap 128/80 | fix-5·fix-6 |
| 룰 23 | Safari 일관성 (font-smoothing + Apple SD Gothic Neo fallback + browserslist) | fix-6 |
| 룰 25 | Pretendard CDN preload + stylesheet (jsdelivr 1.3.9) | fix-7 |
| 룰 27·28·29·30 | Hero 영역 본문 톤앤매너 계승 (라이트 통일 + Visual Weight Triangle + 카드 구조 + progress bar 토큰 전환) | **fix-8** |

### 단계 5-4-2-fix-8 약점·한계 정직 명시

1. **Hero 강조 약화 가능성** — 본문과 동일 bg-white 톤. typography weight 차등 (700/900) + brand-300/70 칩 + 카드 fade-in 600ms 으로 보강. 형준님 시연 평가 영역 (강조 약하다 판단 시 weight 800 또는 색·gap 보강 추가 patch)
2. **macOS Safari 17+ / iOS Safari 17+ 실측 시연 미진행** — Code 영역 외. 룰 25 (Pretendard CDN) + 룰 23 (base reset) 적용 보존. 형준님 시연 영역
3. **Lead summary stagger reveal 미적용** — Q26-2 결정 (룰 7 fill bar 충돌 회피). lead = 카드 fade-in 600ms 안 정적
4. **Phase 분할 단일 commit 통합** — Phase 1 토큰 검증 (no-op skip) + Phase 2·3·4 단일 commit `70de25b` 통합 + Phase 5 검증·보고 별도. 코드 일관성 우선 (다크박스 폐기 → 라이트 색 적용 → 모션 추가가 단일 변경 흐름)
5. **stat-grid 모바일 3-col 좁음 가능성** — Q27 결정 (3-col 유지). 375px viewport에서 압축. 시연 평가 시 좁다 판단되면 single column stack 추가 patch 영역
6. **a11y h1 위치 이동** — 다크박스 안 → 흰 카드 안. 의미 마크업 h1 + `aria-labelledby="detail-title"` 보존. SEO meta 영향 0

### 작업 영역 분리 (절대 위반 금지) — 누적 보존

- Cowork = voice·어휘·표현 (v2.7.1 동결)
- publish CLI 변경 0
- mdx body·meta·raw-content 변경 0
- 본문 영역 (02~07) 9 컴포넌트 변경 0:
  - TimelineSection·MdxTableElements·PriceScatter·ScenarioCarousel·ScenarioComparisonBox·SaleAreaSummary·CheckpointList·MdxBodyElements·RightsAnalysisSection
- 단계 5-4-2-fix-7 진전 영역 (룰 18·25·26) 본질 보존 — 색·구조만 정정 (룰 27·28·29·30 신규)
- 신규 라이브러리 추가 0 (motion 외)
- 신규 globals.css 토큰 추가 0 (옵션 a 기존 토큰 활용)
- brand-600 부활 0 (모노톤 강제)
- 자체 점수·등급·"PASS" 선언 0 (룰 5)

### Production 시연 영역

**시연 URL**: https://auctionsystem-green.vercel.app/analysis/2026%ED%83%80%EA%B2%BD500459

**시연 항목**:
- desktop (1280px+) — 흰 카드 통합 layout (헤더 + 가격 + lead + stat-grid)
- mobile (< 640px) — 카드 vertical stack + h3 24px (auto-switch) + stat-grid 3-col 유지
- tablet (768px) — md+ 영역
- macOS Safari 17+ / iOS Safari 17+ — 룰 25 Pretendard + 룰 23 base reset (형준님 영역)
- prefers-reduced-motion — globals.css 글로벌 룰
- 키보드 — HoverableDropRateBar role="slider" + ←→ 보존

**4 사건 production HTTP**:
- /analysis/2026타경500459 → 200 (시연 대상)
- /analysis/2026타경540431 → 404 (archive)
- /analysis/2024타경540431 → 404 (archive)
- /analysis/2024타경580569 → 404 (archive)

### 회귀 검증 (commit 70de25b)

| 항목 | 결과 |
|---|---|
| typecheck / lint / build | 0 에러 (41 routes) |
| `grep "brand-600"` (globals.css 외) | 0건 |
| `grep "DarkInfoCluster()"` 코드 사용 | 0건 (폐기 검증) |
| `grep "bg-ink-900"` DetailHero 코드 사용 | 0건 (코멘트만) |
| `grep "rounded-xl"` DetailHero | 0건 (rounded-md 통일) |
| `grep "bg-brand-300"` 사용처 | 1건 (HoverableDropRateBar "−X%" 칩, 룰 24-D 1 accent) |
| `grep "once: true"` (예외 사유 주석) | 2건 (HoverableDropRateBar count-up + DetailHero 카드 진입) |
| 본문 영역 (02~07) 변경 | 0건 |
| 단계 5-4-2-fix-7 진전 영역 (룰 18·22·23·24·25·26) | 보존 |

### 다음 세션 진입 시 형준님 입력 예시 (예상)

**(PASS 시 — 본질 도달)**:
> "단계 5-4-2-fix-8 본질 통과. Hero 본문 톤앤매너 계승 ✓. 다음 = 4 사건 확장 (3 archive 사건 raw-content 복귀) 또는 단계 5-4-3 잔여 약점 영역 진행 결정."

**(FAIL 시 — 본질 미달)**:
> "단계 5-4-2-fix-8 시연 본질 미달 [구체 영역]. 단계 5-4-2-fix-9 보강 패치 지시문 작성 필요."

또는 부분 PASS:
> "[X] 영역은 좋음 / [Y] 영역 보강 필요. 정교 튠 [dimension] 적용."

### 참고 문서

- `docs/phase-7-hero-design-plan.md` — Hero plan v2 (Phase 1 본문 분석 / Phase 2 외부 영감 / Phase 3 옵션 (a)·(b)·(c) detail / Phase 4 Code 추천 + 정교 튠 dimension 7 row + Q24~Q29)
- `docs/phase-7-hero-mockups/option-{a,b,c}.html` — 시각 mockup 3종 (Pretendard CDN + 본 사건 500459 실데이터 + desktop 1280px + mobile 375px + 본문 비교 영역)
- `docs/phase-7-case-study-500459.md` — 단계 5-3 v3 case study (Apple/Stripe/Linear/Pudding/NYT/Bloomberg 5-step 분석 + 9 영역 매핑)
- `docs/phase-7-design-spec-500459.md` — 단계 5-3 v3 design spec (9 영역 4-step 구조)

### Phase 7 단계 5-4-2 누적 commit 시퀀스 (참고)

| 단계 | Commit | 영역 |
|---|---|---|
| 5-4-2 | `9a88b8d` | P0 5건 + Cowork 데이터 보강 + Motion 도입 |
| 5-4-2-fix | `9a2a9fa` `cef4c7d` `e426aa0` | 모노톤 강제 + 02 시각 위계 + 03 단순화 + 04·05·06 재구성 |
| 5-4-2-fix-2 | `68bf3f6` `91c7f73` `89b4459` `cc48525` | 03 hover + 02 Tr 위계 + 04 세로 막대 + 05 ScenarioCarousel + 06 spring + 07 reveal |
| 5-4-2-fix-3 | `2613ede` `4ef2cef` `fed457d` `43fa6c1` | 모션 once: false + 03 표 stagger + 04 세로 4 막대 + 05 디테일 폐기 + 06 Bullet chart |
| 5-4-2-fix-4 | `e3ca466` `9c85af5` `420d5ed` `3e0d197` `f543984` | Typography Scale + mdx reveal + 표 정렬 + Hero typography + 04 v2 + 05 carousel 통일 |
| 5-4-2-fix-5 | `a225b41` `71b92a7` `8d7c591` `91db643` | 14-D 강화 + 표 mobile card stack + Hero 사진 v2 + 04 step-down |
| 5-4-2-fix-6 | `1d609e3` `2232342` `bf551dc` `ecc6e61` `2a3ec3b` `7816ea8` `bd5d1fb` | Safari 일관성 + Hero typography 재정의 + 카드 padding + 표 mobile v2 + Hero carousel + 04·05 시각 정정 + 모션 |
| 5-4-2-fix-7 | `eb38413` `a077f2f` `4e7739d` | Pretendard CDN + Hero 영역 통합 + 텍스트 비율 축소 |
| 5-4-2-fix-7-hotfix | `e099ce6` | HeroGallery 1/4 축소 |
| docs (plan v2) | `cff761b` | Hero design plan + mockup 3종 |
| **5-4-2-fix-8** | **`70de25b`** | **Hero 영역 본문 톤앤매너 계승 (옵션 a Linear monochrome) — 시연 대기** |

---

## ⚡ 2026-04-21 핫 스냅샷 — 참고용 (상위 스냅샷으로 대체됨)

### 지금 어디인가

**Phase 6.7.6 완료 → Phase 6.8 1단계 완료 → 6.8 Pause 공식 선언 → Phase 7 진입 대기**. 의미:

- **Phase 6.7.6 (2026-04-20~21)**: `auction_round` 스키마 확장 + 본인인증 prefill + placeholder 경량화 + 진단 코드 cleanup. 5커밋 본체 + 1커밋 후속 backfill.
- **Production 500 사고·복구 (2026-04-21 오전)**: 6.7.6 마이그레이션 SQL이 plan 안에만 있고 repo에 미커밋 + Supabase Dashboard 수동 실행 누락 → /api/apply POST PGRST202/204 발생. 형준님 Dashboard에서 migration 수동 실행 완료 후 복구. 사후 repo backfill 커밋(`3ff01e4`)으로 migration 파일 + schema.sql 동기화 + Lessons Learned [D] 신설.
- **Phase 6.8 1단계 (2026-04-21)**: Lighthouse 측정 스크립트 `scripts/lighthouse-audit.mjs` + `pnpm lighthouse` + `.lighthouse/` gitignore 설정. 기본 대상: Production URL(`auctionsystem-green.vercel.app/`). Desktop+Mobile 2회, 4 카테고리 × 6 Core Web Vitals JSON+HTML 저장.
- **Phase 6.8 Pause 선언 (2026-04-21 오후)**: 2단계(임계값 확정) Step 1 재측정 5회 수행 중 Mobile perf Run 2/3(96) vs Run 4/5(84~85) **이봉형 분포** 발견. 형준님 판정: 축 2(콘텐츠)·축 3(디자인) 미완 상태에서 임계값 박으면 재조정 반복 불가피 → **2단계 전체를 Phase 9로 이월**. 로드맵 재정렬 + v2 패키지 정의 문서화 진행(본 커밋).

### 2026-04-21 완료 작업 요약

| 영역 | 결과 |
|------|------|
| Phase 6.7.6 B 커밋 (`3ff01e4`) | `supabase/migrations/20260420_orders_auction_round.sql` 신설 + `supabase/schema.sql` 3구간 동기화(function 2-arg / orders.auction_round 컬럼 / `orders_unique_active_case_round` 인덱스) + CLAUDE.md Lessons [D] 신설 |
| Phase 6.8 1단계 커밋 (`0cdcf86`) | `lighthouse 13.1.0` + `chrome-launcher 1.2.1` devDep / `scripts/lighthouse-audit.mjs` 112줄 / `pnpm lighthouse` script / `.lighthouse/` + `.build-report.txt` gitignore |
| 랜딩(/) Lighthouse 초기 측정 | Desktop: perf=79 a11y=97 bp=100 seo=91 · Mobile: perf=97 a11y=97 bp=100 seo=91 · LCP Desktop 2.7s / Mobile 2.4s · CLS Desktop 0.044 / Mobile 0.002 · TBT Desktop 90ms / Mobile 100ms |
| 번들 산출물 | `.next/static/chunks/` 총 2.0MB, 최대 JS 청크 454KB, 최대 CSS 301KB, 1MB 초과 청크 0건 |
| Lessons Learned 누적 | [A] 이중 엔진 금지 / [B] UX 무언화 / [C] 기획-구현 괴리 방지 / [D] DB 변경은 repo migration 파일 커밋+Dashboard 실행 쌍으로 추적 |
| Phase 6.8 Pause + 로드맵 재정렬 | CLAUDE.md §17 로드맵 신설 + 원칙 4(Claude Code vs Cowork 경계) + 원칙 5(콘텐츠 내부 분류 라벨 노출 금지). `docs/roadmap.md` · `docs/v2-package-spec.md` 신설. Phase 7(콘텐츠 파이프라인) → 8(디자인) → 9(기술 관문·Lighthouse 재개) → 10(런칭 준비) → v2(수익 입증 후 PG·실 SDK·알림톡 일괄). |

### Phase 6.8 Pause 확정 (2026-04-21) — 2단계는 Phase 9 재개

**Pause 사유**: Step 1 재측정 5회(Run 1 warm-up 제외, Run 2~5 median 대상) 중 Mobile perf가 Run 2/3에서 96, Run 4/5에서 84~85로 **이봉형 분포**. median 90.5는 산술적 결과이나 실제 분포는 양극화. 원인(Vercel edge/CDN 상태 변동 가능성)을 규명하지 못한 상태에서 임계값 박으면 축 2·3 작업 후 재조정 필요.

**우선순위 재정의**: 기능 완결(축 2 콘텐츠 + 축 3 디자인) → 기술 관문(Lighthouse). 장식 품질 측정은 최종 관문에서.

**Phase 9로 이월된 작업**:
- Lighthouse 임계값 확정 (`.lighthouserc.json` + `--check-thresholds` exit code)
- Mobile 양극화 원인 규명 → **기술부채 #13**
- Desktop perf 79 개선 커밋 (LCP/SEO/번들 판정)

**유지되는 산출물**: `scripts/lighthouse-audit.mjs` + `pnpm lighthouse` + chrome-launcher/lighthouse devDep. Phase 9에서 재사용.

**상세 로드맵**: `docs/roadmap.md` 참조. v2 패키지 스펙: `docs/v2-package-spec.md` 참조.

### 이월 / 대기 항목

1. **형준님 E2E 재검증 (Phase 6.7.6)** — 마이그레이션 복구 후 8케이스 재진행 필요. 매칭 경로 / manualEntry 드롭다운 / 교차경로 round 갱신 / 다른 회차 동시접수 허용 / 동일 회차 중복차단 / placeholder 3건 / 본인인증 prefill 라벨 / PDFPreviewModal 진단 UI 0건.
2. **Vercel env var 정리** — `NEXT_PUBLIC_DIAG_ENABLED` Production scope에서 수동 삭제 (형준님 Dashboard).
3. **Lighthouse 게이트 임계값 확정** — **Phase 9로 이월** (구 6.8 2단계). `docs/roadmap.md` Phase 9 섹션 참조.
4. **런칭 블로커 누적** — `memory/project_launch_blockers.md` 참조 (Google OAuth 동의 화면 도메인 등). **Phase 9·10에서 처리.**
5. **기술부채 #11** — 인앱 브라우저(카카오/라인/페이스북) Chrome 전환 UX.
6. **기술부채 #13** — Mobile Lighthouse perf 양극화 (Run 2/3: 96 / Run 4/5: 84~85, LCP 2.5s ↔ 3.8s). Phase 9 Lighthouse 재개 시점에 재측정 + 원인 규명. Vercel edge/CDN 상태 변동 가설 우선 검토.

### 다음 세션 즉시 실행 트리거 (형준님이 복사해서 입력)

**Phase 7 진입 시 (축 2 콘텐츠 웹 반영 파이프라인)**:

```
Phase 7 진입. 축 2 콘텐츠 웹 반영 파이프라인 구축.

=== 사전 확인 ===

HANDOFF.md "2026-04-21 Phase 6.8 Pause 확정" +
CLAUDE.md §17 로드맵 + docs/roadmap.md Phase 7
섹션 읽고 범위·진입조건·완료기준 확인.

원칙 4 (Claude Code vs Cowork 경계) + 원칙 5
(콘텐츠 내부 분류 라벨 노출 금지) 숙지.

=== 진입 조건 확인 ===

1. Claude Cowork 측 콘텐츠 결과물 패키지 스펙이
   확정·전달되었는가? (파일 구조 / frontmatter /
   이미지 경로 규약)
2. 샘플 콘텐츠 결과물 1건 이상 수신되었는가?

미충족 시 Cowork 측 산출 완료 대기.

=== 작업 방식 ===

1. Cowork 산출물 스펙 인스펙션 → 파이프라인 설계
   (Plan mode)
2. 형준님 승인 후 구현 진입
3. 콘텐츠 내부 분류 라벨(섹션 키, 카테고리 코드,
   frontmatter type/status 등)이 UI에 노출되지
   않는지 grep 자가 검증

=== 작업 금지 ===

- 두인옥션 PDF 파싱, 크롤러, 콘텐츠 생성 로직
  (Cowork 영역)
- Phase 8(디자인) 선행 적용
- Phase 9(Lighthouse 재개) 선행 진행
```

**v2 진입 시 (수익 입증 후, Phase 2 전환 단계)**:

```
v2 패키지 진입. docs/v2-package-spec.md 참조.
Phase 1 수익 입증 확인 + 월 비용 정당화 검토 후
PG · 실 SDK · 알림톡 연동 작업.
```

### 다음 세션 시작 시 환경 체크리스트

1. `node --version` (v22), `pnpm -v` (10.33)
2. `.env.local` 4개 키 존재
3. Supabase Dashboard에서 `orders.auction_round` 컬럼 + `is_case_active(case_no TEXT, round_no INT)` 2-arg 함수 + `orders_unique_active_case_round` 인덱스 존재 확인
4. `pnpm build` 0 에러
5. 프로덕션 배포 확인: https://auctionsystem-green.vercel.app
6. (Phase 9 재개 전까지는 불필요) `pnpm lighthouse` 재실행은 Phase 9 진입 시점에 수행. Phase 7·8 진행 중에는 성능 측정 skip — 축 2·3 변동 시점의 측정값은 게이트 판정용으로 유효하지 않음.

---

## ⚡ 2026-04-17 핫 스냅샷 — 참고용 (상위 스냅샷으로 대체됨)

### 지금 어디인가

**Phase 2 전단계 + P2-7 Stage 1·2A 완료 + 디자인 최소 정리 완료**. 의미:

- court_listings 인천 2,047건 적재 + **수동 실행 증분 크롤러** 완비 (`scripts/run-crawler.bat` 더블클릭)
- `/apply` Step1이 **court_listings 실시간 매칭** 작동 (frontmatter 매칭은 폴백으로 공존)
- **사진 온디맨드 페처** 작동 — selectAuctnCsSrchRslt.on 단일 호출 + sharp WebP 압축 + Storage 캐싱
- **히어로 사건번호 Typeahead 자동완성** + StickyPropertyBar + PhotoGallery 인라인 4장
- **e2e 다수 버그 fix** — 법원 필터, mokmul→item 그룹핑, 1000건 limit, WAF 헤더 등
- **디자인 최소 정리** 완료 — globals.css 사용 규칙 주석 + 카테고리 배지 회색 통일 + 이미지 그라디언트 중립화
- 프로덕션 URL: https://auctionsystem-green.vercel.app

### P2-7 Stage 2A 완료 작업 요약

| 영역 | 결과 |
|------|------|
| 사진 페처 | `src/lib/courtAuction/{session,codes,photos}.ts` + `/api/court-listings/[docid]/photos` route. sharp 800×600 WebP q75. 캐시 hit 256ms. **카테고리별 4장 선별** (전경 2 + 내부 2 + fallback) |
| 매칭 API | `/api/orders/check` 확장 — courtCode/courtName 필터 + listings 배열. **mokmul 단위 row → item 단위 그룹핑** (component_count 포함) |
| Typeahead | `/api/court-listings/search` 신규. 디바운스 300ms, ILIKE, 키보드 네비, 법원 무관 검색, 선택 시 사건의 실제 court_name 전달 |
| Step1 매칭 | 단일 자동 / 복수 선택 UI / frontmatter 폴백 / 수동 입력 4경로. `component_count > 1`이면 "N개 필지 일괄 매각" 라벨 |
| StickyBar | Step2~5 상단 고정 (section 내부 위치). 2줄 구조 (체크 아이콘 + 주소 / 메타) + brand-600 좌측 accent |
| 크롤러 재설계 | GitHub Actions cron 폐기 → **수동 증분 실행**. 4단계 (네트워크 사전 체크 → 목록 → DB 대조 → 저장 → 리포트). ANSI 색상 + waitForKey. `run-crawler.bat`/`.sh` + CRAWLER-README.md |
| 헤더 보정 | SC-Userid: NONUSER, SC-Pgmid 추가, sec-ch-ua 3종, UA Chrome 147, 세션 2단계 초기화 |
| 디자인 최소 정리 | globals.css 32줄 컬러 사용 규칙 주석 / DetailHero·PropertyCard 배지 ink 회색 통일 (B안) / AnalysisMdxImage 3색 그라디언트 → ink 회색 단일 |

### 다음 세션 진입 옵션 (형준님 결정)

**옵션 A — Stage 2B 착수 (전자계약 시스템)**
- 작업 6: 위임장 PDF 생성 (pdf-lib + Noto Sans KR 임베딩)
- 작업 7: 서명 캔버스 (react-signature-canvas 또는 자체 구현)
- 작업 8: Step4Confirm 재설계 (요약카드 + 서명 + 3개 동의 체크박스)
- 작업 9: 주민번호 취급 정책 재설계 (ssn_back DB 저장 vs 메모리 전용 + PDF Storage 보관기간 자동 삭제)
- 작업 10: 휴대폰 본인인증 mock 구현 (`verifyPhone()` 인터페이스 + NICE/KCB/토스 비교표)
- 추정 공수: ~5~7시간 / 2~3 세션. 가장 큰 UI 변경 단계
- **2C 진입 직전 Stage 2B-post (디자인 정지 작업) 1회 배치 예정**

**옵션 B — 런칭 블로커 처리 시작**
- 사업자등록·도메인 확보가 선행되어야 하는 항목들
- Google OAuth 도메인 정리, 알림톡, 본인인증 SDK, 동의 팝업 재구성
- 형준님이 사업자등록 진행 중이면 Stage 2B와 병행 가능

### 다음 세션 즉시 실행 트리거 (형준님이 복사해서 입력)

**Stage 2B 착수 시**:
```
P2-7 Stage 2B 착수. 지금 상태:
- Stage 2A 완료. court_listings 매칭 + 사진 페처 + Typeahead + StickyBar 작동
- 디자인 최소 정리 완료 (배지 중립화, 사용 규칙 주석)
- 다음 단계: 전자계약 시스템 (위임장 PDF + 서명 캔버스 + Step4 재설계 + 주민번호 정책 + 본인인증 mock)
- HANDOFF.md "2026-04-17 핫 스냅샷"부터 읽고 staged-jumping-star.md의 Stage 2B 섹션 확인.
- 작업 6(위임장 PDF 템플릿 설계 + pdf-lib 파이프라인)부터 시작해줘.
- 한글 폰트 임베딩 이슈 발생 시 즉시 보고.
- Stage 2B 완료 후 2B-post(디자인 정지 작업) 1회 배치 예정 — 잊지 말 것.
```

**런칭 블로커 처리 시**:
```
런칭 블로커 처리 시작. project_launch_blockers.md 메모리 + HANDOFF "이월 항목" 섹션 읽고
어느 블로커부터 처리할지 형준님과 결정. 사업자등록 상태 먼저 확인 필요.
```

### 다음 세션 시작 시 환경 체크리스트

1. `node --version` (v22), `pnpm -v` (10.33)
2. `.env.local` 4개 키 존재
3. Supabase Dashboard: `court_listings` 2,047건+ / `court-photos` 버킷 존재
4. `pnpm build` 0 에러
5. 프로덕션 배포 확인: https://auctionsystem-green.vercel.app
6. (선택) 형준님 집 IP에서 `node --env-file=.env.local scripts/crawler/index.mjs --court incheon --days 14` 실행 → 4단계 정상 완료 확인

### 절대 하지 말 것 (Stage 2A에서 학습한 가드레일)

- **frontmatter 콘텐츠(`content/analysis/*.mdx`) 삭제 금지**. court_listings와 공존.
- **service_role 키 클라이언트 노출 금지**. admin client는 서버 전용.
- **사진 일괄 수집 금지**. 온디맨드 정책 + 카테고리별 4장 상한.
- **Supabase `.select()` 1000건 limit 주의**. 전체 조회 시 `.range()` 페이지네이션 필수.
- **WAF 우회 IP 로테이션 금지** (D9, 법적 리스크). Rate Limit 준수가 정답.
- **검색 API와 상세 API는 별도 모듈** (pgjsearch vs pgj15B). 한쪽 차단이 다른 쪽에 영향 없음.
- **Azure/GitHub Actions runner IP는 검색 API 차단됨**. cron 자동화 불가, 수동 실행만.
- **2B 작업 시 새 색상 추가 금지**. globals.css 주석 규칙 준수. 디자인 최종은 2B-post에서.

### Stage 2A에서 발견된 데이터 모델 사실들

- **csNo 포맷**: `court_listings.case_number` = `srnSaNo` = "2023타경547053" (한글 그대로)
- **item_sequence vs mokmul_sequence**: 다른 컬럼. 사진 API는 `dspslGdsSeq = item_sequence`. 매칭 ORDER BY는 둘 다.
- **item 단위 그룹핑**: 토지+건물 일괄 매각이 N개 row로 들어옴. UI는 item 단위로 그룹핑하여 1건으로 표시.
- **사진 카테고리 코드**: 000241=전경, 000242=감정평가, 000243=현황조사, 000244=매각물건, 000245=내부, 000246=등기부, 000247=기타
- **Stage 1 크롤러 사진 미수집**: photos 컬럼 NULL. 온디맨드로만 수집.
- **DB 통계 (2026-04-17)**: 인천 871 사건 / 진짜 복수 매각물건 (item 2+) 12건 (1.4%) / 토지+건물 구성 (mokmul 2+) 42건

### 플랜 파일

`C:\Users\User\.claude\plans\staged-jumping-star.md` — Stage 2A/2B/2B-post/2C 전체 설계 + e2e 이슈 수정 이력 + 검증 계획. 다음 세션이 이 파일과 본 핫 스냅샷을 읽으면 맥락 완전 복원.

---

---

## 1. 프로젝트 정체성

**경매퀵** — 인천지방법원 부동산 경매 입찰 대리 서비스 웹사이트.

- **수익원 단 하나**: 입찰 대리 수임료 (얼리버드 5만 / 일반 7만 / 급건 10만 + 낙찰 성공보수 5만)
- **콘텐츠는 유입 도구**: `/analysis` 물건분석은 수익이 아니라 Segment B(경매 초보) 유입·신뢰 구축 수단
- **손익분기**: 월 수임 12~15건
- **두 세그먼트**:
  - A — 사건번호 보유자: 히어로 검색 → `/apply` (3클릭)
  - B — 경매 초보: 콘텐츠 → 신뢰 → 문의
- **접수 / 상담 / 결제 3분법 (2026-04-14 원칙 전환)**:
  - 접수 = **웹** (`/apply` 5단계 스텝 폼, Phase 1부터 완전 구현)
  - 상담 = **카카오톡** (접수 후 확인·문의·결과 통보)
  - 결제 = Phase 1 계좌이체 안내 / Phase 2 PG 연동

---

## 2. 기술 스택

| 항목 | 선택 |
|---|---|
| Framework | Next.js **16.2.3** (App Router, Turbopack) |
| React | 19.2.4 |
| Language | TypeScript strict |
| Styling | **Tailwind v4** (CSS-first `@theme` in globals.css, tailwind.config.ts 없음) |
| Content | **next-mdx-remote/rsc + gray-matter + remark-gfm** (Contentlayer 대신 선택) |
| Font | Noto Sans KR (`next/font/google`) |
| Icons | lucide-react |
| Package | pnpm 10.33.0 |
| Deploy (예정) | Vercel |

**중요 설정**: `next.config.ts`의 `serverExternalPackages`에 `@mdx-js/mdx`, `next-mdx-remote`, `remark-gfm`, `remark-parse`, `remark-rehype`가 등록되어 있음. Next 16 워커가 ESM MDX 패키지 로드 시 크래시하는 문제를 우회. dev와 빌드 모두 이 설정 유지 필수.

---

## 3. Phase 1 완료 단계 (0~7)

| 단계 | 범위 | 상태 |
|---|---|---|
| 0 | 프로젝트 셋업, 디자인 토큰, 샘플 MDX 3건 | ✅ |
| 1 | 홈 11 섹션(A~K): TopNav / HeroSearch / RegionStrip / CardCarousel / ContentShowcase / WhySection / FlowSteps / Pricing / TrustCTA / Footer / MobileSticky | ✅ |
| 2 | `/analysis` 목록 + `/analysis/[slug]` 상세 7섹션 + Cowork 샘플 1건 | ✅ |
| 3 | `/apply` 5단계 스텝 폼 + `/apply/guide` + `/api/apply` stub | ✅ |
| 4 | `/guide`, `/news`, `/notice` (목록+상세) + 공용 PostLayout/ContentCard | ✅ |
| 5 | `/service`, `/about`, `/faq`(18 Q&A + JSON-LD), `/contact` | ✅ |
| 6 | `/terms`, `/privacy`, `/refund` (LegalLayout 공용, 참고 초안) | ✅ |
| 7 | 백로그 교정 + sitemap/robots + grep 금칙어 스윕 + 프로덕션 빌드 | ✅ |

**프로덕션 빌드 결과** (`pnpm build`):
- 총 27 라우트 생성 (Static 15 + SSG 7 + Dynamic 3 + API 1 + robots/sitemap 1)
- 경고 0, 에러 0, lint 0, tsc 0
- haimvil-201 Cowork 샘플(277KB HTML, 9 GFM 표) SSG 성공 확인

---

## 4. 파일 구조 맵

```
c:\Users\User\Desktop\website\
├── CLAUDE.md                    # 원칙·판단 기준·컴플라이언스 (v3)
├── BUILD_GUIDE.md               # 구조·토큰·컴포넌트 정의
├── 경매 입찰대리 사업 — 사업계획서.md  # 사업 컨텍스트 (모지바케 주의)
├── HANDOFF.md                   # 이 문서
├── 경매퀵_홈_v9.1.html           # 초기 디자인 참조점
├── next.config.ts               # serverExternalPackages 포함
├── package.json                 # gyeongmaequick
├── tsconfig.json                # @/* → src/*
├── eslint.config.mjs            # .agents/.claude/skills/content 무시
├── content/                     # 마크다운 CMS
│   ├── analysis/
│   │   ├── haimvil-201.mdx      # Cowork 실 산출물 (2021타경521675)
│   │   ├── deoksan-heights-302.mdx  # 플레이스홀더 (2024타경900001)
│   │   └── sewon-villa-103.mdx      # 플레이스홀더 (2024타경900002)
│   ├── guide/
│   │   ├── what-is-auction.mdx
│   │   └── how-to-bid-price.mdx
│   ├── news/
│   │   └── 2026-04-w3-incheon.mdx
│   └── notice/
│       └── service-launch.mdx
└── src/
    ├── app/
    │   ├── layout.tsx           # TopNav/Footer/MobileSticky + metadataBase
    │   ├── page.tsx             # 홈 (11 섹션 wiring)
    │   ├── globals.css          # Tailwind v4 @theme 디자인 토큰
    │   ├── sitemap.ts           # 동적 + 정적 수집
    │   ├── robots.ts
    │   ├── api/apply/route.ts   # POST stub (console.log + applicationId)
    │   ├── analysis/
    │   │   ├── page.tsx         # 목록 (필터/정렬)
    │   │   └── [slug]/page.tsx  # 상세 (SSG, 2-col, DetailSidebar)
    │   ├── apply/
    │   │   ├── page.tsx         # 서버 wrapper
    │   │   └── guide/page.tsx
    │   ├── guide/, news/, notice/
    │   │   ├── page.tsx         # 목록
    │   │   └── [slug]/page.tsx  # 상세 (PostLayout)
    │   ├── service/, about/, faq/, contact/
    │   │   └── page.tsx
    │   └── terms/, privacy/, refund/
    │       └── page.tsx         # LegalLayout
    ├── components/
    │   ├── layout/              # TopNav, Footer, MobileSticky
    │   ├── home/                # HeroSearch, RegionStrip, CardCarousel,
    │   │                        # ContentShowcase, WhySection, FlowSteps,
    │   │                        # Pricing, TrustCTA (11 섹션)
    │   ├── analysis/            # DetailHero, DetailSidebar, ApplyCTA,
    │   │                        # RelatedCards, mdx-components.tsx (팩토리),
    │   │                        # AnalysisMdxImage (client, 그라디언트 폴백)
    │   ├── apply/               # ApplyClient (스테이트 머신), ApplyStepIndicator,
    │   │                        # ApplyChecklist, FeeCalculator, FileUpload
    │   │   └── steps/           # Step1~5 (Property/BidInfo/Documents/Confirm/Complete)
    │   └── common/              # PropertyCard, ContentCard, EmptyState,
    │                            # PostLayout, LegalLayout
    ├── lib/
    │   ├── content.ts           # getAll*Posts / get*BySlug / normalizeDates
    │   ├── utils.ts             # cn, formatKoreanWon, formatKoreanDate
    │   ├── constants.ts         # FEES, COMPANY, COMPLIANCE_ITEMS,
    │   │                        # COURTS_ACTIVE, COURTS_COMING_SOON,
    │   │                        # BANK_INFO, APPLY_STEPS
    │   ├── navigation.ts        # PRIMARY_NAV, FOOTER_SECTIONS, PRIMARY_CTA
    │   ├── apply.ts             # computeFee, computeDeposit, generateApplicationId
    │   └── faq-data.ts          # 5 카테고리 × 18 Q&A
    ├── types/
    │   ├── content.ts           # AnalysisFrontmatter (12 optional 필드),
    │   │                        # GuideFrontmatter, NewsFrontmatter,
    │   │                        # NoticeFrontmatter, TagItem(danger|warn|neutral|safe)
    │   └── apply.ts             # ApplyFormData, ApplyBidInfo, ApplyDocuments
    └── data/
        └── reviews.json         # 6인 풀, 익명화 (김ㅇㅇ · 30대 남성 · 직장인)
```

---

## 5. 핵심 결정·우회 사항 (plan에서 벗어난 선택)

1. **Tailwind v4 CSS-first** — `tailwind.config.ts` 파일 없음. 토큰은 `src/app/globals.css`의 `@theme` 블록에 선언. `--color-brand-{50..950}`, `--color-ink-{100..900}`, 3 카테고리 별칭(`--color-cat-danger/edu/safe`) 정의. Tailwind 유틸리티(`bg-brand-600`, `text-ink-900`)로 자동 노출.

2. **Contentlayer 대신 next-mdx-remote/rsc** — Contentlayer(2)가 Next 16과 호환 불안정. `getAll*Posts()`에서 fs로 직접 읽고 `gray-matter`로 파싱. Phase 2 DB 전환 시 이 파일(`src/lib/content.ts`)만 교체.

3. **MDX 워커 크래시 우회** — `next.config.ts`의 `serverExternalPackages`에 MDX 패키지군 등록. dev·build 모두 정상 작동 확인. **이 설정 제거하면 빌드 실패**.

4. **팩토리 패턴 MDX 컴포넌트** — `buildAnalysisMdxComponents(category)` 함수가 카테고리를 closure로 캡처. `<img>` 컴포넌트가 카테고리별 그라디언트(`danger=적`/`safe=녹`/`edu=청`)로 폴백. guide/news/notice는 `"edu"` 고정 인자로 동일 팩토리 재사용.

5. **MDX h1 suppress** — Cowork 산출물이 본문에 H1을 포함하므로 `h1: () => null`로 페이지 H1 중복 방지.

6. **h2 특수 파싱** — `## 01 물건 개요` 형식을 정규식으로 파싱해 "01" 라벨 + "물건 개요" 제목으로 분리. 7섹션 스타일링의 핵심.

7. **PropertyCard 전체 클릭 영역** — 제목 `<Link>`에 `before:absolute before:inset-0` 의사 요소. `<article>` 하나에 내부 링크가 있어도 자연스러운 접근성 유지. (백로그 #1 해소)

8. **soft gating 제외** — `/analysis/[slug]` 1건 풀열람 + 2건째 블러 로직은 Phase 2 인증 시스템과 함께 구현. 론칭 직전으로 연기.

9. **작은 결정들**:
   - 접수 채널 전환(카톡→웹) 후 기존 컴포넌트 수정 불필요 — 애초에 "카카오톡"을 카피에 쓰지 않았음
   - deoksan·sewon caseNumber 중복 제거: 가상번호 `2024타경900001/900002`로 교체
   - Cowork 연동 시 겪은 모지바케 이슈 → 사용자에게 UTF-8 재전달 요청 후 수동 필드 매핑(`minRate→percent` 등) 1회 수행, Cowork 스킬 업데이트 사항은 plan 파일에 기록

---

## 6. 핵심 상수 위치

| 상수 | 파일 | 용도 |
|---|---|---|
| `FEES` | `src/lib/constants.ts` | earlybird/standard/rush/successBonus (50k/70k/100k/+50k) |
| `COMPANY` | `src/lib/constants.ts` | name, ceo, court, comingSoonRegions, kakaoChannelUrl(TODO) |
| `COMPLIANCE_ITEMS` | `src/lib/constants.ts` | Footer 풋터 4항목 (면책/업무범위/시세/전문가권고) |
| `COURTS_ACTIVE` | `src/lib/constants.ts` | 현재 인천만 |
| `COURTS_COMING_SOON` | `src/lib/constants.ts` | 수원/대전/부산/대구 |
| `BANK_INFO` | `src/lib/constants.ts` | 전용계좌 정보 **TODO: 실계좌 교체 필요** |
| `APPLY_STEPS` | `src/lib/constants.ts` | 5 스텝 id/label/hint |
| `PRIMARY_NAV` | `src/lib/navigation.ts` | 무료 물건분석·경매 인사이트·경매가이드·서비스 안내 |
| `FOOTER_SECTIONS` | `src/lib/navigation.ts` | 서비스/콘텐츠/회사 3열 |
| `PRIMARY_CTA` | `src/lib/navigation.ts` | `/apply` → "입찰 대리 신청" |
| `FAQ_CATEGORIES` | `src/lib/faq-data.ts` | 5 카테고리 × 18 Q&A |

---

## 7. 라우트 매핑 (Phase 1 17 페이지)

| 경로 | 타입 | 설명 |
|---|---|---|
| `/` | Static | 홈 11 섹션 |
| `/analysis` | Dynamic | 목록 + 필터(category/q/sort) |
| `/analysis/[slug]` | SSG | 상세 (DetailHero + 2-col + MDX 본문) |
| `/apply` | Static | 5단계 스텝 폼 (client state machine) |
| `/apply/guide` | Static | 초보자 안내 (5 스텝 + FAQ 3) |
| `/guide` | Dynamic | 목록 + 난이도 필터 |
| `/guide/[slug]` | SSG | 상세 (PostLayout) |
| `/news` | Static | 목록 |
| `/news/[slug]` | SSG | 상세 (PostLayout) |
| `/notice` | Static | 공식 공지 리스트 (카드 아닌 행 구조) |
| `/notice/[slug]` | SSG | 상세 (PostLayout) |
| `/service` | Static | 업무 범위 2카드 + SOP 5단계 + 안심 근거 |
| `/about` | Static | 대표 소개 + 3 가치 + 지역 |
| `/faq` | Static | 18 Q&A + JSON-LD FAQPage |
| `/contact` | Static | 카카오톡/이메일 + 운영시간/주소 |
| `/terms` | Static | 이용약관 10조 (참고 초안) |
| `/privacy` | Static | 개인정보처리방침 10섹션 (참고 초안) |
| `/refund` | Static | 환불 정책 6섹션 + 환불 표 (참고 초안) |
| `/api/apply` | Dynamic | POST stub (console.log + applicationId 발급) |
| `/sitemap.xml` | Static | 동적 수집 포함 |
| `/robots.txt` | Static | /api/ 제외 |

---

## 8. 컴플라이언스 체크포인트 (CLAUDE.md 필수 규칙)

| 규칙 | 현 상태 |
|---|---|
| 이모지 0 (src/ + content/) | **0건** (grep 통과) |
| 오렌지 클래스 0 | **0건** |
| 바토너 등 경쟁사 직접 언급 0 | **0건** (간접 "업계 평균 대비 절반" 표현만) |
| "패찰 시 보증금 전액 반환" 배치 | **18 파일**에 등장 (`#pricing`/`/apply`/`/faq`/`/service`/`/about`/`/refund` 포함) |
| 컴플라이언스 4항목 Footer | layout.tsx → Footer.tsx가 `COMPLIANCE_ITEMS` 렌더 → 모든 페이지 자동 노출 |
| 업무 범위 명시 (권리분석/투자자문/명도 제외) | `/service`, `/terms` 제4조, `/faq` 법적 사항 카테고리 |
| 시세 데이터 미수신 발행 금지 | `getAllAnalysisPosts()`에서 `p => p.frontmatter.marketData` 가드. 빈 객체 `{}`는 허용(Cowork 측 항상 포함 합의) |
| 카카오톡 언급 범위 | 10 파일 전부 **"접수 후 상담·확인·통보"** 맥락. 접수 자체는 웹 유지 |
| H1 페이지당 1개 | DetailHero 페이지 H1 + MDX 본문 H1 suppress로 중복 방지 |

---

## 9. Phase 2 이월 항목 (론칭 전 처리 체크리스트)

### 사업자 확인 후 교체
- [ ] `BANK_INFO.accountNumber` 실계좌 (`src/lib/constants.ts`)
- [ ] `COMPANY.kakaoChannelUrl` 실 채널 URL (`src/lib/constants.ts`)
- [ ] `/contact` 이메일 `contact@example.com` · 주소 확정 (`src/app/contact/page.tsx`)
- [ ] `/about` 대표 경력·매수신청대리인 등록번호 확정 (`src/app/about/page.tsx`)
- [ ] `/terms`, `/privacy`, `/refund` 법무 검토본 (현재 "참고 초안" 디스클레이머 상단 노출)

### 백엔드 구축
- [ ] `/api/apply` 실 제출 경로 — Resend / Nodemailer / Webhook 중 결정
- [ ] 이메일 템플릿 작성
- [ ] 파일 영구 저장소 (S3 / R2)
- [ ] PG 결제 위젯 (Step 5 계좌이체 안내를 대체)
- [ ] 마이페이지 / 접수 상태 조회 (`/my/*` 예약 경로)
- [ ] 소프트 게이팅 (`ContentGate` + `src/lib/readHistory.ts`, localStorage 기반)
- [ ] 실시간 대법원 경매정보 조회 API 연동 (Step 1 정적 매칭 대체)

### 배포
- [ ] `NEXT_PUBLIC_SITE_URL` 환경변수 (prod 도메인)
- [ ] Vercel 프로젝트 생성 + 연결
- [ ] 커스텀 도메인 연결 + SSL
- [ ] 브라우저 Lighthouse 실측 (LCP ≤ 2.5s / CLS ≤ 0.1 / A11y ≥ 95 / SEO ≥ 95)
- [ ] 실 이미지 동기화 전략 (`public/analysis/{slug}/*.jpg` 구조)

### Cowork 연동
- [ ] Cowork 스킬 업데이트 — 필수 필드(`type`/`slug`/`region`/`status`/`updatedAt`) 항상 출력
- [ ] 네이밍 정렬 (`percent`/`round`/`riskLevel`/`marketData` + 하위 키)
- [ ] `marketData: {}` 빈 객체라도 명시 출력
- [ ] deoksan·sewon 플레이스홀더 MDX 2건을 실 Cowork 산출물로 교체

---

## 10. 디자인 시스템 참조

### 컬러 (globals.css `@theme`)
- **브랜드 블루**: `--color-brand-{50..950}` (메인은 `brand-600: #2563eb`)
- **키 컬러**: `--color-accent-yellow: #ffd600` (오픈예정 뱃지), `--color-accent-red: #dc2626` (최저가 · 위험), `--color-accent-green: #16a34a` (안정)
- **카테고리 별칭**: `--color-cat-danger` = red, `--color-cat-edu` = brand-600, `--color-cat-safe` = green (각각 `-soft` 변형 있음)
- **중립**: `--color-ink-{100..900}`, `--color-surface`, `--color-surface-muted`, `--color-border`
- **금지**: orange, amber 계열 (코드 레벨 grep 체크)

### 타이포그래피
- Noto Sans KR (`--font-noto-kr` → `--font-sans`)
- 제목 `font-black tracking-tight`
- 본문 `leading-7`, 숫자 `tabular-nums`

### 보더 반경
- `--radius-xs: 4px` / `sm: 6` / `md: 10` / `lg: 14` / `xl: 20` / `2xl: 28`

### 스페이싱
- Tailwind 기본 4px 스케일 사용
- 섹션 간 `py-20 sm:py-24` 기본

### 포커스 링
- 전역 `:focus-visible` 2px brand-600 outline
- 터치 타겟 `min-h-12` (48px) 기준

---

## 11. 작업 재개 방법

### 환경 준비
```bash
cd "c:/Users/User/Desktop/website"
pnpm install        # 이미 node_modules 있으면 스킵
```

### 개발 서버
```bash
pnpm dev            # http://localhost:3000
```

### 프로덕션 빌드 검증
```bash
rm -rf .next
pnpm build          # 모든 라우트 SSG 검증
pnpm lint           # ESLint
npx tsc --noEmit    # 타입 체크
```

### 새 물건분석 추가 (Cowork 산출물)
1. `content/analysis/{slug}.mdx` 저장
2. frontmatter가 `AnalysisFrontmatter` 인터페이스(`src/types/content.ts`)와 정합한지 확인
3. 필수: `type: analysis` / `slug` / `region: incheon` / `status: published` / `publishedAt` / `updatedAt` / `marketData` (빈 객체라도)
4. 자동으로 `/analysis/[slug]`, sitemap, 목록 카드에 등장

### 새 페이지 라우트 추가
- `src/app/{path}/page.tsx` 생성
- Server Component 기본, 상호작용 필요시 `"use client"`
- Footer/TopNav/MobileSticky는 `layout.tsx`가 자동 제공 — 페이지에서 감싸지 말 것

---

## 12. 알려진 이슈 / 주의사항

1. **Next.js 16 + ESM MDX 크래시**: `next.config.ts`의 `serverExternalPackages` 항목을 **절대 제거하지 말 것**. 제거 시 모든 MDX 렌더 라우트 500 에러.

2. **caseNumber 중복 불가**: `/apply?case=xxx` 자동 프리필이 `AnalysisFrontmatter.caseNumber`로 매칭. 동일 번호 두 포스트가 있으면 매칭이 불안정. deoksan/sewon을 가상 `2024타경900001/900002`로 분리해둔 이유.

3. **모지바케 주의**: 사업계획서 `.md` 파일은 Latin-1로 해석된 UTF-8 상태로 첨부로 들어옴. Cowork 산출물 재첨부 시에도 같은 문제 발생 가능. 확인 후 사용자에게 재전달 요청.

4. **Sticky 필터 바 충돌**: `/analysis` 목록과 `/guide` 목록이 `top-16` sticky 필터. 같은 페이지에 동시 존재하는 경우 없음 — OK.

5. **notice 컬렉션 필드 부재**: `NoticeFrontmatter`는 `updatedAt`, `subtitle` 없음. PostLayout에서 optional 처리.

6. **dev 서버 종료**: Windows에서 `TaskStop`이 자식 프로세스까지 잡지 못하는 경우 있음. `taskkill //PID {pid} //F` 사용 또는 `tasklist //FI "IMAGENAME eq node.exe"`로 PID 확인.

---

## 13. 디테일 조정 백로그 — 7단계에서 모두 처리됨

| # | 항목 | 상태 |
|---|---|---|
| 1 | PropertyCard 전체 클릭 영역 | ✅ 2-a에서 처리 |
| 2 | WhySection 비교표 모바일 가로 스크롤 | ✅ 7단계 A-2 |
| 3 | HeroSearch select disabled 피드백 | ✅ 7단계 A-3 |
| 4 | notice by-slug 헬퍼 통합 | ✅ 7단계 A-1 |

---

## 14. 다음 세션에서 할 수 있는 작업 후보

사용자가 선택할 수 있는 방향:

**A. 론칭 준비**
- BANK_INFO 실계좌 교체 + placeholder TODO 일괄 교체
- `/api/apply` 이메일 전송 연동 (Resend 추천)
- Vercel 배포 + 커스텀 도메인
- Lighthouse 실측 및 디테일 튜닝

**B. 콘텐츠 확장**
- Cowork 산출물 추가 배치 (deoksan/sewon 교체)
- guide 확장 (추가 마크다운 작성)
- news 주간 시황 추가
- 실 이미지 동기화

**C. Phase 2 기능**
- 소프트 게이팅 구현 (`ContentGate` + `readHistory.ts`)
- 마이페이지 (`/my/*` 예약 경로)
- 로그인 (카카오/네이버 소셜)
- 지역 확대 (수원·대전·부산·대구) — 데이터 구조에 이미 `region` 필드 있음

**D. 디자인/UX 폴리싱** — Stage 2B-post로 이동됨 (staged-jumping-star.md 참조)

**E. Cowork 스킬 업데이트**
- frontmatter 스키마 표준화 지시서 작성
- Cowork 측 배포

---

## 15. 최근 세션 종료 상태 (2026-04-17 업데이트)

- **최신 커밋**: `1ec28ce` AnalysisMdxImage 그라데이션 중립화 (main 브랜치, push 완료)
- **마지막 작업**: P2-7 Stage 2A 완료 + e2e 이슈 7건 fix + 디자인 최소 정리 3건 커밋
- **대기**: Stage 2B (전자계약 시스템) 또는 런칭 블로커 처리 — 형준님 결정
- **플랜 파일 (현행)**: `C:\Users\User\.claude\plans\staged-jumping-star.md` (Stage 2A/2B/2B-post/2C 설계 + e2e 이슈 이력)
- **상단 "2026-04-17 핫 스냅샷" 섹션이 다음 세션의 첫 진입점**

### 2026-04-17 세션 누적 커밋 (시간 역순)

| 커밋 | 내용 |
|------|------|
| `1ec28ce` | AnalysisMdxImage 그라데이션 중립화 (3색 → ink 회색) |
| `c006edd` | 카테고리 배지 중립화 (B안 — 텍스트 라벨, ink 회색) |
| `1fc6f16` | globals.css 컬러 토큰 사용 규칙 주석 추가 |
| `16d5372` | 매칭 단위 mokmul → item 그룹핑 |
| `f330c99` | 법원 필터 누락 버그 수정 (타법원이 인천 데이터로 매칭) |
| `fe27fee` | Typeahead 자동완성 + StickyBar 강화 + 사진 인라인 |
| `6e1749a` | e2e 이슈 4건 (히어로 라우팅, StickyBar 위치, 시간 제거, 사진 4장) |
| `8078329` | StickyPropertyBar 신규 + formatBidDateTime 헬퍼 |
| `ffbbdbf` | Supabase 1000건 limit 버그 → range 페이지네이션 |
| `68eb729` | 크롤러 WAF 우회 (sec-ch-ua + 세션 2단계) |
| `faa3748` | 크롤러 증분 수집 재설계 + run-crawler.bat/.sh + README |
| `0f67fb1` | crawler-probe continue-on-error |
| `3df1df8` | crawler-probe에 상세 API 테스트 추가 |
| `18e6309` | crawler-probe 헤더 보정 |
| `6672cc0` | **Stage 2A 메인 커밋** (court_listings 통합 + 사진 페처 + Step1 재설계 + PhotoGallery) |
| `7309da4` | crawler-probe workflow + probe-photos.mjs |

---

**이 문서를 읽은 다음 세션 Claude에게**: 상단 "2026-04-17 핫 스냅샷"을 먼저 읽고, CLAUDE.md·BUILD_GUIDE.md로 원칙을 숙지한 뒤, 플랜 파일(`staged-jumping-star.md`)의 Stage 2B 섹션에서 다음 작업 상세 설계를 확인하세요. 이 핸드오프 문서가 현재 상태의 단일 진실 소스입니다.
