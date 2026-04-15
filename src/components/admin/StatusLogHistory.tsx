import type { OrderStatus } from "@/types/order";
import { getStatusLabel } from "@/lib/order-status";
import { formatKoreanDate } from "@/lib/utils";

type LogEntry = {
  id: string;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  note: string | null;
  created_at: string;
  changed_by: string | null;
};

export function StatusLogHistory({ logs }: { logs: LogEntry[] }) {
  if (logs.length === 0) {
    return (
      <p className="text-xs text-[var(--color-ink-500)]">이력이 없습니다.</p>
    );
  }

  return (
    <ol className="relative ml-2 flex flex-col gap-4 border-l-2 border-[var(--color-border)] pl-5">
      {logs.map((log) => (
        <li key={log.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-brand-600 bg-white"
          />
          <div className="text-xs">
            <p className="font-bold text-[var(--color-ink-900)]">
              {log.from_status
                ? `${getStatusLabel(log.from_status)} → ${getStatusLabel(log.to_status)}`
                : `최초 접수 (${getStatusLabel(log.to_status)})`}
            </p>
            <p className="mt-0.5 text-[var(--color-ink-500)]">
              {formatKoreanDate(log.created_at)}
              {log.changed_by ? "" : " · 시스템"}
            </p>
            {log.note && (
              <p className="mt-1 whitespace-pre-wrap rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] px-3 py-2 text-[var(--color-ink-700)]">
                {log.note}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
