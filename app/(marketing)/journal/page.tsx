import Link from "next/link";
import type { Metadata } from "next";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/fade-up";
import { ManagedImage } from "@/components/marketing/managed-image";
import { extractTextContent } from "@/components/marketing/rich-content";
import {
  getGalleryImagePool,
  getPublishedPosts,
  resolveManagedImage,
} from "@/lib/public-content";
import { resolveSlotOr } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Travel notes, seasonal guides, and stories from the Beas Valley — the Ballu's Resort journal.",
};

export default async function JournalPage() {
  const [posts, galleryPool] = await Promise.all([
    getPublishedPosts(),
    getGalleryImagePool(),
  ]);

  const heroImage = await resolveSlotOr(
    "journal.hero",
    resolveManagedImage(null, galleryPool, ["journal", "blog", "property"])
  );

  const displayPosts = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt:
      post.excerpt ||
      extractTextContent(post.body).slice(0, 170) ||
      "Read the latest note from Ballu's journal.",
    date: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "",
    img: resolveManagedImage(post.managedCoverImageUrl, galleryPool, [
      "journal",
      "blog",
    ]),
  }));

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage src={heroImage} alt="Journal" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-[#0B1B22]/70" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">The Journal</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl mb-4">
              Notes from the valley
            </h1>
            <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl max-w-2xl">
              Travel guides, stories, and seasonal whispers from Ballu&apos;s.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5EFE3] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayPosts.map((post) => (
              <StaggerItem key={post.slug}>
                <Link href={`/journal/${post.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden mb-5">
                    <ManagedImage src={post.img} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A24B] mb-3">{post.date}</p>
                  <h2 className="heading-serif text-2xl text-[#0B1B22] mb-2 group-hover:text-[#1A6B7A] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[#0B1B22]/70 leading-relaxed">{post.excerpt}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  );
}
