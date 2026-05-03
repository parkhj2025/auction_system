import Image from "next/image";

/* Phase 1.2 (A-1-2) v7 — Features (Manako 3 일러스트 + 자신감 h2 v5).
 * h2 "법원에 갈 일이 없습니다." (eyebrow 폐기 / 자신감 본문 정수)
 * 카드 1 — feature-1-no-courthouse + "법원 방문 0회"
 * 카드 2 — feature-2-document-digital + "서류 비대면 처리"
 * 카드 3 — feature-3-deposit-separated + "보증금 분리 보관"
 * CTA 광역 폐기 (CTA 광역 2건 한정 paradigm). */

const FEATURES = [
  {
    img: "/illustrations/feature-1-no-courthouse.png",
    alt: "집 거실에서 모바일로 알림을 받는 사람",
    title: "법원 방문 0회",
    desc: "신청 후 결과만 알림으로 받습니다.",
  },
  {
    img: "/illustrations/feature-2-document-digital.png",
    alt: "데스크에서 종이 서류를 모바일로 변환하는 사람",
    title: "서류 비대면 처리",
    desc: "위임장부터 입찰표까지 모바일로.",
  },
  {
    img: "/illustrations/feature-3-deposit-separated.png",
    alt: "보증금이 보호되는 분리 계좌와 보증보험",
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
          className="max-w-3xl text-[var(--text-h2)] font-extrabold leading-[1.1] tracking-[-0.025em] text-[var(--text-primary)]"
          style={{ fontWeight: 800 }}
        >
          법원에 갈 일이{" "}
          <span className="text-[var(--brand-green)]">없습니다.</span>
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 lg:mt-16">
          {FEATURES.map(({ img, alt, title, desc }) => (
            <li
              key={title}
              className="group flex flex-col rounded-3xl border border-[var(--border-1)] bg-white p-6 transition-[transform,border-color] duration-[250ms] ease-out hover:-translate-y-1 hover:border-[var(--brand-green)]/30 lg:p-8"
            >
              {/* Manako 일러스트 — 풍부한 색감 + 캐릭터. */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#E6FAEE] to-white">
                <Image
                  src={img}
                  alt={alt}
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 90vw, 33vw"
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mt-6 text-[22px] font-bold leading-[1.3] tracking-[-0.01em] text-[var(--text-primary)] lg:text-[28px]">
                {title}
              </h3>
              <p className="mt-3 text-[16px] font-medium leading-[1.6] text-[var(--text-secondary)] lg:text-[17px]">
                {desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
