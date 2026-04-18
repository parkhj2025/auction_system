import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { APPLY_STEPS, BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "신청 가이드",
  description: `${BRAND_NAME} 입찰 대리 신청이 처음이신 분을 위한 단계별 가이드. 준비물과 각 단계별 주의사항을 안내합니다.`,
};

const STEP_DETAILS: Record<
  (typeof APPLY_STEPS)[number]["id"],
  { points: string[]; tip?: string }
> = {
  property: {
    points: [
      "사건번호(예: 2021타경521675) 또는 물건분석 페이지의 신청 버튼에서 진입합니다.",
      "법원은 현재 인천지방법원만 서비스 중이며, 다른 법원은 순차 확대 예정입니다.",
      "매칭이 안 되면 수동 입력으로도 진행할 수 있고, 상담원이 확인 시 물건 정보를 같이 안내드립니다.",
    ],
  },
  "bid-info": {
    points: [
      "입찰 희망 금액은 최저가 이상이어야 유효합니다.",
      "주민등록번호 앞 6자리는 위임장 작성용이며 뒷자리는 받지 않습니다.",
      "공동입찰의 경우 공동입찰인의 정보와 서류가 추가로 필요합니다.",
    ],
    tip: "입찰가는 권리 인수 부담까지 포함한 실질 취득비용을 기준으로 판단하세요.",
  },
  documents: {
    points: [
      "전자본인서명확인서는 대법원 전자민원센터에서 공동인증서/금융인증서로 발급합니다.",
      "신분증 사본은 주민등록증·운전면허증·여권 중 하나를 PDF 또는 이미지로 업로드합니다.",
      "파일 크기는 각 10MB 이내, PDF/JPG/PNG/WebP 형식만 허용됩니다.",
    ],
    tip: "발급 당일 접수를 권장드립니다. 서명확인서는 발급 후 유효기간이 있습니다.",
  },
  confirm: {
    points: [
      "입력 내용 요약과 제출 서류를 최종 확인합니다.",
      "5가지 안심 근거를 모두 체크하면 제출 버튼이 활성화됩니다.",
      "제출 직후 접수번호가 발급되고 다음 화면으로 이동합니다.",
    ],
  },
  complete: {
    points: [
      "접수번호와 전용계좌 정보가 화면에 표시됩니다.",
      "수수료와 보증금을 안내된 계좌로 송금합니다.",
      "확인 연락은 카카오톡 채널로 진행되며, 입찰일 전일까지 서류·입금 최종 확인 후 대리 입찰이 수행됩니다.",
    ],
  },
};

const FAQ = [
  {
    q: "패찰하면 수수료는 환불되나요?",
    a: "기본 수수료는 결과와 무관하게 청구되지만, 입찰 보증금은 패찰 시 전액 반환됩니다. 낙찰 성공보수는 낙찰 시에만 추가 청구됩니다.",
  },
  {
    q: "어떤 법원까지 가능한가요?",
    a: "현재는 인천지방법원에서 서비스 중이며, 수원·대전·부산·대구지방법원은 확대 준비 중입니다.",
  },
  {
    q: "접수 후 취소할 수 있나요?",
    a: "입찰 보증금 입금 전까지는 무료로 취소 가능합니다. 입금 이후에는 입찰일 2일 전까지 취소 시 보증금을 반환해드리며, 수수료는 절반(심사·서류 준비비) 공제 후 반환됩니다.",
  },
];

export default function ApplyGuidePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs font-medium text-[var(--color-ink-500)]"
          >
            <Link href="/" className="hover:text-[var(--color-ink-900)]">
              홈
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <Link
              href="/apply"
              className="hover:text-[var(--color-ink-900)]"
            >
              입찰 대리 신청
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="text-[var(--color-ink-700)]">신청 가이드</span>
          </nav>
          <p className="mt-5 text-xs font-black uppercase tracking-wider text-brand-600">
            신청 가이드
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl">
            처음이시라도 5분이면 끝납니다
          </h1>
          <p className="mt-3 text-base leading-7 text-[var(--color-ink-500)]">
            각 단계별로 무엇이 필요한지, 어떤 점을 주의해야 하는지 먼저
            확인하신 후 신청 페이지로 이동하세요.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <ol className="flex flex-col gap-10">
          {APPLY_STEPS.map((step, i) => {
            const detail = STEP_DETAILS[step.id];
            return (
              <li key={step.id} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">
                    {i + 1}
                  </span>
                  {i < APPLY_STEPS.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="mt-2 w-px flex-1 bg-[var(--color-border)]"
                    />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-xl font-black tracking-tight text-[var(--color-ink-900)]">
                    {step.label}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-ink-500)]">
                    {step.hint}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2 text-sm leading-6 text-[var(--color-ink-700)]">
                    {detail.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-ink-500)]"
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  {detail.tip && (
                    <p className="mt-3 rounded-[var(--radius-md)] bg-brand-50/50 px-4 py-3 text-xs leading-5 text-brand-700">
                      TIP · {detail.tip}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-brand-600">
            자주 묻는 질문
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
            신청 전 궁금하신 3가지
          </h2>
          <dl className="mt-8 flex flex-col gap-4">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5"
              >
                <dt className="text-base font-black text-[var(--color-ink-900)]">
                  {item.q}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex justify-center">
            <Link
              href="/apply"
              className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-7 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-brand-700"
            >
              신청 페이지로 이동
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
