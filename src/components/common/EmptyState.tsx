import Link from "next/link";

/** 목록·검색 결과가 비었을 때의 공용 빈 상태 블록. */
export function EmptyState({
  title = "결과가 없습니다",
  description = "조건을 바꿔서 다시 찾아보세요.",
  ctaHref,
  ctaLabel = "전체 보기",
}: {
  title?: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="mt-10 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-16 text-center">
      <p className="text-[length:var(--text-body)] font-black text-[var(--color-ink-900)]">{title}</p>
      <p className="mt-2 text-sm text-[var(--color-ink-500)]">{description}</p>
      {ctaHref && (
        <Link
          href={ctaHref}
          className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-5 text-sm font-bold text-white hover:bg-black"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
