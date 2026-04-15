import type { Metadata } from "next";
import { FadeUp } from "@/components/motion/fade-up";
import { GalleryGrid } from "@/components/marketing/gallery-grid";
import { ManagedImage } from "@/components/marketing/managed-image";
import { getGalleryImagePool, resolveManagedImage } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore Ballu's Resort & Café in Manali through our gallery — property, cabins, café, weddings, and Himalayan landscapes.",
};

const CATEGORIES = ["Property", "Cabins", "Café", "Weddings", "Conferences", "Events", "Snow", "Monsoon"];

export default async function GalleryPage() {
  const images = (await getGalleryImagePool()).map((img) => ({
    ...img,
    category: img.category || "Property",
  }));

  const categories = Array.from(
    new Set(images.map((img) => img.category).filter(Boolean))
  );

  const heroImage = resolveManagedImage(null, images, [
    "property",
    "resort",
    "gallery",
  ]);

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage src={heroImage} alt="Ballu's Resort Gallery" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/40 to-[#0B1B22]/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">Gallery</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl">Moments at Ballu&apos;s</h1>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#0B1B22] text-[#F5EFE3] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <GalleryGrid images={images} categories={categories.length ? categories : CATEGORIES} />
        </div>
      </section>
    </>
  );
}
