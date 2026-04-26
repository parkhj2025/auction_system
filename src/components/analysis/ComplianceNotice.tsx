import { COMPLIANCE_ITEMS } from "@/lib/constants";

const ITEM_LABELS = ["면책고지", "업무범위", "시세정보", "전문가 권고"] as const;

/**
 * 컴플라이언스 압축 노출 (G1 보강).
 *  - details/summary 패턴 — 기본 1줄 chip · 클릭 시 4 항목 grid 펼침
 *  - 본문 비중 = 종합의견 callout 의 1/3 이하 (시각 무게 축소)
 *  - 푸터의 컴플라이언스 4항목과 중복 노출 회피
 *  - post.md "## 면책 고지" 본문은 remark plugin 이 폐기 → 본 컴포넌트가 단일 진실
 */
export function ComplianceNotice() {
  return (
    <details className="mt-10 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] [&>summary>span]:open:bg-brand-600 [&>summary>span]:open:text-white">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-[11px] text-[var(--color-ink-500)] [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-700)] transition">
          고지사항
        </span>
        <span className="font-medium">
          본 콘텐츠는 참고 자료입니다 · 4 항목 보기
        </span>
      </summary>
      <dl className="grid gap-3 px-4 pb-4 text-xs leading-5 text-[var(--color-ink-500)] sm:grid-cols-2">
        {COMPLIANCE_ITEMS.map((body, i) => (
          <div key={i}>
            <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-700)]">
              {ITEM_LABELS[i]}
            </dt>
            <dd className="mt-1">{body}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
