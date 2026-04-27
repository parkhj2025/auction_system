import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/common/PropertyCard";
import type { AnalysisPost } from "@/types/content";

export function RelatedCards({ posts }: { posts: AnalysisPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-20"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)]">
            함께 보면 좋은
          </p>
          <h2
            id="related-heading"
            className="mt-2 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl"
          >
            관련 물건분석
          </h2>
        </div>
        <Link
          href="/analysis"
          className="hidden items-center gap-1 text-sm font-bold text-[var(--color-ink-900)] hover:text-black sm:inline-flex"
        >
          전체 보기
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.frontmatter.slug}>
            <PropertyCard frontmatter={p.frontmatter} />
          </li>
        ))}
      </ul>
    </section>
  );
}
