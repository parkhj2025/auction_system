import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/court-listings/search?q=2023타경&courtCode=B000240&limit=10
 *
 * 사건번호 자동완성(typeahead) 엔드포인트.
 * court_listings에서 case_number ILIKE 검색, 최대 10건 반환.
 * 인증 불필요 (공개 경매 데이터).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const courtCode = searchParams.get("courtCode")?.trim() ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 20);

  if (q.length < 4) {
    return NextResponse.json({ results: [] });
  }

  try {
    const admin = createAdminClient();

    let query = admin
      .from("court_listings")
      .select(
        "docid, case_number, address_display, bid_date, min_bid_amount, usage_name, item_sequence"
      )
      .ilike("case_number", `%${q}%`)
      .eq("is_active", true)
      .gte("bid_date", new Date().toISOString().slice(0, 10))
      .order("bid_date", { ascending: true })
      .limit(limit);

    if (courtCode) {
      query = query.eq("court_code", courtCode);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[court-listings/search]", error);
      return NextResponse.json({ results: [] });
    }

    return NextResponse.json({ results: data ?? [] });
  } catch (err) {
    console.error("[court-listings/search]", err);
    return NextResponse.json({ results: [] });
  }
}
