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
-- 0. EXTENSIONS & SESSION SETTINGS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid()

-- is_admin() 같은 LANGUAGE sql 함수가 아래에서 선언될 profiles 테이블을
-- 참조하므로, 함수 본문 즉시 검증을 비활성화한다. 테이블 생성 후 함수 호출
-- 시점에는 정상 바인딩되므로 안전.
SET check_function_bodies = off;


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


-- 사건번호 + 매각회차가 현재 활성 접수 상태인지 확인 (1물건 1고객 사전 검증용)
-- SECURITY DEFINER로 orders RLS 우회하여 본인 접수뿐 아니라 타인 접수도 체크 가능.
-- 반환은 boolean만이므로 타인 접수의 상세 내용은 노출되지 않음.
-- Phase 6.7.6: case_number 단일 키 → (case_number, auction_round) 복합 키로 확장.
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


-- 주문 생성 시 order_status_log에 초기 row 자동 삽입 (RLS 우회)
-- order_status_log INSERT 정책이 admin 전용이므로, 사용자가 /api/apply로
-- orders를 생성한 직후 log row를 만들려면 RLS를 우회할 필요가 있음.
-- SECURITY DEFINER로 postgres 권한으로 INSERT 수행.
CREATE OR REPLACE FUNCTION public.log_order_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.order_status_log (order_id, from_status, to_status, changed_by)
  VALUES (NEW.id, NULL, NEW.status, NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


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
  auction_round INT NOT NULL DEFAULT 1 CHECK (auction_round >= 1),  -- Phase 6.7.6
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

-- 1물건 1고객 원칙 (Phase 6.7.6): 동일 사건번호 + 동일 매각회차에 대해 활성 접수는 1건만.
-- 다른 회차는 별도 접수로 허용 (유찰 후 재매각 케이스 대응).
CREATE UNIQUE INDEX IF NOT EXISTS orders_unique_active_case_round
  ON public.orders (case_number, auction_round)
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

DROP TRIGGER IF EXISTS on_order_created ON public.orders;
CREATE TRIGGER on_order_created
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_order_creation();

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
-- 9. TABLE: court_listings (P2-7 대법원 크롤러 적재 대상)
-- ============================================================================
-- 대법원 경매정보 사이트(courtauction.go.kr)에서 일일 배치로 수집되는
-- 경매 물건 목록. 크롤러가 service_role로 upsert하고, anon/authenticated
-- 사용자는 SELECT만 가능(공개 데이터).
--
-- 사진(photos JSONB)은 크롤링 시점에는 채우지 않고, 고객이 /apply에서
-- "사진 보기"를 누르는 시점에 별도 API가 selectPicInf.on 호출 → sharp로
-- 1/10 WebP 압축 → Supabase Storage(court-photos 버킷)에 업로드 →
-- 결과 URL을 이 컬럼에 저장하는 온디맨드 방식.

CREATE TABLE IF NOT EXISTS public.court_listings (
  -- 식별자 (대법원 응답 그대로)
  docid TEXT PRIMARY KEY,                      -- 대법원 고유 ID (B000240... 형식)
  court_code TEXT NOT NULL,                    -- cortOfcCd (예: B000240)
  court_name TEXT NOT NULL,                    -- jiwonNm (예: 인천지방법원)
  case_number TEXT NOT NULL,                   -- srnSaNo (예: 2021타경515069)
  internal_case_no TEXT,                       -- saNo (내부 표기, 조인용)
  item_sequence INT DEFAULT 1,                 -- maemulSer (물건 순번)
  mokmul_sequence INT DEFAULT 1,               -- mokmulSer
  group_id TEXT,                                -- groupmaemulser (사건별 그룹)

  -- 주소
  sido TEXT,                                    -- hjguSido
  sigungu TEXT,                                 -- hjguSigu
  dong TEXT,                                    -- hjguDong
  ri_name TEXT,                                 -- hjguRd (리)
  lot_number TEXT,                              -- daepyoLotno (지번)
  building_name TEXT,                           -- buldNm
  address_display TEXT,                         -- printSt (완성 주소)

  -- 면적 / 지목 / 용도
  area_display TEXT,                            -- areaList (예: "2645㎡")
  area_m2 NUMERIC,                              -- maxArea / minArea
  land_category TEXT,                           -- jimokList (예: "임야")
  usage_name TEXT,                              -- dspslUsgNm (예: "다세대")
  usage_large_code TEXT,                        -- lclsUtilCd
  usage_medium_code TEXT,                       -- mclsUtilCd
  usage_small_code TEXT,                        -- sclsUtilCd

  -- 경매 정보
  appraisal_amount BIGINT,                      -- gamevalAmt (감정가)
  min_bid_amount BIGINT,                        -- minmaePrice (최저매각가)
  next_min_bid_amount BIGINT,                   -- notifyMinmaePrice1
  next_min_bid_rate INT,                        -- notifyMinmaePriceRate1
  failed_count INT DEFAULT 0,                   -- yuchalCnt (유찰횟수)
  bid_date DATE,                                -- maeGiil YYYYMMDD → DATE
  bid_time TEXT,                                -- maeHh1 (예: "1000")
  result_decision_date DATE,                    -- maegyuljGiil
  bid_place TEXT,                               -- maePlace (예: "219호법정")
  status_code TEXT,                             -- mulStatcd
  progress_status_code TEXT,                    -- jinstatCd
  is_progressing BOOLEAN,                       -- mulJinYn = 'Y'
  bigo TEXT,                                    -- mulBigo (특이사항)

  -- 담당
  dept_code TEXT,                               -- jpDeptCd
  dept_name TEXT,                               -- jpDeptNm (예: "경매14계")
  dept_tel TEXT,                                -- tel

  -- 좌표
  wgs84_lon NUMERIC,                            -- wgs84Xcordi
  wgs84_lat NUMERIC,                            -- wgs84Ycordi

  -- 사진 (온디맨드로 채워짐)
  photos JSONB,                                 -- [{seq,category,caption,url,thumbnailUrl}]
  photos_fetched_at TIMESTAMPTZ,                -- 사진 수집 시점 (null = 미수집)
  photos_count INT DEFAULT 0,                   -- 업로드된 사진 개수

  -- 1-D-A 메타 확장
  case_title TEXT,                              -- 사건명 (raw_snapshot 광역 추출)

  -- 원본 보존 (스키마 변경 대응용)
  raw_snapshot JSONB NOT NULL,                  -- 크롤러 응답 record 전체

  -- 운영 메타
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true       -- 배치에서 안 보이면 false (소프트 비활성화)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS court_listings_court_active_idx
  ON public.court_listings (court_code, is_active, bid_date);
CREATE INDEX IF NOT EXISTS court_listings_case_number_idx
  ON public.court_listings (case_number);
CREATE INDEX IF NOT EXISTS court_listings_bid_date_idx
  ON public.court_listings (bid_date)
  WHERE is_active = true;
CREATE INDEX IF NOT EXISTS court_listings_usage_idx
  ON public.court_listings (usage_large_code, usage_medium_code)
  WHERE is_active = true;

-- RLS: 공공 공개 데이터 → 모든 사용자(anon 포함) SELECT 허용
-- INSERT/UPDATE/DELETE 정책 없음 → service_role key만 쓰기 가능
ALTER TABLE public.court_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "court_listings_public_read" ON public.court_listings;
CREATE POLICY "court_listings_public_read" ON public.court_listings
  FOR SELECT USING (is_active = true);


-- ============================================================================
-- 10. STORAGE POLICIES (buckets: court-photos, content-photos)
-- ============================================================================
-- 사전 준비: Supabase Dashboard → Storage → New bucket
--   name: court-photos
--   public: true               (공공 경매 사진이라 익명 조회 허용)
--   file size limit: 500 KB    (1/10 WebP 압축 후 평균 30KB)
--   allowed mime types: image/webp, image/jpeg

DROP POLICY IF EXISTS "court_photos_public_read" ON storage.objects;
CREATE POLICY "court_photos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'court-photos');

-- INSERT/UPDATE는 정책 없음 → service_role key로만 업로드 가능
-- (크롤러·사진 페처가 SUPABASE_SERVICE_ROLE_KEY로 직접 업로드)


-- Phase 7 콘텐츠 이미지 버킷 (content-photos)
-- 마이그레이션: supabase/migrations/20260421_content_photos_bucket.sql
-- 사전 준비: Supabase Dashboard → Storage → New bucket (UI로 생성)
--   name: content-photos
--   public: true               (콘텐츠 페이지에서 익명 렌더)
--   file size limit: 10 MB     (원본 대비 여유 마진, 실제 WebP 200~400KB)
--   allowed mime types: image/jpeg, image/png, image/webp
-- 사용처: scripts/content-publish/index.mjs (CLI) — Cowork 원천 이미지 업로드.

DROP POLICY IF EXISTS "content_photos_public_read" ON storage.objects;
CREATE POLICY "content_photos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-photos');

DROP POLICY IF EXISTS "content_photos_service_write" ON storage.objects;
CREATE POLICY "content_photos_service_write"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'content-photos');

-- UPDATE/DELETE는 정책 없음 → service_role key로만 작업 가능


-- ============================================================================
-- 11. 운영 메모 (실행자용)
-- ============================================================================
-- 1. 이 파일 실행 후 Storage 버킷 3개를 Dashboard에서 생성(또는 migration 파일 실행):
--    - order-documents (private, 10MB, PDF/JPG/PNG/WebP) — P2-2에서 사용
--    - court-photos (public, 500KB, WebP/JPG) — P2-7에서 사용
--    - content-photos (public, 10MB, JPEG/PNG/WebP) — Phase 7에서 사용
-- 2. 형준님 계정 최초 로그인 후 다음 쿼리로 admin 권한 부여:
--      UPDATE public.profiles SET role = 'admin' WHERE email = '형준님이메일';
-- 3. 애플리케이션 레벨 상태 전이 규칙은 /api/orders/[id]/status 핸들러가 관리.
--    DB 트리거는 ssn_front 자동 삭제만 담당.
-- 4. court_listings는 크롤러(scripts/crawler/)가 service_role로 upsert.
--    anon 사용자도 SELECT 가능(공공 데이터).
