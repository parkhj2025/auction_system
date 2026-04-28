import { Fragment } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

type Step = {
  n: number;
  title: string;
  body: string;
  badge: string;
};

/**
 * 채널 중립적 3단계 플로우.
 * - "카카오톡", "전화", "웹" 같은 채널 언급 금지.
 * - 3단계 설명에 "패찰 시 보증금은 당일 즉시 반환됩니다" 필수 포함 (CLAUDE.md 규칙).
 */
const STEPS: Step[] = [
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

export function FlowSteps() {
  return (
    <section
      aria-labelledby="flow-heading"
      className="border-t border-[var(--color-border)] bg-white"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)]">
            이용 절차
          </p>
          <h2
            id="flow-heading"
            className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl"
          >
            3단계로 끝나는 입찰 대리
          </h2>
          <p className="mt-3 text-[length:var(--text-body)] leading-7 text-[var(--color-ink-500)]">
            별도로 법원을 방문하실 필요가 없습니다.
          </p>
        </div>

        {/* 데스크탑: 가로 3열 + 화살표 커넥터 */}
        <ol className="mt-14 hidden grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-0 md:grid">
          {STEPS.map((step, i) => (
            <Fragment key={step.n}>
              <li className="flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-lg font-black text-white">
                  {step.n}
                </div>
                <h3 className="mt-6 text-xl font-black tracking-tight text-[var(--color-ink-900)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
                  {step.body}
                </p>
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
        <ol className="mt-12 flex flex-col gap-0 md:hidden">
          {STEPS.map((step, i) => (
            <li key={step.n} className="flex flex-col">
              <div className="flex gap-5">
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
    </section>
  );
}
