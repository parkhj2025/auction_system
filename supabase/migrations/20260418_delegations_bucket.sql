-- ============================================================================
-- 위임장 PDF 저장 버킷 + 보안 정책
-- ----------------------------------------------------------------------------
-- 실행: Supabase Dashboard → SQL Editor → 이 파일 전체 실행 (멱등).
-- 사용처: src/lib/pdf/delegation.ts → Storage 업로드 (서버 API에서 service_role).
-- 열람: src/app/api/cron/delete-expired-delegations/route.ts (자동 삭제) +
--       마이페이지에서 createSignedUrl(path, 60)으로 60초 만료 URL 발급.
-- 기본 정책: anon/authenticated 직접 read 차단 (정책 미생성 + RLS 활성화).
--           모든 read는 서버 측 service_role을 거쳐 signed URL로만 발급.
-- ============================================================================

-- 1. 버킷 생성 (private, 5MB 제한, application/pdf만 허용)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'delegations',
  'delegations',
  false,
  5242880,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;


-- 2. 버킷 차단 정책 (명시적 거부)
-- storage.objects 테이블은 RLS가 기본 활성화되어 있어 정책 없는 경우
-- anon/authenticated는 자동 차단된다. 그러나 의도를 명시적으로 표현하기
-- 위해 ALL 작업에 대한 명시적 거부 정책을 추가한다.
-- service_role은 RLS를 우회하므로 이 정책의 영향을 받지 않는다.
DROP POLICY IF EXISTS "delegations_block_anon" ON storage.objects;
CREATE POLICY "delegations_block_anon"
  ON storage.objects FOR ALL
  TO anon
  USING (bucket_id <> 'delegations')
  WITH CHECK (bucket_id <> 'delegations');

DROP POLICY IF EXISTS "delegations_block_authenticated" ON storage.objects;
CREATE POLICY "delegations_block_authenticated"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id <> 'delegations')
  WITH CHECK (bucket_id <> 'delegations');


-- 3. orders 테이블에 위임장 PDF 경로 컬럼 추가 (멱등)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delegation_pdf_path TEXT;

COMMENT ON COLUMN public.orders.delegation_pdf_path IS
  '위임장 PDF의 Supabase Storage 경로 (delegations 버킷 내). 3년 후 자동 삭제.';
