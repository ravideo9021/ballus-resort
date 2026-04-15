"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  FileText,
  BedDouble,
  Images,
  ImageIcon,
  Tag,
  BookOpen,
  HelpCircle,
  Quote,
  Mountain,
  Inbox,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/suites", label: "Suites", icon: BedDouble },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/images", label: "Site Images", icon: ImageIcon },
  { href: "/admin/offers", label: "Offers", icon: Tag },
  { href: "/admin/posts", label: "Journal", icon: BookOpen },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/experiences", label: "Experiences", icon: Mountain },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 overflow-y-auto py-4">
      <ul className="space-y-1 px-3">
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors",
                  active
                    ? "bg-[#C9A24B] text-[#0B1B22]"
                    : "text-[#F5EFE3]/70 hover:bg-white/5 hover:text-[#F5EFE3]"
                )}
              >
                <link.icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
