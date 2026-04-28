import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "./settings-form";
import { asc } from "drizzle-orm";

export const metadata = {
  title: "Site Settings — Ballu's Admin",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const [settings] = await db.select().from(siteSettings).orderBy(asc(siteSettings.id)).limit(1);

  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Configuration"
        title="Site Settings"
        description="Global information shown across the public site — contact details, hero, map."
      />
      <SettingsForm settings={settings ?? null} />
    </div>
  );
}
