"use client";

import Image from "next/image";
import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing-client";
import { X } from "lucide-react";
import { toast } from "sonner";

interface MediaPickerProps {
  name?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export function MediaPicker({
  name,
  value,
  onChange,
  label = "Image",
}: MediaPickerProps) {
  return (
    <div>
      {name && <input type="hidden" name={name} value={value ?? ""} />}
      <p className="block text-xs uppercase tracking-[0.2em] text-[#0B1B22]/70 mb-2 font-medium">
        {label}
      </p>
      {value ? (
        <div className="space-y-4">
          <div className="relative inline-block">
            <div className="relative w-60 h-40 border border-[#0B1B22]/15 overflow-hidden">
              <Image src={value} alt="" fill className="object-cover" sizes="240px" />
            </div>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -top-2 -right-2 bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-700"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <UploadButton
            endpoint="media"
            onClientUploadComplete={(res) => {
              const url = res?.[0]?.serverData?.url ?? res?.[0]?.ufsUrl ?? res?.[0]?.url;
              if (url) {
                onChange(url);
                toast.success("Image replaced");
              }
            }}
            onUploadError={(err: Error) => {
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
      ) : (
        <UploadButton
          endpoint="media"
          onClientUploadComplete={(res) => {
            const url = res?.[0]?.serverData?.url ?? res?.[0]?.ufsUrl ?? res?.[0]?.url;
            if (url) {
              onChange(url);
              toast.success("Image uploaded");
            }
          }}
          onUploadError={(err: Error) => {
            toast.error(err.message || "Upload failed");
          }}
          appearance={{
            button:
              "bg-[#0B1B22] text-[#F5EFE3] px-6 py-3 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#C9A24B] hover:text-[#0B1B22] transition-colors ut-uploading:opacity-60",
            container: "w-fit",
            allowedContent: "text-xs text-[#0B1B22]/50 mt-2",
          }}
        />
      )}
    </div>
  );
}

export function MultiMediaPicker({
  values,
  onChange,
  label = "Images",
}: {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}) {
  const [, setUploading] = useState(false);
  return (
    <div>
      <p className="block text-xs uppercase tracking-[0.2em] text-[#0B1B22]/70 mb-2 font-medium">
        {label}
      </p>
      {values.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {values.map((url) => (
            <div key={url} className="relative group">
              <div className="relative aspect-[4/3] border border-[#0B1B22]/15 overflow-hidden">
                <Image src={url} alt="" fill className="object-cover" sizes="240px" />
              </div>
              <button
                type="button"
                onClick={() => onChange(values.filter((v) => v !== url))}
                className="absolute top-1 right-1 bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <UploadButton
        endpoint="media"
        onUploadBegin={() => setUploading(true)}
        onClientUploadComplete={(res) => {
          setUploading(false);
          const newUrls = (res ?? [])
            .map((r) => r.serverData?.url ?? r.ufsUrl ?? r.url)
            .filter((u): u is string => !!u);
          onChange([...values, ...newUrls]);
          if (newUrls.length) toast.success(`${newUrls.length} image(s) uploaded`);
        }}
        onUploadError={(err: Error) => {
          setUploading(false);
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
  );
}
