# 경매퀵 크롤러 사용법

대법원 경매정보(courtauction.go.kr)에서 인천지방법원 경매 물건 목록을
수집하여 Supabase `court_listings` 테이블에 저장하는 증분 크롤러입니다.

## 최초 세팅

### 1. 저장소 클론 (이미 되어 있으면 건너뛰기)

```bash
git clone https://github.com/parkhj2025/auction_system.git
cd auction_system
pnpm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일이 필요합니다:

```
NEXT_PUBLIC_SUPABASE_URL=https://wyoanhtsrnoxijufawze.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://auctionsystem-green.vercel.app
```

## 실행 방법

### Windows

1. `scripts/run-crawler.bat` 파일을 더블클릭
2. 또는 터미널에서:
   ```
   node --env-file=.env.local scripts/crawler/index.mjs --court incheon --days 14
   ```

### Mac / Linux

```bash
chmod +x scripts/run-crawler.sh
./scripts/run-crawler.sh
```

### 바탕화면 바로가기 만들기 (Windows)

1. `scripts/run-crawler.bat` 파일을 마우스 오른쪽 클릭
2. "바로 가기 만들기" 선택
3. 생성된 바로 가기를 바탕화면으로 이동
4. (선택) 바로 가기 이름을 "경매퀵 크롤러"로 변경

## 옵션

| 옵션 | 기본값 | 설명 |
|------|--------|------|
| `--court <key>` | incheon | 법원 키 (incheon, bucheon 등) |
| `--days <n>` | 14 | 오늘부터 N일 후까지 수집 범위 |
| `--dry-run` | - | DB 저장 없이 수집만 테스트 |

## 실행 빈도

- 하루 1~2회 실행 권장 (매일 아침, 필요 시 오후 추가)
- 증분 수집이므로 매번 전체를 다시 수집하지 않음
- 신규 등록된 물건만 추가, 사라진 물건은 자동 비활성화

## 에러 발생 시

### "검색 API가 차단되어 있습니다"

대법원 사이트의 자동 요청 방어(WAF)가 현재 네트워크 IP를 차단한 경우:

1. 다른 네트워크로 전환 (모바일 핫스팟, 다른 Wi-Fi)
2. 24시간 후 재시도 (자동 해제)
3. 3초 이상 간격으로 요청하므로 정상 사용에서는 차단되지 않음

### "Supabase 연결 확인"

`.env.local` 파일의 URL과 키가 올바른지 확인:
- `NEXT_PUBLIC_SUPABASE_URL`이 Supabase 프로젝트 URL과 일치하는지
- `SUPABASE_SERVICE_ROLE_KEY`가 유효한지 (Dashboard > Settings > API)

### "대법원 사이트에 연결할 수 없습니다"

인터넷 연결을 확인해주세요. courtauction.go.kr에 브라우저로 접속 가능한지
먼저 확인합니다.

## DB 초기화가 필요한 경우

일반적으로 필요하지 않습니다. 다음 경우에만 고려:

- 데이터가 심하게 오염된 경우
- 스키마 변경으로 기존 데이터와 호환이 안 되는 경우

방법: Supabase Dashboard > SQL Editor에서:
```sql
TRUNCATE public.court_listings;
```
이후 크롤러를 실행하면 전체 재수집됩니다 (약 2~3분 소요).

## 기술 상세

- 검색 API: 3초 간격, 페이지당 50건
- 인천 14일 기준: ~2,000건 / ~40페이지 / ~2분 소요
- 증분 수집: DB 기존 docid와 대조하여 신규만 INSERT, 기존은 갱신
- 비활성화: 수집 목록에 없는 기존 건은 is_active=false 처리
