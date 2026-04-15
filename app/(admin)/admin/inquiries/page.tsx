import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { formatDate } from "@/lib/admin-utils";

export const metadata = {
  title: "Inquiries — Ballu's Admin",
  robots: { index: false, follow: false },
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-[#C9A24B] text-[#0B1B22]",
  handled: "bg-[#1A6B7A] text-white",
  archived: "bg-[#0B1B22]/20 text-[#0B1B22]",
};

export default async function InquiriesIndex({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const { status, type } = await searchParams;
  let rows = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  if (status) rows = rows.filter((r) => r.status === status);
  if (type) rows = rows.filter((r) => r.type === type);

  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Leads"
        title="Inquiries"
        description="Every message submitted through the site arrives here."
        action={{ label: "Export CSV", href: "/admin/inquiries/export" }}
      />

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#0B1B22]/50 mr-2">
          Status:
        </span>
        {[
          { k: "", label: "All" },
          { k: "new", label: "New" },
          { k: "handled", label: "Handled" },
          { k: "archived", label: "Archived" },
        ].map((s) => (
          <Link
            key={s.k}
            href={s.k ? `/admin/inquiries?status=${s.k}` : "/admin/inquiries"}
            className={`px-3 py-1.5 text-xs uppercase tracking-[0.2em] border transition-colors ${
              (status ?? "") === s.k
                ? "bg-[#0B1B22] text-[#F5EFE3] border-[#0B1B22]"
                : "bg-white text-[#0B1B22]/70 border-[#0B1B22]/15 hover:border-[#C9A24B]"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <AdminTable
        columns={[
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <span
                className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 ${
                  STATUS_COLORS[r.status] ?? "bg-[#0B1B22]/10"
                }`}
              >
                {r.status}
              </span>
            ),
          },
          { key: "type", label: "Type" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          {
            key: "createdAt",
            label: "Received",
            render: (r) => formatDate(r.createdAt),
          },
        ]}
        rows={rows}
        getRowKey={(r) => r.id}
        getRowHref={(r) => `/admin/inquiries/${r.id}`}
        empty="No inquiries match this filter."
      />
    </div>
  );
}
