import { ShieldCheck } from "lucide-react";

/**
 * 본인인증 완료 배지. Step2/Step3/Step4에서 동일하게 표기.
 * verified=false이면 렌더 안 함 (null 반환).
 */
export function VerifiedBadge({
  verified,
  verifiedName,
}: {
  verified: boolean;
  verifiedName: string | null;
}) {
  if (!verified || !verifiedName) return null;
  return (
    <div
      role="status"
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-bold text-[var(--color-ink-700)]"
    >
      <ShieldCheck size={12} aria-hidden="true" className="text-[var(--color-ink-900)]" />
      본인인증 완료 · {verifiedName} 님
    </div>
  );
}
