import { Check, X, Clock, ShieldCheck, Wallet } from "lucide-react";
import reviewsData from "@/data/reviews.json";
import { BRAND_NAME } from "@/lib/constants";

type Review = {
  id: string;
  name: string;
  meta: string;
  message: string;
};

const COMPARISON_ROWS: {
  label: string;
  self: string;
  ours: string;
}[] = [
  {
    label: "시간",
    self: "평일 오전 법원 직접 방문",
    ours: "신청 후 결과 통보까지 비대면",
  },
  {
    label: "서류",
    self: "인감증명서·위임장 등 직접 준비",
    ours: "전자본인서명확인서로 원격 처리",
  },
  {
    label: "수표 발행",
    self: "은행에서 별도 발행·수령",
    ours: "전용 계좌 송금 1회",
  },
  {
    label: "비용",
    self: "교통·휴가 + 실수 리스크",
    ours: "선납 수수료 + 성공보수(낙찰 시)",
  },
  {
    label: "안전성",
    self: "숫자·서류 실수 시 보증금 손실",
    ours: "서울보증보험 가입 · 전액 반환 보장",
  },
];

const VALUE_CARDS = [
  {
    icon: Clock,
    title: "3일 안에 끝납니다",
    body: "얼리버드로 신청하면 접수 당일 확인, 입찰 전일 서류 확정, 입찰 당일 결과 통보. 별도로 시간을 낼 필요가 없습니다.",
  },
  {
    icon: ShieldCheck,
    title: "숨은 비용이 없습니다",
    body: "수수료는 신청 시점으로 확정됩니다. 낙찰 성공보수만 낙찰 시 추가되고, 패찰 시 보증금은 전액 반환됩니다.",
  },
  {
    icon: Wallet,
    title: "업계 평균 대비 절반 수준",
    body: "얼리버드 5만원부터. 콘텐츠 기반 운영 구조로 마케팅 비용을 최소화해 수수료를 낮췄습니다.",
  },
] as const;

/** deterministic 3 — Phase 1은 풀 상단 3개 고정. 랜덤은 Phase 2에서. */
function pickReviews(pool: Review[], n = 3): Review[] {
  return pool.slice(0, n);
}

export function WhySection() {
  const reviews = pickReviews(reviewsData as Review[]);

  return (
    <section
      aria-labelledby="why-heading"
      className="border-t border-[var(--color-border)] bg-white"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            왜 {BRAND_NAME}인가
          </p>
          <h2
            id="why-heading"
            className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl"
          >
            직접 가는 대신, 맡기고 결과만 받으세요
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--color-ink-500)]">
            경매는 좋은 가격에 부동산을 취득할 수 있는 합리적 시스템입니다.
            물리적 제약만 해결되면, 누구나 참여할 수 있습니다.
          </p>
        </div>

        {/* 비교표 — 모바일에서 가로 스크롤, md+에서 전체 노출 */}
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
                  className="px-5 py-4 text-left text-sm font-bold text-brand-700"
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
                  <td className="bg-brand-50/40 px-5 py-4 align-top">
                    <div className="flex gap-2 font-medium text-[var(--color-ink-900)]">
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-brand-600"
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

        {/* 가치 카드 3 */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {VALUE_CARDS.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-brand-50 text-brand-600">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-black tracking-tight text-[var(--color-ink-900)]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                {body}
              </p>
            </article>
          ))}
        </div>

        {/* 후기 — 대화 메시지형 */}
        <div className="mt-16">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
            이용하신 분들의 이야기
          </h3>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="flex gap-3 rounded-[var(--radius-xl)] bg-[var(--color-surface-muted)] p-5"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink-300)] text-sm font-bold text-white"
                >
                  {r.name.slice(0, 1)}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-[var(--color-ink-500)]">
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
