"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Experience } from "@/lib/schema";
import { saveExperience, deleteExperience } from "../actions";
import { Field, TextInput, TextArea } from "@/components/admin/form-field";
import { MediaPicker } from "@/components/admin/media-picker";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";

export function ExperienceForm({ initial }: { initial: Experience | null }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.imageUrl ?? null);

  async function action(formData: FormData) {
    formData.set("imageUrl", imageUrl ?? "");
    try {
      await saveExperience(initial?.id ?? null, formData);
      toast.success("Experience saved");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <form action={action} className="space-y-8 max-w-3xl">
      <section className="bg-white border border-[#0B1B22]/10 p-8 space-y-6">
        <Field label="Name" htmlFor="name">
          <TextInput id="name" name="name" defaultValue={initial?.name ?? ""} required />
        </Field>
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Distance" htmlFor="distance" hint="e.g. 14 km">
            <TextInput
              id="distance"
              name="distance"
              defaultValue={initial?.distance ?? ""}
              required
            />
          </Field>
          <Field label="Drive Time" htmlFor="driveTime" hint="e.g. 30 min">
            <TextInput
              id="driveTime"
              name="driveTime"
              defaultValue={initial?.driveTime ?? ""}
              required
            />
          </Field>
        </div>
        <Field label="Description" htmlFor="description">
          <TextArea
            id="description"
            name="description"
            rows={4}
            defaultValue={initial?.description ?? ""}
            required
          />
        </Field>
        <div className="grid md:grid-cols-2 gap-6">
          <Field
            label="Season Tags"
            htmlFor="seasonTags"
            hint="Comma-separated (e.g. Summer, Winter)"
          >
            <TextInput
              id="seasonTags"
              name="seasonTags"
              defaultValue={(initial?.seasonTags ?? []).join(", ")}
            />
          </Field>
          <Field label="Order" htmlFor="order">
            <TextInput id="order" name="order" type="number" defaultValue={initial?.order ?? 0} />
          </Field>
        </div>
        <MediaPicker
          name="imageUrl"
          value={imageUrl}
          onChange={setImageUrl}
          label="Image"
        />
      </section>

      <StickyFormFooter
        cancelHref="/admin/experiences"
        deleteAction={
          initial
            ? async () => {
                await deleteExperience(initial.id);
                toast.success("Deleted");
                router.push("/admin/experiences");
              }
            : undefined
        }
      />
    </form>
  );
}
