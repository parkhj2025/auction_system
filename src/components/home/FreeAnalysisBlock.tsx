import Link from "next/link";
import { ArrowRight, BookOpen, Newspaper } from "lucide-react";
import { PropertyCard } from "@/components/common/PropertyCard";
import {
  getAllAnalysisPosts,
  getAllGuidePosts,
  getAllNewsPosts,
} from "@/lib/content";
import { formatKoreanDate } from "@/lib/utils";

const DIFFICULTY_LABEL = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "실전",
} as const;

/* Phase 0.1 — Block 2: 무료 물건분석 진짜 통합본.
 * CardCarousel(물건 캐러셀) + ContentShowcase(가이드+뉴스 카드) 흡수.
 * 단일 section / 단일 헤더 / 두 row (① 물건 캐러셀 ② 콘텐츠 허브 카드 그리드). */
export function FreeAnalysisBlock() {
  const posts = getAllAnalysisPosts().slice(0, 8);
  const guides = getAllGuidePosts().slice(0, 2);
  const news = getAllNewsPosts().slice(0, 1)[0];
  if (posts.length === 0 && guides.length === 0 && !news) return null;

  return (
    <section
      aria-labelledby="free-analysis-heading"
      className="border-t border-[var(--color-border)] bg-white"
    >
      {/* 헤더 */}
      <div className="mx-auto w-full max-w-[var(--c-base)] px-5 pt-20 sm:px-8 sm:pt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-violet)]">
              무료 물건분석
            </p>
            <h2
              id="free-analysis-heading"
              className="mt-2 text-h1 font-black tracking-tight text-[var(--color-ink-900)]"
            >
              숫자로 판단하는 최신 경매 물건
            </h2>
            <p className="mt-3 max-w-xl text-body leading-relaxed text-[var(--color-ink-500)]">
              감정가·최저가·권리관계·시세·수익 시뮬까지. 7섹션 무료 분석을 읽고
              바로 입찰 대리를 신청할 수 있습니다.
            </p>
          </div>
          <Link
            href="/analysis"
            className="hidden items-center gap-1 text-sm font-bold text-[var(--color-ink-900)] hover:text-black sm:inline-flex"
          >
            전체 보기
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Row 1 — 물건 캐러셀 */}
      {posts.length > 0 && (
        <div className="mt-10">
          <div
            className="mx-auto w-full max-w-[var(--c-base)] overflow-x-auto scroll-px-5 snap-x snap-mandatory px-5 sm:scroll-px-8 sm:snap-proximity sm:px-8"
            role="region"
            aria-label="물건분석 캐러셀"
            tabIndex={0}
          >
            <ul className="flex gap-4">
              {posts.map((p) => (
                <li
                  key={p.frontmatter.slug}
                  className="snap-start"
                  style={{ minWidth: "320px", maxWidth: "340px" }}
                >
                  <PropertyCard frontmatter={p.frontmatter} />
                </li>
              ))}
              <li className="flex snap-start items-center" style={{ minWidth: "260px" }}>
                <Link
                  href="/analysis"
                  className="flex h-full w-full flex-col items-start justify-center rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--color-ink-200)] bg-[var(--color-ink-50)] p-6 text-[var(--color-ink-900)] transition hover:border-[var(--color-ink-900)] hover:bg-[var(--color-ink-100)]"
                >
                  <span className="text-xs font-bold uppercase tracking-wider">
                    더 많은 분석
                  </span>
                  <span className="mt-2 text-lg font-black">전체 물건 목록 보기</span>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold">
                    이동 <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Row 2 — 콘텐츠 허브 (가이드 + 뉴스). 같은 section 안 row. */}
      {(guides.length > 0 || news) && (
        <div className="mx-auto mt-16 w-full max-w-[var(--c-base)] px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="flex items-end justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
              읽고 나면 판단이 달라집니다
            </p>
            <Link
              href="/guide"
              className="hidden items-center gap-1 text-sm font-bold text-[var(--color-ink-900)] hover:text-black sm:inline-flex"
            >
              가이드 전체 보기
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="flex flex-col gap-4 lg:col-span-2">
              {guides.map((g) => (
                <Link
                  key={g.frontmatter.slug}
                  href={`/guide/${g.frontmatter.slug}`}
                  className="group flex items-start gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
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
                  <h3 className="mt-5 text-h3 font-black tracking-tight leading-tight">
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
      )}
    </section>
  );
}
