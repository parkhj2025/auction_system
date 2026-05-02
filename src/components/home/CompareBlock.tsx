/* Phase 1.2 (A-1-2) v4 — CompareBlock (★ 신규 / 시안 정합 본질).
 * 좌 흰 카드 (직접 입찰 시 / 3시간) vs 우 Charcoal gradient 카드 (경매퀵 이용 시 / 0시간 / radial green glow).
 * WhyBlock 폐기 본질 → CompareBlock 본질 본질 본질 본질 (Q3 형준님 결정).
 * 영역 6 정수 — Linear vs / Stripe before-after paradigm 정합. */

const ROWS = [
  { label: "법원 방문", direct: "필수 (왕복 + 대기)", quick: "0회" },
  { label: "서류 준비", direct: "본인 직접", quick: "전문가 대행" },
  { label: "결과 통보", direct: "현장 확인", quick: "알림으로 받기" },
] as const;

export function CompareBlock() {
  return (
    <section
      aria-labelledby="compare-heading"
      className="bg-[var(--bg-primary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="max-w-2xl">
          <p className="section-eyebrow">비교</p>
          <h2
            id="compare-heading"
            className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-[var(--text-primary)] lg:text-[40px]"
          >
            법원 가는 시간을
            <br />
            물건 보는 시간으로
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:gap-6">
          {/* 좌 — 직접 입찰. */}
          <article className="rounded-[24px] border border-[var(--border-1)] bg-[var(--bg-secondary)] p-8 lg:p-10">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
              직접 입찰 시
            </p>
            <p className="mt-3 text-[64px] font-bold leading-none tracking-[-0.03em] text-[var(--text-primary)]/60 lg:text-[80px]">
              3h
            </p>
            <p className="mt-2 text-[14px] text-[var(--text-secondary)] lg:text-[15px]">
              법원 왕복 + 대기
            </p>
            <ul className="mt-8 flex flex-col">
              {ROWS.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center justify-between border-t border-[var(--divider)] py-4 text-[13px] lg:text-[14px]"
                >
                  <span className="font-medium text-[var(--text-tertiary)]">
                    {r.label}
                  </span>
                  <span className="font-semibold text-[var(--text-secondary)]">
                    {r.direct}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          {/* 우 — 경매퀵 (Charcoal gradient + radial green glow). */}
          <article className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#111418] to-[#1F2429] p-8 text-white lg:p-10">
            {/* radial green glow (우상단 hotspot). */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,200,83,0.18), transparent 60%)",
              }}
            />
            <div className="relative">
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#34D17A]">
                경매퀵 이용 시
              </p>
              <div className="mt-3 flex items-baseline gap-3">
                <p className="text-[64px] font-bold leading-none tracking-[-0.03em] text-white lg:text-[80px]">
                  0h
                </p>
                <span className="inline-flex items-center rounded-md bg-[var(--brand-green)] px-2 py-1 text-[11px] font-bold text-white">
                  법원 안 감
                </span>
              </div>
              <p className="mt-2 text-[14px] text-white/70 lg:text-[15px]">
                전문가 대리 입찰
              </p>
              <ul className="mt-8 flex flex-col">
                {ROWS.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-center justify-between border-t border-white/10 py-4 text-[13px] lg:text-[14px]"
                  >
                    <span className="font-medium text-white/60">{r.label}</span>
                    <span className="font-semibold text-white">{r.quick}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
