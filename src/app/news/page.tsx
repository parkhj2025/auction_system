import type { Metadata } from "next";
import { getAllNewsPosts } from "@/lib/content";
import { ContentCard } from "@/components/common/ContentCard";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = {
  title: "경매 인사이트",
  description:
    "인천지방법원 경매 시황 · 낙찰가율 동향 · 지역별 이슈. 매주 업데이트되는 경매 시장 인사이트.",
};

const REGION_LABEL: Record<string, string> = {
  incheon: "인천",
  suwon: "수원",
  daejeon: "대전",
  busan: "부산",
  daegu: "대구",
};

export default async function NewsListPage() {
  const posts = getAllNewsPosts();

  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            경매 인사이트
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl">
            시장이 움직이는 방향을 숫자로
          </h1>
          <p className="mt-3 max-w-2xl text-[length:var(--text-body)] leading-7 text-[var(--color-ink-500)]">
            주간 낙찰가율, 유형별 경쟁률, 눈에 띄는 낙찰 사례를 정리합니다.
            입찰가를 결정하기 전에 시장 분위기를 먼저 확인하세요.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-semibold text-[var(--color-ink-500)]">
          총{" "}
          <strong className="tabular-nums text-[var(--color-ink-900)]">
            {posts.length}
          </strong>
          건
        </p>

        {posts.length === 0 ? (
          <EmptyState
            title="아직 발행된 인사이트가 없습니다"
            description="다음 주에 첫 글을 발행합니다."
            ctaHref="/analysis"
            ctaLabel="물건분석 보러가기"
          />
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => {
              const fm = p.frontmatter;
              const regionMeta = fm.region
                ? (REGION_LABEL[fm.region] ?? fm.region)
                : undefined;
              return (
                <li key={fm.slug}>
                  <ContentCard
                    href={`/news/${fm.slug}`}
                    eyebrow="인사이트"
                    title={fm.title}
                    subtitle={fm.subtitle}
                    date={fm.publishedAt}
                    meta={regionMeta}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
