"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { OrderDeleteModal } from "./OrderDeleteModal";

/**
 * cycle 1-E-B-α — orders hard delete button (super_admin 단독 진입 paradigm).
 *
 * 광역 paradigm 정수:
 * - 위치 = /admin/orders/[id] page footer 영역 단독 (스크롤 하단 paradigm 실수 회피)
 * - 진입 조건 = status='cancelled' + isSuperAdmin 양 조건 server component 광역 검수
 * - 시각 = destructive paradigm (red 광역 button + Trash2 icon)
 * - click → OrderDeleteModal pop (강제 paradigm)
 */

interface Props {
  orderId: string;
  applicationId: string;
  applicantName: string;
  court: string;
  caseNumber: string;
  bidAmount: number;
  createdAt: string;
}

export function OrderDeleteButton({
  orderId,
  applicationId,
  applicantName,
  court,
  caseNumber,
  bidAmount,
  createdAt,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 text-base font-bold text-white transition-colors duration-150 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
      >
        <Trash2 size={16} aria-hidden="true" />
        주문 영구 삭제
      </button>

      {open && (
        <OrderDeleteModal
          orderId={orderId}
          applicationId={applicationId}
          applicantName={applicantName}
          court={court}
          caseNumber={caseNumber}
          bidAmount={bidAmount}
          createdAt={createdAt}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
