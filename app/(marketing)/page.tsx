import Link from "next/link";
import { ArrowRight, ChevronDown, MapPin, Phone, Mail } from "lucide-react";
import { KenBurnsImage } from "@/components/motion/ken-burns-image";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/fade-up";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ManagedImage } from "@/components/marketing/managed-image";
import { extractTextContent } from "@/components/marketing/rich-content";
import {
  getGalleryImagePool,
  getPublicExperiences,
  getPublicSuites,
  getPublishedPosts,
  getSiteSettings,
  pickImagesByCategory,
  resolveManagedImage,
} from "@/lib/public-content";
import { resolveSlotOr, resolveSlotImage } from "@/lib/site-images";

export default async function HomePage() {
  const [settings, galleryPool, suites, posts, experiences] = await Promise.all([
    getSiteSettings(),
    getGalleryImagePool(),
    getPublicSuites(),
    getPublishedPosts(3),
    getPublicExperiences(),
  ]);

  const suiteBySlug = new Map(suites.map((suite) => [suite.slug, suite]));
  const himalayanSuite = suiteBySlug.get("himalayan-suites");
  const beasSuite = suiteBySlug.get("beas-suites");

  const [
    heroImage,
    propertyImage,
    introImage,
    cafeImage,
    weddingImage,
    conferenceImage,
    himalayanImage,
    beasImage,
  ] = await Promise.all([
    resolveSlotOr(
      "home.hero",
      resolveManagedImage(settings?.heroImageUrl, galleryPool, [
        "hero",
        "property",
        "resort",
        "homepage",
      ])
    ),
    // propertyImage isn't a named slot — keep gallery resolution
    Promise.resolve(
      resolveManagedImage(null, galleryPool, ["property", "resort", "exterior"])
    ),
    resolveSlotOr(
      "home.intro.side",
      resolveManagedImage(null, galleryPool, [
        "intro",
        "story",
        "river",
        "property",
      ])
    ),
    resolveSlotOr(
      "cafe.hero",
      resolveManagedImage(null, galleryPool, ["cafe", "food"])
    ),
    resolveSlotOr(
      "home.weddings.teaser",
      resolveManagedImage(null, galleryPool, ["weddings", "wedding", "events"])
    ),
    Promise.resolve(
      resolveManagedImage(null, galleryPool, [
        "conferences",
        "conference",
        "events",
        "banquets",
      ])
    ),
    resolveSlotOr(
      "suites.himalayan.hero",
      resolveManagedImage(himalayanSuite?.managedImages[0]?.url, galleryPool, [
        "himalayan",
        "suite",
        "cabins",
        "stays",
      ])
    ),
    resolveSlotOr(
      "suites.beas.hero",
      resolveManagedImage(beasSuite?.managedImages[0]?.url, galleryPool, [
        "beas",
        "suite",
        "cabins",
        "stays",
      ])
    ),
  ]);

  const heroHeadline = settings?.heroHeadline || "Ballu's";
  const heroTagline =
    settings?.heroTagline || "Where the River Meets the Mountains";
  const heroEyebrow = "Premium Himalayan Resort & Café";
  const heroAlt = `${heroHeadline} hero image`;

  const teaserPool = pickImagesByCategory(galleryPool, 5);
  const teaserImages = Array.from({ length: 5 }, (_, index) => {
    const image = teaserPool[index] ?? null;
    return image
      ? { url: image.url, alt: image.alt }
      : { url: null, alt: "Ballu's Resort gallery image" };
  });

  const journalFallbackImages = pickImagesByCategory(galleryPool, 3, [
    "journal",
    "blog",
    "property",
    "weddings",
  ]);

  const journalCards = posts.length
    ? posts.map((post, index) => ({
        slug: post.slug,
        title: post.title,
        date: post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
        img:
          resolveManagedImage(post.managedCoverImageUrl, galleryPool, [
            "journal",
            "blog",
          ]) ?? journalFallbackImages[index]?.url ?? null,
        excerpt:
          post.excerpt ||
          extractTextContent(post.body).slice(0, 140) ||
          "Read the latest notes from the valley.",
      }))
    : [
        {
          slug: "",
          title: "Stories Coming Soon",
          date: "",
          img: journalFallbackImages[0]?.url ?? null,
          excerpt: "New stories, travel notes, and seasonal guides will appear here.",
        },
        {
          slug: "",
          title: "Valley Notes",
          date: "",
          img: journalFallbackImages[1]?.url ?? null,
          excerpt: "From local tips to hidden gems around Manali.",
        },
        {
          slug: "",
          title: "Experiences & Seasons",
          date: "",
          img: journalFallbackImages[2]?.url ?? null,
          excerpt: "Plan your trip with seasonal insights from Ballu's.",
        },
      ];

  const experienceFallbackImages = pickImagesByCategory(galleryPool, 6, [
    "experiences",
    "events",
    "snow",
    "monsoon",
    "adventure",
  ]);

  const valleySlots: Record<string, string> = {
    "Solang Valley": "valley.solang",
    "Old Manali": "valley.old-manali",
    "Hadimba Temple": "valley.hadimba",
    "Mall Road": "valley.mall-road",
    "Rohtang Pass": "valley.rohtang",
    "Naggar Castle": "valley.naggar",
  };

  const experienceCards = await Promise.all(
    (experiences.length
      ? experiences.slice(0, 6)
      : [
          { name: "Solang Valley", distance: "14 km", driveTime: "30 min", managedImageUrl: null },
          { name: "Old Manali", distance: "8 km", driveTime: "20 min", managedImageUrl: null },
          { name: "Hadimba Temple", distance: "10 km", driveTime: "25 min", managedImageUrl: null },
          { name: "Mall Road", distance: "9 km", driveTime: "20 min", managedImageUrl: null },
          { name: "Rohtang Pass", distance: "51 km", driveTime: "2.5 hrs", managedImageUrl: null },
          { name: "Naggar Castle", distance: "26 km", driveTime: "45 min", managedImageUrl: null },
        ]
    ).map(async (experience, index) => {
      const managed = resolveManagedImage(experience.managedImageUrl, galleryPool, [
        "experiences", "events", "adventure",
      ]);
      const slotKey = valleySlots[experience.name];
      const slotImg = slotKey ? (await resolveSlotImage(slotKey)).url : null;
      return {
        name: experience.name,
        dist: `${experience.distance} · ${experience.driveTime}`,
        img: managed ?? slotImg ?? experienceFallbackImages[index]?.url ?? null,
      };
    })
  );

  const contactPhone = settings?.phone || "+91 8796017034";
  const contactEmail = settings?.email || "ballusresort@gmail.com";
  const whatsappNumber = settings?.whatsapp || "918796017034";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const contactAddress =
    settings?.address || "14 Mile Road, Beas Riverside, Manali — 175131";

  return (
    <>
      {/* ─── 1. HERO ─────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden bg-[#0B1B22]">
        {heroImage ? (
          <KenBurnsImage src={heroImage} alt={heroAlt} priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F3B47] to-[#0B1B22]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/40 to-[#0B1B22]/20" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <FadeUp delay={0.2}>
            <p className="eyebrow text-[#C9A24B] mb-6">
              {heroEyebrow}
            </p>
          </FadeUp>
          <FadeUp delay={0.4} duration={1}>
            <h1 className="heading-display text-[#F5EFE3] text-6xl md:text-8xl lg:text-9xl mb-6">
              {heroHeadline}
            </h1>
          </FadeUp>
          <FadeUp delay={0.7}>
            <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl mb-12 max-w-2xl">
              {heroTagline}
            </p>
          </FadeUp>
          <FadeUp delay={1}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A24B] text-[#0B1B22] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#E5C97A] transition-colors"
              >
                Plan Your Stay <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#intro"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#F5EFE3]/30 text-[#F5EFE3] text-xs uppercase tracking-[0.25em] font-semibold hover:border-[#C9A24B] hover:text-[#C9A24B] transition-colors"
              >
                Explore
              </a>
            </div>
          </FadeUp>
        </div>

        <a
          href="#intro"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#F5EFE3]/60 hover:text-[#C9A24B] transition-colors"
          aria-label="Scroll down"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </section>

      {/* ─── 2. WELCOME / INTRO ─────────────────────────── */}
      <section id="intro" className="bg-[#0B1B22] text-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <p className="eyebrow mb-5">An Introduction</p>
              <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-8">
                A riverside sanctuary<br /> in the Beas Valley
              </h2>
              <p className="text-[#F5EFE3]/70 text-lg leading-relaxed mb-6">
                Where the roar of the Beas River meets the stillness of the Himalayas, Ballu&apos;s Resort
                &amp; Café offers a rare combination — the energy of flowing water and the peace of
                mountain peaks. Every suite, every meal, every moment here is designed to honor that balance.
              </p>
              <p className="text-[#F5EFE3]/70 text-lg leading-relaxed">
                Whether you&apos;re here for a weekend retreat, a celebration with family,
                or simply to escape the rhythm of cities, you&apos;ll find something rare at Ballu&apos;s:
                a place that feels truly yours.
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="relative aspect-[4/5] w-full">
                <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-[#C9A24B]" />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-[#C9A24B]" />
                <ManagedImage
                  src={introImage}
                  alt="Riverside view at Ballu's Resort"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeUp>
          </div>

          {/* Counters */}
          <FadeUp delay={0.4}>
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/10 pt-16">
              {[
                { value: 14, suffix: "", label: "Mile Road" },
                { value: 360, suffix: "°", label: "Himalayan Views" },
                { value: 110, suffix: "+", label: "Guest Capacity" },
                { value: 24, suffix: "/7", label: "Café Open" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="heading-display text-5xl md:text-6xl text-[#C9A24B] mb-3">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#F5EFE3]/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 3. PILLARS ───────────────────────────────────── */}
      <section className="bg-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="What We Offer"
            headline="Four ways to experience Ballu's"
            dark={false}
          />

          <StaggerGroup className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { href: "/stays", label: "Stay", img: himalayanImage, tagline: "Mountain &amp; riverside suites" },
              { href: "/cafe", label: "Café", img: cafeImage, tagline: "Artisan brews &amp; Himalayan cuisine" },
              { href: "/weddings", label: "Weddings", img: weddingImage, tagline: "Destination weddings in the valley" },
              { href: "/conferences", label: "Conferences", img: conferenceImage, tagline: "Corporate venue for 110+" },
            ].map((pillar, i) => (
              <StaggerItem key={i}>
                <Link href={pillar.href} className="group block relative">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0B1B22]">
                    <ManagedImage
                      src={pillar.img}
                      alt={pillar.label}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22]/80 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="h-px w-12 bg-[#C9A24B] mb-4 transition-all duration-500 group-hover:w-20" />
                    <h3 className="heading-serif text-[#F5EFE3] text-2xl mb-1">{pillar.label}</h3>
                    <p className="text-[#F5EFE3]/80 text-sm" dangerouslySetInnerHTML={{ __html: pillar.tagline }} />
                    <span className="mt-4 inline-flex items-center gap-2 text-[#C9A24B] text-xs uppercase tracking-[0.25em]">
                      Discover <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ─── 4. THE PROPERTY ─────────────────────────────── */}
      <section className="bg-[#0B1B22] text-[#F5EFE3]">
        <div className="grid lg:grid-cols-2">
          <FadeUp className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[700px]">
            <ManagedImage
              src={propertyImage}
              alt="Ballu's Resort property — exterior view"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </FadeUp>

          <FadeUp delay={0.2} className="flex items-center px-6 md:px-16 py-20 lg:py-0">
            <div className="max-w-xl">
              <p className="eyebrow mb-5">The Property</p>
              <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-8">
                A valley built<br />for slow living
              </h2>
              <p className="text-[#F5EFE3]/70 text-lg leading-relaxed mb-8">
                Every detail of Ballu&apos;s has been shaped with intention — from the handcrafted
                wooden café that catches the morning sun to the quiet corners where you can simply
                sit and listen to the river.
              </p>

              <ul className="space-y-3 text-[#F5EFE3]/80">
                {[
                  "Handcrafted indoor café",
                  "Two banquet halls (indoor &amp; outdoor)",
                  "Bliss Valley open-air lawn",
                  "Riverside premium suites",
                  "Ample parking &amp; bonfire area",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-px bg-[#C9A24B]" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 5. SUITES PREVIEW ───────────────────────────── */}
      <section className="bg-[#0B1B22] text-[#F5EFE3] py-24 md:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Stays"
            headline="Two character-rooms, one valley"
            subhead="Wake to mountains or the river — both are yours to choose."
          />

          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {[
              {
                href: "/stays/himalayan-suites",
                title: "Himalayan Suites",
                desc: "Mountain-view rooms with wooden warmth and panoramic Himalayan vistas.",
                img: himalayanImage,
              },
              {
                href: "/stays/beas-suites",
                title: "Beas Suites",
                desc: "Riverside sanctuaries, steps from the water, with private balconies.",
                img: beasImage,
              },
            ].map((suite, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <Link href={suite.href} className="group block">
                  <div className="relative aspect-[5/6] overflow-hidden mb-6">
                    <ManagedImage
                      src={suite.img}
                      alt={suite.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                    />
                  </div>
                  <h3 className="heading-serif text-3xl md:text-4xl text-[#F5EFE3] mb-2">
                    {suite.title}
                  </h3>
                  <p className="text-[#F5EFE3]/70 mb-4">{suite.desc}</p>
                  <span className="inline-flex items-center gap-2 text-[#C9A24B] text-xs uppercase tracking-[0.25em]">
                    View Suite <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.4} className="mt-12 text-center">
            <Link
              href="/stays"
              className="inline-flex items-center gap-2 text-[#C9A24B] text-xs uppercase tracking-[0.25em] border-b border-[#C9A24B]/50 pb-1 hover:border-[#C9A24B] transition-colors"
            >
              All accommodations <ArrowRight className="w-3 h-3" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ─── 6. THE CAFÉ ─────────────────────────────────── */}
      <section className="bg-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div className="relative aspect-[4/5] w-full">
              <ManagedImage
                src={cafeImage}
                alt="Ballu's Café — handcrafted wooden interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="eyebrow mb-5">Ballu&apos;s Café</p>
            <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-[#0B1B22] mb-8">
              Slow mornings,<br />mountain coffee
            </h2>
            <p className="text-[#0B1B22]/70 text-lg leading-relaxed mb-6">
              A premium handcrafted wooden café nestled in the snow-kissed valley.
              Sip artisan brews, savor Himalayan cuisine, and soak in panoramic views
              of the mountains and the Beas.
            </p>

            <ul className="space-y-2 mb-8 text-[#0B1B22]/80">
              {["Artisan brews &amp; loose-leaf teas", "Himalayan &amp; continental cuisine", "All-day dining", "Bonfire evenings"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-6 h-px bg-[#C9A24B]" />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>

            <Link
              href="/cafe"
              className="inline-flex items-center gap-2 text-[#1A6B7A] text-xs uppercase tracking-[0.25em] border-b border-[#1A6B7A]/50 pb-1 hover:border-[#C9A24B] hover:text-[#C9A24B] transition-colors"
            >
              Visit the café <ArrowRight className="w-3 h-3" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ─── 7. WEDDINGS TEASER ─────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage
          src={weddingImage}
          alt="Destination wedding at Ballu's Resort"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0B1B22]/60" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <FadeUp>
            <p className="eyebrow mb-5">Destination Weddings</p>
            <h2 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl mb-6">
              Where vows echo<br />through mountains
            </h2>
            <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl mb-10 max-w-xl mx-auto">
              Mountain peaks. River breezes. Memories that last forever.
            </p>
            <Link
              href="/weddings"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A24B] text-[#0B1B22] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#E5C97A] transition-colors"
            >
              Plan Your Wedding <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ─── 8. GALLERY TEASER ──────────────────────────── */}
      <section className="bg-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Moments"
            headline="Moments at Ballu's"
            dark={false}
          />

          <FadeUp delay={0.2} className="mt-16 grid grid-cols-6 grid-rows-3 gap-3 md:gap-4 aspect-[2/1]">
            <Link href="/gallery" className="col-span-3 row-span-3 relative overflow-hidden group">
              <ManagedImage src={teaserImages[0].url} alt={teaserImages[0].alt} fill sizes="50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-[#C9A24B] transition-all" />
            </Link>
            <Link href="/gallery" className="col-span-3 row-span-2 relative overflow-hidden group">
              <ManagedImage src={teaserImages[1].url} alt={teaserImages[1].alt} fill sizes="50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-[#C9A24B] transition-all" />
            </Link>
            <Link href="/gallery" className="col-span-1 row-span-1 relative overflow-hidden group">
              <ManagedImage src={teaserImages[2].url} alt={teaserImages[2].alt} fill sizes="17vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-[#C9A24B] transition-all" />
            </Link>
            <Link href="/gallery" className="col-span-1 row-span-1 relative overflow-hidden group">
              <ManagedImage src={teaserImages[3].url} alt={teaserImages[3].alt} fill sizes="17vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-[#C9A24B] transition-all" />
            </Link>
            <Link href="/gallery" className="col-span-1 row-span-1 relative overflow-hidden group">
              <ManagedImage src={teaserImages[4].url} alt={teaserImages[4].alt} fill sizes="17vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-[#C9A24B] transition-all" />
            </Link>
          </FadeUp>

          <FadeUp delay={0.4} className="mt-12 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-[#1A6B7A] text-xs uppercase tracking-[0.25em] border-b border-[#1A6B7A]/50 pb-1 hover:border-[#C9A24B] hover:text-[#C9A24B] transition-colors"
            >
              Open the full gallery <ArrowRight className="w-3 h-3" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ─── 9. TESTIMONIALS ────────────────────────────── */}
      <section className="bg-[#0F3B47] text-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeUp>
            <p className="eyebrow mb-5">Guest Voices</p>
            <div className="text-[#C9A24B] text-6xl mb-4 heading-display leading-none">&ldquo;</div>
            <p className="heading-serif italic text-2xl md:text-3xl text-[#F5EFE3] leading-relaxed mb-10 max-w-3xl mx-auto">
              Our wedding at Ballu&apos;s was nothing short of magical. The Bliss Valley Lawn
              with the mountains as our backdrop — every guest said it was the most beautiful
              wedding they&apos;d attended. The team made everything effortless.
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#E5C97A]">
              Priya &amp; Vikram — Delhi, Wedding March 2024
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── 10. JOURNAL PREVIEW ────────────────────────── */}
      <section className="bg-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Journal"
            headline="Notes from the valley"
            dark={false}
          />

          <StaggerGroup className="mt-16 grid md:grid-cols-3 gap-8">
            {journalCards.map((post, i) => (
              <StaggerItem key={i}>
                <Link href={post.slug ? `/journal/${post.slug}` : "/journal"} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden mb-5">
                    <ManagedImage src={post.img} alt={post.title} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  {post.date ? (
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A24B] mb-3">{post.date}</p>
                  ) : null}
                  <h3 className="heading-serif text-2xl text-[#0B1B22] mb-2 group-hover:text-[#1A6B7A] transition-colors">{post.title}</h3>
                  <p className="text-[#0B1B22]/70 text-sm leading-relaxed">{post.excerpt}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <FadeUp delay={0.4} className="mt-12 text-center">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 text-[#1A6B7A] text-xs uppercase tracking-[0.25em] border-b border-[#1A6B7A]/50 pb-1 hover:border-[#C9A24B] hover:text-[#C9A24B] transition-colors"
            >
              Read the journal <ArrowRight className="w-3 h-3" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ─── 11. EXPERIENCES ────────────────────────────── */}
      <section className="bg-[#0B1B22] text-[#F5EFE3] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <SectionHeading
            eyebrow="Beyond the Resort"
            headline="The valley, at your doorstep"
            subhead="From snow-covered passes to ancient temples, the best of Manali begins here."
          />
        </div>

        <FadeUp delay={0.2}>
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <div className="flex gap-5 px-6 md:px-12 pb-4">
              {experienceCards.map((exp, i) => (
                <Link
                  key={i}
                  href="/experiences"
                  className="snap-start flex-shrink-0 w-[280px] md:w-[320px] group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden mb-4 bg-[#0F3B47]">
                    <ManagedImage src={exp.img} alt={exp.name} fill sizes="320px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="heading-serif text-2xl text-[#F5EFE3] mb-1">{exp.name}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#C9A24B]">{exp.dist}</p>
                </Link>
              ))}
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ─── 12. FINAL CTA ──────────────────────────────── */}
      <section className="bg-[#0F3B47] text-[#F5EFE3] py-24 md:py-32 border-t border-[#C9A24B]/20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <FadeUp>
            <p className="eyebrow mb-5">Your Himalayan Escape</p>
            <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-6">
              Begin your Himalayan escape
            </h2>
            <p className="text-[#F5EFE3]/70 text-lg max-w-2xl mx-auto mb-16">
              Our team is ready to craft a visit that suits you. Reach out and we&apos;ll
              respond within 24 hours.
            </p>
          </FadeUp>

          <StaggerGroup className="grid md:grid-cols-3 gap-8 mb-12">
            <StaggerItem>
              <div className="p-6 border border-white/10 hover:border-[#C9A24B] transition-colors group">
                <MapPin className="w-6 h-6 text-[#C9A24B] mx-auto mb-4" />
                <h3 className="eyebrow mb-3">Visit</h3>
                <p className="text-[#F5EFE3]/80 text-sm">{contactAddress}</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-6 border border-white/10 hover:border-[#C9A24B] transition-colors group">
                <Phone className="w-6 h-6 text-[#C9A24B] mx-auto mb-4" />
                <h3 className="eyebrow mb-3">Speak With Us</h3>
                <a href={`tel:${contactPhone.replace(/\s+/g, "")}`} className="text-[#F5EFE3] text-sm hover:text-[#C9A24B]">{contactPhone}</a>
                <br />
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-[#C9A24B] text-xs uppercase tracking-[0.2em]">WhatsApp</a>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-6 border border-white/10 hover:border-[#C9A24B] transition-colors group">
                <Mail className="w-6 h-6 text-[#C9A24B] mx-auto mb-4" />
                <h3 className="eyebrow mb-3">Stay in Touch</h3>
                <a href={`mailto:${contactEmail}`} className="text-[#F5EFE3]/80 text-sm hover:text-[#C9A24B]">{contactEmail}</a>
              </div>
            </StaggerItem>
          </StaggerGroup>

          <FadeUp delay={0.4}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#C9A24B] text-[#0B1B22] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#E5C97A] transition-colors"
            >
              Send an Inquiry <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
