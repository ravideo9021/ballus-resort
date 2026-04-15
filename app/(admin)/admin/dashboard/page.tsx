import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  inquiries,
  galleryImages,
  posts,
  suites,
  newsletterSignups,
  testimonials,
} from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { formatDate } from "@/lib/admin-utils";
import { ArrowRight, Inbox, Images, BookOpen, BedDouble, Mail, Quote } from "lucide-react";

export const metadata = {
  title: "Dashboard — Ballu's Admin",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const [recentInquiries, galleryCount, postsCount, suitesCount, subsCount, testimonialsCount] =
    await Promise.all([
      db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(8),
      db.$count(galleryImages),
      db.$count(posts),
      db.$count(suites),
      db.$count(newsletterSignups),
      db.$count(testimonials),
    ]);

  const stats = [
    { label: "Inquiries", value: recentInquiries.length, href: "/admin/inquiries", icon: Inbox },
    { label: "Gallery", value: galleryCount, href: "/admin/gallery", icon: Images },
    { label: "Journal", value: postsCount, href: "/admin/posts", icon: BookOpen },
    { label: "Suites", value: suitesCount, href: "/admin/suites", icon: BedDouble },
    { label: "Newsletter", value: subsCount, href: "/admin/newsletter", icon: Mail },
    { label: "Testimonials", value: testimonialsCount, href: "/admin/testimonials", icon: Quote },
  ];

  return (
    <div className="p-10">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A glance at recent activity and content across your resort site."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group bg-white border border-[#0B1B22]/10 p-5 hover:border-[#C9A24B] transition-colors"
          >
            <s.icon className="w-5 h-5 text-[#C9A24B] mb-3" />
            <p className="text-3xl heading-serif text-[#0B1B22] mb-1">{s.value}</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#0B1B22]/60">
              {s.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-[#0B1B22]/10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0B1B22]/10">
          <h2 className="heading-serif text-xl">Recent Inquiries</h2>
          <Link
            href="/admin/inquiries"
            className="text-xs uppercase tracking-[0.2em] text-[#1A6B7A] hover:text-[#C9A24B] flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recentInquiries.length === 0 ? (
          <div className="p-10 text-center text-[#0B1B22]/50 text-sm">
            No inquiries yet. They will appear here as they come in.
          </div>
        ) : (
          <ul>
            {recentInquiries.map((inq) => (
              <li
                key={inq.id}
                className="border-t border-[#0B1B22]/5 first:border-t-0"
              >
                <Link
                  href={`/admin/inquiries/${inq.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#C9A24B]/5 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A6B7A] font-semibold">
                        {inq.type}
                      </span>
                      {inq.status === "new" && (
                        <span className="text-[10px] uppercase tracking-[0.2em] bg-[#C9A24B] text-[#0B1B22] px-2 py-0.5">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-[#0B1B22] font-medium truncate">
                      {inq.name} — {inq.email}
                    </p>
                    {inq.message && (
                      <p className="text-sm text-[#0B1B22]/60 truncate">
                        {inq.message}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-[#0B1B22]/50 whitespace-nowrap">
                    {formatDate(inq.createdAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
