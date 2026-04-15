"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  siteSettings,
  pages,
  suites,
  suiteImages,
  galleryImages,
  offers,
  posts,
  faqs,
  testimonials,
  experiences,
  inquiries,
  newsletterSignups,
  siteImages,
} from "@/lib/schema";
import { slugify, parseDateInput } from "@/lib/admin-utils";
import { SLOT_IMAGE_TAG } from "@/lib/site-images";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}
function optStr(formData: FormData, key: string): string | null {
  const v = String(formData.get(key) ?? "").trim();
  return v || null;
}
function int(formData: FormData, key: string, fallback = 0): number {
  const v = Number(formData.get(key));
  return Number.isFinite(v) ? v : fallback;
}
function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}
function json<T>(formData: FormData, key: string): T | null {
  const v = String(formData.get(key) ?? "").trim();
  if (!v) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}
function list(formData: FormData, key: string): string[] {
  const v = String(formData.get(key) ?? "").trim();
  if (!v) return [];
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

// ─── Site Settings ──────────────────────────────────
export async function saveSiteSettings(formData: FormData) {
  await requireAdmin();
  const data = {
    phone: str(formData, "phone"),
    whatsapp: str(formData, "whatsapp"),
    email: str(formData, "email"),
    address: str(formData, "address"),
    instagramUrl: str(formData, "instagramUrl"),
    heroHeadline: str(formData, "heroHeadline"),
    heroTagline: str(formData, "heroTagline"),
    heroImageUrl: str(formData, "heroImageUrl"),
    mapLat: Number(formData.get("mapLat")) || 32.2396,
    mapLng: Number(formData.get("mapLng")) || 77.1887,
    footerText: str(formData, "footerText"),
    updatedAt: new Date(),
  };

  const [existing] = await db.select().from(siteSettings).limit(1);
  if (existing) {
    await db.update(siteSettings).set(data).where(eq(siteSettings.id, existing.id));
  } else {
    await db.insert(siteSettings).values(data);
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

// ─── Pages ──────────────────────────────────────────
export async function savePage(id: number | null, key: string, formData: FormData) {
  await requireAdmin();
  const data = {
    key,
    title: str(formData, "title"),
    body: str(formData, "body"),
    seoTitle: optStr(formData, "seoTitle"),
    seoDescription: optStr(formData, "seoDescription"),
    updatedAt: new Date(),
  };
  if (id) {
    await db.update(pages).set(data).where(eq(pages.id, id));
  } else {
    await db.insert(pages).values(data);
  }
  revalidatePath("/", "layout");
  revalidatePath(`/admin/pages/${key}`);
}

// ─── Suites ─────────────────────────────────────────
export async function saveSuite(id: number | null, formData: FormData) {
  await requireAdmin();
  const title = str(formData, "title");
  const slug = str(formData, "slug") || slugify(title);
  const data = {
    slug,
    title,
    viewType: str(formData, "viewType") || "Mountain",
    description: str(formData, "description"),
    amenities: list(formData, "amenities"),
    order: int(formData, "order"),
  };
  const images = list(formData, "images");

  let suiteId = id;
  if (id) {
    await db.update(suites).set(data).where(eq(suites.id, id));
  } else {
    const [created] = await db.insert(suites).values(data).returning({ id: suites.id });
    suiteId = created.id;
  }

  if (suiteId) {
    await db.delete(suiteImages).where(eq(suiteImages.suiteId, suiteId));
    if (images.length) {
      await db.insert(suiteImages).values(
        images.map((url, i) => ({ suiteId: suiteId!, url, alt: title, order: i }))
      );
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/suites");
  redirect("/admin/suites");
}

export async function deleteSuite(id: number) {
  await requireAdmin();
  await db.delete(suites).where(eq(suites.id, id));
  revalidatePath("/", "layout");
  revalidatePath("/admin/suites");
  redirect("/admin/suites");
}

// ─── Gallery ────────────────────────────────────────
export async function addGalleryImages(urls: string[], category: string) {
  await requireAdmin();
  if (!urls.length) return;
  await db.insert(galleryImages).values(
    urls.map((url, i) => ({
      url,
      alt: "",
      category: category || "Property",
      order: i,
    }))
  );
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function updateGalleryImage(id: number, formData: FormData) {
  await requireAdmin();
  await db
    .update(galleryImages)
    .set({
      alt: str(formData, "alt"),
      caption: optStr(formData, "caption"),
      category: str(formData, "category") || "Property",
      featured: bool(formData, "featured"),
    })
    .where(eq(galleryImages.id, id));
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryImage(id: number) {
  await requireAdmin();
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

// ─── Offers ─────────────────────────────────────────
export async function saveOffer(id: number | null, formData: FormData) {
  await requireAdmin();
  const data = {
    title: str(formData, "title"),
    description: str(formData, "description"),
    imageUrl: optStr(formData, "imageUrl"),
    price: optStr(formData, "price"),
    validFrom: parseDateInput(formData.get("validFrom")),
    validTo: parseDateInput(formData.get("validTo")),
    active: bool(formData, "active"),
  };
  if (id) {
    await db.update(offers).set(data).where(eq(offers.id, id));
  } else {
    await db.insert(offers).values(data);
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/offers");
  redirect("/admin/offers");
}

export async function deleteOffer(id: number) {
  await requireAdmin();
  await db.delete(offers).where(eq(offers.id, id));
  revalidatePath("/admin/offers");
  redirect("/admin/offers");
}

// ─── Posts ──────────────────────────────────────────
export async function savePost(id: number | null, formData: FormData) {
  await requireAdmin();
  const title = str(formData, "title");
  const slug = str(formData, "slug") || slugify(title);
  const published = bool(formData, "published");
  const data = {
    slug,
    title,
    excerpt: optStr(formData, "excerpt"),
    coverImageUrl: optStr(formData, "coverImageUrl"),
    body: str(formData, "body"),
    tags: list(formData, "tags"),
    published,
    publishedAt: published ? new Date() : null,
    seoTitle: optStr(formData, "seoTitle"),
    seoDescription: optStr(formData, "seoDescription"),
    updatedAt: new Date(),
  };
  if (id) {
    await db.update(posts).set(data).where(eq(posts.id, id));
  } else {
    await db.insert(posts).values(data);
  }
  revalidatePath("/journal");
  revalidatePath(`/journal/${slug}`);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(id: number) {
  await requireAdmin();
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/journal");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

// ─── FAQs ───────────────────────────────────────────
export async function saveFaq(id: number | null, formData: FormData) {
  await requireAdmin();
  const data = {
    category: str(formData, "category") || "Stay",
    question: str(formData, "question"),
    answer: str(formData, "answer"),
    order: int(formData, "order"),
    active: bool(formData, "active"),
  };
  if (id) {
    await db.update(faqs).set(data).where(eq(faqs.id, id));
  } else {
    await db.insert(faqs).values(data);
  }
  revalidatePath("/faq");
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function deleteFaq(id: number) {
  await requireAdmin();
  await db.delete(faqs).where(eq(faqs.id, id));
  revalidatePath("/faq");
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

// ─── Testimonials ───────────────────────────────────
export async function saveTestimonial(id: number | null, formData: FormData) {
  await requireAdmin();
  const data = {
    authorName: str(formData, "authorName"),
    location: optStr(formData, "location"),
    quote: str(formData, "quote"),
    rating: int(formData, "rating", 5),
    featured: bool(formData, "featured"),
  };
  if (id) {
    await db.update(testimonials).set(data).where(eq(testimonials.id, id));
  } else {
    await db.insert(testimonials).values(data);
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: number) {
  await requireAdmin();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

// ─── Experiences ────────────────────────────────────
export async function saveExperience(id: number | null, formData: FormData) {
  await requireAdmin();
  const data = {
    name: str(formData, "name"),
    imageUrl: optStr(formData, "imageUrl"),
    distance: str(formData, "distance"),
    driveTime: str(formData, "driveTime"),
    description: str(formData, "description"),
    seasonTags: list(formData, "seasonTags"),
    order: int(formData, "order"),
  };
  if (id) {
    await db.update(experiences).set(data).where(eq(experiences.id, id));
  } else {
    await db.insert(experiences).values(data);
  }
  revalidatePath("/experiences");
  revalidatePath("/admin/experiences");
  redirect("/admin/experiences");
}

export async function deleteExperience(id: number) {
  await requireAdmin();
  await db.delete(experiences).where(eq(experiences.id, id));
  revalidatePath("/experiences");
  revalidatePath("/admin/experiences");
  redirect("/admin/experiences");
}

// ─── Inquiries ──────────────────────────────────────
export async function updateInquiryStatus(id: number, status: string) {
  await requireAdmin();
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
}

export async function deleteInquiry(id: number) {
  await requireAdmin();
  await db.delete(inquiries).where(eq(inquiries.id, id));
  revalidatePath("/admin/inquiries");
  redirect("/admin/inquiries");
}

// ─── Newsletter ─────────────────────────────────────
export async function deleteSubscriber(id: number) {
  await requireAdmin();
  await db.delete(newsletterSignups).where(eq(newsletterSignups.id, id));
  revalidatePath("/admin/newsletter");
}

// ─── Site Images (Slot System) ──────────────────────
export async function saveSiteImage(slotKey: string, url: string) {
  await requireAdmin();
  const clean = url.trim();
  if (!clean) throw new Error("Missing image URL");
  await db
    .update(siteImages)
    .set({ url: clean, updatedAt: new Date() })
    .where(eq(siteImages.slotKey, slotKey));
  updateTag(SLOT_IMAGE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/admin/images");
}

export async function clearSiteImage(slotKey: string) {
  await requireAdmin();
  await db
    .update(siteImages)
    .set({ url: null, updatedAt: new Date() })
    .where(eq(siteImages.slotKey, slotKey));
  updateTag(SLOT_IMAGE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/admin/images");
}

export async function saveSiteImageAlt(slotKey: string, alt: string) {
  await requireAdmin();
  await db
    .update(siteImages)
    .set({ alt: alt.trim(), updatedAt: new Date() })
    .where(eq(siteImages.slotKey, slotKey));
  updateTag(SLOT_IMAGE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/admin/images");
}
