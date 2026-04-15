import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { PostForm } from "../post-form";

export const metadata = { robots: { index: false, follow: false } };

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) return notFound();
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) return notFound();
  return (
    <div className="p-10">
      <PageHeader eyebrow="Edit Post" title={post.title} />
      <PostForm initial={post} />
    </div>
  );
}
