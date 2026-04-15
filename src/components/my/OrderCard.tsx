import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { OrderRow } from "@/types/order";
import {
  getStatusLabel,
  getStatusBadgeClass,
} from "@/lib/order-status";
import { formatKoreanWon, formatKoreanDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * 마이페이지 대시보드와 목록에서 공용으로 쓰는 주문 카드.
 */
export function OrderCard({ order }: { order: OrderRow }) {
  const snapshot = order.property_snapshot ?? {};
  const address = (snapshot as { address?: string }).address || null;
  const bidDate = (snapshot as { bidDate?: string }).bidDate || null;

  return (
    <Link
      href={`/my/orders/${order.id}`}
      className="group relative flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-sm transition hover:border-brand-600 hover:shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-black",
                getStatusBadgeClass(order.status)
              )}
            >
              {getStatusLabel(order.status)}
            </span>
            <span className="truncate font-mono text-[11px] text-[var(--color-ink-500)]">
              {order.application_id}
            </span>
          </div>
          {/* 주문의 정체성은 콘텐츠 제목이 아니라 "법원 + 사건번호" */}
          <p className="mt-2 text-xs font-bold text-[var(--color-ink-700)]">
            {order.court}
          </p>
          <h3 className="mt-0.5 truncate font-mono text-base font-black tabular-nums text-[var(--color-ink-900)] sm:text-lg">
            {order.case_number}
          </h3>
        </div>
        <ChevronRight
          size={18}
          className="mt-1 shrink-0 text-[var(--color-ink-500)] transition group-hover:text-brand-600"
          aria-hidden="true"
        />
      </div>

      {address && (
        <p className="truncate text-xs text-[var(--color-ink-700)]">{address}</p>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--color-border)] pt-4 text-xs">
        <div>
          <dt className="text-[var(--color-ink-500)]">입찰가</dt>
          <dd className="mt-0.5 font-black tabular-nums text-[var(--color-ink-900)]">
            {formatKoreanWon(order.bid_amount)}
          </dd>
        </div>
        {bidDate && (
          <div>
            <dt className="text-[var(--color-ink-500)]">입찰일</dt>
            <dd className="mt-0.5 font-black tabular-nums text-[var(--color-ink-900)]">
              {bidDate}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-[var(--color-ink-500)]">접수일</dt>
          <dd className="mt-0.5 font-bold text-[var(--color-ink-700)]">
            {formatKoreanDate(order.created_at)}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--color-ink-500)]">수수료</dt>
          <dd className="mt-0.5 font-bold tabular-nums text-[var(--color-ink-700)]">
            {formatKoreanWon(order.base_fee)}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
