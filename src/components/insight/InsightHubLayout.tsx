"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ALL_CAT_SLUGS,
  INSIGHT_MOCK_POSTS,
  INSIGHT_PAGE_SIZE,
  categoryLabel,
  formatDate,
  getEditorsPick,
  isAnalysisSub,
  sortedPosts,
  type InsightMockPost,
  type NavSelection,
} from "@/lib/insightMock";
import { InsightHero } from "@/components/insight/InsightHero";
import { InsightCategoryNav } from "@/components/insight/InsightCategoryNav";
import { Thumbnail } from "@/components/insight/Thumbnail";
import { ArrowRightIcon, ChevronRightIcon } from "@/components/insight/icons";

/* work-012 정정 3 — /insight orchestrator.
 * Hero(고정 paradigm / Editor's Pick 카드) + 카테고리 nav(가운데 정렬 + sub nav)
 *   + 1-col 콘텐츠 list + 페이지네이션(10건/페이지).
 * 카테고리 클릭 = ?cat= / 페이지 = ?page= / mock 진입 = "준비 중" toast.
 * carousel 라이브러리 미사용 / 신규 npm 0 / INSIGHT 색 토큰 0 / chip 패턴 0 / 아이콘 라이브러리 미사용. */

const TOAST_MSG = "준비 중입니다. 콘텐츠가 곧 공개됩니다.";

function buildUrl(cat: NavSelection, page: number): string {
  const params = new URLSearchParams();
  if (cat !== "all") params.set("cat", cat);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/insight?${qs}` : "/insight";
}

export function InsightHubLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listRef = useRef<HTMLElement>(null);

  const rawCat = searchParams.get("cat") ?? "all";
  const active: NavSelection = ALL_CAT_SLUGS.has(rawCat)
    ? (rawCat as NavSelection)
    : "all";

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const scrollToList = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const editorsPick = useMemo(() => getEditorsPick(), []);

  const filteredPosts = useMemo(() => {
    if (active === "all") return INSIGHT_MOCK_POSTS;
    if (active === "analysis") {
      return INSIGHT_MOCK_POSTS.filter((p) => isAnalysisSub(p.category));
    }
    return INSIGHT_MOCK_POSTS.filter((p) => p.category === active);
  }, [active]);

  const sorted = useMemo(() => sortedPosts(filteredPosts), [filteredPosts]);
  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / INSIGHT_PAGE_SIZE));

  const rawPage = Number(searchParams.get("page")) || 1;
  const page = Math.min(Math.max(1, rawPage), totalPages);

  const pagePosts = sorted.slice(
    (page - 1) * INSIGHT_PAGE_SIZE,
    page * INSIGHT_PAGE_SIZE
  );

  const selectCategory = useCallback(
    (next: NavSelection) => {
      router.push(buildUrl(next, 1), { scroll: false });
    },
    [router]
  );

  const selectPage = useCallback(
    (next: number) => {
      router.push(buildUrl(active, next), { scroll: false });
      scrollToList();
    },
    [router, active, scrollToList]
  );

  const sectionTitle =
    active === "all" ? "전체 인사이트" : categoryLabel(active);

  return (
    <main className="flex flex-1 flex-col">
      <InsightHero
        editorsPick={editorsPick}
        onCardClick={() => showToast(TOAST_MSG)}
      />

      <InsightCategoryNav active={active} onSelect={selectCategory} />

      <section ref={listRef} className="scroll-mt-20 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-12 lg:py-16">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[22px] font-extrabold tracking-[-0.01em] text-[#111418] lg:text-[28px]">
              {sectionTitle}
            </h2>
            <p className="text-[13px] font-semibold text-[var(--color-ink-500)] lg:text-[14px]">
              총{" "}
              <strong className="tabular-nums text-[#111418]">
                {totalCount}
              </strong>
              건
            </p>
          </div>

          {/* 콘텐츠 list = 1-col 세로 list. */}
          {pagePosts.length > 0 ? (
            <ul className="mt-8 flex flex-col divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {pagePosts.map((post) => (
                <li key={post.id}>
                  <PostRow post={post} onClick={() => showToast(TOAST_MSG)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-12 text-center text-[14px] text-[var(--color-ink-500)]">
              아직 콘텐츠가 없습니다.
            </p>
          )}

          {/* 페이지네이션 (10건/페이지 / 페이지 번호 단독 / 무한 scroll·더 보기 0). */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1.5">
              <PageButton
                label="이전"
                disabled={page === 1}
                onClick={() => selectPage(page - 1)}
                direction="prev"
              />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => selectPage(n)}
                  aria-label={`${n}페이지`}
                  aria-current={n === page ? "page" : undefined}
                  className={
                    "h-9 min-w-9 rounded-lg px-2 text-[14px] font-bold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45 focus-visible:ring-offset-2 " +
                    (n === page
                      ? "bg-[var(--brand-green)] text-white"
                      : "text-[var(--color-ink-500)] hover:bg-[var(--color-surface-muted)] hover:text-[#111418]")
                  }
                >
                  {n}
                </button>
              ))}
              <PageButton
                label="다음"
                disabled={page === totalPages}
                onClick={() => selectPage(page + 1)}
                direction="next"
              />
            </div>
          )}
        </div>
      </section>

      {/* mock 진입 toast ("준비 중"). */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#111418] px-5 py-3 text-[14px] font-semibold text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function PageButton({
  label,
  disabled,
  onClick,
  direction,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  direction: "prev" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${label} 페이지`}
      className="flex h-9 items-center gap-0.5 rounded-lg px-2.5 text-[13px] font-bold text-[var(--color-ink-500)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[#111418] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-[var(--color-ink-500)]"
    >
      {direction === "prev" && (
        <ChevronRightIcon size={15} className="rotate-180" />
      )}
      {label}
      {direction === "next" && <ChevronRightIcon size={15} />}
    </button>
  );
}

function PostRow({
  post,
  onClick,
}: {
  post: InsightMockPost;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45 focus-visible:ring-offset-2 lg:gap-5 lg:py-5"
    >
      <Thumbnail category={post.category} />
      <div className="flex flex-1 flex-col gap-1.5">
        <span className="text-[12px] font-bold text-[var(--brand-green)]">
          {categoryLabel(post.category)}
        </span>
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[#111418] group-hover:underline lg:text-[17px]">
          {post.title}
        </h3>
        <p className="line-clamp-1 text-[13px] text-[var(--color-ink-500)] lg:text-[14px]">
          {post.preview}
        </p>
        <span className="text-[12px] font-medium text-[var(--color-ink-500)]">
          {formatDate(post.publishedAt)}
        </span>
      </div>
      <ArrowRightIcon
        size={18}
        className="shrink-0 text-[var(--color-ink-500)] transition-all group-hover:translate-x-1 group-hover:text-[var(--brand-green)]"
      />
    </button>
  );
}
