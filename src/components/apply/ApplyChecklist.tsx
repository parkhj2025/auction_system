"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const CHECKLIST_ITEMS = [
  {
    title: "공인중개사 자격 보유",
    body: "대표 박형준 공인중개사가 매수신청대리인으로 직접 입찰합니다.",
  },
  {
    title: "서울보증보험 가입",
    body: "보증보험 가입으로 사고 발생 시에도 자금이 안전하게 보호됩니다.",
  },
  {
    title: "보증금 전용계좌 운영",
    body: "일반 운영계좌와 분리된 전용계좌로 입찰 보증금을 1회만 송금합니다.",
  },
  {
    title: "패찰 시 보증금 당일 즉시 반환",
    body: "낙찰에 실패하면 보증금은 당일 즉시 반환됩니다. 숨은 비용 없음.",
  },
  {
    title: "1물건 1고객 원칙",
    body: "한 물건에 대해 한 명의 고객만 대리합니다. 경합 상황이 발생하지 않습니다.",
  },
] as const;

/**
 * 입찰 대리 신청 전 안심 체크리스트.
 * Step 4(확인·제출)에서 모든 항목이 체크되어야 제출 가능.
 * /apply 페이지 상단에 displayOnly=true로 안내용으로도 노출 가능.
 */
export function ApplyChecklist({
  values,
  onChange,
  displayOnly = false,
}: {
  values: boolean[];
  onChange?: (idx: number, checked: boolean) => void;
  displayOnly?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {CHECKLIST_ITEMS.map((item, i) => {
        const checked = values[i] ?? false;
        const id = `apply-checklist-${i}`;
        return (
          <li key={item.title}>
            <label
              htmlFor={id}
              className={cn(
                "flex cursor-pointer gap-4 rounded-[var(--radius-lg)] border p-4 transition",
                displayOnly
                  ? "border-[var(--color-border)] bg-[var(--color-surface-muted)] cursor-default"
                  : checked
                    ? "border-[var(--color-ink-900)] bg-[var(--color-ink-50)]/70"
                    : "border-[var(--color-border)] bg-white hover:border-[var(--color-ink-300)]"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition",
                  checked
                    ? "border-[var(--color-ink-900)] bg-[var(--color-ink-900)] text-white"
                    : "border-[var(--color-border)] bg-white"
                )}
                aria-hidden="true"
              >
                {checked && <Check size={14} />}
              </span>
              <div className="flex-1">
                <p className="text-sm font-black text-[var(--color-ink-900)]">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--color-ink-500)]">
                  {item.body}
                </p>
              </div>
              {!displayOnly && (
                <input
                  id={id}
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={(e) => onChange?.(i, e.target.checked)}
                />
              )}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
