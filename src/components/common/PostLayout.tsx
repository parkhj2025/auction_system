import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { buildAnalysisMdxComponents } from "@/components/analysis/mdx-components";
import { formatKoreanDate } from "@/lib/utils";

/**
 * guide / news / notice 공용 상세 레이아웃.
 * - breadcrumb + hero + MDX 본문 + 목록 복귀 링크
 * - MDX 오버라이드는 analysis의 components를 "edu" 카테고리로 재사용
 *   (이미지 폴백 그라디언트가 블루로 통일되고, h2/h3/table/p 스타일은 동일)
 */
export async function PostLayout({
  collection,
  collectionLabel,
  collectionHref,
  title,
  subtitle,
  date,
  updatedAt,
  badges,
  body,
}: {
  collection: "guide" | "news" | "notice";
  collectionLabel: string;
  collectionHref: string;
  title: string;
  subtitle?: string;
  date: string;
  updatedAt?: string;
  badges?: string[];
  body: string;
}) {
  const components = buildAnalysisMdxComponents();
  void collection; // reserved for future per-collection tweaks

  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs font-semibold text-[var(--color-ink-500)]"
          >
            <Link href="/" className="hover:text-[var(--color-ink-900)]">
              홈
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <Link
              href={collectionHref}
              className="hover:text-[var(--color-ink-900)]"
            >
              {collectionLabel}
            </Link>
          </nav>

          <p className="mt-5 text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            {collectionLabel}
          </p>
          <h1 className="mt-2 text-h2 font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-h1">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-[length:var(--text-body)] leading-7 text-[var(--color-ink-500)] sm:text-lg sm:leading-8">
              {subtitle}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[var(--color-ink-500)]">
            <span className="tabular-nums">{formatKoreanDate(date)}</span>
            {updatedAt && updatedAt !== date && (
              <span className="tabular-nums">
                (수정 {formatKoreanDate(updatedAt)})
              </span>
            )}
            {badges && badges.length > 0 && (
              <span className="ml-2 flex flex-wrap gap-1.5">
                {badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex h-6 items-center rounded-full border border-[var(--color-border)] bg-white px-2.5 text-[11px] font-bold text-[var(--color-ink-700)]"
                  >
                    {b}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
        <article className="min-w-0">
          <MDXRemote
            source={body}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </article>

        <div className="mt-16 border-t border-[var(--color-border)] pt-8">
          <Link
            href={collectionHref}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink-900)] hover:text-black"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {collectionLabel} 전체 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
