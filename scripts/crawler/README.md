# 대법원 경매정보 크롤러

courtauction.go.kr에서 경매 물건 목록을 수집해 Supabase `court_listings` 테이블에 upsert.

## 구조

```
scripts/crawler/
├── codes.mjs      # 법원·용도 정적 코드표
├── session.mjs    # WMONID 쿠키 세션 관리
├── api.mjs        # searchControllerMain.on 호출 래퍼
├── mapper.mjs     # 응답 → DB row 변환
├── upsert.mjs     # Supabase service_role upsert
├── index.mjs      # 메인 오케스트레이터 (CLI 진입점)
└── README.md      # 이 파일
```

## 사전 준비

1. **환경변수** — `.env.local`에 아래가 있어야 함:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # ⚠️ 서버 전용, 노출 금지
   ```

2. **Supabase 스키마** — `supabase/schema.sql` 최신본에 `court_listings` 테이블 포함. Supabase SQL Editor에서 재실행.

3. **Node 버전** — Node 20.6+ (`--env-file` 플래그 사용).

## 사용법

### dry-run (Supabase 쓰지 않음, 출력만)

```bash
node --env-file=.env.local scripts/crawler/index.mjs \
  --court incheon --days 14 --dry-run --verbose
```

### 실제 실행 (인천 14일, Supabase upsert)

```bash
node --env-file=.env.local scripts/crawler/index.mjs \
  --court incheon --days 14
```

### 옵션

| 옵션 | 설명 | 기본값 |
|---|---|---|
| `--court <key>` | 법원 키 (codes.mjs의 COURT_CODES 키) | `incheon` |
| `--days <n>` | 오늘부터 N일 후까지 수집 | `14` |
| `--dry-run` | Supabase 쓰지 않고 출력만 | off |
| `--verbose`, `-v` | 첫 레코드 샘플 출력 | off |
| `--help`, `-h` | 도움말 | — |

## 동작

1. `GET /pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml` → WMONID 쿠키 획득
2. `POST /pgj/pgjsearch/searchControllerMain.on` 반복 호출 (pageNo 증가)
   - 요청 간 1.5초 대기 (WAF 부담 완화)
   - 15분 후 세션 만료 자동 재초기화
   - 에러 시 10초 후 1회 재시도
3. 각 응답의 `dlt_srchResult`를 `mapRecordToRow()`로 변환
4. 배치 100건씩 Supabase upsert
5. 이번 배치에 없던 기존 row는 `is_active=false`로 비활성화

## 수집되는 필드

117개 원본 필드를 43개의 정규화된 컬럼으로 매핑. 원본은 `raw_snapshot` JSONB에 보존.

핵심 필드:
- 식별: docid (PK), court_code, case_number, item_sequence
- 주소: sido, sigungu, dong, ri_name, lot_number, building_name, address_display
- 면적·용도: area_m2, land_category, usage_name, usage_large_code, usage_medium_code
- 경매: appraisal_amount, min_bid_amount, failed_count, bid_date, bid_time, bid_place
- 담당: dept_name, dept_tel
- 좌표: wgs84_lon, wgs84_lat
- 메타: first_seen_at, last_seen_at, is_active

## 사진은?

사진은 크롤러가 수집하지 않음. 고객이 `/apply` 또는 상세 페이지에서 실제로 요청하는 시점에 **온디맨드로** Next.js API route가 `/pgj/pgj15B/selectPicInf.on`을 호출하고 Supabase Storage(`court-photos` 버킷)에 1/10 WebP 압축 저장 후 `court_listings.photos` JSONB 업데이트.

## GitHub Actions 실행 (Phase 2.5 후반)

`.github/workflows/court-crawler.yml`에서 매일 정해진 시간에 이 스크립트 실행.

```yaml
- name: Run crawler
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
  run: node scripts/crawler/index.mjs --court incheon --days 30
```

## 장애 대응

| 증상 | 원인 | 해결 |
|---|---|---|
| 모든 요청 400 | WAF IP 차단 | 시간을 두고 재시도, User-Agent 재확인 |
| 세션 초기화 실패 | courtauction.go.kr 다운 | 외부 상태 확인 |
| `ipcheck: false` | WAF가 봇으로 판정 | 요청 간격 증가, 헤더 재점검 |
| Supabase upsert 에러 | service_role key 만료·잘못 | `.env.local` 확인 |
| 사건 수 평소보다 급감 | 법원 휴일·공휴일 | 정상, 다음 배치에서 복구 |

## 법적 고려

- 수집 대상: 대법원 공공 경매 사건 정보 (공공 데이터)
- 재배포 용도: 경매퀵 내부 사용 (고객 매칭·접수 편의)
- 출처 표기: 대외 노출 시 "대법원 경매정보를 기초로 작성"
- 요청 간격: 1.5초 (일반 사용자 트래픽 수준 이하)
