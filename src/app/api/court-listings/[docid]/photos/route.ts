import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAndCachePhotos } from "@/lib/courtAuction/photos";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

/**
 * GET /api/court-listings/[docid]/photos[?all=true]
 *
 * 온디맨드 사진 조회. 캐시 hit 시 즉시, miss 시 대법원 API → sharp 압축 → Storage.
 * 인증 불필요 (공개 경매 데이터).
 *
 * 쿼리 파라미터:
 *   all=true  — 전경 2·내부 2 기본 선별 대신 전체(최대 20장)를 순서대로 반환.
 *               Cowork 블로그 콘텐츠 생성 등 다수 사진이 필요한 소비자용.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ docid: string }> }
) {
  try {
    const { docid } = await params;

    if (!docid || docid.length < 10) {
      return NextResponse.json(
        { error: "invalid_docid", photos: [] },
        { status: 400 }
      );
    }

    const all = new URL(req.url).searchParams.get("all") === "true";

    // court_listings에서 매칭 정보 조회
    const admin = createAdminClient();
    const { data: listing, error: dbError } = await admin
      .from("court_listings")
      .select(
        "docid, case_number, court_code, item_sequence"
      )
      .eq("docid", docid)
      .single();

    if (dbError || !listing) {
      return NextResponse.json(
        { error: "listing_not_found", photos: [] },
        { status: 404 }
      );
    }

    const photos = await fetchAndCachePhotos(
      {
        docid: listing.docid,
        caseNumber: listing.case_number,
        courtCode: listing.court_code,
        itemSequence: listing.item_sequence,
      },
      { all }
    );

    return NextResponse.json({ photos });
  } catch (err) {
    console.error("[court-listings/photos]", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "unknown_error",
        photos: [],
      },
      { status: 200 } // UI graceful degradation — 200 + 빈 배열
    );
  }
}
