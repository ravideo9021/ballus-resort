import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  Wifi,
  Coffee,
  Tv,
  Wind,
  Mountain,
  Waves,
  Car,
  Utensils,
} from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { ManagedImage } from "@/components/marketing/managed-image";
import {
  extractTextContent,
  RichContent,
} from "@/components/marketing/rich-content";
import {
  getGalleryImagePool,
  getPublicSuiteBySlug,
  getPublicSuites,
  pickImagesByCategory,
  resolveManagedImage,
} from "@/lib/public-content";
import { resolveSlotOr, type SiteSlotKey } from "@/lib/site-images";

type Params = Promise<{ slug: string }>;

const SUITE_SLOT: Record<string, SiteSlotKey> = {
  "himalayan-suites": "suites.himalayan.hero",
  "beas-suites": "suites.beas.hero",
};

function getAmenityIcon(label: string) {
  const value = label.toLowerCase();
  if (value.includes("mountain")) return Mountain;
  if (value.includes("river") || value.includes("beas")) return Waves;
  if (value.includes("wifi") || value.includes("wi-fi")) return Wifi;
  if (value.includes("coffee") || value.includes("tea")) return Coffee;
  if (value.includes("tv")) return Tv;
  if (value.includes("heat") || value.includes("ac")) return Wind;
  if (value.includes("park")) return Car;
  return Utensils;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const [suite, galleryPool] = await Promise.all([
    getPublicSuiteBySlug(slug),
    getGalleryImagePool(),
  ]);
  if (!suite) return { title: "Suite" };

  const slotKey = SUITE_SLOT[slug];
  const galleryFallback = resolveManagedImage(
    suite.managedImages[0]?.url,
    galleryPool,
    [slug, "suite", "cabins", "stays"]
  );
  const heroImage = slotKey
    ? await resolveSlotOr(slotKey, galleryFallback)
    : galleryFallback;

  const description =
    extractTextContent(suite.description).slice(0, 160) ||
    `${suite.title} at Ballu's Resort.`;

  return {
    title: suite.title,
    description,
    openGraph: {
      images: heroImage ? [{ url: heroImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const suites = await getPublicSuites();
  return suites.map((suite) => ({ slug: suite.slug }));
}

export default async function SuitePage({ params }: { params: Params }) {
  const { slug } = await params;
  const [suite, galleryPool] = await Promise.all([
    getPublicSuiteBySlug(slug),
    getGalleryImagePool(),
  ]);

  if (!suite) return notFound();

  const slotKey = SUITE_SLOT[slug];
  const galleryFallback = resolveManagedImage(
    suite.managedImages[0]?.url,
    galleryPool,
    [slug, "suite", "cabins", "stays"]
  );
  const heroImage = slotKey
    ? await resolveSlotOr(slotKey, galleryFallback)
    : galleryFallback;

  const galleryImages = suite.managedImages.length
    ? suite.managedImages
    : pickImagesByCategory(galleryPool, 4, [slug, "suite", "cabins", "stays"]);

  const amenities =
    Array.isArray(suite.amenities) && suite.amenities.length
      ? suite.amenities
      : ["Premium Stay", "Room Service", "Parking"];

  return (
    <>
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage
          src={heroImage}
          alt={suite.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/40 to-[#0B1B22]/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">{suite.viewType}</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl">
              {suite.title}
            </h1>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#0B1B22] text-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp>
            <RichContent content={suite.description} />
          </FadeUp>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-20">
          <FadeUp>
            <h2 className="heading-display text-3xl md:text-4xl mb-10 text-center">
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {amenities.map((amenity, i) => {
                const Icon = getAmenityIcon(amenity);
                return (
                  <div
                    key={`${amenity}-${i}`}
                    className="flex flex-col items-center text-center p-6 border border-white/10 hover:border-[#C9A24B] transition-colors"
                  >
                    <Icon className="w-6 h-6 text-[#C9A24B] mb-3" />
                    <span className="text-sm text-[#F5EFE3]/80">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </FadeUp>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-24">
          <FadeUp>
            <h2 className="heading-display text-3xl md:text-4xl mb-10 text-center">
              Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {galleryImages.map((image, i) => (
                <div key={`${image.url}-${i}`} className="relative aspect-square overflow-hidden group">
                  <ManagedImage
                    src={image.url}
                    alt={image.alt || `${suite.title} ${i + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        <div className="max-w-3xl mx-auto px-6 mt-24 text-center">
          <FadeUp>
            <h2 className="heading-display text-3xl md:text-4xl mb-6">
              Ready to experience {suite.title}?
            </h2>
            <p className="text-[#F5EFE3]/70 mb-8">
              Send us an inquiry and we&rsquo;ll craft a stay tailored to you.
            </p>
            <Link
              href={`/contact?venue=${encodeURIComponent(suite.title)}`}
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#C9A24B] text-[#0B1B22] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#E5C97A] transition-colors"
            >
              Inquire About This Suite <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
