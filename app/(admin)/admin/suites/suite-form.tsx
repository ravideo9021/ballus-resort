"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Suite } from "@/lib/schema";
import { saveSuite, deleteSuite } from "../actions";
import { Field, TextInput, TextArea, Select } from "@/components/admin/form-field";
import { MultiMediaPicker } from "@/components/admin/media-picker";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";
import { RichEditor } from "@/components/admin/rich-editor";
import { slugify } from "@/lib/admin-utils";

const VIEWS = ["Mountain", "River", "Garden", "Valley", "Forest"];

export function SuiteForm({
  initial,
  images: initialImages,
}: {
  initial: Suite | null;
  images: string[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [images, setImages] = useState<string[]>(initialImages);
  const [description, setDescription] = useState<string>(
    typeof initial?.description === "string" ? initial.description : ""
  );

  async function action(formData: FormData) {
    formData.set("slug", slug || slugify(title));
    formData.set("images", images.join(","));
    formData.set("description", description);
    try {
      await saveSuite(initial?.id ?? null, formData);
      toast.success("Suite saved");
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
          <Field label="Slug" htmlFor="slug" hint="Auto from title — click to edit">
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
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="View Type" htmlFor="viewType">
            <Select id="viewType" name="viewType" defaultValue={initial?.viewType ?? "Mountain"}>
              {VIEWS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Display Order" htmlFor="order" hint="Lower numbers show first">
            <TextInput
              id="order"
              name="order"
              type="number"
              defaultValue={initial?.order ?? 0}
            />
          </Field>
        </div>
        <div>
          <p className="block text-xs uppercase tracking-[0.2em] text-[#0B1B22]/70 mb-2 font-medium">
            Description
          </p>
          <RichEditor content={description} onChange={setDescription} minHeight={240} />
        </div>
        <Field
          label="Amenities"
          htmlFor="amenities"
          hint="Comma-separated (e.g. King bed, Fireplace, River-view terrace)"
        >
          <TextArea
            id="amenities"
            name="amenities"
            rows={3}
            defaultValue={(initial?.amenities ?? []).join(", ")}
          />
        </Field>
      </section>

      <section className="bg-white border border-[#0B1B22]/10 p-8">
        <MultiMediaPicker
          label="Suite Images"
          values={images}
          onChange={setImages}
        />
      </section>

      <StickyFormFooter
        cancelHref="/admin/suites"
        deleteAction={
          initial
            ? async () => {
                await deleteSuite(initial.id);
                toast.success("Suite deleted");
                router.push("/admin/suites");
              }
            : undefined
        }
      />
    </form>
  );
}
