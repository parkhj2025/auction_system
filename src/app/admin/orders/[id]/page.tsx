import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { OrderRow, DocumentRow, OrderStatus } from "@/types/order";
import {
  getStatusLabel,
  getStatusBadgeClass,
  getFeeTierLabel,
} from "@/lib/order-status";
import { StatusTimeline } from "@/components/my/StatusTimeline";
import { DocumentList } from "@/components/my/DocumentList";
import { StatusChanger } from "@/components/admin/StatusChanger";
import { SsnDeleteButton } from "@/components/admin/SsnDeleteButton";
import { StatusLogHistory } from "@/components/admin/StatusLogHistory";
import { KakaoNotifyButton } from "@/components/admin/KakaoNotifyButton";
import { OrderDeleteButton } from "@/components/admin/OrderDeleteButton";
import { formatKoreanWon, formatKoreanDate, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자 · 접수 상세",
};

type DocumentWithUrl = DocumentRow & { signedUrl: string | null };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // cycle 1-E-B-β — admin = 광역 view paradigm (deleted_at filter 영역 0 / soft delete case 광역 detail 진입 정합)
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const row = order as OrderRow;

  // cycle 1-E-B-α — super_admin 광역 권한 검수 (OrderDeleteButton 진입 분기 paradigm)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isSuperAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isSuperAdmin = profile?.role === "super_admin";
  }

  // 고객 프로필 (admin RLS로 전체 조회 가능)
  const { data: customer } = await supabase
    .from("profiles")
    .select("display_name, email, phone")
    .eq("id", row.user_id)
    .maybeSingle();

  // 서류 목록 + signed URL
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("order_id", id)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const rawDocs = (documents ?? []) as DocumentRow[];
  const docsWithUrls: DocumentWithUrl[] = await Promise.all(
    rawDocs.map(async (doc) => {
      const { data: signed } = await supabase.storage
        .from("order-documents")
        .createSignedUrl(doc.storage_path, 60);
      return { ...doc, signedUrl: signed?.signedUrl ?? null };
    })
  );

  // 상태 이력
  const { data: logs } = await supabase
    .from("order_status_log")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: false });

  const logRows = (logs ?? []) as Array<{
    id: string;
    from_status: OrderStatus | null;
    to_status: OrderStatus;
    note: string | null;
    created_at: string;
    changed_by: string | null;
  }>;

  const snapshot = row.property_snapshot ?? {};
  // 주문의 정체성은 "법원 + 사건번호". 콘텐츠 제목은 매칭된 경우에만 보조로 노출.
  const matchedContentTitle =
    (snapshot as { title?: string }).title ?? null;
  const address = (snapshot as { address?: string }).address || null;
  const bidDate = (snapshot as { bidDate?: string }).bidDate || null;
  const appraisal = (snapshot as { appraisal?: number }).appraisal ?? null;
  const minPrice = (snapshot as { minPrice?: number }).minPrice ?? null;

  return (
    <section className="mx-auto w-full max-w-[var(--c-base)] px-5 py-10 sm:px-8 sm:py-12">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-xs font-semibold text-[var(--color-ink-500)]"
      >
        <Link href="/admin" className="hover:text-[var(--color-ink-900)]">
          대시보드
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <Link
          href="/admin/orders"
          className="hover:text-[var(--color-ink-900)]"
        >
          접수 목록
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span className="text-[var(--color-ink-700)]">{row.application_id}</span>
      </nav>

      <header className="mt-6">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-black",
              getStatusBadgeClass(row.status)
            )}
          >
            {getStatusLabel(row.status)}
          </span>
          <span className="font-mono text-xs text-[var(--color-ink-500)]">
            {row.application_id}
          </span>
        </div>
        <p className="mt-3 text-sm font-bold text-[var(--color-ink-700)]">
          {row.court}
        </p>
        <h1 className="mt-1 font-mono text-h3 font-black tabular-nums tracking-tight text-[var(--color-ink-900)] sm:text-h2">
          {row.case_number}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-500)]">
          접수 {formatKoreanDate(row.created_at)}
        </p>
        {matchedContentTitle && (
          <p className="mt-2 text-xs text-[var(--color-ink-500)]">
            매칭 콘텐츠:{" "}
            <span className="text-[var(--color-ink-700)]">
              {matchedContentTitle}
            </span>
          </p>
        )}
      </header>

      {/* 타임라인 */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
          진행 상태
        </h2>
        <div className="mt-5">
          <StatusTimeline status={row.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* 왼쪽: 상세 정보 */}
        <div className="flex flex-col gap-6">
          {/* 고객 정보 (cycle 1-E-B 정정: 시각 토큰 정합 + KakaoNotifyButton 신규) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
                고객 정보
              </h2>
              <KakaoNotifyButton
                applicantName={row.applicant_name}
                applicationId={row.application_id}
                phone={row.phone}
              />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Field label="이름" value={customer?.display_name ?? "-"} />
              <Field label="이메일" value={customer?.email ?? "-"} />
              <Field
                label="전화번호 (프로필)"
                value={customer?.phone ?? "-"}
              />
              <Field
                label="신청인 이름 (접수)"
                value={row.applicant_name}
              />
              <Field label="연락처 (접수)" value={row.phone} />
              <Field
                label="주민번호 앞자리"
                value={
                  <SsnDeleteButton
                    orderId={row.id}
                    ssnFront={row.ssn_front}
                  />
                }
              />
            </dl>
          </div>

          {/* 물건 정보 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
              물건 정보
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              <Field label="법원" value={row.court} />
              <Field label="사건번호" value={row.case_number} mono />
              <Field label="입찰일" value={bidDate ?? "-"} mono />
              {address && (
                <div className="col-span-2 sm:col-span-3">
                  <dt className="text-xs text-[var(--color-ink-500)]">주소</dt>
                  <dd className="mt-0.5 text-sm text-[var(--color-ink-700)]">
                    {address}
                  </dd>
                </div>
              )}
              {appraisal !== null && (
                <Field
                  label="감정가"
                  value={formatKoreanWon(appraisal)}
                  mono
                />
              )}
              {minPrice !== null && (
                <Field
                  label="최저가"
                  value={formatKoreanWon(minPrice)}
                  mono
                />
              )}
              {row.manual_entry && (
                <div className="col-span-2 sm:col-span-3 mt-2 rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] px-3 py-2 text-xs text-[var(--color-ink-500)]">
                  수동 접수 · 물건 매칭 없음
                </div>
              )}
            </dl>
          </div>

          {/* 입찰 + 수수료 + 보증금 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
              입찰 / 수수료 / 보증금
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              <Field
                label="입찰가"
                value={formatKoreanWon(row.bid_amount)}
                emphasized
              />
              <Field
                label="수수료 티어"
                value={`${getFeeTierLabel(row.fee_tier)} (${formatKoreanWon(row.base_fee)})`}
              />
              <Field
                label="재경매"
                value={row.is_rebid ? "예 (20%)" : "아니오 (10%)"}
              />
              <Field
                label="보증금"
                value={
                  row.deposit_amount !== null
                    ? formatKoreanWon(row.deposit_amount)
                    : "-"
                }
                emphasized
              />
              <Field
                label="보증금 상태"
                value={row.deposit_status ?? "-"}
              />
              <Field
                label="공동입찰"
                value={row.joint_bidding ? "예" : "아니오"}
              />
              {row.joint_bidding && (
                <>
                  <Field
                    label="공동입찰인 이름"
                    value={row.joint_applicant_name ?? "-"}
                  />
                  <Field
                    label="공동입찰인 연락처"
                    value={row.joint_applicant_phone ?? "-"}
                  />
                </>
              )}
            </dl>
          </div>

          {/* 서류 */}
          <DocumentList documents={docsWithUrls} />
        </div>

        {/* 오른쪽: 상태 변경 + 이력 */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[var(--radius-xl)] border-2 border-[var(--color-ink-900)] bg-[var(--color-ink-50)]/50 p-6">
            <h2 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
              상태 변경
            </h2>
            <div className="mt-4">
              <StatusChanger
                orderId={row.id}
                currentStatus={row.status}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
              상태 이력
            </h2>
            <div className="mt-4">
              <StatusLogHistory logs={logRows} />
            </div>
          </div>
        </div>
      </div>

      {/* cycle 1-E-B-ε — super_admin 단독 hard delete (status 조건 광역 제거 / 강제 modal application_id 정확 입력 실수 회피 paradigm) */}
      {isSuperAdmin && (
        <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50/40 p-5">
          <div>
            <h2 className="text-base font-black tracking-tight text-red-600">
              위험 영역
            </h2>
            <p className="mt-1 text-sm text-[var(--color-ink-700)]">
              이 주문을 영구 삭제하면 첨부 파일과 상태 이력까지 모두 사라집니다.
              복구할 수 없습니다.
            </p>
          </div>
          <OrderDeleteButton
            orderId={row.id}
            applicationId={row.application_id}
            applicantName={row.applicant_name}
            court={row.court}
            caseNumber={row.case_number}
            bidAmount={row.bid_amount}
            createdAt={row.created_at}
          />
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  mono,
  emphasized,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div>
      <dt className="text-sm font-medium text-[var(--color-ink-500)]">{label}</dt>
      <dd
        className={cn(
          "mt-1 text-[var(--color-ink-900)]",
          emphasized ? "text-lg font-black" : "text-base font-bold",
          mono && "tabular-nums"
        )}
      >
        {value}
      </dd>
    </div>
  );
}
