const BASE = process.env.NEXTAUTH_URL || "https://ballusresort.com";

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "14 Mile Road, Beas Riverside",
  addressLocality: "Manali",
  addressRegion: "Himachal Pradesh",
  postalCode: "175131",
  addressCountry: "IN",
};

const GEO = {
  "@type": "GeoCoordinates",
  latitude: 32.2396,
  longitude: 77.1887,
};

const PHONE = "+918796017034";

export function lodgingBusinessSchema(opts?: {
  aggregateRating?: { ratingValue: number; reviewCount: number };
  instagramUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Ballu's Resort & Café",
    description:
      "A premium Himalayan resort & café on the banks of the Beas River in Manali. Luxury suites, destination weddings, conferences, and artisan dining.",
    url: BASE,
    telephone: PHONE,
    address: ADDRESS,
    geo: GEO,
    image: `${BASE}/og-default.jpg`,
    priceRange: "$$",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=32.2396,77.1887`,
    sameAs: [
      opts?.instagramUrl || "https://www.instagram.com/ballus_resort",
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi" },
      { "@type": "LocationFeatureSpecification", name: "Parking" },
      { "@type": "LocationFeatureSpecification", name: "Restaurant" },
      { "@type": "LocationFeatureSpecification", name: "Room Service" },
      { "@type": "LocationFeatureSpecification", name: "Bonfire" },
      { "@type": "LocationFeatureSpecification", name: "Mountain View" },
      { "@type": "LocationFeatureSpecification", name: "River View" },
    ],
    ...(opts?.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: opts.aggregateRating.ratingValue,
        reviewCount: opts.aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

export function restaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Ballu's Café",
    description:
      "A premium handcrafted wooden café in the Beas Valley. Artisan brews, Himalayan cuisine, and panoramic mountain views.",
    url: `${BASE}/cafe`,
    telephone: PHONE,
    address: ADDRESS,
    servesCuisine: ["Himalayan", "Indian", "Continental", "Café"],
  };
}

export function hotelRoomSchema(suite: {
  title: string;
  slug: string;
  viewType?: string;
  amenities?: string[];
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: suite.title,
    description:
      suite.description ||
      `${suite.title} at Ballu's Resort & Café, Manali — ${suite.viewType ?? "scenic"} views.`,
    url: `${BASE}/stays/${suite.slug}`,
    containedInPlace: {
      "@type": "LodgingBusiness",
      name: "Ballu's Resort & Café",
      url: BASE,
    },
    amenityFeature: (suite.amenities ?? []).map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
    })),
  };
}

export function eventVenueSchema(type: "wedding" | "conference" | "banquet") {
  const descriptions: Record<string, string> = {
    wedding:
      "Destination wedding venue in the Himalayas — riverside lawns, mountain backdrops, and indoor banquet halls for 30 to 300+ guests at Ballu's Resort, Manali.",
    conference:
      "Premium conference and corporate retreat venue in Manali with 110+ capacity, full AV setup, on-site accommodation, and in-house catering.",
    banquet:
      "Banquet halls for celebrations, receptions, and events in Manali — Namaste Banquet (110+ indoor) and Devbhumi Banquet (150+ outdoor).",
  };
  const paths: Record<string, string> = {
    wedding: "/weddings",
    conference: "/conferences",
    banquet: "/banquets",
  };
  const capacities: Record<string, number> = {
    wedding: 300,
    conference: 110,
    banquet: 150,
  };
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "Ballu's Resort & Café",
    description: descriptions[type],
    url: `${BASE}${paths[type]}`,
    telephone: PHONE,
    address: ADDRESS,
    geo: GEO,
    maximumAttendeeCapacity: capacities[type],
    containedInPlace: {
      "@type": "LodgingBusiness",
      name: "Ballu's Resort & Café",
      url: BASE,
    },
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
    url: `${BASE}/journal/${post.slug}`,
    image: post.coverImageUrl || `${BASE}/og-default.jpg`,
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

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE}${item.url}`,
    })),
  };
}
