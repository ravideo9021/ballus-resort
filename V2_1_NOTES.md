# v2.1 — diagnostic + fix notes

## Root cause of the 8 broken admin pages (ONE shared cause)

`components/admin/admin-table.tsx` was marked `"use client"`, but every admin list page passes **function props** to it from a server component:

```tsx
<AdminTable
  columns={[{ key: "status", label: "Status", render: (r) => <Badge…/> }, …]}
  getRowKey={(r) => r.id}
  getRowHref={(r) => `/admin/posts/${r.id}`}
/>
```

Under Next 16 / React 19 RSC serialization, passing raw functions across the
server → client boundary throws:

```
Error: Functions cannot be passed directly to Client Components unless you
explicitly expose it by marking it with "use server". Or maybe you meant to
call this function rather than return it.
  {key: "status", label: "Status", render: function render}
```

Every broken page (`/admin/suites`, `/admin/offers`, `/admin/posts`,
`/admin/testimonials`, `/admin/faqs`, `/admin/experiences`, `/admin/inquiries`,
`/admin/newsletter`) used `<AdminTable>`.

`/admin/gallery` and `/admin/settings` worked because they never reach
`<AdminTable>` — gallery uses a dedicated `<GalleryManager>` client component,
settings renders a form directly.

### Fix

Remove the `"use client"` directive from `components/admin/admin-table.tsx`.
The table has no event handlers — it only renders `<Link>`s and the provided
JSX. Making it a server component fixes all 8 pages in one edit.

After the fix all 8 admin index pages plus their `new/` and `[id]/` routes
return 200.

---

## Seed idempotency bug (separate issue, discovered during diagnosis)

The seed script used `.onConflictDoNothing()` on tables that have no unique
constraint on any seeded column — so every `pnpm db:seed` invocation creates
fresh duplicate rows. Before the fix:

| Table | Rows in DB | Expected |
|---|---|---|
| experiences | 30 | 6 |
| testimonials | 15 | 3 |
| faqs | 50 | 10 |

This is **why** the home page "Beyond the Resort" section and `/experiences`
were showing 5× Solang Valley + 1× Old Manali as the first 6 rows (ordered by
`order` asc, `id` asc — all Solang rows have `order=1`, all Old Manali rows
have `order=2`, etc.).

### Fix

1. Seed deletes from the non-unique-constrained tables before inserting:
   `experiences`, `testimonials`, `faqs`.
2. Clean duplicates out of the current DB (`DELETE FROM experiences;` etc.)
   and re-seed so row counts match the spec.

---

## Bugs fixed

1. **All 8 broken admin pages** — root cause above: removed `"use client"` from
   `admin-table.tsx`.
2. **`/experiences` and home "Beyond the Resort"** — duplicate seed rows; made
   seed idempotent (delete-then-insert for non-unique tables) and cleaned DB.
3. **Duplicate FAQ/testimonial/experience entries** — same seed fix.

---

## What's new in v2.1

- **Image Slot System** — new `site_images` table, seeded with 18 named slots,
  public `<SlotImage slotKey="..." />` component with DB override + public file
  fallback, `/admin/images` admin UI.
- **Admin sidebar** now includes an "Images" entry.
- **README.md** documents the slot system.

See `CHANGELOG.md` for the full entry.
