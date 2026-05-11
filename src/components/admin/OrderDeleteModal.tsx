"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Copy, Check } from "lucide-react";
import { cn, formatKoreanWon, formatKoreanDate } from "@/lib/utils";

/**
 * cycle 1-E-B-α — orders hard delete 강제 모달 (super_admin 단독 paradigm 정수).
 *
 * 광역 paradigm 정수:
 * - 강제 모달 = backdrop·ESC 닫기 영역 0 (close button 단독)
 * - application_id 직접 입력 정합 시점 단독 CTA enable (실수 회피 정수)
 * - 광역 정보 카드 = 신청번호 + 신청자 + 사건번호 + 입찰가 + 신청일 광역 표기
 * - destructive paradigm = red 광역 시각 (헤더 + CTA)
 *
 * 광역 토큰 정합 (admin paradigm 광역 차용):
 * - max-w-480 + rounded-2xl + p-6 + backdrop blur (KakaoNotifyButton 정합)
 * - Field component dt text-sm font-medium ink-500 / dd text-base font-bold ink-900
 * - CTA h-12 + rounded-lg + flex-1
 */

interface Props {
  orderId: string;
  applicationId: string;
  applicantName: string;
  court: string;
  caseNumber: string;
  bidAmount: number;
  createdAt: string;
  /**
   * cycle 1-E-B-γ — variant 광역 router 분기 paradigm.
   * "default" (detail page footer) = DELETE 사후 router.push('/admin/orders') + refresh.
   * "row" (list 행) = DELETE 사후 router.refresh() 단독 (list 광역 머무름 paradigm).
   */
  variant?: "default" | "row";
  onClose: () => void;
}

export function OrderDeleteModal({
  orderId,
  applicationId,
  applicantName,
  court,
  caseNumber,
  bidAmount,
  createdAt,
  variant = "default",
  onClose,
}: Props) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMatched = inputValue.trim() === applicationId;

  async function copyApplicationId() {
    try {
      await navigator.clipboard.writeText(applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback 영역 0
    }
  }

  async function handleDelete() {
    if (!isMatched) return;
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/delete`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        throw new Error(json.error ?? "주문 삭제에 실패했습니다.");
      }
      if (variant === "row") {
        router.refresh();
      } else {
        router.push("/admin/orders");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "주문 삭제에 실패했습니다.");
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-delete-modal-title"
    >
      <div className="mx-auto w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle
              size={20}
              className="text-red-600"
              aria-hidden="true"
            />
          </div>
          <div className="flex-1">
            <h3
              id="order-delete-modal-title"
              className="text-lg font-black leading-tight tracking-tight text-red-600"
            >
              정말 영구 삭제하시겠습니까?
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
              이 작업은 되돌릴 수 없습니다. 주문 정보와 첨부 파일이 영구
              삭제됩니다.
            </p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-[var(--color-ink-50)] p-5">
          <div className="flex items-start justify-between gap-3">
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">
              신청번호
            </dt>
            <div className="flex items-center gap-2">
              <dd className="rounded-md border border-[var(--color-border)] bg-white px-2 py-1 font-mono text-sm font-bold text-[var(--color-ink-900)]">
                {applicationId}
              </dd>
              <button
                type="button"
                onClick={copyApplicationId}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-white px-2 py-1 text-xs font-bold transition-colors duration-150 hover:bg-[var(--color-ink-50)]",
                  copied
                    ? "text-[var(--brand-green)]"
                    : "text-[var(--color-ink-700)]"
                )}
                aria-label="신청번호 복사"
              >
                {copied ? (
                  <>
                    <Check size={12} aria-hidden="true" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy size={12} aria-hidden="true" />
                    복사
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">
              신청자
            </dt>
            <dd className="text-base font-bold text-[var(--color-ink-900)]">
              {applicantName}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">
              사건번호
            </dt>
            <dd className="text-right text-base font-bold tabular-nums text-[var(--color-ink-900)]">
              {court}
              <span className="block font-mono text-xs font-medium text-[var(--color-ink-700)]">
                {caseNumber}
              </span>
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">
              입찰가
            </dt>
            <dd className="text-base font-bold tabular-nums text-[var(--color-ink-900)]">
              {formatKoreanWon(bidAmount)}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-sm font-medium text-[var(--color-ink-500)]">
              신청일
            </dt>
            <dd className="text-base font-bold tabular-nums text-[var(--color-ink-900)]">
              {formatKoreanDate(createdAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-5">
          <label
            htmlFor="order-delete-confirm-input"
            className="block text-sm text-[var(--color-ink-500)]"
          >
            삭제를 진행하려면 신청번호를 정확히 입력해주세요.
          </label>
          <input
            id="order-delete-confirm-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="GQ-YYYYMMDD-NNNN"
            autoComplete="off"
            className="mt-2 h-12 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 font-mono text-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] focus-visible:border-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/30"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-800"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white text-base font-bold text-[var(--color-ink-900)] transition-colors duration-150 hover:bg-[var(--color-ink-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-700)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isMatched || deleting}
            className={cn(
              "inline-flex h-12 flex-1 items-center justify-center rounded-lg text-base font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600",
              isMatched && !deleting
                ? "bg-red-600 text-white hover:bg-red-700"
                : "cursor-not-allowed bg-[var(--color-ink-200)] text-[var(--color-ink-400)]"
            )}
          >
            {deleting ? "삭제 중..." : "영구 삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}
