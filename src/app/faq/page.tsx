import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { FAQ_CATEGORIES } from "@/lib/faq-data";
import { BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: `${BRAND_NAME} 서비스·수수료·진행 절차·보증금·법적 사항에 대한 자주 묻는 질문. 패찰 시 보증금은 당일 즉시 반환됩니다.`,
};

export default function FaqPage() {
  // JSON-LD FAQPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_CATEGORIES.flatMap((c) =>
      c.items.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: it.a,
        },
      }))
    ),
  };

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-brand-600">
            자주 묻는 질문
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl">
            신청 전 궁금하신 점을 모았습니다
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-ink-500)]">
            여기서 답을 찾지 못하신 경우{" "}
            <Link
              href="/contact"
              className="font-bold text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
            >
              문의하기
            </Link>
            를 통해 추가로 안내드립니다.
          </p>

          {/* 카테고리 anchor 링크 */}
          <nav
            aria-label="카테고리 바로가기"
            className="mt-8 flex flex-wrap gap-2"
          >
            {FAQ_CATEGORIES.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="inline-flex h-9 items-center rounded-full border border-[var(--color-border)] bg-white px-4 text-xs font-bold text-[var(--color-ink-700)] hover:border-brand-600 hover:text-brand-700"
              >
                {c.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-16">
          {FAQ_CATEGORIES.map((cat) => (
            <section
              key={cat.id}
              id={cat.id}
              aria-labelledby={`${cat.id}-heading`}
              className="scroll-mt-24"
            >
              <header>
                <p className="text-xs font-black uppercase tracking-wider text-brand-600">
                  {cat.label}
                </p>
                <h2
                  id={`${cat.id}-heading`}
                  className="mt-2 text-2xl font-black tracking-tight text-[var(--color-ink-900)]"
                >
                  {cat.description}
                </h2>
              </header>
              <ul className="mt-6 flex flex-col gap-3">
                {cat.items.map((it, i) => (
                  <li key={it.q}>
                    <details
                      className="group rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 transition open:border-brand-600 open:bg-brand-50/30"
                      {...(i === 0 && cat.id === "fee" ? { open: true } : {})}
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                        <span className="text-base font-black text-[var(--color-ink-900)]">
                          {it.q}
                        </span>
                        <ChevronDown
                          size={18}
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-[var(--color-ink-500)] transition group-open:rotate-180 group-open:text-brand-600"
                        />
                      </summary>
                      <p className="mt-4 text-sm leading-7 text-[var(--color-ink-700)]">
                        {it.a}
                      </p>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 px-4 py-14 sm:px-6 sm:py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-2xl">
              답을 찾으셨나요?
            </h2>
            <p className="mt-2 text-sm text-[var(--color-ink-500)]">
              바로 신청하시거나 추가 문의를 남겨주세요.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/apply"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-6 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-brand-700"
            >
              입찰 대리 신청
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-6 text-sm font-bold text-[var(--color-ink-900)] hover:bg-[var(--color-ink-100)]"
            >
              문의하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
