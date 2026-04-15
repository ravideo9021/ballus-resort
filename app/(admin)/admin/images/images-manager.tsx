"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { RefreshCw, Trash2 } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing-client";
import { Field, TextInput } from "@/components/admin/form-field";
import {
  saveSiteImage,
  clearSiteImage,
  saveSiteImageAlt,
} from "../actions";

export type SlotView = {
  slotKey: string;
  label: string;
  description: string | null;
  url: string | null;
  alt: string;
  fallbackUrl: string | null;
};

export type SectionView = {
  title: string;
  description?: string;
  slots: SlotView[];
};

export function ImagesManager({ sections }: { sections: SectionView[] }) {
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section key={section.title}>
          <div className="mb-5">
            <h2 className="heading-serif text-2xl text-[#0B1B22]">{section.title}</h2>
            {section.description && (
              <p className="text-sm text-[#0B1B22]/60 mt-1">{section.description}</p>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.slots.map((slot) => (
              <SlotCard key={slot.slotKey} slot={slot} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SlotCard({ slot }: { slot: SlotView }) {
  const [isPending, startTransition] = useTransition();
  const [alt, setAlt] = useState(slot.alt);

  const preview = slot.url ?? slot.fallbackUrl;
  const source = slot.url
    ? ("uploaded" as const)
    : slot.fallbackUrl
      ? ("fallback" as const)
      : ("missing" as const);

  return (
    <div className="bg-white border border-[#0B1B22]/10 overflow-hidden flex flex-col">
      <div className="relative aspect-[16/10] bg-[#F5EFE3]">
        {preview ? (
          <Image
            src={preview}
            alt={slot.alt || slot.label}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover"
            unoptimized={preview.endsWith(".svg")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.2em] text-[#0B1B22]/40">
            No image
          </div>
        )}
        <span
          className={`absolute top-3 left-3 px-2 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold ${
            source === "uploaded"
              ? "bg-[#C9A24B] text-[#0B1B22]"
              : source === "fallback"
                ? "bg-[#0B1B22] text-[#E5C97A]"
                : "bg-red-600 text-white"
          }`}
        >
          {source === "uploaded" ? "Uploaded" : source === "fallback" ? "Fallback" : "Missing"}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A6B7A] mb-1">
            {slot.slotKey}
          </p>
          <h3 className="heading-serif text-lg text-[#0B1B22]">{slot.label}</h3>
          {slot.description && (
            <p className="text-xs text-[#0B1B22]/60 mt-1 leading-relaxed">
              {slot.description}
            </p>
          )}
        </div>

        <div className="mb-4">
          <Field label="Alt text" htmlFor={`alt-${slot.slotKey}`}>
            <TextInput
              id={`alt-${slot.slotKey}`}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              onBlur={() => {
                if (alt !== slot.alt) {
                  startTransition(async () => {
                    await saveSiteImageAlt(slot.slotKey, alt);
                    toast.success("Alt text saved");
                  });
                }
              }}
              placeholder="Describe this image"
            />
          </Field>
        </div>

        <div className="mt-auto flex items-center gap-3 flex-wrap">
          <UploadButton
            endpoint="media"
            onClientUploadComplete={async (res) => {
              const url = res?.[0]?.serverData?.url ?? res?.[0]?.ufsUrl ?? res?.[0]?.url;
              if (!url) return;
              startTransition(async () => {
                await saveSiteImage(slot.slotKey, url);
                toast.success(`${slot.label} updated`);
              });
            }}
            onUploadError={(err) => {
              toast.error(err.message || "Upload failed");
            }}
            appearance={{
              button:
                "bg-[#0B1B22] text-[#F5EFE3] px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] font-semibold hover:bg-[#C9A24B] hover:text-[#0B1B22] transition-colors ut-uploading:opacity-60",
              container: "w-fit",
              allowedContent: "hidden",
            }}
            content={{
              button: slot.url ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="w-3 h-3" /> Replace
                </span>
              ) : (
                "Upload"
              ),
            }}
          />
          {slot.url && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (!confirm("Clear the uploaded image and revert to the fallback?")) return;
                startTransition(async () => {
                  await clearSiteImage(slot.slotKey);
                  toast.success("Reverted to fallback");
                });
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] font-semibold text-red-600 border border-red-600/30 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
