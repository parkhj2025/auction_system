# 콘텐츠 산출물 규격 v2 — 원천 자료 정의

> 작성일: 2026-04-21
> 목적: Cowork가 생성하는 콘텐츠 산출물의 구조·스키마·규칙을 고정하여, 이 산출물을 원천 자료로 삼아 Claude Code가 웹 페이지로 변환하는 Phase 7 작업의 기준 규격으로 삼는다.
> 기반: 규격 v1 + 브라우저 검수에서 확인된 원칙 5(내부 분류 라벨 비노출) 위반 4건의 원인을 원천에서 차단.
> v1 대비: 분류 필드(`category`, `riskLevel`, `tags[].type`) 전면 제거 + title 고정 접두/접미 금지 + summary 분류어 금지.

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

### 3-2. Frontmatter 스키마 (v1 대비 category·riskLevel 삭제, tags 타입 변경)

| 필드 | 타입 | 필수 | 설명 | 샘플 값 |
|---|---|---|---|---|
| `caseNumber` | string | ✓ | 사건번호 | `"2024타경46918"` |
| `court` | string | ✓ | 법원(지원 포함) | `"인천지방법원 부천지원"` |
| `courtDivision` | string | ✓ | 경매계 | `"경매1계"` |
| `bidDate` | string (YYYY-MM-DD) | ✓ | 매각기일 | `"2026-06-09"` |
| `bidTime` | string (HH:MM) | ✓ | 매각시각 | `"10:00"` |
| `address` | string | ✓ | 전체 소재지 | `"경기 부천시 소사구 송내동 315-3, 202동 5층 504호"` |
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
| `tags` | array<string> | ✓ | 사실 라벨 (v2: 단순 문자열 배열) | `["등기 전부 소멸", "2019 신축 단독", "공유자 우선매수권"]` |
| `seoTags` | array<string> | ✓ | SEO용 태그 리스트 | `["경매", "경매입찰", ...]` |
| `title` | string | ✓ | 콘텐츠 타이틀 (§3-5 규칙 준수) | `"김포 대곶면 2019 신축 단독주택 — 재감정으로 최저가가 오른 경매"` |
| `summary` | string | ✓ | 목록/메타 설명용 사실 요약 2~3문장 (§3-5 규칙 준수) | - |
| `coverImage` | string | ✓ | 썸네일 경로(원본) | `"images/photos/000241_전경_01.jpg"` |
| `publishedAt` | string (YYYY-MM-DD) | ✓ | 발행일 | `"2026-04-21"` |
| `marketData` | object | ✓ | 시세 요약 (하위 스키마 §3-3) | - |

**v1에서 삭제된 필드** (v2 사용 금지):
- ~~`category`~~ (내부 분류, UI 노출 위험 → 원천 제거)
- ~~`riskLevel`~~ (내부 위험도 분류, UI 노출 위험 → 원천 제거)

**v1에서 타입 변경된 필드**:
- `tags`: `array<{text, type}>` → `array<string>`. `type` 필드 폐기(분류 의미 부여 금지). UI는 단일 중립 스타일로만 렌더.

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

### 3-4. `tags` 작성 규칙 (v2 신규)

- 사실 라벨만 기입. 판정·분류·의미 부여 금지.
- 허용 예: `"등기 전부 소멸"`, `"2019 신축"`, `"공유자 우선매수권"`, `"토지거래허가구역"`, `"1회 유찰"`, `"임의경매"`
- 금지 예: `"안전"`, `"위험"`, `"교육용"`, `"추천"`, `"주의 물건"`
- 개수 권장 3~6개. 상한 8개.

### 3-5. 본문 Markdown 규칙 (v1 대비 title·summary 규칙 추가)

- **H1**: `title`과 동일. 1회만.
- **섹션 헤더**: `## 01 물건 개요` ~ `## 07 종합 의견` + `## 면책 고지`. 총 8개.
- **이미지 인라인**: `![alt 텍스트](images/photos/{파일명})`. alt는 일반어(예: "건물 외관", "실내 전경"). 카테고리 코드 명칭 금지.
- **상표 마스킹**: 네이버 부동산 → `네○○ 부동산`. 두인옥션·지지옥션 등 데이터 출처도 동일 적용.
- **톤**: 존댓말 (~합니다). AI 슬롭 금지. 숫자와 팩트 중심.
- **테이블**: Markdown 표준 파이프 문법.
- **CTA 본문 미포함**: 전환 CTA는 본문에 포함하지 않는다. Phase 7 웹 변환 단계에서 삽입한다.
- **면책 고지**: `## 면책 고지` 섹션에 면책고지·업무범위·상세정보 3항목 포함.

#### `title` 규칙 (v2 신규 — 원칙 5 위반 차단)

- **금지**:
  - 고정 접두어 `[오늘의 무료 물건분석]` 또는 유사 시리즈 접두어
  - 고정 접미어 `· {caseNumber}` (예: `· 2024타경46918`)
  - 분류어 접미 (예: `— 교육 사례`, `— 학습용`, `— 안전 물건`, `— 위험 물건`)
- **허용**:
  - 물건 특성 한 줄 블로그 제목 형식. 주소·연식·구조·특이점 중 1~2개 핵심을 자연 문장으로.
  - 예: `김포 대곶면 2019 신축 단독주택 — 재감정으로 최저가가 오른 경매`
  - 예: `인천 미추홀구 다세대주택 14차 유찰 — 감정가 대비 8%`

#### `summary` 규칙 (v2 신규 — 원칙 5 위반 차단)

- **금지**: 판정·용도 분류 표현
  - 금지 어휘 예: `학습용`, `교육 사례`, `안전 사례`, `투자 매력`, `적합한`, `실습용`, `추천`, `주의 물건`
- **허용**: 사실 요약. 권리관계·시세·특이점을 2~3문장으로 중립 기술.
- CLI 검증이 금지 어휘 감지 시 **abort** (자동 치환 금지, Cowork 측 수정 후 재발행 요구).

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

대법원 이미지 메타데이터. 스키마는 v1 동일.

Code는 이미지 목록을 필요할 때 이 파일을 신뢰한다. `files[].caption`은 저장 시점의 한글명이며, 최종 UI alt는 post.md 본문의 `![...]` alt 텍스트를 우선한다.

---

## 5. images/photos/ 규격

v1 동일. 파일명 규칙 `{카테고리코드}_{한글명}_{순번2자리}.{확장자}`. 카테고리 코드 7종(000241~000247) 동일. Code는 Storage 업로드 시 SHA-256 기반 익명 key로 변환하여 원본 파일명이 UI에 노출되지 않도록 한다.

---

## 6. 산출물 불변식 (Invariants) — v2

Code가 신뢰할 수 있는 고정 조건. 위반 시 Cowork 버그.

1. 폴더명 = `caseNumber` (frontmatter 값과 일치)
2. `post.md` 1개 반드시 존재
3. `data/pdf_text.txt`, `data/crawler.json`, `data/photos_meta.json` 3개 반드시 존재
4. frontmatter 필수 필드(§3-2 ✓) 전부 충족. **`category`·`riskLevel` 필드 존재 시 fail (v2 삭제 필드)**.
5. 본문 H1 1개, H2 섹션 01~07 + 면책 고지
6. 본문에서 참조한 모든 `images/photos/*` 파일은 실제 존재
7. 네이버 상표 마스킹(`네○○ 부동산`) 적용. frontmatter `marketData.source` 및 본문 전체에 `네이버` 리터럴 감지 시 fail.
8. CTA 본문 미포함
9. 면책 3항목 포함
10. **`tags`는 `string[]`**. 객체 혼재 시 fail (v1 → v2 마이그레이션 오류)
11. **`title`이 `[오늘의 무료 물건분석]`으로 시작하거나 `· {caseNumber}`로 끝나면 fail** (§3-5 title 규칙)
12. **`summary`에 분류어(학습용/교육 사례/안전 사례/투자 매력/적합한/실습용/추천/주의 물건) 포함 시 fail** (§3-5 summary 규칙)

---

## 7. 미해결 판정 사항

v1의 판정 2건은 아래와 같이 처리됨:

**판정 A. 이미지 경로 익명화** — **해결**. Code가 Storage 업로드 시 SHA-256 기반 key로 익명화. Cowork 원천 파일명은 불변(규격 §5 유지), UI Network 탭에 노출되는 URL은 hash 파일명만.

**판정 B. 썸네일 생성 책임자** — **Phase 7 원본 유지, Phase 8에서 `next/og` 도입**. frontmatter `coverImage`는 대법원 전경 원본 그대로. Phase 8 디자인 단계에서 동적 OG 이미지로 전환 검토.

---

## 8. 본 문서 사용법

### Claude Code에게

본 문서는 Phase 7 이후 콘텐츠 작업의 **단일 원천 자료 정의**다. Code는 아래 순서로 본 문서를 활용한다.

1. Phase 7 실행 시 본 문서를 입력 스펙으로 참조
2. 콘텐츠 페이지 라우트(`/analysis/[slug]` 등) 설계 시 `caseNumber`를 slug 후보로 검토 (파생 규칙: `caseNumber.replace("타경","-")`)
3. 메타데이터 처리(next/metadata API) 시 frontmatter를 원소스로 사용
4. 본 규격 외 필드는 무시. 확장 요청 시 본 문서 개정 선행
5. **분류 필드 renderer 금지**: category/riskLevel/tags[].type 기반 UI 분기 로직 신규 작성 금지

### Cowork에게

1. 본 규격을 스크립트 산출물 표준으로 고정
2. v1의 `category`/`riskLevel`/`tags[].type` 필드 산출 중단
3. title·summary 규칙(§3-5) 준수
4. 허용값 확장 요청 시 Opus 승인 후 본 문서 개정

---

## 9. 변경 이력

| 버전 | 날짜 | 변경 |
|---|---|---|
| v1 | 2026-04-21 | 초안. 실제 샘플 1건(2024타경46918) 관측 기준 역공학. |
| v2 | 2026-04-21 | 원칙 5(내부 분류 라벨 비노출) 위반 4건이 샘플 `2024-46673` 브라우저 검수에서 확인되어 개정. (1) `category`·`riskLevel` 필드 삭제 (2) `tags` 타입을 `array<{text,type}>` → `array<string>` 변경 (3) title 고정 접두/접미 금지 규칙 추가 (4) summary 분류어 금지 규칙 추가 + CLI abort. 불변식 §6에 항목 10~12 추가. v1은 이력 보존 목적으로 유지됨. |
