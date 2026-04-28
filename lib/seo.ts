export function lodgingBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Ballu's Resort & Café",
    description:
      "A premium Himalayan resort & café on the banks of the Beas River in Manali. Luxury suites, destination weddings, conferences, and artisan dining.",
    url: process.env.NEXTAUTH_URL || "https://ballus-resort.vercel.app",
    telephone: "+918796017034",
    address: {
      "@type": "PostalAddress",
      streetAddress: "14 Mile Road, Beas Riverside",
      addressLocality: "Manali",
      addressRegion: "Himachal Pradesh",
      postalCode: "175131",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 32.2396,
      longitude: 77.1887,
    },
    image: "/og-default.jpg",
    priceRange: "$$",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi" },
      { "@type": "LocationFeatureSpecification", name: "Parking" },
      { "@type": "LocationFeatureSpecification", name: "Restaurant" },
      { "@type": "LocationFeatureSpecification", name: "Room Service" },
      { "@type": "LocationFeatureSpecification", name: "Bonfire" },
      { "@type": "LocationFeatureSpecification", name: "Mountain View" },
      { "@type": "LocationFeatureSpecification", name: "River View" },
    ],
  };
}

export function restaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Ballu's Café",
    description:
      "A premium handcrafted wooden café in the Beas Valley. Artisan brews, Himalayan cuisine, and panoramic mountain views.",
    url: `${process.env.NEXTAUTH_URL || "https://ballus-resort.vercel.app"}/cafe`,
    telephone: "+918796017034",
    address: {
      "@type": "PostalAddress",
      streetAddress: "14 Mile Road, Beas Riverside",
      addressLocality: "Manali",
      addressRegion: "Himachal Pradesh",
      postalCode: "175131",
      addressCountry: "IN",
    },
    servesCuisine: ["Himalayan", "Indian", "Continental", "Café"],
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function blogPostSchema(post: {
  title: string;
  excerpt?: string;
  slug: string;
  coverImageUrl?: string;
  publishedAt?: Date | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    url: `${process.env.NEXTAUTH_URL || "https://ballus-resort.vercel.app"}/journal/${post.slug}`,
    image: post.coverImageUrl || "/og-default.jpg",
    datePublished: post.publishedAt?.toISOString() || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "Ballu's Resort & Café",
    },
    publisher: {
      "@type": "Organization",
      name: "Ballu's Resort & Café",
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXTAUTH_URL || "https://ballus-resort.vercel.app"}${item.url}`,
    })),
  };
}
