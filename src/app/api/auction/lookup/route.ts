/**
 * cycle 1-G-γ-α-δ — 비로그인 사건 조회 endpoint (Hero 단독 사용).
 *
 * paradigm:
 * - GET /api/auction/lookup?caseNumber=2024타경569067&courtCode=B000240
 * - auth = 비로그인 진입 가능 (조회 단독 / 중복 체크 + form prefill = /api/orders/check 단독)
 * - cache lookup (court_listings table / TTL 24h) → cache MISS → fetchSingleCase 대법원 fetch + upsert
 * - rate limit = IP 단위 1분당 10건 (메모리 단독 / production 단독 / dev 영역 검수 약화)
 * - 회신 status = "active" / "closed" / "not_found" + listings array.
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CourtListingSummary } from "@/types/apply";
import { fetchSingleCase } from "@/lib/courtAuction/search";
import { mapRecordToRow } from "@/lib/courtAuction/mapper";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const CACHE_TTL_HOURS = 24;
const CASE_NUMBER_PATTERN = /^\d{4}타경\d+$/;
const ALLOWED_COURT_CODES = new Set(["B000240"]); // Phase 1 = 인천지방법원 단독

interface RawListing {
  docid: string;
  court_name: string;
  case_number: string;
  address_display: string | null;
  appraisal_amount: number | null;
  min_bid_amount: number | null;
  bid_date: string | null;
  bid_time: string | null;
  usage_name: string | null;
  area_display: string | null;
  failed_count: number;
  item_sequence: number;
  mokmul_sequence: number;
  photos_fetched_at: string | null;
  sido: string | null;
  sigungu: string | null;
  dong: string | null;
  case_title: string | null;
}

const LISTING_SELECT =
  "docid, court_name, case_number, address_display, appraisal_amount, min_bid_amount, bid_date, bid_time, usage_name, area_display, failed_count, item_sequence, mokmul_sequence, photos_fetched_at, sido, sigungu, dong, case_title";

/* rate limit = IP 단위 1분당 10건 (단순 메모리 / production 단독 / 재시작 시점 초기화). */
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const history = rateLimitMap.get(ip) ?? [];
  const recent = history.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    return false;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

/* mokmul 단위 row → item 단위 그룹핑 (/api/orders/check paradigm 일치). */
function groupByItem(rows: RawListing[]): CourtListingSummary[] {
  const map = new Map<string, RawListing[]>();
  for (const r of rows) {
    const key = `${r.case_number}|${r.item_sequence}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }

  const result: CourtListingSummary[] = [];
  for (const [, group] of map) {
    const representative =
      group.find((r) => r.address_display?.includes("(")) ??
      group.find(
        (r) =>
          r.usage_name &&
          !r.usage_name.includes("대지") &&
          !r.usage_name.includes("토지"),
      ) ??
      group[0];

    result.push({
      ...representative,
      component_count: group.length,
      auction_round: representative.failed_count + 1,
    });
  }

  result.sort((a, b) => {
    const d = (a.bid_date ?? "").localeCompare(b.bid_date ?? "");
    if (d !== 0) return d;
    return a.item_sequence - b.item_sequence;
  });

  return result;
}

type AdminClient = ReturnType<typeof createAdminClient>;

async function lookupCache(
  admin: AdminClient,
  caseNumber: string,
  courtCode: string,
): Promise<RawListing[]> {
  const cutoffIso = new Date(
    Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await admin
    .from("court_listings")
    .select(LISTING_SELECT)
    .eq("case_number", caseNumber)
    .eq("court_code", courtCode)
    .eq("is_active", true)
    .gte("last_seen_at", cutoffIso)
    .order("bid_date", { ascending: true })
    .order("item_sequence", { ascending: true })
    .order("mokmul_sequence", { ascending: true });

  if (error) {
    console.error("[auction/lookup] cache lookup failed", error);
    return [];
  }
  return (data ?? []) as RawListing[];
}

export async function GET(req: Request) {
  try {
    // rate limit (IP 단위 / production 단독).
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { status: "rate_limited", listings: [] },
        { status: 429 },
      );
    }

    const { searchParams } = new URL(req.url);
    const caseNumber = searchParams.get("caseNumber")?.trim() ?? "";
    const courtCode = (
      searchParams.get("courtCode")?.trim() ?? "B000240"
    ).toUpperCase();

    // caseNumber 형식 검증.
    if (!CASE_NUMBER_PATTERN.test(caseNumber)) {
      return NextResponse.json(
        { status: "invalid_input", listings: [] },
        { status: 400 },
      );
    }

    // courtCode 검증 (Phase 1 = B000240 단독).
    if (!ALLOWED_COURT_CODES.has(courtCode)) {
      return NextResponse.json(
        { status: "invalid_court", listings: [] },
        { status: 400 },
      );
    }

    const admin = createAdminClient();

    // cache lookup (TTL 24h / is_active=true 단독).
    let cached = await lookupCache(admin, caseNumber, courtCode);
    let cacheHit = cached.length > 0;

    // cache MISS = 대법원 광역 on-demand fetch.
    // 사후 단계 정정 (cycle 1-G-γ-α-ε):
    //   - fetch error catch → fetch_failed 즉시 회신 (stale closed 회피)
    //   - records.length === 0 + DB stale은 단계 4에서 fetch_failed 분기.
    let fetchError: unknown = null;
    let fetchRecordsCount: number | null = null;
    if (!cacheHit) {
      try {
        const records = await fetchSingleCase({ courtCode, caseNumber });
        fetchRecordsCount = records.length;
        if (records.length > 0) {
          const rows = records.map((r) => mapRecordToRow(r, "인천지방법원"));
          const { error: upsertError } = await admin
            .from("court_listings")
            .upsert(rows, {
              onConflict: "docid",
              ignoreDuplicates: false,
            });
          if (upsertError) {
            console.error("[auction/lookup] upsert failed", upsertError);
          }
          cached = await lookupCache(admin, caseNumber, courtCode);
          cacheHit = cached.length > 0;
        }
      } catch (err) {
        fetchError = err;
        console.error("[auction/lookup] on-demand fetch failed", err);
      }
    }

    // fetch error 시점 = fetch_failed 즉시 회신 (DB stale closed 회피).
    if (fetchError !== null) {
      return NextResponse.json({
        status: "fetch_failed",
        message:
          "사건 정보 확인이 일시적으로 어렵습니다. 잠시 후 다시 시도해주세요.",
        listings: [],
      });
    }

    // is_active 분기 — listings 0건 + 종결 record 광역 분기.
    // 사후 단계 정정 (cycle 1-G-γ-α-ε):
    //   - 종결 record TTL within 24h 단독 → closed (실제 종결 사건)
    //   - 종결 record stale + fetch records.length === 0 → fetch_failed (stale closed NG 회피)
    //   - 종결 record 부재 → not_found
    if (cached.length === 0) {
      const cutoffIso = new Date(
        Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000,
      ).toISOString();
      const { data: closedFresh } = await admin
        .from("court_listings")
        .select("docid")
        .eq("case_number", caseNumber)
        .eq("court_code", courtCode)
        .eq("is_active", false)
        .gte("last_seen_at", cutoffIso)
        .limit(1);
      if (closedFresh && closedFresh.length > 0) {
        return NextResponse.json({ status: "closed", listings: [] });
      }

      const { data: closedStale } = await admin
        .from("court_listings")
        .select("docid")
        .eq("case_number", caseNumber)
        .eq("court_code", courtCode)
        .eq("is_active", false)
        .limit(1);
      if (
        closedStale &&
        closedStale.length > 0 &&
        fetchRecordsCount === 0
      ) {
        return NextResponse.json({
          status: "fetch_failed",
          message:
            "사건 정보 확인이 일시적으로 어렵습니다. 잠시 후 다시 시도해주세요.",
          listings: [],
        });
      }

      return NextResponse.json({ status: "not_found", listings: [] });
    }

    const listings = groupByItem(cached);
    return NextResponse.json({ status: "active", listings });
  } catch (err) {
    console.error("[auction/lookup] unexpected error", err);
    return NextResponse.json(
      { status: "server_error", listings: [] },
      { status: 500 },
    );
  }
}
