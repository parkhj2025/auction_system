import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * 사건번호 중복 확인 엔드포인트.
 * Step1Property에서 사건번호 매칭 직후 호출하여 "이미 접수 진행 중" 여부를
 * 즉시 사용자에게 알리는 용도. 서버 측에서는 `public.is_case_active()`
 * SECURITY DEFINER 함수를 호출해 RLS를 우회하여 전체 orders 테이블을
 * 검사하되, 반환은 boolean이라 타인 접수의 상세는 유출되지 않음.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { available: null, error: "unauthenticated" },
        { status: 401 }
      );
    }

    const body = (await req.json().catch(() => null)) as
      | { caseNumber?: string }
      | null;
    const caseNumber = body?.caseNumber?.trim() ?? "";

    if (!caseNumber) {
      return NextResponse.json(
        { available: null, error: "invalid_input" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("is_case_active", {
      case_no: caseNumber,
    });

    if (error) {
      console.error("[orders/check] rpc failed", error);
      return NextResponse.json(
        { available: null, error: "server_error" },
        { status: 500 }
      );
    }

    if (data === true) {
      return NextResponse.json({
        available: false,
        reason:
          "이미 다른 고객의 접수가 진행 중입니다. 같은 물건은 중복 접수할 수 없습니다.",
      });
    }

    return NextResponse.json({ available: true });
  } catch (err) {
    console.error("[orders/check]", err);
    return NextResponse.json(
      { available: null, error: "server_error" },
      { status: 500 }
    );
  }
}
