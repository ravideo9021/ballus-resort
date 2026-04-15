import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ManagedImage } from "@/components/marketing/managed-image";
import { getGalleryImagePool, resolveManagedImage } from "@/lib/public-content";

export default async function NotFound() {
  const galleryPool = await getGalleryImagePool();
  const heroImage = resolveManagedImage(null, galleryPool, [
    "property",
    "resort",
    "story",
  ]);

  return (
    <main className="relative min-h-screen bg-[#0B1B22] flex items-center justify-center overflow-hidden">
      <ManagedImage
        src={heroImage}
        alt="Himalayan dawn"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1B22]/80 via-[#0B1B22]/70 to-[#0B1B22]" />
      <div className="relative text-center px-6 max-w-2xl">
        <p className="eyebrow mb-6 text-[#C9A24B]">404 — Off the Path</p>
        <h1 className="heading-display text-[#F5EFE3] text-6xl md:text-8xl mb-6">
          You&apos;ve wandered off the trail
        </h1>
        <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl mb-10 leading-relaxed">
          The page you&apos;re looking for isn&apos;t here — but the valley is wide
          and there&apos;s plenty still to find.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-3 bg-[#C9A24B] text-[#0B1B22] px-10 py-4 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#E5C97A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to the Resort
        </Link>
      </div>
    </main>
  );
}
