# 대법원 경매정보 사이트 — 사진 수집 방법

> **용도**: Claude Cowork 및 신규 크롤러 작업자에게 전달하기 위한 PoC 검증 recipe 문서.
> **근거**: 2026-04-17 Phase 2-7 Stage 2A 프로덕션 검증 완료.
> **출처 소스**: [src/lib/courtAuction/session.ts](../src/lib/courtAuction/session.ts), [photos.ts](../src/lib/courtAuction/photos.ts), [codes.ts](../src/lib/courtAuction/codes.ts)
> **작업 경계 주의**: 크롤러 구현·운영은 CLAUDE.md §13에 따라 Claude Cowork 영역입니다. 본 문서는 이미 프로덕션 가동 중인 온디맨드 사진 페처의 **동작 방식을 설명**한 참고 자료이며, 신규 크롤러 구현 지시서가 아닙니다.

---

## 핵심 발견 (D10) — 사진 전용 API는 존재하지 않는다

대법원 경매정보 사이트에는 "사진 전용 엔드포인트"가 없습니다. 상세 조회 API 한 번의 호출로 **텍스트 메타데이터 + 사진 base64가 동시에 반환**됩니다. 사진 전용 경로를 찾으려 시도할 경우 막히게 됩니다.

---

## 1단계 — 세션 2단계 초기화 (필수)

대법원 사이트의 WAF는 쿠키 누적 상태를 검사합니다. 곧바로 상세 API를 호출하면 빈 응답 또는 차단됩니다.

```
Step 1: GET https://www.courtauction.go.kr/
        → Set-Cookie 수집
        → 2초 대기 (sleep 필수, 봇 판정 회피)

Step 2: GET https://www.courtauction.go.kr/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml
        Referer: /
        Sec-Fetch-Site: same-origin
        → 추가 쿠키 누적
```

### 공통 헤더 (두 단계 모두)

```
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36
Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
sec-ch-ua: "Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Upgrade-Insecure-Requests: 1
```

**중요**: `sec-ch-ua` 3종 + UA Chrome 147 조합이 반드시 포함되어야 합니다. 누락 시 WAF가 봇으로 판정하여 차단합니다.

---

## 2단계 — 상세 API 호출 (텍스트 + 사진 동시 수신)

```
POST https://www.courtauction.go.kr/pgj/pgj15B/selectAuctnCsSrchRslt.on
```

### 요청 헤더

```
Content-Type: application/json;charset=UTF-8
Accept: application/json, text/plain, */*
Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
Origin: https://www.courtauction.go.kr
Referer: https://www.courtauction.go.kr/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml
SC-Userid: NONUSER
SC-Pgmid: PGJ15BM01
submissionid: mf_wfm_mainFrame_sbm_selectGdsDtlSrchDtlInfo
sec-ch-ua: "Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
User-Agent: <공통 UA>
Cookie: <1단계에서 누적된 쿠키 전체>
```

### 요청 바디

```json
{
  "dma_srchGdsDtlSrch": {
    "csNo": "2023타경547053",
    "cortOfcCd": "B000210",
    "dspslGdsSeq": "1",
    "pgmId": "PGJ15BM01",
    "srchInfo": {}
  }
}
```

### 바디 필드 설명

| 필드 | 값 | 설명 |
|------|------|------|
| `csNo` | `"2023타경547053"` | 사건번호. 한글 "타경" 포함 원문 그대로. |
| `cortOfcCd` | `"B000210"` | 법원 코드. 인천지방법원 = `B000210`. |
| `dspslGdsSeq` | `"1"` | **item_sequence** (문자열). mokmul_sequence 아님. |
| `pgmId` | `"PGJ15BM01"` | 프로그램 ID. 고정값. |
| `srchInfo` | `{}` | 빈 객체. |

### 치명적 함정 — `dspslGdsSeq`

`dspslGdsSeq` 값은 `court_listings.item_sequence`이며 `mokmul_sequence`가 아닙니다. 토지+건물 일괄 매각 사건은 mokmul이 여러 row로 들어오지만, 사진은 item 단위로만 조회됩니다. 이를 혼동하면 사진을 가져오지 못하거나 다른 사건의 사진이 반환됩니다.

---

## 3단계 — 응답 파싱

```json
{
  "data": {
    "dma_result": {
      "csPicLst": [
        {
          "picFile": "<base64 JPEG 본문>",
          "picTitlNm": "전경",
          "cortAuctnPicDvsCd": "000241",
          "cortAuctnPicSeq": 1,
          "pageSeq": 1,
          "cortOfcCd": "B000210",
          "csNo": "2023타경547053",
          "picFileUrl": "..."
        }
      ]
    }
  }
}
```

### 카테고리 코드 매핑

| 코드 | 의미 |
|------|------|
| `000241` | 전경사진 |
| `000242` | 감정평가사진 |
| `000243` | 현황조사사진 |
| `000244` | 매각물건사진 |
| `000245` | 내부사진 |
| `000246` | 등기부사진 |
| `000247` | 기타사진 |

### 선별 규칙 (총 4장)

프로덕션 코드([photos.ts:45-76](../src/lib/courtAuction/photos.ts#L45-L76))의 `selectPhotos` 함수가 사용하는 규칙:

1. 전경(`000241`) 최대 2장 우선 선택
2. 내부(`000245`) 최대 2장 추가 선택
3. 합계 4장에 미달하는 경우 다른 카테고리에서 순서대로 보충
4. 최대 4장 상한

---

## 4단계 — 후처리 및 캐싱

```
base64 → Buffer.from(picFile, "base64")
      → sharp.resize(800, 600, { fit: "inside", withoutEnlargement: true })
      → .webp({ quality: 75 })
      → Supabase Storage `court-photos/{courtCode}/{docid}/{i}.webp` (upsert)
      → getPublicUrl
      → court_listings 테이블 UPDATE (photos JSONB, photos_fetched_at, photos_count)
```

### 캐싱 정책

- 최초 호출 시에만 대법원 API 요청.
- 이후 `court_listings.photos_fetched_at`이 존재하고 `photos` 배열이 비어있지 않으면 캐시에서 즉시 반환.
- 사진이 없는 사건은 빈 배열 `[]`로 캐싱하여 재호출을 방지.

---

## 공통적으로 막히는 지점 (경험 기반)

| # | 증상 | 원인 |
|---|------|------|
| 1 | 사진 전용 엔드포인트가 막힘 | 해당 엔드포인트는 존재하지 않음. 상세 API 사용해야 함. |
| 2 | 응답이 빈 객체 또는 WAF 차단 페이지 | 세션 2단계 초기화 누락. 곧바로 POST 호출한 경우. |
| 3 | WAF 차단 | `sec-ch-ua` 3종 헤더 누락. Chrome 147 위장이 깨짐. |
| 4 | 사진이 반환되지 않거나 엉뚱한 사건의 사진 | `dspslGdsSeq`에 mokmul_sequence를 사용. item_sequence로 교체 필요. |
| 5 | 검색 API 차단 | Azure / GitHub Actions runner IP에서 실행. 수동 실행 / 자택 IP 원칙. 상세 API는 덜 민감하지만 rate limit 준수 필수. |
| 6 | 잦은 차단 | 대량 일괄 수집 시도. D10 원칙은 **온디맨드** (고객이 실제 조회한 사건 1건 × 사진 4장). |

---

## 상수 참조 (codes.ts)

```
BASE_URL:             https://www.courtauction.go.kr
INIT_ENDPOINT:        /pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml
DETAIL_ENDPOINT:      /pgj/pgj15B/selectAuctnCsSrchRslt.on
DETAIL_SUBMISSION_ID: mf_wfm_mainFrame_sbm_selectGdsDtlSrchDtlInfo
DETAIL_PGM_ID:        PGJ15BM01
SC_USERID:            NONUSER
USER_AGENT:           Chrome 147 Windows (위 공통 헤더 참조)
```

---

## 작업 경계 재확인

- 본 문서는 **이미 검증·가동 중인 온디맨드 사진 페처의 동작 방식**을 Cowork 및 외부 협업자에게 전달하기 위한 참고 자료입니다.
- 신규 크롤러 로직 작성·기존 로직 튜닝은 CLAUDE.md §13에 따라 Claude Cowork 영역이며, Claude Code의 직접 관여 대상이 아닙니다.
- Claude Code는 크롤러 결과물(사진 URL)을 웹페이지에 싣는 단계까지만 담당합니다.

---

## 변경 이력

| 버전 | 날짜 | 변경 |
|------|------|------|
| v1 | 2026-04-24 | 초안. Phase 2-7 Stage 2A 프로덕션 검증 결과를 PoC recipe 문서로 정리. |
