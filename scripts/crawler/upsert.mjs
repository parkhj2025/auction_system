/**
 * Supabase service_role 클라이언트로 court_listings 테이블 upsert.
 *
 * service_role 키는 RLS를 완전히 우회하므로 서버에서만 사용.
 * 환경변수 SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL 필수.
 */

import { createClient } from "@supabase/supabase-js";

let _client = null;

function getClient() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

/**
 * rows 배열을 docid 기준 upsert.
 * 기존 row가 있으면 last_seen_at, is_active=true로 갱신 + 새 필드 반영.
 * 새 row는 first_seen_at이 자동 now().
 */
export async function upsertListings(rows) {
  if (rows.length === 0) return { upserted: 0 };

  const client = getClient();

  const { error, count } = await client
    .from("court_listings")
    .upsert(rows, {
      onConflict: "docid",
      ignoreDuplicates: false,
      count: "exact",
    });

  if (error) {
    throw new Error(`Supabase upsert failed: ${error.message}`);
  }

  return { upserted: count ?? rows.length };
}

/**
 * 이번 크롤 배치에 포함되지 않은 기존 row들을 is_active=false로 소프트 비활성화.
 * 해당 court_code에서 last_seen_at < cutoff인 row만 대상.
 *
 * cutoff는 이번 배치 시작 시각. 그보다 이전에 seen된 row는 이번 배치에서 등장 안 했음.
 */
export async function markStaleInactive({ courtCode, cutoffIso }) {
  const client = getClient();

  const { error, count } = await client
    .from("court_listings")
    .update({ is_active: false })
    .eq("court_code", courtCode)
    .lt("last_seen_at", cutoffIso)
    .eq("is_active", true)
    .select("docid", { count: "exact", head: true });

  if (error) {
    throw new Error(`Supabase markStaleInactive failed: ${error.message}`);
  }

  return { deactivated: count ?? 0 };
}

/**
 * 헬스체크용: court_listings의 현재 row 수 반환.
 */
export async function countListings(courtCode) {
  const client = getClient();

  let query = client
    .from("court_listings")
    .select("docid", { count: "exact", head: true });

  if (courtCode) {
    query = query.eq("court_code", courtCode);
  }

  const { count, error } = await query;
  if (error) throw new Error(`Count failed: ${error.message}`);
  return count ?? 0;
}
