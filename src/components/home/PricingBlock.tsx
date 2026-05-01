import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { COURTS_ACTIVE, COURTS_COMING_SOON, FEES } from "@/lib/constants";
import { PRIMARY_CTA } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/* Phase 0.1 — Block 4: 수수료 진짜 통합본.
 * RegionStrip(서비스 지역) 인라인 흡수 + 기존 Pricing 카드 3 + 성공보수 안내 배너.
 * 단일 section / 단일 max-width / 단일 padding 본질. */

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
    bullets: ["충분한 사전 검토", "보증금 안내 여유", "서류 준비 완료 후 입찰"],
    highlight: true,
  },
  {
    key: "standard",
    name: "일반",
    tag: "입찰 2~7일 전 신청",
    fee: FEES.standard,
    caption: "가장 많이 선택",
    bullets: ["표준 진행 일정", "접수 당일 확인 연락", "입찰 전일 서류 확정"],
  },
  {
    key: "rush",
    name: "급건",
    tag: "입찰 2일 이내 신청",
    fee: FEES.rush,
    caption: "시간이 촉박한 경우",
    bullets: ["즉시 착수", "우선 처리", "최종 확인 1회"],
  },
];

function feeLabel(won: number) {
  return `${(won / 10_000).toLocaleString("ko-KR")}만원`;
}

export function PricingBlock() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]"
    >
      <div className="mx-auto w-full max-w-[var(--c-base)] px-5 py-20 sm:px-8 sm:py-24">
        {/* Region strip (RegionStrip 흡수) — 헤드라인 위 작은 띠. */}
        <div className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
            서비스 지역
          </span>
          <ul className="flex flex-wrap items-center gap-2">
            {COURTS_ACTIVE.map((c) => (
              <li key={c.value}>
                <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--color-ink-900)] px-3 text-[13px] font-medium text-white">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />
                  {c.label}
                </span>
              </li>
            ))}
            {COURTS_COMING_SOON.map((c) => (
              <li key={c.value}>
                <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--color-ink-200)] bg-white px-3 text-[13px] font-medium text-[var(--color-ink-700)]">
                  {c.label}
                  <span className="ml-1 inline-flex h-5 items-center rounded-full bg-[var(--color-ink-100)] px-2 text-[10px] font-bold text-[var(--color-ink-900)]">
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

        {/* 수수료 헤드라인 */}
        <div className="mt-12 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)]">
            수수료
          </p>
          <h2
            id="pricing-heading"
            className="mt-2 text-h1 font-black tracking-tight text-[var(--color-ink-900)]"
          >
            결과가 아닌 신청 시점으로 가격이 정해집니다
          </h2>
          <p className="mt-3 text-body leading-relaxed text-[var(--color-ink-500)]">
            기본 수수료는 선납이지만, 패찰 시 보증금은{" "}
            <strong className="text-[var(--color-ink-900)]">당일 즉시 반환</strong>됩니다.
            낙찰 성공보수는 낙찰된 경우에만 청구합니다.
          </p>
        </div>

        {/* 수수료 카드 3 — Phase 1: 추천 카드만 .bg-aurora-card + 흰 텍스트. */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.key}
              className={cn(
                "relative flex flex-col rounded-[var(--r-card-lg)] p-7",
                tier.highlight
                  ? "bg-aurora-card shadow-[0_24px_60px_-15px_rgba(15,23,42,0.45)]"
                  : "border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]"
              )}
            >
              {tier.highlight && (
                <span className="glass-pill absolute -top-3 left-7 inline-flex h-6 items-center rounded-full px-3 text-[11px] font-bold uppercase tracking-wide text-white">
                  추천
                </span>
              )}
              <header>
                <p
                  className={cn(
                    "text-sm font-bold",
                    tier.highlight
                      ? "text-[var(--lavender-200)]"
                      : "text-[var(--color-ink-900)]"
                  )}
                >
                  {tier.name}
                </p>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    tier.highlight
                      ? "text-[var(--text-on-aurora-faint)]"
                      : "text-[var(--color-ink-500)]"
                  )}
                >
                  {tier.tag}
                </p>
                <p className="mt-6 flex items-baseline gap-1.5 tabular-nums">
                  <span
                    className={cn(
                      "text-h1 font-black",
                      tier.highlight ? "text-white" : "text-[var(--color-ink-900)]"
                    )}
                  >
                    {feeLabel(tier.fee)}
                  </span>
                </p>
                <p
                  className={cn(
                    "mt-2 text-sm",
                    tier.highlight
                      ? "text-[var(--text-on-aurora-muted)]"
                      : "text-[var(--color-ink-500)]"
                  )}
                >
                  {tier.caption}
                </p>
              </header>
              <ul
                className={cn(
                  "mt-6 flex flex-col gap-2.5 text-sm",
                  tier.highlight
                    ? "text-[var(--text-on-aurora-muted)]"
                    : "text-[var(--color-ink-700)]"
                )}
              >
                {tier.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <Check
                      size={16}
                      className={cn(
                        "mt-0.5 shrink-0",
                        tier.highlight
                          ? "text-[var(--lavender-200)]"
                          : "text-[var(--accent-violet)]"
                      )}
                      aria-hidden="true"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={PRIMARY_CTA.href}
                className={cn(
                  "mt-8 flex min-h-12 items-center justify-center rounded-full px-4 text-sm font-bold transition",
                  tier.highlight
                    ? "bg-white text-[var(--text-primary)] hover:bg-white/90"
                    : "border border-[var(--color-ink-900)] bg-white text-[var(--color-ink-900)] hover:bg-[var(--color-ink-900)] hover:text-white"
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
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-50)] text-[var(--color-ink-900)]">
              <ShieldCheck size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-body font-bold text-[var(--color-ink-900)]">
                낙찰 성공보수{" "}
                <span className="text-[var(--color-ink-900)]">+{feeLabel(FEES.successBonus)}</span>
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
            className="flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-6 text-sm font-bold text-white hover:bg-black sm:whitespace-nowrap"
          >
            {PRIMARY_CTA.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
