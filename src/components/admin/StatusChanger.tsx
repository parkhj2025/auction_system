"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { OrderStatus } from "@/types/order";
import { getNextStatusOptions } from "@/lib/order-transitions";
import { getStatusLabel } from "@/lib/order-status";

export function StatusChanger({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [toStatus, setToStatus] = useState<OrderStatus | "">("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const options = getNextStatusOptions(currentStatus);

  if (options.length === 0) {
    return (
      <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-4 py-3 text-xs text-[var(--color-ink-500)]">
        현재 상태(
        <strong className="text-[var(--color-ink-700)]">
          {getStatusLabel(currentStatus)}
        </strong>
        )는 종료 상태로 더 이상 전이할 수 없습니다.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!toStatus) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_status: toStatus, note: note || undefined }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        throw new Error(json.error ?? "상태 변경 실패");
      }
      setMessage({ type: "success", text: "상태가 변경되었습니다." });
      setToStatus("");
      setNote("");
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "상태 변경 실패",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div>
        <label
          htmlFor="status-to"
          className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
        >
          다음 상태
        </label>
        <div className="relative">
          <select
            id="status-to"
            value={toStatus}
            onChange={(e) => setToStatus(e.target.value as OrderStatus)}
            className="h-11 w-full appearance-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white pl-3 pr-9 text-sm font-bold text-[var(--color-ink-900)]"
          >
            <option value="">-- 선택 --</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)]"
            aria-hidden="true"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="status-note"
          className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
        >
          메모 (선택)
        </label>
        <textarea
          id="status-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="상태 변경 사유 또는 특이사항"
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
        />
      </div>

      {message && (
        <p
          role="alert"
          className={
            message.type === "success"
              ? "rounded-[var(--radius-sm)] bg-green-50 px-3 py-2 text-xs text-green-800"
              : "rounded-[var(--radius-sm)] bg-red-50 px-3 py-2 text-xs text-red-800"
          }
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={saving || !toStatus}
        className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-4 text-sm font-black text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "변경 중..." : "상태 변경"}
      </button>
    </form>
  );
}
