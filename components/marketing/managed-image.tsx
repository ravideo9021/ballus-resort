import Image from "next/image";
import { cn } from "@/lib/utils";

type ManagedImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

function Placeholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-[#0F3B47] to-[#0B1B22]",
        className
      )}
      aria-hidden="true"
    />
  );
}

export function ManagedImage({
  src,
  alt,
  className,
  sizes,
  priority,
  fill,
  width,
  height,
}: ManagedImageProps) {
  if (!src) {
    return fill ? (
      <Placeholder className={cn("absolute inset-0", className)} />
    ) : (
      <Placeholder className={className} />
    );
  }

  const isSvg = src.endsWith(".svg");

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
        unoptimized={isSvg}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1600}
      height={height ?? 900}
      priority={priority}
      sizes={sizes}
      className={className}
      unoptimized={isSvg}
    />
  );
}
