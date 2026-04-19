import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getKSTDateTimeIso } from "@/lib/datetime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 위임장 PDF 자동 파기 크론.
 * 근거: 전자상거래법 제6조 + 「공인중개사의 매수신청대리인 등록 등에 관한 규칙」
 *       제15조 → 5년 보관 후 파기.
 *
 * 실행 흐름:
 *   1. orders 테이블에서 5년 경과 + delegation_pdf_path가 NULL이 아닌 row 조회
 *   2. Storage에서 해당 객체 삭제
 *   3. orders.delegation_pdf_path = NULL로 업데이트 (dead link 방지)
 */
const RETENTION_YEARS = 5;
const BUCKET = "delegations";
const PAGE_SIZE = 200;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  // KST 기준 N년 전 cutoff. 연 단위라 UTC 결과와 사실상 동일하나 일관성 위해 통일.
  const nowKstIso = getKSTDateTimeIso();
  const nowKst = new Date(nowKstIso);
  nowKst.setFullYear(nowKst.getFullYear() - RETENTION_YEARS);
  const cutoffIso = nowKst.toISOString();

  let scanned = 0;
  let deletedFiles = 0;
  let updatedRows = 0;
  const errors: string[] = [];

  let from = 0;
  while (true) {
    const { data: rows, error: listError } = await supabase
      .from("orders")
      .select("id, delegation_pdf_path")
      .not("delegation_pdf_path", "is", null)
      .lt("created_at", cutoffIso)
      .order("created_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (listError) {
      errors.push(`orders.select: ${listError.message}`);
      break;
    }
    if (!rows || rows.length === 0) break;

    scanned += rows.length;

    for (const row of rows) {
      const path = row.delegation_pdf_path as string | null;
      if (!path) continue;

      const { error: removeError } = await supabase.storage.from(BUCKET).remove([path]);
      if (removeError) {
        errors.push(`storage.remove(${row.id}): ${removeError.message}`);
        continue;
      }
      deletedFiles += 1;

      const { error: updateError } = await supabase
        .from("orders")
        .update({ delegation_pdf_path: null })
        .eq("id", row.id);
      if (updateError) {
        errors.push(`orders.update(${row.id}): ${updateError.message}`);
        continue;
      }
      updatedRows += 1;
    }

    if (rows.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return NextResponse.json({
    ok: errors.length === 0,
    cutoff: cutoffIso,
    retentionYears: RETENTION_YEARS,
    scanned,
    deletedFiles,
    updatedRows,
    errors,
  });
}
