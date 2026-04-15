import { PageHeader } from "@/components/admin/page-header";
import { OfferForm } from "../offer-form";

export const metadata = { robots: { index: false, follow: false } };

export default function NewOffer() {
  return (
    <div className="p-10">
      <PageHeader eyebrow="Packages" title="New Offer" />
      <OfferForm initial={null} />
    </div>
  );
}
