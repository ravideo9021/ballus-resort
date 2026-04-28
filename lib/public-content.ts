import { asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import {
  experiences,
  faqs,
  galleryImages,
  pages,
  posts,
  siteSettings,
  suiteImages,
  suites,
} from "./schema";

export type PublicImage = {
  url: string;
  alt: string;
  caption?: string | null;
  category?: string;
};

export function isManagedImage(url?: string | null) {
  return !!url && !url.startsWith("/seed/");
}

export function resolveManagedImage(
  directUrl: string | null | undefined,
  pool: PublicImage[],
  categories?: string[]
): string | null {
  if (isManagedImage(directUrl)) return directUrl ?? null;
  if (categories?.length) {
    return pickImageByCategory(pool, categories)?.url ?? null;
  }
  return pool[0]?.url ?? null;
}

export async function getSiteSettings() {
  const rows = await db.select().from(siteSettings).orderBy(asc(siteSettings.id)).limit(1);
  return rows[0] ?? null;
}

export async function getGalleryImagePool() {
  const rows = await db
    .select()
    .from(galleryImages)
    .orderBy(desc(galleryImages.featured), asc(galleryImages.order), asc(galleryImages.id));

  return rows
    .filter((img) => isManagedImage(img.url))
    .map((img) => ({
      url: img.url,
      alt: img.alt || img.caption || img.category || "Ballu's Resort image",
      caption: img.caption,
      category: img.category,
    })) satisfies PublicImage[];
}

export function pickImageByCategory(
  images: PublicImage[],
  categories: string[]
) {
  const wanted = new Set(categories.map((category) => category.toLowerCase()));
  return (
    images.find((img) => img.category && wanted.has(img.category.toLowerCase())) ??
    images[0] ??
    null
  );
}

export function pickImagesByCategory(
  images: PublicImage[],
  count: number,
  categories?: string[]
) {
  const matches = categories?.length
    ? images.filter(
        (img) =>
          img.category &&
          categories.some(
            (category) => img.category?.toLowerCase() === category.toLowerCase()
          )
      )
    : images;

  const ordered = [...matches];
  if (ordered.length < count) {
    for (const image of images) {
      if (ordered.some((item) => item.url === image.url)) continue;
      ordered.push(image);
      if (ordered.length >= count) break;
    }
  }

  return ordered.slice(0, count);
}

export async function getPageRecord(key: string) {
  const rows = await db.select().from(pages).where(eq(pages.key, key)).limit(1);
  return rows[0] ?? null;
}

export async function getPublicSuites() {
  const suiteRows = await db.select().from(suites).orderBy(asc(suites.order), asc(suites.id));
  const ids = suiteRows.map((suite) => suite.id);

  const imageRows = ids.length
    ? await db
        .select()
        .from(suiteImages)
        .where(inArray(suiteImages.suiteId, ids))
        .orderBy(asc(suiteImages.order), asc(suiteImages.id))
    : [];

  const imageMap = new Map<number, PublicImage[]>();
  for (const image of imageRows) {
    if (!isManagedImage(image.url)) continue;
    const entry = imageMap.get(image.suiteId) ?? [];
    entry.push({
      url: image.url,
      alt: image.alt || "Suite image",
    });
    imageMap.set(image.suiteId, entry);
  }

  return suiteRows.map((suite) => ({
    ...suite,
    managedImages: imageMap.get(suite.id) ?? [],
  }));
}

export async function getPublicSuiteBySlug(slug: string) {
  const rows = await db.select().from(suites).where(eq(suites.slug, slug)).limit(1);
  const suite = rows[0] ?? null;
  if (!suite) return null;

  const images = await db
    .select()
    .from(suiteImages)
    .where(eq(suiteImages.suiteId, suite.id))
    .orderBy(asc(suiteImages.order), asc(suiteImages.id));

  return {
    ...suite,
    managedImages: images
      .filter((image) => isManagedImage(image.url))
      .map((image) => ({
        url: image.url,
        alt: image.alt || suite.title,
      })),
  };
}

export async function getPublishedPosts(limit?: number) {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt));

  return (typeof limit === "number" ? rows.slice(0, limit) : rows).map((post) => ({
    ...post,
    managedCoverImageUrl: isManagedImage(post.coverImageUrl)
      ? post.coverImageUrl
      : null,
  }));
}

export async function getPublishedPostBySlug(slug: string) {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  const post = rows[0] ?? null;
  if (!post || !post.published) return null;

  return {
    ...post,
    managedCoverImageUrl: isManagedImage(post.coverImageUrl)
      ? post.coverImageUrl
      : null,
  };
}

export async function getPublicExperiences() {
  const rows = await db
    .select()
    .from(experiences)
    .orderBy(asc(experiences.order), asc(experiences.id));

  return rows.map((experience) => ({
    ...experience,
    managedImageUrl: isManagedImage(experience.imageUrl)
      ? experience.imageUrl
      : null,
  }));
}

export async function getActiveFaqs() {
  return db
    .select()
    .from(faqs)
    .where(eq(faqs.active, true))
    .orderBy(asc(faqs.order), asc(faqs.id));
}
