-- ============================================================================
-- 경매퀵 Phase 2 — Supabase Schema
-- ----------------------------------------------------------------------------
-- 실행 순서: Supabase Dashboard → SQL Editor → 이 파일 전체를 한 번에 실행.
-- 멱등성: CREATE ... IF NOT EXISTS / DROP POLICY IF EXISTS 패턴으로 작성되어
--         재실행 가능. 단 ENUM 타입은 ALTER 방식이 아니므로 최초 1회만 실행.
--
-- 핵심 설계 결정 (플랜 참조):
--   1. 1물건 1고객: orders partial UNIQUE index on case_number
--   2. SSN 삭제: 상태 전이 시 BEFORE UPDATE 트리거로 자동 NULL
--   3. RLS 성능: is_admin() SECURITY DEFINER 함수 + (select ...) 래핑
--   4. Storage: order-documents 버킷 내 user_id/order_id 폴더 격리
-- ============================================================================


-- ============================================================================
-- 0. EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid()


-- ============================================================================
-- 1. ENUMS
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'deposit_received',
    'bidding',
    'won',
    'lost',
    'deposit_returned',
    'settled',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;


-- ============================================================================
-- 2. HELPER FUNCTIONS
-- ============================================================================

-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- admin 여부 확인 (RLS 성능 최적화)
-- SECURITY DEFINER로 profiles RLS 재귀 우회, STABLE로 쿼리당 캐시 가능
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- 주문 상태가 종료 상태로 전이될 때 ssn_front 자동 NULL
CREATE OR REPLACE FUNCTION public.auto_delete_ssn()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('won', 'lost', 'cancelled', 'deposit_returned', 'settled')
     AND OLD.status NOT IN ('won', 'lost', 'cancelled', 'deposit_returned', 'settled')
     AND NEW.ssn_front IS NOT NULL THEN
    NEW.ssn_front = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- auth.users INSERT 시 profiles 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      ''
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 3. TABLE: profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  display_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,

  role TEXT NOT NULL DEFAULT 'customer'
    CHECK (role IN ('customer', 'admin', 'super_admin')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING ((select public.is_admin()));


-- auth.users → profiles 자동 생성 트리거
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- 4. TABLE: orders
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id TEXT NOT NULL UNIQUE,

  -- 고객
  user_id UUID NOT NULL REFERENCES public.profiles(id),

  -- 물건 식별
  case_number TEXT NOT NULL,
  court TEXT NOT NULL DEFAULT '인천지방법원',
  court_division TEXT,
  matched_slug TEXT,
  manual_entry BOOLEAN NOT NULL DEFAULT false,

  -- 물건 스냅샷 (AnalysisFrontmatter 직렬화)
  property_snapshot JSONB,

  -- 입찰 정보
  bid_amount BIGINT NOT NULL,
  applicant_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  ssn_front TEXT,                               -- 입찰 완료 시 auto_delete_ssn 트리거로 NULL
  joint_bidding BOOLEAN NOT NULL DEFAULT false,
  joint_applicant_name TEXT,
  joint_applicant_phone TEXT,

  -- 재경매 플래그 (보증금 20% 계산용)
  is_rebid BOOLEAN NOT NULL DEFAULT false,

  -- 수수료 스냅샷
  fee_tier TEXT NOT NULL CHECK (fee_tier IN ('earlybird', 'standard', 'rush')),
  base_fee INTEGER NOT NULL,
  success_bonus INTEGER NOT NULL DEFAULT 50000,

  -- 보증금
  deposit_amount BIGINT,
  deposit_status TEXT DEFAULT 'pending'
    CHECK (deposit_status IN ('pending', 'received', 'returned', 'forfeited')),
  deposit_received_at TIMESTAMPTZ,
  deposit_returned_at TIMESTAMPTZ,

  -- 입찰 결과
  result TEXT CHECK (result IN ('won', 'lost', 'cancelled')),
  result_amount BIGINT,
  result_note TEXT,
  result_at TIMESTAMPTZ,

  -- 상태
  status order_status NOT NULL DEFAULT 'pending',

  -- 메타
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- 1물건 1고객 원칙: 동일 사건번호에 대해 활성 접수는 1건만
CREATE UNIQUE INDEX IF NOT EXISTS orders_unique_active_case
  ON public.orders (case_number)
  WHERE status NOT IN ('cancelled', 'settled', 'deposit_returned')
    AND deleted_at IS NULL;

-- RLS 성능을 위한 인덱스 (정책에 사용되는 컬럼)
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status);
CREATE INDEX IF NOT EXISTS orders_case_number_idx ON public.orders (case_number);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);

-- 트리거
DROP TRIGGER IF EXISTS set_updated_at_orders ON public.orders;
CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS auto_delete_ssn_on_status_change ON public.orders;
CREATE TRIGGER auto_delete_ssn_on_status_change
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.auto_delete_ssn();

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT USING ((select auth.uid()) = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "orders_admin_select" ON public.orders;
CREATE POLICY "orders_admin_select" ON public.orders
  FOR SELECT USING ((select public.is_admin()));

DROP POLICY IF EXISTS "orders_admin_update" ON public.orders;
CREATE POLICY "orders_admin_update" ON public.orders
  FOR UPDATE USING ((select public.is_admin()));


-- ============================================================================
-- 5. TABLE: documents
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),

  doc_type TEXT NOT NULL CHECK (doc_type IN ('esign', 'id_card', 'other')),
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS documents_order_id_idx ON public.documents (order_id);
CREATE INDEX IF NOT EXISTS documents_user_id_idx ON public.documents (user_id);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "documents_select_own" ON public.documents;
CREATE POLICY "documents_select_own" ON public.documents
  FOR SELECT USING ((select auth.uid()) = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "documents_insert_own" ON public.documents;
CREATE POLICY "documents_insert_own" ON public.documents
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "documents_admin_select" ON public.documents;
CREATE POLICY "documents_admin_select" ON public.documents
  FOR SELECT USING ((select public.is_admin()));


-- ============================================================================
-- 6. TABLE: order_status_log
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.order_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,

  from_status order_status,                     -- NULL이면 최초 생성
  to_status order_status NOT NULL,

  changed_by UUID REFERENCES public.profiles(id), -- NULL이면 시스템
  note TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_status_log_order_id_idx
  ON public.order_status_log (order_id);
CREATE INDEX IF NOT EXISTS order_status_log_created_at_idx
  ON public.order_status_log (created_at DESC);

ALTER TABLE public.order_status_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "status_log_select_own" ON public.order_status_log;
CREATE POLICY "status_log_select_own" ON public.order_status_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "status_log_admin_all" ON public.order_status_log;
CREATE POLICY "status_log_admin_all" ON public.order_status_log
  FOR ALL USING ((select public.is_admin()));


-- ============================================================================
-- 7. TABLE: analysis_views
-- ============================================================================
-- 소프트 게이팅 열람 이력. 서버(service_role)에서만 조작.
-- RLS 활성화 + 정책 없음 = anon/authenticated 클라이언트 접근 불가.

CREATE TABLE IF NOT EXISTS public.analysis_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID REFERENCES public.profiles(id),
  fingerprint TEXT,

  slug TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analysis_views_fingerprint_idx
  ON public.analysis_views (fingerprint);
CREATE INDEX IF NOT EXISTS analysis_views_user_id_idx
  ON public.analysis_views (user_id);

ALTER TABLE public.analysis_views ENABLE ROW LEVEL SECURITY;
-- (정책 없음: 클라이언트 차단)


-- ============================================================================
-- 8. STORAGE POLICIES (bucket: order-documents)
-- ============================================================================
-- 사전 준비: Supabase Dashboard → Storage → New bucket
--   name: order-documents
--   public: false
--   file size limit: 10 MB
--   allowed mime types: application/pdf, image/jpeg, image/png, image/webp

DROP POLICY IF EXISTS "storage_upload_own" ON storage.objects;
CREATE POLICY "storage_upload_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'order-documents'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  );

DROP POLICY IF EXISTS "storage_select_own" ON storage.objects;
CREATE POLICY "storage_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'order-documents'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  );

DROP POLICY IF EXISTS "storage_select_admin" ON storage.objects;
CREATE POLICY "storage_select_admin"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'order-documents'
    AND (select public.is_admin())
  );


-- ============================================================================
-- 9. 운영 메모 (실행자용)
-- ============================================================================
-- 1. 이 파일 실행 후 Storage 버킷 order-documents를 Dashboard에서 생성할 것.
-- 2. 형준님 계정 최초 로그인 후 다음 쿼리로 admin 권한 부여:
--      UPDATE public.profiles SET role = 'admin' WHERE email = '형준님이메일';
-- 3. 애플리케이션 레벨 상태 전이 규칙은 /api/orders/[id]/status 핸들러가 관리.
--    DB 트리거는 ssn_front 자동 삭제만 담당.
