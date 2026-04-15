import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { formatDateShort } from "@/lib/admin-utils";

export const metadata = {
  title: "Journal — Ballu's Admin",
  robots: { index: false, follow: false },
};

export default async function PostsIndex() {
  const rows = await db.select().from(posts).orderBy(desc(posts.updatedAt));
  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Content"
        title="Journal"
        description="Blog posts, travel guides, and seasonal notes."
        action={{ label: "New Post", href: "/admin/posts/new" }}
      />
      <AdminTable
        columns={[
          { key: "title", label: "Title" },
          { key: "slug", label: "Slug", className: "font-mono text-xs" },
          {
            key: "published",
            label: "Status",
            render: (r) => (
              <span
                className={
                  r.published
                    ? "text-[#1A6B7A] text-[10px] uppercase tracking-[0.2em]"
                    : "text-[#0B1B22]/40 text-[10px] uppercase tracking-[0.2em]"
                }
              >
                {r.published ? "Published" : "Draft"}
              </span>
            ),
          },
          {
            key: "updatedAt",
            label: "Updated",
            render: (r) => formatDateShort(r.updatedAt),
          },
        ]}
        rows={rows}
        getRowKey={(r) => r.id}
        getRowHref={(r) => `/admin/posts/${r.id}`}
      />
    </div>
  );
}
