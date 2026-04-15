"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Faq } from "@/lib/schema";
import { saveFaq, deleteFaq } from "../actions";
import { Field, TextInput, Select } from "@/components/admin/form-field";
import { RichEditor } from "@/components/admin/rich-editor";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";

const CATEGORIES = ["Stay", "Dining", "Weddings", "Conferences", "Travel", "General"];

export function FaqForm({ initial }: { initial: Faq | null }) {
  const router = useRouter();
  const [answer, setAnswer] = useState<string>(
    typeof initial?.answer === "string" ? initial.answer : ""
  );

  async function action(formData: FormData) {
    formData.set("answer", answer);
    try {
      await saveFaq(initial?.id ?? null, formData);
      toast.success("FAQ saved");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <form action={action} className="space-y-8 max-w-3xl">
      <section className="bg-white border border-[#0B1B22]/10 p-8 space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Field label="Category" htmlFor="category" className="md:col-span-2">
            <Select id="category" name="category" defaultValue={initial?.category ?? "Stay"}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Order" htmlFor="order">
            <TextInput id="order" name="order" type="number" defaultValue={initial?.order ?? 0} />
          </Field>
        </div>
        <Field label="Question" htmlFor="question">
          <TextInput
            id="question"
            name="question"
            defaultValue={initial?.question ?? ""}
            required
          />
        </Field>
        <div>
          <p className="block text-xs uppercase tracking-[0.2em] text-[#0B1B22]/70 mb-2 font-medium">
            Answer
          </p>
          <RichEditor content={answer} onChange={setAnswer} minHeight={200} />
        </div>
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
        cancelHref="/admin/faqs"
        deleteAction={
          initial
            ? async () => {
                await deleteFaq(initial.id);
                toast.success("FAQ deleted");
                router.push("/admin/faqs");
              }
            : undefined
        }
      />
    </form>
  );
}
