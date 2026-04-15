import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * 관리자용 주민번호 즉시 삭제 엔드포인트.
 * 관리자가 입찰표 작성 완료 직후 SSN을 즉시 NULL 처리하여 보관 기간 최소화.
 * 종료 상태 전이 시 auto_delete_ssn 트리거가 처리하는 것과 별개로,
 * 진행 중 상태에서도 수동으로 즉시 삭제 가능하게 함.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin !== true) {
      return NextResponse.json(
        { ok: false, error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("orders")
      .update({ ssn_front: null })
      .eq("id", id);

    if (error) {
      console.error("[orders/delete-ssn] update failed", error);
      return NextResponse.json(
        { ok: false, error: "삭제 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[orders/delete-ssn]", err);
    return NextResponse.json(
      { ok: false, error: "삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
