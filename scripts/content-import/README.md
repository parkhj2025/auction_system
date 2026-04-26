# content-import — Cowork 산출물 → raw-content/ 자동화

Phase 7 prototype 단계 3-1 보조 도구. macOS Finder Quick Action 셸 스크립트가 본 도구를 호출하는 것이 1차 사용자.

## 단일 책임

Cowork가 산출한 폴더(예: `~/Desktop/2025타경507598/`)를 검증한 뒤 `raw-content/{case_id}/` 로 복사한다. **변환 0**, **publish 호출 0** — 별도 명령(`pnpm content:publish`)으로 수동 트리거.

## 컨벤션

| 위치 | 형식 | 비고 |
|------|------|------|
| 입력 폴더 basename | `YYYY타경NNNNNN` (한글) | `case_id` |
| `meta.json.case_number` | `YYYY타경NNNNNN` (한글) | basename과 정확히 일치해야 함 |
| `raw-content/{case_id}/` | `YYYY타경NNNNNN` (한글) | 한글 폴더명 보존 — slug 변환은 publish CLI의 `deriveSlug` 단독 책임 |

## 사용법

```bash
pnpm content:import "/path/to/2025타경507598"

pnpm content:import "/path/to/2025타경507598" --dry-run   # 복사 없이 검증·출력만
pnpm content:import "/path/to/2025타경507598" --force      # 충돌 시 백업 후 덮어쓰기
pnpm content:import "/path/to/2025타경507598" --verbose
```

## 검증 순서

1. 입력 경로 존재·디렉토리
2. basename이 `/^\d{4}타경\d+$/` 형식
3. `{input}/post.md` 존재
4. `{input}/data/meta.json` 존재
5. `meta.json.case_number === basename`
6. 충돌(`raw-content/{case_id}/` 이미 존재) — `--force` 없으면 abort

## 충돌 처리

- `--force` 없음: exit 2 + 기존/신규 파일 수·mtime diff 표시
- `--force` 있음: `raw-content/.archive/{case_id}-{YYYYMMDD-HHMMSS}/` 로 기존 폴더 백업 후 신규 복사

## 종료 코드

| 코드 | 의미 |
|------|------|
| 0 | 성공 (또는 `--dry-run` 검증 통과) |
| 1 | 검증 실패 (경로 / 형식 / 필수 파일 / case_number 불일치) |
| 2 | 충돌 — `--force` 없음 |
| 3 | 시스템 에러 (권한·디스크 등) |

Quick Action 셸 스크립트는 본 코드로 알림 분기 가능.

## 마지막 1줄 stdout (Quick Action notify 표시용)

- 성공: `{case_id} 임포트 완료 ({파일수}개)`
- 실패: `{case_id|(unknown)}: {간결 사유}`

## 작업 경계

- publish CLI 호출 0 — `content:import` 후 `pnpm content:publish {case_id}` 별도 실행
- `deriveSlug` 로직 재구현·복제 0 — 단일 책임은 publish CLI에
- 폴더명 ASCII 변환 0 — 한글 보존
- `meta.json` / `post.md` 내용 변경·정규화 0 — 복사만
