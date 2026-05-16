import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  AnalysisFrontmatter,
  AnalysisMeta,
  AnalysisPost,
  DataFrontmatter,
  DataPost,
  GuideFrontmatter,
  GuidePost,
  NewsFrontmatter,
  NewsPost,
  NoticeFrontmatter,
  NoticePost,
} from "@/types/content";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const DATE_FIELDS = ["publishedAt", "updatedAt", "bidDate", "dataDate"] as const;

function normalizeDates(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...data };
  for (const key of DATE_FIELDS) {
    const v = out[key];
    if (v instanceof Date) {
      out[key] = v.toISOString().slice(0, 10);
    }
  }
  if (out.marketData && typeof out.marketData === "object") {
    out.marketData = normalizeDates(out.marketData as Record<string, unknown>);
  }
  return out;
}

function readCollection<FM>(
  collection: "analysis" | "guide" | "news" | "data" | "notice"
): Array<{ frontmatter: FM; content: string }> {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const parsed = matter(raw);
      const normalized = normalizeDates(parsed.data as Record<string, unknown>);
      return { frontmatter: normalized as FM, content: parsed.content };
    });
}

function isPublished<T extends { status?: string }>(post: { frontmatter: T }) {
  return post.frontmatter.status === "published";
}

function sortByDateDesc<T extends { publishedAt: string }>(
  a: { frontmatter: T },
  b: { frontmatter: T }
) {
  return String(b.frontmatter.publishedAt).localeCompare(
    String(a.frontmatter.publishedAt)
  );
}

export function getAllAnalysisPosts(): AnalysisPost[] {
  return readCollection<AnalysisFrontmatter>("analysis")
    .filter((p) => p.frontmatter.marketData)
    .filter(isPublished)
    .sort(sortByDateDesc);
}

export function getAnalysisBySlug(slug: string): AnalysisPost | null {
  // 단계 3-5-fix: 한글 slug 호환 — NFC 정규화 후 비교.
  // URL 디코딩 결과와 mdx frontmatter 의 한글 인코딩이 NFC/NFD 로 다를 수 있음.
  const normalized = slug.normalize("NFC");
  return (
    readCollection<AnalysisFrontmatter>("analysis").find(
      (p) => p.frontmatter.slug.normalize("NFC") === normalized
    ) ?? null
  );
}

/**
 * 단계 3-3 — content/analysis/{slug}.meta.json 평탄화 데이터 로더.
 * publish CLI v3.6+ 가 mdx 와 함께 산출. 누락 시 null (컴포넌트 fallback).
 */
export function getAnalysisMeta(slug: string): AnalysisMeta | null {
  const p = path.join(CONTENT_ROOT, "analysis", `${slug}.meta.json`);
  if (!fs.existsSync(p)) return null;
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw) as AnalysisMeta;
  } catch {
    return null;
  }
}

/**
 * 같은 region + 같은 propertyType 우선. 부족하면 같은 region으로 보충.
 * 현재 포스트는 제외. published + marketData 보유 건만.
 */
export function getRelatedAnalysis(
  slug: string,
  limit = 3
): AnalysisPost[] {
  const all = getAllAnalysisPosts();
  const current = all.find((p) => p.frontmatter.slug === slug);
  if (!current) return [];
  const { region, propertyType } = current.frontmatter;

  const primary = all.filter(
    (p) =>
      p.frontmatter.slug !== slug &&
      p.frontmatter.region === region &&
      p.frontmatter.propertyType === propertyType
  );
  if (primary.length >= limit) return primary.slice(0, limit);

  const secondary = all.filter(
    (p) =>
      p.frontmatter.slug !== slug &&
      p.frontmatter.region === region &&
      !primary.some((x) => x.frontmatter.slug === p.frontmatter.slug)
  );
  return [...primary, ...secondary].slice(0, limit);
}

export function getAllGuidePosts(): GuidePost[] {
  return readCollection<GuideFrontmatter>("guide")
    .filter(isPublished)
    .sort(sortByDateDesc);
}

export function getGuideBySlug(slug: string): GuidePost | null {
  return (
    readCollection<GuideFrontmatter>("guide").find(
      (p) => p.frontmatter.slug === slug
    ) ?? null
  );
}

export function getAllNewsPosts(): NewsPost[] {
  return readCollection<NewsFrontmatter>("news")
    .filter(isPublished)
    .sort(sortByDateDesc);
}

export function getNewsBySlug(slug: string): NewsPost | null {
  return (
    readCollection<NewsFrontmatter>("news").find(
      (p) => p.frontmatter.slug === slug
    ) ?? null
  );
}

export function getAllDataPosts(): DataPost[] {
  return readCollection<DataFrontmatter>("data")
    .filter(isPublished)
    .sort(sortByDateDesc);
}

export function getDataBySlug(slug: string): DataPost | null {
  return (
    readCollection<DataFrontmatter>("data").find(
      (p) => p.frontmatter.slug === slug
    ) ?? null
  );
}

export function getAllNoticePosts(): NoticePost[] {
  return readCollection<NoticeFrontmatter>("notice")
    .filter(isPublished)
    .sort(sortByDateDesc);
}

export function getNoticeBySlug(slug: string): NoticePost | null {
  return (
    readCollection<NoticeFrontmatter>("notice").find(
      (p) => p.frontmatter.slug === slug
    ) ?? null
  );
}

/**
 * Phase 1.2 (A-1) — Hero 인라인 검색 input 사전 매칭 본질.
 * status="published" + marketData 보유 분석 글의 caseNumber 배열.
 * client component (HeroSearch)에 props 전달 → NFC 정규화 매칭 + 분기 redirect.
 */
export function getActiveCaseNumbers(): string[] {
  return getAllAnalysisPosts().map((p) => p.frontmatter.caseNumber);
}

/**
 * Phase 1.2 (A-1) — 메인 페이지 "경매 인사이트" 블록 본질.
 * analysis + guide + data 통합 + status="published" + publishedAt DESC.
 * chip 4건 navigator (무료 물건분석 / 경매 가이드 / 경매 빅데이터 / 경매 용어).
 * Cycle 8: news → data 광역 정정. 기존 content/news/ 콘텐츠는 /news/[slug] 라우트로만 접근 가능 (Hub 출력 제외).
 */
export type InsightChipKey = "analysis" | "guide" | "glossary" | "data";

export type InsightItem = {
  chip: InsightChipKey;
  chipLabel: string;
  slug: string;
  title: string;
  subtitle?: string;
  href: string;
  publishedAt: string;
};

/* ════════════════════════════════════════════════════════════════════════════
 *  /insight 제로베이스 재구축 (work-012)
 *  paradigm: 잡지 + 단일 컬럼 + 카드 분기 (미디어 카드 + 텍스트 카드)
 *  reader 통합: analysis + guide + news + data 광역 / notice 제외
 *  카테고리 분류 paradigm 영구 폐기 (InsightLeafSlug + mapAnalysisToInsightSlug 광역 폐기)
 *  Hero stats paradigm 영구 폐기 (buildAnalysisStats 폐기)
 *  카드 분기 트리거 = coverImage 사실 (정의 = 미디어 카드 / undefined = 텍스트 카드)
 * ════════════════════════════════════════════════════════════════════════════ */

export type InsightCardType = "analysis" | "guide" | "news" | "data";

const INSIGHT_TYPE_LABEL: Record<InsightCardType, string> = {
  analysis: "분석",
  guide: "가이드",
  news: "뉴스",
  data: "데이터",
};

export type InsightCardData = {
  id: string;
  type: InsightCardType;
  typeLabel: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  href: string;
  /* analysis 단독 사실 (frontmatter.coverImage 사실 source).
   *  undefined = 텍스트 카드 분기 트리거. */
  coverImage?: string;
};

/* 통합 reader. analysis + guide + news + data 광역 + publishedAt desc 정렬.
 *  notice 제외 (서비스 공지 = 콘텐츠 허브 부정합). */
export function getAllInsightCards(): InsightCardData[] {
  const analysis: InsightCardData[] = getAllAnalysisPosts().map((p) => ({
    id: `analysis:${p.frontmatter.slug}`,
    type: "analysis",
    typeLabel: INSIGHT_TYPE_LABEL.analysis,
    title: p.frontmatter.title,
    subtitle: p.frontmatter.summary ?? "",
    publishedAt: p.frontmatter.publishedAt,
    href: `/analysis/${p.frontmatter.slug}`,
    ...(p.frontmatter.coverImage ? { coverImage: p.frontmatter.coverImage } : {}),
  }));
  const guides: InsightCardData[] = getAllGuidePosts().map((p) => ({
    id: `guide:${p.frontmatter.slug}`,
    type: "guide",
    typeLabel: INSIGHT_TYPE_LABEL.guide,
    title: p.frontmatter.title,
    subtitle: p.frontmatter.subtitle ?? "",
    publishedAt: p.frontmatter.publishedAt,
    href: `/guide/${p.frontmatter.slug}`,
  }));
  const news: InsightCardData[] = getAllNewsPosts().map((p) => ({
    id: `news:${p.frontmatter.slug}`,
    type: "news",
    typeLabel: INSIGHT_TYPE_LABEL.news,
    title: p.frontmatter.title,
    subtitle: p.frontmatter.subtitle ?? "",
    publishedAt: p.frontmatter.publishedAt,
    href: `/news/${p.frontmatter.slug}`,
  }));
  const data: InsightCardData[] = getAllDataPosts().map((p) => ({
    id: `data:${p.frontmatter.slug}`,
    type: "data",
    typeLabel: INSIGHT_TYPE_LABEL.data,
    title: p.frontmatter.title,
    subtitle: p.frontmatter.subtitle ?? "",
    publishedAt: p.frontmatter.publishedAt,
    href: `/data/${p.frontmatter.slug}`,
  }));
  return [...analysis, ...guides, ...news, ...data].sort((a, b) =>
    String(b.publishedAt).localeCompare(String(a.publishedAt))
  );
}

export function getActiveInsightPosts(): InsightItem[] {
  const analysis: InsightItem[] = getAllAnalysisPosts().map((p) => ({
    chip: "analysis",
    chipLabel: "무료 물건분석",
    slug: p.frontmatter.slug,
    title: p.frontmatter.title,
    subtitle: p.frontmatter.subtitle,
    href: `/analysis/${p.frontmatter.slug}`,
    publishedAt: p.frontmatter.publishedAt,
  }));
  const guides: InsightItem[] = getAllGuidePosts().map((p) => ({
    chip: "guide",
    chipLabel: "경매 가이드",
    slug: p.frontmatter.slug,
    title: p.frontmatter.title,
    subtitle: p.frontmatter.subtitle,
    href: `/guide/${p.frontmatter.slug}`,
    publishedAt: p.frontmatter.publishedAt,
  }));
  const data: InsightItem[] = getAllDataPosts().map((p) => ({
    chip: "data",
    chipLabel: "경매 빅데이터",
    slug: p.frontmatter.slug,
    title: p.frontmatter.title,
    subtitle: p.frontmatter.subtitle,
    href: `/data/${p.frontmatter.slug}`,
    publishedAt: p.frontmatter.publishedAt,
  }));
  return [...analysis, ...guides, ...data].sort((a, b) =>
    String(b.publishedAt).localeCompare(String(a.publishedAt))
  );
}
