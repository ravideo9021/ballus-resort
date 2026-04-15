import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pages } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { PageForm } from "./page-form";

const PAGE_LABELS: Record<string, string> = {
  story: "Our Story",
  cafe: "The Café",
  weddings: "Weddings",
  conferences: "Conferences",
  banquets: "Banquets",
};

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function PageEditor({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  if (!PAGE_LABELS[key]) return notFound();

  const [page] = await db.select().from(pages).where(eq(pages.key, key)).limit(1);

  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Edit Page"
        title={PAGE_LABELS[key]}
        description={`Editing the content for /${key}`}
      />
      <PageForm pageKey={key} initial={page ?? null} />
    </div>
  );
}
