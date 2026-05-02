import Link from "next/link";
import { Clock, BellRing, ShieldCheck } from "lucide-react";

/* Phase 1.2 (A-1-2) v4 — BenefitBlock (★ 신규 / 시안 정합 본질).
 * eyebrow "경매퀵을 쓰면" + h2 "받으실 수 있는 / 3가지 혜택" + 3 카드 + CTA primary green.
 * 카드 1 (시간) — Clock 모노톤 / "평일 오전을 그대로" / "법원 방문 없이 신청 후 결과만 통보"
 * 카드 2 (편의) — BellRing 모노톤 / "입찰 결과는 알림으로" / "서류 준비부터 입찰까지 전 과정 비대면"
 * 카드 3 (안전 ★) — ShieldCheck green gradient / "보증금은 전용계좌로" / "서울보증보험 가입 · 사고율 0%" */

const BENEFITS = [
  {
    icon: Clock,
    accent: false,
    title: "평일 오전을 그대로",
    desc: "법원 방문 없이 신청 후 결과만 통보받습니다.",
  },
  {
    icon: BellRing,
    accent: false,
    title: "입찰 결과는 알림으로",
    desc: "서류 준비부터 입찰까지 전 과정 비대면.",
  },
  {
    icon: ShieldCheck,
    accent: true,
    title: "보증금은 전용계좌로",
    desc: "서울보증보험 가입 · 사고율 0%.",
  },
] as const;

export function BenefitBlock() {
  return (
    <section
      aria-labelledby="benefit-heading"
      className="bg-[var(--bg-primary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="max-w-2xl">
          <p className="section-eyebrow">경매퀵을 쓰면</p>
          <h2
            id="benefit-heading"
            className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-[var(--text-primary)] lg:text-[40px]"
          >
            받으실 수 있는
            <br />
            3가지 혜택
          </h2>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-6">
          {BENEFITS.map(({ icon: Icon, accent, title, desc }) => (
            <li
              key={title}
              className="group flex flex-col rounded-3xl border border-[var(--border-1)] bg-white p-6 transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:-translate-y-0.5 hover:border-[var(--brand-green)]/20 hover:shadow-[var(--shadow-card-hover)] lg:p-8"
            >
              <span
                className={
                  accent
                    ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00E66B] to-[#00A040] text-white shadow-[var(--shadow-glow-green)]"
                    : "flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                }
              >
                <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-[18px] font-bold leading-[1.4] tracking-[-0.01em] text-[var(--text-primary)] lg:text-[20px]">
                {title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-[var(--text-secondary)] lg:text-[15px]">
                {desc}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center lg:mt-12">
          <Link
            href="/apply"
            className="inline-flex h-13 items-center justify-center rounded-[14px] bg-[var(--brand-green)] px-8 text-[15px] font-bold text-white shadow-[var(--shadow-button-green)] transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 lg:h-14 lg:px-10 lg:text-[16px]"
          >
            입찰 대리 신청하기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
