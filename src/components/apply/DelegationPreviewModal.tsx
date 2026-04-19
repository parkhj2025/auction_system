"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  formatDelegation,
  type DelegationData,
} from "@/lib/pdf/delegationTemplate";

/**
 * 위임장 본문 미리보기 모달.
 * delegationTemplate.formatDelegation()의 출력을 그대로 HTML로 렌더한다.
 * PDF 렌더(delegation.ts)와 동일한 데이터 객체를 소비하므로 본문 drift가 없다.
 *
 * 본문 한 줄 변경 시: delegationTemplate.ts만 수정 → PDF·HTML 양쪽 동시 반영.
 */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: DelegationData;
}

export function DelegationPreviewModal({ isOpen, onClose, data }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatted = formatDelegation(data);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delegation-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lift)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2
            id="delegation-preview-title"
            className="text-base font-black text-[var(--color-ink-900)]"
          >
            {formatted.title} 미리보기
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-sm leading-6 text-[var(--color-ink-700)]">
            {formatted.intro}
          </p>

          <Section label={formatted.delegator.label} rows={formatted.delegator.rows} />
          <Section label={formatted.delegate.label} rows={formatted.delegate.rows} />
          <Section label={formatted.caseInfo.label} rows={formatted.caseInfo.rows} />

          <div className="mt-6">
            <h3 className="text-sm font-bold text-[var(--color-ink-900)]">위임 사항</h3>
            <ol className="mt-2 space-y-2 text-sm leading-6 text-[var(--color-ink-700)]">
              {formatted.clauses.map((clause, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 font-bold text-[var(--color-ink-900)]">
                    {i + 1}.
                  </span>
                  <span>{clause}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-ink-700)]">
            <p className="text-right">{formatted.footer.dateLabel}</p>
            <div className="flex justify-around gap-4 pt-2">
              <p>{formatted.footer.delegatorSignLabel}</p>
              <p>{formatted.footer.delegateSignLabel}</p>
            </div>
          </div>

          <p className="mt-4 rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] p-3 text-xs leading-5 text-[var(--color-ink-500)]">
            * 미리보기에는 입력하신 주민번호 13자리가 그대로 표시됩니다. 실제
            제출 시 PDF의 서명 영역에는 서명 캔버스의 서명 이미지가 함께 인쇄되며,
            주민번호 뒷자리는 PDF 생성 직후 메모리에서 폐기되고 DB에는 저장되지
            않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({
  label,
  rows,
}: {
  label: string;
  rows: ReadonlyArray<{ key: string; value: string }>;
}) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-[var(--color-ink-900)]">{label}</h3>
      <dl className="mt-2 divide-y divide-[var(--color-border)] rounded-[var(--radius-sm)] border border-[var(--color-border)]">
        {rows.map((row) => (
          <div key={row.key} className="flex items-baseline gap-3 px-3 py-2">
            <dt className="w-28 shrink-0 text-xs font-bold text-[var(--color-ink-500)]">
              {row.key}
            </dt>
            <dd className="flex-1 text-sm text-[var(--color-ink-900)]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
