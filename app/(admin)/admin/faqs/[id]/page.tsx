import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { faqs } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { FaqForm } from "../faq-form";

export const metadata = { robots: { index: false, follow: false } };

export default async function EditFaq({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) return notFound();
  const [faq] = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  if (!faq) return notFound();
  return (
    <div className="p-10">
      <PageHeader eyebrow="Edit FAQ" title={faq.question} />
      <FaqForm initial={faq} />
    </div>
  );
}
