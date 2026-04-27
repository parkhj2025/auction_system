import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuidePosts } from "@/lib/content";
import { ContentCard } from "@/components/common/ContentCard";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "경매가이드",
  description:
    "경매가 처음이신 분부터 실전 입찰까지. 권리분석 · 시세 산정 · 입찰가 결정 · 명도 절차를 단계별로 설명합니다.",
};

type Search = {
  difficulty?: string;
};

type Difficulty = "beginner" | "intermediate" | "advanced";

const CHIPS: { value: "all" | Difficulty; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "beginner", label: "입문" },
  { value: "intermediate", label: "중급" },
  { value: "advanced", label: "실전" },
];

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "실전",
};

function buildHref(difficulty: string): string {
  return difficulty === "all" ? "/guide" : `/guide?difficulty=${difficulty}`;
}

export default async function GuideListPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const active = (params.difficulty ?? "all").toLowerCase();
  const all = getAllGuidePosts();
  const filtered =
    active === "all"
      ? all
      : all.filter((p) => p.frontmatter.difficulty === active);

  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            경매가이드
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl">
            입문부터 실전까지 단계별로
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-ink-500)]">
            경매의 기본 개념부터 권리분석, 시세 산정, 입찰가 결정, 명도
            절차까지. 난이도에 맞춰 필요한 글을 골라 읽으세요.
          </p>
        </div>
      </section>

      <section
        aria-label="난이도 필터"
        className="sticky top-16 z-20 border-b border-[var(--color-border)] bg-white/95 backdrop-blur"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
          <nav aria-label="난이도" className="flex flex-wrap gap-2">
            {CHIPS.map((chip) => {
              const isActive = active === chip.value;
              return (
                <Link
                  key={chip.value}
                  href={buildHref(chip.value)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 min-w-[56px] items-center justify-center rounded-full border px-4 text-sm font-bold transition",
                    isActive
                      ? "border-[var(--color-ink-900)] bg-[var(--color-ink-900)] text-white"
                      : "border-[var(--color-border)] bg-white text-[var(--color-ink-700)] hover:border-[var(--color-ink-300)] hover:text-black"
                  )}
                >
                  {chip.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-[var(--color-ink-500)]">
          총{" "}
          <strong className="tabular-nums text-[var(--color-ink-900)]">
            {filtered.length}
          </strong>
          건
        </p>

        {filtered.length === 0 ? (
          <EmptyState
            title="이 난이도의 가이드가 아직 없습니다"
            description="다른 난이도의 글을 확인해보세요."
            ctaHref="/guide"
            ctaLabel="전체 가이드 보기"
          />
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <li key={p.frontmatter.slug}>
                <ContentCard
                  href={`/guide/${p.frontmatter.slug}`}
                  eyebrow="가이드"
                  title={p.frontmatter.title}
                  subtitle={p.frontmatter.subtitle}
                  date={p.frontmatter.publishedAt}
                  meta={DIFFICULTY_LABEL[p.frontmatter.difficulty]}
                  tags={p.frontmatter.tags}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
