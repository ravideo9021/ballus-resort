import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { experiences } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/admin-table";

export const metadata = {
  title: "Experiences — Ballu's Admin",
  robots: { index: false, follow: false },
};

export default async function ExperiencesIndex() {
  const rows = await db.select().from(experiences).orderBy(asc(experiences.order));
  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Nearby"
        title="Experiences"
        description="Attractions and experiences near the resort."
        action={{ label: "New Experience", href: "/admin/experiences/new" }}
      />
      <AdminTable
        columns={[
          { key: "name", label: "Name" },
          { key: "distance", label: "Distance" },
          { key: "driveTime", label: "Drive Time" },
          {
            key: "seasonTags",
            label: "Season",
            render: (r) => (r.seasonTags ?? []).join(", ") || "—",
          },
          { key: "order", label: "Order" },
        ]}
        rows={rows}
        getRowKey={(r) => r.id}
        getRowHref={(r) => `/admin/experiences/${r.id}`}
      />
    </div>
  );
}
