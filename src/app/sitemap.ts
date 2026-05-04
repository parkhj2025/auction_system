import type { MetadataRoute } from "next";
import {
  getAllAnalysisPosts,
  getAllGuidePosts,
  getAllNewsPosts,
  getAllNoticePosts,
} from "@/lib/content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

/**
 * 동적 · 정적 라우트를 모두 포함하는 sitemap.
 * 환경변수 NEXT_PUBLIC_SITE_URL이 설정되지 않은 경우 placeholder 도메인 사용.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/insight`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/analysis`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/apply`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/apply/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/notice`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/service`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const analysisRoutes: MetadataRoute.Sitemap = getAllAnalysisPosts().map((p) => ({
    url: `${BASE_URL}/analysis/${p.frontmatter.slug}`,
    lastModified: new Date(p.frontmatter.updatedAt ?? p.frontmatter.publishedAt),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const guideRoutes: MetadataRoute.Sitemap = getAllGuidePosts().map((p) => ({
    url: `${BASE_URL}/guide/${p.frontmatter.slug}`,
    lastModified: new Date(p.frontmatter.updatedAt ?? p.frontmatter.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const newsRoutes: MetadataRoute.Sitemap = getAllNewsPosts().map((p) => ({
    url: `${BASE_URL}/news/${p.frontmatter.slug}`,
    lastModified: new Date(p.frontmatter.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const noticeRoutes: MetadataRoute.Sitemap = getAllNoticePosts().map((p) => ({
    url: `${BASE_URL}/notice/${p.frontmatter.slug}`,
    lastModified: new Date(p.frontmatter.publishedAt),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    ...staticRoutes,
    ...analysisRoutes,
    ...guideRoutes,
    ...newsRoutes,
    ...noticeRoutes,
  ];
}
