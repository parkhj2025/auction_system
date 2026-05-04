import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Gavel,
  Wallet,
  Bell,
} from "lucide-react";
import { ApplyChecklist } from "@/components/apply/ApplyChecklist";
import { BRAND_NAME, FEES } from "@/lib/constants";
import { formatKoreanWon } from "@/lib/utils";
import { PageHero } from "@/components/common/PageHero";

export const metadata: Metadata = {
  title: "서비스 안내",
  description: `${BRAND_NAME}은 공인중개사법에 따른 매수신청 대리(입찰 대리) 업무만 수행합니다. 업무 범위, 진행 절차, 수수료 체계, 안심 근거를 확인하세요.`,
};

const WE_DO = [
  "사건번호·물건 정보 확인 및 접수 관리",
  "위임장·입찰표 등 법적 서류 작성",
  "입찰일 법원 방문 및 현장 입찰 대리",
  "입찰 보증금 수납·반환 관리 (전용계좌)",
  "낙찰·패찰 결과 당일 통보",
  "낙찰 시 잔금 납부 일정 안내",
];

const WE_DONT = [
  "권리분석 결론 제공 (등기부·인수 여부 최종 판단)",
  "투자 권유 또는 매수 추천",
  "매매 알선·시세 감정",
  "명도 · 점유자 퇴거 · 이사비 협상",
  "소유권 이전 등기 대행",
  "세무 상담 및 절세 전략 수립",
];

const SOP = [
  {
    id: 1,
    icon: FileCheck,
    title: "웹 접수",
    body: "사건번호, 입찰가, 신청인 정보를 입력하고 전자본인서명확인서·신분증을 업로드합니다. 평균 10분 소요.",
    meta: "D-7 ~ D-2",
  },
  {
    id: 2,
    icon: Bell,
    title: "접수 확인 연락",
    body: "접수번호 발급 후 카카오톡으로 확인 연락이 전달됩니다. 수수료·보증금 입금 여부와 서류 이상 유무를 확인합니다.",
    meta: "접수 당일",
  },
  {
    id: 3,
    icon: Wallet,
    title: "서류·보증금 확정",
    body: "입찰 전일까지 서류 최종 확인과 보증금 입금 확인을 완료합니다. 문제가 있으면 즉시 보완 요청드립니다.",
    meta: "D-1",
  },
  {
    id: 4,
    icon: Gavel,
    title: "법원 대리 입찰",
    body: "입찰일 오전 지정 시각에 법원에서 입찰표를 제출합니다. 입찰 과정은 내부 기록으로 남깁니다.",
    meta: "D-Day 오전",
  },
  {
    id: 5,
    icon: ShieldCheck,
    title: "결과 통보 · 정산",
    body: "입찰 종료 직후 낙찰/패찰 결과를 카카오톡으로 통보합니다. 패찰 시 보증금은 당일 즉시 반환됩니다.",
    meta: "D-Day 오후",
  },
] as const;

export default function ServicePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero — PageHero 광역 (시작 → 끝 paradigm / 카카오톡 직접 소통). */}
      <PageHero
        eyebrow="이용 절차"
        title={
          <>
            사건번호 입력부터, <span className="text-[var(--brand-green)]">낙찰</span>까지
            <span style={{ color: "#FFD43B" }}>.</span>
          </>
        }
        subtitle="신청 · 서류 · 입찰 · 결과 — 모두 카카오톡으로."
      />

      {/* 업무 범위 비교 */}
      <section className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
          업무 범위
        </p>
        <h2 className="mt-2 text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
          무엇을 하고 무엇을 하지 않는지 명확히 합니다
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-ink-500)]">
          범위 밖의 업무는 법무사 · 변호사 등 전문가에게 별도 위임해야 합니다.
          이 경계가 고객과 저희 모두를 보호합니다.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-[var(--radius-xl)] border border-[var(--color-ink-900)] bg-[var(--color-ink-50)]/50 p-6">
            <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
              우리가 하는 일
            </p>
            <h3 className="mt-2 text-xl font-black text-[var(--color-ink-900)]">
              매수신청 대리
            </h3>
            <ul className="mt-5 flex flex-col gap-2 text-sm leading-6 text-[var(--color-ink-700)]">
              {WE_DO.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-[var(--color-ink-900)]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6">
            <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-500)]">
              우리가 하지 않는 일
            </p>
            <h3 className="mt-2 text-xl font-black text-[var(--color-ink-900)]">
              전문가 영역
            </h3>
            <ul className="mt-5 flex flex-col gap-2 text-sm leading-6 text-[var(--color-ink-700)]">
              {WE_DONT.map((item) => (
                <li key={item} className="flex gap-2">
                  <X
                    size={16}
                    className="mt-0.5 shrink-0 text-[var(--color-ink-300)]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-5 py-3 text-xs leading-5 text-[var(--color-ink-500)]">
              본 콘텐츠에 포함된 모든 분석은 참고 자료이며 투자 권유가 아닙니다.
              투자 판단에 대한 책임은 본인에게 있습니다.
            </p>
          </article>
        </div>
      </section>

      {/* SOP */}
      <section className="border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            진행 절차
          </p>
          <h2 className="mt-2 text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
            접수부터 정산까지 5단계
          </h2>
          <ol className="mt-12 flex flex-col gap-8">
            {SOP.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-[length:var(--text-body)] font-black text-white">
                      {step.id}
                    </span>
                    {step.id < SOP.length && (
                      <div
                        aria-hidden="true"
                        className="mt-2 w-px flex-1 bg-[var(--color-border)]"
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-[var(--color-ink-900)]">
                        <Icon
                          size={16}
                          className="mr-1 inline-block text-[var(--color-ink-900)]"
                          aria-hidden="true"
                        />
                        {step.title}
                      </h3>
                      <span className="inline-flex h-6 items-center rounded-full bg-[var(--color-ink-100)] px-2.5 text-[11px] font-bold text-[var(--color-ink-700)]">
                        {step.meta}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                      {step.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 수수료 요약 */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            수수료 체계
          </p>
          <h2 className="mt-2 text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
            신청 시점으로 확정되는 정찰제
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                label: "얼리버드",
                hint: "입찰일 7일 이상 전",
                fee: FEES.earlybird,
              },
              {
                label: "일반",
                hint: "입찰일 2~7일 전",
                fee: FEES.standard,
              },
              {
                label: "급건",
                hint: "입찰일 2일 이내",
                fee: FEES.rush,
              },
            ].map((tier) => (
              <div
                key={tier.label}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6"
              >
                <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
                  {tier.label}
                </p>
                <p className="mt-2 text-h2 font-black tabular-nums text-[var(--color-ink-900)]">
                  {formatKoreanWon(tier.fee)}
                </p>
                <p className="mt-2 text-xs text-[var(--color-ink-500)]">
                  {tier.hint}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-[var(--color-ink-500)]">
            낙찰 성공보수{" "}
            <strong className="text-[var(--color-ink-900)]">
              +{formatKoreanWon(FEES.successBonus)}
            </strong>
            는 낙찰된 경우에만 청구됩니다. 패찰 시 보증금은{" "}
            <strong className="text-[var(--color-ink-900)]">당일 즉시 반환</strong>
            됩니다.
          </p>
          <div className="mt-8">
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-ink-900)] hover:text-black"
            >
              상세 수수료 비교 보기
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 안심 근거 */}
      <section className="border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            안심 근거
          </p>
          <h2 className="mt-2 text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
            5가지 안전장치
          </h2>
          <div className="mt-10">
            <ApplyChecklist
              values={[true, true, true, true, true]}
              displayOnly
            />
          </div>
          <div className="mt-10 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/apply"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-6 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-black"
            >
              입찰 대리 신청
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/faq"
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-6 text-sm font-bold text-[var(--color-ink-900)] hover:bg-[var(--color-ink-100)]"
            >
              자주 묻는 질문
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
