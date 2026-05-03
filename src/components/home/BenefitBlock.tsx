import Link from "next/link";
import { Clock, FileText, ShieldCheck } from "lucide-react";

/* Phase 1.2 (A-1-2) v5 — BenefitBlock (형준님 #4 광역 적용).
 * eyebrow "경매퀵이 드리는 것" + h2 "이렇게 도와드립니다" + 카드 동사 본질 + mobile 2 col grid + CTA "무료 상담 신청".
 * 카드 1 (시간) — Clock 모노톤 / "시간을 아껴드립니다"
 * 카드 2 (편의) — FileText 모노톤 / "서류를 대신합니다"
 * 카드 3 (안전 ★) — ShieldCheck green gradient / "보증금을 보호합니다" — mobile col-span-2 (Code 자유 #3) */

const BENEFITS = [
  {
    icon: Clock,
    accent: false,
    title: "시간을 아껴드립니다",
    desc: "법원 방문 없이 신청 후 결과만 통보받습니다.",
  },
  {
    icon: FileText,
    accent: false,
    title: "서류를 대신합니다",
    desc: "위임장부터 입찰표까지 전 과정 비대면.",
  },
  {
    icon: ShieldCheck,
    accent: true,
    title: "보증금을 보호합니다",
    desc: "서울보증보험 가입 · 전용계좌 관리.",
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
          <p className="section-eyebrow">경매퀵이 드리는 것</p>
          <h2
            id="benefit-heading"
            className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.025em] text-[var(--text-primary)] lg:text-[40px]"
          >
            이렇게 도와드립니다
          </h2>
        </div>

        {/* mobile 2 col + 3번째 col-span-2 (Shield green 강조) / md·lg 3 col 광역. */}
        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-6">
          {BENEFITS.map(({ icon: Icon, accent, title, desc }, i) => (
            <li
              key={title}
              className={
                "group flex flex-col rounded-3xl border border-[var(--border-1)] bg-white p-5 transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:-translate-y-0.5 hover:border-[var(--brand-green)]/20 hover:shadow-[var(--shadow-card-hover)] lg:p-8 " +
                (i === 2 ? "col-span-2 md:col-span-1" : "")
              }
            >
              <span
                className={
                  accent
                    ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00E66B] to-[#00A040] text-white shadow-[var(--shadow-glow-green)] lg:h-14 lg:w-14"
                    : "flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] lg:h-14 lg:w-14"
                }
              >
                <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-[16px] font-bold leading-[1.4] tracking-[-0.01em] text-[var(--text-primary)] lg:mt-6 lg:text-[20px]">
                {title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.55] text-[var(--text-secondary)] lg:text-[15px]">
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
            무료 상담 신청 →
          </Link>
        </div>
      </div>
    </section>
  );
}
