"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* Stage 2 cycle 1-A — 5건 카피 마케터 검수 + 토큰 매핑 (#111418 charcoal / text-gray-500).
 * "대표 박형준" + "서울보증보험" 어휘 광역 폐기 (메인 cycle 10 정합). 광역 사용처 = /apply + /service. */

export const CHECKLIST_ITEMS = [
  {
    title: "공인중개사가 직접 입찰",
    body: "자격을 보유한 공인중개사가 법원에 직접 출석해 입찰합니다.",
  },
  {
    title: "보증보험 지급보증",
    body: "보증보험 가입으로 사고 발생 시에도 자금이 보호됩니다.",
  },
  {
    title: "전용 계좌 분리 보관",
    body: "운영 계좌와 분리된 전용 계좌로 보증금을 1회만 송금합니다.",
  },
  {
    title: "당일 보증금 반환",
    body: "낙찰되지 않으면 보증금은 당일 즉시 반환됩니다. 숨은 비용 0.",
  },
  {
    title: "1물건 1고객",
    body: "한 물건당 한 명의 고객만 대리합니다. 경합 위험 0.",
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
    <ul className="flex flex-col gap-2">
      {CHECKLIST_ITEMS.map((item, i) => {
        const checked = values[i] ?? false;
        const id = `apply-checklist-${i}`;
        return (
          <li key={item.title}>
            <label
              htmlFor={id}
              className={cn(
                "flex cursor-pointer gap-4 rounded-[var(--radius-lg)] border p-4 transition-colors duration-150",
                displayOnly
                  ? "border-[var(--color-border)] bg-[var(--color-surface-muted)] cursor-default"
                  : checked
                    ? "border-[#111418] bg-[var(--color-ink-50)]/70"
                    : "border-[var(--color-border)] bg-white hover:border-[var(--color-ink-300)]"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition-colors duration-150",
                  checked
                    ? "border-[#111418] bg-[#111418] text-white"
                    : "border-[var(--color-border)] bg-white"
                )}
                aria-hidden="true"
              >
                {checked && <Check size={14} />}
              </span>
              <div className="flex-1">
                <p className="text-sm font-black text-[#111418]">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
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
