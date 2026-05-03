import { MapPin, FileCheck, Lock } from "lucide-react";

/* Phase 1.2 (A-1-2) v6 — Features (구 BenefitBlock / 카피 v4 광역 적용).
 * h2 "이렇게 진행됩니다." (eyebrow 폐기)
 * 카드 1 MapPin / "법원 방문 0회"
 * 카드 2 FileCheck / "서류 비대면 처리"
 * 카드 3 Lock / "보증금 분리 보관"
 * CTA 광역 폐기 (CTA 광역 2 영역 한정 paradigm). */

const FEATURES = [
  {
    icon: MapPin,
    title: "법원 방문 0회",
    desc: "신청 후 결과만 알림으로 받습니다.",
  },
  {
    icon: FileCheck,
    title: "서류 비대면 처리",
    desc: "위임장부터 입찰표까지 모바일로.",
  },
  {
    icon: Lock,
    title: "보증금 분리 보관",
    desc: "전용 계좌 + 보증보험 가입.",
  },
] as const;

export function BenefitBlock() {
  return (
    <section
      aria-labelledby="features-heading"
      className="bg-[var(--bg-primary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <h2
          id="features-heading"
          className="max-w-2xl text-[var(--text-h2)] font-extrabold leading-[1.1] tracking-[-0.025em] text-[var(--text-primary)]"
          style={{ fontWeight: 800 }}
        >
          이렇게 진행됩니다.
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6 lg:mt-16">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="group flex flex-col rounded-2xl border border-[var(--border-1)] bg-[var(--bg-primary)] p-7 transition-[transform,border-color] duration-[250ms] ease-out hover:-translate-y-0.5 hover:border-[var(--text-primary)]/20 lg:p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
                <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-[20px] font-bold leading-[1.35] tracking-[-0.01em] text-[var(--text-primary)] lg:text-[24px]">
                {title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-[var(--text-secondary)] lg:text-[16px]">
                {desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
