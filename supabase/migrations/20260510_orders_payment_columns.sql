-- ============================================================================
-- cycle 1-D-A-4-5 — orders payment 컬럼 신규 (Step5Payment paradigm 정합)
-- ============================================================================
--
-- 의도:
-- Step5Payment = 결제·접수 단계 신규 → orders 테이블에 입금자명 + 결제 status 추가.
--
-- 신규 컬럼:
-- 1. payment_status TEXT (deposit_waiting / deposit_confirmed / refunded)
--    - default 'deposit_waiting' = 신청 접수 사후 + 입금 사전 paradigm
--    - 형준님 admin 영역 = 입금 확인 사후 'deposit_confirmed' 수동 갱신 paradigm
--    - 환불 시점 = 'refunded' (cycle 1-E 또는 별개 cycle 영역)
--
-- 2. depositor_name TEXT
--    - Step5Payment 사용자 입력 (default = applicant_name / 사용자 수정 가능)
--    - 입금 매칭 paradigm 백엔드 admin 영역 검증 source
--
-- 적용 paradigm (Lessons [D]):
-- 1. 본 migration 파일 + schema.sql 동시 commit
-- 2. 형준님 Supabase Dashboard SQL Editor 붙여넣기 실행
-- 3. 실행 사후 신규 컬럼 광역 확인 (\d orders)
-- ============================================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'deposit_waiting'
    CHECK (payment_status IN ('deposit_waiting', 'deposit_confirmed', 'refunded'));

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS depositor_name TEXT;

-- Index for admin filtering by payment status
CREATE INDEX IF NOT EXISTS orders_payment_status_idx
  ON public.orders (payment_status);

COMMENT ON COLUMN public.orders.payment_status IS
  'cycle 1-D-A-4-5 — 수수료 입금 status. deposit_waiting (default) / deposit_confirmed (admin 수동 갱신) / refunded.';
COMMENT ON COLUMN public.orders.depositor_name IS
  'cycle 1-D-A-4-5 — Step5Payment 사용자 입력 입금자명 (default = applicant_name).';
