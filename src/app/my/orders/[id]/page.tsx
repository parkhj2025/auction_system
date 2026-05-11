import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { OrderRow, DocumentRow } from "@/types/order";
import {
  getStatusLabel,
  getStatusBadgeClass,
  getFeeTierLabel,
} from "@/lib/order-status";
import { StatusTimeline } from "@/components/my/StatusTimeline";
import { DepositStatus } from "@/components/my/DepositStatus";
import { DocumentList } from "@/components/my/DocumentList";
import { formatKoreanWon, formatKoreanDate, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "접수 상세",
};

type DocumentWithUrl = DocumentRow & { signedUrl: string | null };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // RLS가 자동으로 본인 것만 필터링
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!order) notFound();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("order_id", id)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  // 서류별 60초 signed URL 생성
  const rawDocs = (documents ?? []) as DocumentRow[];
  const docsWithUrls: DocumentWithUrl[] = await Promise.all(
    rawDocs.map(async (doc) => {
      const { data: signed } = await supabase.storage
        .from("order-documents")
        .createSignedUrl(doc.storage_path, 60);
      return { ...doc, signedUrl: signed?.signedUrl ?? null };
    })
  );

  const row = order as OrderRow;
  const snapshot = row.property_snapshot ?? {};
  // 주문의 정체성은 "법원 + 사건번호". 콘텐츠 제목은 매칭된 경우에만 보조로 노출.
  const matchedContentTitle =
    (snapshot as { title?: string }).title ?? null;
  const address = (snapshot as { address?: string }).address || null;
  const bidDate = (snapshot as { bidDate?: string }).bidDate || null;
  const appraisal = (snapshot as { appraisal?: number }).appraisal ?? null;
  const minPrice = (snapshot as { minPrice?: number }).minPrice ?? null;

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-xs font-semibold text-[var(--color-ink-500)]"
      >
        <Link href="/my" className="hover:text-[var(--color-ink-900)]">
          마이페이지
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <Link href="/my/orders" className="hover:text-[var(--color-ink-900)]">
          접수 내역
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span className="text-[var(--color-ink-700)]">{row.application_id}</span>
      </nav>

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
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
        </div>
        <a
          href="https://pf.kakao.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm font-bold text-[var(--color-ink-900)] hover:border-[var(--color-ink-900)] hover:text-black"
        >
          <MessageCircle size={16} aria-hidden="true" />
          카카오톡 문의
        </a>
      </header>

      {/* 상태 타임라인 */}
      <div className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
          진행 상태
        </h2>
        <div className="mt-5">
          <StatusTimeline status={row.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* 왼쪽: 물건 + 입찰 정보 */}
        <div className="flex flex-col gap-6">
          {/* 물건 정보 */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
              물건 정보
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">법원</dt>
                <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                  {row.court}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">사건번호</dt>
                <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                  {row.case_number}
                </dd>
              </div>
              {bidDate && (
                <div>
                  <dt className="text-xs text-[var(--color-ink-500)]">입찰일</dt>
                  <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                    {bidDate}
                  </dd>
                </div>
              )}
              {address && (
                <div className="col-span-2 sm:col-span-3">
                  <dt className="text-xs text-[var(--color-ink-500)]">주소</dt>
                  <dd className="mt-1 text-sm text-[var(--color-ink-700)]">
                    {address}
                  </dd>
                </div>
              )}
              {appraisal !== null && (
                <div>
                  <dt className="text-xs text-[var(--color-ink-500)]">감정가</dt>
                  <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                    {formatKoreanWon(appraisal)}
                  </dd>
                </div>
              )}
              {minPrice !== null && (
                <div>
                  <dt className="text-xs text-[var(--color-ink-500)]">최저가</dt>
                  <dd className="mt-1 font-bold tabular-nums text-[var(--color-accent-red)]">
                    {formatKoreanWon(minPrice)}
                  </dd>
                </div>
              )}
            </dl>
            {row.manual_entry && (
              <p className="mt-4 rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] px-3 py-2 text-xs text-[var(--color-ink-500)]">
                수동 입력으로 접수된 건입니다. 물건 상세는 접수 확인 시
                알림을 보내드립니다.
              </p>
            )}
          </div>

          {/* 입찰 정보 */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
              입찰 정보
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">입찰가</dt>
                <dd className="mt-1 text-xl font-black tabular-nums text-[var(--color-ink-900)]">
                  {formatKoreanWon(row.bid_amount)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">신청인</dt>
                <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                  {row.applicant_name}
                </dd>
                <dd className="text-xs text-[var(--color-ink-500)]">
                  {row.phone}
                </dd>
              </div>
              {row.joint_bidding && (
                <div>
                  <dt className="text-xs text-[var(--color-ink-500)]">
                    공동입찰인
                  </dt>
                  <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                    {row.joint_applicant_name}
                  </dd>
                  <dd className="text-xs text-[var(--color-ink-500)]">
                    {row.joint_applicant_phone}
                  </dd>
                </div>
              )}
              {row.is_rebid && (
                <div>
                  <dt className="text-xs text-[var(--color-ink-500)]">
                    재경매 여부
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-[var(--color-accent-red)]">
                    재경매 사건 (보증금 20%)
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* 수수료 */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
              수수료
            </h2>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs text-[var(--color-ink-500)]">
                  {getFeeTierLabel(row.fee_tier)} · 접수 시점 확정
                </p>
                <p className="mt-1 text-h3 font-black tabular-nums text-[var(--color-ink-900)]">
                  {formatKoreanWon(row.base_fee)}
                </p>
              </div>
              <p className="max-w-xs text-xs leading-5 text-[var(--color-ink-500)]">
                낙찰 시 성공보수{" "}
                {formatKoreanWon(row.success_bonus)} 추가 청구. 패찰 시 추가
                청구 없음.
              </p>
            </div>
          </div>
        </div>

        {/* 오른쪽: 보증금 + 서류 */}
        <div className="flex flex-col gap-6">
          <DepositStatus order={row} />
          <DocumentList documents={docsWithUrls} />
        </div>
      </div>
    </section>
  );
}
