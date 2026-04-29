import Link from "next/link";
import { ShieldCheck, Shield, FileCheck } from "lucide-react";
import { PRIMARY_CTA } from "@/lib/navigation";

const BADGES = [
  { icon: ShieldCheck, label: "공인중개사 등록" },
  { icon: Shield, label: "서울보증보험 가입" },
  { icon: FileCheck, label: "전자본인서명확인서" },
] as const;

/**
 * 홈 최하단 마무리 CTA.
 * - 어두운 배경 + 신뢰 뱃지 3개 + 헤드라인 + 보조 카피 + CTA 버튼 2개
 * - "패찰 시 보증금은 당일 즉시 반환됩니다" 필수 포함 (CLAUDE.md 규칙)
 */
export function TrustCTA() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="relative overflow-hidden bg-[var(--ink-surface-2)] text-white"
    >
      <div className="relative mx-auto flex w-full max-w-[var(--container-w-narrow)] flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
        <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {BADGES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex h-9 items-center gap-2 rounded-[var(--r-pill)] border border-white/15 bg-white/5 px-4 text-xs font-medium tracking-wide text-white"
            >
              <Icon size={14} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <h2
          id="trust-heading"
          className="mt-10 text-[length:var(--fs-h1)] font-bold leading-[1.1] tracking-[-0.018em]"
        >
          입찰일에 법원 방문이 어려우신가요?
        </h2>
        <p className="mt-6 max-w-2xl text-[length:var(--fs-lead)] leading-[1.5] text-white/80">
          물건은 찾았는데 평일에 시간 내기 어려운 분들을 위해, 경매 입찰 대리
          서비스를 운영하고 있습니다. 패찰 시 보증금은 당일 즉시 반환됩니다.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href={PRIMARY_CTA.href}
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--r-pill)] bg-white px-7 text-[length:var(--text-body)] font-semibold text-[var(--deep-green)] shadow-[var(--shadow-1)] transition hover:bg-[var(--pale-green)]"
          >
            {PRIMARY_CTA.label}
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--r-pill)] border border-white/25 bg-transparent px-7 text-[length:var(--text-body)] font-semibold text-white transition hover:bg-white/10"
          >
            수수료 안내
          </Link>
        </div>
      </div>
    </section>
  );
}
