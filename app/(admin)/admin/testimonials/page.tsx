import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/admin-table";

export const metadata = {
  title: "Testimonials — Ballu's Admin",
  robots: { index: false, follow: false },
};

export default async function TestimonialsIndex() {
  const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Social Proof"
        title="Testimonials"
        description="Guest quotes featured across the site."
        action={{ label: "New Testimonial", href: "/admin/testimonials/new" }}
      />
      <AdminTable
        columns={[
          { key: "authorName", label: "Author" },
          { key: "location", label: "Location", render: (r) => r.location ?? "—" },
          {
            key: "quote",
            label: "Quote",
            render: (r) => (
              <span className="line-clamp-1 italic">&ldquo;{r.quote}&rdquo;</span>
            ),
          },
          {
            key: "rating",
            label: "Rating",
            render: (r) => `${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}`,
          },
          {
            key: "featured",
            label: "Featured",
            render: (r) =>
              r.featured ? (
                <span className="text-[#C9A24B] text-[10px] uppercase tracking-[0.2em]">
                  Yes
                </span>
              ) : (
                <span className="text-[#0B1B22]/30 text-[10px] uppercase tracking-[0.2em]">—</span>
              ),
          },
        ]}
        rows={rows}
        getRowKey={(r) => r.id}
        getRowHref={(r) => `/admin/testimonials/${r.id}`}
      />
    </div>
  );
}
