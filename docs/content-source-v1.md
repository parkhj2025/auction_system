# 콘텐츠 산출물 규격 v1 — 원천 자료 정의

> 작성일: 2026-04-21
> 목적: Cowork가 생성하는 콘텐츠 산출물의 구조·스키마·규칙을 고정하여, 이 산출물을 원천 자료로 삼아 Claude Code가 웹 페이지로 변환하는 Phase 7 작업의 기준 규격으로 삼는다.
> 기반: 실제 산출물 1건(2024타경46918) 관측 기준 역공학(reverse-engineering).
> 표기: 2026-04-21 작성된 `대법원이미지_코워크_워크플로우_v1.md`의 출력 규격 섹션(§5)의 표기. 본 문서가 대체한다.

---

## 1. 규격의 범위

Cowork는 본 규격에 맞는 산출물을 생성하여 콘텐츠의 원천 자료를 제공하고, Code는 이 원천 자료를 입력으로 받아 자사 웹 콘텐츠 페이지로 변환한다.

- **Cowork 책임**: 본 규격대로 산출. 폴더 구조·파일명·frontmatter 스키마·본문 규칙 준수.
- **Code 책임**: 본 규격 외 포맷의 파싱 대응은 선언. 규격 변경 시 본 문서 개정 선행.
- **변경 통제**: 규격 변경은 형준님 승인 + Opus 검토 후 버전 올림. Cowork·Code 양쪽 동시 반영.

---

## 2. 폴더 구조

각 콘텐츠 1건은 하나의 폴더 단위로 산출된다. 폴더명은 사건번호.

```
{caseNumber}/
├── post.md                       ← 본문 Markdown + YAML frontmatter
├── data/
│   ├── pdf_text.txt              ← 두인옥션 PDF 원본 텍스트
│   ├── crawler.json              ← 네이버 부동산 크롤러 결과
│   └── photos_meta.json          ← 대법원 사진 메타데이터
└── images/
    └── photos/                   ← 대법원 원본 이미지
        ├── {카테고리코드}_{한글명}_{순번}.jpg
        └── ...
```

**예시**: `2024타경46918/`
**폴더명 규칙**: `YYYY타경NNNNN` (한글 포함). 복수 물건번호일 경우 규칙 별도 확정 필요(한 사안의 단일 물건).

---

## 3. post.md 규격

### 3-1. 파일 구조

```
---
(YAML frontmatter)
---

# {title}

{본문 Markdown}
```

### 3-2. Frontmatter 스키마

| 필드 | 타입 | 필수 | 설명 | 샘플 값 |
|---|---|---|---|---|
| `caseNumber` | string | ✓ | 사건번호 | `"2024타경46918"` |
| `court` | string | ✓ | 법원(지원 포함) | `"인천지방법원 부천지원"` |
| `courtDivision` | string | ✓ | 경매계 | `"경매1계"` |
| `bidDate` | string (YYYY-MM-DD) | ✓ | 매각기일 | `"2026-06-09"` |
| `bidTime` | string (HH:MM) | ✓ | 매각시각 | `"10:00"` |
| `address` | string | ✓ | 전체 소재지 | `"경기 부천시 소사구 송내동 315-3, 202동 5층 504호 (송내역파인트리지움2단지)"` |
| `sido` | string | ✓ | 시·도 | `"경기도"` |
| `sigungu` | string | ✓ | 시·군·구 | `"부천시 소사구"` |
| `dong` | string | ✓ | 동 | `"송내동"` |
| `buildingName` | string | - | 단지명(있는 경우) | `"송내역파인트리지움2단지"` |
| `ho` | string | - | 호수(있는 경우) | `"504호"` |
| `propertyType` | string | ✓ | 물건 종류 | `"아파트"` / `"다세대주택"` / `"오피스텔"` 등 |
| `auctionType` | string | ✓ | 경매 구분 | `"임의경매"` / `"강제경매"` |
| `areaM2` | number | ✓ | 전용 ㎡ | `74.9964` |
| `areaPyeong` | number | ✓ | 전용 평 | `22.7` |
| `landAreaM2` | number | - | 대지권 ㎡ | `39.7103` |
| `landAreaPyeong` | number | - | 대지권 평 | `12.0` |
| `appraisal` | number | ✓ | 감정가(원 단위) | `652000000` |
| `minPrice` | number | ✓ | 회차 최저가(원 단위) | `456400000` |
| `percent` | number | ✓ | 감정가 대비 % | `70.0` |
| `round` | number | ✓ | 회차 | `2` |
| `appraisalDisplay` | string | ✓ | 감정가 한글 표기 | `"6억 5,200만원"` |
| `minPriceDisplay` | string | ✓ | 최저가 한글 표기 | `"4억 5,640만원"` |
| `category` | string | ✓ | 내부 분류(UI 비노출) | `"safe"` / `"caution"` / `"danger"` 등 |
| `riskLevel` | string | ✓ | 위험도(UI 비노출) | `"low"` / `"medium"` / `"high"` |
| `tags` | array<{text, type}> | ✓ | UI 표시용 태그 | `[{text: "임차인 없음", type: "safe"}, ...]` |
| `seoTags` | array<string> | ✓ | SEO용 태그 리스트 | `["경매", "경매입찰", ...]` |
| `title` | string | ✓ | 콘텐츠 타이틀 | `"[오늘의 무료 물건분석] ..."` |
| `summary` | string | ✓ | 목록/메타 설명용 요약 (2~3문장) | - |
| `coverImage` | string | ✓ | 썸네일 경로(원본) | `"images/photos/000241_전경_01.jpg"` |
| `publishedAt` | string (YYYY-MM-DD) | ✓ | 발행일 | `"2026-04-21"` |
| `marketData` | object | ✓ | 시세 요약 (하위 스키마 §3-3) | - |

### 3-3. `marketData` 하위 스키마

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `avgSalePrice` | number | ✓ | 매매 평균가 (원) |
| `saleCount` | number | ✓ | 매매 매물 건수 |
| `avgLeasePrice` | number | ✓ | 전세 평균 보증금 (원) |
| `leaseCount` | number | ✓ | 전세 매물 건수 |
| `avgRentDeposit` | number | - | 월세 평균 보증금 |
| `avgRentMonthly` | number | - | 월세 평균 월세 |
| `rentCount` | number | - | 월세 매물 건수 |
| `source` | string | ✓ | 데이터 출처 표기 (네○○ 마스킹 적용) |

### 3-4. `tags[].type` 허용값

현 샘플 관측: `safe`, `neutral`.
예상 확장: `warning`, `danger`, `opportunity`.
신규 확장 시 본 문서 개정.

### 3-5. 본문 Markdown 규칙

- **H1**: `title`과 동일. 1회만.
- **섹션 헤더**: `## 01 물건 개요` ~ `## 07 종합 의견` + `## 면책 고지`. 총 8개.
- **이미지 인라인**: `![alt 텍스트](images/photos/{파일명})`. alt는 일반어(예: "건물 외관", "실내 전경"). 카테고리 코드 명칭 금지.
- **상표 마스킹**: 네이버 부동산 → `네○○ 부동산`. 두인옥션·지지옥션 등 데이터 출처도 동일 적용.
- **톤**: 존댓말 (~합니다). AI 슬롭 금지. 숫자와 팩트 중심.
- **테이블**: Markdown 표준 파이프 문법.
- **CTA 본문 미포함**: 전환 CTA(카카오톡 문의 / 자세히 알아보기 등)는 본문에 포함하지 않는다. Phase 7 웹 변환 단계에서 삽입한다.
- **면책 고지**: `## 면책 고지` 섹션에 다음 3항목 포함. (전문가 의뢰 권고는 상세정보 항목 말미에 통합)
  - 면책고지
  - 업무범위
  - 상세정보 (전문가 의뢰 권고 통합)

---

## 4. data/ 파일 규격

### 4-1. `data/pdf_text.txt`

두인옥션 PDF에서 추출된 원본 텍스트. 디버깅·재현성·감사 용도.

- 포맷: 일반 텍스트
- 페이지 구분: `=== PAGE N ===` 마커
- 인코딩: UTF-8

Code는 원칙적으로 파싱하지 않는다. frontmatter·crawler.json이 이미 구조화 데이터를 제공한다.

### 4-2. `data/crawler.json`

네이버 부동산 크롤러 산출물. frontmatter `marketData`의 원본.

최상위 키:
- `경매물건`: {단지, 전용면적, 감정가, 최저가}
- `유사매물_매매`: array
- `유사매물_전세`: array
- `유사매물_월세`: array
- `시세요약`: object (marketData의 원소스)
- `매물수_분포`: object
- `crawled_at`: ISO timestamp
- `검색조건`: {sido, sigungu, 지역[], 면적범위, 총_매물수, 검색타입[], case_number}
- `_all_articles_raw`: array (네이버 API 원본, 감사용)

Code는 필요 시 `유사매물_*` 또는 `시세요약`을 참조할 수 있으나, 1차 원소스는 frontmatter `marketData`로 한다.

### 4-3. `data/photos_meta.json`

대법원 이미지 메타데이터.

스키마:
```json
{
  "case_number": "2024타경46918",
  "court_code": "B000241",
  "item_sequence": 1,
  "fetched_at": "2026-04-21T16:15:38",
  "total_count": 15,
  "saved_count": 15,
  "category_distribution": {"000241": 4, "000244": 2, ...},
  "files": [
    {"file": "000241_전경_01.jpg", "size": 227649, "category": "000241", "caption": "전경"},
    ...
  ]
}
```

Code는 이미지 목록을 필요할 때 이 파일을 신뢰한다. `files[].caption`은 저장 시점의 한글명이며, 최종 UI alt는 post.md 본문의 `![...]` alt 텍스트를 우선한다.

---

## 5. images/photos/ 규격

### 5-1. 파일명 규칙

```
{카테고리코드}_{한글명}_{순번2자리}.{확장자}
```

예: `000241_전경_01.jpg`

### 5-2. 카테고리 코드 (대법원 기준)

| 코드 | 한글명 | 성격 |
|---|---|---|
| 000241 | 전경 | 건물 외관 |
| 000242 | 감정평가 | 감정서 첨부 사진 |
| 000243 | 현황조사 | 법원 현장조사 |
| 000244 | 매각물건 | 매각명세서 첨부 |
| 000245 | 내부 | 실내 |
| 000246 | 등기부 | 등기 첨부 |
| 000247 | 기타 | 분류 외 |

물건마다 존재하는 카테고리·장수는 상이. 사건에 따라 특정 카테고리 유무 가능(예: 2024타경46918은 000242/243/246 없음).

### 5-3. 확장자

현 샘플: `.jpg`. 향후 `.webp` 혼재 가능. Code는 확장자를 파일명에서 추출하여 처리.

---

## 6. 산출물 불변식 (Invariants)

Code가 신뢰할 수 있는 고정 조건. 위반 시 Cowork 버그.

1. 폴더명 = `caseNumber` (frontmatter 값과 일치)
2. `post.md` 1개 반드시 존재
3. `data/pdf_text.txt`, `data/crawler.json`, `data/photos_meta.json` 3개 반드시 존재
4. frontmatter 필수 필드(§3-2 ✓) 전부 충족
5. 본문 H1 1개, H2 섹션 01~07 + 면책 고지
6. 본문에서 참조한 모든 `images/photos/*` 파일은 실제 존재
7. 네이버 상표 마스킹(`네○○ 부동산`) 적용
8. CTA 본문 미포함
9. 면책 3항목 포함

---

## 7. 미해결 판정 사항

본 규격 v1 확정 시점에 판정 필요한 2건. v2에서 반영.

**판정 A. 이미지 경로 익명화**
- 현: 이미지 경로 `images/photos/000241_전경_01.jpg` → 카테고리 코드·한글명이 브라우저 Network 탭에 노출
- 옵션: (a) 현행 유지 — 파일명은 UI 노출이 아니므로 원칙 5 위반 아님 / (b) 웹 변환 시 Code가 경로 익명화 (`/images/{hash}.jpg` 등)

**판정 B. 썸네일 생성 책임자**
- 현: frontmatter `coverImage`로 대법원 전경 원본 직접 사용
- 옵션: (a) 현행 유지 — SNS 카드·목록 페이지도 원본 전경 사용 / (b) Cowork가 가공 썸네일(텍스트 오버레이) 별도 생성 / (c) Phase 8 디자인 단계에서 처리

---

## 8. 본 문서 사용법

### Claude Code에게

본 문서는 Phase 7 작업의 **원천 자료 정의**다. Code는 아래 순서로 본 문서를 활용한다.

1. Phase 7 1단계 인스펙션 시 본 문서를 입력 스펙으로 참조
2. 콘텐츠 페이지 라우트(`/analysis/[slug]` 등) 설계 시 `caseNumber`를 slug 후보로 검토
3. 메타데이터 처리(next/metadata API) 시 frontmatter를 원소스로 사용
4. 이미지 경로 처리 방식은 §7 판정 A 확정 후 적용
5. 본 규격 외 필드는 무시. 확장 요청 시 본 문서 개정 선행

### Cowork에게 (하위디어 auction-blog 스크립트 업데이트 시 반영)

1. 본 규격을 스크립트 산출물 표준으로 고정
2. 신 기능 추가 시에도 본 규격 frontmatter 필드는 그대로 유지 (하위 호환)
3. `category`, `riskLevel`, `tags[].type` 허용값 확장 시 하위디어 → Opus 승인 후 본 문서 개정

---

## 9. 변경 이력

| 버전 | 날짜 | 변경 |
|---|---|---|
| v1 | 2026-04-21 | 초안. 실제 샘플 1건(2024타경46918) 관측 기준 역공학. |
