import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/fade-up";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ManagedImage } from "@/components/marketing/managed-image";
import { getGalleryImagePool, resolveManagedImage } from "@/lib/public-content";
import { resolveSlotOr } from "@/lib/site-images";
import { restaurantSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ballu's Café",
  description:
    "Artisan brews, Himalayan cuisine, and panoramic mountain views at Ballu's Café in Manali.",
};

const MENU_CATEGORIES = [
  { title: "Brews", items: ["Single-origin pour-over", "Masala chai", "Hot chocolate", "Loose-leaf teas"] },
  { title: "Breakfast", items: ["Himalayan millet porridge", "Egg-any-style", "French toast", "Seasonal fruits"] },
  { title: "Himalayan Plates", items: ["Trout thali", "Siddu with red chutney", "Chhurpi pasta", "Kadhi chawal"] },
  { title: "Desserts", items: ["Apple crumble", "Honey-walnut cake", "Kheer", "Hot chocolate pudding"] },
];

export default async function CafePage() {
  const galleryPool = await getGalleryImagePool();
  const heroImage = await resolveSlotOr(
    "cafe.hero",
    resolveManagedImage(null, galleryPool, ["cafe", "food", "property"])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema()) }}
      />

      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage src={heroImage} alt="Ballu's Café" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/40 to-[#0B1B22]/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">Ballu&apos;s Café</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl mb-5">
              Slow mornings,<br />mountain coffee
            </h1>
            <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl max-w-2xl">
              A handcrafted wooden café in the snow-kissed valley.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp>
            <p className="text-xl text-[#0B1B22]/80 leading-relaxed text-center max-w-3xl mx-auto">
              A premium handcrafted wooden café nestled in the snow-kissed valley. Sip artisan
              brews, savor Himalayan cuisine, and soak in panoramic views of the mountains
              and the Beas. Open from dawn to bonfire evenings.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#FBF8F1] py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading eyebrow="The Menu" headline="What we serve" dark={false} />
          <StaggerGroup className="mt-16 grid md:grid-cols-2 gap-12">
            {MENU_CATEGORIES.map((cat) => (
              <StaggerItem key={cat.title}>
                <h3 className="heading-serif text-3xl text-[#0B1B22] mb-6 pb-3 border-b border-[#C9A24B]/30">
                  {cat.title}
                </h3>
                <ul className="space-y-3">
                  {cat.items.map((item, i) => (
                    <li key={i} className="text-[#0B1B22]/80 flex items-center gap-3">
                      <span className="w-4 h-px bg-[#C9A24B]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-[#0B1B22] text-[#F5EFE3] py-24">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <FadeUp>
            <Clock className="w-6 h-6 text-[#C9A24B] mb-4" />
            <h3 className="heading-serif text-2xl mb-3">Hours</h3>
            <p className="text-[#F5EFE3]/70">
              Open daily<br />
              7:00 AM – 11:00 PM
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <MapPin className="w-6 h-6 text-[#C9A24B] mb-4" />
            <h3 className="heading-serif text-2xl mb-3">Location</h3>
            <p className="text-[#F5EFE3]/70">
              At Ballu&apos;s Resort<br />
              14 Mile Road, Beas Riverside, Manali
            </p>
          </FadeUp>
        </div>

        <div className="max-w-4xl mx-auto px-6 mt-16 text-center">
          <FadeUp>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A24B] text-[#0B1B22] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#E5C97A] transition-colors"
            >
              Reserve a Table <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
