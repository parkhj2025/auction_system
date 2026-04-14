import { NextResponse } from "next/server";
import { generateApplicationId } from "@/lib/apply";

/**
 * Phase 1 접수 엔드포인트 스텁.
 * - 제출된 FormData를 서버 로그에 남기고 접수번호를 반환
 * - 실제 이메일/Webhook 전달은 Phase 1 후반에 본 라우트 내부에서 확장
 * - Phase 2에서는 DB 저장 + PG 연동으로 교체
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const submitted: Record<string, unknown> = {};
    for (const [key, value] of form.entries()) {
      if (value instanceof File) {
        submitted[key] = {
          filename: value.name,
          size: value.size,
          type: value.type,
        };
      } else {
        submitted[key] = value;
      }
    }

    const applicationId = generateApplicationId();

    // Phase 1: 서버 콘솔 로그. 운영 전환 시 Resend/Nodemailer/Webhook로 교체.
    console.log("[apply submission]", { applicationId, ...submitted });

    return NextResponse.json({ ok: true, applicationId });
  } catch (error) {
    console.error("[apply error]", error);
    return NextResponse.json(
      { ok: false, error: "접수 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
