-- ============================================================================
-- cycle 1-E-B-α — is_super_admin() 함수 신규 (hard delete paradigm 정수)
-- ============================================================================
--
-- 의도:
-- super_admin 단독 권한 paradigm 정수 = orders 광역 영구 삭제 (hard delete)
-- 광역 권한 분리.
--
-- 광역 paradigm 정수:
-- - admin = soft delete + status 전이 광역 단독 (is_admin() 함수 보존)
-- - super_admin = hard delete + Storage cascade 광역 단독 (is_super_admin() 신규)
-- - 형준님 단독 super_admin 권한 paradigm 정수 (production)
--
-- profiles.role enum 광역 ('customer', 'admin', 'super_admin') 이미 정의 정합 (schema.sql:154-155).
-- is_admin() 함수 광역 = 'admin' + 'super_admin' 양쪽 정합 보존 (schema.sql:65-71).
--
-- 적용 paradigm (Lessons [D]):
-- 1. 본 migration 파일 + schema.sql 동시 commit
-- 2. 형준님 Supabase Dashboard SQL Editor 붙여넣기 실행
-- 3. 실행 사후 함수 광역 확인 (SELECT public.is_super_admin())
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_super_admin() IS
  'cycle 1-E-B-α — super_admin 단독 권한 확인 (hard delete + Storage cascade paradigm 정수). is_admin()과 분리하여 광역 권한 paradigm 강제.';
