import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllNoticePosts } from "@/lib/content";
import { EmptyState } from "@/components/common/EmptyState";
import { formatKoreanDate } from "@/lib/utils";
import { BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "공지사항",
  description: `${BRAND_NAME} 서비스 공지, 정책 변경, 서비스 지역 확대 안내 등 공식 공지사항을 확인하실 수 있습니다.`,
};

export default async function NoticeListPage() {
  const posts = getAllNoticePosts();

  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs font-semibold text-[var(--color-ink-500)]"
          >
            <Link href="/" className="hover:text-[var(--color-ink-900)]">
              홈
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="text-[var(--color-ink-700)]">공지사항</span>
          </nav>
          <p className="mt-5 text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            공지사항
          </p>
          <h1 className="mt-2 text-h2 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h1">
            {BRAND_NAME} 공식 공지
          </h1>
          <p className="mt-3 text-[length:var(--text-body)] leading-7 text-[var(--color-ink-500)]">
            서비스 변경, 수수료 정책, 지역 확대 등 중요한 사항을 안내합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        {posts.length === 0 ? (
          <EmptyState
            title="아직 공지가 없습니다"
            description="첫 공지사항을 준비 중입니다."
          />
        ) : (
          <ul className="flex flex-col divide-y divide-[var(--color-border)] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white">
            {posts.map((p) => {
              const fm = p.frontmatter;
              return (
                <li key={fm.slug} className="group">
                  <Link
                    href={`/notice/${fm.slug}`}
                    className="flex items-center gap-4 px-6 py-5 transition hover:bg-[var(--color-surface-muted)]"
                  >
                    <div className="flex-1">
                      <p className="text-[length:var(--text-body)] font-bold text-[var(--color-ink-900)] group-hover:text-black">
                        {fm.title}
                      </p>
                    </div>
                    <time
                      dateTime={fm.publishedAt}
                      className="text-xs font-semibold tabular-nums text-[var(--color-ink-500)]"
                    >
                      {formatKoreanDate(fm.publishedAt)}
                    </time>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
