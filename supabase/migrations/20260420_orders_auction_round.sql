-- ============================================================================
-- Phase 6.7.6 — 매각회차 구분 (같은 사건번호 다회차 접수 허용)
-- ----------------------------------------------------------------------------
-- 실행: Supabase Dashboard → SQL Editor → 이 파일 전체 실행 (멱등 트랜잭션).
-- 배경: 기존 is_case_active / orders_unique_active_case는 case_number 단일
--       키로만 중복을 차단 → 1회차 접수가 status='lost'로 전환되기 전까지
--       2회차 이상 접수 불가. 경매는 유찰 시 회차가 올라가며 같은 사건이
--       여러 차례 매각되므로, 회차 단위로 중복 판정해야 함.
-- 변경 요약:
--   1. orders.auction_round INT NOT NULL DEFAULT 1 CHECK (>=1) 추가
--   2. orders_unique_active_case → orders_unique_active_case_round (2컬럼)
--   3. is_case_active(TEXT) → is_case_active(TEXT, INT) 2-arg
-- Lessons Learned [D] (CLAUDE.md): DB 변경 SQL은 repo 커밋 + Dashboard 실행
--   쌍으로 추적. 본 파일은 사후 backfill (실제 DB 실행: 2026-04-21 KST).
-- ============================================================================

BEGIN;

-- 1. 컬럼 추가 (기존 row는 1로 backfill)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS auction_round INT NOT NULL DEFAULT 1
  CHECK (auction_round >= 1);

-- 2. 기존 unique index 제거 → 회차 포함 새 index로 교체
DROP INDEX IF EXISTS public.orders_unique_active_case;
CREATE UNIQUE INDEX IF NOT EXISTS orders_unique_active_case_round
  ON public.orders (case_number, auction_round)
  WHERE status NOT IN ('cancelled', 'settled', 'deposit_returned')
    AND deleted_at IS NULL;

-- 3. is_case_active 시그니처 변경 (round 포함)
DROP FUNCTION IF EXISTS public.is_case_active(TEXT);
CREATE OR REPLACE FUNCTION public.is_case_active(case_no TEXT, round_no INT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders
    WHERE case_number = case_no
      AND auction_round = round_no
      AND status NOT IN ('cancelled', 'settled', 'deposit_returned')
      AND deleted_at IS NULL
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

COMMIT;


-- ============================================================================
-- 확인 쿼리 (실행 후 수동 검증)
-- ============================================================================
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name='orders' AND column_name='auction_round';  -- 1행
-- SELECT indexname FROM pg_indexes
--   WHERE tablename='orders' AND indexname='orders_unique_active_case_round';  -- 1행
-- SELECT proname, pronargs FROM pg_proc WHERE proname='is_case_active';  -- pronargs=2
