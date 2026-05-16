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
import type { InsightLeafSlug, InsightPostStats } from "@/lib/insightMock";

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
 *  단계 2.5 (work-012) — /insight reader 연결 paradigm
 *  paradigm: mock 폐기 + 실 content/{analysis,guide,data}/ reader 호출 통합
 *  매핑: propertyType (한국어) → InsightLeafSlug (영문) 자동 매핑
 *  Hero 호환: analysis 안 stats 산출 (round/appraisal/minPrice/percent 사실 source)
 * ════════════════════════════════════════════════════════════════════════════ */

/* propertyType (한국어 enum) → InsightLeafSlug (영문 enum) 매핑.
 *  PROPERTY_TYPE_VALID (analysis publish CLI 정합 사실): 아파트·다세대주택·빌라·
 *  오피스텔·단독주택·토지·상가·공장·기타. ANALYSIS_SUB (insightMock 정합):
 *  apartment·officetel·villa·house·dagagu·dasedae·store·etc. */
const ANALYSIS_PROPERTY_TYPE_TO_INSIGHT_SLUG: Record<string, InsightLeafSlug> = {
  "아파트": "apartment",
  "오피스텔": "officetel",
  "빌라": "villa",
  "다세대주택": "dasedae",
  "다가구주택": "dagagu",
  "단독주택": "house",
  "상가": "store",
  "토지": "etc",
  "공장": "etc",
  "기타": "etc",
};

export function mapAnalysisToInsightSlug(propertyType: string): InsightLeafSlug {
  return ANALYSIS_PROPERTY_TYPE_TO_INSIGHT_SLUG[propertyType] ?? "etc";
}

/* /insight 카드 통합 데이터. mock 폐기 사후 InsightMockPost 대체 paradigm. */
export type InsightCardData = {
  id: string;
  insightSlug: InsightLeafSlug;
  title: string;
  preview: string;
  publishedAt: string;
  href: string;
  /* Hero Live Data Panel 호환 (analysis 단독 산출 / guide+data 부재 정합). */
  stats?: InsightPostStats;
};

/* analysis frontmatter 안 round/appraisal/minPrice/percent 사실 source → InsightPostStats 산출.
 *  단계별 가격 = 감정가 + (round-1) 단계 (회차별 70% 가정 paradigm / 단순 추정).
 *  사후 사이클 안 marketData 또는 별개 stats 산출 paradigm 결정 의뢰 영역. */
function buildAnalysisStats(
  appraisal: number,
  minPrice: number,
  round: number,
  percent: number
): InsightPostStats | undefined {
  if (!appraisal || !minPrice || !round || round < 1) return undefined;
  const stages: number[] = [appraisal];
  for (let i = 1; i < round; i++) {
    const r = round === 1 ? minPrice : appraisal - ((appraisal - minPrice) * i) / Math.max(1, round - 1);
    stages.push(Math.round(r));
  }
  if (stages[stages.length - 1] !== minPrice) {
    stages[stages.length - 1] = minPrice;
  }
  return {
    appraisedPrice: appraisal,
    minimumPrice: minPrice,
    failureCount: Math.max(0, round - 1),
    stagePrices: stages,
    appraisedRatio: percent,
  };
}

/* 통합 reader. analysis + guide + data 광역 + publishedAt desc 정렬. */
export function getAllInsightCards(): InsightCardData[] {
  const analysis: InsightCardData[] = getAllAnalysisPosts().map((p) => ({
    id: `analysis:${p.frontmatter.slug}`,
    insightSlug: mapAnalysisToInsightSlug(p.frontmatter.propertyType),
    title: p.frontmatter.title,
    preview: p.frontmatter.summary ?? "",
    publishedAt: p.frontmatter.publishedAt,
    href: `/analysis/${p.frontmatter.slug}`,
    stats: buildAnalysisStats(
      p.frontmatter.appraisal,
      p.frontmatter.minPrice,
      p.frontmatter.round,
      p.frontmatter.percent
    ),
  }));
  const guides: InsightCardData[] = getAllGuidePosts().map((p) => ({
    id: `guide:${p.frontmatter.slug}`,
    insightSlug: "guide" as InsightLeafSlug,
    title: p.frontmatter.title,
    preview: p.frontmatter.subtitle ?? "",
    publishedAt: p.frontmatter.publishedAt,
    href: `/guide/${p.frontmatter.slug}`,
  }));
  const data: InsightCardData[] = getAllDataPosts().map((p) => ({
    id: `data:${p.frontmatter.slug}`,
    insightSlug: "data" as InsightLeafSlug,
    title: p.frontmatter.title,
    preview: p.frontmatter.subtitle ?? "",
    publishedAt: p.frontmatter.publishedAt,
    href: `/data/${p.frontmatter.slug}`,
  }));
  return [...analysis, ...guides, ...data].sort((a, b) =>
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
