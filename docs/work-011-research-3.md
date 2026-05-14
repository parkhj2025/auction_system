# work-011 사전 논의 3 회신 — /insight 카드 hover 창의 외관

> **결론 단단**: Code 자율 추가 후보 1건 (**후보 5 = Premium Editorial++**) 산출 + Playwright screenshot 8건 산출 + Code 의견 단단 정합. 사진 색감 (회색 + 베이지 + 검은) 영구 사실 = scale 효과 시각 단단 + shadow 사용자 시각 명확 paradigm.

---

## 1. Code 자율 추가 후보 산출 (1건 / 통합 paradigm)

### 후보 5 — "Premium Editorial++" (Code 자율 통합)

**의도**: Opus 후보 1 (검증된 Premium Editorial) + Code 자율 보강 (layered shadow + title decoration) 통합 paradigm. 영구 룰 + Stripe/Linear/Vercel 검증 표준 일관 + 디자이너 craft paradigm 추가.

**외관 구성**:

```typescript
// 카드 lift + layered shadow
section.bg-white .grid > div {
 transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
}
section.bg-white .grid > div:hover {
 transform: translateY(-4px);
 box-shadow:
 0 4px 12px rgba(0, 200, 83, 0.08), // layer 1: brand-green tinted (Stripe 일관)
 0 20px 60px -10px rgba(0, 0, 0, 0.08); // layer 2: depth (Apple SF 일관)
}

// 사진 scale + brightness
section.bg-white a > div[class*="aspect-"] {
 transition: transform 0.3s ease-out, filter 0.3s ease-out;
}
section.bg-white a:hover > div[class*="aspect-"] {
 transform: scale(1.05);
 filter: brightness(1.05);
}

// title underline decoration (편집자 paradigm / 신규 craft 단계)
section.bg-white a h3 {
 text-decoration: underline transparent;
 text-decoration-thickness: 2px;
 text-underline-offset: 4px;
 transition: text-decoration-color 0.3s;
}
section.bg-white a:hover h3 {
 text-decoration-color: rgba(0, 200, 83, 0.6);
}
```

**효과 사실 (3 layer 단단)**:
1. 카드 lift -4px + layered shadow (premium depth)
2. 사진 미세 확대 (5%) + brightness 5% (energy)
3. title underline brand-green 60% (편집자 craft)

**Stripe/Linear/Vercel 일관 사실**:
- `cubic-bezier(0.16, 1, 0.3, 1)` (Vercel ease-out-expo 일관)
- tinted shadow (brand-green 5-10% alpha / Stripe 일관)
- micro-state craft (title decoration / Linear interaction density 일관)
- hardware acceleration 단독 (transform + opacity + filter / compositor-friendly 60fps)

**영구 룰 일관 사실**:
- motion v12.38.0 + Tailwind v4 단독 (신규 npm NG)
- brand-green alpha shadow 영구 (영구 룰 §A-26 tinted shadow 일관)
- `@media (hover: hover)` 안 분기 의무 (모바일 active state 보존)

---

## 2. 후보별 시각 비교 산출 사실 (Playwright screenshot 4 후보 × 2 상태)

**산출 image 8건**:
- `/tmp/insight-cand1-{static,hover}.png` (Opus 후보 1 / Premium Editorial)
- `/tmp/insight-cand3-{static,hover}.png` (Opus 후보 3 / Image Zoom + Reveal)
- `/tmp/insight-cand4-{static,hover}.png` (Opus 후보 4 / Minimal Lift + Border)
- `/tmp/insight-cand5-{static,hover}.png` (Code 자율 / Premium Editorial++)

### 후보 2 (Spotlight Reveal) 산출 NG 사실

mouse-tracking dynamic paradigm = **정적 screenshot 표현 NG 사실 단단**. 사용자 직접 dev server local 또는 production deploy 사후 확인 paradigm 단독 영역.

---

## 3. 사진 사실 일관 검수 사실

### 사진 색감 사실 (사전 회신 정합)

| 사진 | 색감 paradigm |
|---|---|
| analysis.jpg | 사무실 + 베이지 양복 + 자연 빛 / **베이지 + 회색 톤 단단** |
| guide.jpg | 사무실 + 콘크리트 + 검은 양복 / **회색 + 검은 + 흰 톤 단단** (현 Hub rest 카드 ) |
| data.jpg | 사무실 + 신문 + 베이지 / **베이지 + 검은 톤 단단** |

→ **사진 자체 = grayscale 직전 paradigm 단단 확정**. 즉:
- `grayscale 효과` 사용자 시각 차이 ** 약함 사실** (사진 자체 회색 단단)
- `scale 효과` 사용자 시각 ** 명확 사실** (사진 확대 직접 시각)
- `brightness 효과` 사용자 시각 ** 미세 사실** (사진 톤 약간 밝아짐)
- `shadow 효과` 사용자 시각 ** 명확 사실 단단** (카드 lift + depth 사용자 단단)

### 사진 화질 사실

- 사진 = 896×1200 jpg (analysis + guide + data) + 1376×768 (glossary)
- rest 카드 사진 render size = ~120-160px width × ~90-120px height
- scale-105 (5% 확대) 사후 = ~126-168px width / **사진 깨짐 영역 0 사실 단단** (jpg native + render 약 12% 단독 사용)
- scale-110 (10% 확대 / 후보 3) 사후 = ~132-176px width / **사진 깨짐 영역 0 사실 단단**

---

## 4. /insight 카드 정보 위계 일관 검수 사실

### 사전 외관 사실 (rest 카드 / InsightHubLayout.tsx:158-193)

```
┌─────────┬──────────────────────────────────┐
│ 사진 │ eyebrow (브랜드 green / uppercase) │
│ 120- │ title (h3 / black / 15-17px) │
│ 160px │ subtitle (line-clamp-1 / 12-13px) │
│ │ publishedAt (date / 11-12px) │
└─────────┴──────────────────────────────────┘
```

**정보 위계 사실**:
- eyebrow = 카테고리 식별 paradigm (uppercase tracking 0.06em / 11-12px)
- title = 메인 정보 paradigm (font-bold / line-clamp-2 / 15-17px)
- subtitle = 보조 정보 paradigm (line-clamp-1 / 12-13px / gray-500)
- date = 메타 정보 paradigm (11-12px / gray-400)

### hover 사후 정보 추가 reveal 잠재 사실

후보별 reveal paradigm 잠재:
- 후보 1/4/5: 정보 위계 영역 0 (정보 reveal 영역 0)
- 후보 3: eyebrow opacity 0.5 → 1 (정보 점진 reveal)
- Code 자율 추가 paradigm: **화살표 (CTA "→") translateX(4px) + opacity reveal** 잠재 (사전 ListingPickerCard ArrowRight paradigm 일관 / 단 rest 카드 ArrowRight 영역 0 사실 = 카드 추가 element 의무 paradigm)

---

## 5. 모바일 사실 일관 검수 사실

### `@media (hover: hover)` 분기 paradigm 의무

**현 paradigm 사실 (InsightHubLayout.tsx:160-163)**:
```typescript
<motion.div
 whileHover={{ y: -4 }}
 transition={{ duration: 0.3 }}
>
```

- motion `whileHover` = mouse hover paradigm 단독 적용 사실 (모바일 touch 자동 비활성)
- 단 CSS `:hover` paradigm = 모바일 sticky :hover 잠재 (touch 사후 hover 상태 잔존)

### 정정 paradigm 의무

후보 적용 시점 = `@media (hover: hover) { ... }` 안 분기 의무:

```css
@media (hover: hover) {
 section.bg-white .grid > div:hover { ... }
 section.bg-white a:hover > div[class*="aspect-"] { ... }
}
```

**모바일 active state 추가 paradigm 잠재**:
- 모바일 tap = `:active` 단순 paradigm (translate scale 영역 0)
- 또는 motion `whileTap={{ scale: 0.98 }}` (sub paradigm)

---

## 6. Code 의견 + 추천 단단

### 후보별 분석 사실

| 후보 | 강점 | 약점 | Code 평가 |
|---|---|---|---|
| **후보 1 Premium Editorial** | 검증된 표준 / 명확한 시각 / 안전 paradigm | 차별화 약함 (일반 web standard 일관) | ★★★★ |
| 후보 2 Spotlight Reveal | premium SaaS / mouse interactivity | JS 추가 + state management 부하 + 정적 screenshot NG + 모바일 영역 0 | ★★ (작업 부하 ↑) |
| 후보 3 Image Zoom + Reveal | 사진 강조 강함 / editorial paradigm | scale-110 = 사진 깨짐 영역 사실 0 단단 / 단 정보 reveal paradigm 약함 | ★★★ |
| 후보 4 Minimal Lift + Border | 담백 / Linear 일관 / minimal craft | "풍성" 의뢰 부족 / border 시각 효과 약함 사실 | ★★ |
| **후보 5 Premium Editorial++ (Code 자율)** | 다층 효과 (lift + scale + shadow + title craft) / Stripe + Linear + Vercel 통합 / "담백 + 풍성 균형" 의뢰 정합 | shadow layer 부담 잠재 (단 hardware acceleration paradigm 정합) | ★★★★★ |

### Code 추천 단단

**후보 5 (Premium Editorial++) 채택 추천 단단**:

**사유 5건**:
1. **다층 효과 paradigm**: lift (-4px) + 사진 scale-105 + brightness-105 + layered shadow (2 layer) + title underline decoration = 단순 paradigm 풍성 paradigm 단단 정합
2. **사진 사실 일관**: 사진 자체 회색 paradigm = grayscale 영역 0 / scale + brightness 효과 사용자 시각 명확 사실 단단
3. **Stripe + Linear + Vercel 통합**: tinted shadow (Stripe) + interaction density (Linear) + cubic-bezier easing (Vercel) 단단 통합 paradigm
4. **사용자 의뢰 "담백 + 풍성 균형" 정합**: minimal craft (subtle underline + 미세 brightness) + premium depth (layered shadow) = 균형 paradigm 단단
5. **영구 룰 일관**: motion v12.38.0 + Tailwind v4 단독 (신규 npm NG) + `@media (hover: hover)` 분기 paradigm + brand-green alpha 영구 일관

### 추가 권고 단단

**권고 1 — 화살표 (ArrowRight) 추가 paradigm 검토**:
- rest 카드 사전 ArrowRight 영역 0 사실 단단
- title 옆 또는 카드 우하 ArrowRight 추가 + `group-hover:translate-x-1 group-hover:text-[var(--brand-green)]` paradigm = CTA 강조 paradigm
- 사전 HomeInsight ArrowRight paradigm 일관 ([HomeInsight.tsx:83-87](src/components/home/HomeInsight.tsx#L83-L87))
- **권고 paradigm**: 후보 5 + ArrowRight 추가 = 후보 5+ paradigm 단단

**권고 2 — Editor's Pick 카드 동일 paradigm 적용 의무**:
- 사전 paradigm 사실 = Editor's Pick + rest 카드 paradigm (motion.div whileHover y:-4 단독 동등)
- 후보 5 적용 시점 = Editor's Pick + rest 카드 paradigm 정합 의무 (CSS selector )

**권고 3 — `@media (hover: hover)` 분기 paradigm 단단 적용 의무**:
- 모바일 sticky :hover paradigm 회피 paradigm 단단
- motion whileHover paradigm 정합 사실 (touch 자동 비활성 / 단 CSS :hover 추가 paradigm 분기 의무)

---

## 7. screenshot 한계 사실 (재명시)

정적 image = **hover transition motion 표현 약함 사실 단단**:
- cubic-bezier easing 시각 표현 NG (정적 image)
- brightness filter 사용자 시각 미세 사실 (정적 image 잠재)
- shadow 사용자 시각 명확 사실 (정적 image 정합)

→ **사용자 직접 확인 paradigm 권장 단단** (dev server local 또는 production deploy 사후).

---

## 다음 단계

1. **형준님 시각 비교 + 결정 의뢰** (후보 1 / 2 / 3 / 4 / 5 / Code 자율 다른 paradigm )
2. **결정 사후 = work_011_정정.md 산출** (Opus / hover paradigm + chip 정리 통합 paradigm)
3. **Code 진행** = 정정 자율 실행
4. **production 검수** (형준님 / Vercel deploy 사후)

---

## 산출 artifact 사실

- [docs/work-011-research-3.md](docs/work-011-research-3.md) — 본 회신 markdown
- [scripts/diagnostics/screenshot-insight-candidates.mjs](scripts/diagnostics/screenshot-insight-candidates.mjs) — Playwright 산출 script (4 후보 재실행 가능)
- `/tmp/insight-cand{1,3,4,5}-{static,hover}.png` — 8 screenshot 산출 사실 (본 채팅 직접 표시 정합)
