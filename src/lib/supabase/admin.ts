import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service Role 클라이언트.
 * RLS를 완전히 우회하므로 **서버 사이드에서만** 사용. 클라이언트 번들에 노출
 * 되면 보안 사고. NEXT_PUBLIC_ 접두사 절대 금지.
 *
 * 사용처:
 * - `analysis_views` 테이블 INSERT/SELECT (anon/authenticated RLS 정책 없음)
 * - Phase 3 이후 관리자 전용 특권 쿼리 (감사 로그 등)
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "[supabase/admin] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing"
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
