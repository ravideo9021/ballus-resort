import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteImages, type SiteImage } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { resolveFallbackPath } from "@/lib/site-images";
import { ImagesManager, type SlotView } from "./images-manager";

export const metadata = {
  title: "Site Images — Ballu's Admin",
  robots: { index: false, follow: false },
};

const SECTIONS: { title: string; description?: string; keys: string[] }[] = [
  {
    title: "Home",
    description: "Hero band, intro side image, and the weddings teaser on the homepage.",
    keys: ["home.hero", "home.intro.side", "home.weddings.teaser"],
  },
  {
    title: "Stays",
    description: "Stays index hero and individual suite detail heroes.",
    keys: ["stays.hero", "suites.himalayan.hero", "suites.beas.hero"],
  },
  {
    title: "Café",
    keys: ["cafe.hero"],
  },
  {
    title: "Weddings & Events",
    keys: ["weddings.hero", "conferences.hero"],
  },
  {
    title: "Banquets",
    keys: ["banquets.hero", "banquets.namaste.hero", "banquets.devbhumi.hero"],
  },
  {
    title: "Other Pages",
    keys: ["story.hero", "experiences.hero", "journal.hero", "faq.hero", "contact.hero"],
  },
  {
    title: "Brand Assets",
    description: "The Open Graph image used when the site is shared on social media.",
    keys: ["og.default"],
  },
];

export default async function SiteImagesAdmin() {
  const rows = await db
    .select()
    .from(siteImages)
    .orderBy(asc(siteImages.id));

  const bySlot = new Map<string, SiteImage>(rows.map((r) => [r.slotKey, r]));

  const sections = SECTIONS.map((section) => ({
    title: section.title,
    description: section.description,
    slots: section.keys
      .map((key): SlotView | null => {
        const row = bySlot.get(key);
        if (!row) return null;
        return {
          slotKey: row.slotKey,
          label: row.label,
          description: row.description,
          url: row.url,
          alt: row.alt,
          fallbackUrl: resolveFallbackPath(row.slotKey),
        };
      })
      .filter((s): s is SlotView => s !== null),
  }));

  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Media"
        title="Site Images"
        description="Upload overrides for hero and feature images across the site. Each slot falls back to a bundled placeholder until you upload your own photography."
      />
      <ImagesManager sections={sections} />
    </div>
  );
}
