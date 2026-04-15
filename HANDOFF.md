# 경매퀵 웹사이트 핸드오프 문서

> **용도**: 다음 Claude Code 세션이 이 문서 하나만 읽고도 작업을 이어갈 수 있도록 현재 상태를 정리한다.
> **최종 업데이트**: 2026-04-15
> **현재 빌드 상태**: **Phase 2 전 단계(P2-0 ~ P2-6) + P2-7 Stage 1 완료**, 프로덕션 배포 중
> **함께 읽을 문서**: `CLAUDE.md` (원칙·컴플라이언스), `BUILD_GUIDE.md` (구조·토큰), `C:\Users\User\.claude\plans\glimmering-hopping-aurora.md` (Phase 2 빌드 플랜 — 전체 결정 히스토리와 P2-7 설계 상세)

---

## ⚡ 2026-04-15 핫 스냅샷 — 다음 세션 시작 시 여기부터 읽기

### 지금 어디인가

**Phase 1 완료 → Phase 2 전 단계 완료 → P2-7 Stage 1 완료**의 상태. 이게 의미하는 것:

- 고객이 Google 로그인 후 `/apply` 5단계 접수까지 완료 가능 (orders·documents·order_status_log DB 저장 + Storage 서류 업로드 + 1물건1고객 DB 강제)
- 고객 마이페이지(`/my`)에서 본인 접수 현황·상태 타임라인·서류 다운로드 가능
- 형준님(admin)이 `/admin`에서 접수 확인·상태 변경·SSN 즉시 삭제 가능
- 물건분석 상세 페이지에 소프트 게이팅(2건째부터 블러) 작동
- 계좌이체 UI에 수수료+보증금 합산 금액 복사 버튼, "온라인 결제(준비 중)" 영역
- **대법원 경매정보 직접 크롤링 성공** — 인천 2주 기간 2047건 `court_listings` 테이블 적재 완료
- 실전 프로덕션 URL: https://auctionsystem-green.vercel.app

### P2-7 Stage 2 — 다음 세션 목표

크롤러로 **텍스트 데이터**는 쌓았지만, 아직 `/apply` Step1은 frontmatter 매칭(`content/analysis/*.mdx` 3건)을 쓰고 있음. 이걸 `court_listings` 조회로 교체하고, 사진 온디맨드 페처를 붙이는 게 Stage 2.

작업 범위(5개):
1. **사진 페처 API route** — `src/app/api/court-listings/[docid]/photos/route.ts`
   - `sharp` 설치 + Node 런타임 바이너리 이슈 해결
   - `selectPicInf.on` 호출 → base64 JPEG 수신 → 800×600 WebP quality 75로 압축(원본 280KB → ~28KB)
   - Supabase Storage `court-photos/{courtCode}/{docid}/{seq}.webp` 업로드
   - `court_listings.photos` JSONB 업데이트 + `photos_fetched_at`
   - 두 번째 요청부터는 캐시 hit으로 즉시 URL 반환
   - 세션 로직은 `src/lib/courtAuction/session.ts`로 `scripts/crawler/session.mjs` 포팅
2. **`/api/orders/check` 확장** — court_listings 조인해서 매칭 정보(감정가·최저가·주소 등) 함께 반환
3. **`Step1Property.tsx` 재수정** — frontmatter 매칭 로직을 court_listings 조회로 교체. 매칭 성공 시 대법원 원본 데이터로 카드 렌더
4. **`PhotoGallery` 컴포넌트 신규** — "사진 보기" 버튼 + 로딩 + 카테고리별 갤러리 + 한글 캡션 + Lightbox
5. **`.github/workflows/court-crawler.yml`** — 매일 UTC 00:00(KST 09:00) cron으로 `scripts/crawler/index.mjs` 실행. GitHub Secrets에 `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` 등록 필요

추정 공수: ~2.5시간 / 1~2 세션.

### 다음 세션 즉시 실행 트리거 (형준님이 복사해서 입력)

**다음 세션 첫 메시지로 이것을 주세요**:

```
P2-7 Stage 2 착수. 지금 상태:
- Phase 2 전단계(P2-0~P2-6) + P2-7 Stage 1 완료
- court_listings 테이블에 인천 2주 2047건 이미 적재됨
- scripts/crawler/ 모듈 작동 검증 완료
- court-photos Storage 버킷 public read로 생성 완료
- HANDOFF.md 상단 "2026-04-15 핫 스냅샷" 섹션부터 읽고 Stage 2 5개 작업 순서대로 진행해줘.
  1번(사진 페처 API + sharp)부터 시작하고, 설치 이슈 생기면 즉시 알려줘.
```

### 다음 세션 시작 시 환경 체크리스트

1. `pnpm -v` + `node --version` (Node 20.6+ 필수)
2. `ls scripts/crawler/` — 6개 .mjs 파일 + README.md 확인
3. `.env.local` 확인: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`
4. Supabase Dashboard → Storage → `court-photos` 버킷 존재 확인 (public, 500KB limit, image/webp·jpeg)
5. Supabase Table Editor → `court_listings` 테이블 2000+건 확인
6. `pnpm dev` 기동 → http://localhost:3000 로드 → Google 로그인 → `/apply` 접근 가능한지

체크 실패 시 HANDOFF.md "2. 기술 스택" + P2-7 관련 섹션 읽고 복구.

### 절대 하지 말 것 (Stage 2에서 지켜야 할 가드레일)

- **frontmatter 콘텐츠(`content/analysis/*.mdx`) 삭제 금지**. `/analysis` 콘텐츠는 court_listings와 별개의 편집 콘텐츠로 유지. 두 시스템 공존.
- **`court_listings` 테이블을 클라이언트에서 직접 mutate 금지**. service_role 키는 서버 전용, 노출 금지.
- **사진 전체를 크롤러가 배치로 수집하지 말 것**. 온디맨드 정책 (고객 요청 시점에만 fetch + 압축 + 저장).
- **Stage 1 크롤러의 세션/페이로드 구조 변경 금지**. 2026-04-15 검증된 최소 작동 조합이므로 Stage 2에서 library 포팅 시 로직을 정확히 복제해야 함.
- **Vercel Cron 대신 GitHub Actions 사용**. Vercel 서버리스는 10~60초 제한으로 크롤러 풀런(~5분) 불가.

### P2-7 설계 전체 문서

`C:\Users\User\.claude\plans\glimmering-hopping-aurora.md`의 "P2-7" 섹션에 Stage 1·2 설계, DB 스키마, 리스크, 검증 기준이 전부 있음. 다음 세션이 이 파일을 먼저 읽으면 맥락을 완전히 복원할 수 있다.

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

**D. 디자인/UX 폴리싱**
- 브라우저 실뷰포트 스크린샷 검토 후 조정
- 애니메이션 추가 (과하지 않게)
- 다크 모드 (지금은 light only)

**E. Cowork 스킬 업데이트**
- frontmatter 스키마 표준화 지시서 작성
- Cowork 측 배포

---

## 15. 최근 세션 종료 상태 (2026-04-15 업데이트)

- **최신 커밋**: `0437594` P2-7 stage 1 + `d3da44b` P2-6 마무리 + Step1 UX 재설계 (main 브랜치)
- **마지막 작업**: P2-7 Stage 1 완료. 인천 2047건 `court_listings` 실적재 + 프로덕션 검증
- **대기**: P2-7 Stage 2 — 사진 페처 API route + Step1 court_listings 통합 + PhotoGallery + GitHub Actions
- **플랜 파일 (현행)**: `C:\Users\User\.claude\plans\glimmering-hopping-aurora.md` (Phase 2 + P2-7 결정 히스토리 포함)
- **상단 "2026-04-15 핫 스냅샷" 섹션이 다음 세션의 첫 진입점**

---

**이 문서를 읽은 다음 세션 Claude에게**: 상단 "2026-04-15 핫 스냅샷"을 먼저 읽고, CLAUDE.md·BUILD_GUIDE.md로 원칙을 숙지한 뒤, 플랜 파일의 P2-7 섹션에서 Stage 2 상세 설계를 확인하세요. 이 핸드오프 문서가 현재 상태의 단일 진실 소스입니다.
