-- ============================================================================
-- Phase 7 콘텐츠 이미지 저장 버킷 (content-photos) + 공개 read 정책
-- ----------------------------------------------------------------------------
-- 실행: Supabase Dashboard → SQL Editor → 이 파일 전체 실행 (멱등).
-- 사용처: scripts/content-publish/index.mjs (CLI) → service_role로 이미지 업로드.
--         콘텐츠 페이지(/analysis/[slug])에서 Storage public URL로 렌더.
-- 내용 흐름: Cowork 원천 이미지(jpg) → sharp WebP(width 1600, q82) →
--            key = {slug}/{sha256(webp).slice(0,8)}.webp (원칙 5 준수, 한글 미포함).
-- 기본 정책: public read 허용(익명 조회). write는 service_role만(정책 미생성).
-- 관련 문서: docs/content-source-v1.md (규격 v1), docs/roadmap.md Phase 7.
-- ============================================================================

-- 1. 버킷 생성 (public, 10MB 제한, 이미지 3종)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'content-photos',
  'content-photos',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;


-- 2. 공개 read 정책 (court-photos와 동일 패턴)
-- INSERT/UPDATE/DELETE는 정책 없음 → service_role key로만 작업 가능.
DROP POLICY IF EXISTS "content_photos_public_read" ON storage.objects;
CREATE POLICY "content_photos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-photos');
