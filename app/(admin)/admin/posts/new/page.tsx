import { PageHeader } from "@/components/admin/page-header";
import { PostForm } from "../post-form";

export const metadata = { robots: { index: false, follow: false } };

export default function NewPost() {
  return (
    <div className="p-10">
      <PageHeader eyebrow="Content" title="New Post" />
      <PostForm initial={null} />
    </div>
  );
}
