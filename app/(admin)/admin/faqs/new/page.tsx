import { PageHeader } from "@/components/admin/page-header";
import { FaqForm } from "../faq-form";

export const metadata = { robots: { index: false, follow: false } };

export default function NewFaq() {
  return (
    <div className="p-10">
      <PageHeader eyebrow="Content" title="New FAQ" />
      <FaqForm initial={null} />
    </div>
  );
}
