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
import { ContentComplianceNotice } from "@/components/analysis/ContentComplianceNotice";
// PhotoGalleryStrip — 룰 15-D 폐기 (Hero HeroGallery 가 전체 사진 grid + Lightbox 일원화)
import { buildAnalysisMdxComponents } from "@/components/analysis/mdx-components";
import { GatingWrapper } from "@/components/analysis/GatingWrapper";
import { remarkAnalysisBlocks } from "@/lib/remark/analysis-blocks";
import { BRAND_NAME } from "@/lib/constants";

// 단계 3-5-fix: 한글 slug 호환 — dynamicParams=true 로 변경.
// generateStaticParams 가 만든 paths 는 SSG, 그 외는 SSR + getAnalysisBySlug
// 매칭 실패 시 notFound() 로 404. 한글 인코딩 dev 환경 호환.
export const dynamicParams = true;

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export async function generateStaticParams() {
  // 단계 3-5-fix: NFC 정규화 — URL 디코딩 결과(NFC)와 매칭되도록 SSG path 등록.
  return getAllAnalysisPosts().map((p) => ({
    slug: p.frontmatter.slug.normalize("NFC"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = safeDecode(rawSlug);
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
  const { slug: rawSlug } = await params;
  // 단계 3-5-fix: Next.js 16 dynamic route 가 percent-encoded slug 를 그대로 전달.
  // 한글 slug 호환 위해 명시적으로 decodeURIComponent.
  const slug = safeDecode(rawSlug);
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

            {/* 본문(07 종합 의견) 직후 — 산문 1단락 컴플라이언스 (단계 4-1) */}
            <ContentComplianceNotice />

            {/* 룰 15-D (단계 5-4-2-fix-5): 페이지 맨 아래 별도 사진 grid 폐기.
             * Hero 영역의 HeroGallery 가 전체 사진 grid + Lightbox 일원화. */}

            <TrustBlock />
            <ApplyCTA fm={fm} />
            <RelatedCards posts={related} />
          </article>

          <DetailSidebar fm={fm} />
        </div>
      </section>
    </main>
  );
}
