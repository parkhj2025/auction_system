import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateDelegationPdf } from "@/lib/pdf/delegation";
import type { DelegationData } from "@/lib/pdf/delegationTemplate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 위임장 PDF 미리보기 생성 — 서버 PDFKit 단일 소스 (Phase 6.5-POST-FIX, 2026-04-19).
 *
 * 흐름: Step4Confirm 동의 체크박스 클릭 → 본 라우트 호출 → application/pdf blob 응답
 *      → 클라이언트 PDFPreviewModal iframe에 표시 → 사용자 "확인" → 동의 확정 (체크박스 ON)
 *
 * - Storage 저장 안 함 (메모리 응답만). 저장은 /api/orders/[id]/generate-delegation에서만.
 * - orders insert 안 함 (1물건 1고객 차단 무관).
 * - 매번 신규 생성 (no-cache, 캐시 미사용 — 단순 구현).
 *
 * SECURITY (ssnBack 5중 보강):
 * 1. ssnBack은 메모리 전용 — DB/로그/에러 메시지 일체 노출 금지
 * 2. console.log / logger에 ssnBack 절대 전달 금지
 * 3. catch 에러 응답 메시지에 ssnBack 포함 금지 (sanitize)
 * 4. finally 블록에서 ssnBack 변수 덮어쓰기로 메모리 즉시 폐기
 * 5. Vercel access log: 기본 method/path/status만 기록 (POST body 미포함이 표준)
 *    → 추가 운영 logger 도입 시 본 라우트 body sanitize 검토 필수
 */

interface PreviewApplyData {
  delegator: {
    name: string;
    ssnFront: string;
    address: string;
    phone: string;
  };
  caseNumber: string;
  courtLabel: string;
  bidDate: string;
  bidAmount: number;
  deposit: number;
  createdAt: string;
}

interface RequestBody {
  ssnBack: string;
  signatureDataUrl: string | null;
  applyData: PreviewApplyData;
}

function validateBody(
  body: unknown,
): { ok: true; value: RequestBody } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "요청 본문이 비어 있습니다." };
  }
  const b = body as Record<string, unknown>;
  if (typeof b.ssnBack !== "string" || !/^\d{7}$/.test(b.ssnBack)) {
    return { ok: false, error: "주민번호 뒷 7자리 형식이 올바르지 않습니다." };
  }
  const sig = b.signatureDataUrl;
  if (sig !== undefined && sig !== null && typeof sig !== "string") {
    return { ok: false, error: "서명 데이터 형식이 올바르지 않습니다." };
  }
  const a = b.applyData as Record<string, unknown> | undefined;
  if (!a || typeof a !== "object") {
    return { ok: false, error: "신청 데이터가 누락되었습니다." };
  }
  const d = a.delegator as Record<string, unknown> | undefined;
  if (!d || typeof d !== "object") {
    return { ok: false, error: "위임인 정보가 누락되었습니다." };
  }
  if (
    typeof d.name !== "string" ||
    typeof d.ssnFront !== "string" ||
    typeof d.address !== "string" ||
    typeof d.phone !== "string"
  ) {
    return { ok: false, error: "위임인 정보 형식이 올바르지 않습니다." };
  }
  if (
    typeof a.caseNumber !== "string" ||
    typeof a.courtLabel !== "string" ||
    typeof a.bidDate !== "string" ||
    typeof a.createdAt !== "string"
  ) {
    return { ok: false, error: "사건 정보 형식이 올바르지 않습니다." };
  }
  if (typeof a.bidAmount !== "number" || typeof a.deposit !== "number") {
    return { ok: false, error: "금액 형식이 올바르지 않습니다." };
  }
  return {
    ok: true,
    value: {
      ssnBack: b.ssnBack,
      signatureDataUrl: (sig as string | null | undefined) ?? null,
      applyData: {
        delegator: {
          name: d.name,
          ssnFront: d.ssnFront,
          address: d.address,
          phone: d.phone,
        },
        caseNumber: a.caseNumber,
        courtLabel: a.courtLabel,
        bidDate: a.bidDate,
        bidAmount: a.bidAmount,
        deposit: a.deposit,
        createdAt: a.createdAt,
      },
    },
  };
}

export async function POST(req: Request) {
  let ssnBack: string | null = null;
  try {
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
    const { signatureDataUrl, applyData } = parsed.value;

    const data: DelegationData = {
      delegator: {
        name: applyData.delegator.name,
        ssnFront: applyData.delegator.ssnFront,
        ssnBack,
        address: applyData.delegator.address,
        phone: applyData.delegator.phone,
      },
      caseNumber: applyData.caseNumber,
      courtLabel: applyData.courtLabel,
      bidDate: applyData.bidDate,
      bidAmount: applyData.bidAmount,
      deposit: applyData.deposit,
      signatureDataUrl,
      createdAt: applyData.createdAt,
    };

    const { pdfBytes } = await generateDelegationPdf(data);

    // ssnBack 메모리 폐기 (응답 직전)
    ssnBack = null;

    return new NextResponse(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, private",
      },
    });
  } catch {
    // ssnBack을 에러 메시지에 포함하지 않도록 sanitize.
    // catch 인자(err)도 의도적으로 받지 않아 ssnBack 누출 가능성 차단 (객체에 우연히 포함되어도 로그/응답 X).
    console.error("[preview-delegation] error");
    return NextResponse.json(
      { ok: false, error: "위임장 미리보기 생성 중 오류가 발생했습니다." },
      { status: 500 },
    );
  } finally {
    // 메모리에서 즉시 폐기 (5중 보강 4번)
    ssnBack = null;
  }
}
