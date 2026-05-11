"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * cycle 1-E-A-3 — 로그아웃 confirmation modal (UserMenu + 모바일 드로어 양 광역 단일 source).
 *
 * 광역 paradigm 정수:
 * - max-w-[480px] + rounded-2xl + p-6 paradigm (admin OrderDeleteModal paradigm 정합)
 * - destructive paradigm = "로그아웃" CTA bg-red-600 + text-white
 * - 취소 CTA = white bg + ink-200 border + ink-700 text
 * - Escape key + backdrop click 닫기 양 광역 지원 (강제 modal 영역 0 / 일반 confirmation paradigm)
 * - tap target 44px (iOS HIG)
 */

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LogoutConfirmModal({ open, onClose }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleConfirm() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onClose();
    router.push("/");
    router.refresh();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirm-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-auto w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl">
        <h3
          id="logout-confirm-title"
          className="text-lg font-black tracking-tight text-[var(--color-ink-900)]"
        >
          로그아웃 하시겠습니까?
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">
          현재 세션이 종료됩니다.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-[var(--color-ink-200)] bg-white text-sm font-bold text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-ink-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-900)]/30"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white transition-colors duration-150 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
