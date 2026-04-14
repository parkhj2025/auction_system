import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllNewsPosts, getNewsBySlug } from "@/lib/content";
import { PostLayout } from "@/components/common/PostLayout";

export const dynamicParams = false;

const REGION_LABEL: Record<string, string> = {
  incheon: "인천",
  suwon: "수원",
  daejeon: "대전",
  busan: "부산",
  daegu: "대구",
};

export async function generateStaticParams() {
  return getAllNewsPosts().map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post || post.frontmatter.status !== "published") {
    return { title: "인사이트를 찾을 수 없습니다" };
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
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post || post.frontmatter.status !== "published") notFound();
  const fm = post.frontmatter;

  const badges = fm.region ? [REGION_LABEL[fm.region] ?? fm.region] : undefined;

  return (
    <PostLayout
      collection="news"
      collectionLabel="경매 인사이트"
      collectionHref="/news"
      title={fm.title}
      subtitle={fm.subtitle}
      date={fm.publishedAt}
      badges={badges}
      body={post.content}
    />
  );
}
