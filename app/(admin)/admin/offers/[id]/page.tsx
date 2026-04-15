import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { offers } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { OfferForm } from "../offer-form";

export const metadata = { robots: { index: false, follow: false } };

export default async function EditOffer({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) return notFound();
  const [offer] = await db.select().from(offers).where(eq(offers.id, id)).limit(1);
  if (!offer) return notFound();
  return (
    <div className="p-10">
      <PageHeader eyebrow="Packages" title={offer.title} />
      <OfferForm initial={offer} />
    </div>
  );
}
