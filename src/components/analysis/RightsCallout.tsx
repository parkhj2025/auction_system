import type { RightsMeta } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

/**
 * 03 권리분석 — callout 박스 2종.
 *  - 말소기준등기 callout: ink-900 border + ink-50 bg (사실 신호)
 *  - 임차인 callout: 대항력 있음+인수 → danger / 대항력 없음 → neutral
 *
 * voice_guide §5-4 사실 신호 어휘만. "위험" 어휘 0.
 * mdx body 의 등기부 표는 별도 렌더 (행 색 분기 보존).
 */
export function RightsCallout({ rights }: { rights: RightsMeta }) {
  if (!rights) return null;

  const hasBasis = !!(rights.basis_date || rights.basis_type);
  const hasTenants = Array.isArray(rights.tenants) && rights.tenants.length > 0;
  if (!hasBasis && !hasTenants) return null;

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {hasBasis ? (
        <div className="rounded-[var(--radius-md)] border border-l-4 border-[var(--color-border)] border-l-[var(--color-ink-900)] bg-[var(--color-ink-50)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-900)]">
            말소기준등기
          </p>
          <p className="mt-1.5 text-sm font-bold tabular-nums text-[var(--color-ink-900)]">
            {rights.basis_date || "—"}
            {rights.basis_type ? ` · ${rights.basis_type}` : ""}
          </p>
          {rights.basis_holder ? (
            <p className="mt-0.5 text-sm text-[var(--color-ink-700)]">
              {rights.basis_holder}
            </p>
          ) : null}
          {rights.total_claims != null ? (
            <p className="mt-2 text-xs text-[var(--color-ink-500)]">
              채권 합계{" "}
              <span className="font-semibold tabular-nums text-[var(--color-ink-700)]">
                {formatKoreanWon(rights.total_claims)}
              </span>
            </p>
          ) : null}
        </div>
      ) : null}

      {hasTenants
        ? rights.tenants.map((t, idx) => {
            const opposing = t.opposing_power === true;
            const cardCls = opposing
              ? "border-l-[var(--color-danger)] bg-[var(--color-danger-soft)]"
              : "border-l-[var(--color-ink-500)] bg-[var(--color-surface-muted)]";
            const labelCls = opposing
              ? "text-[var(--color-danger)]"
              : "text-[var(--color-ink-500)]";
            return (
              <div
                key={`${t.name}-${idx}`}
                className={`rounded-[var(--radius-md)] border border-l-4 border-[var(--color-border)] p-4 ${cardCls}`}
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] ${labelCls}`}
                >
                  임차인 · 대항력 {opposing ? "있음" : "없음"}
                </p>
                <p className="mt-1.5 text-sm font-bold text-[var(--color-ink-900)]">
                  {t.name || "—"}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-[var(--color-ink-500)]">
                  전입 {t.move_in_date || "—"}
                  {t.deposit != null
                    ? ` · 보증금 ${formatKoreanWon(t.deposit)}`
                    : ""}
                </p>
                {t.analysis ? (
                  <p className="mt-2 text-xs leading-5 text-[var(--color-ink-700)]">
                    {t.analysis}
                  </p>
                ) : null}
              </div>
            );
          })
        : null}
    </div>
  );
}
