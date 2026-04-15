import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { suites } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/admin-table";

export const metadata = {
  title: "Suites — Ballu's Admin",
  robots: { index: false, follow: false },
};

export default async function SuitesIndex() {
  const rows = await db.select().from(suites).orderBy(asc(suites.order));

  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Stays"
        title="Suites"
        description="Suites and rooms shown on the public stays section."
        action={{ label: "New Suite", href: "/admin/suites/new" }}
      />
      <AdminTable
        columns={[
          { key: "title", label: "Title" },
          { key: "slug", label: "Slug" },
          { key: "viewType", label: "View" },
          { key: "order", label: "Order" },
        ]}
        rows={rows}
        getRowKey={(r) => r.id}
        getRowHref={(r) => `/admin/suites/${r.id}`}
        empty="No suites yet. Create your first suite to show it on the site."
      />
    </div>
  );
}
