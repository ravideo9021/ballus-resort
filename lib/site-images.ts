import "server-only";
import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { siteImages } from "./schema";

export const SLOT_IMAGE_TAG = "site-images";

export type SiteSlotKey =
  | "home.hero"
  | "home.intro.side"
  | "home.weddings.teaser"
  | "story.hero"
  | "stays.hero"
  | "suites.himalayan.hero"
  | "suites.beas.hero"
  | "cafe.hero"
  | "weddings.hero"
  | "conferences.hero"
  | "banquets.hero"
  | "banquets.namaste.hero"
  | "banquets.devbhumi.hero"
  | "experiences.hero"
  | "journal.hero"
  | "faq.hero"
  | "contact.hero"
  | "og.default";

const FALLBACK_DIR = path.join(process.cwd(), "public", "images", "slots");
const FALLBACK_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg"];

/**
 * Resolve the public-facing fallback path for a slot, if a file exists on disk.
 * Returns a URL-relative path (e.g. `/images/slots/home.hero.jpg`) or null.
 */
export function resolveFallbackPath(slotKey: string): string | null {
  for (const ext of FALLBACK_EXTENSIONS) {
    const abs = path.join(FALLBACK_DIR, `${slotKey}${ext}`);
    try {
      if (fs.existsSync(abs)) return `/images/slots/${slotKey}${ext}`;
    } catch {
      // ignore
    }
  }
  return null;
}

/**
 * Fetch all slot rows (cached per request).
 */
export const getAllSlots = cache(async () => {
  try {
    return await db.select().from(siteImages);
  } catch {
    return [];
  }
});

/**
 * Fetch a single slot by key (cached per request).
 */
export const getSlot = cache(async (slotKey: string) => {
  try {
    const rows = await db
      .select()
      .from(siteImages)
      .where(eq(siteImages.slotKey, slotKey))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
});

/**
 * Resolve the final URL for a slot: DB override wins, then on-disk fallback.
 * Returns null if neither exists — caller should render a placeholder.
 */
export async function resolveSlotImage(slotKey: string): Promise<{
  url: string | null;
  alt: string;
  source: "override" | "fallback" | "missing";
}> {
  const slot = await getSlot(slotKey);
  if (slot?.url) {
    return { url: slot.url, alt: slot.alt || slot.label, source: "override" };
  }
  const fallback = resolveFallbackPath(slotKey);
  if (fallback) {
    return { url: fallback, alt: slot?.alt || slot?.label || "", source: "fallback" };
  }
  return { url: null, alt: slot?.alt || slot?.label || "", source: "missing" };
}

/**
 * Resolve a slot's URL, falling back to the caller-provided value if the slot
 * has neither a DB override nor a public fallback file. Useful inside pages
 * that already have gallery-based resolvers.
 */
export async function resolveSlotOr(
  slotKey: SiteSlotKey,
  fallback: string | null | undefined
): Promise<string | null> {
  const resolved = await resolveSlotImage(slotKey);
  return resolved.url ?? fallback ?? null;
}
