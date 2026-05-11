"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { OrderDeleteModal } from "./OrderDeleteModal";

/**
 * cycle 1-E-B-α — orders hard delete button (super_admin 단독 진입 paradigm).
 * cycle 1-E-B-γ — variant prop 신규 (default / row 양 분기 paradigm).
 *
 * 광역 paradigm 정수:
 * - variant="default" (사전 paradigm 보존 / detail page footer 단독):
 *   h-12 + rounded-lg + bg-red-600 + 카피 "주문 영구 삭제" + Trash2 icon
 * - variant="row" (신규 / list 행 단독):
 *   w-9 + h-9 + rounded-lg + ink-500 → hover bg-red-50 + text-red-600 + Trash2 단독 + aria-label
 *
 * 진입 조건 광역 = status='cancelled' + isSuperAdmin 양 조건 (호출 server component 광역 검수 paradigm).
 * click → OrderDeleteModal pop (강제 paradigm / variant 광역 prop 광역 전달).
 */

interface Props {
  orderId: string;
  applicationId: string;
  applicantName: string;
  court: string;
  caseNumber: string;
  bidAmount: number;
  createdAt: string;
  variant?: "default" | "row";
}

export function OrderDeleteButton({
  orderId,
  applicationId,
  applicantName,
  court,
  caseNumber,
  bidAmount,
  createdAt,
  variant = "default",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === "default" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 text-base font-bold text-white transition-colors duration-150 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
          <Trash2 size={16} aria-hidden="true" />
          주문 영구 삭제
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          aria-label="주문 영구 삭제"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-ink-500)] transition-colors duration-150 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/30 focus-visible:ring-offset-2"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      )}

      {open && (
        <OrderDeleteModal
          orderId={orderId}
          applicationId={applicationId}
          applicantName={applicantName}
          court={court}
          caseNumber={caseNumber}
          bidAmount={bidAmount}
          createdAt={createdAt}
          variant={variant}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
