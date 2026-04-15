import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { GalleryManager } from "./gallery-manager";

export const metadata = {
  title: "Gallery — Ballu's Admin",
  robots: { index: false, follow: false },
};

export default async function GalleryAdmin() {
  const rows = await db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.order), asc(galleryImages.id));

  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Media"
        title="Gallery"
        description="Upload, categorize, and manage the public gallery."
      />
      <GalleryManager images={rows} />
    </div>
  );
}
