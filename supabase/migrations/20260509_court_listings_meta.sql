-- Stage 2 cycle 1-D-A — court_listings 메타 컬럼 확장
-- 2026-05-09
--
-- 추가 컬럼:
--   case_title  — 사건명 (raw_snapshot 광역 추출 / fallback = "{usage} · {sido} {sigungu} {dong}")
--
-- 컴플라이언스: KOGL Type 1 정합 (출처 = 대법원 경매정보).
-- 매각물건명세서 PDF source = Cowork 영역 단독 (본 프로세스 분리 / 영구 0).

ALTER TABLE public.court_listings
  ADD COLUMN IF NOT EXISTS case_title TEXT;
