# work-011 추가 사전 조사 회신 — /insight 카드 hover 외관 결정 사전 사실

> **결론 단단**: 메모리 사전 사실 ("grayscale → group-hover grayscale-0 + scale-105") = **/insight Hub page paradigm 영역 0 / 홈 페이지 HomeInsight 섹션 paradigm 정합 사실**. 즉 형준님 메모리 두 페이지 paradigm 혼동 사실 단단.
> **추가 사실**: /insight Hub page 사진 (베이지 + 회색 + 검은 톤) 색감 = 이미 grayscale 직전 paradigm → grayscale hover 효과 시각 차이 약함 사실 단단.
> **추가 NG 식별 사실 2건**: /data 카테고리 빈 paradigm + /glossary chip = guide 흡수 paradigm (사용자 칩 클릭 paradigm UX NG 잠재).

---

## Q1. git log 변경 사실 파악

### git history chain 검수 사실

| commit | 시점 | paradigm |
|---|---|---|
| `73d5721` | v37 | InsightHubLayout 사전 paradigm + InsightThumbnail component 분리 |
| `be846bd` | v38 Phase A | **InsightThumbnail component /insight 폐기** + motion.div whileHover y:-4 직접 inline paradigm 전환 사실 |
| `55f90eb` | v41 | InsightThumbnail.tsx 안 (홈 페이지 사용처) `whileHover y:-8 → -4` (subtle paradigm) + `group-hover:scale-105 + brightness-105` 영구 보존 + commit message = "InsightThumbnail hover 복원" |
| `f553608` | cycle 1-G-γ-α | /service 폐기 + 메인 재구성 → InsightThumbnail.tsx **파일 자체 폐기 사실** |
| `5e5a59c` | cycle 8 | "Insight detail Magazine Editorial Card paradigm" (사후 산출 잔존 paradigm) |
| `ff4cf62` | v39 | PageHero 도입 (4 sub-page) |

### 단단 paradigm 식별 사실

**현 시점 사실 단단**:
- InsightThumbnail.tsx **파일 자체 영역 0** (cycle 1-G-γ-α 사후 폐기 사실)
- /insight Hub page = InsightHubLayout.tsx motion.div `whileHover y:-4` 단독 paradigm
- **grayscale paradigm = `src/components/home/HomeInsight.tsx:66` (홈 페이지 Insight 섹션) 단독 잔존 사실**

### 메모리 ↔ 사실 식별 단단

**사용자 메모리 사실 NG 단단**:
- 메모리 = "/insight 카드 hover = grayscale + scale-105"
- 사실 = **홈 페이지 HomeInsight 섹션 (`/components/home/HomeInsight.tsx:43-93`) paradigm = grayscale + hover:-translate-y-1** 정합
- 사실 = /insight Hub page (별개 페이지 / `InsightHubLayout.tsx`) paradigm = whileHover y:-4 + scale 영역 0 + grayscale 영역 0

→ **형준님 메모리 두 페이지 paradigm 혼동 사실 단단 확정**.

### 홈 페이지 HomeInsight 사실 정합 (src/components/home/HomeInsight.tsx:43-93)

```typescript
<Link
 href={`/insight?cat=${tile.slug}`}
 className="group flex aspect-[4/1] flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white transition-transform duration-300 ease-out hover:-translate-y-1 ..."
>
 {/* 좌 이미지 (w-1/2) */}
 <div className="relative w-1/2 overflow-hidden bg-[var(--color-ink-100)]">
 <Image
 src={`/images/insight/${tile.slug}.jpg`}
 className="object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
 />
 </div>
 {/* 우 텍스트 (w-1/2) */}
 <div className="flex w-1/2 flex-col justify-between p-5 sm:p-7">
 ...
 </div>
</Link>
```

→ **메모리 사실 정합 (aspect-[4/1] split / grayscale → grayscale-0 / hover:-translate-y-1)**.
→ 단 메모리 "scale-105" 사실 NG (실제 = `-translate-y-1` 사실).

---

## Q2. /insight Hub 카드 사진 + 콘텐츠 외관 사실

### 콘텐츠 inventory (현 시점 사실)

- **Editor's Pick (active=all 시점)**: analysis 1 건 (`2026타경500459` / "보증금 1.88억 인수 오피스텔, HUG 말소동의로 1.25억 진입선")
- **rest 카드 2 건**:
 - guide 1: "입찰가, 얼마에 써내야 할까" (낙찰가 산정의 3가지 기준 / 2026.04.11)
 - guide 2: "경매란 무엇인가" (법원 부동산 경매의 기초부터 / 2026.04.10)

### 사진 외관 사실 (3 카테고리)

| 사진 | file | size | 색감 사실 |
|---|---|---|---|
| analysis.jpg | 896×1200 | 735 KB | 사무실 + 베이지 양복 남성 + 데스크탑 모니터 / **베이지 + 회색 + 자연 빛 paradigm** |
| guide.jpg | 896×1200 | 641 KB | 사무실 + 회색 + 검은 양복 paradigm / **회색 + 콘크리트 + 흰 / 미니멀 paradigm** |
| data.jpg | 896×1200 | 734 KB | 사무실 + 신문 읽기 남성 / **베이지 + 검은 + 자연 빛 paradigm** |
| glossary.jpg | 1376×768 | 163 KB | (별개 검수 영역) |

### grayscale 효과 시각 차이 사실 (Playwright screenshot 직접 검수)

본 사실 단단:
- 사진 자체 색감 = **이미 grayscale 직전 paradigm** (베이지 + 회색 + 검은 톤 + 자연 빛 단단 / 컬러풀 영역 0)
- grayscale 적용 사후 = 사용자 시각 차이 영역 ** 약함 사실 단단**

→ **옵션 B (grayscale paradigm) 사용자 시각 효과 약함 사실 단단** = 사진 자체 영구 보존 paradigm 그대로 시각 paradigm 비슷 사실.

---

## Q3. 시각 비교 산출 방식 결정 사실 + Playwright 사실

### Playwright 사전 설치 사실 정합

- `package.json` `playwright@^1.59.1` 사전 설치 사실 (신규 npm NG 정합 / CLAUDE.md 정합)
- `node_modules/playwright` 정합 사실
- → **방식 B (Playwright screenshot) 채택 단단**

### 방식 비교 사실

| 방식 | 채택 사실 | 사유 |
|---|---|---|
| A. Preview branch 3건 | ✗ 폐기 | 작업 부하 + 분기 commit 3건 + production deploy 3건 |
| **B. Playwright screenshot** | **✓ 채택** | Playwright 사전 설치 사실 + dev server local 산출 + 신규 npm NG + 분기 commit NG + 안전 paradigm |
| C. URL param toggle | ✗ 폐기 | 임시 코드 추가 + production deploy paradigm = 코드 정정 영역 0 사전 조사 단계 영역 외 |
| D. 다른 방식 | ✗ 폐기 | B 단단 정합 |

---

## 시각 비교 산출 사실 (방식 B 채택)

### 산출 image 6건 (rest 카드 영역 + non-hover + hover 양쪽)

| label | file | paradigm |
|---|---|---|
| A-static | `/tmp/insight-rest-a-static.png` | 현 paradigm / non-hover |
| A-hover | `/tmp/insight-rest-a-hover.png` | 현 paradigm / hover (whileHover y:-4) |
| B-static | `/tmp/insight-rest-b-static.png` | 메모리 paradigm / non-hover (grayscale 적용) |
| B-hover | `/tmp/insight-rest-b-hover.png` | 메모리 paradigm / hover (grayscale-0 + scale-105) |
| C-static | `/tmp/insight-rest-c-static.png` | 통합 paradigm / non-hover (grayscale 적용) |
| C-hover | `/tmp/insight-rest-c-hover.png` | 통합 paradigm / hover (y:-4 + grayscale-0 + scale-105) |

### 시각 비교 분석 사실

**Option A (현 = whileHover y:-4 단독)**:
- static: 컬러 사진 + 정상 paradigm
- hover: 카드 4px 상단 이동 + 사진 변화 영역 0
- → 사용자 시각 = **매우 단순 paradigm / 사진 변화 영역 0 / 4px translate motion 단독**

**Option B (메모리 = grayscale + scale-105 / whileHover y 영역 0)**:
- static: grayscale 적용 사진 + 텍스트 paradigm
- hover: grayscale-0 (컬러 복원) + scale-105 (사진 5% 확대)
- → 사용자 시각 = **사진 색감 변화 + 확대 paradigm / 카드 자체 translate 영역 0**
- → 단 사진 색감 자체 grayscale 직전 paradigm 사실 = **시각 차이 약함 사실 단단**

**Option C (통합 = y:-4 + grayscale + scale-105)**:
- static: grayscale 적용 사진 + 정상 paradigm
- hover: 카드 4px 상단 이동 + grayscale-0 + scale-105
- → 사용자 시각 = **풍성 paradigm (translate + 색감 + 확대 통합)**

### Screenshot 한계 사실

정적 image = hover transition motion 약함 paradigm. 사용자 직접 확인 paradigm 권장 단단:
- dev server local 직접 확인 paradigm
- 또는 production deploy 사후 hover paradigm 확인

---

## Q4. 추가 NG 식별 사실 (hover 외 영역)

### NG 식별 2건 + 별개 검수 1건

#### NG 1. /data 카테고리 빈 paradigm (콘텐츠 0 건)

**사실**:
- /insight Hub chip 5건 = 전체 / 무료 물건분석 / 경매 가이드 / 경매 용어 / 경매 빅데이터
- "경매 빅데이터" chip 클릭 사후 = 콘텐츠 0 건 / "아직 콘텐츠가 없습니다" 표시
- 사용자 paradigm UX NG 잠재 사실 단단 (빈 chip 사용자 시각 신뢰도 ↓)

**정정 후보**:
- 옵션 1: chip 자체 영구 폐기 (4 chip → 3 chip paradigm)
- 옵션 2: chip 잔존 + "Coming soon" 또는 사전 paradigm 안내
- 옵션 3: Cowork 영역 data mdx 콘텐츠 1+ 건 추가 paradigm (별개 work )

#### NG 2. /glossary chip = guide 흡수 paradigm

**사실** (`InsightHubLayout.tsx:44`):
```typescript
if (chip === "glossary") return posts.filter((p) => p.chip === "guide");
```

- "경매 용어" chip 클릭 = guide 콘텐츠 동일 표시 paradigm
- 사용자 paradigm = guide chip + glossary chip 동일 콘텐츠 paradigm = UX 혼란 잠재
- chip 2건 (guide + glossary) → 동일 콘텐츠 paradigm 사용자 시각 신뢰도 ↓

**정정 후보**:
- 옵션 1: glossary chip 영구 폐기 (4 chip → 3 chip paradigm)
- 옵션 2: glossary 별개 콘텐츠 카테고리 추가 paradigm (Cowork 영역 / 별개 work)
- 옵션 3: chip 잔존 + 흡수 paradigm 사용자 명시 (NG 시각 영역 0 paradigm)

#### 별개 검수 1. /analysis 카테고리 콘텐츠 1 건 단독

**사실**:
- /content/analysis = 1 건 (`2026타경500459.mdx`) — Editor's Pick paradigm 단독 표시
- /content/analysis/archive = 3 건 (보관 paradigm / Hub 영역 0)
- 사용자 의도 = "풍성" paradigm 부족 사실 = Cowork 영역 콘텐츠 추가 paradigm (별개 work / Claude Code 영역 외)

---

## Q5. 추천 결정 의뢰 (Opus 결정 단단 영역)

### 추천 결정 의뢰 항목 4건

#### 결정 1. /insight Hub page hover paradigm 결정

**상황 사실**: 형준님 메모리 = 홈 페이지 HomeInsight paradigm 사실 정합 / /insight Hub page = 별개 paradigm.

**옵션**:
- (a) /insight Hub page 현 paradigm 영구 보존 (whileHover y:-4 단독) + 홈 페이지 grayscale paradigm 별개 보존
- (b) /insight Hub page 홈 페이지 paradigm 정합 (grayscale + scale-105 + whileHover 영역 0 / 사진 효과 약함 사실 의식 단단)
- (c) /insight Hub page 통합 paradigm (whileHover y:-4 + grayscale + scale-105 / 풍성)
- (d) 다른 paradigm

#### 결정 2. /data 카테고리 빈 paradigm 결정

옵션:
- (i) chip 영구 폐기 (4 → 3 chip)
- (ii) chip 잔존 + "Coming soon" 안내
- (iii) Cowork 영역 별개 work (data mdx 콘텐츠 1+ 건 추가)

#### 결정 3. /glossary chip = guide 흡수 paradigm 결정

옵션:
- (i) glossary chip 영구 폐기 (4 → 3 chip)
- (ii) glossary 별개 콘텐츠 카테고리 (Cowork / 별개 work)
- (iii) chip 잔존 + 흡수 paradigm 명시

#### 결정 4. 본 work 범위 결정

옵션:
- (1) hover paradigm 단독 정정 (work-011)
- (2) hover + /data 빈 + /glossary 흡수 + 추가 NG 통합 정정 (work-011 확장)
- (3) 본 사전 조사 단단 종료 + Cowork 영역 분리 paradigm (사전 work-011 회신 추천 정합)

### Code 추천 단단 사실

**결정 1 추천**: 옵션 **(a) 또는 (b)** 단단 추천 / 옵션 (c) 시각 차이 미미 사실 = 추천 영역 .
- (a) 사유 = /insight Hub page 별개 페이지 paradigm / 홈 페이지 = " " paradigm 별개 의도 단단
- (b) 사유 = paradigm 일관성 통일 단단 paradigm (홈 페이지 ↔ /insight Hub 동일 paradigm)

**결정 2 추천**: 옵션 **(i) chip 영구 폐기** 단단 추천 / 사유 = 사전 paradigm 신뢰도 ↑ + Cowork 영역 사전 작업 분리 단단 + chip 4 → 3 정합 paradigm

**결정 3 추천**: 옵션 **(i) glossary chip 영구 폐기** 단단 추천 / 사유 = 흡수 paradigm 사용자 시각 NG + chip 동일 콘텐츠 paradigm 신뢰도 ↓ + 4 → 3 chip 단순화 paradigm

**결정 4 추천**: 옵션 **(2)** 단단 추천 / 사유 = hover 단독 정정 영역 / chip 정리 통합 paradigm 사용자 시각 일관 영구 보존 단단 / Cowork 영역 = 별개 work 분리 단단

---

## 다음 단계

1. **형준님 + Opus 결정 회수 (4건)**
2. **결정 사후 = work-011 정정 markdown 산출** (Opus / 페이지 단단)
3. **Code 진행** = 정정 자율 실행
4. **production 검수** (형준님 / Vercel deploy 사후)

## 산출 artifact

- `docs/work-011-research-2.md` (본 회신)
- `scripts/diagnostics/screenshot-insight-hover.mjs` (Playwright 1차 screenshot 산출)
- `scripts/diagnostics/screenshot-insight-side-by-side.mjs` (Playwright 2차 산출 / non-hover + hover 양쪽)
- `/tmp/insight-option-{a,b,c}.png` + `-full.png` (1차 산출 / 페이지 전체)
- `/tmp/insight-rest-{a,b,c}-{static,hover}.png` (2차 산출 / rest 카드 영역 단단)
