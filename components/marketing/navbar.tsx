"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/stays", label: "Stays" },
  { href: "/cafe", label: "Café" },
  { href: "/weddings", label: "Weddings" },
  { href: "/conferences", label: "Conferences" },
  { href: "/gallery", label: "Gallery" },
  { href: "/journal", label: "Journal" },
  { href: "/story", label: "Story" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#0B1B22]/90 backdrop-blur-md border-b border-white/10 py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none">
            <span
              className="heading-display text-[#F5EFE3] text-2xl"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Ballu&apos;s
            </span>
            <span className="text-[#C9A24B] text-[10px] uppercase tracking-[0.3em] mt-0.5">
              Resort &amp; Café
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#F5EFE3]/80 hover:text-[#C9A24B] text-sm uppercase tracking-[0.15em] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-[#C9A24B] text-[#0B1B22] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#E5C97A] transition-colors"
            >
              Plan Your Stay
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-[#F5EFE3] p-2"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#0B1B22]"
          >
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex flex-col leading-none">
                <span className="heading-display text-[#F5EFE3] text-2xl">Ballu&apos;s</span>
                <span className="text-[#C9A24B] text-[10px] uppercase tracking-[0.3em] mt-0.5">
                  Resort &amp; Café
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-[#F5EFE3] p-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
              }}
              className="flex flex-col items-center justify-center mt-12 gap-8"
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="heading-serif text-[#F5EFE3] hover:text-[#C9A24B] text-3xl transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="mt-6"
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center px-8 py-3.5 bg-[#C9A24B] text-[#0B1B22] text-xs uppercase tracking-[0.25em] font-semibold"
                >
                  Plan Your Stay
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
