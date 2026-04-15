"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "@/lib/schema";
import { savePage } from "../../actions";
import { Field, TextInput, TextArea } from "@/components/admin/form-field";
import { RichEditor } from "@/components/admin/rich-editor";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";

export function PageForm({ pageKey, initial }: { pageKey: string; initial: Page | null }) {
  const [body, setBody] = useState<string>(
    typeof initial?.body === "string" ? initial.body : initial?.body ? JSON.stringify(initial.body) : ""
  );

  async function action(formData: FormData) {
    formData.set("body", body);
    try {
      await savePage(initial?.id ?? null, pageKey, formData);
      toast.success("Page saved");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <form action={action} className="space-y-8 max-w-4xl">
      <section className="bg-white border border-[#0B1B22]/10 p-8 space-y-6">
        <Field label="Title" htmlFor="title">
          <TextInput
            id="title"
            name="title"
            defaultValue={initial?.title ?? ""}
            required
          />
        </Field>
        <div>
          <p className="block text-xs uppercase tracking-[0.2em] text-[#0B1B22]/70 mb-2 font-medium">
            Body
          </p>
          <RichEditor content={body} onChange={setBody} minHeight={400} />
        </div>
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

      <StickyFormFooter cancelHref="/admin/pages" />
    </form>
  );
}
