"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface KenBurnsImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export function KenBurnsImage({ src, alt, priority, className }: KenBurnsImageProps) {
  return (
    <motion.div
      className={`absolute inset-0 ${className || ""}`}
      initial={{ scale: 1 }}
      animate={{ scale: 1.08 }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
    </motion.div>
  );
}
