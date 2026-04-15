import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { ManagedImage } from "@/components/marketing/managed-image";
import { extractTextContent } from "@/components/marketing/rich-content";
import {
  getGalleryImagePool,
  getPublicSuites,
  resolveManagedImage,
} from "@/lib/public-content";
import { resolveSlotOr } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Stays & Suites",
  description:
    "Luxury mountain-view and riverside suites at Ballu's Resort, Manali. Wake to Himalayan peaks or the Beas River.",
};

export default async function StaysPage() {
  const [suites, galleryPool] = await Promise.all([
    getPublicSuites(),
    getGalleryImagePool(),
  ]);

  const cards = suites.length
    ? suites.map((suite) => ({
        slug: suite.slug,
        title: suite.title,
        viewType: suite.viewType,
        description:
          extractTextContent(suite.description).slice(0, 180) ||
          "A premium Himalayan stay experience at Ballu's Resort.",
        img: resolveManagedImage(suite.managedImages[0]?.url, galleryPool, [
          suite.slug,
          "suite",
          "cabins",
          "stays",
        ]),
      }))
    : [
        {
          slug: "",
          title: "Suites",
          viewType: "Premium Stay",
          description: "Suite details will appear once they are configured in admin.",
          img: resolveManagedImage(null, galleryPool, ["stays", "cabins", "property"]),
        },
      ];

  const heroImage = await resolveSlotOr(
    "stays.hero",
    cards[0]?.img ??
      resolveManagedImage(null, galleryPool, ["stays", "cabins", "property"])
  );

  return (
    <>
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage
          src={heroImage}
          alt="Ballu's Suites"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/40 to-[#0B1B22]/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">Suites &amp; Stays</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl mb-5">
              Two ways to wake
              <br />
              in the Himalayas
            </h1>
            <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl max-w-2xl">
              Mountain or river — both are yours to choose.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#0B1B22] text-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {cards.map((suite, i) => (
            <FadeUp key={suite.slug || i}>
              <div
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <Link
                  href={suite.slug ? `/stays/${suite.slug}` : "/stays"}
                  className="relative aspect-[4/5] block overflow-hidden group"
                >
                  <ManagedImage
                    src={suite.img}
                    alt={suite.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  />
                </Link>
                <div>
                  <p className="eyebrow mb-4">{suite.viewType}</p>
                  <h2 className="heading-display text-4xl md:text-6xl mb-6">
                    {suite.title}
                  </h2>
                  <p className="text-[#F5EFE3]/70 text-lg leading-relaxed mb-8">
                    {suite.description}
                  </p>
                  <Link
                    href={suite.slug ? `/stays/${suite.slug}` : "/contact"}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A24B] text-[#0B1B22] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#E5C97A] transition-colors"
                  >
                    View Suite <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </>
  );
}
