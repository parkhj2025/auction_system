import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  AnalysisFrontmatter,
  AnalysisMeta,
  AnalysisPost,
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
  collection: "analysis" | "guide" | "news" | "notice"
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
  return (
    readCollection<AnalysisFrontmatter>("analysis").find(
      (p) => p.frontmatter.slug === slug
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
