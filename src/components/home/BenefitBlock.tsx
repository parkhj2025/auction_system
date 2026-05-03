import Image from "next/image";
import { FeatureCard } from "./FeatureCard";

/* Phase 1.2 (A-1-2) v9 — Features (bento 2x2 + 1x1 + 1x1 + scroll reveal + hover lift).
 * h2 v6 "당신이 신경 쓸 일은 사건번호 하나뿐." (green accent on "사건번호 하나뿐")
 * desktop: bento `grid-cols-3 grid-rows-2` — 큰 카드 1 (col-span-2 row-span-2) + 작은 카드 2 (1x1 우측 stack)
 * mobile: variable height stack — JSX 순서 정수 (큰 카드 우선 + 작은 카드 광역 ↓)
 * scroll reveal: useScrollReveal hook (Features 광역)
 * hover: translateY -4 + shadow-xl + scale 1.02 + 250ms */

const FEATURE_LARGE = {
  img: "/illustrations/feature-1-no-courthouse.png",
  alt: "집 거실에서 모바일로 알림을 받는 사람",
  title: "법원 방문 0회",
  desc: "신청 후 결과만 알림으로 받습니다. 평일 반차도, 수표 발행도, 오랜 대기도 광역 0.",
} as const;

const FEATURES_SMALL = [
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
          className="max-w-4xl text-[var(--text-h2)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--text-primary)] [text-wrap:balance]"
          style={{ fontWeight: 800 }}
        >
          당신이 신경 쓸 일은{" "}
          <span className="text-[var(--brand-green)]">사건번호 하나뿐.</span>
        </h2>

        {/* bento grid: mobile stack (JSX 순서 정수 — 큰 카드 우선) / desktop 3x2 (큰 1 col-span-2 row-span-2 + 작은 2 우측 stack). */}
        <ul className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-3 lg:grid-rows-2 lg:gap-8">
          {/* 큰 카드 (col-span-2 row-span-2). */}
          <FeatureCard
            className="lg:col-span-2 lg:row-span-2"
            isLarge
            img={FEATURE_LARGE.img}
            alt={FEATURE_LARGE.alt}
            title={FEATURE_LARGE.title}
            desc={FEATURE_LARGE.desc}
            delay={0}
          />

          {/* 작은 카드 2건 (1x1 우측 stack). */}
          {FEATURES_SMALL.map((feat, i) => (
            <FeatureCard
              key={feat.title}
              img={feat.img}
              alt={feat.alt}
              title={feat.title}
              desc={feat.desc}
              delay={(i + 1) * 100}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 일러스트 wrapper — Image 컴포넌트 영역 분리 (FeatureCard 영역 내부 영역). */
export function FeatureIllustration({
  img,
  alt,
  isLarge = false,
}: {
  img: string;
  alt: string;
  isLarge?: boolean;
}) {
  const size = isLarge ? 720 : 400;
  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#E6FAEE] to-white ${isLarge ? "aspect-[16/10]" : "aspect-square"}`}>
      <Image
        src={img}
        alt={alt}
        width={size}
        height={isLarge ? Math.round(size * 10 / 16) : size}
        sizes={isLarge ? "(max-width: 1024px) 90vw, 60vw" : "(max-width: 1024px) 90vw, 33vw"}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
