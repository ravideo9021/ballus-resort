"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { inquirySchema, type InquiryFormData } from "@/lib/validators";
import { cn } from "@/lib/utils";

interface InquiryFormProps {
  defaultType?: InquiryFormData["type"];
  defaultVenue?: string;
  dark?: boolean;
  heading?: string;
  showHeading?: boolean;
}

export function InquiryForm({
  defaultType = "stay",
  defaultVenue,
  dark = true,
  heading = "Send an Inquiry",
  showHeading = true,
}: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { type: defaultType, venue: defaultVenue },
  });

  const onSubmit = async (data: InquiryFormData) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Thank you — we'll be in touch within 24 hours.");
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      toast.error("Something went wrong. Please try again or call us directly.");
    }
  };

  const inputCls = cn(
    "w-full px-4 py-3 text-sm focus:outline-none transition-colors border",
    dark
      ? "bg-white/5 border-white/10 text-[#F5EFE3] placeholder:text-[#F5EFE3]/40 focus:border-[#C9A24B]"
      : "bg-[#FBF8F1] border-[#E6EAEC] text-[#0B1B22] placeholder:text-[#0B1B22]/40 focus:border-[#C9A24B]"
  );

  const labelCls = cn(
    "block text-xs uppercase tracking-[0.2em] font-medium mb-2",
    dark ? "text-[#F5EFE3]/80" : "text-[#0B1B22]/80"
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {showHeading && (
        <div className="mb-6">
          <h3 className={cn(
            "heading-serif text-3xl mb-2",
            dark ? "text-[#F5EFE3]" : "text-[#0B1B22]"
          )}>
            {heading}
          </h3>
          <p className={cn("text-sm", dark ? "text-[#F5EFE3]/60" : "text-[#0B1B22]/60")}>
            We respond to every message within 24 hours.
          </p>
        </div>
      )}

      <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="type" className={labelCls}>Interest</label>
        <select id="type" {...register("type")} className={inputCls}>
          <option value="stay">Stay</option>
          <option value="wedding">Wedding</option>
          <option value="conference">Conference</option>
          <option value="cafe">Café visit</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelCls}>Name</label>
          <input id="name" {...register("name")} className={inputCls} placeholder="Your name" />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" type="email" {...register("email")} className={inputCls} placeholder="your@email.com" />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input id="phone" type="tel" {...register("phone")} className={inputCls} placeholder="+91 ..." />
        </div>
        <div>
          <label htmlFor="preferredDates" className={labelCls}>Preferred Dates</label>
          <input id="preferredDates" {...register("preferredDates")} className={inputCls} placeholder="e.g. May 12 – 15" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="guests" className={labelCls}>Guests</label>
          <input id="guests" {...register("guests")} className={inputCls} placeholder="e.g. 2 adults, 1 child" />
        </div>
        <div>
          <label htmlFor="venue" className={labelCls}>Venue / Suite (optional)</label>
          <input id="venue" {...register("venue")} className={inputCls} placeholder="e.g. Himalayan Suite" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>Message</label>
        <textarea
          id="message"
          {...register("message")}
          rows={4}
          className={inputCls}
          placeholder="Tell us about your visit..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || submitted}
        className="w-full bg-[#C9A24B] text-[#0B1B22] py-4 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#E5C97A] transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : submitted ? "Sent ✓" : "Send Inquiry"}
      </button>
    </form>
  );
}
