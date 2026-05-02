import Link from "next/link";

/* Phase 1.2 (A-1-2) v4 — TodayAnalysis (★ 신규 / 시안 정합 본질).
 * eyebrow + meta + 큰 카드 (좌 visual zone 도시 silhouette + 강조 핀 + floating chip / 우 content zone title + desc + 3 stat cell + CTA).
 * 본 cycle 본질 = 정적 hardcode (TodayAnalysis 본질 본질 본질 본질 본질 본질 본질 본질 본질 본질 본질 본질 본질 본질 본질). */

const TODAY = {
  date: "2026.05.02",
  caseNumber: "2026타경500459",
  slug: "2026타경500459",
  dropPercent: 51,
  title: "보증금 1.88억 인수 오피스텔, HUG 말소동의로 1.25억 진입",
  desc: "감정가 2.55억 / 4회 유찰 / 임차보증금 인수 구조 분석.",
  stats: [
    { label: "최저가", value: "1.25억" },
    { label: "감정가", value: "2.55억" },
    { label: "입찰일", value: "5.29 (목)" },
  ],
} as const;

export function TodayAnalysis() {
  return (
    <section
      aria-labelledby="today-heading"
      className="bg-[var(--bg-secondary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        {/* 헤더 — eyebrow + meta. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--text-primary)] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--text-primary)]" />
            </span>
            <p className="section-eyebrow !mt-0">오늘의 무료 물건분석</p>
          </div>
          <p className="text-[13px] font-semibold tracking-[0.02em] text-[var(--text-tertiary)]">
            {TODAY.date}
          </p>
        </div>

        {/* 큰 카드. */}
        <Link
          href={`/analysis/${TODAY.slug}`}
          id="today-heading"
          className="group mt-8 grid overflow-hidden rounded-[24px] border border-[var(--border-1)] bg-white shadow-[var(--shadow-card-lg)] transition-[transform,box-shadow,border-color] duration-[300ms] ease-out hover:-translate-y-1 hover:border-[var(--brand-green)]/20 hover:shadow-[var(--shadow-card-hover)] lg:grid-cols-[1.15fr_1fr]"
          aria-label={`${TODAY.title} 분석 보기`}
        >
          {/* 좌측 visual zone — 도시 silhouette + 강조 핀 + floating chip + tag chips. */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#F7FBF8] to-[#FAFAFA] p-8 lg:aspect-auto lg:p-10">
            <CitySilhouetteSVG />

            {/* floating −51% chip — 좌상단 absolute. */}
            <span className="absolute left-6 top-6 inline-flex items-center rounded-full bg-[var(--brand-green)] px-3.5 py-2 text-[14px] font-bold text-white shadow-[var(--shadow-glow-green)] lg:left-8 lg:top-8">
              감정가 −{TODAY.dropPercent}%
            </span>

            {/* tag chips — 우상단. */}
            <div className="absolute right-6 top-6 flex flex-wrap justify-end gap-2 lg:right-8 lg:top-8">
              <span className="inline-flex items-center rounded-md bg-[rgba(255,212,0,0.18)] px-2.5 py-1 text-[12px] font-bold text-[#8B6F00]">
                무료 분석
              </span>
              <span className="inline-flex items-center rounded-md border border-[var(--border-1)] bg-white/80 px-2.5 py-1 text-[12px] font-semibold text-[var(--text-secondary)] backdrop-blur-sm">
                {TODAY.caseNumber}
              </span>
            </div>
          </div>

          {/* 우측 content zone. */}
          <div className="flex flex-col justify-between p-8 lg:p-10">
            <div>
              <h3 className="text-[22px] font-bold leading-[1.35] tracking-[-0.015em] text-[var(--text-primary)] group-hover:text-[var(--brand-green-deep)] lg:text-[26px]">
                {TODAY.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-[var(--text-secondary)] lg:text-[15px]">
                {TODAY.desc}
              </p>
            </div>

            {/* 3 stat cell. */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[var(--divider)] pt-6 lg:gap-5">
              {TODAY.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-[18px] font-bold tracking-[-0.02em] text-[var(--text-primary)] lg:text-[20px]">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA. */}
            <p className="mt-6 text-[14px] font-semibold text-[var(--brand-green-deep)] group-hover:underline lg:text-[15px]">
              분석 전문 보기 →
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* 도시 silhouette + 강조 핀 SVG (영역 4 정수 본질). */
function CitySilhouetteSVG() {
  return (
    <svg
      viewBox="0 0 480 280"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      {/* 도시 silhouette. */}
      <g fill="#E4E4E7">
        <rect x="40" y="180" width="50" height="100" />
        <rect x="95" y="150" width="60" height="130" />
        <rect x="160" y="120" width="70" height="160" />
        <rect x="240" y="170" width="55" height="110" />
        <rect x="300" y="135" width="65" height="145" />
        <rect x="370" y="190" width="50" height="90" />
        <rect x="425" y="160" width="45" height="120" />
      </g>
      {/* 건물 창 (도트). */}
      <g fill="#D4D4D8">
        <rect x="170" y="145" width="8" height="8" />
        <rect x="190" y="145" width="8" height="8" />
        <rect x="210" y="145" width="8" height="8" />
        <rect x="170" y="170" width="8" height="8" />
        <rect x="190" y="170" width="8" height="8" />
        <rect x="210" y="170" width="8" height="8" />
        <rect x="310" y="160" width="8" height="8" />
        <rect x="330" y="160" width="8" height="8" />
        <rect x="350" y="160" width="8" height="8" />
        <rect x="310" y="185" width="8" height="8" />
        <rect x="330" y="185" width="8" height="8" />
        <rect x="350" y="185" width="8" height="8" />
      </g>
      {/* 강조 핀 (가운데 빌딩 위 — green). */}
      <g transform="translate(195 75)">
        <circle cx="0" cy="0" r="16" fill="#00C853" />
        <circle cx="0" cy="0" r="6" fill="white" />
        <path d="M0 16 L0 36" stroke="#00C853" strokeWidth="3.5" />
      </g>
    </svg>
  );
}
