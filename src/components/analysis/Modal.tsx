"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

/**
 * 일반 모달 — PropertyOverviewCard / ScenarioCardsBoard 클릭 시 사용.
 *  - 의존성 추가 0 자체 구현
 *  - ESC / X 버튼 / 배경 클릭 닫기 + body scroll lock
 *  - 카드 형태 (라이트박스와 다른 시각: 흰 배경, 둥근 모서리)
 */
export function Modal({
  open,
  onClose,
  title,
  ariaLabel,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthCls = size === "lg" ? "max-w-3xl" : "max-w-xl";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? title ?? "모달"}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${widthCls} max-h-[90vh] overflow-y-auto rounded-[var(--radius-xl)] bg-white shadow-[var(--shadow-elevated)]`}
      >
        <div className="flex items-start justify-between gap-2 border-b border-[var(--color-border)] px-5 py-4 sm:px-8">
          {title ? (
            <h2 className="text-lg font-black tracking-tight text-[var(--color-ink-900)] sm:text-xl">
              {title}
            </h2>
          ) : (
            <span aria-hidden="true" />
          )}
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-ink-500)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink-900)]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-8 sm:py-6">{children}</div>
      </div>
    </div>
  );
}
