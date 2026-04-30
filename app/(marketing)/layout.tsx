import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { FloatingContact } from "@/components/marketing/floating-contact";
import { getSiteSettings } from "@/lib/public-content";
import { LenisProvider } from "@/components/motion/lenis-provider";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { CursorDot } from "@/components/motion/cursor-dot";
import { Toaster } from "@/components/ui/sonner";
import { lodgingBusinessSchema } from "@/lib/seo";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <LenisProvider>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <ScrollProgress />
      <CursorDot />
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
      <FloatingContact />
      <Toaster position="bottom-center" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(lodgingBusinessSchema()),
        }}
      />
    </LenisProvider>
  );
}
