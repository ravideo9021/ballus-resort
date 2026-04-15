"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { SiteSettings } from "@/lib/schema";
import { saveSiteSettings } from "../actions";
import { Field, TextInput, TextArea } from "@/components/admin/form-field";
import { MediaPicker } from "@/components/admin/media-picker";
import { StickyFormFooter } from "@/components/admin/sticky-form-footer";

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [heroImageUrl, setHeroImageUrl] = useState<string>(
    settings?.heroImageUrl ?? ""
  );

  async function action(formData: FormData) {
    formData.set("heroImageUrl", heroImageUrl);
    try {
      await saveSiteSettings(formData);
      toast.success("Settings saved");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <form action={action} className="space-y-8 max-w-3xl">
      <section className="bg-white border border-[#0B1B22]/10 p-8">
        <h2 className="heading-serif text-2xl mb-6">Contact</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Phone" htmlFor="phone">
            <TextInput
              id="phone"
              name="phone"
              defaultValue={settings?.phone ?? "+91 8796017034"}
              required
            />
          </Field>
          <Field label="WhatsApp" htmlFor="whatsapp" hint="Digits only, with country code">
            <TextInput
              id="whatsapp"
              name="whatsapp"
              defaultValue={settings?.whatsapp ?? "918796017034"}
              required
            />
          </Field>
          <Field label="Email" htmlFor="email">
            <TextInput
              id="email"
              name="email"
              type="email"
              defaultValue={settings?.email ?? "contact@ballusresort.com"}
              required
            />
          </Field>
          <Field label="Instagram URL" htmlFor="instagramUrl">
            <TextInput
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              defaultValue={settings?.instagramUrl ?? "https://instagram.com/ballus_resort"}
            />
          </Field>
          <Field label="Address" htmlFor="address" className="md:col-span-2">
            <TextArea
              id="address"
              name="address"
              rows={2}
              defaultValue={
                settings?.address ?? "14 Mile Road, Beas Riverside, Manali — 175131"
              }
              required
            />
          </Field>
        </div>
      </section>

      <section className="bg-white border border-[#0B1B22]/10 p-8">
        <h2 className="heading-serif text-2xl mb-6">Hero</h2>
        <div className="space-y-6">
          <Field label="Headline" htmlFor="heroHeadline">
            <TextInput
              id="heroHeadline"
              name="heroHeadline"
              defaultValue={settings?.heroHeadline ?? "Ballu's Resort & Café"}
            />
          </Field>
          <Field label="Tagline" htmlFor="heroTagline">
            <TextInput
              id="heroTagline"
              name="heroTagline"
              defaultValue={settings?.heroTagline ?? "Where the River Meets the Mountains"}
            />
          </Field>
          <MediaPicker
            name="heroImageUrl"
            value={heroImageUrl}
            onChange={(v) => setHeroImageUrl(v ?? "")}
            label="Hero Image"
          />
        </div>
      </section>

      <section className="bg-white border border-[#0B1B22]/10 p-8">
        <h2 className="heading-serif text-2xl mb-6">Map</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Latitude" htmlFor="mapLat">
            <TextInput
              id="mapLat"
              name="mapLat"
              type="number"
              step="any"
              defaultValue={settings?.mapLat ?? 32.2396}
            />
          </Field>
          <Field label="Longitude" htmlFor="mapLng">
            <TextInput
              id="mapLng"
              name="mapLng"
              type="number"
              step="any"
              defaultValue={settings?.mapLng ?? 77.1887}
            />
          </Field>
        </div>
      </section>

      <section className="bg-white border border-[#0B1B22]/10 p-8">
        <h2 className="heading-serif text-2xl mb-6">Footer</h2>
        <Field label="Footer Description" htmlFor="footerText">
          <TextArea
            id="footerText"
            name="footerText"
            rows={3}
            defaultValue={
              settings?.footerText ??
              "A premium Himalayan resort & café on the banks of the Beas River."
            }
          />
        </Field>
      </section>

      <StickyFormFooter cancelHref="/admin/dashboard" />
    </form>
  );
}
