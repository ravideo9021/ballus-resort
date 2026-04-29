# Ballu's Resort & Café

A production-grade marketing website for **Ballu's Resort & Café** — a premium Himalayan resort at 14 Mile Road, Beas Riverside, Manali. Complete scrollytelling public site + admin CMS + inquiry lead capture.

> Built against world-class resort standards (Aman, Six Senses, Soneva).

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, Server Actions)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 with `@theme inline` (custom palette + Cormorant Garamond / Inter)
- **UI primitives:** shadcn/ui (base-nova) + Base-UI
- **Motion:** Framer Motion + Lenis smooth scroll
- **Database:** Neon Postgres (serverless) + Drizzle ORM
- **Auth:** NextAuth v5 (Credentials + JWT)
- **Media:** UploadThing
- **Email:** Resend
- **Forms:** React Hook Form + Zod
- **Rich text:** Tiptap
- **Maps:** Leaflet + OpenStreetMap (no API key)
- **Gallery:** yet-another-react-lightbox + react-masonry-css

---

## Project Structure

```
app/
  (marketing)/        # Public site
    page.tsx          # Home (13 cinematic sections)
    story/            # Our story
    stays/            # Suites index + [slug]
    cafe/
    weddings/
    conferences/
    banquets/
    gallery/
    experiences/
    journal/          # Blog index + [slug]
    faq/
    contact/
    layout.tsx
  (admin)/admin/      # CMS
    dashboard/
    settings/         # singleton
    pages/[key]/      # rich-text editor
    suites/           # CRUD + images
    gallery/          # upload, categorize, feature
    offers/
    posts/            # blog CRUD
    faqs/
    testimonials/
    experiences/
    inquiries/        # read-only + status + CSV export
    newsletter/       # list + CSV export
    login/
    actions.ts        # all server actions
  api/
    auth/             # NextAuth handler
    inquiries/        # POST: validate, rate-limit, DB, email
    newsletter/       # POST
    uploadthing/
  sitemap.ts, robots.ts, manifest.ts
  not-found.tsx

components/
  motion/             # FadeUp, KenBurns, CursorDot, ScrollProgress, …
  marketing/          # Navbar, Footer, InquiryForm, GalleryGrid, LeafletMap, …
  admin/              # PageHeader, AdminTable, MediaPicker, RichEditor, …
  ui/                 # shadcn primitives

lib/
  schema.ts           # 13 Drizzle tables
  db.ts               # Neon + Drizzle (lazy-init)
  auth.ts             # NextAuth config
  email.ts            # Resend templates (branded)
  seo.ts              # JSON-LD generators
  rate-limit.ts
  validators.ts       # Zod inquiry / newsletter schemas
  uploadthing.ts      # file router
  uploadthing-client.ts
  admin-utils.ts      # slugify, formatDate, CSV
  utils.ts            # cn()

scripts/
  hash-password.ts
  seed.ts             # full content seed (real Ballu's data)

middleware.ts         # auth guard for /admin/*
```

---

## Local Development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in each variable:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (required) |
| `NEXTAUTH_SECRET` | Random 32+ char string — `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your site URL (`https://ballusresort.com` in production) |
| `ADMIN_EMAIL` | Admin login email (`ballusresort@gmail.com`) |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password — generate with `pnpm hash-password` |
| `UPLOADTHING_TOKEN` | From the UploadThing dashboard |
| `RESEND_API_KEY` | From resend.com |
| `RESEND_FROM_EMAIL` | Sender address configured in Resend. Use `ballusresort@gmail.com` only if Resend allows that verified sender; otherwise use a verified domain sender. |
| `INQUIRY_NOTIFICATION_EMAIL` | Where inquiry notifications are delivered (`ballusresort@gmail.com`) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID (optional) |
| `GOOGLE_SITE_VERIFICATION` | Search Console verification token (optional) |

### 3. Generate admin password hash

```bash
pnpm hash-password 'your-strong-password'
```

Paste the output into `ADMIN_PASSWORD_HASH`.

### 4. Push schema & seed database

```bash
pnpm db:push
pnpm db:seed
```

### 5. Start the dev server

```bash
pnpm dev
```

The site runs at [http://localhost:3000](http://localhost:3000). Admin at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## Scripts

| Command | Action |
|---|---|
| `pnpm dev` | Next.js dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | Next.js lint |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:push` | Push schema to DB (dev) |
| `pnpm db:seed` | Populate DB with seed content |
| `pnpm db:studio` | Drizzle Studio GUI |
| `pnpm hash-password '<pwd>'` | Generate bcrypt hash |

---

## Image Slot System

Every hero and feature image across the site is controlled by a named **slot** (e.g. `home.hero`, `suites.beas.hero`, `weddings.hero`). Slots are stored in the `site_images` table and resolved at render time in this order:

1. **DB override** — a URL uploaded via `/admin/images` (UploadThing).
2. **Public fallback** — `public/images/slots/<slotKey>.{jpg,jpeg,png,webp,svg}` if present.
3. **Branded placeholder** — a subtle dark-teal gradient if neither exists.

### Managing slots

Sign in to `/admin/images` to upload, replace, or clear any slot image and edit its alt text. Uploaded overrides always win over bundled fallbacks. Clearing an override reverts the slot to the fallback file.

### Adding a new slot

1. Add the new key to the `SiteSlotKey` union in `lib/site-images.ts`.
2. Add a seed entry in `scripts/seed.ts` under `siteImages` and run `pnpm db:seed`.
3. Add the slot to a `SECTIONS` group in `app/(admin)/admin/images/page.tsx` so it appears in the admin UI.
4. Reference it from a page via `resolveSlotOr("my.slot", fallback)` or `<SlotImage slotKey="my.slot" />`.

### Bundled fallback files

`public/images/slots/*.svg` ship with the repo as distinct branded placeholders — one per slot — so the site is never blank before real photography is uploaded. Replace any SVG with a same-named `.jpg`/`.webp` to supply a permanent bundled fallback without using the admin UI.

---

## Deploying to Vercel

1. **Create a Neon project** at [neon.tech](https://neon.tech). Copy the connection string.
2. **Create an UploadThing app** at [uploadthing.com](https://uploadthing.com). Copy the token.
3. **Create a Resend account** at [resend.com](https://resend.com), verify your domain, and create an API key.
4. **Push this repo** to GitHub.
5. **Import the repo on Vercel** ([vercel.com/new](https://vercel.com/new)).
6. Under **Environment Variables**, paste every key from `.env.example` (values from steps 1–3 + a random `NEXTAUTH_SECRET` and your admin credentials).
7. Set `NEXTAUTH_URL` to your Vercel production URL (`https://ballusresort.com`).
8. **Deploy.** First deploy will schema-migrate via `pnpm db:push` if you add it as a post-install step (or run once manually: `pnpm db:push` with production `DATABASE_URL`).
9. **Seed production:** `DATABASE_URL=<prod-url> pnpm db:seed` (once).
10. **Add your custom domain** in Vercel → Project → Domains. Update `NEXTAUTH_URL` to the custom domain.
11. **Analytics:** Enable Web Analytics and Speed Insights in the Vercel dashboard. The app includes `@vercel/analytics` and `@vercel/speed-insights` in the root layout, so data starts flowing after redeploy.

---

## Google Business Profile

The site is structured with `LodgingBusiness` JSON-LD and a proper sitemap. For maximum local SEO:

1. **Claim your Google Business Profile** at [business.google.com](https://business.google.com) for "Ballu's Resort & Café".
2. Add category: Resort hotel (primary), Café (secondary).
3. Upload high-quality photos (cover, rooms, café, exterior).
4. Set address, phone, website → must match the site exactly.
5. Encourage guests to leave Google reviews.

---

## Google Search Console

1. Register `ballusresort.com` at [search.google.com/search-console](https://search.google.com/search-console).
2. Verify using the **HTML tag** method — paste the token into `GOOGLE_SITE_VERIFICATION` env var and redeploy.
3. Submit `https://ballusresort.com/sitemap.xml`.
4. Watch for crawl errors and fix any.

---

## Before Launch Checklist

- [ ] Replace all placeholder images in `/public/seed/` with real professional photography.
- [ ] Update `scripts/seed.ts` if any real content changes needed (it's already seeded, but can be re-run on a fresh DB).
- [ ] Verify Resend sender domain.
- [ ] Test `/contact` inquiry form end-to-end (receive notification email).
- [ ] Test admin CRUD on every section (suites, gallery, posts, offers, faqs, testimonials, experiences, pages, settings).
- [ ] Run `pnpm build && pnpm start` locally to verify production build.
- [ ] Lighthouse audit: aim for ≥95 on Performance, Accessibility, SEO, Best Practices.
- [ ] Share on social — generate OG preview via Slack/WhatsApp/iMessage.

---

## Decisions Made

- **Tailwind v4 + inline hex strings** instead of custom utility tokens. Rationale: the `@theme inline` directive makes utility generation less predictable across v4 minor versions, so all brand colors are written as `bg-[#C9A24B]` etc. This keeps the design consistent and review-obvious.
- **Leaflet + OpenStreetMap** instead of Mapbox/Google Maps. Free, no API key, no quota, fits the understated aesthetic.
- **No booking engine.** The spec required inquiry lead capture only. All forms funnel to the inquiries table and trigger a Resend email — real booking integrations (Cloudbeds, SiteMinder, etc.) are a future concern.
- **Sonner for toasts** over shadcn toaster — cleaner API, better animation defaults.
- **Tiptap** over a headless editor for posts/pages — toolbar, images, links, and HTML output out of the box.
- **JSON storage for rich-text bodies** — the Tiptap editor outputs HTML in this codebase, stored in the `json` columns (any JSON value is valid, including a string). This keeps migration flexibility open if the team later wants Tiptap JSON doc format.

---

## License

Private. All rights reserved © Ballu's Resort & Café.
