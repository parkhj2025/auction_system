import Link from "next/link";
import { FEES } from "@/lib/constants";

/* Phase 1.2 (A-1-2) v2 — Pricing 메인 (카피 압축 + 시간축 인포그래픽).
 * 변경:
 *  - h1 "필요한 만큼만 받습니다" → "필요한 만큼만" (압축)
 *  - subtext "신청 시점에 따라 5만원부터. 패찰 시 보증금 즉시 반환." → "신청 시점에 따라 5만원부터." (1줄)
 *  - 시간축 인포그래픽 신규 — Q1=a (mobile 세로 / desktop 가로)
 *  - 카드 부제 폐기 보존 (이전 cycle)
 *  - 추천 카드 = button-bg #0A0A0A + 흰 텍스트 */

type Tier = {
  key: "earlybird" | "standard" | "rush";
  name: string;
  tag: string;
  point: string; /* 시간축 위 라벨 본질 */
  fee: number;
  highlight?: boolean;
};

const TIERS: Tier[] = [
  { key: "earlybird", name: "얼리버드", tag: "입찰 7일+ 전", point: "D-7+", fee: FEES.earlybird, highlight: true },
  { key: "standard", name: "일반", tag: "입찰 2~7일 전", point: "D-7~D-2", fee: FEES.standard },
  { key: "rush", name: "급건", tag: "입찰 2일 이내", point: "D-1", fee: FEES.rush },
];

function feeLabel(won: number) {
  return `${(won / 10_000).toLocaleString("ko-KR")}만원`;
}

export function PricingBlock() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="bg-[var(--bg-primary)] border-b border-[var(--border-1)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="max-w-2xl">
          <p className="section-eyebrow">수수료</p>
          <h2
            id="pricing-heading"
            className="text-h1 mt-3 text-[var(--text-primary)]"
          >
            필요한 만큼만
          </h2>
          <p className="text-body-lg mt-4 text-[var(--text-secondary)]">
            신청 시점에 따라 5만원부터.
          </p>
        </div>

        {/* 시간축 인포그래픽 — mobile vertical / desktop horizontal. */}
        <div className="mt-12">
          <Timeline tiers={TIERS} />
        </div>

        {/* 카드 3건 — 부제 폐기 / 시점·가격 핵심만. */}
        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-6">
          {TIERS.map((tier) => (
            <article
              key={tier.key}
              className={
                "flex flex-col rounded-2xl p-6 transition-[transform,box-shadow] duration-[250ms] ease-out hover:-translate-y-0.5 hover:scale-[1.005] hover:shadow-sm lg:p-8 " +
                (tier.highlight
                  ? "bg-[var(--button-bg)] text-white"
                  : "border border-[var(--border-1)] bg-[var(--bg-primary)]")
              }
            >
              <p
                className={
                  "text-meta font-[510] " +
                  (tier.highlight
                    ? "text-white/70"
                    : "text-[var(--text-tertiary)]")
                }
              >
                {tier.tag}
              </p>
              <p
                className={
                  "text-h3 mt-1 " +
                  (tier.highlight ? "text-white" : "text-[var(--text-primary)]")
                }
              >
                {tier.name}
              </p>
              <p className="text-num-md mt-4 tabular-nums">
                <span
                  className={
                    tier.highlight ? "text-white" : "text-[var(--text-primary)]"
                  }
                >
                  {feeLabel(tier.fee)}
                </span>
              </p>
            </article>
          ))}
        </div>

        {/* 성공보수 + CTA. */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-[var(--text-secondary)]">
            낙찰 시{" "}
            <strong className="font-[590] text-[var(--text-primary)]">
              +{feeLabel(FEES.successBonus)}
            </strong>{" "}
            (낙찰된 경우만)
          </p>
          <Link
            href="/pricing"
            className="text-body-sm inline-flex items-center gap-1 font-medium text-[var(--text-primary)] hover:underline"
          >
            수수료 자세히 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* 시간축 인포그래픽 — D-7+ → D-7~D-2 → D-1 → 입찰일 본질.
 * mobile = vertical (위→아래) / desktop = horizontal (좌→우). */
function Timeline({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="rounded-2xl border border-[var(--border-1)] bg-[var(--bg-secondary)] p-6 lg:p-8">
      {/* Mobile vertical. */}
      <ol className="flex flex-col gap-6 lg:hidden">
        {tiers.map((tier, i) => (
          <li key={tier.key} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <span
                className={
                  "flex h-3 w-3 shrink-0 items-center justify-center rounded-full " +
                  (tier.highlight ? "bg-[var(--button-bg)]" : "bg-[var(--text-tertiary)]")
                }
              />
              {i < tiers.length - 1 && (
                <span className="mt-2 h-12 w-px bg-[var(--divider)]" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-meta font-[510] text-[var(--text-tertiary)]">
                {tier.point}
              </p>
              <p className="text-h3 mt-1 text-[var(--text-primary)]">
                {tier.name}
              </p>
              <p className="text-num-md mt-1 tabular-nums text-[var(--text-primary)]">
                {feeLabel(tier.fee)}
              </p>
            </div>
          </li>
        ))}
        <li className="flex items-start gap-4">
          <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[var(--text-primary)]" />
          <p className="text-body font-[510] text-[var(--text-primary)]">입찰일</p>
        </li>
      </ol>

      {/* Desktop horizontal. */}
      <div className="hidden lg:block">
        {/* 라인 + 노드. */}
        <div className="relative flex items-center justify-between">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--divider)]"
          />
          {[...tiers, { key: "bid", name: "입찰일", point: "입찰", highlight: false } as const].map(
            (node) => (
              <div key={node.key} className="relative flex flex-col items-center">
                <span
                  className={
                    "relative z-10 h-3 w-3 rounded-full " +
                    (node.key === "bid"
                      ? "bg-[var(--text-primary)]"
                      : "highlight" in node && (node as Tier).highlight
                      ? "bg-[var(--button-bg)]"
                      : "bg-[var(--text-tertiary)]")
                  }
                />
              </div>
            )
          )}
        </div>
        {/* 라벨 — 노드 아래. */}
        <div className="mt-6 grid grid-cols-4 text-center">
          {tiers.map((tier) => (
            <div key={tier.key}>
              <p className="text-meta font-[510] text-[var(--text-tertiary)]">
                {tier.point}
              </p>
              <p className="text-body mt-2 font-[510] text-[var(--text-primary)]">
                {tier.name}
              </p>
              <p className="text-body-sm mt-1 tabular-nums text-[var(--text-secondary)]">
                {feeLabel(tier.fee)}
              </p>
            </div>
          ))}
          <div>
            <p className="text-meta font-[510] text-[var(--text-tertiary)]">입찰</p>
            <p className="text-body mt-2 font-[510] text-[var(--text-primary)]">입찰일</p>
          </div>
        </div>
      </div>
    </div>
  );
}
