"use client";

import { useState } from "react";
import { formatPhone } from "@/lib/apply";

export function ProfileForm({
  initialPhone,
  email,
  displayName,
}: {
  initialPhone: string;
  email: string | null;
  displayName: string;
}) {
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
      setMessage({
        type: "error",
        text: "010-0000-0000 형식으로 입력해주세요.",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/my/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        throw new Error(json.error ?? "저장 중 오류가 발생했습니다.");
      }
      setMessage({ type: "success", text: "연락처가 저장되었습니다." });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "저장 중 오류가 발생했습니다.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
        <p className="text-xs font-bold text-[var(--color-ink-500)]">
          로그인 계정
        </p>
        <p className="mt-1 text-base font-black text-[var(--color-ink-900)]">
          {displayName}
        </p>
        {email && (
          <p className="mt-0.5 text-sm text-[var(--color-ink-700)]">{email}</p>
        )}
        <p className="mt-3 text-xs leading-5 text-[var(--color-ink-500)]">
          이메일과 이름은 Google 계정을 기반으로 표시됩니다. 변경하려면 로그인
          계정 자체를 바꿔야 합니다.
        </p>
      </div>

      <div>
        <label
          htmlFor="profile-phone"
          className="mb-2 block text-sm font-black text-[var(--color-ink-900)]"
        >
          연락처
        </label>
        <input
          id="profile-phone"
          type="tel"
          inputMode="tel"
          placeholder="010-0000-0000"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-base text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
        />
        <p className="mt-2 text-xs leading-5 text-[var(--color-ink-500)]">
          접수 시 기본값으로 사용됩니다. 접수마다 다시 입력할 필요가 없도록
          여기에 저장해두세요.
        </p>
      </div>

      {message && (
        <div
          role="alert"
          className={
            message.type === "success"
              ? "rounded-[var(--radius-md)] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
              : "rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          }
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-brand-600 px-6 text-sm font-black text-white shadow-[var(--shadow-card)] transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
