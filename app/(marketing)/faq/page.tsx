import type { Metadata } from "next";
import { FadeUp } from "@/components/motion/fade-up";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ManagedImage } from "@/components/marketing/managed-image";
import { extractTextContent } from "@/components/marketing/rich-content";
import {
  getActiveFaqs,
  getGalleryImagePool,
  resolveManagedImage,
} from "@/lib/public-content";
import { resolveSlotOr } from "@/lib/site-images";
import { faqPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about staying at Ballu's Resort & Café in Manali — check-in, dining, weddings, travel, and policies.",
};

const FAQ_DATA = [
  {
    category: "Stay",
    questions: [
      { q: "What are the check-in and check-out times?", a: "Check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available on request, subject to availability." },
      { q: "Do you offer airport or bus station transfers?", a: "Yes, we can arrange pick-up and drop-off from Bhuntar Airport (Kullu) or Manali Bus Stand. Please mention this when making your inquiry and we'll coordinate the details." },
      { q: "Is parking available at the resort?", a: "Yes, we have ample free parking for all guests. The parking area is within the resort premises and is monitored." },
    ],
  },
  {
    category: "Dining",
    questions: [
      { q: "What kind of cuisine does the café serve?", a: "Ballu's Café serves a mix of Himalayan specialties, North Indian favorites, continental dishes, and artisan coffee and tea. We source local ingredients wherever possible." },
      { q: "Is the café open to non-guests?", a: "Absolutely! The café is open to everyone. Drop in for a coffee, a meal, or simply to enjoy the mountain views. No reservation needed for café visits." },
    ],
  },
  {
    category: "Weddings",
    questions: [
      { q: "What is the maximum capacity for a wedding?", a: "Our largest venue, the Bliss Valley Lawn combined with the Devbhumi Banquet, can accommodate 200+ guests. For intimate ceremonies, the Namaste Banquet comfortably seats 110+ guests indoors." },
      { q: "Do you provide wedding planning services?", a: "We work with trusted local wedding planners and can connect you with decorators, caterers, photographers, and entertainment. Our team assists with logistics, accommodation, and on-ground coordination." },
    ],
  },
  {
    category: "Travel",
    questions: [
      { q: "How do I get to Ballu's Resort from Delhi?", a: "The most common route is Delhi → Chandigarh → Manali by road (approx. 12-14 hours by car or overnight Volvo bus). You can also fly to Bhuntar Airport (Kullu) from Delhi (1 hour) and drive to the resort (45 minutes)." },
      { q: "What is the best time to visit Manali?", a: "Manali is beautiful year-round. Summer (April–June) offers pleasant weather. Monsoon (July–September) brings lush greenery. Autumn (October–November) has clear mountain views. Winter (December–March) brings snow and a magical landscape." },
    ],
  },
  {
    category: "Policies",
    questions: [
      { q: "What is the cancellation policy?", a: "Cancellations made 7+ days before check-in receive a full refund. Cancellations within 3-7 days receive a 50% refund. Cancellations within 3 days are non-refundable. Special event bookings (weddings, conferences) have separate policies discussed during booking." },
    ],
  },
];

export default async function FAQPage() {
  const [faqRows, galleryPool] = await Promise.all([
    getActiveFaqs(),
    getGalleryImagePool(),
  ]);

  const grouped = faqRows.length
    ? Array.from(
        faqRows.reduce((map, row) => {
          const key = row.category || "General";
          const bucket = map.get(key) ?? [];
          bucket.push({
            q: row.question,
            a: extractTextContent(row.answer) || "",
          });
          map.set(key, bucket);
          return map;
        }, new Map<string, { q: string; a: string }[]>())
      ).map(([category, questions]) => ({ category, questions }))
    : FAQ_DATA;

  const flatQas = grouped.flatMap((c) =>
    c.questions.map((q) => ({ question: q.q, answer: q.a }))
  );

  const heroImage = await resolveSlotOr(
    "faq.hero",
    resolveManagedImage(null, galleryPool, ["faq", "property", "resort"])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(flatQas)) }}
      />

      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage src={heroImage} alt="FAQ" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-[#0B1B22]/70" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">Questions &amp; Answers</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl">
              Frequently Asked
            </h1>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5EFE3] py-24">
        <div className="max-w-3xl mx-auto px-6">
          {grouped.map((category, i) => (
            <FadeUp key={category.category} className="mb-12" delay={i * 0.1}>
              <h2 className="heading-serif text-3xl text-[#0B1B22] mb-6 pb-3 border-b border-[#C9A24B]/30">
                {category.category}
              </h2>
              <Accordion className="space-y-2">
                {category.questions.map((item, j) => (
                  <AccordionItem
                    key={j}
                    value={`${category.category}-${j}`}
                    className="border border-[#0B1B22]/10 bg-[#FBF8F1] px-5 rounded-none"
                  >
                    <AccordionTrigger className="text-[#0B1B22] heading-serif text-lg hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#0B1B22]/70 leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeUp>
          ))}
        </div>
      </section>
    </>
  );
}
