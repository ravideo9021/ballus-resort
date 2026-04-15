"use client";

import { useState } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GalleryImage {
  url: string;
  alt: string;
  caption?: string | null;
  category: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  categories: string[];
}

export function GalleryGrid({ images, categories }: GalleryGridProps) {
  const [filter, setFilter] = useState("All");
  const [index, setIndex] = useState(-1);

  const filtered =
    filter === "All" ? images : images.filter((img) => img.category === filter);

  const slides = filtered.map((img) => ({
    src: img.url,
    alt: img.alt,
    description: img.caption || undefined,
  }));

  const breakpoints = { default: 3, 1024: 3, 768: 2, 500: 1 };

  return (
    <>
      {/* Filter chips */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all border",
              filter === cat
                ? "bg-[#C9A24B] text-[#0B1B22] border-[#C9A24B]"
                : "bg-transparent text-[#F5EFE3]/60 border-white/10 hover:border-[#C9A24B] hover:text-[#C9A24B]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Masonry
            breakpointCols={breakpoints}
            className="flex w-auto -ml-4"
            columnClassName="pl-4 bg-clip-padding"
          >
            {filtered.map((img, i) => (
              <motion.button
                key={img.url + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 12) * 0.05 }}
                onClick={() => setIndex(i)}
                className="block mb-4 w-full group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  width={800}
                  height={800}
                  sizes="(max-width: 500px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#0B1B22]/0 group-hover:bg-[#0B1B22]/30 transition-colors" />
              </motion.button>
            ))}
          </Masonry>
        </motion.div>
      </AnimatePresence>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </>
  );
}
