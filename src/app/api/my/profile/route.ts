import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * 프로필 연락처 수정 엔드포인트.
 * RLS가 본인 profiles row만 UPDATE 허용하므로 user-scoped 클라이언트로 충분.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = (await req.json().catch(() => null)) as
      | { phone?: string }
      | null;
    const phone = body?.phone?.trim() ?? "";

    if (!phone) {
      return NextResponse.json(
        { ok: false, error: "연락처가 입력되지 않았습니다." },
        { status: 400 }
      );
    }
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
      return NextResponse.json(
        { ok: false, error: "010-0000-0000 형식으로 입력해주세요." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("profiles")
      .update({ phone })
      .eq("id", user.id);

    if (error) {
      console.error("[my/profile] update failed", error);
      return NextResponse.json(
        { ok: false, error: "저장 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[my/profile]", err);
    return NextResponse.json(
      { ok: false, error: "저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
