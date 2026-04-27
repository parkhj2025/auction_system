import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { FEES } from "@/lib/constants";
import { PRIMARY_CTA } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type Tier = {
  key: "earlybird" | "standard" | "rush";
  name: string;
  tag: string;
  fee: number;
  caption: string;
  bullets: string[];
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    key: "earlybird",
    name: "얼리버드",
    tag: "입찰 7일+ 전 신청",
    fee: FEES.earlybird,
    caption: "가장 합리적인 가격",
    bullets: [
      "충분한 사전 검토",
      "보증금 안내 여유",
      "서류 준비 완료 후 입찰",
    ],
    highlight: true,
  },
  {
    key: "standard",
    name: "일반",
    tag: "입찰 2~7일 전 신청",
    fee: FEES.standard,
    caption: "가장 많이 선택",
    bullets: [
      "표준 진행 일정",
      "접수 당일 확인 연락",
      "입찰 전일 서류 확정",
    ],
  },
  {
    key: "rush",
    name: "급건",
    tag: "입찰 2일 이내 신청",
    fee: FEES.rush,
    caption: "시간이 촉박한 경우",
    bullets: [
      "즉시 착수",
      "우선 처리",
      "최종 확인 1회",
    ],
  },
];

function feeLabel(won: number) {
  return `${(won / 10_000).toLocaleString("ko-KR")}만원`;
}

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            수수료
          </p>
          <h2
            id="pricing-heading"
            className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl"
          >
            결과가 아닌 신청 시점으로 가격이 정해집니다
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--color-ink-500)]">
            기본 수수료는 선납이지만, 패찰 시 보증금은{" "}
            <strong className="text-[var(--color-ink-900)]">당일 즉시 반환</strong>
            됩니다. 낙찰 성공보수는 낙찰된 경우에만 청구합니다.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.key}
              className={cn(
                "relative flex flex-col rounded-[var(--radius-xl)] border bg-white p-7 shadow-[var(--shadow-card)]",
                tier.highlight
                  ? "border-brand-600 ring-2 ring-brand-600/20"
                  : "border-[var(--color-border)]"
              )}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-7 inline-flex h-6 items-center rounded-full bg-brand-600 px-3 text-[11px] font-bold uppercase tracking-wide text-white">
                  추천
                </span>
              )}
              <header>
                <p className="text-sm font-bold text-brand-600">{tier.name}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                  {tier.tag}
                </p>
                <p className="mt-6 flex items-baseline gap-1.5 tabular-nums">
                  <span className="text-5xl font-black text-[var(--color-ink-900)]">
                    {feeLabel(tier.fee)}
                  </span>
                </p>
                <p className="mt-2 text-sm text-[var(--color-ink-500)]">
                  {tier.caption}
                </p>
              </header>
              <ul className="mt-6 flex flex-col gap-2.5 text-sm text-[var(--color-ink-700)]">
                {tier.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-brand-600"
                      aria-hidden="true"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={PRIMARY_CTA.href}
                className={cn(
                  "mt-8 flex min-h-12 items-center justify-center rounded-[var(--radius-md)] px-4 text-sm font-bold transition",
                  tier.highlight
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-ink-900)] hover:bg-[var(--color-ink-100)]"
                )}
              >
                이 가격으로 신청
              </Link>
            </article>
          ))}
        </div>

        {/* 성공보수 + 당일 즉시 반환 강조 배너 */}
        <div className="mt-10 grid gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-brand-50 text-brand-600">
              <ShieldCheck size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-bold text-[var(--color-ink-900)]">
                낙찰 성공보수{" "}
                <span className="text-brand-600">
                  +{feeLabel(FEES.successBonus)}
                </span>
                는 낙찰된 경우에만 청구합니다
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-ink-500)]">
                패찰 시에는 기본 수수료만 받고,{" "}
                <strong className="text-[var(--color-ink-900)]">
                  입찰 보증금은 당일 즉시 반환
                </strong>
                됩니다. 결과와 무관하게 청구되는 숨은 비용은 없습니다.
              </p>
            </div>
          </div>
          <Link
            href={PRIMARY_CTA.href}
            className="flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-brand-600 px-6 text-sm font-bold text-white hover:bg-brand-700 sm:whitespace-nowrap"
          >
            {PRIMARY_CTA.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
