"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";

/* Phase 1.2 (A-1-2) Cycle B — Reviews 신규 섹션 (사회적 증명 paradigm).
 * 광역 페이지 맥락: Hero (가치 제안) → Compare (시간/과정) → Pricing (가격) → Insight (서비스 제공자 신뢰감 + 무료 콘텐츠) → Reviews (사회적 증명) → TrustCTA (전환).
 * 디자인 paradigm:
 * - Bento 2×3 grid (데스크탑) + vertical stack 1 column (모바일)
 * - 비-sticky 자연 scroll (cycle 5 학습 정합)
 * - scroll-linked fade in (motion v12 useInView once + amount 0.3)
 * - hover lift (subtle / shadow gray)
 * - 카피 정수: 서비스 주력 4건 + 광역 (서비스 + 콘텐츠 부가) 2건 / 콘텐츠 단독 0건
 * - 식상·AI 슬롭 어휘 0 / 영구 금지 어휘 0 / 광고 양산형 0
 * 보존: 메모리 §"낙찰사례 0" 영구 룰 정합 (Reviews ≠ 낙찰사례) */

type Review = {
  id: string;
  persona: string;
  body: string;
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    persona: "30대 학부모",
    body: "둘째 학교 끝나는 시간이라 법원 갈 엄두를 못 냈는데, 사건번호만 넘겼습니다.",
  },
  {
    id: "r2",
    persona: "50대 자영업자",
    body: "오전에 가게 비울 수가 없는데, 평일 입찰을 카톡으로 끝냈습니다.",
  },
  {
    id: "r3",
    persona: "60대 은퇴자",
    body: "나이 들어 서류가 부담이었는데, 사건번호 넘기고 입찰 끝냈습니다.",
  },
  {
    id: "r4",
    persona: "30대 직장인",
    body: "연차 안 쓰고 평일 입찰 끝낸 게 가장 좋았습니다.",
  },
  {
    id: "r5",
    persona: "40대 간호사",
    body: "야간 근무 끝나고 가이드 글도 봤지만, 결국 사건번호만 넘기면 끝이라 편했습니다.",
  },
  {
    id: "r6",
    persona: "20대 첫 입찰",
    body: "용어 글 보고 권리분석은 직접 했고, 입찰만 맡겼습니다.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ReviewsBlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="reviews-heading"
      className="bg-[#FAFAFA] py-16 lg:py-24"
    >
      <div className="container-app w-full">
        <h2
          id="reviews-heading"
          className="mb-4 text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)] [text-wrap:balance] lg:mb-6 lg:text-[88px]"
          style={{ fontWeight: 800 }}
        >
          법원 <span className="text-[var(--brand-green)]">안 가도</span> 됐습니다
          <span style={{ color: "#FFD43B" }}>.</span>
        </h2>

        <p className="mb-12 text-[16px] text-gray-500 lg:mb-16 lg:text-[20px]">
          예시로 작성된 후기입니다.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2 lg:gap-6"
        >
          {REVIEWS.map((review) => (
            <motion.article
              key={review.id}
              variants={cardVariants}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md lg:p-8"
            >
              <p className="text-[18px] leading-[1.5] text-[#111418] lg:text-[20px]">
                {review.body}
              </p>
              <p className="mt-6 text-[14px] font-semibold text-gray-500 lg:mt-8 lg:text-[15px]">
                {review.persona}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
