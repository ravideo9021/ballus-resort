import type { Metadata } from "next";
import { Users, Monitor, Coffee, Car, Hotel, Wifi, CheckCircle2 } from "lucide-react";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/fade-up";
import { SectionHeading } from "@/components/marketing/section-heading";
import { InquiryForm } from "@/components/marketing/inquiry-form";
import { ManagedImage } from "@/components/marketing/managed-image";
import { getGalleryImagePool, resolveManagedImage } from "@/lib/public-content";
import { resolveSlotOr } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Conferences & Corporate Events",
  description:
    "Premium conference venue in Manali with 110+ capacity, AV setup, registration desk, and on-site accommodation.",
};

const FEATURES = [
  { icon: Users, title: "110+ Capacity", desc: "Flexible indoor &amp; outdoor venues for conferences and retreats." },
  { icon: Monitor, title: "Full AV Setup", desc: "Projectors, sound system, mics, and stage lighting on request." },
  { icon: Coffee, title: "In-house Catering", desc: "Multi-cuisine buffets, coffee breaks, and custom menus." },
  { icon: Hotel, title: "On-site Stay", desc: "Your delegates stay where the event is — no transfer logistics." },
  { icon: Car, title: "Ample Parking", desc: "Dedicated parking plus shuttle coordination for out-of-town guests." },
  { icon: Wifi, title: "Reliable Wi-Fi", desc: "High-speed connectivity throughout the property." },
];

const INCLUSIONS = [
  "Dedicated event coordinator",
  "Registration desk setup",
  "Stage, podium &amp; backdrop",
  "LED screens &amp; projectors",
  "Mineral water &amp; notepads",
  "Multi-course buffet meals",
  "Tea &amp; coffee breaks",
  "Team-building &amp; bonfire evenings",
];

export default async function ConferencesPage() {
  const galleryPool = await getGalleryImagePool();
  const heroImage = await resolveSlotOr(
    "conferences.hero",
    resolveManagedImage(null, galleryPool, [
      "conferences",
      "conference",
      "events",
      "banquets",
      "property",
    ])
  );

  return (
    <>
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage src={heroImage} alt="Conference venue at Ballu's Resort" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/40 to-[#0B1B22]/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">Conferences &amp; Corporate Events</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl mb-5">
              Your next offsite,<br />in the Himalayas
            </h1>
            <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl max-w-2xl">
              A conference venue as inspiring as the ideas it holds.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5EFE3] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Why Host at Ballu's" headline="Built for focused work &amp; genuine connection" dark={false} />
          <StaggerGroup className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {FEATURES.map((f, i) => (
              <StaggerItem key={i}>
                <div>
                  <f.icon className="w-7 h-7 text-[#C9A24B] mb-4" />
                  <h3 className="heading-serif text-xl text-[#0B1B22] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#0B1B22]/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: f.desc }} />
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-[#0F3B47] text-[#F5EFE3] py-24">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp>
            <p className="eyebrow mb-5 text-center">Complete Setup</p>
            <h2 className="heading-display text-4xl md:text-5xl text-center mb-12">Everything you need — included</h2>
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

      <section className="bg-[#0B1B22] text-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="eyebrow mb-5">Request a Proposal</p>
              <h2 className="heading-display text-4xl md:text-6xl">Plan your event</h2>
            </div>
            <InquiryForm defaultType="conference" showHeading={false} />
          </FadeUp>
        </div>
      </section>
    </>
  );
}
