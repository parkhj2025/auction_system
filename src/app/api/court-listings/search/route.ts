import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

interface RawRow {
  docid: string;
  case_number: string;
  court_name: string;
  court_code: string;
  address_display: string | null;
  bid_date: string | null;
  min_bid_amount: number | null;
  usage_name: string | null;
  item_sequence: number;
  mokmul_sequence: number;
}

/** mokmul → item 그룹핑. 건물 주소 우선 대표 선택. */
function groupByItem(rows: RawRow[]) {
  const map = new Map<string, RawRow[]>();
  for (const r of rows) {
    const key = `${r.case_number}|${r.item_sequence}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const result: (RawRow & { component_count: number })[] = [];
  for (const [, group] of map) {
    const rep =
      group.find((r) => r.address_display?.includes("(")) ??
      group.find((r) => r.usage_name && !r.usage_name.includes("대지")) ??
      group[0];
    result.push({ ...rep, component_count: group.length });
  }
  return result;
}

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

    // item 단위 그룹핑을 위해 충분히 가져옴 (limit의 3배 — mokmul 통합 후 줄어듦)
    let query = admin
      .from("court_listings")
      .select(
        "docid, case_number, court_name, court_code, address_display, bid_date, min_bid_amount, usage_name, item_sequence, mokmul_sequence"
      )
      .ilike("case_number", `%${q}%`)
      .eq("is_active", true)
      .gte("bid_date", new Date().toISOString().slice(0, 10))
      .order("bid_date", { ascending: true })
      .limit(limit * 3);

    if (courtCode) {
      query = query.eq("court_code", courtCode);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[court-listings/search]", error);
      return NextResponse.json({ results: [] });
    }

    // item 단위 그룹핑 (같은 case+item의 mokmul 통합)
    const grouped = groupByItem(data ?? []);

    return NextResponse.json({ results: grouped.slice(0, limit) });
  } catch (err) {
    console.error("[court-listings/search]", err);
    return NextResponse.json({ results: [] });
  }
}
