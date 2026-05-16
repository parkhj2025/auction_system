/* /insight v2 헤더 (work-012 재구축 v2).
 * 좌측 정렬 단독 + H1 "자료실" + 보조 카피 paradigm.
 * 사이트 광역 헤더 섹션 정합 (bg-surface-muted + border-b + max-w-c-base). */
export function InsightHeader() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
      <div className="mx-auto w-full max-w-[var(--c-base)] px-5 pt-10 pb-6 sm:px-8 lg:pt-14 lg:pb-8">
        <h1 className="text-[28px] font-black tracking-[-0.02em] leading-[1.15] text-[var(--color-ink-900)] lg:text-[40px]">
          자료실
        </h1>
        <p className="mt-3 max-w-2xl text-[16px] font-medium leading-[1.55] text-[var(--color-ink-500)] lg:text-[18px]">
          경매 자료, 직접 정리하여 무료로 드립니다.
        </p>
      </div>
    </section>
  );
}
