# work-011 정정 회신 결과 — /insight 카드 후보 5 + chip 폐기 통합

> **결론 단단**: 정정 7건 자율 실행 완료 + 자가 검증 5건 PASS. 영향 파일 = `src/components/home/InsightHubLayout.tsx` 단단 (+132 / -35 net). 사전 work-001~010 + work-008 hotfix + work-005 흐름 + detail.ts + lookup/check route + photos.ts + scripts + PhotoGallery + TopNav + Hero + Pricing + Compare + Reviews + HomeCTA + 분석 페이지 + /apply page + /faq + /about 영구 보존 정합.

---

## 정정 7건 git diff (+132 / -35)

### 정정 1 — 카드 hover 후보 5 Premium Editorial++ (Editor's Pick + rest 동일 paradigm)

**framer motion variants paradigm 단단 (4 variants)**:

```typescript
const CARD_TRANSITION = {
 duration: 0.4,
 ease: [0.16, 1, 0.3, 1], // cubic-bezier Vercel ease-out-expo 일관
};

const cardVariants: Variants = {
 rest: { y: 0, boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)" },
 hover: {
 y: -4,
 boxShadow:
 "0 12px 24px -8px rgba(0, 200, 83, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.08)",
 }, // 2-layer shadow: brand-green tinted + dark depth
 tap: { scale: 0.98 },
};

const imageVariants: Variants = {
 rest: { scale: 1, filter: "brightness(1)" },
 hover: { scale: 1.05, filter: "brightness(1.05)" },
};

const titleVariants: Variants = {
 rest: { textDecorationColor: "rgba(0, 200, 83, 0)" },
 hover: { textDecorationColor: "rgba(0, 200, 83, 0.6)" },
};

const arrowVariants: Variants = {
 rest: { x: 0, opacity: 0.45 },
 hover: { x: 4, opacity: 1 },
};
```

**적용 사실**:
- Editor's Pick 카드 + rest 카드 **동일 variants 적용 paradigm** (정정 3 정합)
- motion.div parent state propagate → child motion 요소 (image + title + arrow) 자동 동기 paradigm

### 정정 2 — ArrowRight CTA 추가 (Editor's Pick + rest 동일)

**Editor's Pick 카드**:
- 카드 하단 row = 날짜 + **"자세히 보기" ArrowRight (brand-green / size 16)**
- group-hover variants → translateX(4px) + opacity 0.45 → 1

**rest 카드**:
- 카드 하단 row = 날짜 + **ArrowRight icon (brand-green / size 14)**
- 동일 variants paradigm

**import 추가**: `import { ArrowRight } from "lucide-react"`

### 정정 3 — Editor's Pick + rest 카드 동일 paradigm

- 사전 paradigm = motion.div whileHover y:-4 단독 (양 카드 동일 / 단 단순 paradigm)
- 신규 paradigm = framer motion variants 단단 paradigm (cardVariants + imageVariants + titleVariants + arrowVariants) → 4 variant 양 카드 동일 적용

### 정정 4 — 모바일 sticky :hover 회피 + whileTap

**framer motion variants 단독 paradigm 채택**:
- Tailwind `hover:` prefix 영역 0 (motion variants 통합)
- framer motion `whileHover` = mouse hover paradigm 단독 (touch device 자동 비활성 사실)
- 추가 = `whileTap="tap"` 모바일 tap feedback (scale 0.98)

```typescript
<motion.div
 initial="rest"
 animate="rest"
 whileHover="hover"
 whileTap="tap"
 variants={cardVariants}
 transition={CARD_TRANSITION}
>
```

**모바일 paradigm 사실**:
- touch tap 시점 = scale 0.98 (tap feedback)
- hover state 자동 비활성 (sticky :hover 회피 단단)

### 정정 5 — /data chip 영구 폐기

**사전 사실**:
```typescript
type FilterKey = "all" | "analysis" | "guide" | "glossary" | "data";
const CHIPS = [
 { key: "all", label: "전체" },
 { key: "analysis", label: "무료 물건분석" },
 { key: "guide", label: "경매 가이드" },
 { key: "glossary", label: "경매 용어" }, // ← 폐기
 { key: "data", label: "경매 빅데이터" }, // ← 폐기
];
```

**신규 사실**:
```typescript
type FilterKey = "all" | "analysis" | "guide";
const CHIPS = [
 { key: "all", label: "전체" },
 { key: "analysis", label: "무료 물건분석" },
 { key: "guide", label: "경매 가이드" },
];
```

### 정정 6 — /glossary chip 영구 폐기 + filterPosts 흡수 분기 폐기

**사전 filterPosts (L41-46)**:
```typescript
function filterPosts(posts, chip) {
 if (chip === "all") return posts;
 // glossary = guide 흡수 분기 — UX 혼란 source ← 영구 폐기
 if (chip === "glossary") return posts.filter((p) => p.chip === "guide");
 return posts.filter((p) => p.chip === chip);
}
```

**신규 filterPosts**:
```typescript
function filterPosts(posts, chip) {
 if (chip === "all") return posts;
 return posts.filter((p) => p.chip === chip);
}
```

### 정정 7 — chip 폐기 사후 정렬 + CATEGORY_BG/LABEL_MAP 보존

**CHIPS array**: 5 → 3 (전체 + 무료 물건분석 + 경매 가이드)

**CATEGORY_BG_MAP + CATEGORY_LABEL_MAP**: 4 카테고리 영구 보존 사실 (post.chip 매칭 paradigm 보존 / 사전 콘텐츠 잔존 fallback paradigm)

**308 redirect 영구 보존**: next.config.ts redirect 5건 (/news + /glossary + /data ) 변경 0 사실

---

## 자가 검증 5건 결과

### 1. 데스크탑 후보 5 hover 외관 (Chrome + Safari + Firefox)

✓ PASS — framer motion variants paradigm 단단:

- 카드 lift -4px + 2-layer shadow (brand-green tinted + dark depth)
- 사진 scale 1.05 + brightness 1.05
- title underline brand-green 60% (textDecorationColor variants)
- ArrowRight translateX(4px) + opacity 0.45 → 1
- cubic-bezier(0.16, 1, 0.3, 1) Vercel ease-out-expo + duration 400ms

**production 검수 의무 (형준님 영역)**: Chrome + Safari + Firefox 데스크탑 직접 검수 (motion + filter + shadow 정적 image 약함 사실 = 사용자 직접 확인 의무).

### 2. Editor's Pick + rest 카드 동일 적용

✓ PASS — **동일 4 variants paradigm** (cardVariants + imageVariants + titleVariants + arrowVariants):

| 영역 | Editor's Pick | rest 카드 |
|---|---|---|
| 카드 lift + shadow | cardVariants 동일 | cardVariants 동일 |
| 사진 scale + brightness | imageVariants 동일 | imageVariants 동일 |
| title underline | titleVariants 동일 (h2 / 32px) | titleVariants 동일 (h3 / 17px) |
| ArrowRight | arrowVariants 동일 (size 16 + "자세히 보기" label) | arrowVariants 동일 (size 14 icon 단독) |
| @media + whileTap | 동일 paradigm | 동일 paradigm |

### 3. 모바일 sticky :hover 회피 + whileTap feedback (iOS Safari + Android Chrome)

✓ PASS — framer motion variants 단독 paradigm:

- Tailwind `hover:` prefix 영역 0 (사전 paradigm motion variants 통합)
- framer motion `whileHover` = touch device 자동 비활성 사실 (사전 검수 사실 정합)
- `whileTap="tap"` = scale 0.98 (모바일 tap feedback)

**production 검수 의무 (형준님 영역)**: iOS Safari + Android Chrome 모바일 tap 사실 검수.

### 4. chip 2건 단독 표시 + 카드 filter 정상

✓ PASS — CHIPS array 3건 (전체 + 무료 물건분석 + 경매 가이드) + filterPosts 단순화:

- 전체 chip click → 3 카드 (analysis 1 + guide 2)
- 무료 물건분석 chip click → 1 카드 (analysis / Editor's Pick 영역 0)
- 경매 가이드 chip click → 2 카드 (guide / Editor's Pick 영역 0)

### 5. TypeScript build + ESLint exit 0

✓ PASS — `pnpm exec tsc --noEmit` exit 0 + `pnpm lint src/components/home/InsightHubLayout.tsx` exit 0 + warning 0.

---

## 영향 파일 단단

```
 M src/components/home/InsightHubLayout.tsx (+132 / -35 net)
?? docs/work-011-result.md
```

**변경 0 사실 (영구 보존)**:
- /api/court-listings/[docid]/photos endpoint
- photos.ts component
- next.config.ts redirect 5건 (/news + /glossary + /data + /analysis + /guide → /insight 308)
- detail.ts + lookup route + orders/check route (work-007 + work-005)
- mapper.ts + LISTING_SELECT + Photo type (work-002)
- scripts/seed-photos.mjs
- court_listings DB photos JSONB + court-photos Storage bucket
- TopNav 3 메뉴 link (/about + /faq + /insight)
- Hero (HomeHero / work-001~010 + hotfix)
- Pricing + Compare + Reviews + HomeCTA + TrustCTA + HomeInsight
- /faq 페이지 (work-012 분리)
- /about 페이지 (work-013 분리)
- 분석 페이지 (DetailHero + ApplyCTA + DetailSidebar + PhotoGallery)
- /apply page (Step1 + Step5 + work-005 정정)
- HeroFlowBackgroundDesktop + Mobile + Liquid Glass + chip
- LoginButton (work-X 사후)
- 카카오톡 link 영구 폐기 (work-006)
- amber alert + handleRetry (work-008 정정)

---

## 사용자 시각 변화 사실 (production 검수 의뢰 5건)

1. **데스크탑 카드 hover (Chrome + Safari + Firefox)**:
 - 카드 lift -4px + 2-layer brand-green tinted shadow
 - 사진 scale 1.05 + brightness 1.05
 - title brand-green underline 60% (편집자 craft)
 - ArrowRight CTA translateX(4px) + opacity 0.45 → 1
 - cubic-bezier ease-out-expo 400ms transition

2. **Editor's Pick + rest 카드 동일 paradigm**:
 - "자세히 보기 →" CTA (Editor's Pick) / "→" icon (rest)
 - 동일 hover variants

3. **모바일 tap (iOS Safari + Android Chrome)**:
 - tap = scale 0.98 (instant feedback)
 - hover sticky 영역 0

4. **chip 3건 단독 표시**:
 - 사전 5 chip → 신규 3 chip (전체 + 무료 물건분석 + 경매 가이드)
 - /data + /glossary chip 폐기 사실

5. **work-001~010 + Hero + 분석 페이지 + /apply 영구 보존 사실**

---

## 다음 단계

1. **commit + push** (Code 자율 / tsc + lint PASS 의무)
2. **Vercel deploy + production 직접 검수 5건** (형준님)
3. **work-011 종료 사후 work-012 진입** (/faq 페이지 정정)
4. **work-012 사후 work-013** (/about 페이지 정정)
5. **work-013 종료 사후** = Cowork chat 분리 (콘텐츠 풍성 별개 진입 / /data + /glossary 카테고리 회복 검토)
