import { Fragment } from "react";
import { Check, X, ArrowRight, ArrowDown } from "lucide-react";
import reviewsData from "@/data/reviews.json";
import { BRAND_NAME } from "@/lib/constants";

type Review = {
  id: string;
  name: string;
  meta: string;
  message: string;
};

const COMPARISON_ROWS: { label: string; self: string; ours: string }[] = [
  { label: "시간", self: "평일 오전 법원 직접 방문", ours: "신청 후 결과 통보까지 비대면" },
  { label: "서류", self: "인감증명서·위임장 등 직접 준비", ours: "전자본인서명확인서로 원격 처리" },
  { label: "수표 발행", self: "은행에서 별도 발행·수령", ours: "전용 계좌 송금 1회" },
  { label: "비용", self: "교통·휴가 + 실수 리스크", ours: "선납 수수료 + 성공보수(낙찰 시)" },
  {
    label: "안전성",
    self: "숫자·서류 실수 시 보증금 손실",
    ours: "서울보증보험 가입 · 당일 즉시 반환 보장",
  },
];

const STEPS: { n: number; title: string; body: string; badge: string }[] = [
  {
    n: 1,
    title: "사건 선택 · 신청",
    body: "물건을 고르고, 입찰가와 정보를 입력하여 신청합니다. 수수료는 신청 시점에 확정됩니다.",
    badge: "약 10분",
  },
  {
    n: 2,
    title: "서류 확인 · 입찰 수행",
    body: "전자본인서명확인서 기반 위임 서류를 확인하고, 입찰일에 법원에서 대리 입찰합니다.",
    badge: "D-1까지",
  },
  {
    n: 3,
    title: "결과 통보 · 정산",
    body: "입찰 당일 낙찰/패찰 결과를 통보합니다. 패찰 시 보증금은 당일 즉시 반환됩니다.",
    badge: "당일",
  },
];

function pickReviews(pool: Review[], n = 3): Review[] {
  return pool.slice(0, n);
}

/* Phase 0.1 — Block 3: 왜 경매퀵 진짜 통합본.
 * WhySection 비교표 + FlowSteps 3단계 + 후기 3건. 단일 section / 단일 헤더 / 3 row.
 * 본질 = 비교(객관) + 절차(시스템) + 후기(사용자 검증). */
export function WhyBlock() {
  const reviews = pickReviews(reviewsData as Review[]);

  return (
    <section
      aria-labelledby="why-heading"
      className="border-t border-[var(--color-border)] bg-white"
    >
      <div className="mx-auto w-full max-w-[var(--c-base)] px-5 py-20 sm:px-8 sm:py-24">
        {/* 헤더 */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)]">
            왜 {BRAND_NAME}인가
          </p>
          <h2
            id="why-heading"
            className="mt-2 text-h1 font-black tracking-tight text-[var(--color-ink-900)]"
          >
            직접 가는 대신, 맡기고 결과만 받으세요
          </h2>
          <p className="mt-3 text-body leading-relaxed text-[var(--color-ink-500)]">
            경매는 좋은 가격에 부동산을 취득할 수 있는 합리적 시스템입니다. 물리적 제약만
            해결되면, 누구나 참여할 수 있습니다.
          </p>
        </div>

        {/* Row 1 — 비교표 */}
        <div className="mt-12 overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--color-border)]">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="bg-[var(--color-surface-muted)]">
                <th
                  scope="col"
                  className="w-28 px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]"
                >
                  항목
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-sm font-bold text-[var(--color-ink-700)]"
                >
                  직접 입찰
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-sm font-bold text-[var(--color-ink-900)]"
                >
                  {BRAND_NAME} 입찰 대리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="px-5 py-4 text-left align-top text-xs font-bold text-[var(--color-ink-500)]"
                  >
                    {row.label}
                  </th>
                  <td className="px-5 py-4 align-top">
                    <div className="flex gap-2 text-[var(--color-ink-700)]">
                      <X
                        size={16}
                        className="mt-0.5 shrink-0 text-[var(--color-ink-300)]"
                        aria-hidden="true"
                      />
                      <span>{row.self}</span>
                    </div>
                  </td>
                  <td className="bg-[var(--color-ink-50)]/60 px-5 py-4 align-top">
                    <div className="flex gap-2 font-semibold text-[var(--color-ink-900)]">
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-[var(--color-ink-900)]"
                        aria-hidden="true"
                      />
                      <span>{row.ours}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Row 2 — 이용 절차 3단계 (FlowSteps 흡수). */}
        <div className="mt-16">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
              이용 절차
            </p>
            <p className="text-sm font-semibold text-[var(--color-ink-700)]">
              3단계로 끝나는 입찰 대리
            </p>
          </div>

          {/* 데스크탑: 가로 3열 + 화살표 커넥터 */}
          <ol className="mt-8 hidden grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-0 md:grid">
            {STEPS.map((step, i) => (
              <Fragment key={step.n}>
                <li className="flex flex-col">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-lg font-black text-white">
                    {step.n}
                  </div>
                  <h3 className="mt-6 text-xl font-black tracking-tight text-[var(--color-ink-900)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">{step.body}</p>
                  <span className="mt-5 inline-flex h-7 w-fit items-center rounded-full bg-[var(--color-ink-100)] px-3 text-xs font-bold text-[var(--color-ink-700)]">
                    {step.badge}
                  </span>
                </li>
                {i < STEPS.length - 1 && (
                  <li aria-hidden="true" className="flex items-center px-6">
                    <div className="relative h-px w-full bg-[var(--color-border)]">
                      <ArrowRight
                        size={20}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 text-[var(--color-ink-900)]"
                      />
                    </div>
                  </li>
                )}
              </Fragment>
            ))}
          </ol>

          {/* 모바일: 세로 스택 + 아래 화살표 커넥터 */}
          <ol className="mt-8 flex flex-col gap-0 md:hidden">
            {STEPS.map((step, i) => (
              <li key={step.n} className="flex flex-col">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-lg font-black text-white">
                      {step.n}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        aria-hidden="true"
                        className="mt-2 flex flex-1 flex-col items-center"
                      >
                        <div className="h-12 w-px flex-1 bg-[var(--color-border)]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 pb-10">
                    <h3 className="text-xl font-black tracking-tight text-[var(--color-ink-900)]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                      {step.body}
                    </p>
                    <span className="mt-4 inline-flex h-7 items-center rounded-full bg-[var(--color-ink-100)] px-3 text-xs font-bold text-[var(--color-ink-700)]">
                      {step.badge}
                    </span>
                    {i < STEPS.length - 1 && (
                      <ArrowDown
                        size={18}
                        aria-hidden="true"
                        className="mt-5 text-[var(--color-ink-900)]"
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Row 3 — 후기 3건. */}
        <div className="mt-16">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
            이용하신 분들의 이야기
          </h3>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="flex gap-2 rounded-[var(--radius-xl)] bg-[var(--color-surface-muted)] p-5"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink-300)] text-sm font-bold text-white"
                >
                  {r.name.slice(0, 1)}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[var(--color-ink-500)]">
                    {r.name} · {r.meta}
                  </p>
                  <div className="relative mt-2 rounded-[var(--radius-md)] rounded-tl-none bg-white p-3 text-sm leading-6 text-[var(--color-ink-700)] shadow-[var(--shadow-card)]">
                    {r.message}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
