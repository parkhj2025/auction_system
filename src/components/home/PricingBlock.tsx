import Link from "next/link";
import { FEES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* Phase 1.2 (A-1) — Pricing 메인 (압축 본질).
 * 본질:
 *  - 카드 부제 폐기 ("가장 합리적인 가격" / "가장 많이 선택" / "시간이 촉박한 경우" 모두 폐기)
 *  - 추천 카드 = 단순 ink-900 + 흰 텍스트 (Aurora-card 폐기)
 *  - 카피 v1.1 §C-4: eyebrow / h1 / subtext / 카드 3 / CTA "수수료 자세히 보기" → /pricing (Phase 1.3)
 *  - region strip 폐기 (메인 압축 본질)
 *  - 성공보수 안내 본문 1줄로 압축 */

type Tier = {
  key: "earlybird" | "standard" | "rush";
  name: string;
  tag: string;
  fee: number;
  highlight?: boolean;
};

const TIERS: Tier[] = [
  { key: "earlybird", name: "얼리버드", tag: "입찰 7일+ 전", fee: FEES.earlybird, highlight: true },
  { key: "standard", name: "일반", tag: "입찰 2~7일 전", fee: FEES.standard },
  { key: "rush", name: "급건", tag: "입찰 2일 이내", fee: FEES.rush },
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
            필요한 만큼만 받습니다
          </h2>
          <p className="text-body mt-3 text-[var(--text-secondary)]">
            신청 시점에 따라 5만원부터. 패찰 시 보증금 즉시 반환.
          </p>
        </div>

        {/* 카드 3건 — 부제 폐기 / 시점·가격 핵심만. */}
        <div className="mt-10 grid gap-3 md:grid-cols-3 lg:gap-5">
          {TIERS.map((tier) => (
            <article
              key={tier.key}
              className={cn(
                "relative flex flex-col rounded-xl p-4 lg:p-5",
                tier.highlight
                  ? "bg-[var(--text-primary)] text-white"
                  : "border border-[var(--border-1)] bg-[var(--bg-primary)]"
              )}
            >
              <p
                className={cn(
                  "text-meta font-semibold",
                  tier.highlight
                    ? "text-white/70"
                    : "text-[var(--text-tertiary)]"
                )}
              >
                {tier.tag}
              </p>
              <p
                className={cn(
                  "text-h3 mt-1",
                  tier.highlight ? "text-white" : "text-[var(--text-primary)]"
                )}
              >
                {tier.name}
              </p>
              <p className="text-num-md mt-3 tabular-nums">
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
            <strong className="font-semibold text-[var(--text-primary)]">
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
