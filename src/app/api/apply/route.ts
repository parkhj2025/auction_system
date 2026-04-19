import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  computeFee,
  computeDeposit,
  generateApplicationId,
} from "@/lib/apply";
import { getAnalysisBySlug } from "@/lib/content";
import { FEES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/**
 * Phase 2 접수 엔드포인트.
 * 흐름: 인증 확인 → FormData 파싱 → 서버 측 검증 → 1물건1고객 사전 확인
 *      → property_snapshot·수수료·보증금 계산 → orders INSERT
 *      → Storage 파일 업로드 → documents INSERT → 완료.
 * order_status_log 초기 row는 DB 트리거(on_order_created)가 자동 생성.
 * 실패 시 orders + Storage 파일을 롤백하여 고아 데이터 방지.
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

    const form = await req.formData();

    // ---- 필드 파싱 ----
    const caseNumber = ((form.get("caseNumber") as string | null) ?? "").trim();
    const court = (form.get("court") as string | null) ?? "인천지방법원";
    const manualEntry = form.get("manualEntry") === "true";
    const matchedSlug = (form.get("matchedSlug") as string | null) || null;
    const bidAmountRaw = (form.get("bidAmount") as string | null) ?? "";
    const applicantName = (
      (form.get("applicantName") as string | null) ?? ""
    ).trim();
    const phone = ((form.get("phone") as string | null) ?? "").trim();
    const ssnFront = ((form.get("ssnFront") as string | null) ?? "").trim();
    const jointBidding = form.get("jointBidding") === "true";
    const jointApplicantName = (
      (form.get("jointApplicantName") as string | null) ?? ""
    ).trim();
    const jointApplicantPhone = (
      (form.get("jointApplicantPhone") as string | null) ?? ""
    ).trim();
    const isRebid = form.get("isRebid") === "true";
    const eSignFile = form.get("eSignFile") as File | null;
    const idFile = form.get("idFile") as File | null;

    // ---- 서버 측 검증 ----
    const bidAmount = Number(bidAmountRaw.replace(/[^\d]/g, ""));

    if (!caseNumber) return fail("사건번호가 누락되었습니다.", 400);
    if (!applicantName) return fail("신청인 이름이 누락되었습니다.", 400);
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
      return fail("연락처 형식이 올바르지 않습니다.", 400);
    }
    if (!/^\d{6}$/.test(ssnFront)) {
      return fail("주민등록번호 앞 6자리 형식이 올바르지 않습니다.", 400);
    }
    if (!bidAmount || bidAmount <= 0) {
      return fail("입찰 금액이 올바르지 않습니다.", 400);
    }
    if (jointBidding) {
      if (!jointApplicantName) {
        return fail("공동입찰인 이름이 누락되었습니다.", 400);
      }
      if (!/^\d{3}-\d{3,4}-\d{4}$/.test(jointApplicantPhone)) {
        return fail("공동입찰인 연락처 형식이 올바르지 않습니다.", 400);
      }
    }
    if (!eSignFile || eSignFile.size === 0) {
      return fail("전자본인서명확인서가 첨부되지 않았습니다.", 400);
    }
    if (!idFile || idFile.size === 0) {
      return fail("신분증 사본이 첨부되지 않았습니다.", 400);
    }

    // 파일 서버 측 재검증 (클라이언트 검증은 신뢰 가능하지만 boundary 필수)
    const fileChecks = [
      { label: "전자본인서명확인서", file: eSignFile },
      { label: "신분증", file: idFile },
    ];
    for (const { label, file } of fileChecks) {
      if (file.size > MAX_FILE_SIZE) {
        return fail(`${label} 파일이 10MB를 초과합니다.`, 400);
      }
      if (!ALLOWED_MIME.has(file.type)) {
        return fail(
          `${label} 파일 형식이 허용되지 않습니다 (PDF / JPG / PNG / WebP).`,
          400
        );
      }
    }

    // ---- 1물건 1고객 사전 확인 (DB 함수) ----
    const { data: caseActive, error: rpcError } = await supabase.rpc(
      "is_case_active",
      { case_no: caseNumber }
    );

    if (rpcError) {
      // RPC 실패는 치명적이지 않음 — partial UNIQUE INDEX가 2차 방어 역할.
      console.error("[apply] is_case_active RPC failed", rpcError);
    } else if (caseActive === true) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "해당 물건은 이미 다른 고객의 접수가 진행 중입니다. 같은 사건은 중복 접수할 수 없습니다.",
        },
        { status: 409 }
      );
    }

    // ---- property_snapshot + 수수료/보증금 계산 ----
    let propertySnapshot: Record<string, unknown>;
    let feeTier: "earlybird" | "standard" | "rush" = "standard";
    let baseFee: number = FEES.standard;
    let depositAmount: number | null = null;

    if (matchedSlug) {
      const post = getAnalysisBySlug(matchedSlug);
      if (post) {
        propertySnapshot = {
          ...post.frontmatter,
          snapshotAt: new Date().toISOString(),
        };
        const fee = computeFee(post.frontmatter.bidDate);
        feeTier = fee.tier;
        baseFee = fee.baseFee;
        depositAmount = computeDeposit(post.frontmatter.appraisal, isRebid);
      } else {
        // slug가 있으나 콘텐츠를 찾지 못함 — 수동 접수로 폴백
        propertySnapshot = {
          manual: true,
          caseNumber,
          court,
          note: "matchedSlug provided but content not found",
          snapshotAt: new Date().toISOString(),
        };
      }
    } else {
      // 수동 접수: bidDate를 알 수 없으므로 fee_tier='standard' 고정.
      // 관리자가 접수 확인 후 실제 입찰일 기준으로 필요 시 수동 조정한다.
      // Phase 3에서 수동 접수 시 입찰일 직접 입력 필드 추가를 검토.
      propertySnapshot = {
        manual: true,
        caseNumber,
        court,
        snapshotAt: new Date().toISOString(),
      };
    }

    const applicationId = generateApplicationId();

    // ---- orders INSERT ----
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        application_id: applicationId,
        case_number: caseNumber,
        court,
        matched_slug: matchedSlug,
        manual_entry: manualEntry,
        property_snapshot: propertySnapshot,
        bid_amount: bidAmount,
        applicant_name: applicantName,
        phone,
        ssn_front: ssnFront,
        joint_bidding: jointBidding,
        joint_applicant_name: jointBidding ? jointApplicantName : null,
        joint_applicant_phone: jointBidding ? jointApplicantPhone : null,
        is_rebid: isRebid,
        fee_tier: feeTier,
        base_fee: baseFee,
        deposit_amount: depositAmount,
        status: "pending",
      })
      .select("id, application_id")
      .single();

    if (orderError) {
      // 23505 = partial UNIQUE INDEX 위반 (1물건 1고객 DB 레벨 방어)
      if (orderError.code === "23505") {
        return NextResponse.json(
          {
            ok: false,
            error:
              "해당 물건은 이미 접수가 진행 중입니다. 같은 사건은 중복 접수할 수 없습니다.",
          },
          { status: 409 }
        );
      }
      console.error("[apply] orders insert failed", orderError);
      return fail(
        "접수 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        500
      );
    }

    // ---- Storage 파일 업로드 ----
    // 경로는 RLS 정책상 user.id로 시작해야 함.
    const ts = Date.now();
    const esignExt = getExtension(eSignFile.name);
    const idExt = getExtension(idFile.name);
    const esignPath = `${user.id}/${order.id}/esign_${ts}${esignExt}`;
    const idPath = `${user.id}/${order.id}/id_${ts}${idExt}`;

    const esignBuffer = Buffer.from(await eSignFile.arrayBuffer());
    const idBuffer = Buffer.from(await idFile.arrayBuffer());

    const esignUpload = await supabase.storage
      .from("order-documents")
      .upload(esignPath, esignBuffer, {
        contentType: eSignFile.type,
        upsert: false,
      });

    if (esignUpload.error) {
      console.error("[apply] esign upload failed", esignUpload.error);
      // 롤백: orders 삭제
      await supabase.from("orders").delete().eq("id", order.id);
      return fail(
        "서류 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        500
      );
    }

    const idUpload = await supabase.storage
      .from("order-documents")
      .upload(idPath, idBuffer, {
        contentType: idFile.type,
        upsert: false,
      });

    if (idUpload.error) {
      console.error("[apply] id upload failed", idUpload.error);
      // 롤백: 이미 업로드된 esign 삭제 + orders 삭제
      await supabase.storage.from("order-documents").remove([esignPath]);
      await supabase.from("orders").delete().eq("id", order.id);
      return fail(
        "서류 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        500
      );
    }

    // ---- documents 메타데이터 INSERT ----
    const { error: docError } = await supabase.from("documents").insert([
      {
        order_id: order.id,
        user_id: user.id,
        doc_type: "esign",
        file_name: eSignFile.name,
        file_size: eSignFile.size,
        mime_type: eSignFile.type,
        storage_path: esignPath,
      },
      {
        order_id: order.id,
        user_id: user.id,
        doc_type: "id_card",
        file_name: idFile.name,
        file_size: idFile.size,
        mime_type: idFile.type,
        storage_path: idPath,
      },
    ]);

    if (docError) {
      console.error("[apply] documents insert failed", docError);
      // 전체 롤백
      await supabase.storage
        .from("order-documents")
        .remove([esignPath, idPath]);
      await supabase.from("orders").delete().eq("id", order.id);
      return fail(
        "서류 메타데이터 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        500
      );
    }

    // order_status_log 초기 row는 DB 트리거(on_order_created)가 자동 생성.
    // Resend 이메일 알림은 P2-2e(이월)에서 이 위치에 추가.

    console.log("[apply]", {
      applicationId,
      orderId: order.id,
      userId: user.id,
      caseNumber,
    });

    return NextResponse.json({ ok: true, applicationId, orderId: order.id });
  } catch (err) {
    console.error("[apply] unexpected", err);
    return NextResponse.json(
      {
        ok: false,
        error: "접수 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 }
    );
  }
}

function fail(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function getExtension(name: string): string {
  const match = name.match(/\.[a-zA-Z0-9]+$/);
  return match ? match[0].toLowerCase() : "";
}
