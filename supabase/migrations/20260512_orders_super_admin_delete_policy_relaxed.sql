-- ============================================================================
-- cycle 1-E-B-ε — orders_super_admin_delete RLS policy 갱신 (status 조건 광역 제거)
-- ============================================================================
--
-- 의도:
-- cycle 1-E-B-α 광역 3중 안전망 (super_admin + cancelled + deleted_at NOT NULL) paradigm 회수.
-- 광역 status 영역 광역 강제 hard delete paradigm 정수 = 관리 차원 광역 잘못된 신청 광역 회수 paradigm.
--
-- 실수 회피 paradigm 정수 = super_admin 단독 권한 + OrderDeleteModal 강제 paradigm + application_id 정확 입력 강제 paradigm 광역 충분 정수.
--
-- 정정 paradigm:
-- 사전 = (is_super_admin() AND status='cancelled' AND deleted_at IS NOT NULL) 3중 안전망
-- 정정 = is_super_admin() 단독 (super_admin 단독 권한 paradigm 영구 보존)
--
-- 적용 paradigm (Lessons [D]):
-- 1. 본 migration 파일 + schema.sql 동시 commit
-- 2. 형준님 Supabase Dashboard SQL Editor 붙여넣기 실행
-- 3. 실행 사후 policy 광역 확인:
--    SELECT polname, pg_get_expr(polqual, polrelid)
--    FROM pg_policy WHERE polname = 'orders_super_admin_delete';
--    → is_super_admin() 단독 회수 정합
-- ============================================================================

DROP POLICY IF EXISTS "orders_super_admin_delete" ON public.orders;

CREATE POLICY "orders_super_admin_delete" ON public.orders
  FOR DELETE USING (
    (select public.is_super_admin())
  );
