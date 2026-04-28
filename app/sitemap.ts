import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts, suites } from "@/lib/schema";

const BASE = process.env.NEXTAUTH_URL || "https://ballus-resort.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/story",
    "/stays",
    "/cafe",
    "/weddings",
    "/conferences",
    "/banquets",
    "/gallery",
    "/experiences",
    "/journal",
    "/faq",
    "/contact",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));

  let postEntries: MetadataRoute.Sitemap = [];
  let suiteEntries: MetadataRoute.Sitemap = [];

  try {
    const publishedPosts = await db.select().from(posts).where(eq(posts.published, true));
    postEntries = publishedPosts.map((p) => ({
      url: `${BASE}/journal/${p.slug}`,
      lastModified: p.updatedAt ?? undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    const allSuites = await db.select().from(suites);
    suiteEntries = allSuites.map((s) => ({
      url: `${BASE}/stays/${s.slug}`,
      lastModified: s.createdAt ?? undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    // Database may not be reachable during build — fall back to static only
  }

  return [...staticEntries, ...suiteEntries, ...postEntries];
}
