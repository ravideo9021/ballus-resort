import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { faqs } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/admin-table";

export const metadata = {
  title: "FAQs — Ballu's Admin",
  robots: { index: false, follow: false },
};

export default async function FaqsIndex() {
  const rows = await db.select().from(faqs).orderBy(asc(faqs.category), asc(faqs.order));
  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Content"
        title="FAQs"
        description="Questions grouped by category, shown on the FAQ page."
        action={{ label: "New FAQ", href: "/admin/faqs/new" }}
      />
      <AdminTable
        columns={[
          { key: "category", label: "Category" },
          { key: "question", label: "Question" },
          { key: "order", label: "Order" },
          {
            key: "active",
            label: "Status",
            render: (r) =>
              r.active ? (
                <span className="text-[#1A6B7A] text-[10px] uppercase tracking-[0.2em]">
                  Active
                </span>
              ) : (
                <span className="text-[#0B1B22]/40 text-[10px] uppercase tracking-[0.2em]">
                  Hidden
                </span>
              ),
          },
        ]}
        rows={rows}
        getRowKey={(r) => r.id}
        getRowHref={(r) => `/admin/faqs/${r.id}`}
      />
    </div>
  );
}
