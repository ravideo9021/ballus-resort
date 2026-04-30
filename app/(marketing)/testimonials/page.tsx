import type { Metadata } from "next";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/fade-up";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Star } from "lucide-react";
import { getPublicTestimonials } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Guest Testimonials \u2014 Ballu\u2019s Resort & Caf\u00e9",
  description:
    "Read what our guests say about their stay at Ballu\u2019s Resort & Caf\u00e9, Manali.",
};

export default async function TestimonialsPage() {
  const testimonials = await getPublicTestimonials();

  return (
    <>
      <section className="bg-[#0B1B22] pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FadeUp>
            <p className="eyebrow mb-5">Our Guests</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl mb-4">
              Testimonials
            </h1>
            <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl max-w-2xl mx-auto">
              Stories from travelers who made the mountains their home, even if just for a while.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5EFE3] py-24">
        <div className="max-w-7xl mx-auto px-6">
          {testimonials.length === 0 ? (
            <FadeUp>
              <div className="text-center py-16">
                <SectionHeading eyebrow="Coming Soon" headline="Guest stories are on the way" />
                <p className="text-[#0B1B22]/60 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
                  We&apos;re collecting stories from our guests. Check back soon to hear about
                  their experiences at Ballu&apos;s.
                </p>
              </div>
            </FadeUp>
          ) : (
            <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <StaggerItem key={t.id}>
                  <article className="bg-white border border-[#0B1B22]/5 p-8 h-full flex flex-col">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < t.rating
                              ? "fill-[#C9A24B] text-[#C9A24B]"
                              : "text-[#0B1B22]/15"
                          }`}
                        />
                      ))}
                    </div>
                    <blockquote className="text-[#0B1B22]/70 text-sm leading-relaxed italic flex-1 mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div>
                      <p className="heading-serif text-[#0B1B22] text-base">{t.authorName}</p>
                      {t.location && (
                        <p className="text-xs text-[#0B1B22]/50 mt-1 uppercase tracking-[0.15em]">
                          {t.location}
                        </p>
                      )}
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>
    </>
  );
}
