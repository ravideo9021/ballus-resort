import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { ManagedImage } from "@/components/marketing/managed-image";
import { getGalleryImagePool, getPageRecord, resolveManagedImage } from "@/lib/public-content";
import { extractTextContent } from "@/components/marketing/rich-content";
import { resolveSlotOr } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Discover the story behind Ballu's Resort & Café — a riverside sanctuary in the Beas Valley, Manali.",
};

export default async function StoryPage() {
  const [galleryPool, page] = await Promise.all([
    getGalleryImagePool(),
    getPageRecord("story"),
  ]);
  const cmsBody = page?.body ? extractTextContent(page.body) : null;
  const heroImage = await resolveSlotOr(
    "story.hero",
    resolveManagedImage(null, galleryPool, ["story", "property", "resort"])
  );

  return (
    <>
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage
          src={heroImage}
          alt="Ballu's Resort property"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/40 to-[#0B1B22]/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">Our Story</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl">
              The story of Ballu&apos;s
            </h1>
          </FadeUp>
        </div>
      </section>

      <article className="bg-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            {cmsBody ? (
              <div
                className="prose prose-lg prose-resort max-w-none"
                dangerouslySetInnerHTML={{ __html: cmsBody }}
              />
            ) : (
              <div className="prose prose-lg prose-resort max-w-none">
                <p className="text-xl text-[#0B1B22]/80 leading-relaxed">
                  Nestled along the pristine banks of the Beas River, at the 14th milestone on
                  the road to Manali, Ballu&apos;s Resort &amp; Café began as a dream — a quiet place
                  where the rhythm of the river meets the stillness of the Himalayas.
                </p>

                <blockquote className="my-12 border-l-2 border-[#C9A24B] pl-6">
                  <p className="heading-serif italic text-3xl text-[#C9A24B]">
                    A rare river &amp; mountain combination — the finest address in the Beas Valley.
                  </p>
                </blockquote>

                <p className="text-[#0B1B22]/80 leading-relaxed">
                  What started as a family retreat has grown into one of the valley&apos;s most
                  cherished addresses. Every corner of the property has been designed with
                  intention — from the handcrafted wooden café that catches the morning light
                  to the riverside cabins that wake to birdsong and mountain mist.
                </p>

                <p className="text-[#0B1B22]/80 leading-relaxed">
                  We believe that hospitality is personal. It&apos;s in the warmth of a greeting,
                  the care behind a meal, the quiet attention to detail that turns a stay into
                  a memory. At Ballu&apos;s, every guest is family, every visit is a homecoming.
                </p>

                <p className="text-[#0B1B22]/80 leading-relaxed">
                  Today, Ballu&apos;s Resort &amp; Café is more than an accommodation — it&apos;s a
                  destination. A place for celebration, reflection, and discovery. Whether
                  you&apos;re here for a quiet weekend, a grand wedding, or simply a cup of mountain
                  coffee, you&apos;ll find something rare: a place that feels truly yours.
                </p>
              </div>
            )}
          </FadeUp>

          <FadeUp delay={0.3} className="mt-16 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F3B47] text-[#F5EFE3] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#C9A24B] hover:text-[#0B1B22] transition-colors"
            >
              Visit Ballu&apos;s <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </article>
    </>
  );
}
