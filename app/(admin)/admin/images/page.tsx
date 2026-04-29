import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteImages, type SiteImage } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { resolveFallbackPath } from "@/lib/site-images";
import { ImagesManager, type SlotView } from "./images-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Site Images — Ballu's Admin",
  robots: { index: false, follow: false },
};

const SLOT_META: Record<string, { label: string; description?: string }> = {
  "home.hero": { label: "Home — Hero image", description: "Main hero image at the top of the homepage." },
  "home.intro.side": { label: "Home — Intro side image", description: "Image beside the welcome intro paragraph." },
  "home.weddings.teaser": { label: "Home — Weddings teaser background", description: "Full-bleed weddings teaser background." },
  "stays.hero": { label: "Stays index — Hero", description: "Hero image for /stays." },
  "suites.himalayan.hero": { label: "Himalayan Suites — Hero image" },
  "suites.beas.hero": { label: "Beas Suites — Hero image" },
  "cafe.hero": { label: "Café page — Hero" },
  "weddings.hero": { label: "Weddings page — Hero" },
  "conferences.hero": { label: "Conferences page — Hero" },
  "banquets.hero": { label: "Banquets index — Hero" },
  "banquets.namaste.hero": { label: "Namaste Banquet — Photo" },
  "banquets.devbhumi.hero": { label: "Devbhumi Banquet — Photo" },
  "story.hero": { label: "Story page — Hero" },
  "experiences.hero": { label: "Experiences page — Hero" },
  "journal.hero": { label: "Journal index — Hero" },
  "faq.hero": { label: "FAQ page — Hero" },
  "contact.hero": { label: "Contact page — Hero" },
  "og.default": { label: "Default social share image (Open Graph)", description: "1200×630 image used when a page shares to social without a specific image." },
  "valley.solang": { label: "Solang Valley", description: "Image for Solang Valley in the Beyond the Resort section." },
  "valley.old-manali": { label: "Old Manali", description: "Image for Old Manali in the Beyond the Resort section." },
  "valley.hadimba": { label: "Hadimba Temple", description: "Image for Hadimba Temple in the Beyond the Resort section." },
  "valley.mall-road": { label: "Mall Road", description: "Image for Mall Road in the Beyond the Resort section." },
  "valley.rohtang": { label: "Rohtang Pass", description: "Image for Rohtang Pass in the Beyond the Resort section." },
  "valley.naggar": { label: "Naggar Castle", description: "Image for Naggar Castle in the Beyond the Resort section." },
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
    title: "Beyond the Resort",
    description: "Images for the valley attractions section on the homepage (used when no experiences are added).",
    keys: [
      "valley.solang",
      "valley.old-manali",
      "valley.hadimba",
      "valley.mall-road",
      "valley.rohtang",
      "valley.naggar",
    ],
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

async function ensureSlots() {
  const allKeys = SECTIONS.flatMap((s) => s.keys);
  const rows = await db.select().from(siteImages).orderBy(asc(siteImages.id));
  const bySlot = new Map<string, SiteImage>(rows.map((r) => [r.slotKey, r]));

  const missing = allKeys.filter((k) => !bySlot.has(k));
  for (const key of missing) {
    const meta = SLOT_META[key] ?? { label: key };
    try {
      await db
        .insert(siteImages)
        .values({ slotKey: key, label: meta.label, description: meta.description ?? null })
        .onConflictDoUpdate({
          target: siteImages.slotKey,
          set: { label: meta.label, description: meta.description ?? null },
        });
    } catch { /* slot may already exist */ }
  }

  if (missing.length > 0) {
    const refreshed = await db.select().from(siteImages).orderBy(asc(siteImages.id));
    bySlot.clear();
    for (const r of refreshed) bySlot.set(r.slotKey, r);
  }

  return bySlot;
}

export default async function SiteImagesAdmin() {
  const bySlot = await ensureSlots();

  const sections = SECTIONS.map((section) => ({
    title: section.title,
    description: section.description,
    slots: section.keys.map((key): SlotView => {
      const row = bySlot.get(key);
      const meta = SLOT_META[key] ?? { label: key };
      return {
        slotKey: key,
        label: row?.label ?? meta.label,
        description: row?.description ?? meta.description ?? null,
        url: row?.url ?? null,
        alt: row?.alt ?? "",
        fallbackUrl: resolveFallbackPath(key),
      };
    }),
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
