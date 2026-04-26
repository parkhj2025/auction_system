import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  getAllAnalysisPosts,
  getAnalysisBySlug,
  getAnalysisMeta,
  getRelatedAnalysis,
} from "@/lib/content";
import { DetailHero } from "@/components/analysis/DetailHero";
import { DetailSidebar } from "@/components/analysis/DetailSidebar";
import { TrustBlock } from "@/components/analysis/TrustBlock";
import { ApplyCTA } from "@/components/analysis/ApplyCTA";
import { RelatedCards } from "@/components/analysis/RelatedCards";
import { ComplianceFooter } from "@/components/analysis/ComplianceFooter";
import { PhotoGalleryStrip } from "@/components/analysis/PhotoGalleryStrip";
import { buildAnalysisMdxComponents } from "@/components/analysis/mdx-components";
import { GatingWrapper } from "@/components/analysis/GatingWrapper";
import { remarkAnalysisBlocks } from "@/lib/remark/analysis-blocks";
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
  const meta = getAnalysisMeta(slug); // null → 단계 3-1 baseline fallback
  const related = getRelatedAnalysis(slug, 3);
  const components = buildAnalysisMdxComponents(meta, fm);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.summary,
    datePublished: fm.publishedAt,
    dateModified: fm.updatedAt,
    author: { "@type": "Organization", name: BRAND_NAME },
    publisher: { "@type": "Organization", name: BRAND_NAME },
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
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0">
            <GatingWrapper slug={slug}>
              <MDXRemote
                source={post.content}
                components={components}
                options={{
                  mdxOptions: {
                    remarkPlugins: [
                      [remarkGfm, { singleTilde: false }],
                      remarkAnalysisBlocks,
                    ],
                  },
                }}
              />
            </GatingWrapper>

            {/* dedicated 갤러리 — 본문 끝 / Trust 위 (단계 3-1 mdx Img null 보존, Hero strip 보강) */}
            <PhotoGalleryStrip
              photos={meta?.photos}
              coverImage={fm.coverImage}
              alt={`${fm.buildingName ?? fm.title} 현장 사진`}
            />

            <TrustBlock />
            <ApplyCTA fm={fm} />
            <RelatedCards posts={related} />
            <ComplianceFooter />
          </article>

          <DetailSidebar fm={fm} />
        </div>
      </section>
    </main>
  );
}
