"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Post } from "@/lib/schema";
import { savePost, deletePost } from "../actions";
import { Field, TextInput, TextArea } from "@/components/admin/form-field";
import { MediaPicker } from "@/components/admin/media-picker";
import { RichEditor } from "@/components/admin/rich-editor";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";
import { slugify } from "@/lib/admin-utils";

export function PostForm({ initial }: { initial: Post | null }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [cover, setCover] = useState<string | null>(initial?.coverImageUrl ?? null);
  const [body, setBody] = useState<string>(
    typeof initial?.body === "string" ? initial.body : ""
  );

  async function action(formData: FormData) {
    formData.set("slug", slug || slugify(title));
    formData.set("coverImageUrl", cover ?? "");
    formData.set("body", body);
    try {
      await savePost(initial?.id ?? null, formData);
      toast.success("Post saved");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <form action={action} className="space-y-8 max-w-4xl">
      <section className="bg-white border border-[#0B1B22]/10 p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Title" htmlFor="title">
            <TextInput
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              required
            />
          </Field>
          <Field label="Slug" htmlFor="slug">
            <TextInput
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              required
            />
          </Field>
        </div>
        <Field label="Excerpt" htmlFor="excerpt" hint="Short summary shown in listings">
          <TextArea id="excerpt" name="excerpt" rows={2} defaultValue={initial?.excerpt ?? ""} />
        </Field>
        <MediaPicker
          name="coverImageUrl"
          value={cover}
          onChange={setCover}
          label="Cover Image"
        />
        <Field label="Tags" htmlFor="tags" hint="Comma-separated (e.g. Travel, Winter, Food)">
          <TextInput
            id="tags"
            name="tags"
            defaultValue={(initial?.tags ?? []).join(", ")}
          />
        </Field>
        <div>
          <p className="block text-xs uppercase tracking-[0.2em] text-[#0B1B22]/70 mb-2 font-medium">
            Body
          </p>
          <RichEditor content={body} onChange={setBody} minHeight={500} />
        </div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? false}
            className="w-4 h-4"
          />
          <span className="text-sm">Published (visible on site)</span>
        </label>
      </section>

      <section className="bg-white border border-[#0B1B22]/10 p-8 space-y-6">
        <h3 className="heading-serif text-xl">SEO</h3>
        <Field label="SEO Title" htmlFor="seoTitle">
          <TextInput id="seoTitle" name="seoTitle" defaultValue={initial?.seoTitle ?? ""} />
        </Field>
        <Field label="SEO Description" htmlFor="seoDescription">
          <TextArea
            id="seoDescription"
            name="seoDescription"
            rows={2}
            defaultValue={initial?.seoDescription ?? ""}
          />
        </Field>
      </section>

      <StickyFormFooter
        cancelHref="/admin/posts"
        deleteAction={
          initial
            ? async () => {
                await deletePost(initial.id);
                toast.success("Post deleted");
                router.push("/admin/posts");
              }
            : undefined
        }
      />
    </form>
  );
}
