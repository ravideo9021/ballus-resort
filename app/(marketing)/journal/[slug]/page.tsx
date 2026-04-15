import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { ManagedImage } from "@/components/marketing/managed-image";
import {
  extractTextContent,
  RichContent,
} from "@/components/marketing/rich-content";
import { blogPostSchema } from "@/lib/seo";
import {
  getGalleryImagePool,
  getPublishedPostBySlug,
  getPublishedPosts,
  resolveManagedImage,
} from "@/lib/public-content";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [post, galleryPool] = await Promise.all([
    getPublishedPostBySlug(slug),
    getGalleryImagePool(),
  ]);

  if (!post) return { title: "Post" };

  const coverImage = resolveManagedImage(post.managedCoverImageUrl, galleryPool, [
    "journal",
    "blog",
  ]);
  const excerpt =
    post.excerpt || extractTextContent(post.body).slice(0, 160) || undefined;

  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      type: "article",
      images: coverImage ? [{ url: coverImage }] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function JournalPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [post, galleryPool] = await Promise.all([
    getPublishedPostBySlug(slug),
    getGalleryImagePool(),
  ]);

  if (!post) return notFound();

  const coverImage = resolveManagedImage(post.managedCoverImageUrl, galleryPool, [
    "journal",
    "blog",
  ]);
  const excerpt =
    post.excerpt ||
    extractTextContent(post.body).slice(0, 240) ||
    "Read the latest note from Ballu's journal.";
  const publishedAt = post.publishedAt || post.createdAt;
  const publishedLabel = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            blogPostSchema({
              title: post.title,
              excerpt,
              slug,
              coverImageUrl: coverImage || undefined,
              publishedAt: publishedAt || undefined,
            })
          ),
        }}
      />

      <section className="relative h-[60vh] min-h-[450px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage src={coverImage} alt={post.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/40 to-[#0B1B22]/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">
              {publishedLabel}
              {publishedLabel ? " · " : ""}
              Journal
            </p>
            <h1 className="heading-display text-[#F5EFE3] text-4xl md:text-6xl max-w-3xl">
              {post.title}
            </h1>
          </FadeUp>
        </div>
      </section>

      <article className="bg-[#F5EFE3] py-24">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            <p className="text-xl text-[#0B1B22]/80 leading-relaxed mb-12 heading-serif italic">
              {excerpt}
            </p>
            <RichContent content={post.body} />
          </FadeUp>

          <FadeUp delay={0.2} className="mt-16 pt-10 border-t border-[#0B1B22]/10">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 text-[#1A6B7A] text-xs uppercase tracking-[0.25em] hover:text-[#C9A24B] transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Journal
            </Link>
          </FadeUp>
        </div>
      </article>
    </>
  );
}
