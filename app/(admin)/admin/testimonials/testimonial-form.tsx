"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Testimonial } from "@/lib/schema";
import { saveTestimonial, deleteTestimonial } from "../actions";
import { Field, TextInput, TextArea, Select } from "@/components/admin/form-field";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";

export function TestimonialForm({ initial }: { initial: Testimonial | null }) {
  const router = useRouter();

  async function action(formData: FormData) {
    try {
      await saveTestimonial(initial?.id ?? null, formData);
      toast.success("Testimonial saved");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <form action={action} className="space-y-8 max-w-3xl">
      <section className="bg-white border border-[#0B1B22]/10 p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Author Name" htmlFor="authorName">
            <TextInput
              id="authorName"
              name="authorName"
              defaultValue={initial?.authorName ?? ""}
              required
            />
          </Field>
          <Field label="Location" htmlFor="location" hint="e.g. Bengaluru, India">
            <TextInput id="location" name="location" defaultValue={initial?.location ?? ""} />
          </Field>
        </div>
        <Field label="Quote" htmlFor="quote">
          <TextArea
            id="quote"
            name="quote"
            rows={5}
            defaultValue={initial?.quote ?? ""}
            required
          />
        </Field>
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Rating" htmlFor="rating">
            <Select id="rating" name="rating" defaultValue={String(initial?.rating ?? 5)}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} ({n}/5)
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Featured" htmlFor="featured">
            <label className="flex items-center gap-3 py-2.5">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={initial?.featured ?? false}
                className="w-4 h-4"
              />
              <span className="text-sm">Show on home page carousel</span>
            </label>
          </Field>
        </div>
      </section>

      <StickyFormFooter
        cancelHref="/admin/testimonials"
        deleteAction={
          initial
            ? async () => {
                await deleteTestimonial(initial.id);
                toast.success("Deleted");
                router.push("/admin/testimonials");
              }
            : undefined
        }
      />
    </form>
  );
}
