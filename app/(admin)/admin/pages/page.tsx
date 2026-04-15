import Link from "next/link";
import { db } from "@/lib/db";
import { pages } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { formatDateShort } from "@/lib/admin-utils";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Pages — Ballu's Admin",
  robots: { index: false, follow: false },
};

const PAGE_KEYS = [
  { key: "story", label: "Our Story", path: "/story" },
  { key: "cafe", label: "The Café", path: "/cafe" },
  { key: "weddings", label: "Weddings", path: "/weddings" },
  { key: "conferences", label: "Conferences", path: "/conferences" },
  { key: "banquets", label: "Banquets", path: "/banquets" },
];

export default async function PagesIndex() {
  const all = await db.select().from(pages);

  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Content"
        title="Pages"
        description="Rich-text content blocks shown on the public site."
      />
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
        {PAGE_KEYS.map((p) => {
          const existing = all.find((x) => x.key === p.key);
          return (
            <Link
              key={p.key}
              href={`/admin/pages/${p.key}`}
              className="group bg-white border border-[#0B1B22]/10 hover:border-[#C9A24B] p-6 flex items-start justify-between transition-colors"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#1A6B7A] mb-2">
                  {p.path}
                </p>
                <h2 className="heading-serif text-2xl text-[#0B1B22] mb-1">
                  {p.label}
                </h2>
                {existing && (
                  <p className="text-xs text-[#0B1B22]/50">
                    Updated {formatDateShort(existing.updatedAt)}
                  </p>
                )}
                {!existing && (
                  <p className="text-xs text-[#0B1B22]/40 italic">Not yet created</p>
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-[#0B1B22]/30 group-hover:text-[#C9A24B] transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
