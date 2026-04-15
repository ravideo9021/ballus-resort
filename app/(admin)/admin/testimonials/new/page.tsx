import { PageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "../testimonial-form";

export const metadata = { robots: { index: false, follow: false } };

export default function NewTestimonial() {
  return (
    <div className="p-10">
      <PageHeader eyebrow="Social Proof" title="New Testimonial" />
      <TestimonialForm initial={null} />
    </div>
  );
}
