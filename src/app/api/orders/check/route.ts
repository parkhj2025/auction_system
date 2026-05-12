/**
 * cycle 1-D-A-3-2 = 크롤링 paradigm 광역 전환 (mass 수집 → on-demand 단일 fetch).
 *
 * 흐름 광역:
 *   1. auth 광역 (login 의무)
 *   2. round 명시 시 = is_case_active RPC 광역 중복 체크
 *   3. court_listings cache lookup (TTL 24h 광역 = `last_seen_at >= NOW() - 24h`)
 *   4. cache HIT = 즉시 회신
 *   5. cache MISS = 대법원 광역 fetch (search.ts) + mapper + upsert + 즉시 회신
 *   6. fetch NG = listings [] + case_status="not_found" 회신 (client amber alert + 사건번호 input focus 자동 paradigm / cycle 1-D-A-4-2)
 *
 * bid_date filter 광역 폐기 (cycle 1-D-A-4 영역 통합 사전 정합).
 * is_active filter 광역 보존 (종결 사건 광역 분기 = cycle 1-D-A-4 영역).
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CourtListingSummary } from "@/types/apply";
import { fetchSingleCase } from "@/lib/courtAuction/search";
import { mapRecordToRow } from "@/lib/courtAuction/mapper";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const CACHE_TTL_HOURS = 24;

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

/**
 * mokmul 단위 row → item 단위로 그룹핑.
 * 같은 (case_number, item_sequence) 조합의 mokmul들을 통합.
 * 대표 주소: 건물(도로명) 우선, 면적 있는 것 우선.
 */
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

/** cache lookup — TTL 24h 광역 + is_active=true + court_code/court_name filter. */
async function lookupCache(
  admin: AdminClient,
  caseNumber: string,
  courtCode: string,
  courtName: string,
): Promise<RawListing[]> {
  const cutoffIso = new Date(
    Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000,
  ).toISOString();

  let query = admin
    .from("court_listings")
    .select(LISTING_SELECT)
    .eq("case_number", caseNumber)
    .eq("is_active", true)
    .gte("last_seen_at", cutoffIso);

  if (courtCode) {
    query = query.eq("court_code", courtCode);
  } else if (courtName) {
    query = query.eq("court_name", courtName);
  }

  const { data, error } = await query
    .order("bid_date", { ascending: true })
    .order("item_sequence", { ascending: true })
    .order("mokmul_sequence", { ascending: true });

  if (error) {
    console.error("[orders/check] cache lookup failed", error);
    return [];
  }
  return (data ?? []) as RawListing[];
}

/**
 * 사건번호 중복 확인 + court_listings 매칭 엔드포인트.
 *
 * Step1Property에서 사건번호 입력 후 호출.
 * - 중복 확인: `is_case_active()` RPC (기존)
 * - 매칭: cache → on-demand fetch → upsert paradigm (cycle 1-D-A-3-2).
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { available: null, error: "unauthenticated", listings: [] },
        { status: 401 },
      );
    }

    const body = (await req.json().catch(() => null)) as
      | {
          caseNumber?: string;
          courtCode?: string;
          courtName?: string;
          round?: number;
        }
      | null;
    const caseNumber = body?.caseNumber?.trim() ?? "";
    const courtCode = body?.courtCode?.trim() ?? "";
    const courtName = body?.courtName?.trim() ?? "";
    const round =
      typeof body?.round === "number" && body.round >= 1 ? body.round : null;

    if (!caseNumber) {
      return NextResponse.json(
        { available: null, error: "invalid_input", listings: [] },
        { status: 400 },
      );
    }

    // 1. 중복 접수 확인 (round 명시된 경우만)
    if (round !== null) {
      const { data: isActive, error: rpcError } = await supabase.rpc(
        "is_case_active",
        { case_no: caseNumber, round_no: round },
      );

      if (rpcError) {
        console.error("[orders/check] rpc failed", rpcError);
        return NextResponse.json(
          { available: null, error: "server_error", listings: [] },
          { status: 500 },
        );
      }

      if (isActive === true) {
        return NextResponse.json({
          available: false,
          reason:
            "이미 다른 고객의 접수가 진행 중입니다. 같은 회차는 중복 접수할 수 없습니다.",
          listings: [],
        });
      }
    }

    // 2. cache lookup (TTL 24h 광역 / cycle 1-D-A-3-2)
    const admin = createAdminClient();
    let cached = await lookupCache(admin, caseNumber, courtCode, courtName);

    let cacheHit = cached.length > 0;
    let fetchAttempted = false;
    let fetchError: string | null = null;
    let fetchRecordsCount: number | null = null;

    // 3. cache MISS = 대법원 광역 on-demand fetch
    if (!cacheHit && courtCode) {
      fetchAttempted = true;
      try {
        const records = await fetchSingleCase({ courtCode, caseNumber });
        fetchRecordsCount = records.length;
        if (records.length > 0) {
          const rows = records.map((r) => mapRecordToRow(r, courtName));
          const { error: upsertError } = await admin
            .from("court_listings")
            .upsert(rows, {
              onConflict: "docid",
              ignoreDuplicates: false,
            });
          if (upsertError) {
            console.error("[orders/check] upsert failed", upsertError);
          }
          cached = await lookupCache(
            admin,
            caseNumber,
            courtCode,
            courtName,
          );
          cacheHit = cached.length > 0;
        }
      } catch (err) {
        fetchError = err instanceof Error ? err.message : "fetch_failed";
        console.error("[orders/check] on-demand fetch failed", err);
      }
    }

    // 3-A. fetch error 시점 = fetch_failed 즉시 회신 (cycle 1-G-γ-α-ε / DB stale closed 회피).
    if (fetchError !== null) {
      return NextResponse.json({
        available: null,
        case_status: "fetch_failed",
        message:
          "사건 정보 확인이 일시적으로 어렵습니다. 잠시 후 다시 시도해주세요.",
        listings: [],
        cache_hit: cacheHit,
        fetch_attempted: fetchAttempted,
        fetch_error: fetchError,
      });
    }

    // 4. cycle 1-G-γ-α-ε: is_active 분기 정정.
    //   - 종결 record TTL within 24h 단독 → closed (실제 종결 사건)
    //   - 종결 record stale + fetch records.length === 0 → fetch_failed (stale closed NG 회피)
    //   - 종결 record 부재 → not_found
    let caseStatus: "active" | "closed" | "not_found" | "fetch_failed" =
      "active";
    if (cached.length === 0) {
      const cutoffIso = new Date(
        Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000,
      ).toISOString();

      const { data: closedFresh } = await admin
        .from("court_listings")
        .select("docid")
        .eq("case_number", caseNumber)
        .eq("is_active", false)
        .gte("last_seen_at", cutoffIso)
        .limit(1);
      if (closedFresh && closedFresh.length > 0) {
        caseStatus = "closed";
      } else {
        const { data: closedStale } = await admin
          .from("court_listings")
          .select("docid")
          .eq("case_number", caseNumber)
          .eq("is_active", false)
          .limit(1);
        if (
          closedStale &&
          closedStale.length > 0 &&
          fetchRecordsCount === 0
        ) {
          return NextResponse.json({
            available: null,
            case_status: "fetch_failed",
            message:
              "사건 정보 확인이 일시적으로 어렵습니다. 잠시 후 다시 시도해주세요.",
            listings: [],
            cache_hit: cacheHit,
            fetch_attempted: fetchAttempted,
            fetch_error: null,
          });
        }
        caseStatus = "not_found";
      }
    }

    const grouped = groupByItem(cached);

    return NextResponse.json({
      available: true,
      listings: grouped,
      case_status: caseStatus,
      cache_hit: cacheHit,
      fetch_attempted: fetchAttempted,
      fetch_error: fetchError,
    });
  } catch (err) {
    console.error("[orders/check]", err);
    return NextResponse.json(
      { available: null, error: "server_error", listings: [] },
      { status: 500 },
    );
  }
}
