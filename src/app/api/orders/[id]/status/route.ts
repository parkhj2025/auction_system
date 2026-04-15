import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types/order";
import { isTransitionAllowed } from "@/lib/order-transitions";

export const dynamic = "force-dynamic";

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "deposit_received",
  "bidding",
  "won",
  "lost",
  "deposit_returned",
  "settled",
  "cancelled",
];

/**
 * 관리자 상태 변경 엔드포인트.
 * 1. admin 권한 확인
 * 2. 전이 규칙 검증
 * 3. orders UPDATE
 * 4. order_status_log INSERT (from_status, to_status, changed_by, note)
 *
 * auto_delete_ssn 트리거가 종료 상태 전이 시 ssn_front를 자동으로 NULL 처리.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 인증 + admin 권한 확인
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

    // 입력 파싱
    const body = (await req.json().catch(() => null)) as
      | { to_status?: string; note?: string }
      | null;
    const toStatus = body?.to_status as OrderStatus | undefined;
    const note = body?.note?.trim() || null;

    if (!toStatus || !VALID_STATUSES.includes(toStatus)) {
      return NextResponse.json(
        { ok: false, error: "유효하지 않은 상태 값입니다." },
        { status: 400 }
      );
    }

    // 현재 상태 조회
    const { data: order, error: loadError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (loadError || !order) {
      return NextResponse.json(
        { ok: false, error: "주문을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const fromStatus = order.status as OrderStatus;

    // 전이 규칙 검증
    if (!isTransitionAllowed(fromStatus, toStatus)) {
      return NextResponse.json(
        {
          ok: false,
          error: `현재 상태(${fromStatus})에서 ${toStatus}로 전이할 수 없습니다.`,
        },
        { status: 400 }
      );
    }

    // UPDATE
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: toStatus })
      .eq("id", id);

    if (updateError) {
      console.error("[orders/status] update failed", updateError);
      return NextResponse.json(
        { ok: false, error: "상태 변경 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // order_status_log INSERT (admin RLS로 허용됨)
    const { error: logError } = await supabase
      .from("order_status_log")
      .insert({
        order_id: id,
        from_status: fromStatus,
        to_status: toStatus,
        changed_by: user.id,
        note,
      });

    if (logError) {
      // 상태 업데이트는 성공했으므로 200 유지하되 로그 실패는 서버에만 기록
      console.error("[orders/status] log insert failed", logError);
    }

    return NextResponse.json({ ok: true, from: fromStatus, to: toStatus });
  } catch (err) {
    console.error("[orders/status]", err);
    return NextResponse.json(
      { ok: false, error: "상태 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
