import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getAllAnalysisPosts } from "@/lib/content";
import { PropertyCard } from "@/components/common/PropertyCard";
import type { AnalysisPost } from "@/types/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "무료 물건분석",
  description:
    "인천지방법원 경매 물건을 7섹션 구조로 무료 분석합니다. 권리분석 · 시세비교 · 수익 시뮬레이션까지 숫자로 판단.",
};

// v2: 카테고리 필터 폐기 (원칙 5 — 내부 분류 라벨 비노출). 검색·정렬만 유지.
type Search = {
  q?: string;
  sort?: string;
};

const SORT_OPTIONS: { value: "latest" | "bid"; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "bid", label: "임박한 입찰일" },
];

function buildHref(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v !== "all") sp.set(k, v);
  }
  const qs = sp.toString();
  return qs ? `/analysis?${qs}` : "/analysis";
}

function filterAndSort(posts: AnalysisPost[], params: Search): AnalysisPost[] {
  const q = (params.q ?? "").trim().toLowerCase();
  const sort = (params.sort ?? "latest").toLowerCase();

  let out = posts;
  if (q) {
    out = out.filter((p) => {
      const fm = p.frontmatter;
      const hay = [
        fm.title,
        fm.subtitle ?? "",
        fm.summary ?? "",
        fm.address,
        fm.dong ?? "",
        fm.sigungu ?? "",
        fm.buildingName ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (sort === "bid") {
    out = [...out].sort((a, b) =>
      String(a.frontmatter.bidDate).localeCompare(
        String(b.frontmatter.bidDate)
      )
    );
  }
  // latest: getAllAnalysisPosts가 이미 publishedAt DESC 정렬
  return out;
}

export default async function AnalysisListPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const posts = getAllAnalysisPosts();
  const filtered = filterAndSort(posts, params);

  const activeSort = params.sort ?? "latest";
  const activeQ = params.q ?? "";

  return (
    <main className="flex flex-1 flex-col">
      {/* 섹션 헤더 */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)]">
            무료 물건분석
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl">
            숫자로 판단하는 경매 물건
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-ink-500)]">
            물건 개요부터 권리분석 · 시세비교 · 수익 시뮬레이션 · 매각사례까지.
            7섹션 구조로 모든 분석을 무료로 제공합니다.
          </p>
        </div>
      </section>

      {/* 필터 바 — v2: 검색·정렬만 (카테고리 칩 폐기, 원칙 5) */}
      <section
        aria-label="물건분석 필터"
        className="sticky top-16 z-20 border-b border-[var(--color-border)] bg-white/95 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* 검색 */}
            <form
              role="search"
              action="/analysis"
              method="get"
              className="flex h-10 items-center gap-0 overflow-hidden rounded-full border border-[var(--color-border)] bg-white pl-3 pr-1"
            >
              {activeSort !== "latest" && (
                <input type="hidden" name="sort" value={activeSort} />
              )}
              <Search
                size={16}
                className="text-[var(--color-ink-500)]"
                aria-hidden="true"
              />
              <label className="sr-only" htmlFor="analysis-search">
                주소 또는 단지명 검색
              </label>
              <input
                id="analysis-search"
                type="search"
                name="q"
                defaultValue={activeQ}
                placeholder="주소 · 단지명"
                className="h-full w-44 bg-transparent px-2 text-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
              />
              <button
                type="submit"
                className="h-8 rounded-full bg-[var(--color-ink-900)] px-3 text-xs font-bold text-white hover:bg-black"
              >
                검색
              </button>
            </form>

            {/* 정렬 */}
            <nav
              aria-label="정렬"
              className="flex gap-1 rounded-full border border-[var(--color-border)] bg-white p-1"
            >
              {SORT_OPTIONS.map((opt) => {
                const isActive = activeSort === opt.value;
                return (
                  <Link
                    key={opt.value}
                    href={buildHref({
                      q: activeQ || undefined,
                      sort: opt.value,
                    })}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex h-8 items-center rounded-full px-3 text-xs font-bold transition",
                      isActive
                        ? "bg-[var(--color-ink-900)] text-white"
                        : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
                    )}
                  >
                    {opt.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </section>

      {/* 결과 */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium text-[var(--color-ink-500)]">
            총{" "}
            <strong className="tabular-nums text-[var(--color-ink-900)]">
              {filtered.length}
            </strong>
            건
          </p>
          {(activeQ || activeSort !== "latest") && (
            <Link
              href="/analysis"
              className="text-xs font-bold text-[var(--color-ink-900)] hover:text-black"
            >
              필터 초기화
            </Link>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-16 text-center">
            <p className="text-base font-bold text-[var(--color-ink-900)]">
              조건에 맞는 물건분석이 없습니다
            </p>
            <p className="mt-2 text-sm text-[var(--color-ink-500)]">
              필터를 조정하거나, 전체 목록에서 다시 찾아보세요.
            </p>
            <Link
              href="/analysis"
              className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-5 text-sm font-bold text-white hover:bg-black"
            >
              전체 보기
            </Link>
          </div>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <li key={p.frontmatter.slug}>
                <PropertyCard frontmatter={p.frontmatter} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
