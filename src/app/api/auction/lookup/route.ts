/**
 * cycle 1-G-γ-α-δ — 비로그인 사건 조회 endpoint (Hero 단독 사용).
 *
 * paradigm:
 * - GET /api/auction/lookup?caseNumber=2024타경569067&courtCode=B000240
 * - auth = 비로그인 진입 가능 (조회 단독 / 중복 체크 + form prefill = /api/orders/check 단독)
 * - cache lookup (court_listings table / TTL 24h) → cache MISS → fetchCaseDetail 대법원 fetch + upsert
 * - rate limit = IP 단위 1분당 10건 (메모리 단독 / production 단독 / dev 영역 검수 약화)
 * - 회신 status = "active" / "closed" / "not_found" + listings array.
 *
 * work-007 (2026-05-13): fetchSingleCase (search API / 매각일 2주 윈도우 제약) →
 *   fetchCaseDetail (detail API / 윈도우 무관 단일 사건 detail) 함수 교체.
 *   work-005 흐름 (cache → fetch → records 분기 → is_case_active → already_taken) 영구 보존.
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CourtListingSummary } from "@/types/apply";
import { fetchCaseDetail } from "@/lib/courtAuction/detail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const CACHE_TTL_HOURS = 24;
const CASE_NUMBER_PATTERN = /^\d{4}타경\d+$/;
const ALLOWED_COURT_CODES = new Set(["B000240"]); // Phase 1 = 인천지방법원 단독

import type { Photo } from "@/types/apply";

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
  /** cycle 1-G-γ-α-η = Hero Card 안 image render 광역 신규 추가 column. */
  photos: Photo[] | null;
  photos_count: number;
  sido: string | null;
  sigungu: string | null;
  dong: string | null;
  case_title: string | null;
}

const LISTING_SELECT =
  "docid, court_name, case_number, address_display, appraisal_amount, min_bid_amount, bid_date, bid_time, usage_name, area_display, failed_count, item_sequence, mokmul_sequence, photos_fetched_at, photos, photos_count, sido, sigungu, dong, case_title";

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
    // 사후 단계 정정 (cycle 1-G-γ-α-ε / work-005 정정 1 closedStale 분기 폐기):
    //   - fetch error catch → fetch_failed 즉시 회신 (stale closed 회피)
    let fetchError: unknown = null;
    if (!cacheHit) {
      try {
        const rows = await fetchCaseDetail({
          courtCode,
          caseNumber,
          courtNameFallback: "인천지방법원",
        });
        if (rows.length > 0) {
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
    // work-005 정정 1 = closedStale 분기 영구 폐기 paradigm.
    // 사유: stale closed row + 신규 records 0 = "사건 자체 사라짐" 의미 = not_found 단단 paradigm.
    // 사전 work-002 cycle ε commit 9802285 closedStale → fetch_failed paradigm NG source 확정.
    //   - 종결 record TTL within 24h 단독 → closed (실제 종결 사건 / 영구 보존)
    //   - 종결 record stale + records 0 → not_found 단독 회신 (closedStale 분기 영구 폐기)
    //   - 종결 record 부재 → not_found
    if (cached.length === 0) {
      const cutoffIso = new Date(
        Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000,
      ).toISOString();
      // work-001 정정 6 safety check = seed-photos row (court_name '(seed-photos)' 패턴) 광역 차단.
      const { data: closedFresh } = await admin
        .from("court_listings")
        .select("docid")
        .eq("case_number", caseNumber)
        .eq("court_code", courtCode)
        .eq("is_active", false)
        .gte("last_seen_at", cutoffIso)
        .not("court_name", "ilike", "%(seed-photos)%")
        .limit(1);
      if (closedFresh && closedFresh.length > 0) {
        return NextResponse.json({ status: "closed", listings: [] });
      }

      return NextResponse.json({ status: "not_found", listings: [] });
    }

    const listings = groupByItem(cached);

    // work-005 정정 2 = 1물건 1고객 race 회피 1차 단계 (Hero 비로그인 시점).
    // listings 광역 첫 항목 auction_round 광역 회수 → is_case_active(case_no, round_no) 호출.
    // anon role EXECUTE GRANT 광역 사실 정합 (Supabase MCP 직접 검수 / PUBLIC + anon 광역).
    // isActive=true 시점 = already_taken 분기 회신 + listings + auction_round 보존 (사용자 안내 + 대안 carrier).
    const auctionRound = listings[0]?.auction_round ?? 1;
    const { data: isActive, error: rpcError } = await admin.rpc(
      "is_case_active",
      { case_no: caseNumber, round_no: auctionRound },
    );
    if (rpcError) {
      console.error("[auction/lookup] is_case_active rpc failed", rpcError);
    }
    if (isActive === true) {
      return NextResponse.json({
        status: "already_taken",
        listings,
        auction_round: auctionRound,
      });
    }

    return NextResponse.json({ status: "active", listings });
  } catch (err) {
    console.error("[auction/lookup] unexpected error", err);
    return NextResponse.json(
      { status: "server_error", listings: [] },
      { status: 500 },
    );
  }
}
