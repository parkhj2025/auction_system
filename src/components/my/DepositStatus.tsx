import { Circle, Check } from "lucide-react";
import type { OrderRow } from "@/types/order";
import { formatKoreanWon } from "@/lib/utils";
import { BANK_INFO } from "@/lib/constants";

const STATUS_FLOW: Array<{
  key: NonNullable<OrderRow["deposit_status"]>;
  label: string;
}> = [
  { key: "pending", label: "입금 대기" },
  { key: "received", label: "입금 확인" },
  { key: "returned", label: "반환 완료" },
];

export function DepositStatus({ order }: { order: OrderRow }) {
  const amount = order.deposit_amount;
  if (amount === null) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
          보증금
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
          수동 접수로 감정가가 확정되지 않아 보증금 금액이 아직 산출되지
          않았습니다. 접수 확인 시 알림을 보내드립니다.
        </p>
      </div>
    );
  }

  const current = order.deposit_status ?? "pending";
  const rebidLabel = order.is_rebid ? "감정가의 20% (재경매)" : "감정가의 10%";

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
      <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
        보증금
      </h3>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-[var(--color-ink-500)]">{rebidLabel}</p>
          <p className="mt-1 text-h2 font-black tabular-nums text-[var(--color-ink-900)]">
            {formatKoreanWon(amount)}
          </p>
        </div>
      </div>

      <ol className="mt-5 flex items-center gap-2">
        {STATUS_FLOW.map((s) => {
          const isDone =
            (current === "received" && s.key === "pending") ||
            (current === "returned" &&
              (s.key === "pending" || s.key === "received")) ||
            current === s.key;
          const isCurrent = current === s.key;
          return (
            <li
              key={s.key}
              className="flex flex-1 items-center gap-2 text-xs font-bold"
            >
              {isDone && !isCurrent ? (
                <Check
                  size={14}
                  className="shrink-0 text-[var(--color-ink-900)]"
                  aria-hidden="true"
                />
              ) : (
                <Circle
                  size={14}
                  className={
                    isCurrent
                      ? "shrink-0 fill-[var(--color-ink-900)] text-[var(--color-ink-900)]"
                      : "shrink-0 text-[var(--color-ink-300)]"
                  }
                  aria-hidden="true"
                />
              )}
              <span
                className={
                  isCurrent
                    ? "text-[var(--color-ink-900)]"
                    : isDone
                      ? "text-[var(--color-ink-700)]"
                      : "text-[var(--color-ink-500)]"
                }
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      {current === "pending" && (
        <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
          <p className="text-xs font-black text-[var(--color-ink-900)]">
            전용계좌로 송금해주세요
          </p>
          <p className="mt-2 text-sm font-bold text-[var(--color-ink-900)]">
            {BANK_INFO.bank}{" "}
            <span className="tabular-nums">{BANK_INFO.accountNumber}</span>
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-ink-700)]">
            예금주 · {BANK_INFO.accountHolder}
          </p>
          <p className="mt-2 text-xs text-[var(--color-ink-500)]">
            송금 메모: {BANK_INFO.memo}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-[var(--color-ink-500)]">
        <strong className="text-[var(--color-ink-900)]">
          패찰 시 보증금은 당일 즉시 반환
        </strong>
        됩니다. 낙찰 시 법원 납부 후 잔액 정산.
      </p>
    </div>
  );
}
