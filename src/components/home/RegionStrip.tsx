import { COURTS_ACTIVE, COURTS_COMING_SOON } from "@/lib/constants";

/**
 * 서비스 지역 스트립.
 * - 한정이 아닌 현재 상태. "서비스 중" + "서비스 준비 중"으로 확장 방향 암시.
 * - 지역명은 이곳과 물건 데이터에서만 자연스럽게 드러난다.
 */
export function RegionStrip() {
  return (
    <section
      aria-label="서비스 지역"
      className="border-b border-[var(--deep-green-line)] bg-[var(--deep-green-tint)]"
    >
      <div className="mx-auto flex w-full max-w-[var(--container-w)] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:gap-5 sm:px-6">
        <span className="seq text-[var(--deep-green)]">
          서비스 지역
        </span>

        <ul className="flex flex-wrap items-center gap-2">
          {COURTS_ACTIVE.map((c) => (
            <li key={c.value}>
              <span className="inline-flex h-9 items-center gap-1.5 rounded-[var(--r-pill)] bg-[var(--deep-green)] px-4 text-sm font-semibold text-white">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[var(--pale-green)]"
                />
                {c.label}
                <span className="ml-1 text-xs font-medium text-white/85">
                  서비스 중
                </span>
              </span>
            </li>
          ))}

          {COURTS_COMING_SOON.map((c) => (
            <li key={c.value}>
              <span className="inline-flex h-9 items-center gap-1.5 rounded-[var(--r-pill)] border border-[var(--deep-green-line)] bg-white px-4 text-sm font-medium text-[var(--color-ink-700)]">
                {c.label}
                <span className="ml-1 inline-flex h-5 items-center rounded-[var(--r-pill)] bg-[var(--soft-stone)] px-2 text-[10px] font-semibold text-[var(--color-ink-900)]">
                  오픈 예정
                </span>
              </span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-[var(--color-ink-500)] sm:ml-auto">
          서비스 지역은 계속 확대됩니다.
        </p>
      </div>
    </section>
  );
}
