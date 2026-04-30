import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import { resolveSlotImage } from "@/lib/site-images";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const og = await resolveSlotImage("og.default");
  const ogUrl = og.url || "/og-default.jpg";
  const siteUrl = process.env.NEXTAUTH_URL || "https://ballusresort.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Ballu's Resort & Café — Where the River Meets the Mountains",
      template: "%s | Ballu's Resort & Café",
    },
    description:
      "A premium Himalayan resort & café on the banks of the Beas River in Manali. Luxury suites, destination weddings, conferences, and artisan dining with 360° mountain views.",
    keywords: [
      "Manali resort",
      "Beas River resort",
      "luxury resort Manali",
      "destination wedding Manali",
      "conference venue Manali",
      "Himalayan resort",
      "Kullu Valley",
      "Ballu's Resort",
      "premium resort Himachal Pradesh",
    ],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      siteName: "Ballu's Resort & Café",
      title: "Ballu's Resort & Café — Where the River Meets the Mountains",
      description:
        "A premium Himalayan resort & café on the banks of the Beas River in Manali.",
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ballu's Resort & Café",
      description:
        "A premium Himalayan resort & café on the banks of the Beas River in Manali.",
      images: [ogUrl],
    },
    robots: { index: true, follow: true },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
