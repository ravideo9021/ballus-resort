import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ManagedImage } from "@/components/marketing/managed-image";
import { getGalleryImagePool, resolveManagedImage } from "@/lib/public-content";
import { resolveSlotOr } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Banquet Halls",
  description:
    "Namaste Banquet (110+ indoor) and Devbhumi Banquet (grand outdoor) at Ballu's Resort, Manali.",
};

const HALLS = [
  {
    name: "Namaste Banquet",
    type: "Indoor",
    capacity: "110+ guests",
    desc: "Elegant, climate-controlled indoor venue with wood accents, warm lighting, and a configurable layout. Perfect for intimate weddings, receptions, and corporate gatherings.",
    features: ["Climate controlled", "Dedicated bar setup", "Stage &amp; sound system", "Vegetarian &amp; non-vegetarian kitchens"],
  },
  {
    name: "Devbhumi Banquet",
    type: "Outdoor",
    capacity: "150+ guests",
    desc: "Grand outdoor banquet space framed by mountains and river. Covered for weather protection, it's the showpiece venue for larger celebrations.",
    features: ["Weather-protected canopy", "Panoramic valley views", "Large stage setup", "Evening bonfire zone"],
  },
];

export default async function BanquetsPage() {
  const galleryPool = await getGalleryImagePool();
  const [heroImage, namasteImage, devbhumiImage] = await Promise.all([
    resolveSlotOr(
      "banquets.hero",
      resolveManagedImage(null, galleryPool, ["banquets", "events", "property"])
    ),
    resolveSlotOr(
      "banquets.namaste.hero",
      resolveManagedImage(null, galleryPool, [
        "namaste",
        "banquets",
        "events",
        "indoor",
      ])
    ),
    resolveSlotOr(
      "banquets.devbhumi.hero",
      resolveManagedImage(null, galleryPool, [
        "devbhumi",
        "banquets",
        "events",
        "outdoor",
        "weddings",
      ])
    ),
  ]);

  const hallImages: Record<string, string | null> = {
    "Namaste Banquet": namasteImage,
    "Devbhumi Banquet": devbhumiImage,
  };

  return (
    <>
      <section className="relative h-[60vh] min-h-[450px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage src={heroImage} alt="Banquet halls at Ballu's Resort" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/40 to-[#0B1B22]/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">Banquet Halls</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl">
              Two halls,<br />one unforgettable evening
            </h1>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Our Venues"
            headline="Choose your setting"
            subhead="Each space with its own character — indoors or under the mountain sky."
            dark={false}
          />

          <div className="mt-20 space-y-24">
            {HALLS.map((hall, i) => (
              <FadeUp key={hall.name}>
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <ManagedImage src={hallImages[hall.name]} alt={hall.name} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                  </div>
                  <div>
                    <p className="eyebrow mb-3">{hall.type} &middot; {hall.capacity}</p>
                    <h2 className="heading-display text-4xl md:text-5xl text-[#0B1B22] mb-6">{hall.name}</h2>
                    <p className="text-[#0B1B22]/70 text-lg leading-relaxed mb-6">{hall.desc}</p>
                    <ul className="space-y-2 mb-8">
                      {hall.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-3 text-[#0B1B22]/80">
                          <span className="w-5 h-px bg-[#C9A24B]" />
                          <span dangerouslySetInnerHTML={{ __html: f }} />
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F3B47] text-[#F5EFE3] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#C9A24B] hover:text-[#0B1B22] transition-colors"
                    >
                      Inquire About {hall.name.split(" ")[0]} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0B1B22] text-[#F5EFE3] py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            <p className="eyebrow mb-5">Plus, the Bliss Valley Lawn</p>
            <h2 className="heading-display text-4xl md:text-5xl mb-6">Open-air celebrations under the Himalayas</h2>
            <p className="text-[#F5EFE3]/70 text-lg mb-8">
              Our signature open-air lawn is perfect for daytime ceremonies, cocktail
              evenings, and sunset receptions.
            </p>
            <Link
              href="/weddings"
              className="inline-flex items-center gap-2 text-[#C9A24B] text-xs uppercase tracking-[0.25em] border-b border-[#C9A24B]/50 pb-1 hover:border-[#C9A24B] transition-colors"
            >
              Explore Weddings <ArrowRight className="w-3 h-3" />
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
