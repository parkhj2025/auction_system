import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CourtListingSummary } from "@/types/apply";

export const dynamic = "force-dynamic";

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
      | { caseNumber?: string; courtCode?: string }
      | null;
    const caseNumber = body?.caseNumber?.trim() ?? "";
    const courtCode = body?.courtCode?.trim() ?? "";

    if (!caseNumber) {
      return NextResponse.json(
        { available: null, error: "invalid_input", listings: [] },
        { status: 400 }
      );
    }

    // 1. 중복 접수 확인 (기존 RPC)
    const { data: isActive, error: rpcError } = await supabase.rpc(
      "is_case_active",
      { case_no: caseNumber }
    );

    if (rpcError) {
      console.error("[orders/check] rpc failed", rpcError);
      return NextResponse.json(
        { available: null, error: "server_error", listings: [] },
        { status: 500 }
      );
    }

    if (isActive === true) {
      return NextResponse.json({
        available: false,
        reason:
          "이미 다른 고객의 접수가 진행 중입니다. 같은 물건은 중복 접수할 수 없습니다.",
        listings: [],
      });
    }

    // 2. court_listings 매칭 (D2: court_code 필터, D3: 배열 반환)
    const admin = createAdminClient();
    let query = admin
      .from("court_listings")
      .select(
        "docid, court_name, case_number, address_display, appraisal_amount, min_bid_amount, bid_date, bid_time, usage_name, area_display, failed_count, item_sequence, mokmul_sequence, photos_fetched_at"
      )
      .eq("case_number", caseNumber)
      .eq("is_active", true)
      .gte("bid_date", new Date().toISOString().slice(0, 10));

    if (courtCode) {
      query = query.eq("court_code", courtCode);
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

    return NextResponse.json({
      available: true,
      listings: (listings ?? []) as CourtListingSummary[],
    });
  } catch (err) {
    console.error("[orders/check]", err);
    return NextResponse.json(
      { available: null, error: "server_error", listings: [] },
      { status: 500 }
    );
  }
}
