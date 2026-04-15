import { PageHeader } from "@/components/admin/page-header";
import { ExperienceForm } from "../experience-form";

export const metadata = { robots: { index: false, follow: false } };

export default function NewExperience() {
  return (
    <div className="p-10">
      <PageHeader eyebrow="Nearby" title="New Experience" />
      <ExperienceForm initial={null} />
    </div>
  );
}
