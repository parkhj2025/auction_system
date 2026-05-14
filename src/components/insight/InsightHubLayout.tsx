"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ALL_CAT_SLUGS,
  INSIGHT_MOCK_POSTS,
  categoryLabel,
  getEditorsPick,
  iconPath,
  isAnalysisSub,
  sortedPosts,
  type InsightMockPost,
  type InsightSlideCta,
  type NavSelection,
} from "@/lib/insightMock";
import { InsightHero } from "@/components/insight/InsightHero";
import { InsightCategoryNav } from "@/components/insight/InsightCategoryNav";
import { ArrowRightIcon } from "@/components/insight/icons";

/* work-012 정정 2 — /insight orchestrator.
 * Hero(Liquid Glass 박스) + 카테고리 nav(5 + sub nav) + 1-col 콘텐츠 list + Editor's Pick.
 * 카테고리 클릭 = ?cat= 쿼리 (별개 page 진입 0) / mock 진입 = "준비 중" toast.
 * carousel 라이브러리 미사용 / 신규 npm 0 / INSIGHT 색 토큰 0 / chip 패턴 0 / 아이콘 라이브러리 미사용. */

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/* 썸네일 placeholder (120×80 / gray + 카테고리 Gemini PNG). */
function Thumbnail({
  category,
  large,
}: {
  category: string;
  large?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--color-ink-100)] " +
        (large
          ? "aspect-[16/9] w-full lg:aspect-auto lg:h-[200px] lg:w-[320px]"
          : "h-[80px] w-[120px]")
      }
    >
      <Image
        src={iconPath(category)}
        alt=""
        width={large ? 200 : 120}
        height={large ? 200 : 120}
        className={large ? "h-[78%] w-auto object-contain" : "h-[78%] w-auto object-contain"}
      />
    </div>
  );
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

  const selectCategory = useCallback(
    (next: NavSelection) => {
      const target = next === "all" ? "/insight" : `/insight?cat=${next}`;
      router.push(target, { scroll: false });
    },
    [router]
  );

  const onHeroCta = useCallback(
    (cta: InsightSlideCta) => {
      if (cta === "scroll-list") {
        scrollToList();
      } else if (cta === "featured") {
        showToast("준비 중입니다. 콘텐츠가 곧 공개됩니다.");
      } else if (cta === "cat-glossary") {
        selectCategory("glossary");
        scrollToList();
      }
    },
    [scrollToList, showToast, selectCategory]
  );

  const editorsPick = useMemo(() => getEditorsPick(), []);

  const filteredPosts = useMemo(() => {
    if (active === "all") return INSIGHT_MOCK_POSTS;
    if (active === "analysis") {
      return INSIGHT_MOCK_POSTS.filter((p) => isAnalysisSub(p.category));
    }
    return INSIGHT_MOCK_POSTS.filter((p) => p.category === active);
  }, [active]);

  const listPosts = useMemo(() => {
    const base =
      active === "all"
        ? filteredPosts.filter((p) => p.id !== editorsPick.id)
        : filteredPosts;
    return sortedPosts(base);
  }, [active, filteredPosts, editorsPick.id]);

  const totalCount = filteredPosts.length;
  const sectionTitle =
    active === "all" ? "전체 인사이트" : categoryLabel(active);

  return (
    <main className="flex flex-1 flex-col">
      <InsightHero onCta={onHeroCta} />

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

          {/* Editor's Pick (전체 보기 시 단독 / featured:true article). */}
          {active === "all" && (
            <button
              type="button"
              onClick={() =>
                showToast("준비 중입니다. 콘텐츠가 곧 공개됩니다.")
              }
              className="group mt-7 flex w-full flex-col gap-5 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-4 text-left transition-colors hover:border-[var(--brand-green)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45 focus-visible:ring-offset-2 lg:flex-row lg:items-center lg:gap-7 lg:p-6"
            >
              <Thumbnail category={editorsPick.category} large />
              <div className="flex flex-1 flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[var(--brand-green)] px-2.5 py-1 text-[11px] font-bold text-white">
                    Editor&apos;s Pick
                  </span>
                  <span className="text-[12px] font-semibold text-[var(--color-ink-500)] lg:text-[13px]">
                    {categoryLabel(editorsPick.category)}
                  </span>
                </div>
                <h3 className="text-[20px] font-extrabold leading-snug tracking-[-0.01em] text-[#111418] lg:text-[26px]">
                  {editorsPick.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-[var(--color-ink-500)] lg:text-[16px]">
                  {editorsPick.preview}
                </p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <span className="text-[12px] font-medium text-[var(--color-ink-500)] lg:text-[13px]">
                    {formatDate(editorsPick.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[var(--brand-green)]">
                    자세히 보기
                    <ArrowRightIcon
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </div>
            </button>
          )}

          {/* 콘텐츠 list = 1-col 세로 list (정정 영역 3 보존). */}
          {listPosts.length > 0 ? (
            <ul className="mt-8 flex flex-col divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {listPosts.map((post) => (
                <li key={post.id}>
                  <PostRow
                    post={post}
                    onClick={() =>
                      showToast("준비 중입니다. 콘텐츠가 곧 공개됩니다.")
                    }
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-12 text-center text-[14px] text-[var(--color-ink-500)]">
              아직 콘텐츠가 없습니다.
            </p>
          )}
        </div>
      </section>

      {/* mock 진입 toast (정정 영역 5 / "준비 중"). */}
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
