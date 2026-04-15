import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { offers } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { formatDateShort } from "@/lib/admin-utils";

export const metadata = {
  title: "Offers — Ballu's Admin",
  robots: { index: false, follow: false },
};

export default async function OffersIndex() {
  const rows = await db.select().from(offers).orderBy(desc(offers.createdAt));
  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Packages"
        title="Offers"
        description="Seasonal offers and packages promoted on the site."
        action={{ label: "New Offer", href: "/admin/offers/new" }}
      />
      <AdminTable
        columns={[
          { key: "title", label: "Title" },
          { key: "price", label: "Price", render: (r) => r.price ?? "—" },
          {
            key: "active",
            label: "Status",
            render: (r) => (
              <span
                className={
                  r.active
                    ? "text-[#1A6B7A] text-[10px] uppercase tracking-[0.2em]"
                    : "text-[#0B1B22]/40 text-[10px] uppercase tracking-[0.2em]"
                }
              >
                {r.active ? "Active" : "Inactive"}
              </span>
            ),
          },
          { key: "validTo", label: "Valid Until", render: (r) => formatDateShort(r.validTo) },
        ]}
        rows={rows}
        getRowKey={(r) => r.id}
        getRowHref={(r) => `/admin/offers/${r.id}`}
      />
    </div>
  );
}
