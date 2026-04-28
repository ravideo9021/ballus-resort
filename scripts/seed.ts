import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../lib/schema";

const CONTACT_EMAIL = "ballusresort@gmail.com";
const LEGACY_ADMIN_EMAIL = "admin@ballusresort.com";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("🌱 Seeding database...\n");

  // ─── Admin User ─────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || CONTACT_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    throw new Error(
      "ADMIN_PASSWORD_HASH is required. Generate it with: pnpm hash-password '<admin-password>'"
    );
  }

  await db
    .insert(schema.users)
    .values({ email: adminEmail, passwordHash, role: "admin" })
    .onConflictDoUpdate({
      target: schema.users.email,
      set: {
        passwordHash,
        role: "admin",
      },
    });

  if (adminEmail !== LEGACY_ADMIN_EMAIL) {
    await db
      .delete(schema.users)
      .where(eq(schema.users.email, LEGACY_ADMIN_EMAIL));
  }
  console.log("✓ Admin user created");

  // ─── Site Settings ──────────────────────────────
  await db
    .insert(schema.siteSettings)
    .values({ id: 1, email: CONTACT_EMAIL })
    .onConflictDoUpdate({
      target: schema.siteSettings.id,
      set: {
        email: CONTACT_EMAIL,
        updatedAt: new Date(),
      },
    });
  console.log("✓ Site settings initialized");

  // ─── Pages ──────────────────────────────────────
  const pageData = [
    {
      key: "story",
      title: "The Story of Ballu's",
      body: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Nestled along the pristine banks of the Beas River, at the 14th milestone on the road to Manali, Ballu's Resort & Café began as a dream — a quiet place where the rhythm of the river meets the stillness of the Himalayas.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "What started as a family retreat has grown into one of the valley's most cherished addresses. Every corner of the property has been designed with intention — from the handcrafted wooden café that catches the morning light to the riverside cabins that wake to birdsong and mountain mist.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We believe that hospitality is personal. It's in the warmth of a greeting, the care behind a meal, the quiet attention to detail that turns a stay into a memory. At Ballu's, every guest is family, every visit is a homecoming.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Today, Ballu's Resort & Café is more than an accommodation — it's a destination. A place for celebration, reflection, and discovery. Whether you're here for a quiet weekend, a grand wedding, or simply a cup of mountain coffee, you'll find something rare: a place that feels truly yours.",
              },
            ],
          },
        ],
      }),
      seoTitle: "Our Story — Ballu's Resort & Café, Manali",
      seoDescription:
        "Discover the story behind Ballu's Resort & Café — a riverside sanctuary in the Beas Valley, Manali.",
    },
    {
      key: "cafe",
      title: "Ballu's Café",
      body: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "A premium handcrafted wooden café nestled in the snow-kissed valley. Sip artisan brews, savor Himalayan cuisine, and soak in panoramic views of the mountains and the Beas. Open all day, from early mountain mornings to bonfire evenings.",
              },
            ],
          },
        ],
      }),
      seoTitle: "Ballu's Café — Mountain Coffee & Himalayan Cuisine, Manali",
      seoDescription:
        "Artisan brews, Himalayan cuisine, and panoramic mountain views at Ballu's Café in Manali.",
    },
    {
      key: "weddings",
      title: "Destination Weddings",
      body: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Mountain peaks. River breezes. Memories that last forever. Ballu's Resort offers three stunning venues for your dream Himalayan wedding — the open-air Bliss Valley Lawn, the grand Devbhumi Banquet, and the elegant indoor Namaste Banquet.",
              },
            ],
          },
        ],
      }),
      seoTitle:
        "Destination Weddings in Manali — Ballu's Resort & Café",
      seoDescription:
        "Plan your dream destination wedding in the Himalayas at Ballu's Resort, Manali. Riverside venues, mountain views, and personal service.",
    },
    {
      key: "conferences",
      title: "Conferences & Corporate Events",
      body: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Host your next corporate gathering in the heart of the Himalayas. With capacity for 110+ guests, dedicated AV setup, a registration desk, ample parking, in-house buffet catering, and on-site accommodation, Ballu's Resort is the ideal venue for conferences, team retreats, and corporate events.",
              },
            ],
          },
        ],
      }),
      seoTitle: "Conference Venue in Manali — Ballu's Resort",
      seoDescription:
        "Premium conference and corporate event venue in Manali with 110+ capacity, AV setup, and on-site accommodation.",
    },
    {
      key: "banquets",
      title: "Banquet Halls",
      body: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Two distinctive banquet spaces, each with its own character. The Namaste Banquet offers an elegant indoor setting for up to 110 guests, while the Devbhumi Banquet provides a grand outdoor experience with mountain views. Together with the Bliss Valley Lawn, they create the perfect trio for any celebration.",
              },
            ],
          },
        ],
      }),
      seoTitle: "Banquet Halls — Namaste & Devbhumi at Ballu's Resort, Manali",
      seoDescription:
        "Indoor and outdoor banquet halls at Ballu's Resort, Manali. Namaste Banquet (110+ indoor) and Devbhumi Banquet (grand outdoor).",
    },
    {
      key: "experiences",
      title: "Experiences Near Ballu's",
      body: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Manali and the Kullu Valley offer adventures for every season. From snow-covered passes to ancient temples, from bustling bazaars to quiet forest trails — explore the best of the Himalayas from your base at Ballu's.",
              },
            ],
          },
        ],
      }),
      seoTitle: "Things to Do Near Manali — Ballu's Resort",
      seoDescription:
        "Discover attractions near Ballu's Resort in Manali — Solang Valley, Old Manali, Hadimba Temple, Rohtang Pass, and more.",
    },
  ];

  for (const page of pageData) {
    await db.insert(schema.pages).values(page).onConflictDoNothing();
  }
  console.log("✓ Pages seeded");

  // ─── Suites ─────────────────────────────────────
  await db
    .insert(schema.suites)
    .values([
      {
        slug: "himalayan-suites",
        title: "Himalayan Suites",
        viewType: "Mountain",
        description: JSON.stringify({
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Wake to the sight of snow-capped Himalayan peaks from your private balcony. The Himalayan Suites are designed for guests who seek a mountain perspective — spacious rooms with warm wooden interiors, plush bedding, and floor-to-ceiling windows framing the most spectacular views in the valley.",
                },
              ],
            },
          ],
        }),
        amenities: [
          "Mountain View",
          "Private Balcony",
          "Wi-Fi",
          "Hot Water",
          "Room Service",
          "TV",
          "Heating",
          "Parking",
        ],
        order: 1,
      },
      {
        slug: "beas-suites",
        title: "Beas Suites",
        viewType: "River",
        description: JSON.stringify({
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Fall asleep to the gentle murmur of the Beas River, mere steps from your door. The Beas Suites offer a rare intimacy with the river — premium rooms with riverside balconies, natural wood finishes, and the kind of quiet that only moving water can bring.",
                },
              ],
            },
          ],
        }),
        amenities: [
          "River View",
          "Private Balcony",
          "Wi-Fi",
          "Hot Water",
          "Room Service",
          "TV",
          "Heating",
          "Parking",
        ],
        order: 2,
      },
    ])
    .onConflictDoNothing();
  console.log("✓ Suites seeded");

  // ─── FAQs ──────────────────────────────────────
  const faqData = [
    {
      category: "Stay",
      question: "What are the check-in and check-out times?",
      answer: "Check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available on request, subject to availability.",
      order: 1,
    },
    {
      category: "Stay",
      question: "Do you offer airport or bus station transfers?",
      answer: "Yes, we can arrange pick-up and drop-off from Bhuntar Airport (Kullu) or Manali Bus Stand. Please mention this when making your inquiry and we'll coordinate the details.",
      order: 2,
    },
    {
      category: "Stay",
      question: "Is parking available at the resort?",
      answer: "Yes, we have ample free parking for all guests. The parking area is within the resort premises and is monitored.",
      order: 3,
    },
    {
      category: "Dining",
      question: "What kind of cuisine does the café serve?",
      answer: "Ballu's Café serves a mix of Himalayan specialties, North Indian favorites, continental dishes, and artisan coffee and tea. We source local ingredients wherever possible.",
      order: 4,
    },
    {
      category: "Dining",
      question: "Is the café open to non-guests?",
      answer: "Absolutely! The café is open to everyone. Drop in for a coffee, a meal, or simply to enjoy the mountain views. No reservation needed for café visits.",
      order: 5,
    },
    {
      category: "Weddings",
      question: "What is the maximum capacity for a wedding?",
      answer: "Our largest venue, the Bliss Valley Lawn combined with the Devbhumi Banquet, can accommodate 200+ guests. For intimate ceremonies, the Namaste Banquet comfortably seats 110+ guests indoors.",
      order: 6,
    },
    {
      category: "Weddings",
      question: "Do you provide wedding planning services?",
      answer: "We work with trusted local wedding planners and can connect you with decorators, caterers, photographers, and entertainment. Our team assists with logistics, accommodation, and on-ground coordination.",
      order: 7,
    },
    {
      category: "Travel",
      question: "How do I get to Ballu's Resort from Delhi?",
      answer: "The most common route is Delhi → Chandigarh → Manali by road (approx. 12-14 hours by car or overnight Volvo bus). You can also fly to Bhuntar Airport (Kullu) from Delhi (1 hour) and drive to the resort (45 minutes).",
      order: 8,
    },
    {
      category: "Travel",
      question: "What is the best time to visit Manali?",
      answer: "Manali is beautiful year-round. Summer (April–June) offers pleasant weather. Monsoon (July–September) brings lush greenery. Autumn (October–November) has clear mountain views. Winter (December–March) brings snow and a magical landscape.",
      order: 9,
    },
    {
      category: "Policies",
      question: "What is the cancellation policy?",
      answer: "Cancellations made 7+ days before check-in receive a full refund. Cancellations within 3-7 days receive a 50% refund. Cancellations within 3 days are non-refundable. Special event bookings (weddings, conferences) have separate policies discussed during booking.",
      order: 10,
    },
  ];

  // Idempotent — delete all before insert (no unique key on question)
  await db.delete(schema.faqs);
  for (const faq of faqData) {
    await db.insert(schema.faqs).values({
      ...faq,
      answer: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: faq.answer }],
          },
        ],
      }),
    });
  }
  console.log("✓ FAQs seeded");

  // ─── Testimonials ──────────────────────────────
  // Idempotent — no unique key on author/quote
  await db.delete(schema.testimonials);
  await db
    .insert(schema.testimonials)
    .values([
      {
        authorName: "Priya & Vikram",
        location: "Delhi — Wedding, March 2024",
        quote:
          "Our wedding at Ballu's was nothing short of magical. The Bliss Valley Lawn with the mountains as our backdrop — every guest said it was the most beautiful wedding they'd attended. The team made everything effortless.",
        rating: 5,
        featured: true,
      },
      {
        authorName: "Ankit Sharma",
        location: "Mumbai — Family Stay, December 2024",
        quote:
          "We came for the snow and stayed for the hospitality. The Himalayan Suite was warm and beautiful, the café served the best coffee we had in all of Manali, and the bonfire evening was the highlight of our trip.",
        rating: 5,
        featured: true,
      },
      {
        authorName: "Meera Reddy",
        location: "Bangalore — Solo Trip, October 2024",
        quote:
          "Sometimes you find a place that just feels right. Ballu's is that place. I spent three days reading by the river, sipping chai at the café, and walking the trails. Pure peace. I'll be back.",
        rating: 5,
        featured: true,
      },
    ])
    .onConflictDoNothing();
  console.log("✓ Testimonials seeded");

  // ─── Experiences ───────────────────────────────
  // Idempotent — no unique key on name
  await db.delete(schema.experiences);
  await db
    .insert(schema.experiences)
    .values([
      {
        name: "Solang Valley",
        distance: "14 km",
        driveTime: "30 min",
        description:
          "Adventure hub for paragliding, zorbing, and skiing in winter. Stunning meadows surrounded by glacial peaks.",
        seasonTags: ["Summer", "Winter"],
        imageUrl: "/seed/experience-solang.jpg",
        order: 1,
      },
      {
        name: "Old Manali",
        distance: "8 km",
        driveTime: "20 min",
        description:
          "Charming village with cobblestone lanes, cozy cafés, artisan shops, and the historic Manu Temple.",
        seasonTags: ["Year-round"],
        imageUrl: "/seed/experience-oldmanali.jpg",
        order: 2,
      },
      {
        name: "Hadimba Temple",
        distance: "10 km",
        driveTime: "25 min",
        description:
          "Ancient pagoda-style temple nestled in a cedar forest, dedicated to the goddess Hadimba. A Manali landmark.",
        seasonTags: ["Year-round"],
        imageUrl: "/seed/experience-hadimba.jpg",
        order: 3,
      },
      {
        name: "Mall Road",
        distance: "9 km",
        driveTime: "20 min",
        description:
          "The heart of Manali town. Shopping, street food, and the energy of a Himalayan hill station.",
        seasonTags: ["Year-round"],
        imageUrl: "/seed/experience-mallroad.jpg",
        order: 4,
      },
      {
        name: "Rohtang Pass",
        distance: "51 km",
        driveTime: "2.5 hrs",
        description:
          "High-altitude pass at 13,050 ft offering breathtaking views, snow activities, and the gateway to Lahaul-Spiti.",
        seasonTags: ["Summer", "Autumn"],
        imageUrl: "/seed/experience-rohtang.jpg",
        order: 5,
      },
      {
        name: "Naggar Castle",
        distance: "26 km",
        driveTime: "45 min",
        description:
          "Medieval stone castle turned heritage hotel with panoramic valley views, the Roerich Art Gallery, and serene gardens.",
        seasonTags: ["Year-round"],
        imageUrl: "/seed/experience-naggar.jpg",
        order: 6,
      },
    ])
    .onConflictDoNothing();
  console.log("✓ Experiences seeded");

  // ─── Blog Post ─────────────────────────────────
  await db
    .insert(schema.posts)
    .values({
      slug: "what-to-pack-for-manali-in-winter",
      title: "What to Pack for Manali in Winter",
      excerpt:
        "A complete packing guide for your winter trip to Manali — from thermals to snow boots, here's everything you need for a comfortable Himalayan escape.",
      coverImageUrl: "/seed/blog-winter.jpg",
      body: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Layering is Everything" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Manali winters are beautiful but demanding. Temperatures can drop to -5°C at night, and daytime hovers around 5-10°C. The key to staying comfortable? Smart layering.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "The Essentials" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Thermal innerwear (top and bottom) — at least 2 sets",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "A heavy down jacket or parka — your most important item",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Waterproof snow boots with good grip",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Wool socks (3-4 pairs), gloves, a warm cap, and a scarf",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Sunglasses and sunscreen — snow glare is real",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Moisturizer and lip balm — the cold air is very dry",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Pro Tips" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Don't pack too many heavy items — you can always buy affordable woolens at Mall Road. Focus on one great jacket, good thermals, and waterproof boots. Everything else is bonus. And don't worry about your room being cold at Ballu's — every suite has heating, hot water, and enough blankets to build a fort.",
              },
            ],
          },
        ],
      }),
      tags: ["Travel Tips", "Winter", "Manali"],
      published: true,
      publishedAt: new Date("2024-11-15"),
      seoTitle: "What to Pack for Manali in Winter — Ballu's Resort Guide",
      seoDescription:
        "Complete winter packing guide for Manali. Thermals, snow boots, layering tips, and everything you need for a comfortable Himalayan trip.",
    })
    .onConflictDoNothing();
  console.log("✓ Blog post seeded");

  // ─── Site Images (Slot System) ─────────────────
  const imageSlots: { slotKey: string; label: string; description?: string }[] = [
    { slotKey: "home.hero", label: "Home — Hero image", description: "Main hero image at the top of the homepage." },
    { slotKey: "home.intro.side", label: "Home — Intro side image", description: "Image beside the welcome intro paragraph." },
    { slotKey: "home.weddings.teaser", label: "Home — Weddings teaser background", description: "Full-bleed weddings teaser background." },
    { slotKey: "story.hero", label: "Story page — Hero", description: "Hero image for /story." },
    { slotKey: "stays.hero", label: "Stays index — Hero", description: "Hero image for /stays." },
    { slotKey: "suites.himalayan.hero", label: "Himalayan Suites — Hero image", description: "Hero image for the Himalayan Suites detail page." },
    { slotKey: "suites.beas.hero", label: "Beas Suites — Hero image", description: "Hero image for the Beas Suites detail page." },
    { slotKey: "cafe.hero", label: "Café page — Hero", description: "Hero image for /cafe." },
    { slotKey: "weddings.hero", label: "Weddings page — Hero", description: "Hero image for /weddings." },
    { slotKey: "conferences.hero", label: "Conferences page — Hero", description: "Hero image for /conferences." },
    { slotKey: "banquets.hero", label: "Banquets index — Hero", description: "Hero image for /banquets." },
    { slotKey: "banquets.namaste.hero", label: "Namaste Banquet — Photo", description: "Photo of the indoor Namaste banquet hall." },
    { slotKey: "banquets.devbhumi.hero", label: "Devbhumi Banquet — Photo", description: "Photo of the outdoor Devbhumi banquet / Bliss Valley Lawn." },
    { slotKey: "experiences.hero", label: "Experiences page — Hero", description: "Hero image for /experiences." },
    { slotKey: "journal.hero", label: "Journal index — Hero", description: "Hero image for /journal." },
    { slotKey: "faq.hero", label: "FAQ page — Hero", description: "Hero image for /faq." },
    { slotKey: "contact.hero", label: "Contact page — Hero", description: "Hero image for /contact." },
    { slotKey: "og.default", label: "Default social share image (Open Graph)", description: "1200×630 image used when a page shares to social without a specific image." },
  ];
  for (const slot of imageSlots) {
    await db
      .insert(schema.siteImages)
      .values({ slotKey: slot.slotKey, label: slot.label, description: slot.description ?? null })
      .onConflictDoUpdate({
        target: schema.siteImages.slotKey,
        set: { label: slot.label, description: slot.description ?? null },
      });
  }
  console.log(`✓ Site image slots seeded (${imageSlots.length})`);

  console.log("\n✅ Seeding complete!");
}

seed().catch((e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
