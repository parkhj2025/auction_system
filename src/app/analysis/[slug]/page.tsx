import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  getAllAnalysisPosts,
  getAnalysisBySlug,
  getRelatedAnalysis,
} from "@/lib/content";
import { DetailHero } from "@/components/analysis/DetailHero";
import { DetailSidebar } from "@/components/analysis/DetailSidebar";
import { ApplyCTA } from "@/components/analysis/ApplyCTA";
import { RelatedCards } from "@/components/analysis/RelatedCards";
import { buildAnalysisMdxComponents } from "@/components/analysis/mdx-components";
import { GatingWrapper } from "@/components/analysis/GatingWrapper";
import { BRAND_NAME } from "@/lib/constants";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllAnalysisPosts().map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getAnalysisBySlug(slug);
  if (!post || post.frontmatter.status !== "published") {
    return { title: "물건분석을 찾을 수 없습니다" };
  }
  const fm = post.frontmatter;
  const description = fm.summary ?? fm.subtitle ?? "";
  return {
    title: fm.title,
    description,
    keywords: fm.seoTags,
    openGraph: {
      title: fm.title,
      description,
      type: "article",
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt,
      images: fm.coverImage ? [{ url: fm.coverImage }] : undefined,
    },
  };
}

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getAnalysisBySlug(slug);
  if (!post || post.frontmatter.status !== "published") notFound();

  const fm = post.frontmatter;
  const related = getRelatedAnalysis(slug, 3);
  const components = buildAnalysisMdxComponents(fm.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.summary,
    datePublished: fm.publishedAt,
    dateModified: fm.updatedAt,
    author: {
      "@type": "Organization",
      name: BRAND_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
    },
    about: {
      "@type": "Thing",
      name: `${fm.court} ${fm.caseNumber}`,
    },
    keywords: fm.seoTags?.join(", "),
  };

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <DetailHero fm={fm} />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            {/* MDX 본문만 게이팅 대상. ApplyCTA/RelatedCards는 전환 경로 보호 목적으로
                게이팅 영역 밖에 유지 (CLAUDE.md 판단기준 ① 전환 경로 유지). */}
            <GatingWrapper slug={slug}>
              <MDXRemote
                source={post.content}
                components={components}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                  },
                }}
              />
            </GatingWrapper>

            <ApplyCTA fm={fm} />
            <RelatedCards posts={related} />
          </article>

          <DetailSidebar fm={fm} />
        </div>
      </section>
    </main>
  );
}
