import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAndCachePhotos } from "@/lib/courtAuction/photos";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

/**
 * GET /api/court-listings/[docid]/photos
 *
 * 온디맨드 사진 조회. 캐시 hit 시 즉시, miss 시 대법원 API → sharp 압축 → Storage.
 * 인증 불필요 (공개 경매 데이터).
 */
export async function GET(
  _req: Request,
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

    const photos = await fetchAndCachePhotos({
      docid: listing.docid,
      caseNumber: listing.case_number,
      courtCode: listing.court_code,
      itemSequence: listing.item_sequence,
    });

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
