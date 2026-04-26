/**
 * 컴플라이언스 4문단 (확정 단축안).
 *  - 펼친 형태 (접이식 X) — 본문 끝 위치
 *  - text-xs ink-500 + bg-surface-muted 박스
 *  - 4 항목 (면책고지 / 업무범위 / 시세정보 / 전문가 권고) 1줄씩
 *  - 단축안 텍스트 = step 3-3 결정 #6 확정 — 본 컴포넌트 임의 변경 0
 */
const ITEMS = [
  {
    label: "면책고지",
    body: "본 콘텐츠는 대법원 경매정보·공공데이터 기반 참고 자료입니다. 투자 판단 책임은 본인에게 있습니다.",
  },
  {
    label: "업무범위",
    body: "본 서비스는 매수신청 대리(입찰 대리)만 수행합니다. 권리분석·투자자문·명도는 포함되지 않습니다.",
  },
  {
    label: "시세정보",
    body: "시세는 외부 부동산 플랫폼·국토부 실거래가 참조이며 실시간과 차이 있을 수 있습니다.",
  },
  {
    label: "전문가 권고",
    body: "수익 시뮬레이션은 참고 수치이며, 실제 투자 시 법무사·변호사 등 전문가 자문을 거치시기 바랍니다.",
  },
] as const;

export function ComplianceFooter() {
  return (
    <section
      aria-label="컴플라이언스 안내"
      className="mt-10 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-5"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-700)]">
        고지사항
      </p>
      <dl className="mt-3 grid gap-2 text-xs leading-5 text-[var(--color-ink-500)] sm:grid-cols-2">
        {ITEMS.map((item) => (
          <div key={item.label}>
            <dt className="font-semibold text-[var(--color-ink-700)]">
              {item.label}
            </dt>
            <dd className="mt-0.5">{item.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
