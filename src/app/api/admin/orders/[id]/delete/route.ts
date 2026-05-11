import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * cycle 1-E-B-α — orders hard delete endpoint (super_admin 단독).
 *
 * 광역 paradigm 정수:
 * - is_super_admin() RPC 정합 시점 단독 진입 (admin 광역 NG)
 * - status = 'cancelled' + deleted_at IS NOT NULL 정합 시점 단독 (RLS 3중 안전망 정합)
 * - Storage cascade 광역 회수 (order-documents + delegations 양 bucket)
 * - DB cascade 자동 회수 (documents + order_status_log ON DELETE CASCADE)
 *
 * 광역 순서:
 * 1. auth.getUser + is_super_admin RPC 권한 검수
 * 2. order fetch (status='cancelled' + deleted_at IS NOT NULL 정합)
 * 3. documents storage_path 광역 fetch (CASCADE 사전 / order-documents bucket)
 * 4. delegations bucket list (orderId/userId/ prefix)
 * 5. order-documents bucket remove (광역 storage_path)
 * 6. delegations bucket remove (광역 file)
 * 7. orders DELETE (documents + order_status_log CASCADE 자동)
 *
 * error handling paradigm:
 * - Storage 회수 실패 시점 = orders delete 회수 NG (transaction-like paradigm)
 * - 광역 에러 = console.error + 500 응답
 */
export async function DELETE(
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

    const { data: isSuperAdmin } = await supabase.rpc("is_super_admin");
    if (isSuperAdmin !== true) {
      return NextResponse.json(
        { ok: false, error: "최고 관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const { data: order, error: loadError } = await supabase
      .from("orders")
      .select("id, user_id, status, deleted_at")
      .eq("id", id)
      .maybeSingle();

    if (loadError || !order) {
      return NextResponse.json(
        { ok: false, error: "주문을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (order.status !== "cancelled") {
      return NextResponse.json(
        {
          ok: false,
          error: "취소된 주문만 영구 삭제할 수 있습니다.",
        },
        { status: 400 }
      );
    }

    if (order.deleted_at === null) {
      return NextResponse.json(
        {
          ok: false,
          error: "삭제 표시된 주문만 영구 삭제할 수 있습니다.",
        },
        { status: 400 }
      );
    }

    // 1. documents 광역 storage_path fetch (CASCADE 사전)
    const { data: docs } = await supabase
      .from("documents")
      .select("storage_path")
      .eq("order_id", id);

    const orderDocsPaths = (docs ?? [])
      .map((d) => d.storage_path)
      .filter((p): p is string => typeof p === "string" && p.length > 0);

    // 2. order-documents bucket remove
    if (orderDocsPaths.length > 0) {
      const { error: removeError } = await supabase.storage
        .from("order-documents")
        .remove(orderDocsPaths);
      if (removeError) {
        console.error(
          "[admin/orders/delete] order-documents remove failed",
          removeError
        );
        return NextResponse.json(
          {
            ok: false,
            error: "첨부 파일 삭제 중 오류가 발생했습니다.",
          },
          { status: 500 }
        );
      }
    }

    // 3. delegations bucket list + remove ({orderId}/{userId}/ prefix)
    const delegationPrefix = `${id}/${order.user_id}`;
    const { data: delegationFiles } = await supabase.storage
      .from("delegations")
      .list(delegationPrefix);

    if (delegationFiles && delegationFiles.length > 0) {
      const delegationPaths = delegationFiles.map(
        (f) => `${delegationPrefix}/${f.name}`
      );
      const { error: delegationRemoveError } = await supabase.storage
        .from("delegations")
        .remove(delegationPaths);
      if (delegationRemoveError) {
        console.error(
          "[admin/orders/delete] delegations remove failed",
          delegationRemoveError
        );
        return NextResponse.json(
          {
            ok: false,
            error: "위임장 파일 삭제 중 오류가 발생했습니다.",
          },
          { status: 500 }
        );
      }
    }

    // 4. orders DELETE (documents + order_status_log CASCADE 자동)
    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[admin/orders/delete] orders delete failed", deleteError);
      return NextResponse.json(
        { ok: false, error: "주문 삭제 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/orders/delete]", err);
    return NextResponse.json(
      { ok: false, error: "주문 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
