"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Star, X } from "lucide-react";
import type { GalleryImage } from "@/lib/schema";
import {
  addGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
} from "../actions";
import { UploadButton } from "@/lib/uploadthing-client";
import { Field, TextInput, TextArea, Select } from "@/components/admin/form-field";

const CATEGORIES = ["Property", "Cabins", "Cafe", "Weddings", "Banquets", "Nature"];

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState<string>("All");
  const [uploadCategory, setUploadCategory] = useState<string>("Property");
  const [editing, setEditing] = useState<GalleryImage | null>(null);

  const filtered = filter === "All" ? images : images.filter((i) => i.category === filter);

  return (
    <div className="space-y-8">
      <section className="bg-white border border-[#0B1B22]/10 p-8">
        <h2 className="heading-serif text-2xl mb-4">Upload</h2>
        <div className="flex items-end gap-4 flex-wrap">
          <div className="w-60">
            <Field label="Category" htmlFor="cat">
              <Select
                id="cat"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <UploadButton
            endpoint="media"
            onClientUploadComplete={async (res) => {
              const urls = (res ?? [])
                .map((r) => r.serverData?.url ?? r.ufsUrl ?? r.url)
                .filter((u): u is string => !!u);
              if (urls.length) {
                await addGalleryImages(urls, uploadCategory);
                toast.success(`${urls.length} image(s) uploaded`);
              }
            }}
            onUploadError={(err) => {
              toast.error(err.message || "Upload failed");
            }}
            appearance={{
              button:
                "bg-[#0B1B22] text-[#F5EFE3] px-6 py-3 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#C9A24B] hover:text-[#0B1B22] transition-colors ut-uploading:opacity-60",
              container: "w-fit",
              allowedContent: "text-xs text-[#0B1B22]/50 mt-2",
            }}
          />
        </div>
      </section>

      <div className="flex items-center gap-2 flex-wrap">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border transition-colors ${
              filter === c
                ? "bg-[#0B1B22] text-[#F5EFE3] border-[#0B1B22]"
                : "bg-white text-[#0B1B22]/70 border-[#0B1B22]/15 hover:border-[#C9A24B]"
            }`}
          >
            {c} {c !== "All" && `(${images.filter((i) => i.category === c).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#0B1B22]/10 p-16 text-center text-[#0B1B22]/50 text-sm">
          No images in this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <div
              key={img.id}
              className="group relative bg-white border border-[#0B1B22]/10 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setEditing(img)}
                className="block w-full"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width:768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </button>
              <div className="p-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A6B7A]">
                  {img.category}
                </span>
                <div className="flex items-center gap-2">
                  {img.featured && <Star className="w-3 h-3 text-[#C9A24B] fill-[#C9A24B]" />}
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this image?")) return;
                      await deleteGalleryImage(img.id);
                      toast.success("Deleted");
                    }}
                    className="text-red-600 hover:text-red-700"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <GalleryImageDialog
          image={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            toast.success("Saved");
          }}
        />
      )}
    </div>
  );
}

function GalleryImageDialog({
  image,
  onClose,
  onSaved,
}: {
  image: GalleryImage;
  onClose: () => void;
  onSaved: () => void;
}) {
  async function action(formData: FormData) {
    await updateGalleryImage(image.id, formData);
    onSaved();
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0B1B22]/10">
          <h3 className="heading-serif text-xl">Edit Image</h3>
          <button onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form action={action} className="p-6 space-y-5">
          <div className="relative aspect-[4/3] bg-[#F5EFE3] mb-4">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="600px"
              className="object-contain"
            />
          </div>
          <Field label="Category" htmlFor="category">
            <Select id="category" name="category" defaultValue={image.category}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Alt Text" htmlFor="alt" hint="Describe the image for accessibility">
            <TextInput id="alt" name="alt" defaultValue={image.alt} />
          </Field>
          <Field label="Caption" htmlFor="caption">
            <TextArea id="caption" name="caption" rows={2} defaultValue={image.caption ?? ""} />
          </Field>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={image.featured}
              className="w-4 h-4"
            />
            <span className="text-sm">Feature on home page bento grid</span>
          </label>
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#0B1B22]/10 -mx-6 px-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#0B1B22]/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0B1B22] text-[#F5EFE3] px-6 py-2.5 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#C9A24B] hover:text-[#0B1B22] transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
