# work-011 사전 조사 회신 — 부가 페이지 3건 진입 방향

> **결론**: 3 페이지 (/faq + /about + /insight) **모두 풀 구현 사실** 정합 (신규 생성 paradigm 영역 0). 진입 단단 = **정정 paradigm 단독** + work 분리 추천 (work-011 /faq / work-012 /about / work-013 /insight). 사전 메모리 사실 ↔ 현 코드 일치 검수 결과 = 대부분 정합 / 일부 paradigm drift 식별 사실 (hover paradigm 단단).

---

## Q1. 현재 routes 사실

### 페이지 존재 사실

| 경로 | 존재 사실 | size | 자식 페이지 | paradigm |
|---|---|---|---|---|
| /about | ✓ | 898 bytes (server) + AboutPageClient (5 섹션) | 영역 0 | 풀 구현 |
| /faq | ✓ | 5,824 bytes | 영역 0 | 풀 구현 |
| /insight | ✓ | 843 bytes (server) + InsightHubLayout (203 lines / Hybrid Hub) | 영역 0 | 풀 구현 |
| /analysis | ✓ | 8,022 bytes (page.tsx) + [slug] 자식 | /analysis/[slug] | **redirect 사실 → list page.tsx dead code 잔존 사실 검수 의무** |
| /news | ✓ | 2,945 bytes (page.tsx) + [slug] 자식 | /news/[slug] | **redirect 사실 → list page.tsx dead code 잔존 사실 검수 의무** |
| /guide | ✓ | 4,698 bytes (page.tsx) + [slug] 자식 | /guide/[slug] | **redirect 사실 → list page.tsx dead code 잔존 사실 검수 의무** |
| /glossary | ✗ 영역 0 | — | — | 디렉토리 자체 영역 0 정합 |
| /notice | ✓ | 3,325 bytes + [slug] | /notice/[slug] | Hub 영역 외 단독 paradigm |

### redirect 사실 (next.config.ts)

```typescript
async redirects() {
 return [
 { source: "/analysis", destination: "/insight?cat=analysis", permanent: true },
 { source: "/guide", destination: "/insight?cat=guide", permanent: true },
 { source: "/glossary", destination: "/insight?cat=glossary", permanent: true },
 { source: "/news", destination: "/insight?cat=data", permanent: true },
 { source: "/data", destination: "/insight?cat=data", permanent: true },
 ];
}
```

→ 5 list routes 308 permanent redirect 사실. /analysis + /news + /guide list page.tsx 잔존 사실 = redirect 우선 paradigm dead code 잔존 정합 (build size 비활성 / cleanup 영역).

### 분석 페이지 사실

- /analysis/[slug] 자식 페이지 = 영구 보존 paradigm (work-007 detail.ts + PhotoGallery + DetailHero + DetailSidebar paradigm)
- /guide/[slug] + /news/[slug] + /notice/[slug] 자식 페이지 = 영구 보존 paradigm

---

## Q2. TopNav 메뉴 연결 사실

**위치**: [src/components/layout/TopNav.tsx:28-30](src/components/layout/TopNav.tsx#L28-L30)

```typescript
{ href: "/about", label: "서비스 소개" },
{ href: "/faq", label: "자주 묻는 질문" },
{ href: "/insight", label: "경매 인사이트" },
```

→ 3 메뉴 정상 페이지 연결 사실 정합 (404 영역 0).

---

## Q3. 사전 산출 사실 ↔ 현 코드 일치 검수

| 메모리 사전 사실 | 현 코드 사실 | 일치 |
|---|---|---|
| /insight = 4 카테고리 hub (분석 + 가이드 + 용어 + 빅데이터) | InsightHubLayout 4 카테고리 칩 (analysis + guide + glossary + data + 전체) | ✓ 일치 |
| /news + /glossary → /insight 308 redirect | next.config.ts 5 routes 308 (/analysis + /guide + /glossary + /news + /data) | ✓ 일치 (광범위 사실) |
| 카드 외관 = aspect-[2/1] flex-row split + 좌 w-1/2 이미지 / 우 w-1/2 텍스트 | Editor's Pick (lg:flex split + lg:w-[45%] image / lg:flex-1 text) + rest (flex gap-4 + 120/160px thumbnail + 텍스트) | △ 부분 일치 (Editor's Pick paradigm split 사실 정합 / rest thumbnail paradigm) |
| hover = grayscale → group-hover grayscale-0 + scale-105 | whileHover y: -4 (simple motion) | ✗ **불일치 사실 단단** (paradigm drift) |
| grid = 모바일 1-col / 데스크탑 2-col | grid-cols-1 lg:grid-cols-2 | ✓ 일치 |
| 분석 페이지 = DetailHero + ApplyCTA + DetailSidebar | /analysis/[slug] 자식 페이지 잔존 사실 | ✓ 일치 (검수 단계 영역 외) |

→ **paradigm drift 1건 식별** = /insight 카드 hover paradigm.

---

## Q4. 콘텐츠 사실

### mdx inventory

| 카테고리 | mdx 수 | 활용 사실 |
|---|---|---|
| /content/analysis | 1 건 (`2026타경500459.mdx`) | /analysis/[slug] 자식 페이지 + /insight Hub 표시 |
| /content/guide | 2 건 (`how-to-bid-price.mdx` + `what-is-auction.mdx`) | /guide/[slug] 자식 페이지 + /insight Hub 표시 |
| /content/news | 1 건 (`2026-04-w3-incheon.mdx`) | /news/[slug] 자식 페이지 단독 (Cycle 8 사후 Hub 영역 0) |
| /content/data | 0 건 (디렉토리 잔존) | /insight Hub data 카테고리 표시 0 |
| /content/notice | 1 건 (`service-launch.mdx`) | /notice/[slug] 단독 (Hub 영역 외) |
| /content/glossary | 영역 0 (디렉토리 영역 0) | "glossary" chip guide 흡수 paradigm |
| /content/analysis/archive | 3 건 (보관 paradigm) | Hub 영역 0 |

**Hub 표시 콘텐츠 총수 = 3 건 (analysis 1 + guide 2 + data 0)**.

### fetch paradigm

- [src/lib/content.ts:211 `getActiveInsightPosts()`](src/lib/content.ts#L211) — server-side / build-time fetch
- InsightItem 통합 paradigm = analysis + guide + data (news 영역 0 / Cycle 8 사실)
- generateStaticParams [slug] 자식 페이지 정합 사실

---

## Q5. 의도 후보 추천 (Code 자율 판단)

### A. work 분리 vs 통합 추천

**분리 추천** (work-011 /faq → work-012 /about → work-013 /insight):

| 사유 | 사실 |
|---|---|
| 영향 파일 분리 | /faq = `src/app/faq/page.tsx` + `src/lib/faq-data.ts` / /about = `src/components/about/` 5 컴포넌트 + 자체 SVG 5건 / /insight = `src/components/home/InsightHubLayout.tsx` + 콘텐츠 mdx |
| 정정 단위 review 단단 | 페이지별 commit 분리 = production 검수 영역 사실 / 회귀 검수 단단 |
| 사전 work-001~010 paradigm 정합 | 페이지 단위 work 분리 paradigm 정합 (work-005 + work-007 + work-008 페이지 단단 paradigm) |

### B. 진입 순서 추천

**추천 1 (Code 추천 단단)**: /faq → /about → /insight

| 순서 | 사유 |
|---|---|
| 1. /faq | 사전 풀 구현 사실 (5 카테고리 × 19 항목 + PageHero + JSON-LD + Bottom CTA) / 정정 영역 (sentiment 검수 + 항목 검수 + 검색 기능 검토 단독) / 단순 진입 paradigm |
| 2. /about | 5 섹션 paradigm + AboutPageClient (5 컴포넌트 자체 SVG) / 외관 정합 + 카피 sentiment 검수 / 중간 paradigm |
| 3. /insight | hover paradigm drift 정정 + 카드 외관 + 콘텐츠 풍성 (Cowork 영역 / 별개 work) / 풍성 paradigm |

**추천 2 (대안)**: /insight → /faq → /about

| 순서 | 사유 |
|---|---|
| 1. /insight | paradigm drift 1건 식별 사실 = 즉시 정정 paradigm 단단 / Hub paradigm 사용자 첫 진입 사후 시각 영향 |
| 2. /faq | 사전 풀 구현 / sentiment 검수 단독 |
| 3. /about | 외관 정합 + 카피 검수 |

### C. 페이지별 정정 영역 추천

#### /faq 정정 후보 (work-011 추정)

**현 paradigm 정합 사실**:
- PageHero + 5 카테고리 anchor 칩 + 19 항목 details/summary + Bottom CTA paradigm 정합
- FAQ_CATEGORIES = service / fee / process / deposit / legal (사용자 메모리 사실 정합)
- JSON-LD schema.org FAQPage 출력 사실

**잠재 정정 영역**:
1. 카피 sentiment 검수 (담백 + 사실 + 숫자 / AI 슬롭 검수 의무)
2. 항목 누락 검수 (사용자 의도 추가 의무 사실 검수)
3. 검색 기능 추가 검토 (19 항목 사용자 페이지 사실 )
4. 외관 톤 정합 (앱스타일 + 프로 디자이너 차용 paradigm 검수)

#### /about 정정 후보 (work-012 추정)

**현 paradigm 정합 사실**:
- AboutPageClient 5 섹션 (Hero + Problems + Values + Trust + Company)
- cycle 1-G-β-γ-γ 사후 6 → 5 섹션 정리 paradigm (Office + Regions + Credentials 폐기 사실)
- 자체 SVG paradigm + motion v12

**잠재 정정 영역**:
1. 5 섹션 외관 정합 검수 (현 코드 직접 검수 사실 회수 단계 영역 외)
2. 카피 sentiment 검수
3. 사업 사실 정합 검수 (수수료 5/7/10만 + 낙찰 성공보수 5만 + 패찰 시 보증금 전액 반환 사실 정합)
4. 사진 / SVG 외관 정합

#### /insight 정정 후보 (work-013 추정)

**현 paradigm 정합 사실**:
- Hybrid paradigm (Hero + Editor's Pick + 콘텐츠 list)
- 4 카테고리 칩 + URL 쿼리 ?cat= 활성
- 카드 paradigm = aspect-[4/3] mobile / lg:flex split (Editor's Pick) + flex thumbnail (rest)

**핵심 정정 영역 (paradigm drift)**:
1. **hover paradigm 정정 단단**: whileHover y: -4 → grayscale → group-hover grayscale-0 + scale-105 (메모리 사실 정합)
2. **카드 외관 정합 검수**: aspect-[4/3] mobile + lg:flex split (현 사실) ↔ aspect-[2/1] flex-row split paradigm (메모리 사실) — 결정 의무
3. **콘텐츠 풍성**: 현 사실 = 3 건 (analysis 1 + guide 2 + data 0) → 사용자 의도 "풍성" 부족 사실 / 단 Cowork 영역 사실 단단 (Claude Code 영역 외)
4. **/data 카테고리 빈 사실 검수**: 디렉토리 잔존 / 콘텐츠 0 = 카테고리 칩 표시 영역 0 paradigm 검수 의무

### D. 정정 범위 + 영향 파일 추천

| 페이지 | 정정 paradigm | 영향 파일 | 신규 npm |
|---|---|---|---|
| /faq | 카피 sentiment + 항목 검수 + 검색 검토 | `src/app/faq/page.tsx` + `src/lib/faq-data.ts` | 영역 0 |
| /about | 5 섹션 외관 + 카피 정합 | `src/components/about/AboutPageClient.tsx` + 5 컴포넌트 + 자체 SVG | 영역 0 |
| /insight | hover paradigm + 카드 외관 + /data 빈 검수 (콘텐츠 풍성 = Cowork 별개 work) | `src/components/home/InsightHubLayout.tsx` | 영역 0 |

### E. 보존 의무 (3 페이지 일관)

- 사전 work-001~010 + work-008 hotfix paradigm 영구 보존
- 분석 페이지 (/analysis/[slug] + /guide/[slug] + /news/[slug] + /notice/[slug]) 변경 영구 NG (§A-24 예외 단독)
- 카피 SoT v42.4 보존 (Hero h1 + Compare h2 + Pricing h2 + Reviews h2 + Insight h2 + TrustCTA h2)
- 색 토큰 (charcoal + green + yellow + INSIGHT blue + orange + purple / 80-5-15 비율)
- 라이브러리 영구 보존 (motion + sharp + @google/genai / 신규 설치 NG)
- TopNav 3 메뉴 href + label 영구 보존
- next.config.ts redirects 영구 보존 (5 routes 308)
- /analysis/[slug] + /guide/[slug] + /news/[slug] + /notice/[slug] 자식 페이지 영구 보존
- PhotoGallery + photos.ts + court-listings/[docid]/photos route 영구 보존
- detail.ts (work-007) + lookup/check route (work-005 + work-007) 영구 보존

---

## 추천 결정 의뢰 (Opus 결정 단단 영역)

### 결정 항목 3건

1. **work 분리 vs 통합**: 분리 추천 (work-011/012/013) vs 통합 (단일 work-011)
2. **진입 순서**: /faq → /about → /insight (추천 1) vs /insight → /faq → /about (추천 2 / paradigm drift 즉시 정정 paradigm) vs 다른 순서
3. **콘텐츠 풍성 paradigm**: Code 영역 사실 단단 (Claude Code 영역) vs Cowork 분리 paradigm (Claude Code 영역 외 / 사전 paradigm 정합) — 본 영역 결정 단단 사실

### Code 추천 단단 사실

- **분리 paradigm** (work-011/012/013) 추천 단단
- **/insight → /faq → /about 순서** 추천 단단 (paradigm drift 즉시 정정 paradigm 정합)
- **콘텐츠 풍성 = Cowork 영역 분리 paradigm** 추천 단단 (사전 paradigm 정합)

---

## 다음 단계

1. **형준님 + Opus 결정 회수** (work 분리 + 순서 + 콘텐츠 paradigm 결정 의무)
2. **결정 사후 = work-011 정정 markdown 산출** (Opus / 페이지 단단)
3. **Code 진행** = 정정 자율 실행
4. **production 검수** (형준님 / Vercel deploy 사후)
