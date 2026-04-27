# 네이버 부동산 크롤러 — macOS 실행 지침

> **용도**: Cowork의 `auction-content` 스킬이 내장한 네이버 부동산 크롤러(`naver_land_crawler.py` v7.2)를 macOS 환경에서 PowerShell 래퍼 없이 직접 실행하는 방법.
> **검증일**: 2026-04-24 · macOS (Darwin 25.4.0) · Apple Silicon
> **검증 대상**: 인천광역시 미추홀구 용현동, 아파트, 전용 60㎡ 임의 경매 물건
> **검증 결과**: 577건 매물 수집(20페이지) → 유사매물 매매 133건 / 전세 2건 / 월세 3건 → JSON 생성 성공 (547KB, tier_final=T1)
> **작업 경계 주의**: 크롤러 구현·운영은 CLAUDE.md §13에 따라 Claude Cowork 영역입니다. 본 문서는 이미 Cowork가 작성하여 동작이 검증된 Python 파이프라인을 macOS에서 그대로 실행하기 위한 참고 자료이며, 크롤러 로직의 신규 구현·수정 지시서가 아닙니다.

---

## 1. Cowork 원본 설계와 macOS 실행의 관계

Cowork의 `auction-content-v6.7.0.skill`은 Windows Desktop Commander(DC) 셸을 전제로 설계되어 있으며, 루트 문서에 "네이버 크롤러는 Linux Cowork 샌드박스에서 돌지 않는다(WAF 403 + Playwright 설치 차단)"고 명시되어 있습니다. 그러나 실제로 **크롤러 본체인 `naver_land_crawler.py`, `crawl_tiered.py`, `region_resolver.py`는 순수 Python + Playwright**이며 cross-platform입니다.

Windows 의존성을 주는 것은 오직 **PowerShell 래퍼(`run_crawler.ps1`, `run_photos.ps1`)**와 **`$env:APPDATA\Claude\...` 경로 탐색 로직**입니다. macOS에서는 이 두 레이어를 우회하고 Python 본체를 직접 호출하면 동일하게 동작합니다.

또한 "Linux 샌드박스에서 WAF 403"은 Cowork의 컨테이너 환경에서만 발생하는 문제이며, **macOS는 실제 데스크톱 환경이라 Playwright stealth + headful Chromium 조합으로 WAF를 정상 통과**합니다. 이 사실은 2026-04-24 실측으로 확인되었습니다.

---

## 2. 환경 준비 (1회만 수행)

### 2-1. Python 3.11 설치

크롤러 소스가 PEP 604 union 문법(`dong: str | None`)을 사용하므로 Python 3.10 이상이 필요합니다. 3.11 권장.

```bash
brew install python@3.11
python3.11 --version   # Python 3.11.x 확인
```

### 2-2. 작업 디렉토리 준비

`auction-content-v6.7.0.skill`은 실제로는 zip 파일입니다. 스킬을 풀어 작업 디렉토리 트리를 만듭니다. 위치는 Cowork 워크스페이스가 아니어도 됩니다.

```bash
mkdir -p /tmp/naver-crawler
unzip -o /Users/parkhj/Projects/website/auction-cowork/auction-content-v6.7.0.skill \
       -d /tmp/naver-crawler
cd /tmp/naver-crawler
```

### 2-3. 디렉토리 구조 확인

다음 구조가 반드시 유지되어야 합니다. `region_resolver.py`가 `DB_PATH = <루트>/db/regions.db` 경로로 DB를 찾기 때문입니다.

```
/tmp/naver-crawler/
├── scripts/
│   ├── naver_land_crawler.py        ← 직접 호출 대상
│   ├── crawl_tiered.py              ← 오케스트레이터 (T1→T5 스코프 확장)
│   ├── region_resolver.py           ← regions.db 조회 헬퍼
│   └── ...
├── db/
│   └── regions.db                   ← 서울/경기/인천 동 좌표 사전 적재됨
└── SKILL.md
```

만약 zip 내부에 `db/regions.db`가 빠져 있다면 workspace의 `auction-cowork/_system/db/regions.db`를 복사해 넣어야 합니다(v6.6.0 빌드에서 누락되었다가 v6.7.0에서 복구된 이슈).

```bash
# v6.7.0 번들은 이미 포함하지만, 만약 누락되었을 때:
cp /Users/parkhj/Projects/website/auction-cowork/_system/db/regions.db \
   /tmp/naver-crawler/db/regions.db
```

### 2-4. 가상환경 생성 및 패키지 설치

```bash
cd /tmp/naver-crawler
python3.11 -m venv .venv
.venv/bin/pip install --upgrade pip --quiet
.venv/bin/pip install playwright playwright-stealth
.venv/bin/python -m playwright install chromium
```

Chromium 바이너리는 `~/Library/Caches/ms-playwright/chromium_headless_shell-1208/` 경로에 저장되며 약 91 MB입니다. 한 번 설치 후에는 재사용됩니다.

### 2-5. regions.db 동작 확인

```bash
cd /tmp/naver-crawler
.venv/bin/python scripts/region_resolver.py 인천광역시 미추홀구 용현동
```

아래와 같은 JSON이 출력되면 정상입니다.

```json
{
  "sido": "인천광역시",
  "sigungu": "미추홀구",
  "dong": "용현동",
  "center": [126.647063, 37.450851],
  "bbox": { "left": ..., "right": ..., "top": ..., "bottom": ... },
  "source": "naver_land_region_api"
}
```

---

## 3. 실행 방법 — 세 가지 진입점

### 3-1. 경매 비교 모드 (`--auction`, 단일 지역)

가장 가볍고 검증된 진입점입니다. `naver_land_crawler.py`를 직접 호출하며 T1 스코프(단지 법정동 + bbox 2.0배)만 실행합니다. 스코프 자동 확장이 필요 없고 즉시 검증하고 싶을 때 사용합니다.

```bash
cd /tmp/naver-crawler
PYTHONUNBUFFERED=1 .venv/bin/python scripts/naver_land_crawler.py \
  --auction \
  --sido 인천광역시 \
  --sigungu 미추홀구 \
  --dong 용현동 \
  --trade "매매,전세,월세" \
  --type AP \
  --auction-name "테스트아파트" \
  --auction-area 60.0 \
  --auction-appraisal 300000000 \
  --auction-minimum 210000000 \
  --case-number 2025타경999999
```

### 3-2. 오케스트레이터 모드 (`crawl_tiered.py`, T1~T5 자동 확장)

매물 부족 시 인접 법정동 / 시군구 전체로 자동 스코프 확장이 필요할 때 사용합니다. Cowork의 운영 진입점과 동일한 경로입니다.

```bash
cd /tmp/naver-crawler
PYTHONUNBUFFERED=1 .venv/bin/python scripts/crawl_tiered.py \
  --sido 인천광역시 \
  --sigungu 미추홀구 \
  --dong 용현동 \
  --type AP \
  --auction-name "테스트아파트" \
  --auction-area 60.0 \
  --auction-appraisal 300000000 \
  --auction-minimum 210000000 \
  --case-number 2025타경999999 \
  --tier-max 5 \
  --tier-threshold-sale 20
```

**중요**: Cowork 가이드라인(`references/crawler_usage.md`)은 원칙적으로 `run_crawler.ps1` 래퍼 경유만 허용하지만, 이는 Windows 환경의 버퍼링·한글 인코딩·ArgumentList 분할 버그를 우회하기 위한 규약입니다. macOS에는 해당 버그가 존재하지 않으므로 `crawl_tiered.py` 직접 호출이 안전합니다.

### 3-3. 인자 전체 목록

| 인자 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `--sido` | str | `인천광역시` | 시/도 |
| `--sigungu` | str | `미추홀구` | 시/군/구 |
| `--dong` | str | (필수) | 법정동 |
| `--trade` | str | `매매` | `매매,전세,월세` 콤마 구분 |
| `--type` | str | (필수) | 부동산 유형 alias 또는 raw 코드 |
| `--auction` | flag | — | 경매 비교 모드 활성화 |
| `--auction-name` | str | — | 경매 물건 단지/건물명 |
| `--auction-area` | float | — | 전용면적(㎡) — ±10㎡ 필터에 사용 |
| `--auction-appraisal` | int | — | 감정가(원) |
| `--auction-minimum` | int | — | 최저매각가(원) |
| `--case-number` | str | — | 사건번호 (결과 폴더명에 사용) |
| `--bbox-scale` | float | 2.0 | bbox 중심 기준 확대 배율 |
| `--neighbor-dongs` | str | `""` | 인접 법정동 콤마 구분 (T3 스코프) |
| `--tier-max` | int | 5 | `crawl_tiered.py` 전용 |
| `--tier-threshold-sale` | int | 20 | `crawl_tiered.py` 전용 |

### 3-4. `--type` alias 매핑표 (v7.2 실측 검증)

| alias | 내부 코드 | 용도 |
|-------|-----------|------|
| `AP` / `아파트` | `A01` | 아파트 (주상복합 포함) |
| `OP` / `오피스텔` | `A02, C01` | 오피스텔 / 도시형생활주택 |
| `VL` / `빌라` | `A01, A02, A04, A06, B01` | 빌라 계열 SPA 멀티타입 |
| `SH` / `주택` | `C03, D01, D02` | 단독 + 다가구 + 단독/다가구 |
| `단독` | `D02` | 단독 |
| `다가구` | `C03` | 다가구 |
| `단독/다가구` | `D01` | 혼합 |
| `CH` / `전원주택` | `C04` | 미검증 |
| `CM` / `상가주택` | `D05` | 미검증 |

raw 코드 직접 주입도 허용됩니다: `--type "C03,D01,D02"` 등.

---

## 4. 결과 판정

### 4-1. 성공 판정 — 파일 존재 여부

로그가 아니라 **JSON 파일 생성 여부**로 판정합니다(Cowork 가이드라인 §5와 동일).

```bash
TODAY=$(date +%Y-%m-%d)
CASE=2025타경999999
ls /tmp/naver-crawler/scripts/outputs/$TODAY/$CASE/auction_compare_*.json
```

파일이 1개 이상 존재하면 성공입니다. 파일명 패턴: `auction_compare_{동}_{YYYYMMDD_HHMM}.json`.

### 4-2. 결과 JSON 스키마 (실측 확정)

```
경매물건/
  단지, 전용면적, 감정가, 최저가
유사매물_매매/       ← 전용 ±10㎡ 필터 적용
유사매물_전세/
유사매물_월세/
시세요약/
  매매_평균, 매매_최저, 매매_최고, 매매_중위, 매매_건수
  전세_평균, 전세_최저, 전세_최고, 전세_건수
  월세_평균_월세, 월세_최저_월세, 월세_최고_월세, 월세_중위_월세,
  월세_평균_보증금, 월세_건수
매물유형분포/       ← { "아파트": 138 } 등
crawled_at         ← ISO 8601
검색조건/
  sido, sigungu, 지역(배열), 면적범위,
  총_매물수, 검색타입,
  case_number,
  tier_final, tier_threshold_sale, tier_max,
  bbox_scale, neighbor_dongs, 지역_확장
_all_articles_raw/  ← 원본 전체 매물 (ingest 용)
```

**G10 게이트**: `검색조건.tier_final` 존재 + 값이 `T1`~`T5` 여부를 검증합니다.

---

## 5. macOS 실측 결과 (2026-04-24 검증 세션)

- **입력**: 인천광역시 미추홀구 용현동, `--type AP`, 전용 60㎡, 감정가 3억, 최저가 2.1억, 임의 사건번호 `2025타경999999`
- **접속**: `https://fin.land.naver.com/map?center=126.647063-37.450851&zoom=17` 정상 접속, WAF 차단 없음
- **수집**: boundedArticles API로 577건 (20페이지) 수집 후 중복 제거 → 531건 보존
- **필터**: 전용 ±10㎡(50~70㎡) 범위 적용 → 유사매물 매매 133건 / 전세 2건 / 월세 3건
- **시세 요약**: 매매 평균 2억 9,114만 / 전세 평균 2억 4,000만 / 월세 평균 보증금 2,000만 + 월세 106만
- **출력**: `scripts/outputs/2026-04-24/2025타경999999/auction_compare_용현동_20260424_1623.json` (547 KB)
- **tier_final**: T1 (임계값 20건 이상 확보, 확장 불필요)
- **소요 시간**: 약 2분

---

## 6. 공통적으로 막히는 지점

| # | 증상 | 원인·대응 |
|---|------|----------|
| 1 | `ModuleNotFoundError: playwright` | venv 활성화 또는 `.venv/bin/python` 절대 경로 호출 사용. |
| 2 | `RegionNotFound` | `db/regions.db` 경로 불일치. `scripts/` 옆 `db/` 디렉토리 배치 재확인. |
| 3 | `TypeError: unsupported operand type(s) for \|` | Python 3.9 이하 실행. 3.10+ 필요. |
| 4 | 접속 실패 또는 WAF 차단 페이지 | `headless=False` 유지 필수(stealth 효과). headless=True로 바꾸면 봇 탐지 확률 증가. |
| 5 | 매물 0건 반환 | `--dong`이 `regions.db`에 미등록이거나 해당 지역 매물이 실제로 없음. `tier_final=T5`까지 갔는지 확인. |
| 6 | 한글 출력 깨짐 | `PYTHONUNBUFFERED=1` 환경 변수 누락. stdout wrapper는 소스에서 UTF-8로 강제되어 있지만 버퍼링 문제 회피를 위해 권장. |
| 7 | GUI 세션 부재(SSH 등) | Playwright가 headful 모드로 Chromium을 띄우려 하나 DISPLAY 부재로 실패. macOS 로컬 데스크톱 세션에서 실행 필요. |

---

## 7. Windows 래퍼와의 차이 (macOS 단순화 요약)

| Cowork Windows 경로 | macOS 대응 |
|--------------------|-----------|
| `$env:AUCTION_SKILL` AppData 탐색 | 불필요. 작업 디렉토리 고정 경로 사용. |
| `run_crawler.ps1` 래퍼 | 불필요. `crawl_tiered.py` 또는 `naver_land_crawler.py` 직접 호출. |
| UTF-8 BOM 주입 (`EF BB BF`) | 불필요. macOS는 파일 인코딩에 BOM 요구하지 않음. |
| `Start-Process -ArgumentList` 공백 분할 버그 우회 | 불필요. zsh/bash는 공백 인자를 정상 처리. |
| `$proc.StartTime` op_Subtraction 예외 회피 | 불필요. Python `time.time()` 기본 사용. |
| `_logs/crawler_*.log` 리다이렉트 + 폴링 | 불필요. 터미널에서 직접 출력 확인. |
| G11 BOM 재검사 | macOS에서는 스킵 가능. |

Python 본체 레벨의 핵심 로직(stealth, boundedArticles 페이지네이션, tier 확장, 면적 필터, 시세 집계)은 Windows와 macOS에서 동일하게 동작합니다.

---

## 8. 작업 경계 재확인

본 문서는 **Cowork가 작성·검증한 Python 파이프라인을 macOS에서 실행하기 위한 우회 가이드**입니다. 크롤러 로직의 변경·튜닝·새로운 지역 지원·realEstateType 코드 매핑 갱신 등은 CLAUDE.md §13에 따라 Cowork 영역입니다. Claude Code는 산출물 JSON을 받아 웹페이지에 싣는 단계까지만 담당합니다.

Cowork에 macOS 지원을 정식으로 요청하실 경우, `run_crawler.sh` / `run_photos.sh` 포팅 + `config.json` 경로 체인 macOS 확장 + SKILL.md 갱신을 과제로 주시는 것이 정석입니다(v6.7.0 재패키징 핸드오프에 추가).

---

## 9. 변경 이력

| 버전 | 날짜 | 변경 |
|------|------|------|
| v1 | 2026-04-24 | 초안. 용현동 실측 검증 결과 기반 PoC recipe. Windows 래퍼 우회 경로 문서화. |
