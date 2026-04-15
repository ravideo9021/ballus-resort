"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Offer } from "@/lib/schema";
import { saveOffer, deleteOffer } from "../actions";
import { Field, TextInput, TextArea } from "@/components/admin/form-field";
import { MediaPicker } from "@/components/admin/media-picker";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";

function toDateInput(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toISOString().slice(0, 10);
}

export function OfferForm({ initial }: { initial: Offer | null }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.imageUrl ?? null);

  async function action(formData: FormData) {
    formData.set("imageUrl", imageUrl ?? "");
    try {
      await saveOffer(initial?.id ?? null, formData);
      toast.success("Offer saved");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <form action={action} className="space-y-8 max-w-3xl">
      <section className="bg-white border border-[#0B1B22]/10 p-8 space-y-6">
        <Field label="Title" htmlFor="title">
          <TextInput id="title" name="title" defaultValue={initial?.title ?? ""} required />
        </Field>
        <Field label="Description" htmlFor="description">
          <TextArea
            id="description"
            name="description"
            rows={4}
            defaultValue={initial?.description ?? ""}
            required
          />
        </Field>
        <div className="grid md:grid-cols-3 gap-6">
          <Field label="Price" htmlFor="price" hint="e.g. ₹12,500 / night">
            <TextInput id="price" name="price" defaultValue={initial?.price ?? ""} />
          </Field>
          <Field label="Valid From" htmlFor="validFrom">
            <TextInput
              id="validFrom"
              name="validFrom"
              type="date"
              defaultValue={toDateInput(initial?.validFrom)}
            />
          </Field>
          <Field label="Valid To" htmlFor="validTo">
            <TextInput
              id="validTo"
              name="validTo"
              type="date"
              defaultValue={toDateInput(initial?.validTo)}
            />
          </Field>
        </div>
        <MediaPicker
          name="imageUrl"
          value={imageUrl}
          onChange={setImageUrl}
          label="Cover Image"
        />
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="active"
            defaultChecked={initial?.active ?? true}
            className="w-4 h-4"
          />
          <span className="text-sm">Active (visible on site)</span>
        </label>
      </section>

      <StickyFormFooter
        cancelHref="/admin/offers"
        deleteAction={
          initial
            ? async () => {
                await deleteOffer(initial.id);
                toast.success("Offer deleted");
                router.push("/admin/offers");
              }
            : undefined
        }
      />
    </form>
  );
}
