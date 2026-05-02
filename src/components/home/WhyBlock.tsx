import { Check, X, ArrowRight, Clock, Wallet, ShieldCheck } from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";

/* Phase 1.2 (A-1) — Why · 모노톤 화이트 + 앱 스타일.
 * 본질:
 *  - 비교표 5 → 3 row 압축 (시간 / 서류 / 안전만 / 수표 발행·비용 row 폐기)
 *  - 절차 3 step 보존 (앱 본질 카드)
 *  - 효용 시각화 카드 3건 신규 (testimonial 자리 대체 — 시간 / 비용 / 안전)
 *  - testimonial 폐기 (reviews.json 보존 + 호출 0)
 *  - 카피 v1.1 §C-3 신규 본문 */

const COMPARISON_ROWS: { label: string; self: string; ours: string }[] = [
  { label: "시간", self: "평일 오전 법원 방문", ours: "신청 후 결과만 통보" },
  { label: "서류", self: "인감증명서·위임장 등 직접 준비", ours: "전자본인서명확인서로 비대면" },
  { label: "안전", self: "숫자·서류 실수 시 보증금 손실", ours: "서울보증보험 가입 + 사고율 0%" },
];

const STEPS: { n: number; title: string }[] = [
  { n: 1, title: "신청" },
  { n: 2, title: "진행" },
  { n: 3, title: "결과 통보" },
];

const VALUE_CARDS = [
  {
    icon: Clock,
    label: "시간 효용",
    head: "오전 반차 1회",
    sub: "= 약 5만원 (월급 기준)",
  },
  {
    icon: Wallet,
    label: "비용 효용",
    head: "법무사 풀서비스 200만원",
    sub: "vs 경매퀵 5만원",
  },
  {
    icon: ShieldCheck,
    label: "안전 효용",
    head: "보증보험 + 전용계좌",
    sub: "= 사고율 0%",
  },
] as const;

export function WhyBlock() {
  return (
    <section
      aria-labelledby="why-heading"
      className="bg-[var(--bg-secondary)] border-b border-[var(--border-1)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="max-w-2xl">
          <p className="section-eyebrow">경매퀵의 차별점</p>
          <h2
            id="why-heading"
            className="text-h1 mt-3 text-[var(--text-primary)]"
          >
            법원에 가지 않아도,
            <br />
            입찰은 정확하게
          </h2>
          <p className="text-body mt-3 text-[var(--text-secondary)]">
            물리적 제약만 해결되면, 경매는 합리적인 시스템입니다.
          </p>
        </div>

        {/* Row 1 — 비교표 3 row (시간 / 서류 / 안전). */}
        <div className="mt-10 overflow-x-auto rounded-xl border border-[var(--border-1)] bg-[var(--bg-primary)]">
          <table className="text-body-sm w-full min-w-[36rem]">
            <thead>
              <tr className="border-b border-[var(--border-1)] bg-[var(--bg-secondary)]">
                <th
                  scope="col"
                  className="text-meta w-24 px-4 py-3 text-left font-semibold uppercase tracking-wide text-[var(--text-tertiary)]"
                >
                  항목
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]"
                >
                  직접 입찰
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]"
                >
                  {BRAND_NAME}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-1)]">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="text-meta px-4 py-3.5 text-left align-top font-semibold text-[var(--text-tertiary)]"
                  >
                    {row.label}
                  </th>
                  <td className="px-4 py-3.5 align-top">
                    <div className="flex gap-2 text-[var(--text-secondary)]">
                      <X
                        size={14}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[var(--text-tertiary)]"
                      />
                      <span>{row.self}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <div className="flex gap-2 font-medium text-[var(--text-primary)]">
                      <Check
                        size={14}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[var(--text-primary)]"
                      />
                      <span>{row.ours}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Row 2 — 이용 절차 3 step. */}
        <div className="mt-10">
          <p className="section-eyebrow">이용 절차</p>
          <ol className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
            {STEPS.map((step, i) => (
              <li
                key={step.n}
                className="flex flex-1 items-center gap-3 sm:flex-col sm:gap-2"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--text-primary)] text-sm font-bold text-white">
                  {step.n}
                </div>
                <span className="text-body font-semibold text-[var(--text-primary)]">
                  {step.title}
                </span>
                {i < STEPS.length - 1 && (
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="hidden text-[var(--text-tertiary)] sm:inline-block"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Row 3 — 효용 시각화 카드 3건 (testimonial 자리). */}
        <div className="mt-10">
          <p className="section-eyebrow">효용</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:gap-5">
            {VALUE_CARDS.map(({ icon: Icon, label, head, sub }) => (
              <li
                key={label}
                className="flex flex-col rounded-xl border border-[var(--border-1)] bg-[var(--bg-primary)] p-4 lg:p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="text-meta mt-3 font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                  {label}
                </span>
                <p className="text-h3 mt-2 text-[var(--text-primary)]">
                  {head}
                </p>
                <p className="text-body-sm mt-1 text-[var(--text-secondary)]">
                  {sub}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
