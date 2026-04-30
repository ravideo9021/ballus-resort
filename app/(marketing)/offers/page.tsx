import type { Metadata } from "next";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/fade-up";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ManagedImage } from "@/components/marketing/managed-image";
import { CalendarDays, Tag } from "lucide-react";
import { getActiveOffers } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Special Offers — Ballu’s Resort & Café",
  description:
    "Exclusive offers and seasonal packages at Ballu’s Resort & Café, Manali.",
};

function formatDate(d: Date | null | undefined) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function OffersPage() {
  const offers = await getActiveOffers();

  return (
    <>
      <section className="bg-[#0B1B22] pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FadeUp>
            <p className="eyebrow mb-5">Exclusive Deals</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl mb-4">
              Special Offers
            </h1>
            <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl max-w-2xl mx-auto">
              Seasonal packages crafted for unforgettable mountain getaways.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5EFE3] py-24">
        <div className="max-w-7xl mx-auto px-6">
          {offers.length === 0 ? (
            <FadeUp>
              <div className="text-center py-16">
                <SectionHeading eyebrow="Coming Soon" headline="New offers are on the way" />
                <p className="text-[#0B1B22]/60 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
                  We’re preparing special seasonal packages for you. Check back soon or
                  subscribe to our newsletter to be the first to know.
                </p>
              </div>
            </FadeUp>
          ) : (
            <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer) => {
                const from = formatDate(offer.validFrom);
                const to = formatDate(offer.validTo);
                const validity =
                  from && to ? `${from} – ${to}` : from ? `From ${from}` : to ? `Until ${to}` : null;

                return (
                  <StaggerItem key={offer.id}>
                    <article className="group bg-white border border-[#0B1B22]/5 overflow-hidden">
                      {offer.imageUrl && (
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <ManagedImage
                            src={offer.imageUrl}
                            alt={offer.title}
                            fill
                            sizes="(max-width:768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h2 className="heading-serif text-2xl text-[#0B1B22] mb-2">
                          {offer.title}
                        </h2>
                        <p className="text-[#0B1B22]/70 text-sm leading-relaxed mb-4">
                          {offer.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em]">
                          {offer.price && (
                            <span className="flex items-center gap-1 text-[#C9A24B] font-semibold">
                              <Tag className="w-3 h-3" /> {offer.price}
                            </span>
                          )}
                          {validity && (
                            <span className="flex items-center gap-1 text-[#0B1B22]/50">
                              <CalendarDays className="w-3 h-3" /> {validity}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          )}
        </div>
      </section>
    </>
  );
}
