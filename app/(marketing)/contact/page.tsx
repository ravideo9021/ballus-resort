import Link from "next/link";
import type { Metadata } from "next";
import { Phone, MessageCircle, Mail, MapPin, Navigation } from "lucide-react";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/fade-up";
import { InquiryForm } from "@/components/marketing/inquiry-form";
import { MapWrapper } from "@/components/marketing/map-wrapper";
import { ManagedImage } from "@/components/marketing/managed-image";
import {
  getGalleryImagePool,
  getSiteSettings,
  resolveManagedImage,
} from "@/lib/public-content";
import { resolveSlotOr } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Plan your visit to Ballu's Resort & Café in Manali. Call, WhatsApp, or send us a message — we respond within 24 hours.",
};

export default async function ContactPage() {
  const [settings, galleryPool] = await Promise.all([
    getSiteSettings(),
    getGalleryImagePool(),
  ]);

  const lat = settings?.mapLat ?? 32.2396;
  const lng = settings?.mapLng ?? 77.1887;
  const phone = settings?.phone || "+91 8796017034";
  const email = settings?.email || "ballusresort@gmail.com";
  const whatsapp = settings?.whatsapp || "918796017034";
  const address = settings?.address || "14 Mile Road, Beas Riverside, Manali — 175131";

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    "Hello Ballu's, I'd like to plan a visit."
  )}`;

  const cards = [
    {
      icon: Phone,
      label: "Call Us",
      value: phone,
      href: `tel:${phone.replace(/\s+/g, "")}`,
      helper: "Daily, 9 AM – 9 PM IST",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us",
      href: whatsappUrl,
      helper: "Fastest way to reach us",
    },
    {
      icon: Mail,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      helper: "Replies within 24 hours",
    },
  ];

  const heroImage = await resolveSlotOr(
    "contact.hero",
    resolveManagedImage(null, galleryPool, ["contact", "property", "resort"])
  );

  return (
    <>
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage
          src={heroImage}
          alt="Ballu's Resort & Café"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/60 to-[#0B1B22]/30" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">Get in Touch</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl mb-4">
              Let&apos;s plan your visit
            </h1>
            <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl max-w-2xl">
              Every reply is written by a human — usually within a few hours.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5EFE3] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <StaggerGroup className="grid md:grid-cols-3 gap-6 mb-20">
            {cards.map((c) => (
              <StaggerItem key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group block bg-white p-8 border border-[#0B1B22]/10 hover:border-[#C9A24B] transition-colors h-full"
                >
                  <div className="flex items-center justify-center w-12 h-12 border border-[#C9A24B] text-[#C9A24B] mb-5 group-hover:bg-[#C9A24B] group-hover:text-[#0B1B22] transition-colors">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#1A6B7A] mb-2">
                    {c.label}
                  </p>
                  <p className="heading-serif text-2xl text-[#0B1B22] mb-1">{c.value}</p>
                  <p className="text-sm text-[#0B1B22]/60">{c.helper}</p>
                </a>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <FadeUp>
              <div className="bg-[#0F3B47] p-10 md:p-12">
                <InquiryForm dark heading="Send a Message" />
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="space-y-8">
                <div>
                  <p className="eyebrow mb-4 text-[#1A6B7A]">Find Us</p>
                  <h2 className="heading-display text-4xl text-[#0B1B22] mb-6">
                    14 Mile Road, Beas Riverside
                  </h2>
                  <div className="flex items-start gap-3 text-[#0B1B22]/80 leading-relaxed mb-2">
                    <MapPin className="w-5 h-5 text-[#C9A24B] mt-1 flex-shrink-0" />
                    <p className="text-lg">
                      Ballu&apos;s Resort &amp; Café
                      <br />
                      {address}
                    </p>
                  </div>
                  <Link
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#1A6B7A] text-xs uppercase tracking-[0.25em] hover:text-[#C9A24B] transition-colors mt-4"
                  >
                    <Navigation className="w-3 h-3" /> Get Directions
                  </Link>
                </div>

                <div className="relative h-[400px] w-full overflow-hidden border border-[#0B1B22]/10">
                  <MapWrapper lat={lat} lng={lng} />
                </div>

                <div className="bg-white p-6 border-l-2 border-[#C9A24B]">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#1A6B7A] mb-2">
                    Getting Here
                  </p>
                  <ul className="space-y-2 text-sm text-[#0B1B22]/80 leading-relaxed">
                    <li>
                      <strong className="text-[#0B1B22]">By Air:</strong> Kullu–Manali (Bhuntar)
                      Airport — 50 km (90 min drive)
                    </li>
                    <li>
                      <strong className="text-[#0B1B22]">By Road:</strong> 14 km from Manali town,
                      on the Naggar road along the Beas river
                    </li>
                    <li>
                      <strong className="text-[#0B1B22]">Pickup:</strong> Chauffeur pickup can be
                      arranged from airport or bus stand
                    </li>
                  </ul>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}
