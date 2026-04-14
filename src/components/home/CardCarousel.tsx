import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/common/PropertyCard";
import { getAllAnalysisPosts } from "@/lib/content";

/**
 * 가로 스와이프 캐러셀.
 * - 네이티브 overflow-x-auto + snap-x. JS 라이브러리 무의존.
 * - 카드 최소 폭 고정 → 3-5개 동시 노출, 스크롤로 나머지 탐색.
 * - 모바일: one-at-a-time snap, 데스크탑: free-flow with snap hints.
 */
export function CardCarousel() {
  const posts = getAllAnalysisPosts().slice(0, 8);
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="carousel-heading"
      className="border-t border-[var(--color-border)] bg-white"
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-20 sm:px-6 sm:pt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
              무료 물건분석
            </p>
            <h2
              id="carousel-heading"
              className="mt-2 text-3xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-4xl"
            >
              숫자로 판단하는 최신 경매 물건
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-[var(--color-ink-500)]">
              감정가·최저가·권리관계·시세·수익 시뮬까지. 7섹션 무료 분석을
              읽고 바로 입찰 대리를 신청할 수 있습니다.
            </p>
          </div>
          <Link
            href="/analysis"
            className="hidden items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 sm:inline-flex"
          >
            전체 보기
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-10 pb-20 sm:pb-24">
        <div
          className="mx-auto w-full max-w-6xl overflow-x-auto scroll-px-4 snap-x snap-mandatory px-4 sm:scroll-px-6 sm:snap-proximity sm:px-6"
          role="region"
          aria-label="물건분석 캐러셀"
          tabIndex={0}
        >
          <ul className="flex gap-5">
            {posts.map((p) => (
              <li
                key={p.frontmatter.slug}
                className="snap-start"
                style={{ minWidth: "320px", maxWidth: "340px" }}
              >
                <PropertyCard frontmatter={p.frontmatter} />
              </li>
            ))}
            {/* 말단 안내 카드 */}
            <li
              className="flex snap-start items-center"
              style={{ minWidth: "260px" }}
            >
              <Link
                href="/analysis"
                className="flex h-full w-full flex-col items-start justify-center rounded-[var(--radius-xl)] border-2 border-dashed border-brand-200 bg-brand-50 p-6 text-brand-700 transition hover:border-brand-600 hover:bg-brand-100"
              >
                <span className="text-xs font-bold uppercase tracking-wider">
                  더 많은 분석
                </span>
                <span className="mt-2 text-lg font-black">
                  전체 물건 목록 보기
                </span>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold">
                  이동 <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
