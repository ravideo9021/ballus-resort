import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { newsletterSignups } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { formatDate } from "@/lib/admin-utils";
import { DeleteSubscriberButton } from "./delete-button";

export const metadata = {
  title: "Newsletter — Ballu's Admin",
  robots: { index: false, follow: false },
};

export default async function NewsletterIndex() {
  const rows = await db
    .select()
    .from(newsletterSignups)
    .orderBy(desc(newsletterSignups.createdAt));
  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Audience"
        title="Newsletter"
        description={`${rows.length} subscriber${rows.length === 1 ? "" : "s"}`}
        action={{ label: "Export CSV", href: "/admin/newsletter/export" }}
      />
      <AdminTable
        columns={[
          { key: "email", label: "Email" },
          {
            key: "createdAt",
            label: "Subscribed",
            render: (r) => formatDate(r.createdAt),
          },
          {
            key: "actions",
            label: "",
            render: (r) => <DeleteSubscriberButton id={r.id} />,
          },
        ]}
        rows={rows}
        getRowKey={(r) => r.id}
      />
    </div>
  );
}
