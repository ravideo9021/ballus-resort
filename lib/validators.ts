import { z } from "zod";

export const inquirySchema = z.object({
  type: z.enum(["stay", "wedding", "conference", "cafe", "other"]),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  preferredDates: z.string().optional(),
  guests: z.string().optional(),
  venue: z.string().optional(),
  message: z.string().optional(),
  website: z.string().max(0, "Bot detected").optional(), // honeypot
});

export const newsletterSchema = z.object({
  email: z.string().email("Valid email is required"),
  website: z.string().max(0).optional(), // honeypot
});

export const weddingInquirySchema = z.object({
  type: z.literal("wedding"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  weddingDate: z.string().optional(),
  guests: z.string().optional(),
  venue: z.string().optional(),
  message: z.string().optional(),
  website: z.string().max(0).optional(),
});

export const conferenceInquirySchema = z.object({
  type: z.literal("conference"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  company: z.string().optional(),
  dates: z.string().optional(),
  attendees: z.string().optional(),
  avNeeds: z.string().optional(),
  message: z.string().optional(),
  website: z.string().max(0).optional(),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
