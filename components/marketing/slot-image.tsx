import { resolveSlotImage, type SiteSlotKey } from "@/lib/site-images";
import { ManagedImage } from "./managed-image";

type SlotImageProps = {
  slotKey: SiteSlotKey;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

/**
 * Server component. Resolves `<slotKey>` via DB override → public file fallback,
 * and renders via <ManagedImage /> (which shows a branded placeholder if both
 * are missing).
 */
export async function SlotImage({
  slotKey,
  alt,
  className,
  sizes,
  priority,
  fill,
  width,
  height,
}: SlotImageProps) {
  const resolved = await resolveSlotImage(slotKey);
  return (
    <ManagedImage
      src={resolved.url}
      alt={alt ?? resolved.alt}
      className={className}
      sizes={sizes}
      priority={priority}
      fill={fill}
      width={width}
      height={height}
    />
  );
}
