import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Scale,
  HandCoins,
  ArrowRight,
  Building2,
} from "lucide-react";
import { BRAND_NAME, COMPANY, COURTS_ACTIVE, COURTS_COMING_SOON } from "@/lib/constants";

export const metadata: Metadata = {
  title: "대표 소개",
  description: `${COMPANY.name} 대표 ${COMPANY.ceo}. 공인중개사 자격 보유, 서울보증보험 가입. 경매 입찰 대리라는 단일 업무에 집중해 합리적인 가격으로 서비스를 제공합니다.`,
};

const VALUES = [
  {
    icon: Scale,
    title: "업무 범위는 명확하게",
    body: "권리분석·투자자문·명도 같은 전문가 영역은 다루지 않습니다. 할 수 있는 일만 하고 그것을 잘합니다.",
  },
  {
    icon: ShieldCheck,
    title: "결과와 무관한 투명성",
    body: "기본 수수료는 결과와 관계없이 청구하고, 낙찰 성공보수는 성공 시에만 청구합니다. 숨은 비용 없음.",
  },
  {
    icon: HandCoins,
    title: "합리적인 가격",
    body: "콘텐츠 기반 유입 구조로 마케팅 비용을 줄여 업계 평균 대비 절반 수준의 수수료를 책정했습니다.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-brand-600">
            대표 소개
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl">
            법원 안 가고, 경매에 참여할 수 있게
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-ink-500)] sm:text-lg sm:leading-8">
            경매는 시세보다 저렴하게 부동산을 취득할 수 있는 합리적인 시스템입니다.
            그런데 입찰일에 법원에 직접 가야 한다는 물리적 제약이 대부분의 참여를
            막습니다. 이 불편을 합리적인 가격으로 해결하는 것이 {BRAND_NAME}의 일입니다.
          </p>
        </div>
      </section>

      {/* Founder profile */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-8 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)] sm:flex-row sm:p-10">
          <div className="flex shrink-0 flex-col items-center gap-3 sm:w-48">
            <div
              aria-hidden="true"
              className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-4xl font-black text-white"
            >
              {COMPANY.ceo.slice(0, 1)}
            </div>
            <p className="text-xs font-bold text-[var(--color-ink-500)]">
              대표 · 공인중개사
            </p>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black tracking-tight text-[var(--color-ink-900)]">
              {COMPANY.ceo}
            </h2>
            <ul className="mt-5 flex flex-col gap-2.5 text-sm leading-6 text-[var(--color-ink-700)]">
              <li className="flex gap-2">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-brand-600"
                  aria-hidden="true"
                />
                공인중개사 자격 보유 (매수신청대리인 등록)
              </li>
              <li className="flex gap-2">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-brand-600"
                  aria-hidden="true"
                />
                서울보증보험 가입 — 사고 발생 시 고객 자산 보호
              </li>
              <li className="flex gap-2">
                <Building2
                  size={16}
                  className="mt-0.5 shrink-0 text-brand-600"
                  aria-hidden="true"
                />
                {COMPANY.court} 관할 경매 물건 대리 입찰 수행
              </li>
            </ul>
            <p className="mt-6 text-sm leading-7 text-[var(--color-ink-500)]">
              경매 입찰 대리라는 단일 업무에 집중합니다. 권리분석·투자자문 같은
              전문가 영역까지 확장하지 않는 이유는 범위를 좁혔을 때 가격을 낮출
              수 있고, 품질을 유지할 수 있기 때문입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-brand-600">
            운영 원칙
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
            이렇게 일합니다
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, body }) => (
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
        </div>
      </section>

      {/* Regions */}
      <section className="border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-brand-600">
            서비스 지역
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
            현재 인천에서 시작하고 있습니다
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
            서비스 지역은 계속 확대됩니다. 신규 지역 오픈 소식은 공지사항을
            통해 안내드립니다.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {COURTS_ACTIVE.map((c) => (
              <li key={c.value}>
                <span className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-bold text-white">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-yellow)]"
                  />
                  {c.label}
                  <span className="text-xs font-medium text-brand-100">
                    서비스 중
                  </span>
                </span>
              </li>
            ))}
            {COURTS_COMING_SOON.map((c) => (
              <li key={c.value}>
                <span className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-5 text-sm font-medium text-[var(--color-ink-700)]">
                  {c.label}
                  <span className="inline-flex h-5 items-center rounded-full bg-[var(--color-accent-yellow-soft)] px-2 text-[10px] font-bold text-[var(--color-ink-900)]">
                    오픈 예정
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-brand-950)] text-white">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:py-20 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
              준비된 대리인에게 맡기세요
            </h2>
            <p className="mt-3 text-sm leading-6 text-brand-100 sm:text-base">
              패찰 시 보증금은 당일 즉시 반환됩니다. 결과와 무관하게 투명합니다.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/apply"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-white px-6 text-sm font-black text-[var(--color-brand-900)] shadow-[var(--shadow-lift)] hover:bg-brand-50"
            >
              입찰 대리 신청
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-white/25 bg-white/10 px-6 text-sm font-bold text-white hover:bg-white/20"
            >
              문의하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
