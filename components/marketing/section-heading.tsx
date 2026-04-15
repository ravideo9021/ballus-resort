import { FadeUp } from "@/components/motion/fade-up";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  headline,
  subhead,
  align = "center",
  dark = true,
  className,
}: SectionHeadingProps) {
  return (
    <FadeUp
      className={cn(
        align === "center" && "text-center",
        align === "center" && "max-w-3xl mx-auto",
        className
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2
        className={cn(
          "heading-display text-4xl md:text-5xl lg:text-6xl",
          dark ? "text-[#F5EFE3]" : "text-[#0B1B22]"
        )}
      >
        {headline}
      </h2>
      {subhead && (
        <p
          className={cn(
            "mt-5 text-base md:text-lg",
            dark ? "text-[#F5EFE3]/70" : "text-[#0B1B22]/70"
          )}
        >
          {subhead}
        </p>
      )}
    </FadeUp>
  );
}
