-- ============================================================================
-- cycle 1-E-B-α — orders_super_admin_delete RLS policy 신규 (3중 안전망)
-- ============================================================================
--
-- 의도:
-- orders 테이블 광역 hard delete 권한 paradigm 정수 = super_admin 단독 + status='cancelled' + deleted_at IS NOT NULL 3중 안전망.
--
-- 광역 안전망 3중 정수:
-- 1. is_super_admin() = 형준님 단독 권한 (admin 광역 NG)
-- 2. status = 'cancelled' = 직전 cycle 1-E-A soft delete paradigm 정합 시점 단독
-- 3. deleted_at IS NOT NULL = soft delete 사후 단독 (active 광역 NG)
--
-- 광역 cascade paradigm 정합:
-- - documents 테이블 ON DELETE CASCADE (schema.sql:310)
-- - order_status_log 테이블 ON DELETE CASCADE (schema.sql:347)
-- - Supabase Storage 광역 = DELETE route 안 광역 회수 paradigm (DB cascade 영역 0)
--
-- 적용 paradigm (Lessons [D]):
-- 1. 본 migration 파일 + schema.sql 동시 commit
-- 2. 형준님 Supabase Dashboard SQL Editor 붙여넣기 실행
-- 3. 실행 사후 policy 광역 확인 (\\d+ orders)
-- ============================================================================

DROP POLICY IF EXISTS "orders_super_admin_delete" ON public.orders;
CREATE POLICY "orders_super_admin_delete" ON public.orders
  FOR DELETE USING (
    (select public.is_super_admin())
    AND status = 'cancelled'
    AND deleted_at IS NOT NULL
  );
