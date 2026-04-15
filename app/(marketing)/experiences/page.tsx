import type { Metadata } from "next";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/fade-up";
import { MapPin, Clock } from "lucide-react";
import { ManagedImage } from "@/components/marketing/managed-image";
import {
  getGalleryImagePool,
  getPublicExperiences,
  pickImagesByCategory,
  resolveManagedImage,
} from "@/lib/public-content";
import { resolveSlotOr } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Experiences Near Ballu's",
  description:
    "Discover attractions near Ballu's Resort in Manali — Solang Valley, Old Manali, Hadimba Temple, Rohtang Pass, and more.",
};

export default async function ExperiencesPage() {
  const [experienceRows, galleryPool] = await Promise.all([
    getPublicExperiences(),
    getGalleryImagePool(),
  ]);

  const fallbackImages = pickImagesByCategory(galleryPool, 6, [
    "experiences",
    "events",
    "snow",
    "monsoon",
    "adventure",
  ]);

  const experiences = (experienceRows.length
    ? experienceRows
    : [
        {
          name: "Solang Valley",
          distance: "14 km",
          driveTime: "30 min",
          description:
            "Adventure hub for paragliding, zorbing, and skiing in winter. Stunning meadows surrounded by glacial peaks.",
          seasonTags: ["Summer", "Winter"],
          managedImageUrl: null,
        },
        {
          name: "Old Manali",
          distance: "8 km",
          driveTime: "20 min",
          description:
            "Charming village with cobblestone lanes, cozy cafés, artisan shops, and the historic Manu Temple.",
          seasonTags: ["Year-round"],
          managedImageUrl: null,
        },
      ])
    .slice(0, 6)
    .map((experience, index) => ({
      ...experience,
      imageUrl:
        resolveManagedImage(experience.managedImageUrl, galleryPool, [
          "experiences",
          "events",
          "adventure",
        ]) ?? fallbackImages[index]?.url ?? null,
    }));

  const heroImage = await resolveSlotOr(
    "experiences.hero",
    experiences[0]?.imageUrl ??
      resolveManagedImage(null, galleryPool, [
        "experiences",
        "events",
        "property",
      ])
  );

  return (
    <>
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden bg-[#0B1B22]">
        <ManagedImage src={heroImage} alt="Experiences near Ballu's" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B22] via-[#0B1B22]/40 to-[#0B1B22]/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <FadeUp>
            <p className="eyebrow mb-5">Beyond the Resort</p>
            <h1 className="heading-display text-[#F5EFE3] text-5xl md:text-7xl mb-4">
              The valley, at your doorstep
            </h1>
            <p className="heading-serif italic text-[#E5C97A] text-xl md:text-2xl max-w-2xl">
              Adventures for every season, moments away from your suite.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5EFE3] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp) => (
              <StaggerItem key={exp.name}>
                <article className="group">
                  <div className="relative aspect-[4/3] overflow-hidden mb-5">
                    <ManagedImage src={exp.imageUrl} alt={exp.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-[#C9A24B] mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.distance}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exp.driveTime}</span>
                  </div>
                  <h2 className="heading-serif text-2xl text-[#0B1B22] mb-2">{exp.name}</h2>
                  <p className="text-[#0B1B22]/70 text-sm leading-relaxed mb-3">{exp.description}</p>
                  <div className="flex gap-2">
                    {(exp.seasonTags || []).map((s) => (
                      <span key={s} className="text-[10px] uppercase tracking-[0.2em] text-[#1A6B7A] border border-[#1A6B7A]/30 px-2 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  );
}
