import Link from "next/link";
import { ShieldCheck, Shield, FileCheck } from "lucide-react";
import { PRIMARY_CTA } from "@/lib/navigation";

const BADGES = [
  { icon: ShieldCheck, label: "공인중개사 등록" },
  { icon: Shield, label: "서울보증보험 가입" },
  { icon: FileCheck, label: "전자본인서명확인서" },
] as const;

/* Phase 1 — TrustCTA · Aurora Calm + Liquid Glass card.
 * 본질:
 *  - .bg-aurora-trustcta (Aurora 동일 톤 + 좌하단 발광)
 *  - 안 .glass-card (blur 28 + white/7 bg + white/18 border) 가운데 정렬 단일 카드 (가운데 정렬 예외)
 *  - 신뢰 뱃지 3건 .glass-pill
 *  - CTA primary 흰 bg + violet text
 *  - CTA secondary glass-pill */
export function TrustCTA() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="bg-aurora-trustcta relative isolate overflow-hidden"
    >
      <div className="container-aurora relative py-[var(--section-py)]">
        {/* 가운데 정렬 trust-cta-card 1건 (가운데 정렬 예외). */}
        <div className="glass-card mx-auto flex w-full max-w-3xl flex-col items-center rounded-[var(--r-card-lg)] p-[var(--card-p)] text-center text-white shadow-[0_24px_60px_-15px_rgba(15,23,42,0.45)]">
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {BADGES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="glass-pill inline-flex h-9 items-center gap-2 rounded-full px-4 text-meta font-bold tracking-wide text-white"
              >
                <Icon size={14} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>

          <h2
            id="trust-heading"
            className="text-h2 mt-8 font-bold leading-tight tracking-tight"
          >
            입찰일에 법원 방문이 어려우신가요?
          </h2>
          <p className="text-body-lg mt-5 max-w-2xl text-[var(--text-on-aurora-muted)]">
            물건은 찾았는데 평일에 시간 내기 어려운 분들을 위해, 경매 입찰 대리
            서비스를 운영하고 있습니다. 패찰 시 보증금은 당일 즉시 반환됩니다.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href={PRIMARY_CTA.href}
              className="inline-flex h-12 min-h-12 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-[var(--accent-violet)] shadow-[var(--shadow-lift)] transition hover:bg-white/90"
            >
              {PRIMARY_CTA.label}
            </Link>
            <Link
              href="/#pricing"
              className="glass-pill inline-flex h-12 min-h-12 items-center justify-center rounded-full px-8 text-base font-semibold text-white transition hover:bg-white/15"
            >
              수수료 안내
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
