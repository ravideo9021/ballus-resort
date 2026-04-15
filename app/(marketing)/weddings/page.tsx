import type { Metadata } from "next";
import { Heart, MountainSnow, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/fade-up";
import { SectionHeading } from "@/components/marketing/section-heading";
import { InquiryForm } from "@/components/marketing/inquiry-form";
import { ManagedImage } from "@/components/marketing/managed-image";
import { getGalleryImagePool, resolveManagedImage } from "@/lib/public-content";
import { resolveSlotOr } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Destination Weddings",
  description:
    "Plan your dream destination wedding in the Himalayas at Ballu's Resort, Manali. Riverside venues, mountain views, personal service.",
};

const REASONS = [
  { icon: MountainSnow, title: "Breathtaking backdrops", desc: "Mountain peaks and riverside lawns make every photo unforgettable." },
  { icon: Heart, title: "Intimate &amp; grand", desc: "Venues for 30 to 300+ — from small ceremonies to grand celebrations." },
  { icon: Sparkles, title: "Personal service", desc: "Dedicated wedding coordinator from first visit to final farewell." },
  { icon: Users, title: "On-site accommodation", desc: "Your guests stay with you — no scattered logistics, just one place." },
];

const VENUES = [
  {
    name: "Bliss Valley Lawn",
    capacity: "200+ guests",
    desc: "Our signature open-air lawn — mountain backdrop, riverside breeze.",
  },
  {
    name: "Devbhumi Banquet",
    capacity: "150+ guests",
    desc: "Grand outdoor banquet space with panoramic valley views.",
  },
  {
    name: "Namaste Banquet",
    capacity: "110+ guests",
    desc: "Elegant indoor venue perfect for intimate ceremonies.",
  },
];

const INCLUSIONS = [
  "Dedicated wedding coordinator",
  "Guest accommodation packages",
  "In-house catering &amp; multi-cuisine menus",
  "Stage, lighting &amp; sound setup",
  "Customized decor partnerships",
  "Mehendi, Sangeet, &amp; Pheras — all on property",
  "Ample parking &amp; shuttle coordination",
  "Bonfire &amp; DJ evening arrangements",
];

export default async function WeddingsPage() {
  const galleryPool = await getGalleryImagePool();
  const [heroImage, devbhumiImage, namasteImage] = await Promise.all([
    resolveSlotOr(
      "weddings.hero",
      resolveManagedImage(null, galleryPool, [
        "weddings",
        "wedding",
        "events",
        "property",
      ])
    ),
    resolveSlotOr(
      "banquets.devbhumi.hero",
      resolveManagedImage(null, galleryPool, [
        "devbhumi",
        "banquets",
        "weddings",
        "events",
      ])
    ),
    resolveSlotOr(
      "banquets.namaste.hero",
      resolveManagedImage(null, galleryPool, [
        "namaste",
        "banquets",
        "weddings",
        "events",
      ])
    ),
  ]);

  const venueImages: Record<string, string | null> = {
    "Bliss Valley Lawn": resolveManagedImage(null, galleryPool, [
      "bliss",
      "weddings",
      "events",
      "lawn",
    ]),
    "Devbhumi Banquet": devbhumiImage,
    "Namaste Banquet": namasteImage,
  };

  return (
    <>
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage src={heroImage} alt="Destination wedding at Ballu's Resort" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/40 to-[#0B1B22]/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">Destination Weddings</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-8xl mb-6">
              Where vows echo<br />through mountains
            </h1>
            <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl max-w-2xl">
              Mountain peaks. River breezes. Memories that last forever.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Reasons */}
      <section className="bg-[#F5EFE3] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Why Ballu's" headline="A setting unlike any other" dark={false} />
          <StaggerGroup className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {REASONS.map((r, i) => (
              <StaggerItem key={i}>
                <div className="text-center">
                  <r.icon className="w-8 h-8 text-[#C9A24B] mx-auto mb-5" />
                  <h3 className="heading-serif text-xl text-[#0B1B22] mb-3">{r.title}</h3>
                  <p className="text-sm text-[#0B1B22]/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: r.desc }} />
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Venues */}
      <section className="bg-[#0B1B22] text-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Venues" headline="Three stages, one valley" />
          <StaggerGroup className="mt-16 grid md:grid-cols-3 gap-6">
            {VENUES.map((v, i) => (
              <StaggerItem key={i}>
                <div className="group">
                  <div className="relative aspect-[4/5] overflow-hidden mb-5">
                    <ManagedImage
                      src={venueImages[v.name]}
                      alt={v.name}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="eyebrow mb-2">{v.capacity}</p>
                  <h3 className="heading-serif text-2xl mb-2">{v.name}</h3>
                  <p className="text-sm text-[#F5EFE3]/70">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Inclusions */}
      <section className="bg-[#0F3B47] text-[#F5EFE3] py-24">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp>
            <p className="eyebrow mb-5 text-center">What&rsquo;s Included</p>
            <h2 className="heading-display text-4xl md:text-5xl text-center mb-12">A complete wedding, crafted for you</h2>
          </FadeUp>
          <StaggerGroup className="grid sm:grid-cols-2 gap-5">
            {INCLUSIONS.map((item, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A24B] flex-shrink-0 mt-0.5" />
                  <span className="text-[#F5EFE3]/90" dangerouslySetInnerHTML={{ __html: item }} />
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="bg-[#0B1B22] text-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="eyebrow mb-5">Start Planning</p>
              <h2 className="heading-display text-4xl md:text-6xl">Begin your wedding journey</h2>
            </div>
            <InquiryForm defaultType="wedding" showHeading={false} />
          </FadeUp>
        </div>
      </section>
    </>
  );
}
