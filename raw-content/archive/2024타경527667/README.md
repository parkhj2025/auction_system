# 2024타경527667 경매 물건분석 패키지

이 폴더는 auction-content 플러그인의 표준 산출물 1건입니다.
AI·웹사이트 빌드 파이프라인 공통 입력 단위로 읽을 수 있는 구조입니다.

## 내용물
- `post.md` — YAML 프론트매터 + 마크다운 본문 (웹 게시용 단일 파일). 이미지는 Supabase Storage URL 직접 참조
- `meta.json` — 멀티 포맷 추출 가능한 평탄화 메타 (hero/highlights/sections/photos/seo)
- `data/parsed.json` — PDF 파싱 구조화 결과
- `data/crawler_summary.json` — 인근 시세 분석 (raw 매물 제외 요약)
- `data/photos_meta.json` — 대법원 사진 URL 배열 8장 (Supabase Storage public URL)

## 핵심 메타
- 사건: 2024타경527667 · 인천지방법원 26계
- 매각기일: 2026-06-11 10:00
- 물건: 별빛마을웰카운티 (아파트, 1005동 102호)
- 주소: 인천 남동구 논현동 601-1, 1005동 1층102호 (별빛마을웰카운티)
- 면적: 128.33㎡ (38.82평) / 대지권 71.5594㎡ (21.65평)
- 감정가 6억 2,700만원 / 최저가 4억 3,890만원 (감정가 70%)
- 회차: 2차
- 임차인: 없음 · 소유자 점유
- 등기: 전부 소멸 (말소기준 2018-08-28 신한은행)
- 인근역: 수도권 수인선 소래포구역 약 693m
- 이미지: 총 8장 / 본문 배치 7장 (cover 1장 포함)

## 멀티 포맷 추출
- **카드뉴스 Hero 1장**: `meta.json.hero`
- **카드뉴스 슬라이드 5장**: `meta.json.highlights`
- **블로그 풀버전**: `post.md`
- **SNS 숏카피**: `meta.json.sections.property` + `meta.json.hero.headline`

## 재생성·업로드
- 본 패키지는 웹사이트 빌드 파이프라인의 단일 입력 단위입니다.
- 이미지 블러·선별·저작권 처리는 웹 업로드 단계에서 수행합니다 (Cowork는 원본 보존).
