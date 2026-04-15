"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function SsnDeleteButton({
  orderId,
  ssnFront,
}: {
  orderId: string;
  ssnFront: string | null;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (ssnFront === null) {
    return (
      <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-3 py-2 text-xs text-[var(--color-ink-500)]">
        주민번호가 이미 삭제되었습니다 (***-******).
      </div>
    );
  }

  async function handleClick() {
    const ok = window.confirm(
      "주민등록번호 앞 6자리를 즉시 삭제합니다. 복구할 수 없습니다. 계속하시겠습니까?"
    );
    if (!ok) return;

    setDeleting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/delete-ssn`, {
        method: "POST",
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        throw new Error(json.error ?? "삭제 실패");
      }
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "삭제 실패");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-sm text-[var(--color-ink-900)]">
        {ssnFront}
        <span className="text-[var(--color-ink-500)]">-******</span>
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={deleting}
        className="inline-flex min-h-9 w-fit items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-accent-red)] bg-white px-3 text-xs font-bold text-[var(--color-accent-red)] hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 size={12} aria-hidden="true" />
        {deleting ? "삭제 중..." : "주민번호 즉시 삭제"}
      </button>
      {message && (
        <p role="alert" className="text-xs text-[var(--color-accent-red)]">
          {message}
        </p>
      )}
    </div>
  );
}
