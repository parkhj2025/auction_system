import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllGuidePosts, getGuideBySlug } from "@/lib/content";
import { PostLayout } from "@/components/common/PostLayout";

export const dynamicParams = false;

const DIFFICULTY_LABEL = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "실전",
} as const;

export async function generateStaticParams() {
  return getAllGuidePosts().map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getGuideBySlug(slug);
  if (!post || post.frontmatter.status !== "published") {
    return { title: "가이드를 찾을 수 없습니다" };
  }
  const fm = post.frontmatter;
  return {
    title: fm.title,
    description: fm.subtitle ?? "",
    openGraph: {
      title: fm.title,
      description: fm.subtitle ?? "",
      type: "article",
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt,
    },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getGuideBySlug(slug);
  if (!post || post.frontmatter.status !== "published") notFound();
  const fm = post.frontmatter;

  const badges = [DIFFICULTY_LABEL[fm.difficulty], ...fm.tags.slice(0, 3)];

  return (
    <PostLayout
      collection="guide"
      collectionLabel="경매가이드"
      collectionHref="/guide"
      title={fm.title}
      subtitle={fm.subtitle}
      date={fm.publishedAt}
      updatedAt={fm.updatedAt}
      badges={badges}
      body={post.content}
    />
  );
}
