import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { experiences } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { ExperienceForm } from "../experience-form";

export const metadata = { robots: { index: false, follow: false } };

export default async function EditExperience({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) return notFound();
  const [exp] = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  if (!exp) return notFound();
  return (
    <div className="p-10">
      <PageHeader eyebrow="Edit Experience" title={exp.name} />
      <ExperienceForm initial={exp} />
    </div>
  );
}
