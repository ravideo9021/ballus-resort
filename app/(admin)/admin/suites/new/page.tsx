import { PageHeader } from "@/components/admin/page-header";
import { SuiteForm } from "../suite-form";

export const metadata = { robots: { index: false, follow: false } };

export default function NewSuite() {
  return (
    <div className="p-10">
      <PageHeader eyebrow="Stays" title="New Suite" />
      <SuiteForm initial={null} images={[]} />
    </div>
  );
}
