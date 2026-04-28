"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-[#0B1B22] text-[#F5EFE3] pt-20 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex flex-col leading-none mb-4">
              <span className="heading-display text-3xl">Ballu&apos;s</span>
              <span className="text-[#C9A24B] text-[10px] uppercase tracking-[0.3em] mt-1">
                Resort &amp; Café
              </span>
            </div>
            <p className="text-sm text-[#F5EFE3]/70 italic leading-relaxed">
              Where the River Meets the Mountains
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="eyebrow mb-5">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/stays" className="text-[#F5EFE3]/70 hover:text-[#C9A24B] transition-colors">Stays</Link></li>
              <li><Link href="/cafe" className="text-[#F5EFE3]/70 hover:text-[#C9A24B] transition-colors">Café</Link></li>
              <li><Link href="/weddings" className="text-[#F5EFE3]/70 hover:text-[#C9A24B] transition-colors">Weddings</Link></li>
              <li><Link href="/conferences" className="text-[#F5EFE3]/70 hover:text-[#C9A24B] transition-colors">Conferences</Link></li>
              <li><Link href="/banquets" className="text-[#F5EFE3]/70 hover:text-[#C9A24B] transition-colors">Banquets</Link></li>
              <li><Link href="/gallery" className="text-[#F5EFE3]/70 hover:text-[#C9A24B] transition-colors">Gallery</Link></li>
              <li><Link href="/experiences" className="text-[#F5EFE3]/70 hover:text-[#C9A24B] transition-colors">Experiences</Link></li>
              <li><Link href="/journal" className="text-[#F5EFE3]/70 hover:text-[#C9A24B] transition-colors">Journal</Link></li>
              <li><Link href="/story" className="text-[#F5EFE3]/70 hover:text-[#C9A24B] transition-colors">Our Story</Link></li>
              <li><Link href="/faq" className="text-[#F5EFE3]/70 hover:text-[#C9A24B] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="eyebrow mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-[#F5EFE3]/70">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#C9A24B] flex-shrink-0" />
                <span>14 Mile Road, Beas Riverside,<br />Manali — 175131</span>
              </li>
              <li>
                <a href="tel:+918796017034" className="flex gap-3 hover:text-[#C9A24B] transition-colors">
                  <Phone className="w-4 h-4 mt-0.5 text-[#C9A24B] flex-shrink-0" />
                  <span>+91 8796017034</span>
                </a>
              </li>
              <li>
                <a href="mailto:ballusresort@gmail.com" className="flex gap-3 hover:text-[#C9A24B] transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 text-[#C9A24B] flex-shrink-0" />
                  <span>ballusresort@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="https://instagram.com/ballus_resort" target="_blank" rel="noreferrer" className="flex gap-3 hover:text-[#C9A24B] transition-colors">
                  <InstagramIcon className="w-4 h-4 mt-0.5 text-[#C9A24B] flex-shrink-0" />
                  <span>@ballus_resort</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="eyebrow mb-5">Stay in Touch</h4>
            <p className="text-sm text-[#F5EFE3]/70 mb-4 leading-relaxed">
              Seasonal notes, special offers, and whispers from the valley — straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-white/5 border border-white/10 px-4 py-3 text-sm text-[#F5EFE3] placeholder:text-[#F5EFE3]/40 focus:border-[#C9A24B] focus:outline-none"
              />
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#C9A24B] text-[#0B1B22] text-xs uppercase tracking-[0.2em] font-semibold py-3 hover:bg-[#E5C97A] transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "..." : status === "success" ? "Subscribed ✓" : "Subscribe"}
              </button>
              {status === "error" && (
                <p className="text-xs text-red-400">Something went wrong. Try again.</p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#F5EFE3]/40">
          <p>© {new Date().getFullYear()} Ballu&apos;s Resort &amp; Café. All rights reserved.</p>
          <p>Crafted with care in the Beas Valley.</p>
        </div>
      </div>
    </footer>
  );
}
