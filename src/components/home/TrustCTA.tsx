import Link from "next/link";
import { Shield, Building2, Briefcase } from "lucide-react";

/* Phase 1.2 (A-1-2) v2 — TrustCTA · 카피 광역 압축 + 신뢰 배지 3건 lucide 48px.
 * 변경:
 *  - eyebrow 보존
 *  - h1 "보증보험 가입, 사고율 0%" → "사고율 0%" (압축)
 *  - subtext 광역 압축 (시각 본질로 표현)
 *  - 신뢰 배지 3건 신규 (Shield / Building2 / Briefcase / 48px lucide) */

const BADGES = [
  { icon: Shield, label: "서울보증보험", sub: "가입" },
  { icon: Building2, label: "매수신청대리인", sub: "등록" },
  { icon: Briefcase, label: "공인중개사", sub: "자격" },
] as const;

export function TrustCTA() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="bg-[var(--bg-secondary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="section-eyebrow">안전한 입찰 대리</p>
            <h2
              id="trust-heading"
              className="text-h1 mt-3 text-[var(--text-primary)]"
            >
              사고율 0%
            </h2>

            {/* 신뢰 배지 3건 — lucide 48px (큰 본질). */}
            <ul className="mt-8 flex flex-wrap gap-3">
              {BADGES.map(({ icon: Icon, label, sub }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--border-1)] bg-[var(--bg-primary)] px-5 py-4"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-body font-[510] text-[var(--text-primary)]">
                      {label}
                    </span>
                    <span className="text-meta text-[var(--text-tertiary)]">
                      {sub}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 lg:items-start">
            <Link
              href="/apply"
              className="inline-flex h-14 items-center justify-center rounded-lg bg-[var(--button-bg)] px-6 text-[17px] font-[590] text-white transition-colors hover:bg-black"
            >
              입찰 대리 신청
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 items-center justify-center rounded-lg border border-[var(--border-1)] bg-[var(--bg-primary)] px-6 text-[17px] font-[590] text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
            >
              카카오톡 문의
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
