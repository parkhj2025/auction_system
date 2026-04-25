# 콘텐츠 원 소스 규격 v3

> **작성일**: 2026-04-24
> **대체 대상**: [content-source-v2.md](./content-source-v2.md) (이력 보존, 사용 중단)
> **배경**: v2는 Cowork가 `post.md` frontmatter에 13개 이상의 필수 필드를 평탄하게 담는 것을 요구했으나, 베타 1호 검수(2024타경505827)에서 Cowork가 실제로는 `meta.json`에 구조화 정보를 담는 패턴으로 산출함을 확인. 동시에 Phase 8 디자인 확정 시 UI 필드 요구가 변동될 것을 전제하면 현 시점에서 frontmatter를 고정하는 비용이 크다고 판단.
> **v3 철학**: Cowork는 **원 소스의 정확성과 파일 존재**만 책임진다. 웹 페이지를 위한 frontmatter·템플릿·디자인 종속 구조는 전부 Code가 publish 파이프라인 단계에서 가공한다.

---

## 1. 책임 분리

| 영역 | Cowork 책임 | Code 책임 |
|------|-------------|-----------|
| 담당 산출물 | `raw-content/{caseNumber}/` 폴더 1개 | `content/analysis/{slug}.mdx`, 웹 페이지 |
| 규격 범위 | 원 소스 파일 6종 존재 + 내용 정확성 + 내용 금지 규칙 | frontmatter 설계, 템플릿, 디자인 적용, 렌더링, 발행 |
| 변경 주기 | 사건 단위 (콘텐츠 생성 시) | Phase 전환 시(7→8→9) 템플릿·필드 재편 가능 |
| 변경 영향 격리 | Cowork 스키마 변경 시 Code `publish` CLI만 수정 | UI 재설계 시 Cowork 원 소스는 불변 |

**경계 원칙 (CLAUDE.md §13과 정합)**:
- "콘텐츠를 **어떻게 만드는가**" → Cowork
- "만들어진 콘텐츠를 **어떻게 웹에 싣는가**" → Code

v3에서 이 경계가 보다 엄격해집니다. Code는 Cowork가 넘긴 원 소스의 **frontmatter 형태를 요구하지 않고**, `meta.json`을 1차 원소스로 직접 파싱합니다.

---

## 2. 폴더 구조

각 콘텐츠 1건 = 폴더 1개. 폴더명은 사건번호(한글 포함).

```
raw-content/
└── {caseNumber}/                          ← 예: 2024타경505827
    ├── meta.json                          ← 1차 원소스 (구조화 데이터)
    ├── post.md                            ← 2차 원소스 (본문 Markdown)
    ├── data/
    │   ├── pdf_text.txt                   ← 두인옥션 PDF 원본 텍스트
    │   ├── crawler_summary.json           ← 네이버 크롤러 결과
    │   └── photos_meta.json               ← 대법원 사진 메타
    └── images/
        └── photos/
            ├── 000241_전경_01.jpg
            ├── ...
            └── 000247_기타_01.jpg
```

### v2와의 파일명 변경

| v2 규격 | v3 규격 | 비고 |
|---------|---------|------|
| `data/crawler.json` | `data/crawler_summary.json` | 베타 1호 실제 패턴 수용 |
| 나머지 | 동일 | |

기타 파일(`README.md`, `.DS_Store`, `data/parsed.json` 등)은 **허용하되 Code는 무시**합니다. 존재해도 오류가 아니고 부재해도 오류가 아닙니다.

---

## 3. `meta.json` — 1차 원소스 스키마

Code의 publish 파이프라인이 이 파일을 **파싱하여 웹 페이지의 모든 구조화 정보를 추출**합니다. 베타 1호(2024타경505827) 구조를 기반으로 정의합니다.

### 3-1. 최상위 키

| 키 | 타입 | 필수 | 설명 |
|----|------|------|------|
| `schema` | string | ✓ | 원 소스 버전 식별자. 현재 `"auction-content/raw-v1"` 권장. Cowork 스킬 버전과 독립. |
| `case_number` | string | ✓ | 사건번호 (한글 포함). 폴더명과 일치해야 함. |
| `court` | string | ✓ | 법원명 (예: `"인천지방법원"`) |
| `court_division` | string | ✓ | 경매계 (예: `"경매10계"`) |
| `court_code` | string | ✓ | 법원 코드 (예: `"B000240"`) |
| `bid_date` | string (YYYY-MM-DD) | ✓ | 매각기일 |
| `bid_time` | string (HH:MM) | ✓ | 매각시각 |
| `property` | object | ✓ | §3-2 참조 |
| `price` | object | ✓ | §3-3 참조 |
| `hero` | object | - | §3-4 참조. 있으면 렌더 시 사용, 없으면 property·price에서 파생 |
| `highlights` | array | - | §3-5 참조. 상세 페이지 하이라이트 카드 |
| `card` | object | - | §3-6 참조. 목록·SNS 카드용 |
| `sections` | object | - | §3-7 참조. 본문 7섹션 구조화 요약 |
| `market_data` | object | ✓ | §3-8 참조. 시세 요약 |
| `photos` | object | ✓ | §3-9 참조. 사진 URL 맵 |
| `crawler_summary` | object | - | §3-10 참조. 크롤러 메타 |
| `seo` | object | - | §3-11 참조. tags, seoTags |
| `published_at` | string (YYYY-MM-DD) | ✓ | 발행일 |
| `packaged_at` | string (ISO 8601) | - | 패키지 생성 시각 |

**필수/선택 판단 기준**: 필수(✓)는 부재 시 publish abort. 선택(-)은 부재해도 통과, Code가 없이도 렌더할 fallback 준비.

### 3-2. `property`

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `address` | string | ✓ | 전체 소재지 |
| `sido` | string | ✓ | 시·도 |
| `sigungu` | string | ✓ | 시·군·구 |
| `dong` | string | ✓ | 법정동 |
| `name` | string | - | 단지명 |
| `building` | string | - | 동 (예: `"101동"`) |
| `floor` | string | - | 층 |
| `ho` | string | - | 호수 |
| `type` | string | ✓ | 물건 종류 (예: `"오피스텔(주거)"`) |
| `auction_type` | string | ✓ | 경매 구분 (예: `"청산을위한형식적경매"`, `"임의경매"`) |
| `building_area_m2` | number | ✓ | 전용 ㎡ |
| `building_area_pyeong` | number | ✓ | 전용 평 |
| `land_area_m2` | number | - | 대지권 ㎡ |
| `land_area_pyeong` | number | - | 대지권 평 |

### 3-3. `price`

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `appraisal` | number | ✓ | 감정가 (원) |
| `appraisal_display` | string | ✓ | 한글 표기 (예: `"2억 4,700만원"`) |
| `min_price` | number | ✓ | 회차 최저가 (원) |
| `min_price_display` | string | ✓ | 한글 표기 |
| `min_rate` | number | ✓ | 감정가 대비 % |
| `bid_round` | number | ✓ | 회차 |
| `deposit_rate` | number | - | 입찰보증금율 (%, 재경매 시 20) |
| `deposit_amount` | number | - | 입찰보증금 (원) |
| `deposit_display` | string | - | 한글 표기 |

### 3-4. `hero`

```json
{
  "image": "images/photos/000241_전경_01.jpg",
  "image_url": "https://{supabase}/court-photos/.../0.webp",
  "headline": "...",
  "sub_headline": "...",
  "price_badge": "..."
}
```

전 필드 선택. Code는 없으면 `property.name` + `price.min_price_display` 조합으로 자동 생성.

### 3-5. `highlights`

```json
[
  { "label": "...", "value": "..." },
  ...
]
```

배열 항목 수 권장 3~6개. 상세 페이지에서 요약 카드로 렌더. 없으면 Code는 `sections`에서 발췌.

### 3-6. `card`

```json
{
  "title": "...",
  "summary": "...",
  "cover_image": "https://{supabase}/...",
  "tags": ["..."],
  "seo_tags": ["..."]
}
```

목록 페이지 카드·OpenGraph 메타·SNS 공유용 요약. `tags`/`seo_tags`는 §3-11과 동일 값을 중복 보관해도 무방.

### 3-7. `sections`

7섹션 요약 구조. 각 섹션 키는 고정:

```
sections.01_overview
sections.02_bid_history
sections.03_rights
sections.04_market
sections.05_investment
sections.06_sale_history
sections.07_opinion
```

각 섹션은 최소 `title` + `summary`를 포함, 섹션별로 추가 구조화 필드를 담을 수 있습니다(예: `03_rights.basis_date`, `04_market.sale_avg`, `05_investment.scenarios.*` 등). Code는 렌더 시 필요한 필드만 선택적으로 읽습니다. 추가 필드가 늘어도 Code는 깨지지 않습니다.

### 3-8. `market_data` (v3.3 — 통계 명사 표준 채택)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `sale_count` | number | ✓ | 매매 건수 |
| `sale_avg` | number | ✓ | 매매 평균 (원) |
| `sale_median` | number | - | 매매 중위 |
| `sale_min` | number | - | 매매 최저 |
| `sale_max` | number | - | 매매 최고 |
| `lease_count` | number | - | 전세 건수 |
| `lease_avg` | number | - | 전세 평균 보증금 |
| `lease_median` | number | - | 전세 중위 |
| `lease_min` | number | - | 전세 최저 |
| `lease_max` | number | - | 전세 최고 |
| `rent_count` | number | - | 월세 건수 |
| `rent_avg` | number | - | 월세 평균 월세 |
| `rent_deposit_avg` | number | - | 월세 평균 보증금 |
| `tier_final` | string | - | 크롤러 확장 단계 (예: `"T1"`, `"T3"`) |
| `scope_expansion` | array | - | T1→T2 등의 확장 이력 |
| `total_listings` | number | - | tier 내 전체 매물 수 (필터 전) |
| `complex_listings_count` | number | - | 본 단지 매물 수 |
| `complex_avg` | number | - | 본 단지 평균 매매가 |
| `complex_median` | number | - | 본 단지 중위 매매가 |
| `min_vs_complex_avg_pct` | number | - | 최저가 ÷ 본 단지 평균 (%) |

**v3.2 이전 필드명 호환** (베타 1호 패턴): `avg_sale_price` / `avg_lease_deposit` / `avg_rent_monthly` / `avg_rent_deposit`는 publish CLI가 fallback으로 인식. Cowork v2.4 이후 산출물은 본 §3-8 표준(`sale_avg` 등) 사용 권장.

출처 표기(`source`)는 삭제. 본문에서 네○○ 마스킹 규칙으로 처리.

### 3-9. `photos`

```json
{
  "total": 16,
  "category_distribution": { "000241": 10, "000244": 1, ... },
  "used": [ "...jpg", ... ],
  "unused": [ "...jpg", ... ],
  "url_map": {
    "000241_전경_01.jpg": "https://{supabase}/court-photos/B000240/{docid}/0.webp",
    ...
  },
  "fetched_at": "2026-04-24T14:45:00+09:00"
}
```

**v3.3 표준 (베타 2호 이후)**:
- `used` 배열을 1차 참조. 배열 원소는 본문에 박힌 절대 URL과 동일하거나 파일명만 표기.
- `url_map`은 **선택**. 베타 1호 호환을 위해 publish CLI는 두 형태를 모두 처리.
- 본문(`post.md`)은 **Supabase URL 절대경로를 직접** 박는 방식 권장. 상대경로(`images/photos/{filename}`)도 허용 — publish CLI가 `url_map` 또는 `used` 배열로 매핑.
- 대법원 원본 JPG(`images/photos/*`)는 **선택**. v3.3에서 필수 폴더 요구 폐지(§6 불변식 4 완화).
- 별도 이미지 복사·업로드는 여전히 **없음**.

### 3-10. `crawler_summary`

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `sale_count` | number | - | |
| `lease_count` | number | - | |
| `rent_count` | number | - | |
| `tier_final` | string | - | |
| `expansion` | array | - | 크롤러 확장 이력 |
| `crawled_at` | string | - | |

`market_data`와 중복되는 필드는 `market_data`를 우선. `crawler_summary`는 감사용.

### 3-11. `seo`

```json
{
  "tags": ["...", "..."],
  "seo_tags": ["...", "..."]
}
```

- `tags`: 사실 라벨 3~8개 (§4-2 내용 규칙 준수)
- `seo_tags`: 검색 유입용 태그 (상한 30개)

---

## 4. `post.md` — 2차 원소스

### 4-1. 역할

본문 Markdown 7섹션. Code는 이 본문을 **그대로** MDX로 감싸 `content/analysis/{slug}.mdx`로 복사합니다. 본문 변환·요약·재조립 없음.

### 4-2. 본문 규칙

| 규칙 | 내용 |
|------|------|
| **H1** | 선택. 있으면 허용, 없으면 Code가 `meta.json.card.title` 또는 `meta.json.hero.headline`으로 자동 주입. |
| **H2 섹션** | `## 01 물건 개요` ~ `## 07 종합 의견` + `## 면책 고지`. 권장이되 Code는 섹션 개수·순서를 검증하지 않음. |
| **이미지** | `![alt](images/photos/{파일명})` 상대 경로. Code가 렌더 시 `meta.json.photos.url_map`을 참조해 Supabase URL로 치환. |
| **alt** | 일반어 (예: `"건물 외관"`, `"실내 전경"`). 카테고리 코드·파일명 금지. |
| **상표 마스킹** | `네○○ 부동산` 또는 `네ㅇㅇ 부동산` 둘 다 허용. 단 `네이버` 리터럴은 금지. |
| **톤** | 존댓말 (`~합니다`). AI 슬롭 금지. 숫자·팩트 중심. |
| **표** | Markdown 표준 파이프 문법. |
| **CTA** | 본문에 포함 금지. Code가 템플릿에서 주입. |
| **면책** | `## 면책 고지` 섹션에 면책고지·업무범위·시세정보 3항목 포함. |

### 4-3. Frontmatter (v3.3 — Code 측 무시 정책)

**v3.3 명시**: post.md의 frontmatter는 **publish CLI가 무시**합니다. 1차 원소스는 항상 `meta.json`.

- Cowork는 자체 검증·디버그용으로 post.md 최상단에 frontmatter를 둘 수 있음. 그러나 Code는 `gray-matter`로 frontmatter를 분리한 뒤 **본문(content)만** 사용.
- frontmatter와 meta.json이 다른 값을 가져도 Code는 meta.json만 신뢰.
- 결과적으로 publish CLI의 출력 mdx의 frontmatter는 **meta.json만으로 결정**되며 post.md frontmatter의 영향 없음.

이는 v3 본 정신("meta.json 1차 원소스") 일관성 + Cowork 자체 검증 자유도 양립을 위한 v3.3 정책.

---

## 5. `data/` 파일 규격

### 5-1. `data/pdf_text.txt`

두인옥션 PDF 원본 텍스트. UTF-8, 페이지 마커 `=== PAGE N ===` 권장. Code는 파싱하지 않음. 감사·재현·디버깅용.

### 5-2. `data/crawler_summary.json`

네이버 크롤러 T1~T5 결과. 권장 구조는 [docs/naver-land-crawler-macos.md](./naver-land-crawler-macos.md) §4-2 JSON 스키마와 동일(경매물건/유사매물_매매/전세/월세/시세요약/매물유형분포/검색조건/crawled_at/_all_articles_raw). Code는 필요 시 `유사매물_*` 접근, 1차 원소스는 `meta.json.market_data`.

### 5-3. `data/photos_meta.json`

대법원 사진 메타. `meta.json.photos`와 중복되며 Code는 `meta.json.photos`를 우선. 이 파일은 감사용.

---

## 6. `images/photos/` 규격

### 6-1. 파일명

`{카테고리코드}_{한글명}_{순번2자리}.{확장자}`

예: `000241_전경_01.jpg`, `000245_내부_03.jpg`

### 6-2. 카테고리 코드 (7종)

| 코드 | 한글명 |
|------|--------|
| 000241 | 전경 |
| 000242 | 감정평가 |
| 000243 | 현황조사 |
| 000244 | 매각물건 |
| 000245 | 내부 |
| 000246 | 등기부 |
| 000247 | 기타 |

### 6-3. 역할 (v3.3 — 선택 폴더화)

대법원 원본 JPG. **웹페이지에 사용되지 않음** — 웹페이지는 `meta.json.photos.url_map` 또는 `meta.json.photos.used`(v3.3 표준)의 Supabase URL을 참조합니다.

**v3.3 변경**: 본 폴더는 **선택**. 베타 2호 이후 산출물은 데이터 중복 회피 목적으로 폴더 자체를 생략 가능. 베타 1호는 폴더 보유 형태도 호환.

---

## 7. 내용 검증 규칙 (publish CLI abort)

Code의 publish 파이프라인이 실행 시점에 자가 검증. 아래 규칙 위반 시 **abort**, Cowork 재발행 요구.

### 7-1. 분류어 금지 (CLAUDE.md §13 원칙 5)

`meta.json.*.summary` · `meta.json.card.summary` · `meta.json.card.title` · `meta.json.hero.headline` · `post.md` 본문 전체에 아래 어휘 감지 시 abort:

```
학습용, 교육 사례, 안전 사례, 위험 물건, 투자 매력, 적합한, 실습용,
추천, 주의 물건, 초보 추천, 교훈, 배울 수 있는
```

### 7-2. 내부 분류 필드 부재

`meta.json` 및 frontmatter 전체에서 다음 필드가 **존재하면 abort**:
- `category`
- `riskLevel`
- `tags[].type`

### 7-3. `네이버` 리터럴 자동 마스킹 (v3.5 — abort 폐기, 자동 치환)

`post.md` 본문에 `네이버` 리터럴이 발견되면 publish CLI가 mdx 출력 직전(transformBody 단계)에 **자동으로 `네○○`로 치환**한다.

- 적용 대상: `post.md` 본문(content) 전체.
- 치환 패턴: `/네이버/g` → `네○○` (전역 치환, 이미 `네○○`/`네ㅇㅇ`로 마스킹된 곳은 변경 없음).
- abort 정책 폐기: v3.4까지의 콘텐츠 룰 abort는 본 항목에서 제거. Cowork가 마스킹을 누락해도 Code가 보정.
- `meta.json` 내 문자열 필드는 본 v3.5 범위 외(베타 3호 케이스에서는 0건이라 후속 결정).
- 마스킹 표기 `네○○`·`네ㅇㅇ` 둘 다 허용.

### 7-4. `tags`는 `string[]`

`meta.json.card.tags` · `meta.json.seo.tags` · `meta.json.seo.seo_tags`는 문자열 배열이어야 함. 객체 혼재 시 abort.

### 7-5. `title` 접두·접미 금지

`meta.json.hero.headline` 또는 `meta.json.card.title`이 아래 패턴 매칭 시 abort:
- 접두 `[오늘의 무료 물건분석]` 또는 유사 시리즈 접두어
- 접미 `· {caseNumber}` 형태

---

## 8. 불변식 (Invariants) — v3

Code가 신뢰할 수 있는 고정 조건. 위반 시 Cowork 버그.

1. 폴더명 = `meta.json.case_number`
2. `meta.json` 1개 존재
3. `post.md` 1개 존재
4. `data/crawler_summary.json`, `data/photos_meta.json` 2개 존재 (v3.3: `data/pdf_text.txt`는 **선택**으로 완화)
5. `meta.json`의 필수 필드(§3-1의 ✓) 전부 충족
6. `meta.json.photos.url_map` 또는 `meta.json.photos.used`의 모든 URL이 HTTP 200 응답 가능(빌드 시 Code가 검증). v3.3: `images/photos/` 로컬 폴더는 **선택**.
7. `post.md`에서 참조한 모든 이미지 — 상대경로(`images/photos/*`)인 경우 `meta.json.photos.url_map`에 매핑 또는 `images/photos/` 폴더에 실재 / 절대 URL인 경우 즉시 통과.
8. `post.md`에 `## 면책 고지` 섹션 존재 + 면책고지·업무범위·시세정보 3항목 포함
9. 내용 검증 규칙(§7) 전부 통과

**v2 대비 축소**: 구조 규칙(H1 필수, 섹션 8개 고정, frontmatter 13개 필드 등)은 전부 제거. 내용 규칙과 최소 파일 존재만 남김.

**v3.3 완화**: 항목 4·6·7에서 `pdf_text.txt`·`images/photos/` 폴더·상대경로 강제를 완화하여 베타 2호 이후 산출물(데이터 중복 회피·본문 절대 URL 직박)을 수용.

---

## 9. Cowork → Code 전환 절차 (Phase 7 파이프라인)

```
1. Cowork가 raw-content/{caseNumber}/ 폴더 투입 (원 소스 6종)
         ↓
2. 형준님 (또는 Code) 수동 실행:  pnpm publish {caseNumber}
         ↓
3. Code publish CLI 동작:
   - raw-content/{caseNumber}/meta.json 파싱
   - §7 내용 검증 실행 (위반 시 abort)
   - slug 생성: case_number.replace("타경", "-")  →  "2024-505827"
   - content/analysis/{slug}.mdx 생성:
       * frontmatter: Code가 meta.json에서 추출 (필드 설계는 Phase별 변경 가능)
       * 본문: post.md 그대로 복사 + 이미지 경로 치환(url_map)
       * H1 부재 시 meta.json.hero.headline 자동 주입
         ↓
4. pnpm build → /analysis/{slug} 페이지 생성
```

---

## 10. 이미지 파이프라인 운영 규칙

콘텐츠 생산·발행 과정에서 사진 처리에 관한 운영 규칙. v3.1에서 신설(2026-04-25 진단 결과 반영).

### 10-1. docid 컨벤션

`court_listings.docid`는 우리 시스템 내부 식별자이며 대법원이 발급하는 docid와 **별개의 컨벤션**입니다.

**형식**: `{courtCode}-{caseNumberDigits}-{itemSeq}`

| 컴포넌트 | 규칙 | 예 |
|---------|------|-----|
| `courtCode` | `scripts/crawler/codes.mjs`에 정의된 7자리 (예: B000240, B000241, B000212) | `B000241` |
| `caseNumberDigits` | "YYYY타경NNN..." 사건번호 중 **순번 숫자만** (연도·"타경" 제외). 정규식 `/(\d+)[^\d]+(\d+)/`의 match[2] | `49993` (5자리) / `527667` (6자리) / `1234567` (7자리) |
| `itemSeq` | maemulSer (item_sequence). mokmulSer 아님 | `1` |

**제약**:
- ASCII-only (Supabase Storage key 제약)
- 한글 포함 금지
- 구현: [scripts/seed-photos.mjs](../scripts/seed-photos.mjs) `makeDocid` 함수

**예**:
- 인천지법 2024타경527667 item 1 → `B000240-527667-1`
- 부천지원 2022타경2716 item 1 → `B000241-2716-1`
- 서울남부지법 2023타경118641 item 1 → `B000212-118641-1`

### 10-2. `photos_unavailable` 처리 규칙

사진 endpoint(§10-5) 응답이 0장인 사건에 대한 처리.

**마킹 동작 (사진 0장 시)**:
1. `seed-photos.mjs`는 사진 endpoint 응답 사진 수가 0장일 때 **에러가 아닌 정상 종료**(exit 0).
2. `court_listings` 행에 다음을 기록:
   - `photos = []` (빈 배열)
   - `photos_count = 0`
   - `photos_fetched_at` 현재 시각
   - `raw_snapshot.photos_unavailable = true`
   - `raw_snapshot.photos_unavailable_marked_at` ISO 8601
   - `raw_snapshot.photos_unavailable_reason` (현재 메시지: `"csPicLst empty in selectAuctnCsSrchRslt.on at fetch time. Other channels not investigated."` — v3.2 신규 endpoint 전환 후 새 케이스가 발생하면 새 reason 메시지로 갱신 가능)

**자동 해제 동작 (재시드로 사진을 받게 된 경우)**:
1. 동일 docid에 대해 sed-photos.mjs를 재실행해 사진 수신에 성공하면, `court_listings.raw_snapshot`에서 다음 3개 키를 **자동 제거**한다:
   - `photos_unavailable`
   - `photos_unavailable_marked_at`
   - `photos_unavailable_reason`
2. 동시에 추적 목적으로 `photos_unavailable_cleared_at` (ISO 8601)을 기록.
3. 같은 트랜잭션의 UPDATE에서 `photos`/`photos_count`/`photos_fetched_at`도 새 값으로 갱신.

**의도**:
- 자동화 파이프라인이 무한 재시도 루프에 빠지지 않도록 마킹.
- 단정적 판정 회피. 다른 채널 존재 가능성은 열어둠. 추가 추적은 ROI 낮아 보류.
- 새 endpoint 전환·사이트 정책 변경 등으로 사진을 다시 받게 되면 자동 해제 → 부정확한 마킹 영구화 방지.
- `photos.ts`의 캐시 hit 분기는 `photos_fetched_at`을 보고 재호출하지 않음.

**실측 사례 (2026-04-25)**:
- selectAuctnCsSrchRslt.on 사용 단계: 부천지원 2024타경49993·서울남부지법 2023타경118641 → `photos_unavailable=true` 마킹 후 정상 종료.
- selectPicInf.on 전환 후(v3.2): 위 두 사건 모두 사진 수신(49993=9장·118641=12장) → `photos_unavailable` 자동 해제 + `photos_unavailable_cleared_at` 기록.

### 10-3. Endpoint 룰 vs UI 룰 (독립적)

대법원 경매정보의 "검색 가능 여부"와 "사진 노출 여부"는 채널마다 **독립적인 룰**.

| 채널 | 룰 |
|------|-----|
| **대법원 사이트 UI** (사용자가 브라우저로 검색) | 매각기일 기준 **D-14 이내**의 사건만 검색 노출 (사이트 정책) |
| **selectPicInf.on API** (§10-5, 우리 코드가 사진 수집에 사용) | **D-day 무관**. 검증한 모든 사건(D-3 ~ D-48, 본원·지원 모두)에서 정상 사진 수신. |
| ~~selectAuctnCsSrchRslt.on API~~ (구 사용 endpoint, v3.2 폐기) | 사건 검색용으로 사진은 부수적으로만 반환. **인천 본원에서만 우연히 작동**했고 다른 법원에서는 csPicLst 비어 있음. v3.2부터 사진 수집에 사용하지 않음. |

**시사점**:
- UI에서 안 보인다고 API로도 안 받아오는 것은 아님 (예: 인천지법 527667 D-48은 UI 미노출이지만 사진 endpoint로 8장 정상 수신).
- 두 룰은 **완전히 분리해서 분석**해야 함.
- 과거 selectAuctnCsSrchRslt.on의 0장 응답을 "사건 데이터 부재"로 해석했던 가설은 v3.2에서 기각됨 — 단순히 **잘못된 endpoint를 호출**했을 뿐이며, 정답 endpoint(selectPicInf.on) 호출 시 사진이 정상 수신됨.

### 10-4. 사진 미수신 사건의 콘텐츠 발행 처리

`photos_unavailable=true` 사건도 콘텐츠 자체는 발행 가능. 처리 분기:

**Code 측 콘텐츠 파이프라인 (publish CLI)**:
- `meta.json.photos.url_map`이 비어 있거나 모든 URL이 `photos_unavailable` 사건을 가리키면:
  - **히어로 이미지**: SKIP. 텍스트 헤더만으로 렌더.
  - **본문 인라인 이미지**: SKIP. 마크다운 image syntax 제거 또는 placeholder.
  - **본문 자체는 정상 발행**. 권리분석·시세비교·수익시뮬 등 텍스트 정보는 그대로.
- 카드/목록 페이지의 thumbnail: 일반화된 fallback 사용 (디자인 단계에서 확정).

**Cowork 측 블록 2 (콘텐츠 생성 단계)**:
- 대법원 사진 페처 호출 결과 `photos_count = 0`이면 **에러가 아닌 정상 종료**.
- post.md 본문에 사진 인라인 마크다운을 넣지 않음 (또는 넣되 Code가 SKIP).
- 발행 차단 사유로 사용 금지.

**대외 표기**:
- 사진 미수신 사실을 노출하지 않음. 사용자에게 "사진 없음" 등의 부정 메시지는 표시하지 않고, 시각적으로 텍스트 콘텐츠 중심으로 자연스럽게 렌더.

### 10-5. 사진 endpoint 명세 — selectPicInf.on (PGJ15BP06)

대법원 경매정보 사이트의 사진 팝업이 호출하는 **사진 전용 endpoint**. v3.2부터 우리 사진 수집의 정답 endpoint.

#### 엔드포인트

```
POST /pgj/pgj15B/selectPicInf.on
```

#### 헤더 (필수)

```
Content-Type:    application/json;charset=UTF-8
Accept:          application/json, text/plain, */*
Origin:          https://www.courtauction.go.kr
Referer:         https://www.courtauction.go.kr/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml
SC-Userid:       NONUSER
SC-Pgmid:        PGJ15BP06
submissionid:    mf_wfm_mainFrame_dspslGdsReltPicPopUp_wframe_sbm_selectPicInfoLst
sec-ch-ua:       (Chrome 147 위장)
Cookie:          (세션 2단계 초기화로 획득)
```

세션 초기화는 기존과 동일: `GET /` → `GET /pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml`.

#### `csNo` 인코딩 규칙 (확정)

`caseNumber` ("YYYY타경NNN..." 형식) → `csNo` (14자리 숫자):

```
csNo = YYYY + "0130" + zeroPad6(NNN...)
```

| 컴포넌트 | 길이 | 의미 |
|---------|------|------|
| YYYY | 4 | 연도 |
| `01` | 2 | 사건종류 = 타경 |
| `30` | 2 | 상수 |
| NNNNNN | 6 | 사건번호, 6자리 zero-padding |

검증된 4건:
- `2024타경49993` → `20240130049993`
- `2022타경2716` → `20220130002716`
- `2024타경527667` → `20240130527667`
- `2023타경118641` → `20230130118641`

구현: [scripts/seed-photos.mjs](../scripts/seed-photos.mjs) `encodeCsNo` 함수.

#### 페이지네이션 패턴 (2단계 호출)

**1차 호출 — totalCnt 획득** (`totalYn="Y"`, `pageSize=1`):

```json
{
  "dma_pageInfo": {
    "pageNo": 1, "pageSize": 1,
    "bfPageNo": "", "startRowNo": "",
    "totalCnt": "", "totalYn": "Y"
  },
  "dma_srchPicInf": {
    "cortOfcCd": "B000241",
    "csNo": "20240130049993",
    "ordTsCnt": "",
    "auctnInfOriginDvsCd": "",
    "pgmId": "PGJ15BP06",
    "cortAuctnPicDvsCd": "",
    "flag": ""
  }
}
```

응답에서 `data.dma_pageInfo.totalCnt`(N) 추출.

**2차~N차 호출 — 사진 수신** (`totalYn="N"`, `flag="1"`, `pageNo=1..N`):

```json
{
  "dma_pageInfo": {
    "pageNo": p,           ← 1..totalCnt
    "pageSize": 1,
    "bfPageNo": "",
    "startRowNo": "",
    "totalCnt": "<N>",     ← 1차에서 받은 값
    "totalYn": "N"
  },
  "dma_srchPicInf": {
    /* 1차와 동일하되 */
    "flag": "1"
  }
}
```

각 호출 응답에서:
- `data.picLst[0]` — base64 사진 (string, 평균 200~300KB)
- `data.dlt_csPicLst[0]` — 사진 메타 (`cortAuctnPicDvsCd`, `cortAuctnPicSeq`, `pageSeq`, `picTitlNm`, `picDscrCtt`)

**Rate limit 친화**: 페이지마다 250ms 간격 권장.

#### 응답 구조 요약

```
data.dma_csBaseInfo            ← 사건 메타 (사용 안 함)
data.dlt_csPicDvsCnt           ← 카테고리별 카운트 (4 카테고리)
data.dlt_csPicAllLst           ← 위와 동일 구조
data.dlt_csPicLst[0]           ← ★ 현재 페이지 사진 메타
data.picLst[0]                 ← ★ 현재 페이지 사진 base64
data.dma_pageInfo              ← totalCnt / pageNo 등
```

### 10-6. 향후 통합 후보 endpoint (Phase 2+)

현재 우리 코드는 사진 수집(selectPicInf.on)과 사건 목록 크롤링(searchControllerMain.on, scripts/crawler/)만 사용. 아래 endpoint들은 사이트가 사용하는 것으로 식별됐으나 우리 운영에는 아직 포함되지 않음. **Phase 2 이후** 통합 검토 대상.

| Endpoint | 용도 | 통합 시 효과 |
|----------|------|-------------|
| `/pgj/pgj002/selectCortOfcLst.on` | 전국 법원 매핑(공식) | `scripts/crawler/codes.mjs`의 정적 매핑을 동적 갱신 가능. 신규 지원 추가 자동 감지. |
| `/pgj/pgj002/selectCortOfcDeptLst.on` | 법원별 경매계 부서 | 사건 담당계 자동 식별 (현재는 두인옥션 PDF에 기재된 것 사용). |
| `/pgj/pgj15B/selectAuctnCsSrchRslt.on` (PGJ15AF01) | 사건 메타 (사진 외) | 권리분석·임차인·등기 정보 자동 수집. |
| `/pgj/pgj15B/selectCsDtlDxdyDts.on` | 회차 이력 (변경/유찰/매각/낙찰/미납) | 두인옥션 PDF의 입찰경과 표 자동 대체. |
| `/pgj/pgj15B/selectDlvrOfdocDtsDtl.on` | 송달 이력 | 사건 진행 상태 추적. |
| `/pgj/scframe/lib/sccd/list.on` | 시스템 코드표 (BID_DVS_CD 등) | 정적 상수 동적 검증. |

**통합 보류 사유**: Phase 1의 본 스코프는 두인옥션 PDF + 네이버 시세 + 대법원 사진 3종으로 충분. 위 endpoint들은 자동화 범위 확장(Phase 2 이후 콘텐츠 생산 자동화·실시간 사건 추적) 시점에 검토.

**작업 금지 (현재 시점)**:
- 위 endpoint 통합을 Phase 1 범위 내에서 추진 금지.
- court_code 매핑은 정적(`codes.mjs`) 그대로 유지.

### 10-7. publish CLI 매핑 우선순위 (v3.4 — Cowork v2.5 카피라이팅 정합)

Cowork v2.5에서 카피라이팅이 자동 호출되며 **카피 적용본**과 **archive 패턴**(legacy 단지명+회차 표기)이 같은 산출물에 공존하기 시작함. publish CLI가 어느 필드를 카피 본으로 인정할지 본 절에서 고정.

#### title 우선순위

```
title = meta.json.hero.headline ?? meta.json.card.title ?? ""
```

이유:
- `hero.headline`이 v2.5 카피 표준 위치 (메인 노출용 카피 본).
- `card.title`은 v2.5 시점에서 **archive 패턴**으로 출력될 수 있음 (단지명·회차 등). archive·SNS 카드 분리 결정은 Cowork 영역. publish CLI는 hero를 우선 신뢰.
- v3.3 §4-3 정책상 `post.md` frontmatter는 publish CLI가 무시. 카피 본이 frontmatter에만 있다면 사용 안 됨.

#### archive_* 필드 명시 폐기

다음 필드는 publish CLI가 **AnalysisFrontmatter 매핑 단계에서 명시적으로 제외**한다. mdx 노출 0건.

| 필드 | 위치 |
|------|------|
| `hero.archive_headline` | meta.json.hero.archive_headline |
| `hero.archive_sub_headline` | meta.json.hero.archive_sub_headline |
| `archive_title` (frontmatter) | post.md YAML frontmatter (이미 §4-3로 무시) |

미래에 추가될 `*.archive_*` 패턴 필드도 동일 정책. archive는 Cowork 자체 검증·SNS 별도 출력용으로만 보관.

#### `published_at` / `updated_at` ISO normalize

`meta.json.published_at` 또는 기존 mdx의 `updatedAt`이 ISO timestamp(`"2026-04-25T22:00:00+09:00"`)인 경우 publish CLI가 `slice(0, 10)`으로 정규화 (`"2026-04-25"`).

이유:
- AnalysisFrontmatter는 `publishedAt: string (YYYY-MM-DD)` 권장.
- 베타 2호(2024타경527667) `published_at`이 ISO timestamp로 들어왔는데 처음 force와 두 번째 force 사이 형식 차이로 byte-identical 회귀가 깨지는 사례 발생 (v3.3 단계).
- normalize 적용 후: ISO 입력이 들어와도 출력은 항상 `YYYY-MM-DD`로 안정 → byte-identical 회귀 보장.

normalize 적용 대상:
- `meta.json.published_at` → `frontmatter.publishedAt`
- 멱등 검사 시 기존 mdx의 `updatedAt` 재사용 분기

normalize 동작 사양:
```
function normalizeDate(v):
  if v is not string: return v
  if v has format /^YYYY-MM-DD$/: return v (변경 없음)
  if v has format /^YYYY-MM-DD.+$/: return v[:10]
  else: return v (예외 케이스는 정규화 안 함, 위반 시 §7 검증으로 후속 처리)
```

---

## 11. Phase 변화 대응

| Phase | 영향 |
|-------|------|
| 7 (현재) | publish CLI 초판 구현. 최소 필드 매핑으로 1건 렌더 확인. |
| 8 (디자인) | 디자인 시스템 확정 시 frontmatter 필드·템플릿 재설계. **publish CLI의 frontmatter 매핑만 수정**. Cowork 원 소스 불변. 전체 raw-content 재발행으로 일괄 반영. |
| 9 (기술 관문) | 이미지 최적화·Lighthouse 기준 재측정. publish CLI에 `next/image` 최적화 옵션 등 추가 가능. |
| 10 (론칭) | 법률 검토 통과한 면책 고지 텍스트를 Code 측 템플릿 상수로 중앙화. post.md의 면책 섹션은 Code가 덮어쓸 수 있음(Cowork 원 소스는 불변, 렌더만 교체). |

v3 규격은 Phase 7~10 전체 생애주기에서 Cowork 측 재작업 없이 유지되도록 설계되었습니다.

---

## 12. v2와의 차이 요약

| 항목 | v2 | v3 |
|------|----|----|
| 1차 원소스 | `post.md` frontmatter (필수 13개 필드) | `meta.json` 구조화 |
| post.md frontmatter | 필수 13+ 필드 | 선택, Code는 meta.json 우선 |
| H1 요구 | 필수 | 선택 (Code가 자동 주입) |
| `crawler.json` 파일명 | `crawler.json` | `crawler_summary.json` (베타 1호 수용) |
| 상표 마스킹 | `○` (U+25CB) 고정 | `○` 또는 `ㅇ` 둘 다 허용 |
| 불변식 개수 | 12개 | 9개 |
| 분류어 금지 리스트 | 일부 | 확장 (교훈·배울 수 있는 추가) |
| 이미지 참조 | 로컬 경로 | Code가 `meta.json.photos.url_map`로 Supabase URL 치환 |
| docid 컨벤션 | 미정의 | §10-1 명시 |
| photos_unavailable 처리 | 미정의 | §10-2 명시 (정상 종료 + 마킹 / 자동 해제) |
| 사진 수집 endpoint | (관행적 selectAuctnCsSrchRslt.on, 인천 본원만 동작) | §10-5 명시 (selectPicInf.on PGJ15BP06, 전 법원 동작) |
| csNo 인코딩 | (caseNumber 그대로 전달) | §10-5 명시 (`YYYY0130NNNNNN` 14자리) |
| Cowork 스킬 재작업 | 매 Phase 전환마다 가능성 | Phase 7~10 동안 고정 (변경은 v4로 승인) |

---

## 13. 버전 관리 정책

- v1 → v2 → v3는 이력 보존 (폐기된 버전 문서도 저장).
- v3에서 v4로 갈 경우는 본 문서 §1~12 범위에서 **Cowork 원 소스 스키마의 본질적 변경**이 있을 때. 표현층 변경은 publish CLI만 수정하면 되므로 v3로 충분.
- 운영 규칙(§10) 변경은 minor 증가(v3.1, v3.2 …)로 처리. 형준님 승인 후 변경 이력에 기록.
- 형준님 승인 + Opus 검토 후 버전 증가.

---

## 14. 변경 이력

| 버전 | 날짜 | 변경 |
|------|------|------|
| v1 | 2026-04-21 | 초안. 실제 샘플 역공학. |
| v2 | 2026-04-21 | 원칙 5 위반 차단: category·riskLevel 삭제, tags 평탄화, title·summary 분류어 금지. |
| v3 | 2026-04-24 | **전면 재설계**. Cowork 책임을 "원 소스 정확성"으로 축소, `meta.json`을 1차 원소스로 공식화, post.md frontmatter 필수 요구 폐기, Phase 8~10 디자인 변동에 Cowork 원 소스가 영향받지 않도록 경계 재정립. 베타 1호(2024타경505827) 패턴 수용. |
| v3.1 | 2026-04-25 | §10 "이미지 파이프라인 운영 규칙" 신설 (docid 컨벤션 / photos_unavailable 처리 / endpoint vs UI 룰 분리 / 사진 미수신 사건의 콘텐츠 발행 처리). 기존 §10·11·12·13 → §11·12·13·14로 재배열. 49993·118641 진단 결과 반영. |
| v3.2 | 2026-04-25 | **사진 수집 endpoint 정정**. 형준님 캡처로 selectAuctnCsSrchRslt.on(PGJ15BM01)이 사건 검색용이며 사진은 부수적·인천 본원에서만 우연히 동작했음을 확인. 진짜 사진 endpoint는 selectPicInf.on(PGJ15BP06). §10-3 표 정정 + §10-5 신규 (csNo 14자리 인코딩 / 2단계 페이지네이션 / 응답 구조) + §10-6 신규 (Phase 2+ 통합 후보 endpoint 6종 메모) + §10-2 자동 해제 동작 추가. v3.1 photos_unavailable 가설("사건 데이터 부재")은 잘못된 endpoint 호출의 결과였음이 확인되어 §10-3에서 기각 명시. 검증: 6건 재시드(인천 본원 2건 회귀 0 + 부천지원·서울남부 4건 사진 정상 수신, 전수 PROD API 일치). |
| v3.3 | 2026-04-25 | **베타 2호(2024타경527667) 호환 완화**. Cowork v2.4 산출물의 합리적 진화를 수용. (1) §3-8 market_data 필드명을 통계 명사 표준(`sale_avg`/`sale_median`/`lease_avg`/`rent_avg`/`rent_deposit_avg`/`tier_final`/`scope_expansion`/`complex_*` 등)으로 채택. v3.2 이전 필드명(`avg_sale_price` 등)은 publish CLI fallback. (2) §3-9 photos에서 `used` 배열을 1차 표준으로 채택, `url_map`은 베타 1호 호환용 선택. (3) §4-3 frontmatter 처리 정책 명시 — post.md frontmatter는 publish CLI가 무시(meta.json 단일 source of truth). (4) §6-3 `images/photos/` 폴더 선택 폴더화. (5) §8 불변식 4·6·7 완화 (pdf_text·images/photos·상대경로 강제 폐기). 본문 이미지는 상대경로/절대 URL 양쪽 허용. publish CLI는 두 형태 모두 처리. |
| v3.4 | 2026-04-25 | **Cowork v2.5 카피라이팅 정합**. 베타 3호(2025타경507598) 검증으로 발견된 archive·카피 공존 패턴에 대응. §10-7 신설 — (1) title 우선순위 명시: `hero.headline ?? card.title ?? ""` (hero가 v2.5 카피 표준 위치). (2) archive_* 필드 명시 폐기 — `hero.archive_headline`·`hero.archive_sub_headline`·frontmatter `archive_title`은 매핑 단계에서 제외, mdx 노출 0건. (3) `published_at`/`updated_at` ISO timestamp normalize 룰 — 입력이 ISO이면 `slice(0, 10)`으로 정규화 적용. byte-identical 회귀 보장. v3.3 §4-3·§7 본 룰 유지 (네이버 마스킹 abort, post.md frontmatter 무시). |
| v3.5 | 2026-04-26 | **`네이버` 리터럴 자동 마스킹**. §7-3의 abort 정책을 폐기하고 publish CLI 측 자동 치환으로 변경. post.md 본문에 `네이버` 발견 시 mdx 출력 직전 transformBody 단계에서 `/네이버/g → 네○○` 전역 치환. Cowork가 마스킹을 누락해도 Code가 보정. 적용 대상은 본문(content)에 한정, meta.json 문자열 필드는 v3.5 범위 외. 베타 3호(2025타경507598)에서 본문 3건의 `네이버` 자동 마스킹 검증. 베타 1·2호는 본문에 `네이버` 0건이라 회귀 0. |
