import Link from "next/link";
import { ArrowRight, BookOpen, Newspaper } from "lucide-react";
import { getAllGuidePosts, getAllNewsPosts } from "@/lib/content";
import { formatKoreanDate } from "@/lib/utils";

const DIFFICULTY_LABEL = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "실전",
} as const;

/**
 * 콘텐츠 쇼케이스 — Segment B 체류를 유도하는 유입 도구.
 * 레이아웃: 좌 가이드 카드 2개 (스택) + 우 시황 카드 1개 (큰 것)
 */
export function ContentShowcase() {
  const guides = getAllGuidePosts().slice(0, 2);
  const news = getAllNewsPosts().slice(0, 1)[0];
  if (guides.length === 0 && !news) return null;

  return (
    <section
      aria-labelledby="content-heading"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)]">
              콘텐츠 허브
            </p>
            <h2
              id="content-heading"
              className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl"
            >
              읽고 나면 판단이 달라집니다
            </h2>
          </div>
          <Link
            href="/guide"
            className="hidden items-center gap-1 text-sm font-bold text-[var(--color-ink-900)] hover:text-black sm:inline-flex"
          >
            가이드 전체 보기
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <div className="flex flex-col gap-5 lg:col-span-2">
            {guides.map((g) => (
              <Link
                key={g.frontmatter.slug}
                href={`/guide/${g.frontmatter.slug}`}
                className="group flex items-start gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-50)] text-[var(--color-ink-900)]">
                  <BookOpen size={22} aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 items-center rounded-full bg-[var(--color-ink-100)] px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-700)]">
                      경매가이드
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--color-ink-500)]">
                      {DIFFICULTY_LABEL[g.frontmatter.difficulty]}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-black tracking-tight text-[var(--color-ink-900)] group-hover:text-black">
                    {g.frontmatter.title}
                  </h3>
                  {g.frontmatter.subtitle && (
                    <p className="mt-1 line-clamp-1 text-sm text-[var(--color-ink-500)]">
                      {g.frontmatter.subtitle}
                    </p>
                  )}
                  <p className="mt-3 text-[11px] font-semibold text-[var(--color-ink-500)]">
                    {formatKoreanDate(g.frontmatter.publishedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {news && (
            <Link
              href={`/news/${news.frontmatter.slug}`}
              className="group flex flex-col justify-between rounded-[var(--radius-xl)] bg-black p-7 text-white shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <div>
                <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-white/15 px-2.5 text-[11px] font-bold uppercase tracking-wider text-white">
                  <Newspaper size={12} aria-hidden="true" />
                  경매 인사이트
                </span>
                <h3 className="mt-5 text-2xl font-black tracking-tight leading-tight">
                  {news.frontmatter.title}
                </h3>
                {news.frontmatter.subtitle && (
                  <p className="mt-3 text-sm leading-6 text-white/85">
                    {news.frontmatter.subtitle}
                  </p>
                )}
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs font-semibold text-white/70">
                  {formatKoreanDate(news.frontmatter.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-bold">
                  읽기
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
