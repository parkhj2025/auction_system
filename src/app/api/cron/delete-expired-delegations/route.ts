import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RETENTION_YEARS = 3;
const BUCKET = "delegations";
const PAGE_SIZE = 1000;

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
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - RETENTION_YEARS);
  const cutoffIso = cutoff.toISOString();

  let scanned = 0;
  let deleted = 0;
  const errors: string[] = [];

  let offset = 0;
  while (true) {
    const { data: objects, error: listError } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: PAGE_SIZE, offset, sortBy: { column: "created_at", order: "asc" } });

    if (listError) {
      errors.push(`list: ${listError.message}`);
      break;
    }
    if (!objects || objects.length === 0) break;

    scanned += objects.length;
    const expired = objects
      .filter((o) => o.created_at && o.created_at < cutoffIso)
      .map((o) => o.name);

    if (expired.length > 0) {
      const { error: removeError } = await supabase.storage.from(BUCKET).remove(expired);
      if (removeError) {
        errors.push(`remove: ${removeError.message}`);
      } else {
        deleted += expired.length;
      }
    }

    if (objects.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return NextResponse.json({
    ok: errors.length === 0,
    cutoff: cutoffIso,
    scanned,
    deleted,
    errors,
  });
}
