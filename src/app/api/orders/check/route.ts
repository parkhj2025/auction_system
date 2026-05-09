import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CourtListingSummary } from "@/types/apply";

export const dynamic = "force-dynamic";

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
    // 대표 row 선택: 건물명이 있는 것 우선, 없으면 첫 번째
    const representative =
      group.find((r) => r.address_display?.includes("(")) ??
      group.find((r) => r.usage_name && !r.usage_name.includes("대지") && !r.usage_name.includes("토지")) ??
      group[0];

    result.push({
      ...representative,
      component_count: group.length,
      auction_round: representative.failed_count + 1,
    });
  }

  // bid_date → item_sequence 순 정렬 유지
  result.sort((a, b) => {
    const d = (a.bid_date ?? "").localeCompare(b.bid_date ?? "");
    if (d !== 0) return d;
    return a.item_sequence - b.item_sequence;
  });

  return result;
}

/**
 * 사건번호 중복 확인 + court_listings 매칭 엔드포인트.
 *
 * Step1Property에서 사건번호 입력 후 호출.
 * - 중복 확인: `is_case_active()` RPC (기존)
 * - 매칭: court_listings 조회 → listings 배열 반환 (D2 court_code 필터, D3 복수 매칭)
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
        { status: 401 }
      );
    }

    const body = (await req.json().catch(() => null)) as
      | { caseNumber?: string; courtCode?: string; courtName?: string; round?: number }
      | null;
    const caseNumber = body?.caseNumber?.trim() ?? "";
    const courtCode = body?.courtCode?.trim() ?? "";
    const courtName = body?.courtName?.trim() ?? "";
    // Phase 6.7.6: 중복 체크는 round가 명시될 때만 수행.
    // round 미제공(Step1 최초 lookup) → 체크 스킵 + listings만 리턴. 사용자가
    // listing 선택 또는 CaseConfirmModal에서 round 확정한 후에 클라이언트가 재호출.
    const round =
      typeof body?.round === "number" && body.round >= 1 ? body.round : null;

    if (!caseNumber) {
      return NextResponse.json(
        { available: null, error: "invalid_input", listings: [] },
        { status: 400 }
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

    // 2. court_listings 매칭 (D2: court_code 필터, D3: 배열 반환)
    const admin = createAdminClient();
    let query = admin
      .from("court_listings")
      .select(
        "docid, court_name, case_number, address_display, appraisal_amount, min_bid_amount, bid_date, bid_time, usage_name, area_display, failed_count, item_sequence, mokmul_sequence, photos_fetched_at, sido, sigungu, dong, case_title"
      )
      .eq("case_number", caseNumber)
      .eq("is_active", true)
      .gte("bid_date", new Date().toISOString().slice(0, 10));

    // court_code 또는 court_name으로 필터 (D2)
    // 둘 다 없으면 필터 없이 전체 검색 (typeahead에서 법원 무관 검색 시)
    if (courtCode) {
      query = query.eq("court_code", courtCode);
    } else if (courtName) {
      query = query.eq("court_name", courtName);
    }

    const { data: listings, error: listingsError } = await query.order(
      "bid_date",
      { ascending: true }
    ).order("item_sequence", { ascending: true }).order(
      "mokmul_sequence",
      { ascending: true }
    );

    if (listingsError) {
      console.error("[orders/check] listings query failed", listingsError);
    }

    // item 단위로 그룹핑 (같은 item의 mokmul들을 통합)
    const grouped = groupByItem(listings ?? []);

    return NextResponse.json({
      available: true,
      listings: grouped,
    });
  } catch (err) {
    console.error("[orders/check]", err);
    return NextResponse.json(
      { available: null, error: "server_error", listings: [] },
      { status: 500 }
    );
  }
}
