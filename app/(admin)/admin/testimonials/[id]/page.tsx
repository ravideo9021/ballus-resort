import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "../testimonial-form";

export const metadata = { robots: { index: false, follow: false } };

export default async function EditTestimonial({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) return notFound();
  const [t] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  if (!t) return notFound();
  return (
    <div className="p-10">
      <PageHeader eyebrow="Edit Testimonial" title={t.authorName} />
      <TestimonialForm initial={t} />
    </div>
  );
}
