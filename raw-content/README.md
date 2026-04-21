# raw-content/

Cowork가 전달한 **원천 자료** 보관 디렉터리.

## 용도

각 콘텐츠 1건은 하나의 폴더 단위로 산출된다. 폴더명은 사건번호(`{caseNumber}/`).

구조·frontmatter 스키마·본문 규칙은 [`docs/content-source-v1.md`](../docs/content-source-v1.md)에 단일 정의. 이 디렉터리의 산출물은 규격 v1을 준수해야 한다.

```
raw-content/
├── README.md                       ← 이 파일
├── .gitkeep
└── {caseNumber}/                   ← Cowork 산출물 1건
    ├── post.md                     ← 본문 Markdown + YAML frontmatter
    ├── data/
    │   ├── pdf_text.txt            ← 두인옥션 PDF 원본 텍스트
    │   ├── crawler.json            ← 네○○ 부동산 크롤러 결과
    │   └── photos_meta.json        ← 대법원 사진 메타데이터
    └── images/
        └── photos/                 ← 대법원 원본 이미지 (jpg)
            └── {카테고리코드}_{한글명}_{순번}.jpg
```

## 민감정보 경고 (반드시 읽을 것)

`data/pdf_text.txt`에는 다음 정보가 포함된다:

- 채무자·소유자·임차인의 **실명**
- **상세 주소** (번지·호수 수준)
- 채권자 **법인명**
- 금전 청구 내역

**Repo가 Public 상태일 때 이 디렉터리에 파일을 커밋해서는 안 된다.** Public 커밋 시 검색엔진 인덱싱 + Git history 영구 잔존 + 개인정보보호법 리스크가 발생한다.

본 디렉터리 사용의 **전제 조건**: GitHub repo가 Private 상태여야 한다. (Phase 7 Step 0에서 전환 완료. 2026-04-21 기준 유지.)

## 변환 (Code 책임)

원천 자료 → 웹 콘텐츠 변환은 `scripts/content-publish/index.mjs` CLI가 담당.

```bash
# Dry-run (기본)
pnpm content:publish raw-content/{caseNumber}

# 실행
pnpm content:publish raw-content/{caseNumber} --execute
```

결과:
- `content/analysis/{caseKey}.mdx` 생성 (변환본, slug = `caseNumber.replace('타경', '-')`)
- `content-photos` Supabase Storage 버킷에 이미지 업로드 (익명화 key, SHA-256 기반)

## 이중 저장

- **원천**: 본 디렉터리 (`raw-content/{caseNumber}/`) — Git 추적, 감사·재변환·디버깅용.
- **변환본**: `content/analysis/{caseKey}.mdx` + Supabase Storage — 웹 렌더 소스.

두 사본 모두 유지한다. 원천이 삭제되면 재변환·품질 검증 불가.

## 규격 개정

`docs/content-source-v1.md`의 frontmatter 스키마·불변식이 변경되면 본 README와 CLI 동기화 필요. 개정은 형준님 승인 + Opus 검토 절차로만.
