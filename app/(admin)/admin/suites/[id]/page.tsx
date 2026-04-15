import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { suites, suiteImages } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { SuiteForm } from "../suite-form";

export const metadata = { robots: { index: false, follow: false } };

export default async function SuiteEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;

  if (idStr === "new") {
    return (
      <div className="p-10">
        <PageHeader eyebrow="Stays" title="New Suite" />
        <SuiteForm initial={null} images={[]} />
      </div>
    );
  }

  const id = Number(idStr);
  if (!Number.isInteger(id)) return notFound();

  const [suite] = await db.select().from(suites).where(eq(suites.id, id)).limit(1);
  if (!suite) return notFound();

  const images = await db
    .select()
    .from(suiteImages)
    .where(eq(suiteImages.suiteId, id))
    .orderBy(asc(suiteImages.order));

  return (
    <div className="p-10">
      <PageHeader eyebrow="Stays" title={suite.title} description={`/stays/${suite.slug}`} />
      <SuiteForm initial={suite} images={images.map((i) => i.url)} />
    </div>
  );
}
