-- ============================================================================
-- Phase 7 콘텐츠 이미지 저장 버킷 (content-photos) 정책
-- ----------------------------------------------------------------------------
-- 실행: Supabase Dashboard → SQL Editor → 이 파일 전체 실행 (멱등).
-- 사용처: scripts/content-publish/index.mjs (CLI) → service_role로 이미지 업로드.
--         콘텐츠 페이지(/analysis/[slug])에서 Storage public URL로 렌더.
-- 내용 흐름: Cowork 원천 이미지(jpg) → sharp WebP(width 1600, q82) →
--            key = {slug}/{sha256(webp).slice(0,8)}.webp (원칙 5 준수, 한글 미포함).
-- 관련 문서: docs/content-source-v1.md (규격 v1), docs/roadmap.md Phase 7.
-- ----------------------------------------------------------------------------
-- 사전 준비 (선행 필수): Supabase Dashboard → Storage → New bucket (UI로 생성)
--   name: content-photos
--   public: true               (콘텐츠 페이지에서 익명 렌더)
--   file size limit: 10 MB     (원본 대비 여유 마진, 실제 WebP 200~400KB)
--   allowed mime types: image/jpeg, image/png, image/webp
--
-- 근거: storage.buckets 테이블은 supabase_storage_admin 소유라 일반 SQL Editor
--       사용자의 INSERT가 권한 차단되는 경우가 있어, 버킷 생성은 Dashboard UI,
--       정책만 SQL로 관리한다. court-photos와 동일한 패턴.
-- ============================================================================

-- 1. Public read 정책 (Dashboard UI가 기본 SELECT 정책 1개를 추가하지만,
--    Plan v1 요구 정책을 명시적으로 선언하여 의도를 코드로 표현)
DROP POLICY IF EXISTS "content_photos_public_read" ON storage.objects;
CREATE POLICY "content_photos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-photos');


-- 2. Service role write 정책 (service_role은 RLS를 우회하므로 기능상 의미는
--    없으나, "CLI만 쓸 수 있다"는 의도를 코드로 명시. court-photos는 정책 없이
--    service_role에 의존하지만 content-photos는 Plan v1 요구대로 명시적 선언.)
DROP POLICY IF EXISTS "content_photos_service_write" ON storage.objects;
CREATE POLICY "content_photos_service_write"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'content-photos');
