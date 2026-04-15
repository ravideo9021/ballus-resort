import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  json,
  real,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Users ──────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Site Settings (singleton) ──────────────────────
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().default("+91 8796017034"),
  whatsapp: text("whatsapp").notNull().default("918796017034"),
  email: text("email").notNull().default("contact@ballusresort.com"),
  address: text("address")
    .notNull()
    .default("14 Mile Road, Beas Riverside, Manali — 175131"),
  instagramUrl: text("instagram_url")
    .notNull()
    .default("https://instagram.com/ballus_resort"),
  heroHeadline: text("hero_headline")
    .notNull()
    .default("Ballu's Resort & Café"),
  heroTagline: text("hero_tagline")
    .notNull()
    .default("Where the River Meets the Mountains"),
  heroImageUrl: text("hero_image_url")
    .notNull()
    .default(""),
  mapLat: real("map_lat").notNull().default(32.2396),
  mapLng: real("map_lng").notNull().default(77.1887),
  footerText: text("footer_text")
    .notNull()
    .default(
      "A premium Himalayan resort & café on the banks of the Beas River."
    ),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Pages (editable content blocks) ────────────────
export const pages = pgTable(
  "pages",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull().unique(),
    title: text("title").notNull(),
    body: json("body"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// ─── Suites ─────────────────────────────────────────
export const suites = pgTable(
  "suites",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    viewType: text("view_type").notNull().default("Mountain"),
    description: json("description"),
    amenities: json("amenities").$type<string[]>().default([]),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

export const suiteImages = pgTable("suite_images", {
  id: serial("id").primaryKey(),
  suiteId: integer("suite_id")
    .notNull()
    .references(() => suites.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  order: integer("order").notNull().default(0),
});

// ─── Gallery Images ─────────────────────────────────
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  caption: text("caption"),
  category: text("category").notNull().default("Property"),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Offers / Packages ──────────────────────────────
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  price: text("price"),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Blog Posts ─────────────────────────────────────
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    coverImageUrl: text("cover_image_url"),
    body: json("body"),
    tags: json("tags").$type<string[]>().default([]),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// ─── FAQs ───────────────────────────────────────────
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  category: text("category").notNull().default("Stay"),
  question: text("question").notNull(),
  answer: json("answer"),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

// ─── Testimonials ───────────────────────────────────
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  location: text("location"),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Experiences (Nearby Attractions) ───────────────
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  distance: text("distance").notNull(),
  driveTime: text("drive_time").notNull(),
  description: text("description").notNull(),
  seasonTags: json("season_tags").$type<string[]>().default([]),
  order: integer("order").notNull().default(0),
});

// ─── Inquiries ──────────────────────────────────────
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().default("stay"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredDates: text("preferred_dates"),
  guests: text("guests"),
  venue: text("venue"),
  message: text("message"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Newsletter Signups ─────────────────────────────
export const newsletterSignups = pgTable(
  "newsletter_signups",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

// ─── Site Images (Slot System) ──────────────────────
export const siteImages = pgTable("site_images", {
  id: serial("id").primaryKey(),
  slotKey: text("slot_key").notNull().unique(),
  label: text("label").notNull(),
  description: text("description"),
  url: text("url"),
  alt: text("alt").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Types ──────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Suite = typeof suites.$inferSelect;
export type SuiteImage = typeof suiteImages.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type Offer = typeof offers.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewsletterSignup = typeof newsletterSignups.$inferSelect;
export type SiteImage = typeof siteImages.$inferSelect;
