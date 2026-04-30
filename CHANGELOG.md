# Changelog

## v3.0 — Quality upgrade

### Fixed

- **`--turbopack` deprecation warning** — removed flag from dev script (Turbopack is default in Next.js 16).
- **`publishedAt` overwrite bug** — editing a published post no longer resets its publish date.
- **Rate limiter memory leak** — expired entries are now cleaned up when map exceeds 10,000 entries.

### Added

- **Public Offers page** (`/offers`) — displays active offers with images, pricing, and validity dates. Shows empty state when no offers exist.
- **Public Testimonials page** (`/testimonials`) — displays guest reviews with star ratings, author info, and featured sorting.
- **Privacy Policy page** (`/privacy-policy`) — CMS-editable legal page with fallback message.
- **Terms of Service page** (`/terms`) — CMS-editable legal page with fallback message.
- **PWA icons** — 192x192 and 512x512 PNG icons in manifest for installability.
- **Keyboard accessibility** — mobile menu closes on Escape, `role="dialog"` + `aria-modal` on overlay.
- **Focus-visible rings** — gold focus rings on all navbar links (desktop and mobile).
- **Gallery filter `aria-pressed`** — screen readers announce active filter state.
- **Dynamic footer contact info** — phone, email, address, and Instagram pulled from CMS settings with hardcoded fallbacks.
- **Footer legal links** — Privacy Policy and Terms links in copyright bar.
- **Footer nav links** — Offers and Testimonials added to Explore column.
- **Story page CMS support** — `/story` renders admin-edited content when available, keeps hardcoded fallback.
- **Gallery description** — subtitle text below gallery hero heading.
- **Error handling** — all 24 admin server actions wrapped in try-catch with contextual error messages.
- **Sitemap entries** — `/offers` and `/testimonials` added.

### Changed

- **Smooth scroll** — `data-scroll-behavior="smooth"` on `<html>` for Next.js 16 SPA navigation compatibility.


## v2.2 — Custom domain + valley images + cleanup

### Changed

- **Custom domain:** All URLs now default to `https://ballusresort.com` (sitemap, robots.txt, Open Graph, JSON-LD).
- **Sitemap** generates correct `ballusresort.com` URLs for Google Search Console.

### Added

- **Beyond the Resort image slots** — 6 new site image slots (`valley.solang`, `valley.old-manali`, `valley.hadimba`, `valley.mall-road`, `valley.rohtang`, `valley.naggar`) editable from Admin → Site Images.
- Admin images page auto-creates missing slots on load — no manual seed required.

### Removed

- `V2_1_NOTES.md` — diagnostic notes, not needed in repo.
- `proxy.ts` — unused file (middleware runs from app directory).
- Starter SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) — unused Next.js boilerplate.


## v2.1 — Admin fixes + Image Slot System

### Fixed

- **All 8 broken admin pages** (`/admin/inquiries`, `/admin/suites`, `/admin/offers`, `/admin/posts`, `/admin/testimonials`, `/admin/faqs`, `/admin/experiences`, `/admin/newsletter`). Root cause: `components/admin/admin-table.tsx` was marked `"use client"` but received function props (`render`, `getRowKey`, `getRowHref`) from server components, which React 19 / Next 16 RSC serialization rejects. Removing the `"use client"` directive — the table has no event handlers and only renders `<Link>`s — fixes all 8 in a single edit.
- **Home "Beyond the Resort" and `/experiences` showing 5× Solang Valley + 1× Old Manali**. Root cause: seed script used `.onConflictDoNothing()` on tables without unique constraints, so repeated `pnpm db:seed` runs created duplicate rows (30 experiences, 15 testimonials, 50 FAQs in DB). Fixed by making seed idempotent — delete-then-insert for `experiences`, `testimonials`, `faqs`.

### Added

- **Image Slot System.** A new `site_images` table with 18 named slots (`home.hero`, `story.hero`, `stays.hero`, `suites.himalayan.hero`, `suites.beas.hero`, `cafe.hero`, `weddings.hero`, `conferences.hero`, `banquets.hero`, `banquets.namaste.hero`, `banquets.devbhumi.hero`, `experiences.hero`, `journal.hero`, `faq.hero`, `contact.hero`, `home.intro.side`, `home.weddings.teaser`, `og.default`) resolved at render time in this order: DB override → `public/images/slots/<slotKey>.{jpg,…,svg}` fallback → branded placeholder.
- **`lib/site-images.ts`** — slot resolver (`resolveSlotImage`, `resolveSlotOr`, `getSlot`, `getAllSlots`), cached per request.
- **`components/marketing/slot-image.tsx`** — server component wrapping `<ManagedImage>` for slot-driven hero/feature images.
- **`/admin/images`** admin page — lists all slots grouped by section (Home, Stays, Café, Weddings & Events, Banquets, Other Pages, Brand Assets). Each card shows a preview, a source badge (Uploaded / Fallback / Missing), an alt-text editor, an upload/replace button, and a "clear override" button.
- **"Site Images" entry** in the admin sidebar.
- **`public/images/slots/*.svg`** — 18 distinct branded fallback placeholders (dark-teal + gold, each illustrated per slot theme) so the site is never blank before real photography is uploaded.
- Root layout `generateMetadata` now resolves `og.default` through the slot system.
- Every marketing page (`/`, `/story`, `/stays`, `/stays/[slug]`, `/cafe`, `/weddings`, `/conferences`, `/banquets`, `/experiences`, `/journal`, `/faq`, `/contact`) now calls `resolveSlotOr(...)` for its hero image so admin uploads take precedence over gallery-based resolution.

### Changed

- `scripts/seed.ts` now deletes from `experiences`, `testimonials`, and `faqs` before inserting, and upserts `siteImages` rows by `slotKey`.
- `ManagedImage` passes `unoptimized` for `.svg` sources so bundled SVG fallbacks render without requiring `dangerouslyAllowSVG`.
