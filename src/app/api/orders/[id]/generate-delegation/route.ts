import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateDelegationPdf } from "@/lib/pdf/delegation";
import type { DelegationData } from "@/lib/pdf/delegationTemplate";
import { getKSTDateTimeIso } from "@/lib/datetime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "delegations";

interface RequestBody {
  ssnBack: string;
  signatureDataUrl?: string | null;
}

function validateBody(body: unknown): { ok: true; value: RequestBody } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "요청 본문이 비어 있습니다." };
  const b = body as Record<string, unknown>;
  if (typeof b.ssnBack !== "string" || !/^\d{7}$/.test(b.ssnBack)) {
    return { ok: false, error: "주민번호 뒷 7자리 형식이 올바르지 않습니다." };
  }
  const sig = b.signatureDataUrl;
  if (sig !== undefined && sig !== null && typeof sig !== "string") {
    return { ok: false, error: "서명 데이터 형식이 올바르지 않습니다." };
  }
  return { ok: true, value: { ssnBack: b.ssnBack, signatureDataUrl: (sig as string | null | undefined) ?? null } };
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let ssnBack: string | null = null;
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = validateBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }
    ssnBack = parsed.value.ssnBack;
    const signatureDataUrl = parsed.value.signatureDataUrl ?? null;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        "id, user_id, applicant_name, phone, ssn_front, case_number, court, bid_amount, deposit_amount, property_snapshot",
      )
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { ok: false, error: "접수 내역을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (order.user_id !== user.id) {
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (isAdmin !== true) {
        return NextResponse.json({ ok: false, error: "권한이 없습니다." }, { status: 403 });
      }
    }

    if (!order.ssn_front) {
      return NextResponse.json(
        { ok: false, error: "주민번호 앞자리가 누락되어 위임장을 생성할 수 없습니다." },
        { status: 400 },
      );
    }

    const snapshot = (order.property_snapshot ?? {}) as {
      address?: string;
      bidDate?: string;
    };

    // Phase 4-CONFIRM: bidDate는 모든 경로(매칭/manualEntry)에서 propertySnapshot에 저장됨.
    // 누락은 schema 위반 또는 옛 데이터 → throw 대신 400으로 안전 응답.
    if (!snapshot.bidDate) {
      return NextResponse.json(
        { ok: false, error: "사건 정보(매각기일)가 누락되어 위임장을 생성할 수 없습니다. 새로 접수해주세요." },
        { status: 400 },
      );
    }

    const data: DelegationData = {
      delegator: {
        name: order.applicant_name,
        ssnFront: order.ssn_front,
        ssnBack,
        address: snapshot.address ?? "",
        phone: order.phone,
      },
      caseNumber: order.case_number,
      courtLabel: order.court,
      bidDate: snapshot.bidDate,
      bidAmount: Number(order.bid_amount),
      deposit: Number(order.deposit_amount ?? 0),
      signatureDataUrl,
      createdAt: getKSTDateTimeIso(),
    };

    const { pdfBytes } = await generateDelegationPdf(data);

    const admin = createAdminClient();
    const objectPath = `${order.user_id}/${order.id}/delegation-${Date.now()}.pdf`;
    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(objectPath, pdfBytes, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("[generate-delegation] storage upload failed", uploadError);
      return NextResponse.json(
        { ok: false, error: "위임장 저장 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    const { error: updateError } = await admin
      .from("orders")
      .update({ delegation_pdf_path: objectPath })
      .eq("id", id);

    if (updateError) {
      console.error("[generate-delegation] order update failed", updateError);
    }

    ssnBack = null;

    return new NextResponse(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="delegation-${order.id}.pdf"`,
        "Cache-Control": "no-store, private",
        "X-Delegation-Path": objectPath,
      },
    });
  } catch (err) {
    console.error("[generate-delegation]", err);
    return NextResponse.json(
      { ok: false, error: "위임장 생성 중 오류가 발생했습니다." },
      { status: 500 },
    );
  } finally {
    ssnBack = null;
  }
}
