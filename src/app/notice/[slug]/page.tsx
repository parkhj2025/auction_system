import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllNoticePosts, getNoticeBySlug } from "@/lib/content";
import { PostLayout } from "@/components/common/PostLayout";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllNoticePosts().map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getNoticeBySlug(slug);
  if (!post) return { title: "공지를 찾을 수 없습니다" };
  return {
    title: post.frontmatter.title,
    openGraph: {
      title: post.frontmatter.title,
      type: "article",
      publishedTime: post.frontmatter.publishedAt,
    },
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNoticeBySlug(slug);
  if (!post) notFound();

  return (
    <PostLayout
      collection="notice"
      collectionLabel="공지사항"
      collectionHref="/notice"
      title={post.frontmatter.title}
      date={post.frontmatter.publishedAt}
      body={post.content}
    />
  );
}
