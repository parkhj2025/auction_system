import Link from "next/link";
import type { OrderRow } from "@/types/order";
import {
  getStatusLabel,
  getStatusBadgeClass,
} from "@/lib/order-status";
import { formatKoreanWon, formatKoreanDate, cn } from "@/lib/utils";
import { OrderDeleteButton } from "./OrderDeleteButton";

/**
 * 관리자용 접수 테이블. 데스크톱은 테이블, 모바일은 카드 리스트.
 *
 * cycle 1-E-B-γ — 데스크탑 행 광역 trash icon button 신규 (variant="row" paradigm).
 * 진입 조건 = status='cancelled' + isSuperAdmin 양 조건. 모바일 카드 광역 trash icon 영역 0
 * (admin 영역 = 데스크탑 단독 paradigm 정합 보존).
 */
export function AdminOrdersTable({
  orders,
  isSuperAdmin = false,
}: {
  orders: OrderRow[];
  isSuperAdmin?: boolean;
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-12 text-center">
        <p className="text-sm text-[var(--color-ink-500)]">
          조건에 맞는 접수가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 데스크톱 테이블 */}
      <div className="hidden overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white md:block">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <Th>상태</Th>
              <Th>접수번호</Th>
              <Th>사건번호</Th>
              <Th>신청인</Th>
              <Th className="text-right">입찰가</Th>
              <Th>입찰일</Th>
              <Th>접수일</Th>
              <Th className="w-16"></Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const snap = (o.property_snapshot ?? {}) as {
                bidDate?: string;
              };
              return (
                <tr
                  key={o.id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-ink-100)]/40"
                >
                  <Td>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-black",
                        getStatusBadgeClass(o.status)
                      )}
                    >
                      {getStatusLabel(o.status)}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-xs text-[var(--color-ink-700)]">
                      {o.application_id}
                    </span>
                  </Td>
                  <Td>
                    <span className="tabular-nums text-[var(--color-ink-900)]">
                      {o.case_number}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-bold text-[var(--color-ink-900)]">
                      {o.applicant_name}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <span className="font-bold tabular-nums text-[var(--color-ink-900)]">
                      {formatKoreanWon(o.bid_amount)}
                    </span>
                  </Td>
                  <Td>
                    <span className="tabular-nums text-[var(--color-ink-700)]">
                      {snap.bidDate ?? "-"}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-xs text-[var(--color-ink-500)]">
                      {formatKoreanDate(o.created_at)}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-xs font-bold text-[var(--color-ink-900)] hover:text-black"
                      >
                        상세 →
                      </Link>
                      {isSuperAdmin && (
                        <OrderDeleteButton
                          orderId={o.id}
                          applicationId={o.application_id}
                          applicantName={o.applicant_name}
                          court={o.court}
                          caseNumber={o.case_number}
                          bidAmount={o.bid_amount}
                          createdAt={o.created_at}
                          variant="row"
                        />
                      )}
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 */}
      <div className="flex flex-col gap-2 md:hidden">
        {orders.map((o) => {
          const snap = (o.property_snapshot ?? {}) as { bidDate?: string };
          return (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 transition hover:border-[var(--color-ink-900)]"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black",
                    getStatusBadgeClass(o.status)
                  )}
                >
                  {getStatusLabel(o.status)}
                </span>
                <span className="font-mono text-[10px] text-[var(--color-ink-500)]">
                  {o.application_id}
                </span>
              </div>
              <div>
                <p className="text-sm font-black text-[var(--color-ink-900)]">
                  {o.applicant_name}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-[var(--color-ink-700)]">
                  {o.case_number}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-2 text-xs">
                <span className="font-bold tabular-nums text-[var(--color-ink-900)]">
                  {formatKoreanWon(o.bid_amount)}
                </span>
                <span className="tabular-nums text-[var(--color-ink-500)]">
                  {snap.bidDate ?? formatKoreanDate(o.created_at)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function Th({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-[var(--color-ink-500)]",
        className
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3", className)}>{children}</td>;
}
